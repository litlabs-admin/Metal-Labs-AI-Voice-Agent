import { leadCall } from "@/lib/content";
import { Beats, Card, Tick, d, type PanelProps } from "./shared";
import styles from "../LeadCall.module.css";

// Step 2: the compliance checks tick in, then the qualifying answers type in.
export function PrequalPanel({ beat }: PanelProps) {
  return (
    <Beats
      beat={beat}
      first={
        <Card title={leadCall.checksTitle}>
          <div className={styles.checkGrid}>
            {leadCall.checks.map((c, i) => (
              <div key={c} className={`${styles.check} ${styles.enter}`} style={d(0.25 + i * 0.18)}>
                <Tick delay={0.35 + i * 0.18} />
                {c}
              </div>
            ))}
          </div>
        </Card>
      }
      second={
        <Card title={leadCall.questionsTitle}>
          <div className={styles.qaList}>
            {leadCall.questions.map(({ q, a }, i) => (
              <div key={q} className={`${styles.qa} ${styles.enter}`} style={d(0.2 + i * 0.4)}>
                <span className={styles.q}>{q}</span>
                <span className={styles.a} style={d(0.4 + i * 0.4, { "--n": a.length })}>
                  {a}
                </span>
              </div>
            ))}
          </div>
        </Card>
      }
    />
  );
}
