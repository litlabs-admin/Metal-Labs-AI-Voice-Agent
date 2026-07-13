"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate as animateValue,
} from "framer-motion";
import styles from "./Solutions.module.css";

const EASE = [0.44, 0, 0.56, 1] as const;
const SPRING_EASE = [0.22, 1, 0.36, 1] as const;

/* Dwell times for the working → done → working loop. `done` holds longer so the
   resolved state (the point of each illustration) is what the eye lands on. */
const WORK_MS = 1900;
const DONE_MS = 3400;
const STAGGER_MS = 280;

/* Shared motion state for an illustration.

   `active` is the illustration's "work finished" state. It cycles on a slow loop
   so the cards read as live systems rather than frozen screenshots, and hovering
   a card snaps it to the resolved state on demand. The loop only runs while the
   card is on screen, and reduced-motion pins everything to the resolved state. */
function useMockupMotion(hovered: boolean, index = 0) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [cycled, setCycled] = useState(false);

  useEffect(() => {
    if (reduce || !inView) return;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    const schedule = (next: boolean, wait: number) => {
      timer = setTimeout(() => {
        if (stopped) return;
        setCycled(next);
        schedule(!next, next ? DONE_MS : WORK_MS);
      }, wait);
    };
    schedule(true, 500 + index * STAGGER_MS);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [reduce, inView, index]);

  const loop = !reduce && inView;
  return { ref, active: reduce ? true : hovered || cycled, loop, inView };
}

/* Rotating index - used where the illustration walks through a list. */
function useStep(count: number, ms: number, run: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setI((p) => (p + 1) % count), ms);
    return () => clearInterval(id);
  }, [count, ms, run]);
  return run ? i : 0;
}

/* ============================================================
   Shared shell - light card surface + an in-view entrance on the
   inner content, plus a slow ambient sheen across the panel.
   ============================================================ */
function Illustration({
  children,
  rootRef,
}: {
  children: React.ReactNode;
  rootRef?: React.Ref<HTMLDivElement>;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={styles.mockup} ref={rootRef}>
      <motion.div
        className={styles.mockupInner}
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ---- Small shared primitives ---- */

function Check({ ticked }: { ticked: boolean }) {
  return (
    <span className={[styles.checkbox, ticked ? styles.checkboxOn : ""].join(" ").trim()}>
      {ticked && (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <motion.path
            d="M2.5 6.2 4.8 8.5 9.5 3.5"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
          />
        </svg>
      )}
    </span>
  );
}

function LiveDot({ loop }: { loop: boolean }) {
  return (
    <motion.span
      className={styles.liveDot}
      animate={loop ? { scale: [1, 1.4, 1], opacity: [1, 0.45, 1] } : {}}
      transition={loop ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined}
    />
  );
}

function Waveform({ active, loop }: { active: boolean; loop: boolean }) {
  // Peak heights as a fraction of the bar's full height - scaleY keeps every
  // bar inside the container so they can never overflow into the row above.
  const peaks = [0.35, 0.55, 0.85, 0.45, 0.7, 0.3, 0.6, 0.95, 0.4, 0.65, 0.5, 0.8];
  return (
    <div className={styles.wave} style={{ opacity: active ? 1 : 0.85 }}>
      {peaks.map((p, i) => (
        <motion.span
          key={i}
          className={styles.waveBar}
          animate={loop ? { scaleY: [p * 0.4, p, p * 0.4] } : { scaleY: p }}
          transition={
            loop
              ? { duration: 0.85, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }
              : { duration: 0 }
          }
        />
      ))}
    </div>
  );
}

function Typing({ loop }: { loop: boolean }) {
  return (
    <span className={styles.typing} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={styles.typingDot}
          animate={loop ? { y: [0, -4, 0], opacity: [0.35, 1, 0.35] } : { opacity: 0.6 }}
          transition={
            loop
              ? { duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }
              : undefined
          }
        />
      ))}
    </span>
  );
}

/* Counts up once, the first time the card scrolls into view - it never runs
   backwards, so the loop can't turn a headline figure into a yo-yo. */
