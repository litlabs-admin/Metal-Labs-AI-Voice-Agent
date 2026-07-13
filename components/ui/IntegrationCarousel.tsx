"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  wrap,
} from "framer-motion";
import { cn } from "@/lib/cn";

// Channel/integration carousel: a row of app tiles that steps sideways one tile at a
// time while the Metal Labs hub tile sits fixed at dead-center, pulsing — every channel
// passing through the platform. Ported from the AgentLab reference (a Framer Slideshow,
// not a marquee): 1.5s per step, spring 200/40, tiles slide *behind* the hub.
const STEP = {
  type: "spring",
  stiffness: 200,
  damping: 40,
  mass: 1,
} as const;

// Tile pitch. Reference used 58px tiles / 23px gaps inside a 300px card; scaled up here
// because the row runs full-bleed.
const DESKTOP = { tile: 76, gap: 30 }; // same 0.4 gap:tile ratio as the reference (23/58)
const MOBILE = { tile: 56, gap: 22 };

export function IntegrationCarousel({
  icons,
  interval = 1.5,
  className,
}: {
  icons: string[];
  interval?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [{ tile, gap }, setSize] = useState(DESKTOP);
  const [viewport, setViewport] = useState(1440);

  useEffect(() => {
    const measure = () => {
      setViewport(window.innerWidth);
      setSize(window.innerWidth < 768 ? MOBILE : DESKTOP);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const pitch = tile + gap;
  const cycle = icons.length * pitch; // width of one full pass of the icon list
  // Shift the track left by whole cycles so it also covers the half-viewport to the left
  // of center, then repeat it enough times to cover the right half too.
  const cycles = Math.max(1, Math.ceil((viewport / 2 + pitch) / cycle));
  const base = -cycles * cycle;
  const tiles = useMemo(
    () =>
      Array.from(
        { length: (2 * cycles + 2) * icons.length },
        (_, i) => icons[i % icons.length],
      ),
    [cycles, icons],
  );

  const x = useMotionValue(base);
  // The track repeats every `cycle` px, so folding x into a one-cycle window is invisible
  // — that's what makes the loop seamless while `step` counts up forever.
  const loopedX = useTransform(x, (v) => wrap(base - cycle, base, v));

  const [step, setStep] = useState(0);
  const layout = useRef({ base, pitch });

  useEffect(() => {
    const target = base - step * pitch;
    // Resize (or reduced motion) → snap; a step → spring across.
    if (reduce || layout.current.base !== base || layout.current.pitch !== pitch) {
      layout.current = { base, pitch };
      x.jump(target);
      return;
    }
    const controls = animate(x, target, STEP);
    return () => controls.stop();
  }, [step, base, pitch, reduce, x]);

  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setStep((s) => s + 1), interval * 1000);
    return () => clearTimeout(id);
  }, [step, interval, reduce]);

  const hub = Math.round(tile * 1.36);

  return (
    <div
      className={cn("relative h-40 w-full overflow-hidden md:h-50", className)}
      aria-hidden="true"
      style={{
        // Longer fade than the shared .marquee-mask: the row is full-bleed, so the ends
        // need room to dissolve rather than hit a hard edge.
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%)",
      }}
    >
      {/* Sliding track. left-50% minus half a tile puts a tile boundary on the exact center. */}
      <motion.div
        className="absolute top-1/2 flex -translate-y-1/2"
        style={{ x: loopedX, left: "50%", marginLeft: -tile / 2, gap }}
      >
        {tiles.map((src, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center justify-center rounded-[5px] bg-white/[0.04] shadow-[0_3px_3px_0_rgba(0,0,0,0.04)]"
            style={{ width: tile, height: tile }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading="lazy"
              className="object-contain"
              style={{ width: tile * 0.52, height: tile * 0.52 }}
            />
          </div>
        ))}
      </motion.div>

      {/* The hub: opaque, centered, pulsing. Tiles pass behind it. */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 flex items-center justify-center rounded-[8px] border border-mint/55 shadow-[0_0_0_1px_rgba(98,246,181,0.12),0_0_38px_6px_rgba(98,246,181,0.28),inset_0_1px_0_rgba(255,255,255,0.07)]"
        style={{
          width: hub,
          height: hub,
          x: "-50%",
          y: "-50%",
          // Opaque, like the reference hub — tiles pass *behind* it, never through it.
          backgroundColor: "#0a0a0e",
          backgroundImage:
            "radial-gradient(120% 120% at 50% 0%, rgba(98,246,181,0.20) 0%, rgba(10,10,14,0) 62%)",
        }}
        animate={reduce ? undefined : { scale: [1, 1.1] }}
        transition={{
          duration: 0.75,
          ease: [0.12, 0.23, 0.5, 1],
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-mint"
          style={{ width: hub * 0.46, height: hub * 0.46 }}
        >
          <rect width="2.25" height="8.25" x="3.375" y="7.875" rx="1.125" />
          <rect width="2.25" height="20.25" x="7.125" y="1.875" rx="1.125" />
          <rect width="2.25" height="14.25" x="10.875" y="4.875" rx="1.125" />
          <rect width="2.25" height="8.25" x="14.625" y="7.875" rx="1.125" />
          <rect width="2.25" height="11.25" x="18.375" y="6.375" rx="1.125" />
        </svg>
      </motion.div>
    </div>
  );
}
