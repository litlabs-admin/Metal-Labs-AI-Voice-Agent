"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { easeOut } from "@/lib/animations";

// Counts up 0 -> value once when scrolled into view. If value is null, renders the
// swappable "[STAT]" placeholder text so real numbers drop straight in later.
export function StatCounter({
  value,
  display,
  suffix = "",
  className,
}: {
  value: number | null;
  display: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [text, setText] = useState(value === null ? display : "0");

  useEffect(() => {
    if (value === null || !inView) return;
    // animate() updates via its async onUpdate callback (no synchronous setState).
    // With reduced motion we jump straight to the final value (duration 0).
    const controls = animate(0, value, {
      duration: reduce ? 0 : 1.4,
      ease: easeOut,
      onUpdate: (v: number) => setText(Math.round(v).toLocaleString()),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className={className}>
      {text}
      {value !== null ? suffix : ""}
    </span>
  );
}