function CountUp({
  to,
  run,
  format,
}: {
  to: number;
  run: boolean;
  format: (n: number) => string;
}) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => format(v));
  useEffect(() => {
    if (!run) return;
    const controls = animateValue(mv, to, { duration: 1.1, ease: SPRING_EASE });
    return controls.stop;
  }, [run, to, mv]);
  return <motion.span>{text}</motion.span>;
}

/* Progress bar with a sheen that sweeps while work is in flight. */
function Progress({ pct, working }: { pct: number; working: boolean }) {
  return (
    <div className={styles.progressBar}>
      <motion.span
        className={[styles.progressFill, working ? styles.progressFillLive : ""].join(" ").trim()}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: SPRING_EASE }}
      />
    </div>
  );
}

const reveal = (active: boolean, delay = 0) => ({
  animate: active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.96 },
  transition: { duration: 0.45, ease: SPRING_EASE, delay: active ? delay : 0 },
});

type IlloProps = { hovered: boolean; index: number };

/* ============================================================
   1 - Inbound lead qualification
   ============================================================ */
function Inbound({ hovered, index }: IlloProps) {
  const { ref, active, loop } = useMockupMotion(hovered, index);
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.illoRow}>
          <span className={styles.avatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/solutions/avatar-1.png" alt="" width={36} height={36} />
          </span>
          <div className={styles.userText}>
            <span className={styles.userName}>Cassy Morgan</span>
            <span className={styles.userRole}>New inbound lead</span>
          </div>
          <span className={styles.liveTag}>
            <LiveDot loop={loop} /> Live
          </span>
        </div>
        <Waveform active={active} loop={loop} />
        <div className={styles.statusRow}>
          <span
            className={[styles.statusPill, active ? styles.statusPillDone : ""].join(" ").trim()}
          >
            {active ? (
              <>
                <Check ticked /> Qualified
              </>
            ) : (
              <>
                <span className={styles.spinner} /> Qualifying…
              </>
            )}
          </span>
        </div>
      </div>
      <motion.div className={styles.bookedChip} {...reveal(active, 0.15)}>
        <span className={styles.bookedIcon}>📞</span>
        <span>LO call booked</span>
        <span className={styles.bookedTime}>0:03s</span>
      </motion.div>
    </Illustration>
  );
}

/* ============================================================
   2 - Outbound lead calling
   ============================================================ */
function Outbound({ hovered, index }: IlloProps) {
  const { ref, loop } = useMockupMotion(hovered, index);
  const rows = ["Aged lead · Jan ’23", "CRM contact #4821", "Purchased list"];
  // The dialer walks the list: one line lands, the next is ringing, the rest wait.
  const at = useStep(rows.length, 2200, loop);
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        {rows.map((name, i) => {
          const connected = i === at;
          const dialing = i === (at + 1) % rows.length;
          return (
            <div key={name} className={styles.dialRow}>
              <span
                className={[
                  styles.dialDot,
                  connected ? styles.dialDotOn : "",
                  dialing ? styles.dialDotRing : "",
                ]
                  .join(" ")
                  .trim()}
              >
                {dialing && loop && (
                  <motion.span
                    className={styles.dialPing}
                    animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </span>
              <span className={styles.dialName}>{name}</span>
              {connected ? (
                <motion.span
                  className={styles.handoffTag}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: SPRING_EASE }}
                >
                  → Handed off
                </motion.span>
              ) : (
                <span className={styles.dialState}>{dialing ? "Dialing…" : "Queued"}</span>
              )}
            </div>
          );
        })}
      </div>
    </Illustration>
  );
}

/* ============================================================
   3 - Document collection
   ============================================================ */
