"use client";

import { useId } from "react";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/cn";
import styles from "./Pricing.module.css";

// One rule row. The whole row is the switch (role="switch"), so it is one tab stop and the hit
// area is the full card; the track on the right is purely visual.
export function RuleSwitch({
  title,
  detail,
  on,
  active,
  knobTransition,
  onToggle,
  onActivate,
  onDeactivate,
}: {
  title: string;
  detail: string;
  on: boolean;
  active: boolean;
  knobTransition: Transition;
  onToggle: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const titleId = useId();
  const detailId = useId();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={titleId}
      aria-describedby={detailId}
      onClick={onToggle}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className={cn(styles.rule, active && styles.ruleActive)}
    >
      <span className={styles.rowText}>
        <span id={titleId} className={`${styles.rowTitle} font-heading text-text`}>
          {title}
        </span>
        <span id={detailId} className={`${styles.rowDetail} text-muted`}>
          {detail}
        </span>
      </span>

      <span aria-hidden className={styles.track}>
        <span className={styles.trackOn} style={{ opacity: on ? 1 : 0 }} />
        <motion.span
          className={styles.knob}
          initial={false}
          animate={{ x: on ? 18 : 0 }}
          transition={knobTransition}
        />
      </span>
    </button>
  );
}
