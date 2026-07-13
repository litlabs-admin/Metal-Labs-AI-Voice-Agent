"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate as animateValue,
} from "framer-motion";
import styles from "./Solutions.module.css";

const EASE = [0.44, 0, 0.56, 1] as const;
const SPRING_EASE = [0.22, 1, 0.36, 1] as const;

/* Shared motion state for an illustration. Only the active tab's 5 cards are
   ever mounted at once, so all loops (`repeat: Infinity`) run unconditionally
   rather than gating on in-view — the compositor cost is negligible at that
   scale. The `ref` is attached to the illustration's root via `rootRef`. */
function useMockupMotion(hovered: boolean) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const active = hovered || !!reduce;
  const loop = !reduce;
  return { ref, active, loop };
}

/* ============================================================
   Shared shell — light card surface + an in-view entrance on the
   inner content. (Previously a full-bleed dark photo backdrop;
   now a soft off-white panel since cards sit on a light section.)
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
  // Peak heights as a fraction of the bar's full height — scaleY keeps every
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

function CountUp({
  to,
  active,
  format,
}: {
  to: number;
  active: boolean;
  format: (n: number) => string;
}) {
  const mv = useMotionValue(active ? to : 0);
  const text = useTransform(mv, (v) => format(v));
  useEffect(() => {
    const controls = animateValue(mv, active ? to : 0, {
      duration: active ? 1.1 : 0.3,
      ease: SPRING_EASE,
    });
    return controls.stop;
  }, [active, to, mv]);
  return <motion.span>{text}</motion.span>;
}

const reveal = (active: boolean, delay = 0) => ({
  animate: active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.96 },
  transition: { duration: 0.45, ease: SPRING_EASE, delay: active ? delay : 0 },
});

/* ============================================================
   1 — Inbound lead qualification
   ============================================================ */