function Documents({ hovered, index }: IlloProps) {
  const { ref, active, loop } = useMockupMotion(hovered, index);
  const docs = [
    { name: "Bank statement", always: true },
    { name: "Photo ID", always: true },
    { name: "Pay stub", always: false },
  ];
  const done = docs.filter((d) => d.always || active).length;
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.docHead}>
          <span className={styles.userName}>Documents</span>
          <span className={styles.docCount}>
            {done} of {docs.length}
          </span>
        </div>
        <div className={styles.docList}>
          {docs.map((d) => (
            <div key={d.name} className={styles.docItem}>
              <Check ticked={d.always || active} />
              <span className={styles.docName}>{d.name}</span>
              {!d.always && !active && (
                <motion.span
                  className={[styles.acctBadge, styles.acctBadgeWarn, styles.docItemBadge].join(" ")}
                  animate={loop ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
                  transition={
                    loop ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined
                  }
                >
                  Chasing
                </motion.span>
              )}
            </div>
          ))}
        </div>
        <Progress pct={(done / docs.length) * 100} working={!active} />
      </div>
      <div className={styles.channelChips}>
        {["Voice", "Text", "Email"].map((c, i) => (
          <motion.span
            key={c}
            className={styles.channelChip}
            animate={loop ? { opacity: [0.55, 1, 0.55] } : { opacity: 1 }}
            transition={
              loop
                ? { duration: 2.1, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }
                : undefined
            }
          >
            {c}
          </motion.span>
        ))}
      </div>
    </Illustration>
  );
}

/* ============================================================
   4 - After-hours support
   ============================================================ */
function AfterHours({ hovered, index }: IlloProps) {
  const { ref, active, loop } = useMockupMotion(hovered, index);
  return (
    <Illustration rootRef={ref}>
      <div className={styles.afterRow}>
        <div className={styles.clock}>
          <span className={styles.clockTick} style={{ top: 4 }} />
          <span className={styles.clockTick} style={{ bottom: 4 }} />
          <span className={styles.clockTick} style={{ left: 4 }} />
          <span className={styles.clockTick} style={{ right: 4 }} />
          <motion.span
            className={styles.clockHand}
            animate={loop ? { rotate: 360 } : { rotate: 220 }}
            transition={loop ? { duration: 8, repeat: Infinity, ease: "linear" } : undefined}
          />
          <span className={styles.clockHub} />
        </div>
        <div className={styles.afterText}>
          <span className={styles.badge247}>
            <LiveDot loop={loop} /> 24/7 online
          </span>
          <span className={styles.userRole}>Inbound calls &amp; texts</span>
        </div>
      </div>
      <div className={styles.subCard}>
        <div className={[styles.bubble, styles.bubbleIn].join(" ")}>Are you open right now?</div>
        {active ? (
          <motion.div
            className={[styles.bubble, styles.bubbleOut].join(" ")}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: SPRING_EASE }}
          >
            Always, let&apos;s get you started.
          </motion.div>
        ) : (
          <div className={[styles.bubble, styles.bubbleOut, styles.bubbleTyping].join(" ")}>
            <Typing loop={loop} />
          </div>
        )}
      </div>
    </Illustration>
  );
}

/* ============================================================
   5 - Website chat
   ============================================================ */
function Chat({ hovered, index }: IlloProps) {
  const { ref, active, loop } = useMockupMotion(hovered, index);
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={[styles.bubble, styles.bubbleIn].join(" ")}>
          What rates can I get today?
        </div>
        {active ? (
          <motion.div
            className={[styles.bubble, styles.bubbleOut].join(" ")}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: SPRING_EASE }}
          >
            From 6.1% APR, want me to check yours?
          </motion.div>
        ) : (
          <div className={[styles.bubble, styles.bubbleOut, styles.bubbleTyping].join(" ")}>
            <Typing loop={loop} />
          </div>
        )}
        <motion.button className={styles.ctaChip} {...reveal(active, 0.22)}>
          Book a call →
        </motion.button>
      </div>
    </Illustration>
  );
}

/* ============================================================
   6 - Payment reminders
   ============================================================ */
