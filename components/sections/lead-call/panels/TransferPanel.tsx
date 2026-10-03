import { leadCall } from "@/lib/content";
import { Beats, Card, type PanelProps } from "./shared";
import styles from "../LeadCall.module.css";

const AGENT_BADGE = "/brand/logo.png";

// Step 4: the line runs from the agent to you with a packet travelling along it; once the
// brief lands the call is connected - the packet stops and your avatar rings out.
export function TransferPanel({ beat }: PanelProps) {
  const { transfer, brief } = leadCall;
  const connected = beat >= 2;
  return (
    <Beats
      beat={beat}
      first={
        <div className={styles.card}>
          <div className={styles.handoff}>
            <span className={styles.party}>
              <span className={styles.avatar}>
                {/* eslint-disable-next-line @next/next/no-img-element -- decorative badge inside an aria-hidden illustration */}
                <img src={AGENT_BADGE} alt="" width={36} height={36} />
              </span>
              {transfer.agent}
            </span>
            <span className={styles.line}>
              <span className={styles.lineFill} />
              {!connected && <span className={styles.packet} />}
              {connected && (
                <span className={`${styles.live} ${styles.lineTag} ${styles.enter}`}>
                  <span className={styles.liveDot} />
                  {transfer.connected}
                </span>
              )}
            </span>
            <span className={styles.party}>
              <span className={`${styles.avatar} ${styles.avatarYou}`} data-on={connected}>
                {transfer.you}
              </span>
              {transfer.lo}
            </span>
          </div>
        </div>
      }
      second={
        <Card title={brief.title}>
          <p className={styles.briefName}>{brief.name}</p>
          <p className={styles.briefText}>{brief.text}</p>
        </Card>
      }
    />
  );
}
