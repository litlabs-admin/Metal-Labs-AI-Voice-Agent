import { integrations } from "@/lib/content";
import { integrationLogos } from "@/lib/assets";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { WordRevealGroup, Words } from "@/components/ui/WordReveal";
import { IntegrationMarquee } from "@/components/ui/IntegrationMarquee";

// §7 - light band: eyebrow + headline + subhead, a centered dot-separated line of the
// integration categories, then ONE full-bleed infinite strip carrying every partner mark.
//
// The section is light on purpose. These are the vendors' full-colour marks, which are
// drawn for white/near-white backgrounds - the majority are dark ink and would be
// illegible on the dark band this section used to use. A light surface is what lets every
// mark render in its true sanctioned colours with no chip, no band, and no filter.
// Recolouring/inverting is not an option: req.md is explicit that using a logo outside
// its sanctioned colour rules is itself a usage violation. Swap files, never pixels.

// Marks run in category order (LOS → POS → CRM → Verification → Dialers) so the strip
// reads in the same order as the category line above it.
const allLogos = integrations.categories.flatMap(
  (category) => integrationLogos[category.id] ?? [],
);

export function IntegrationsStrip() {
  return (
    <section
      id="integrations"
      data-nav-theme="light"
      aria-labelledby="integrations-heading"
      className="w-full overflow-hidden bg-white py-12 text-text xl:py-16"
    >
      <div className="px-6 md:px-14 xl:px-18">
        <WordRevealGroup className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <Eyebrow className="text-muted">{integrations.eyebrow}</Eyebrow>
          <h2
            id="integrations-heading"
            className="mt-4 text-display-sm font-light leading-[1.2] tracking-[-0.4px] text-text md:text-display-lg md:tracking-[-1px]"
          >
            <Words text={integrations.headline[0]} />
            <br />
            <Words text={integrations.headline[1]} />
          </h2>
          <p className="mt-5 max-w-[600px] text-[16px] leading-[26px] text-muted">
            <Words text={integrations.subhead} />
          </p>
        </WordRevealGroup>
      </div>

      <Reveal delay={0.1} className="mt-12 xl:mt-16">
        {/* Category line: one centered row, dot-separated. The separators are decorative,
            so they're aria-hidden and the names read as a plain list to AT. */}
        <div className="px-6 md:px-14 xl:px-18">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {integrations.categories.map((category, i) => (
              <span key={category.id} className="flex items-center gap-x-3">
                {i > 0 && (
                  <span aria-hidden="true" className="text-muted-2">
                    ·
                  </span>
                )}
                <Eyebrow className="text-[11px] tracking-[1.2px] text-muted">
                  {category.short}
                </Eyebrow>
              </span>
            ))}
          </p>
        </div>

        <div className="mt-9 w-full xl:mt-11">
          <IntegrationMarquee logos={allLogos} />
        </div>
      </Reveal>
    </section>
  );
}
