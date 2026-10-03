"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, useState, useSyncExternalStore } from "react";
import { easeSlide, staggerChild } from "@/lib/animations";
import { cn } from "@/lib/cn";
import styles from "../FAQ.module.css";

// One FAQ row. Pointer devices: the whole row (question + answer) is the hover target, so moving
// down into the answer keeps it open; keyboard focus opens it too. Touch devices can't hover, so a
// tap on the question toggles it instead.

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(HOVER_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function useCanHover() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => true,
  );
}

export function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const canHover = useCanHover();
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [toggled, setToggled] = useState(false);
  const open = canHover ? hovered || focused : toggled;

  const id = useId();
  const panelId = `${id}-panel`;
  const t = (duration: number) => (reduce ? { duration: 0 } : { duration, ease: easeSlide });

  return (
    <motion.div
      variants={staggerChild}
      className={cn(styles.item, "relative border-b border-black/10")}
      onMouseEnter={() => canHover && setHovered(true)}
      onMouseLeave={() => canHover && setHovered(false)}
    >
      {/* Row tint - fades in behind the open row. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cream-2/50"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={t(0.4)}
      />
      {/* Accent rule - grows down the left edge from the top. */}
      <motion.span
        aria-hidden
        className={styles.accent}
        initial={false}
        animate={{ scaleY: open ? 1 : 0 }}
        transition={t(0.5)}
      />

      <h3 className="relative m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          className={cn(styles.trigger, "cursor-pointer text-left")}
          onClick={() => !canHover && setToggled((v) => !v)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <motion.span
            className={cn(styles.question, "font-heading text-text")}
            initial={false}
            animate={{ x: open ? 8 : 0 }}
            transition={t(0.45)}
          >
            {question}
          </motion.span>

          <motion.span
            aria-hidden
            className={styles.icon}
            initial={false}
            animate={{
              rotate: open ? 135 : 0,
              backgroundColor: open ? "#0036fa" : "rgba(0,54,250,0)",
              borderColor: open ? "#0036fa" : "rgba(0,0,0,0.12)",
              color: open ? "#ffffff" : "#09090b",
            }}
            transition={t(0.45)}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.span>
        </button>
      </h3>

      <motion.div
        id={panelId}
        role="region"
        aria-hidden={!open}
        className="relative overflow-hidden"
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={t(0.5)}
      >
        <motion.p
          className={cn(styles.answer, "text-muted")}
          initial={false}
          animate={
            open
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: -6, filter: "blur(6px)" }
          }
          transition={reduce ? { duration: 0 } : { duration: 0.45, ease: easeSlide, delay: open ? 0.08 : 0 }}
        >
          {answer}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
