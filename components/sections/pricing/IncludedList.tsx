import { pricing } from "@/lib/content";
import { assets } from "@/lib/assets";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { INCLUDED_ICONS } from "./icons";
import styles from "./Pricing.module.css";

// Bottom of the section: everything the one plan includes, as the zero-gap hairline table used by
// "Built for Mortgage" (container draws top/left rules, each cell its bottom/right). Icons sit on
// the same blue silk tiles as that section, scaled down to keep the cells compact.
export function IncludedList() {
  return (
    <div className={styles.included}>
      <span className={`${styles.groupLabel} font-illustration font-medium uppercase text-muted`}>
        {pricing.includedLabel}
      </span>

      <RevealGroup className={`${styles.includedGrid} border-l border-t border-hairline`} stagger={0.06}>
        {pricing.included.map((item, i) => {
          const Icon = INCLUDED_ICONS[item.icon];
          return (
            <RevealItem key={item.title} className="h-full">
              <article
                className={`${styles.cell} group border-b border-r border-hairline transition-colors duration-300 hover:bg-cream-2/50`}
              >
                <span
                  className={`${styles.iconWell} text-white transition-transform duration-500 ease-(--ease-out-ml) group-hover:scale-[1.04]`}
                  style={{ backgroundImage: `url(${assets.enterpriseTiles[i % assets.enterpriseTiles.length]})` }}
                >
                  <Icon />
                </span>
                <div className={styles.rowText}>
                  <h3 className={`${styles.cellTitle} font-heading text-text`}>{item.title}</h3>
                  <p className={`${styles.cellDetail} text-muted`}>{item.detail}</p>
                </div>
              </article>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
  );
}
