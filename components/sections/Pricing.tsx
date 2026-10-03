import { pricing } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { WordRevealGroup, Words } from "@/components/ui/WordReveal";
import { IncludedList } from "./pricing/IncludedList";
import { PricingBuilder } from "./pricing/PricingBuilder";
import styles from "./pricing/Pricing.module.css";

// §12b2 - "Pricing": the single plan, merged with the client's "Your rules" demo. Centred title,
// then the rule switches beside one black receipt (PricingBuilder, the only client part), then
// what's included as a 3x2 hairline grid.

export function Pricing() {
  return (
    <section id="pricing" data-nav-theme="light" className={`${styles.section} w-full bg-white`}>
      <div className={styles.inner}>
        <WordRevealGroup className={styles.titleBlock}>
          <span className="flex items-center">
            <span className="font-illustration text-[14px] font-medium uppercase leading-[16.5px] text-text">
              {pricing.eyebrow}
            </span>
          </span>
          <h2 className={`${styles.heading} font-light text-text`}>
            <Words text={pricing.headline} />
          </h2>
          <Reveal delay={0.2} as="p" className={`${styles.subhead} text-muted`}>
            {pricing.subhead}
          </Reveal>
        </WordRevealGroup>

        <PricingBuilder />
        <IncludedList />
      </div>
    </section>
  );
}
