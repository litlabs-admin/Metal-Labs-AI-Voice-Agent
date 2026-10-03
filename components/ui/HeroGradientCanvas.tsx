"use client";

import { assets } from "@/lib/assets";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

// Hero background: the Metal Labs brand video with a bottom-to-top gradient +
// dark tint overlay (matches the legibility treatment of the previous WebGL
// hero) so the headline stays readable over any frame of the footage.
//
// Reduced motion swaps the video for its poster image. That choice changes which
// ELEMENT renders, so it must use the hydration-safe hook: framer-motion's
// useReducedMotion reads the media query on the first client render and would
// render <img> where the server sent <video>, failing hydration.
export function HeroGradientCanvas() {
  const reduce = useReducedMotionSafe();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {!reduce && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={assets.hero.poster}
          muted
          loop
          autoPlay
          playsInline
          aria-hidden
        >
          <source src={assets.hero.videoWebm} type="video/webm" />
          <source src={assets.hero.videoMp4} type="video/mp4" />
        </video>
      )}
      {reduce && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={assets.hero.poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/25 to-ink/45" />
    </div>
  );
}
