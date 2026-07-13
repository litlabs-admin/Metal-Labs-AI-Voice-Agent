"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

// Scroll-linked, word-by-word heading reveal — a port of the reference template's
// `WordColorScroll` code component.
//
// Each word is rendered twice, stacked: a muted base copy and an absolutely
// positioned active copy that is wiped in left-to-right with a clip-path inset.
// The wipe is driven directly by scroll position (no fade, no y-offset, no easing
// curve): word `i` maps to the [i/n, (i+1)/n] slice of the section's scroll range,
// so the "stagger" is implicit in the scroll mapping rather than a timed delay.
export function WordScrollReveal({
  text,
  className,
  defaultColor,
  activeColor,
  startOffset = 0.2,
  endOffset = 0.5,
}: {
  text: string;
  className?: string;
  defaultColor: string;
  activeColor: string;
  startOffset?: number;
  endOffset?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const words = text.split(" ");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [`start ${1 - startOffset}`, `end ${endOffset}`],
  });

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-center overflow-hidden"
    >
      <p
        className={cn("m-0 whitespace-pre-wrap break-words p-0 text-center", className)}
        style={{ color: reduce ? activeColor : undefined }}
      >
        {reduce
          ? text
          : words.map((word, i) => (
              <Word
                key={i}
                word={word}
                scrollYProgress={scrollYProgress}
                start={i / words.length}
                end={(i + 1) / words.length}
                defaultColor={defaultColor}
                activeColor={activeColor}
                isLast={i === words.length - 1}
              />
            ))}
      </p>
    </div>
  );
}

function Word({
  word,
  scrollYProgress,
  start,
  end,
  defaultColor,
  activeColor,
  isLast,
}: {
  word: string;
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
  defaultColor: string;
  activeColor: string;
  isLast: boolean;
}) {
  const progress = useTransform(scrollYProgress, [start, end], [0, 1]);
  const clipPath = useTransform(progress, (v) => `inset(0 ${100 - v * 100}% 0 0)`);
  const spacer = isLast ? "" : " ";

  return (
    <span className="relative inline-block">
      <span style={{ color: defaultColor }}>{word + spacer}</span>
      <motion.span
        aria-hidden
        className="absolute left-0 top-0"
        style={{ color: activeColor, clipPath }}
      >
        {word + spacer}
      </motion.span>
    </span>
  );
}