function Payments({ hovered, index }: IlloProps) {
  const { ref, active, loop } = useMockupMotion(hovered, index);
  const cells = Array.from({ length: 14 }, (_, i) => i + 6);
  const due = 12;
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.docHead}>
          <span className={styles.userName}>Payment due</span>
          <span className={styles.userRole}>Mar {due}</span>
        </div>
        <div className={styles.calGrid}>
          {cells.map((c) => {
            const isDue = c === due;
            return (
              <span
                key={c}
                className={[styles.calCell, isDue ? styles.calDue : ""].join(" ").trim()}
              >
                {isDue && loop && (
                  <motion.span
                    className={styles.calPing}
                    animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                {c}
              </span>
            );
          })}
        </div>
      </div>
      <div className={styles.payFooter}>
        <div className={styles.channelChips}>
          {["Voice", "Text", "Email"].map((c, i) => (
            <motion.span
              key={c}
              className={styles.channelChip}
              animate={loop ? { opacity: [0.55, 1, 0.55] } : { opacity: 1 }}
              transition={
                loop
                  ? { duration: 2.1, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" }
                  : undefined
              }
            >
              {c}
            </motion.span>
          ))}
        </div>
        <motion.span className={styles.paidPill} {...reveal(active, 0.1)}>
          <Check ticked /> Paid
        </motion.span>
      </div>
    </Illustration>
  );
}

/* ============================================================
   7 - Delinquency outreach
   ============================================================ */
function Delinquency({ hovered, index }: IlloProps) {
  const { ref, active, loop } = useMockupMotion(hovered, index);
  const steps = ["Apr", "May", "Jun"];
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.illoRow}>
          <div className={styles.userText}>
            <span className={styles.userName}>Account #2048</span>
            <span className={styles.userRole}>Outreach status</span>
          </div>
          {active ? (
            <motion.span
              className={[styles.acctBadge, styles.acctBadgeOk].join(" ")}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: SPRING_EASE }}
            >
              On plan
            </motion.span>
          ) : (
            <motion.span
              className={[styles.acctBadge, styles.acctBadgeWarn].join(" ")}
              animate={loop ? { opacity: [1, 0.55, 1] } : {}}
              transition={loop ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined}
            >
              Delinquent
            </motion.span>
          )}
        </div>
        <p className={styles.planLabel}>Payment plan</p>
        <div className={styles.planSteps}>
          {steps.map((s, i) => (
            <motion.div
              key={s}
              className={styles.planStep}
              animate={{
                backgroundColor: active ? "#0e0e13" : "rgba(0,0,0,0.06)",
                color: active ? "#ffffff" : "rgba(53,53,53,0.6)",
              }}
              transition={{ duration: 0.4, delay: active ? i * 0.12 : 0, ease: EASE }}
            >
              {s}
            </motion.div>
          ))}
        </div>
        <div className={styles.toggleRow}>
          <span className={styles.permName}>Escalate to human</span>
          <span className={styles.toggle}>
            <span className={styles.toggleKnob} />
          </span>
        </div>
      </div>
    </Illustration>
  );
}

/* ============================================================
   8 - Collections
   ============================================================ */
function Collections({ hovered, index }: IlloProps) {
  const { ref, active, inView } = useMockupMotion(hovered, index);
  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.docHead}>
          <span className={styles.userRole}>Recovered this month</span>
          <span className={styles.shieldChip}>
            <svg width="11" height="12" viewBox="0 0 12 13" fill="none" aria-hidden="true">
              <path
                d="M6 1 10.5 2.6V6c0 3-2 4.7-4.5 5.8C3 10.7 1.5 9 1.5 6V2.6L6 1Z"
                fill="currentColor"
                opacity="0.18"
              />
              <path
                d="M6 1 10.5 2.6V6c0 3-2 4.7-4.5 5.8C3 10.7 1.5 9 1.5 6V2.6L6 1Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              <path
                d="M4.2 6.3 5.5 7.6 8 4.9"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            FDCPA compliant
          </span>
        </div>
        <span className={styles.recoverAmount}>
          <CountUp to={1284500} run={inView} format={fmt} />
        </span>
        <Progress pct={active ? 82 : 58} working={!active} />
      </div>
      <motion.div className={styles.bookedChip} {...reveal(active, 0.18)}>
        <span className={styles.bookedIcon}>🤝</span>
        <span>Payment arrangement set</span>
      </motion.div>
    </Illustration>
  );
}

/* ============================================================
   9 - Payoff and loan inquiries
   ============================================================ */
function Payoff({ hovered, index }: IlloProps) {
  const { ref, active, loop, inView } = useMockupMotion(hovered, index);
  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <Illustration rootRef={ref}>
      <div className={[styles.bubble, styles.bubbleIn].join(" ")}>
        What&apos;s my payoff amount?
      </div>
      <div className={styles.subCard}>
        <div className={styles.docHead}>
          <span className={styles.userRole}>Payoff · as of today</span>
          <motion.span
            className={styles.instantChip}
            animate={loop ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
            transition={loop ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : undefined}
          >
            ⚡ Instant
          </motion.span>
        </div>
        <span className={styles.answerAmount}>
          <CountUp to={184320.55} run={inView} format={fmt} />
        </span>
        <div className={styles.loanRow}>
          <span className={styles.permName}>Loan status</span>
          {active ? (
            <motion.span
              className={styles.loanGood}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: SPRING_EASE }}
            >
              Current
            </motion.span>
          ) : (
            <span className={styles.dialState}>Checking…</span>
          )}
        </div>
      </div>
    </Illustration>
  );
}