function Inbound({ hovered }: { hovered: boolean }) {
  const { ref, active, loop } = useMockupMotion(hovered);
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.illoRow}>
          <span className={styles.avatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/solutions/avatar-1.png" alt="" width={40} height={40} />
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
   2 — Outbound lead calling
   ============================================================ */
function Outbound({ hovered }: { hovered: boolean }) {
  const { ref, active, loop } = useMockupMotion(hovered);
  const rows = [
    { name: "Aged lead · Jan ’23", state: "connected" as const },
    { name: "CRM contact #4821", state: "dialing" as const },
    { name: "Purchased list", state: "queued" as const },
  ];
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        {rows.map((r) => {
          const connected = active && r.state === "connected";
          return (
            <div key={r.name} className={styles.dialRow}>
              <span
                className={[
                  styles.dialDot,
                  connected ? styles.dialDotOn : "",
                  r.state === "dialing" ? styles.dialDotRing : "",
                ]
                  .join(" ")
                  .trim()}
              >
                {r.state === "dialing" && loop && (
                  <motion.span
                    className={styles.dialPing}
                    animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </span>
              <span className={styles.dialName}>{r.name}</span>
              {connected ? (
                <motion.span
                  className={styles.handoffTag}
                  initial={false}
                  animate={{ opacity: 1, x: 0 }}
                >
                  → Handed off
                </motion.span>
              ) : (
                <span className={styles.dialState}>
                  {r.state === "dialing" ? "Dialing…" : r.state === "queued" ? "Queued" : "Warm"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Illustration>
  );
}

/* ============================================================
   3 — Document collection
   ============================================================ */
function Documents({ hovered }: { hovered: boolean }) {
  const { ref, active, loop } = useMockupMotion(hovered);
  const docs = [
    { name: "W-2 form", always: true },
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
            </div>
          ))}
        </div>
        <div className={styles.progressBar}>
          <motion.span
            className={styles.progressFill}
            animate={{ width: `${(done / docs.length) * 100}%` }}
            transition={{ duration: 0.6, ease: SPRING_EASE }}
          />
        </div>
      </div>
      <div className={styles.channelChips}>
        {["Voice", "Text", "Email"].map((c, i) => (
          <motion.span
            key={c}
            className={styles.channelChip}
            animate={loop ? { opacity: [0.55, 1, 0.55] } : { opacity: 1 }}
            transition={
              loop ? { duration: 2.1, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" } : undefined
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
   4 — After-hours support
   ============================================================ */
function AfterHours({ hovered }: { hovered: boolean }) {
  const { ref, active, loop } = useMockupMotion(hovered);
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
        <div className={[styles.bubble, styles.bubbleIn].join(" ")}>
          Are you open right now?
        </div>
        {active ? (
          <motion.div
            className={[styles.bubble, styles.bubbleOut].join(" ")}
            {...reveal(active, 0.15)}
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
   5 — Website chat
   ============================================================ */
function Chat({ hovered }: { hovered: boolean }) {
  const { ref, active, loop } = useMockupMotion(hovered);
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={[styles.bubble, styles.bubbleIn].join(" ")}>
          What rates can I get today?
        </div>
        {active ? (
          <motion.div
            className={[styles.bubble, styles.bubbleOut].join(" ")}
            {...reveal(active, 0.1)}
          >
            From 6.1% APR, want me to check yours?
          </motion.div>
        ) : (
          <div className={[styles.bubble, styles.bubbleOut, styles.bubbleTyping].join(" ")}>
            <Typing loop={loop} />
          </div>
        )}
        <motion.button className={styles.ctaChip} {...reveal(active, 0.28)}>
          Book a call →
        </motion.button>
      </div>
    </Illustration>
  );
}

/* ============================================================
   6 — Payment reminders
   ============================================================ */
function Payments({ hovered }: { hovered: boolean }) {
  const { ref, active, loop } = useMockupMotion(hovered);
  const cells = Array.from({ length: 21 }, (_, i) => i + 1);
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
                loop ? { duration: 2.1, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" } : undefined
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
   7 — Delinquency outreach
   ============================================================ */
function Delinquency({ hovered }: { hovered: boolean }) {
  const { ref, active, loop } = useMockupMotion(hovered);
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
              initial={false}
              animate={{ scale: 1 }}
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
   8 — Collections
   ============================================================ */
function Collections({ hovered }: { hovered: boolean }) {
  const { ref, active } = useMockupMotion(hovered);
  const fmt = (n: number) =>
    "$" + Math.round(n).toLocaleString("en-US");
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
          <CountUp to={1284500} active={active} format={fmt} />
        </span>
        <div className={styles.progressBar}>
          <motion.span
            className={styles.progressFill}
            animate={{ width: active ? "82%" : "34%" }}
            transition={{ duration: 1, ease: SPRING_EASE }}
          />
        </div>
      </div>
      <motion.div className={styles.bookedChip} {...reveal(active, 0.2)}>
        <span className={styles.bookedIcon}>🤝</span>
        <span>Payment arrangement set</span>
      </motion.div>
    </Illustration>
  );
}

/* ============================================================
   9 — Payoff and loan inquiries
   ============================================================ */
function Payoff({ hovered }: { hovered: boolean }) {
  const { ref, active, loop } = useMockupMotion(hovered);
  const fmt = (n: number) =>
    "$" +
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <Illustration rootRef={ref}>
      <div className={[styles.bubble, styles.bubbleIn, styles.queryBubble].join(" ")}>
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
          <CountUp to={184320.55} active={active} format={fmt} />
        </span>
        <div className={styles.loanRow}>
          <span className={styles.permName}>Loan status</span>
          <span className={styles.loanGood}>Current</span>
        </div>
      </div>
    </Illustration>
  );
}

/* ============================================================
   10 — Condition chasing
   ============================================================ */
function ConditionChasing({ hovered }: { hovered: boolean }) {
  const { ref, loop } = useMockupMotion(hovered);
  const conditions = [
    { name: "Paystubs (30 days)", done: true },
    { name: "Bank statement", done: true },
    { name: "Letter of explanation", done: true },
    { name: "Homeowners insurance", done: false },
  ];
  const cleared = conditions.filter((c) => c.done).length;
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.docHead}>
          <span className={styles.userName}>Underwriting conditions</span>
          <span className={styles.docCount}>
            {cleared} of {conditions.length} cleared
          </span>
        </div>
        <div className={styles.docList}>
          {conditions.map((c) => (
            <div key={c.name} className={styles.docItem}>
              <Check ticked={c.done} />
              <span className={styles.docName}>{c.name}</span>
              {!c.done && (
                <motion.span
                  className={[styles.acctBadge, styles.acctBadgeWarn, styles.docItemBadge].join(" ")}
                  animate={loop ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
                  transition={loop ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined}
                >
                  Chasing
                </motion.span>
              )}
            </div>
          ))}
        </div>
        <div className={styles.progressBar}>
          <motion.span
            className={styles.progressFill}
            animate={{ width: `${(cleared / conditions.length) * 100}%` }}
            transition={{ duration: 0.6, ease: SPRING_EASE }}
          />
        </div>
      </div>
    </Illustration>
  );
}

/* ============================================================
   11 — Employment & income verification (VOE/VOIE)
   ============================================================ */
function VoeVoie({ hovered }: { hovered: boolean }) {
  const { ref, active } = useMockupMotion(hovered);
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
          <span className={[styles.statusPill, active ? styles.statusPillDone : ""].join(" ").trim()}>
            <Check ticked={active} /> {active ? "Verified" : "Checking…"}
          </span>
        </div>
        <div className={styles.docList}>
          {rows.map((r, i) => (
            <div key={r.label} className={styles.permItem}>
              <span className={styles.permName}>{r.label}</span>
              <motion.span className={styles.loanGood} {...reveal(active, i * 0.1)}>
                {r.value}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
    </Illustration>
  );
}

/* ============================================================
   12 — Title & appraisal scheduling
   ============================================================ */
function TitleAppraisal({ hovered }: { hovered: boolean }) {
  const { ref, active } = useMockupMotion(hovered);
  const vendors = [
    { name: "Title", sub: "Placed today", status: "Ordered" },
    { name: "Appraisal", sub: "Fri, 9:00 AM", status: "Scheduled" },
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
            <motion.div key={v.name} className={styles.vendorRow} {...reveal(active, i * 0.12)}>
              <div className={styles.userText}>
                <span className={styles.userName}>{v.name}</span>
                <span className={styles.userRole}>{v.sub}</span>
              </div>
              <span className={[styles.statusPill, styles.statusPillDone].join(" ")}>
                <Check ticked /> {v.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Illustration>
  );
}

/* ============================================================
   13 — Milestone updates
   ============================================================ */
function MilestoneUpdates({ hovered }: { hovered: boolean }) {
  const { ref, active } = useMockupMotion(hovered);
  const milestones = [
    { label: "Appraisal ordered", done: true },
    { label: "Clear to close", done: true },
    { label: "Closing scheduled", done: false },
  ];
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <span className={styles.userName}>Loan milestones · Live from LOS</span>
        <div className={styles.docList}>
          {milestones.map((m, i) => (
            <div key={m.label} className={styles.docItem}>
              <Check ticked={m.done || (active && i === 2)} />
              <span className={styles.docName}>{m.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.channelChips}>
          <motion.span className={styles.channelChip} {...reveal(active, 0.1)}>
            Borrower notified
          </motion.span>
          <motion.span className={styles.channelChip} {...reveal(active, 0.2)}>
            Realtor notified
          </motion.span>
        </div>
      </div>
    </Illustration>
  );
}

/* ============================================================
   14 — Disclosure chasing
   ============================================================ */
function DisclosureChasing({ hovered }: { hovered: boolean }) {
  const { ref, active, loop } = useMockupMotion(hovered);
  return (
    <Illustration rootRef={ref}>
      <div className={styles.subCard}>
        <div className={styles.docHead}>
          <span className={styles.userName}>Loan estimate</span>
          <motion.span
            className={[styles.acctBadge, active ? styles.acctBadgeOk : styles.acctBadgeWarn].join(" ")}
            animate={!active && loop ? { opacity: [1, 0.55, 1] } : {}}
            transition={!active && loop ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined}
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
      </div>
    </Illustration>
  );
}

/* ============================================================
   15 — Loss mitigation outreach
   ============================================================ */
function LossMitigation({ hovered }: { hovered: boolean }) {
  const { ref, active, loop } = useMockupMotion(hovered);
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
            className={[styles.acctBadge, active ? styles.acctBadgeOk : styles.acctBadgeWarn].join(" ")}
            animate={!active && loop ? { opacity: [1, 0.55, 1] } : {}}
            transition={!active && loop ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined}
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
const ILLUSTRATIONS: Record<string, React.FC<{ hovered: boolean }>> = {
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

export function Mockup({ id, hovered }: { id: string; hovered: boolean }) {
  const Illo = ILLUSTRATIONS[id];
  if (!Illo) return null;
  return <Illo hovered={hovered} />;
}
