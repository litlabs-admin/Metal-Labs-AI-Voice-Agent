import { compliance } from "@/lib/content";
import { assets } from "@/lib/assets";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WordRevealGroup, Words } from "@/components/ui/WordReveal";
import styles from "./Compliance.module.css";

// §12b - "Compliance": the reference template's two-column security section. Left column holds
// the title block over three gradient certification badges (pushed to the bottom edge on desktop
// so they align with the card row); right column is a zero-gap grid of hairline-bordered cards.
// All responsive sizing lives in Compliance.module.css - see the note at the top of that file.

export function Compliance() {
  return (
    <section
      id="compliance"
      data-nav-theme="light"
      className={`${styles.section} w-full bg-white`}
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <WordRevealGroup className={styles.titleBlock}>
            <span className="flex items-center">
              <span className="font-illustration text-[14px] font-medium uppercase leading-[16.5px] text-text">
                {compliance.eyebrow}
              </span>
            </span>

            <h2 className={`${styles.heading} font-light text-text`}>
              <Words text={compliance.headline} />
            </h2>
          </WordRevealGroup>

          <RevealGroup className={styles.badges} stagger={0.09}>
            {compliance.badges.map((badge) => (
              <RevealItem key={badge}>
                <span
                  className={`${styles.badgeRing} transition-transform duration-500 ease-(--ease-out-ml) hover:scale-[1.06]`}
                >
                  <span className={styles.badgeDisc}>
                    <span className={styles.badgeLabel}>{badge}</span>
                  </span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <RevealGroup className={`${styles.cards} border-l border-t border-black/10`} stagger={0.07}>
          {compliance.cards.map((card, i) => (
            <RevealItem
              key={card.title}
              className={`h-full ${i === 2 ? styles.cardWide : ""}`}
            >
              <article
                className={`${styles.card} group border-b border-r border-black/10 transition-colors duration-300 hover:bg-cream/60`}
              >
                <span
                  aria-hidden
                  className={`${styles.glyph} bg-text transition-transform duration-500 ease-(--ease-out-ml) group-hover:scale-[1.08]`}
                  style={{
                    maskImage: `url(${assets.complianceIcons[i]})`,
                    WebkitMaskImage: `url(${assets.complianceIcons[i]})`,
                  }}
                />

                <div className={styles.cardText}>
                  <h3 className={`${styles.cardTitle} font-heading text-text`}>{card.title}</h3>
                  <p className={`${styles.cardBody} text-muted`}>{card.body}</p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
