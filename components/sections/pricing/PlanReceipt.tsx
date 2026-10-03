"use client";

import { AnimatePresence, motion, type Transition } from "framer-motion";
import { pricing, CAL_LINK, type PricingRuleId } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { PriceFigure } from "./PriceFigure";
import { MinutesMeter } from "./MinutesMeter";
import { ArrowIcon } from "./icons";
import styles from "./Pricing.module.css";

// Right column of the top row: the one black "receipt". Top band is the plan (price + terms beside
// the CTA, then included minutes); below it, tonight's leads replayed under the rules switched on
// in the left column, closing with a live status line. Display only - state lives in PricingBuilder.
export function PlanReceipt({
  rules,
  hovered,
  onHover,
  swap,
  resize,
  reduce,
}: {
  rules: Record<PricingRuleId, boolean>;
  hovered: PricingRuleId | null;
  onHover: (id: PricingRuleId | null) => void;
  swap: Transition;
  resize: Transition;
  reduce: boolean;
}) {
  const { plan, preview } = pricing;
  const offCount = preview.leads.filter((l) => !rules[l.rule]).length;
  const allOn = offCount === 0;
  const status = allOn
    ? preview.statusOn
    : preview.statusOff
        .replace("{n}", String(offCount))
        .replace("{total}", String(preview.leads.length));
  const shift = reduce ? 0 : 4;

  return (
    <Reveal delay={0.15} className={styles.receiptWrap}>
      <aside className={styles.receipt} aria-label={plan.label}>
        <span className={`${styles.receiptLabel} font-illustration font-medium uppercase`}>{plan.label}</span>

        <div className={styles.band}>
          <div>
            <PriceFigure currency={plan.currency} price={plan.price} period={plan.period} />
            <p className={styles.terms}>{plan.terms}</p>
          </div>
          <a
            className={`${styles.cta} bg-white font-button text-black transition-all duration-300 hover:bg-white/90 active:scale-[0.97]`}
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            {plan.cta}
            <ArrowIcon />
          </a>
        </div>

        <MinutesMeter label={plan.meter} />

        <div aria-hidden className={styles.dashed} />

        <span className={`${styles.receiptLabel} ${styles.previewLabel} font-illustration font-medium uppercase`}>
          {preview.label}
        </span>

        <ul className={styles.leadList}>
          {preview.leads.map((lead) => {
            const on = rules[lead.rule];
            const outcome = on ? lead.on : lead.off;
            return (
              <li
                key={lead.name}
                className={cn(styles.lead, hovered === lead.rule && styles.leadActive)}
                onMouseEnter={() => onHover(lead.rule)}
                onMouseLeave={() => onHover(null)}
              >
                <span className={styles.rowText}>
                  <span className={`${styles.leadName} font-body`}>{lead.name}</span>
                  <span className={styles.leadContext}>{lead.context}</span>
                </span>
                <motion.span
                  layout
                  transition={resize}
                  className={cn(styles.pill, on ? styles.pillOn : styles.pillOff)}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={outcome}
                      layout="position"
                      initial={{ opacity: 0, y: shift }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -shift }}
                      transition={swap}
                    >
                      {outcome}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
              </li>
            );
          })}
        </ul>

        <div aria-hidden className={styles.dashed} />

        <p
          aria-live="polite"
          className={cn(
            styles.status,
            allOn ? styles.statusOk : styles.statusWarn,
            "font-illustration font-medium uppercase",
          )}
        >
          <span aria-hidden className={styles.statusDot} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status}
              initial={{ opacity: 0, y: shift }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -shift }}
              transition={swap}
            >
              {status}
            </motion.span>
          </AnimatePresence>
        </p>

      </aside>
    </Reveal>
  );
}
