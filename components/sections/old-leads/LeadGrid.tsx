"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, animate, useInView, useReducedMotion } from "framer-motion";
import { reveal, viewportOnce, easeOut } from "@/lib/animations";
import { oldLeads } from "@/lib/content";
import styles from "./OldLeads.module.css";

// The dot grid: 480 dots, a fixed ~5% lit blue as "you, by hand", the rest sweeping from
// grey to ink as "Metal Labs" during the fill phase. Loops idle -> fill -> hold -> reset
// while the section is on screen; the big number tracks the same clock. Pure CSS drives the
// per-dot transition (one data-phase attribute + a --i delay var), so only the counter text
// re-renders - the 480 dots never do.

const TOTAL = 480;
const HAND_COUNT = 24; // ~5%, matching "LOs reach about 4 to 6% of their database a month"

// Deterministic PRNG (mulberry32) so the "by hand" dots are the same on every render/visit -
// there's no server/client split to mismatch (this is a client component), but a fixed seed
// keeps the layout stable across reloads instead of reshuffling every mount.
function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HAND_INDEXES = (() => {
  const rng = mulberry32(1337);
  const set = new Set<number>();
  while (set.size < HAND_COUNT) set.add(Math.floor(rng() * TOTAL));
  return set;
})();

const DOT_KINDS: ("hand" | "agent")[] = Array.from({ length: TOTAL }, (_, i) =>
  HAND_INDEXES.has(i) ? "hand" : "agent",
);

type Phase = "idle" | "fill" | "hold" | "reset";
const NEXT_PHASE: Record<Phase, Phase> = { idle: "fill", fill: "hold", hold: "reset", reset: "idle" };
const DURATION_MS: Record<Phase, number> = { idle: 1200, fill: 2900, hold: 2400, reset: 400 };
const HAND_PCT = Math.round((HAND_COUNT / TOTAL) * 100);

type Focus = "untouched" | "hand" | "agent" | null;

export function LeadGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [display, setDisplay] = useState(HAND_PCT);
  const [focus, setFocus] = useState<Focus>(null);

  // Leaving the viewport snaps the phase back to idle so it replays from the start on return,
  // instead of resuming mid-sweep. Adjusting state directly during render (guarded so it's a
  // no-op once phase is already "idle") mirrors LeadCallStage's beat reset and avoids the
  // extra render-after-commit an effect-based reset would cost.
  if (!inView && phase !== "idle") setPhase("idle");

  // Advance the loop on a timer while the grid is in view.
  useEffect(() => {
    if (reduce || !inView) return;
    const id = setTimeout(() => setPhase((p) => NEXT_PHASE[p]), DURATION_MS[phase]);
    return () => clearTimeout(id);
  }, [phase, inView, reduce]);

  // The counter tracks the same clock: it ticks up through the fill, sits at 100, then eases
  // back down for the brief reset - mirroring StatCounter's animate()-driven count-up. Under
  // reduced motion the figure is just the static 100 rendered below; this effect never runs.
  useEffect(() => {
    if (reduce) return;
    if (phase === "fill") {
      const controls = animate(HAND_PCT, 100, {
        duration: DURATION_MS.fill / 1000,
        ease: "linear",
        onUpdate: (v) => setDisplay(Math.round(v)),
      });
      return () => controls.stop();
    }
    if (phase === "reset") {
      const controls = animate(100, HAND_PCT, {
        duration: DURATION_MS.reset / 1000,
        ease: easeOut,
        onUpdate: (v) => setDisplay(Math.round(v)),
      });
      return () => controls.stop();
    }
  }, [phase, reduce]);

  const dataPhase = reduce ? "hold" : phase;
  // "hold" and "idle" have one exact value each; only "fill" and "reset" are mid-tween, and
  // those are what the effect above's animate() calls drive through `display`.
  const shownValue = reduce || phase === "hold" ? 100 : phase === "idle" ? HAND_PCT : display;

  return (
    <motion.div
      ref={ref}
      className={styles.statRow}
      data-phase={dataPhase}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      variants={reveal}
    >
      <div className={styles.gridWrap}>
        <div
          aria-hidden
          className={styles.dotGrid}
          data-phase={dataPhase}
          data-focus={focus ?? undefined}
        >
          {DOT_KINDS.map((kind, i) => (
            <span key={i} className={styles.dot} data-kind={kind} style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
      </div>

      <div className={styles.statCol}>
        <p className={styles.statNumber}>
          <span aria-hidden className={`${styles.statFigure} font-heading font-light text-text`}>
            {shownValue}
          </span>
          <span className={`${styles.statSuffix} text-muted`}>{oldLeads.statSuffix}</span>
          <span className="sr-only">
            Loan officers reach about 4 to 6% of their database a month by hand. Metal Labs
            works 100% of it.
          </span>
        </p>

        <div className={styles.statMeta}>
          <ul className={styles.legend}>
            {(
              [
                ["untouched", styles.dotUntouched],
                ["hand", styles.dotHand],
                ["agent", styles.dotAgent],
              ] as const
            ).map(([key, swatchClass]) => (
              <li key={key}>
                <button
                  type="button"
                  className={`${styles.legendItem} text-text`}
                  data-active={focus === key}
                  onMouseEnter={() => setFocus(key)}
                  onMouseLeave={() => setFocus(null)}
                  onFocus={() => setFocus(key)}
                  onBlur={() => setFocus(null)}
                >
                  <span aria-hidden className={`${styles.legendSwatch} ${swatchClass}`} />
                  {oldLeads.legend[key]}
                </button>
              </li>
            ))}
          </ul>

          <p className={`${styles.note} text-muted`}>
            {oldLeads.note} <span className="text-muted-2">Source: {oldLeads.source}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
