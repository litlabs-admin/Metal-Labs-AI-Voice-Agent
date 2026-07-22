"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Cinematic blur-focus word reveal used by every section heading (Solutions, Integrations,
// Built for Mortgage, Compliance). Wrap a heading block in <WordRevealGroup> and render each
// line of copy through <Words text="..." /> so the whole block staggers as one sequence.

const EASE = [0.44, 0, 0.56, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.024 } },
};

const wordVariant = {
  hidden: { opacity: 0.001, y: 14, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE },
  },
};

export function WordRevealGroup({
  children,
  className,
  amount = 0.5,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={container}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block whitespace-pre will-change-[transform,opacity,filter]"
          variants={wordVariant}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </>
  );
}
