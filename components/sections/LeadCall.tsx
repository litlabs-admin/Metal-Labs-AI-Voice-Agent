import { leadCall } from "@/lib/content";
import { WordRevealGroup, Words } from "@/components/ui/WordReveal";
import { LeadCallStory } from "./lead-call/LeadCallStory";
import styles from "./lead-call/LeadCall.module.css";

// §3b - Speed to lead, directly under the hero: one new lead worked from CRM to a live warm
// transfer. Left, a numbered accordion of the four steps; right, a Solutions-style panel where
// the agent (an ink pill with a thinking-orbs orb) plays the active step as floating cards.
// Copy lives in lib/content.ts (leadCall); sizing and motion live in LeadCall.module.css.

export function LeadCall() {
  return (
    <section id="speed-to-lead" data-nav-theme="light" className={`${styles.section} w-full bg-white`}>
      <LeadCallStory
        copy={
          <WordRevealGroup className={styles.copy}>
            <span className="flex items-center">
              <span className="font-illustration text-[14px] font-medium uppercase leading-[16.5px] text-text">
                {leadCall.eyebrow}
              </span>
            </span>
            <h2 className={`${styles.heading} font-light text-text`}>
              <Words text={leadCall.headline} />
            </h2>
            <p className={`${styles.subline} text-muted`}>
              <Words text={leadCall.subline} />
            </p>
          </WordRevealGroup>
        }
      />
    </section>
  );
}
