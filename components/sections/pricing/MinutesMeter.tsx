"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { easeOut } from "@/lib/animations";
import styles from "./Pricing.module.css";

// Included-minutes bar. Fills left to right once, on view. It reads as "your allowance",
// not usage, so it always ends full. The track (full size) is what's observed - the fill starts
// at scaleX(0), which has no visible area for the IntersectionObserver to measure.

const fill: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, delay: 0.35, ease: easeOut } },
};

export function MinutesMeter({ label }: { label: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={styles.meter}>
      <span className={`${styles.receiptLabel} font-illustration font-medium uppercase`}>{label}</span>
      <motion.span
        aria-hidden
        className={styles.meterTrack}
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.span className={styles.meterFill} variants={fill} />
      </motion.span>
    </div>
  );
}
