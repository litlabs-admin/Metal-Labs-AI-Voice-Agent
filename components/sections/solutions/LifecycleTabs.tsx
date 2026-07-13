"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mockup } from "./Mockups";
import styles from "./Solutions.module.css";

const EASE = [0.44, 0, 0.56, 1] as const;

type Card = { id: string; title: string; desc: string; illo: string };
type Tab = { id: string; label: string; intro: string; cards: Card[] };

const TABS: Tab[] = [
  {
    id: "connect",
    label: "Origination",
    intro:
      "Metal Labs agents engage borrowers the moment they raise their hand, qualifying them, collecting their documents, and keeping deals moving until your LO takes over. No lead goes cold. No application stalls.",
    cards: [
      {
        id: "inbound",
        title: "Inbound lead qualification",
        desc: "Every inbound lead gets contacted in seconds. Our AI agent qualifies, captures intent, and books the LO call before your competitor even picks up the phone.",
        illo: "inbound",
      },
      {
        id: "outbound",
        title: "Outbound lead calling",
        desc: "Aged leads, CRM contacts, purchased lists: the agent dials them all, warms them up, and hands off only the ready ones to your loan officers.",
        illo: "outbound",
      },
      {
        id: "documents",
        title: "Document collection",
        desc: "Automated follow-ups across voice, text, and email until every doc is in. No chasing. No dropped applications. Faster clear-to-close.",
        illo: "documents",
      },
      {
        id: "afterhours",
        title: "After-hours support",
        desc: "Borrowers don't wait until Monday. Neither does your AI agent. Inbound calls and texts handled 24/7, with full context on every conversation.",
        illo: "afterhours",
      },
      {
        id: "chat",
        title: "Website chat",
        desc: "Every visitor who asks a question gets an answer, and a next step. Not a form. Not a callback request. An actual conversation.",
        illo: "chat",
      },
    ],
  },
  {
    id: "coordinate",
    label: "Processing",
    intro:
      "Condition chasing, verifications, title and appraisal follow-up, milestone updates, and disclosure chasing: files kept moving to the closing table.",
    cards: [
      {
        id: "condition",
        title: "Condition chasing",
        desc: "The reason your loans stop stalling in processing. Tracks every outstanding condition and follows up automatically, across voice, text, and email, until the file is complete.",
        illo: "condition",
      },
      {
        id: "voe",
        title: "Employment & income verification",
        desc: "The agent reaches out to borrowers directly, explaining what's needed, collecting the right information, and updating your LOS automatically. Underwriters get what they need.",
        illo: "voe",
      },
      {
        id: "title",
        title: "Title & appraisal scheduling",
        desc: "The agent coordinates title and appraisal scheduling across every party, finding availability, confirming appointments, and handling reschedules automatically.",
        illo: "title",
      },
      {
        id: "milestones",
        title: "Milestone updates",
        desc: "Borrowers and realtors get proactive updates (appraisal ordered, clear-to-close, closing scheduled) read live from the LOS.",
        illo: "milestones",
      },
      {
        id: "disclosure",
        title: "Disclosure chasing",
        desc: "Metal Labs makes sure every disclosure gets signed on time: the LE and CD go out, and reminders follow before the window jeopardizes closing.",
        illo: "disclosure",
      },
    ],
  },
  {
    id: "service",
    label: "Servicing",
    intro:
      "Servicing is where lenders bleed money: missed payments, high call volumes, understaffed teams. Metal Labs automates the entire borrower servicing conversation: payment reminders, delinquency outreach, and compliant collections at scale.",
    cards: [
      {
        id: "payments",
        title: "Payment reminders",
        desc: "Proactive outreach before payments are due, across voice, text, and email. Fewer late payments. Fewer calls to your servicing team.",
        illo: "payments",
      },
      {
        id: "delinquency",
        title: "Delinquency outreach",
        desc: "Early, consistent contact the moment an account goes delinquent. The agent handles the conversation, sets up payment plans, and escalates only when it matters.",
        illo: "delinquency",
      },
      {
        id: "collections",
        title: "Collections",
        desc: "FDCPA-compliant collections calls at scale. The agent handles objections, negotiates payment arrangements, and recovers more with less headcount.",
        illo: "collections",
      },
      {
        id: "payoff",
        title: "Payoff & loan inquiries",
        desc: "Borrowers get instant, accurate answers on payoff amounts, loan status, and account details, without waiting on hold or emailing your servicing desk.",
        illo: "payoff",
      },
      {
        id: "lossmit",
        title: "Loss mitigation outreach",
        desc: "The agent contacts at-risk borrowers proactively, explaining available options, capturing hardship information, and routing them to your loss mitigation team with full context.",
        illo: "lossmit",
      },
    ],
  },
];

const cardsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function LifecycleTabs() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const reduce = useReducedMotion();
  const active = TABS.find((t) => t.id === activeId) ?? TABS[0];

  return (
    <motion.div
      className={styles.lifecycle}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className={styles.tabSwitcher} role="tablist" aria-label="Borrower lifecycle stage">
        {TABS.map((t) => {
          const isActive = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={[styles.tabBtn, isActive ? styles.tabBtnActive : ""].join(" ").trim()}
              onClick={() => setActiveId(t.id)}
            >
              {isActive && (
                <motion.span
                  layoutId="tabActivePill"
                  className={styles.tabBtnFill}
                  transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                />
              )}
              <span className={styles.tabBtnLabel}>{t.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          role="tabpanel"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <p className={styles.tabIntro}>{active.intro}</p>

          <motion.div
            className={styles.grid}
            variants={reduce ? undefined : cardsContainer}
            initial={reduce ? false : "hidden"}
            animate={reduce ? undefined : "show"}
          >
            {active.cards.map((c, i) => (
              <motion.article
                key={c.id}
                className={[styles.card, i < 3 ? styles.cardSmall : styles.cardWide].join(" ")}
                variants={reduce ? undefined : cardVariant}
              >
                <div className={styles.cardText}>
                  <h3 className={styles.cardTitle}>{c.title}</h3>
                  <p className={styles.cardDesc}>{c.desc}</p>
                </div>
                <Mockup id={c.illo} hovered />
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
