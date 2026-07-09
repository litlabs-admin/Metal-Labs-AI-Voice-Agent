"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { assets } from "@/lib/assets";

// Reproduces the Vapi hero background: a WebGL2 fragment shader that samples two looping
// .webm videos and crossfades them, with a glass-edge warp + gradient/tint overlays baked
// in (DESIGN_AUDIT.md §3). Falls back to the plain video / poster when WebGL2 or motion
// is unavailable.

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_texA;
uniform sampler2D u_texB;
uniform float u_opacity;
out vec4 outColor;

const float EDGE_BAND = 0.05;
const float MAX_DISP = 0.0125;
const float GRAD_TOP = 0.15;
const float GRAD_BOTTOM = 0.45;
const float TINT = 0.18;

vec2 edgeDisp(vec2 uv) {
  vec2 d = vec2(0.0);
  float l = uv.x, r = 1.0 - uv.x, b = uv.y, t = 1.0 - uv.y;
  if (l < EDGE_BAND) d.x += (1.0 - l / EDGE_BAND) * MAX_DISP;
  if (r < EDGE_BAND) d.x -= (1.0 - r / EDGE_BAND) * MAX_DISP;
  if (b < EDGE_BAND) d.y += (1.0 - b / EDGE_BAND) * MAX_DISP;
  if (t < EDGE_BAND) d.y -= (1.0 - t / EDGE_BAND) * MAX_DISP;
  return d;
}

void main() {
  vec2 uv = v_uv + edgeDisp(v_uv);
  vec3 a = texture(u_texA, uv).rgb;
  vec3 b = texture(u_texB, uv).rgb;
  vec3 col = mix(a, b, clamp(u_opacity, 0.0, 1.0));
  float g = mix(GRAD_TOP, GRAD_BOTTOM, 1.0 - v_uv.y);
  col *= (1.0 - g);
  col *= (1.0 - TINT);
  outColor = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

export function HeroGradientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!canvas || !videoA || !videoB) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) return; // fallback: the <video> layer stays visible
    // Capture non-null consts so hoisted closures keep the narrowed types.
    const g: WebGL2RenderingContext = gl;
    const cv: HTMLCanvasElement = canvas;
    const vA: HTMLVideoElement = videoA;
    const vB: HTMLVideoElement = videoB;

    canvas.style.opacity = "1";
    void videoA.play().catch(() => {});
    void videoB.play().catch(() => {});

    const prog = g.createProgram()!;
    g.attachShader(prog, compile(g, g.VERTEX_SHADER, VERT));
    g.attachShader(prog, compile(g, g.FRAGMENT_SHADER, FRAG));
    g.bindAttribLocation(prog, 0, "a_pos");
    g.linkProgram(prog);
    g.useProgram(prog);

    const buf = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(
      g.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      g.STATIC_DRAW,
    );
    g.enableVertexAttribArray(0);
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);

    function makeTex(unit: number) {
      const tex = g.createTexture();
      g.activeTexture(g.TEXTURE0 + unit);
      g.bindTexture(g.TEXTURE_2D, tex);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
      return tex;
    }
    const texA = makeTex(0);
    const texB = makeTex(1);
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true);
    g.uniform1i(g.getUniformLocation(prog, "u_texA"), 0);
    g.uniform1i(g.getUniformLocation(prog, "u_texB"), 1);
    const uOpacity = g.getUniformLocation(prog, "u_opacity");

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(cv.clientWidth * dpr);
      const h = Math.floor(cv.clientHeight * dpr);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        g.viewport(0, 0, w, h);
      }
    }

    let raf = 0;
    function upload(video: HTMLVideoElement, unit: number, tex: WebGLTexture | null) {
      if (video.readyState < 2) return;
      g.activeTexture(g.TEXTURE0 + unit);
      g.bindTexture(g.TEXTURE_2D, tex);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, video);
    }
    function frame() {
      resize();
      upload(vA, 0, texA);
      upload(vB, 1, texB);
      g.uniform1f(uOpacity, 0); // pre-call ambient state (video A)
      g.drawArrays(g.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }
    frame();

    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Video fallback layer (also the source for the shader). Visible if WebGL2 fails. */}
      <video
        ref={videoARef}
        className="absolute inset-0 h-full w-full object-cover"
        src={assets.hero.videoA}
        poster={assets.hero.poster}
        muted
        loop
        autoPlay
        playsInline
        aria-hidden
      />
      <video
        ref={videoBRef}
        className="absolute inset-0 h-full w-full object-cover opacity-0"
        src={assets.hero.videoB}
        muted
        loop
        autoPlay
        playsInline
        aria-hidden
      />
      {/* Shader output paints over the videos once WebGL2 is ready. */}
      {!reduce && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500"
          aria-hidden
        />
      )}
    </div>
  );
}
