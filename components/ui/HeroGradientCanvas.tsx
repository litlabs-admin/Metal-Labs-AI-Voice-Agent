"use client";

import { useReducedMotion } from "framer-motion";
import { assets } from "@/lib/assets";

// Hero background: the Metal Labs brand video with a bottom-to-top gradient +
// dark tint overlay (matches the legibility treatment of the previous WebGL
// hero) so the headline stays readable over any frame of the footage.
export function HeroGradientCanvas() {
  const reduce = useReducedMotion();

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
