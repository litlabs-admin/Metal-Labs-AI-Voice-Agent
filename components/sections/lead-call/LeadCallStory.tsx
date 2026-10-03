"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { leadCall, CAL_LINK } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { StatusPill } from "@/components/ui/StatusPill";
import { BEATS_MS, LAST_BEAT } from "./panels/shared";
import { CallPanel } from "./panels/CallPanel";
import { PrequalPanel } from "./panels/PrequalPanel";
import { BookedPanel } from "./panels/BookedPanel";
import { TransferPanel } from "./panels/TransferPanel";
import styles from "./LeadCall.module.css";

// §3b story: numbered accordion (left) + illustration panel (right), after the Customer.io-style
// "Meet your AI Agent" pattern. Two clocks run here:
//   - STEP clock (autoplay): each step plays its `ms`, pausing on keyboard focus,
//     off-screen and hidden tabs, and resuming with the time it had left.
//   - BEAT clock: within a step, first card -> typing dots -> second card (BEATS_MS), which
//     also drives the agent pill's label.
// Under reduced motion there is no autoplay and every step opens on its final beat.

const STEPS = leadCall.steps;
const N = STEPS.length;
const PANELS = [CallPanel, PrequalPanel, BookedPanel, TransferPanel];

export function LeadCallStory({ copy }: { copy: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const Panel = PANELS[index];

  const rootRef = useRef<HTMLDivElement>(null);
  const seen = useInView(rootRef, { once: true, amount: 0.35 });
  const inView = useInView(rootRef, { amount: 0.2 });
  const reduce = useReducedMotionSafe();
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Beats belong to one step: reset during render (not in an effect) when the step changes.
  const [beatState, setBeatState] = useState({ index, beat: 0 });
  if (beatState.index !== index) setBeatState({ index, beat: 0 });
  const beat = reduce ? LAST_BEAT : beatState.index === index ? beatState.beat : 0;

  useEffect(() => {
    if (reduce || !seen) return;
    const ids = BEATS_MS.slice(1).map((at, i) =>
      window.setTimeout(() => setBeatState({ index, beat: i + 1 }), at),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [index, seen, reduce]);

  useEffect(() => {
    const sync = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const playing = !reduce && seen && inView && !keyboardFocus && !tabHidden;

  // Each step starts with its full duration; the timer effect banks time spent on teardown.
  const remaining = useRef(step.ms);
  useEffect(() => {
    remaining.current = STEPS[index].ms;
  }, [index]);

  useEffect(() => {
    if (!playing) return;
    const startedAt = performance.now();
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % N), Math.max(0, remaining.current));
    return () => {
      window.clearTimeout(id);
      remaining.current -= performance.now() - startedAt;
    };
  }, [playing, index]);

  const select = (i: number, focus = false) => {
    setIndex(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const by = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!by) return;
    e.preventDefault();
    select((index + by + N) % N, true);
  };

  const label = step.status[Math.min(beat, step.status.length - 1)];

  return (
    <div
      ref={rootRef}
      className={styles.inner}
    >
      <div className={styles.copy}>
        {copy}

        <Reveal>
          <div
            className={styles.steps}
            role="tablist"
            aria-orientation="vertical"
            aria-label="How the agent works a new lead"
            onKeyDown={onKeyDown}
            onFocus={(e) => setKeyboardFocus(e.target.matches(":focus-visible"))}
            onBlur={() => setKeyboardFocus(false)}
          >
            {STEPS.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`lc-tab-${s.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="lc-panel"
                  tabIndex={active ? 0 : -1}
                  className={styles.step}
                  onClick={() => select(i)}
                >
                  <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.stepTitle}>{s.title}</span>
                  <span className={styles.stepDescWrap}>
                    <span className={styles.stepDesc}>
                      <span className={styles.stepDescText}>{s.desc}</span>
                    </span>
                  </span>
                  {active && !reduce && (
                    <span
                      key={`${s.id}-${index}`}
                      className={styles.progress}
                      data-playing={playing}
                      style={{ "--ms": `${s.ms}ms` } as CSSProperties}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <a className={styles.cta} href={CAL_LINK} target="_blank" rel="noopener noreferrer">
            {leadCall.cta}
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div
          id="lc-panel"
          role="tabpanel"
          aria-labelledby={`lc-tab-${step.id}`}
          className={styles.panel}
        >
          <div className={styles.panelInner} aria-hidden="true">
            <StatusPill label={label} reduce={reduce} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step.id}
                style={{ display: "flex", width: "100%", justifyContent: "center" }}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.44, 0, 0.11, 1] }}
              >
                <Panel beat={beat} />
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="sr-only" aria-live={playing ? "off" : "polite"}>
            {`Step ${index + 1} of ${N}: ${step.title}. ${step.desc}`}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