/* ============================================================
   10 - Condition chasing
   ============================================================ */
function ConditionChasing({ hovered, index }: IlloProps) {
  const { ref, active, loop } = useMockupMotion(hovered, index);
  const conditions = [
    { name: "Paystubs (30 days)", always: true },
    { name: "Letter of explanation", always: true },
    { name: "Homeowners insurance", always: false },
  ];
  const cleared = conditions.filter((c) => c.always || active).length;
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.docHead}>
          <span className={styles.userName}>Underwriting conditions</span>
          <span className={styles.docCount}>
            {cleared} of {conditions.length}
          </span>
        </div>
        <div className={styles.docList}>
          {conditions.map((c) => (
            <div key={c.name} className={styles.docItem}>
              <Check ticked={c.always || active} />
              <span className={styles.docName}>{c.name}</span>
              {!c.always && !active && (
                <motion.span
                  className={[styles.acctBadge, styles.acctBadgeWarn, styles.docItemBadge].join(" ")}
                  animate={loop ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
                  transition={
                    loop ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined
                  }
                >
                  Chasing
                </motion.span>
              )}
            </div>
          ))}
        </div>
        <Progress pct={(cleared / conditions.length) * 100} working={!active} />
      </div>
    </Illustration>
  );
}

/* ============================================================
   11 - Employment & income verification (VOE/VOIE)
   ============================================================ */
