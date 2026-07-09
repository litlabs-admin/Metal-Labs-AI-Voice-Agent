"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { reveal, staggerParent, staggerChild, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/cn";

// Section-entry fade + translate-up. Honors prefers-reduced-motion.
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "span" | "h1" | "h2" | "p";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      variants={reveal}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

// Parent that staggers reveal of its <RevealItem> children.
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerParent(stagger)}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={cn(className)} variants={staggerChild}>
      {children}
    </motion.div>
  );
}
