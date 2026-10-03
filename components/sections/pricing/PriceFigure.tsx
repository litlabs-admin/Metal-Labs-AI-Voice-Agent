"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { easeSlide } from "@/lib/animations";
import styles from "./Pricing.module.css";

// The plan price. Each digit rolls up out of its own mask when the card scrolls into view.
// The full figure is in the markup from the first render (crawlable, screen readers read it
// once via the sr-only copy); the rolled digits are presentational.

const parent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};

const digit: Variants = {
  hidden: { y: "105%" },
  visible: { y: "0%", transition: { duration: 0.7, ease: easeSlide } },
};

export function PriceFigure({
  currency,
  price,
  period,
}: {
  currency: string;
  price: string;
  period: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={styles.priceRow}>
      <span className="sr-only">{`${currency}${price} per month`}</span>
      <span aria-hidden className={`${styles.currency} font-heading font-light`}>
        {currency}
      </span>
      <motion.span
        aria-hidden
        className={`${styles.digits} font-heading font-light`}
        variants={parent}
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
      >
        {price.split("").map((d, i) => (
          <span key={i} className={styles.digitMask}>
            <motion.span className={styles.digit} variants={digit}>
              {d}
            </motion.span>
          </span>
        ))}
      </motion.span>
      <span aria-hidden className={styles.period}>
        {period}
      </span>
    </div>
  );
}