function VoeVoie({ hovered, index }: IlloProps) {
  const { ref, active } = useMockupMotion(hovered, index);
  const rows = [
    { label: "Employer", value: "Confirmed" },
    { label: "Income", value: "Confirmed" },
    { label: "Start date", value: "Matched" },
  ];
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.docHead}>
          <span className={styles.userName}>Income &amp; employment</span>
          <span
            className={[styles.statusPill, active ? styles.statusPillDone : ""].join(" ").trim()}
          >
            {active ? (
              <>
                <Check ticked /> Verified
              </>
            ) : (
              <>
                <span className={styles.spinner} /> Checking…
              </>
            )}
          </span>
        </div>
        <div className={styles.docList}>
          {rows.map((r, i) => (
            <div key={r.label} className={styles.permItem}>
              <span className={styles.permName}>{r.label}</span>
              {active ? (
                <motion.span
                  className={styles.loanGood}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.1, ease: SPRING_EASE }}
                >
                  {r.value}
                </motion.span>
              ) : (
                <span className={styles.dialState}>Pending</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Illustration>
  );
}

/* ============================================================
   12 - Title & appraisal scheduling
   ============================================================ */
function TitleAppraisal({ hovered, index }: IlloProps) {
  const { ref, active } = useMockupMotion(hovered, index);
  const vendors = [
    { name: "Title", sub: "Placed today", pending: "Ordering…", done: "Ordered" },
    { name: "Appraisal", sub: "Fri, 9:00 AM", pending: "Finding a slot…", done: "Scheduled" },
  ];
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.docHead}>
          <span className={styles.userName}>Vendor orders</span>
          <span className={styles.docCount}>On track</span>
        </div>
        <div className={styles.docList}>
          {vendors.map((v, i) => (
            <div key={v.name} className={styles.vendorRow}>
              <div className={styles.userText}>
                <span className={styles.userName}>{v.name}</span>
                <span className={styles.userRole}>{v.sub}</span>
              </div>
              {active ? (
                <motion.span
                  className={[styles.statusPill, styles.statusPillDone].join(" ")}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.12, ease: SPRING_EASE }}
                >
                  <Check ticked /> {v.done}
                </motion.span>
              ) : (
                <span className={styles.statusPill}>
                  <span className={styles.spinner} /> {v.pending}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Illustration>
  );
}

/* ============================================================
   13 - Milestone updates
   ============================================================ */
function MilestoneUpdates({ hovered, index }: IlloProps) {
  const { ref, active } = useMockupMotion(hovered, index);
  const milestones = [
    { label: "Appraisal ordered", always: true },
    { label: "Clear to close", always: true },
    { label: "Closing scheduled", always: false },
  ];
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <span className={styles.userName}>Loan milestones · Live from LOS</span>
        <div className={styles.docList}>
          {milestones.map((m) => (
            <div key={m.label} className={styles.docItem}>
              <Check ticked={m.always || active} />
              <span className={styles.docName}>{m.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.channelChips}>
          <motion.span className={styles.channelChip} {...reveal(active, 0.1)}>
            Borrower notified
          </motion.span>
          <motion.span className={styles.channelChip} {...reveal(active, 0.22)}>
            Realtor notified
          </motion.span>
        </div>
      </div>
    </Illustration>
  );
}

/* ============================================================
   14 - Disclosure chasing
   ============================================================ */
function DisclosureChasing({ hovered, index }: IlloProps) {
  const { ref, active, loop } = useMockupMotion(hovered, index);
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.docHead}>
          <span className={styles.userName}>Loan estimate</span>
          <motion.span
            className={[styles.acctBadge, active ? styles.acctBadgeOk : styles.acctBadgeWarn].join(
              " "
            )}
            animate={!active && loop ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
            transition={
              !active && loop ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined
            }
          >
            {active ? "Signed" : "Chasing signature"}
          </motion.span>
        </div>
        <div className={styles.kvRow}>
          <span className={styles.userRole}>Issued by lender</span>
          <span className={styles.kvValue}>Fri</span>
        </div>
        <div className={styles.kvRow}>
          <span className={styles.userRole}>Reminder sent</span>
          <span className={styles.kvValue}>E-sign link</span>
        </div>
        <Progress pct={active ? 100 : 62} working={!active} />
      </div>
    </Illustration>
  );
}

/* ============================================================
   15 - Loss mitigation outreach
   ============================================================ */
function LossMitigation({ hovered, index }: IlloProps) {
  const { ref, active, loop } = useMockupMotion(hovered, index);
  const steps = ["Forbearance", "Repayment", "Modification"];
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.illoRow}>
          <div className={styles.userText}>
            <span className={styles.userName}>At-risk account</span>
            <span className={styles.userRole}>Hardship outreach</span>
          </div>
          <motion.span
            className={[styles.acctBadge, active ? styles.acctBadgeOk : styles.acctBadgeWarn].join(
              " "
            )}
            animate={!active && loop ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
            transition={
              !active && loop ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined
            }
          >
            {active ? "Routed to team" : "At risk"}
          </motion.span>
        </div>
        <p className={styles.planLabel}>Options presented</p>
        <div className={styles.planSteps}>
          {steps.map((s, i) => (
            <motion.div
              key={s}
              className={styles.planStep}
              animate={{
                backgroundColor: active ? "#0e0e13" : "rgba(0,0,0,0.06)",
                color: active ? "#ffffff" : "rgba(53,53,53,0.6)",
              }}
              transition={{ duration: 0.4, delay: active ? i * 0.1 : 0, ease: EASE }}
            >
              {s}
            </motion.div>
          ))}
        </div>
      </div>
    </Illustration>
  );
}

/* ============================================================
   Registry
   ============================================================ */
const ILLUSTRATIONS: Record<string, React.FC<IlloProps>> = {
  inbound: Inbound,
  outbound: Outbound,
  documents: Documents,
  afterhours: AfterHours,
  chat: Chat,
  payments: Payments,
  delinquency: Delinquency,
  collections: Collections,
  payoff: Payoff,
  condition: ConditionChasing,
  voe: VoeVoie,
  title: TitleAppraisal,
  milestones: MilestoneUpdates,
  disclosure: DisclosureChasing,
  lossmit: LossMitigation,
};

export function Mockup({
  id,
  hovered,
  index = 0,
}: {
  id: string;
  hovered: boolean;
  index?: number;
}) {
  const Illo = ILLUSTRATIONS[id];
  if (!Illo) return null;
  return <Illo hovered={hovered} index={index} />;
}
