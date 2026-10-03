"use client";

import { useEffect, useState } from "react";
import { leadCall } from "@/lib/content";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { Beats, Card, type PanelProps } from "./shared";
import styles from "../LeadCall.module.css";

// Step 1: the new lead lands in the CRM, then the dial time counts up.

function DialCount({ to }: { to: number }) {
  const reduce = useReducedMotionSafe();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1100);
      setValue(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, reduce]);
  return <span className={styles.dialNumber}>{(reduce ? to : value).toFixed(1)}s</span>;
}

export function CallPanel({ beat }: PanelProps) {
  const { title, lead, dialTitle, dialLabel, connected } = leadCall.crm;
  return (
    <Beats
      beat={beat}
      first={
        <Card title={title} aside={<span className={styles.label}>CRM</span>}>
          <div className={styles.leadRow}>
            <span className={styles.initials}>{lead.initials}</span>
            <span className={styles.leadText}>
              <span className={styles.leadName}>{lead.name}</span>
              <span className={styles.leadMeta}>{lead.meta}</span>
            </span>
            <span className={styles.now}>
              <span className={styles.nowDot} />
              {lead.age}
            </span>
          </div>
        </Card>
      }
      second={
        <Card title={dialTitle}>
          <div className={styles.dialRow}>
            <span className={styles.dialFigure}>
              <DialCount to={2} />
              <span className={styles.dialLabel}>{dialLabel}</span>
            </span>
            <span className={styles.live}>
              <span className={styles.liveDot} />
              {connected}
            </span>
          </div>
        </Card>
      }
    />
  );
}
