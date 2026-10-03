"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Orb } from "@/components/ui/Orb";
import styles from "./StatusPill.module.css";

const EASE = [0.44, 0, 0.56, 1] as const;

// The agent, as one ink pill: a single thinking-orbs orb ("composing" - the libraries.dev
// "Thinking..." pill) and a label naming what it is doing. In-progress labels (ending "…")
// shimmer; finished states ("Connected", "Booked") read solid.
export function StatusPill({ label, reduce }: { label: string; reduce: boolean }) {
  return (
    <div className={styles.pill}>
      <span className={styles.pillOrb}>
        <Orb state="composing" size={40} dark dotSize={1.15} />
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label}
          className={styles.pillLabel}
          data-done={!label.endsWith("…")}
          initial={reduce ? false : { opacity: 0, y: 4, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? undefined : { opacity: 0, y: -4, filter: "blur(4px)" }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
