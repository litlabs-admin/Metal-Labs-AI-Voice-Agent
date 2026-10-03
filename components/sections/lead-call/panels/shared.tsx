import type { CSSProperties, ReactNode } from "react";
import styles from "../LeadCall.module.css";

/** Inline entrance delay (seconds) for the module's timed keyframes, plus any extra vars. */
export const d = (seconds: number, vars: Record<string, string | number> = {}) =>
  ({ "--d": `${seconds}s`, ...vars }) as CSSProperties;

/** Beats every panel plays: 0 = first card, 1 = typing dots, 2 = second card. */
export const BEATS_MS = [0, 1000, 2000];
export const LAST_BEAT = BEATS_MS.length - 1;

export type PanelProps = { beat: number };

export function Card({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <p className={styles.cardTitle}>{title}</p>
        {aside}
      </div>
      {children}
    </div>
  );
}

export function TypingDots() {
  return (
    <span className={styles.dots}>
      <i />
      <i />
      <i />
    </span>
  );
}

/** Round check that pops in, then draws its stroke. Ink by default, mint for "done". */
export function Tick({ delay = 0, mint = false }: { delay?: number; mint?: boolean }) {
  return (
    <span className={`${styles.tick} ${mint ? styles.tickMint : ""}`} style={d(delay)}>
      <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
        <path
          d="M1.8 5.2l2.1 2.1 4.3-4.6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
        />
      </svg>
    </span>
  );
}

/** A step's two cards with the typing indicator between them, revealed by beat. */
export function Beats({ beat, first, second }: { beat: number; first: ReactNode; second: ReactNode }) {
  return (
    <div className={styles.stack}>
      {first}
      {beat === 1 && <TypingDots />}
      {beat >= 2 && second}
    </div>
  );
}
