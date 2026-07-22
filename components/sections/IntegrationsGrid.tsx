import { integrations } from "@/lib/content";
import { integrationLogos } from "@/lib/assets";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

// §7 - dark band: eyebrow + headline + subhead over five category columns of partner
// marks. Replaces the old single-row infinite marquee (ChannelsStrip): a prospect can
// now find their own stack by category instead of waiting for a logo to scroll past.
//
// Each mark sits on its own cream cell so it renders in true brand colors. No invert,
// grayscale, or brightness filter anywhere - per req.md, using a logo outside its
// sanctioned color rules is itself a usage violation.

/** Target ink area per mark, in px² at --logo-scale:1px. Tuned so a typical 4:1
 *  wordmark lands ~22px tall x ~87px wide. */
const OPTICAL_AREA = 1900;
const MIN_H = 15; // floor: ultra-wide marks stay legible
const MAX_H = 34; // ceiling: square-ish marks can't outgrow the cell

/** Height (unitless; CSS multiplies by --logo-scale) giving every mark roughly equal
 *  ink area regardless of aspect ratio. See the .integration-mark note in globals.css. */
function opticalHeight(w: number, h: number): number {
  const aspect = w / h;
  const raw = Math.sqrt(OPTICAL_AREA / aspect);
  return Math.round(Math.min(MAX_H, Math.max(MIN_H, raw)) * 10) / 10;
}

export function IntegrationsGrid() {
  return (
    <section
      id="integrations"
      data-nav-theme="dark"
      aria-labelledby="integrations-heading"
      className="w-full bg-black px-6 py-20 text-white md:px-14 xl:px-18 xl:py-28"
    >
      <div className="mx-auto w-full max-w-[var(--container-site)]">
        <Reveal className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <Eyebrow className="text-white/50">{integrations.eyebrow}</Eyebrow>
          <h2
            id="integrations-heading"
            className="mt-4 text-display-sm font-light leading-[1.2] tracking-[-0.4px] text-white md:text-display-lg md:tracking-[-1px]"
          >
            {integrations.headline[0]}
            <br />
            {integrations.headline[1]}
          </h2>
          <p className="mt-5 max-w-[600px] text-[16px] leading-[26px] text-white/60">
            {integrations.subhead}
          </p>
        </Reveal>

        {/* Stagger runs on the 5 columns, deliberately not on all 25 cells. */}
        <RevealGroup
          stagger={0.07}
          className="mt-14 grid grid-cols-1 gap-x-5 gap-y-12 [--logo-scale:0.88px] md:mt-16 md:grid-cols-3 md:gap-y-14 md:[--logo-scale:1px] xl:mt-20 xl:grid-cols-5 xl:[--logo-scale:1.08px]"
        >
          {integrations.categories.map((category) => (
            <RevealItem key={category.id}>
              {/* Hairline under the label, not between columns: a vertical rule would
                  hang against nothing where the 5 columns wrap to 3 at md. */}
              <h3 className="border-b border-white/[0.12] pb-3 text-center">
                <Eyebrow className="text-[11px] tracking-[1.2px] text-white/45">
                  {category.label}
                </Eyebrow>
              </h3>

              <ul className="mt-3 grid grid-cols-2 gap-2 md:mt-4 md:grid-cols-1 md:gap-2.5">
                {integrationLogos[category.id].map((logo) => (
                  <li
                    key={logo.src}
                    className="flex h-[60px] items-center justify-center overflow-hidden rounded-card bg-cream px-4 md:h-16 md:px-5 xl:h-[72px] xl:px-6"
                  >
                    {/* Plain <img>, not SmartImage: its dashed placeholder would invent a
                        cell for a logo we don't have. A 404 showing alt text is honest.
                        width/height reserve the box so lazy decode costs no CLS. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src}
                      alt={logo.name}
                      width={logo.w}
                      height={logo.h}
                      loading="lazy"
                      decoding="async"
                      style={
                        {
                          "--logo-h": opticalHeight(logo.w, logo.h),
                        } as React.CSSProperties
                      }
                      className="integration-mark w-auto max-w-full shrink-0 object-contain"
                    />
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
