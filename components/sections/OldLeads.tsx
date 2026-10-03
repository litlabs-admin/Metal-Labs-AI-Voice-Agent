import { oldLeads } from "@/lib/content";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WordRevealGroup, Words } from "@/components/ui/WordReveal";
import { LeadGrid } from "./old-leads/LeadGrid";
import styles from "./old-leads/OldLeads.module.css";

// §4b - "Old leads": a dot-grid stat (share of the CRM database worked, by hand vs. Metal
// Labs) over a zero-gap hairline grid of four lead-type cards. Layout and type follow the
// Compliance / WhyMetalLabs template; the grid itself is LeadGrid.tsx (client, animated).
// All responsive sizing lives in OldLeads.module.css - see the note at the top of that file.

export function OldLeads() {
  return (
    <section id="old-leads" data-nav-theme="light" className={`${styles.section} w-full bg-white`}>
      <div className={styles.inner}>
        <WordRevealGroup className={styles.titleBlock}>
          <span className="flex items-center">
            <span className="font-illustration text-[14px] font-medium uppercase leading-[16.5px] text-text">
              {oldLeads.eyebrow}
            </span>
          </span>

          <h2 className={`${styles.heading} font-light text-text`}>
            <Words text={oldLeads.headline} />
          </h2>
        </WordRevealGroup>

        <LeadGrid />

        <RevealGroup className={`${styles.cards} border-l border-t border-black/10`} stagger={0.07}>
          {oldLeads.cards.map((card) => (
            <RevealItem key={card.title} className="h-full">
              <article
                className={`${styles.card} group border-b border-r border-black/10 transition-colors duration-300 hover:bg-cream/60`}
              >
                <span
                  aria-hidden
                  className={`${styles.glyph} bg-text transition-transform duration-500 ease-(--ease-out-ml) group-hover:scale-[1.08]`}
                  style={{
                    maskImage: `url(${card.icon})`,
                    WebkitMaskImage: `url(${card.icon})`,
                  }}
                />

                <div className={styles.cardText}>
                  <h3 className={`${styles.cardTitle} font-heading text-text`}>{card.title}</h3>
                  <p className={`${styles.cardQuote} text-muted`}>&ldquo;{card.quote}&rdquo;</p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
