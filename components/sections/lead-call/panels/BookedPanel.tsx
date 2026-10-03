import { leadCall } from "@/lib/content";
import { Beats, Card, Tick, d, type PanelProps } from "./shared";
import styles from "../LeadCall.module.css";

// Step 3: the lead is qualified, then the call drops onto the LO's calendar.
export function BookedPanel({ beat }: PanelProps) {
  const { qualified, calendar } = leadCall;
  return (
    <Beats
      beat={beat}
      first={
        <Card
          title={qualified.title}
          aside={
            <span className={styles.badge}>
              <svg viewBox="0 0 10 10" width="11" height="11" fill="none">
                <path d="M1.8 5.2l2.1 2.1 4.3-4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          }
        >
          <div className={styles.chips}>
            {qualified.chips.map((c, i) => (
              <span key={c} className={`${styles.chip} ${styles.enter}`} style={d(0.25 + i * 0.12)}>
                {c}
              </span>
            ))}
          </div>
        </Card>
      }
      second={
        <Card title={calendar.source} aside={<span className={styles.label}>{calendar.day}</span>}>
          <div className={styles.event} style={d(0.3)}>
            <span className={styles.eventTitle}>{calendar.event.title}</span>
            <span className={styles.eventDetail}>{calendar.event.detail}</span>
          </div>
          <p className={`${styles.confirm} ${styles.enter}`} style={d(0.75)}>
            <Tick delay={0.85} mint />
            {calendar.confirm}
          </p>
        </Card>
      }
    />
  );
}
