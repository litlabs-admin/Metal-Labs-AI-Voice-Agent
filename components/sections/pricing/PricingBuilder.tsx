"use client";

import { useState } from "react";
import { useReducedMotion, type Transition } from "framer-motion";
import { pricing, type PricingRuleId } from "@/lib/content";
import { easeInOut, easeOut } from "@/lib/animations";
import { RevealGroup, RevealItem, Reveal } from "@/components/ui/Reveal";
import { RuleSwitch } from "./RuleSwitch";
import { PlanReceipt } from "./PlanReceipt";
import styles from "./Pricing.module.css";

// Top row of the Pricing section (after Plume's plan builder): the rule switches on the left drive
// one live receipt on the right. From 1024px the two columns share a height - the rules stretch
// to match the receipt.
//
// Every rule starts on - the default is the compliant setup. Switching one off flips its lead's
// pill to the hypothetical "Would ..." outcome. Hovering/focusing a rule highlights its lead in
// the receipt (and hovering a lead highlights its rule) so the cause-effect pairing is obvious.

const ALL_ON = Object.fromEntries(pricing.rules.items.map((r) => [r.id, true])) as Record<
  PricingRuleId,
  boolean
>;

export function PricingBuilder() {
  const reduce = useReducedMotion() ?? false;
  const [rules, setRules] = useState(ALL_ON);
  const [hovered, setHovered] = useState<PricingRuleId | null>(null);

  const toggle = (id: PricingRuleId) => setRules((r) => ({ ...r, [id]: !r[id] }));

  // Switch moves first (0.3s), the outcome follows a beat later - same pacing as the CSS pill colour.
  const knob: Transition = reduce ? { duration: 0 } : { duration: 0.3, ease: easeInOut };
  const swap: Transition = reduce ? { duration: 0 } : { duration: 0.2, ease: easeOut };
  const resize: Transition = reduce ? { duration: 0 } : { duration: 0.35, ease: easeInOut };

  return (
    <div className={styles.top}>
      <div className={styles.rulesCol}>
        <Reveal className={styles.groupHead}>
          <span className={`${styles.groupLabel} font-illustration font-medium uppercase text-muted`}>
            {pricing.rules.eyebrow}
          </span>
          <span className={`${styles.groupTitle} font-heading text-text`}>{pricing.rules.headline}</span>
          <span className={`${styles.groupHint} text-muted`}>{pricing.rules.hint}</span>
        </Reveal>

        <RevealGroup className={styles.ruleList} stagger={0.06}>
          {pricing.rules.items.map((rule) => (
            <RevealItem key={rule.id} className={styles.ruleItem}>
              <RuleSwitch
                title={rule.title}
                detail={rule.detail}
                on={rules[rule.id]}
                active={hovered === rule.id}
                knobTransition={knob}
                onToggle={() => toggle(rule.id)}
                onActivate={() => setHovered(rule.id)}
                onDeactivate={() => setHovered((h) => (h === rule.id ? null : h))}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <PlanReceipt
        rules={rules}
        hovered={hovered}
        onHover={setHovered}
        swap={swap}
        resize={resize}
        reduce={reduce}
      />
    </div>
  );
}
