import { why } from "@/lib/content";
import { assets } from "@/lib/assets";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import styles from "./WhyMetalLabs.module.css";

// §8 - "Built for Mortgage": left-aligned title block over a zero-gap card grid whose cards
// share hairline borders (the reference template's "Industry" section layout). Each card leads
// with a blue silk tile carrying a white glyph, then a serif title and body.
// All responsive sizing lives in WhyMetalLabs.module.css - see the note at the top of that file.

export function WhyMetalLabs() {
  return (
    <section id="use-cases" data-nav-theme="light" className={`${styles.section} w-full bg-cream-2`}>
      <div className={styles.inner}>
        <Reveal className={styles.titleBlock}>
          <span className="flex items-center">
            <span className="font-illustration text-[14px] font-medium uppercase leading-[16.5px] text-text">
              {why.eyebrow}
            </span>
          </span>

          <h2 className={`${styles.heading} font-light text-text`}>
            {why.headline[0]} {why.headline[1]}
          </h2>

          <p className="max-w-[680px] text-[16px] leading-[26px] text-muted">{why.subhead}</p>
        </Reveal>

        <RevealGroup className={`${styles.grid} border-l border-t border-hairline`} stagger={0.07}>
          {why.cells.map((cell, i) => (
            <RevealItem key={cell.label} className="h-full">
              <article
                className={`${styles.card} group border-b border-r border-hairline transition-colors duration-300 hover:bg-white/40`}
              >
                <span
                  className={`${styles.tile} transition-transform duration-500 ease-(--ease-out-ml) group-hover:scale-[1.04]`}
                  style={{ backgroundImage: `url(${assets.enterpriseTiles[i]})` }}
                >
                  <span
                    aria-hidden
                    className={styles.glyph}
                    style={{
                      maskImage: `url(${assets.enterpriseIcons[i]})`,
                      WebkitMaskImage: `url(${assets.enterpriseIcons[i]})`,
                    }}
                  />
                </span>

                <div className="flex w-full flex-col gap-3">
                  <h3 className={`${styles.cardTitle} text-text`}>{cell.label}</h3>
                  <p className={`${styles.cardBody} text-text`}>{cell.body}</p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
