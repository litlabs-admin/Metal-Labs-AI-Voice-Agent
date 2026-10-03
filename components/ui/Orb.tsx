"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { MODE_DRAWS, resolvePreset, scaleCounts, scaleRadii, type OrbState } from "thinking-orbs";

// thinking-orbs (libraries.dev/orbs), painted crisp at any size. The package's <ThinkingOrb>
// only accepts its three tuned sizes (64/32/20); its engine is size-agnostic, so this draws
// the nearest tuned preset straight onto a canvas backed at size x devicePixelRatio. The loop
// mirrors the package's own: t = seconds x preset speed, paused offscreen and on hidden tabs,
// a single static frame under reduced motion.

type Props = {
  state?: OrbState;
  size: number;
  /** Light ink, for dark backgrounds. */
  dark?: boolean;
  /** Density multiplier over the preset. */
  dots?: number;
  /** Dot radius multiplier. */
  dotSize?: number;
  className?: string;
};

const nearestPreset = (size: number) => (size >= 36 ? 64 : size >= 26 ? 32 : 20);

export function Orb({ state = "composing", size, dark = false, dots = 1, dotSize = 1, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);

    const { mode, speed, opts: preset } = resolvePreset(state, nearestPreset(size));
    const opts = scaleRadii(scaleCounts(preset, dots), dotSize);
    const draw = MODE_DRAWS[mode];
    const paint = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      draw(ctx, size, t, dark, opts);
    };

    if (reduce) {
      paint(0.6);
      return;
    }

    let raf = 0;
    let visible = true;
    const loop = () => {
      paint((performance.now() / 1000) * speed);
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      if (visible && document.visibilityState !== "hidden") raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    paint((performance.now() / 1000) * speed);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [state, size, dark, dots, dotSize, reduce]);

  return (
    <canvas ref={ref} className={className} style={{ width: size, height: size }} aria-hidden="true" />
  );
}
