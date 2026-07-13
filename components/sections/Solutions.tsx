"use client";

import { motion } from "framer-motion";
import LifecycleTabs from "./solutions/LifecycleTabs";
import styles from "./solutions/Solutions.module.css";

const EASE = [0.44, 0, 0.56, 1] as const;

/* ---- Section-heading word stagger — cinematic blur-focus reveal (same as Problem) ---- */
const headerContainer = {
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
function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <motion.span key={i} className={styles.word} variants={wordVariant}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </>
  );
}

export function Solutions() {
  return (
    <section
      className={styles.solutions}
      id="solutions"
      data-nav-theme="light"
      data-name="Solutions Section"
    >
      <div className={styles.container}>
        {/* Section heading */}
        <motion.div
          className={styles.header}
          variants={headerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        >
          <p className={styles.eyebrow}>Solutions</p>
          <h2 className={styles.heading}>
            <Words text="Built for the full borrower lifecycle." />
          </h2>
          <p className={styles.subheading}>
            <Words text="Two sides of your business. One platform." />
          </p>
        </motion.div>

        <LifecycleTabs />
      </div>
    </section>
  );
}
