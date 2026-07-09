import { caseCards } from "@/lib/content";
import { assets } from "@/lib/assets";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";

// §10 — two case-study cards side by side.
export function TwoCaseCards() {
  return (
    <section
      data-nav-theme="light"
      className="w-full bg-cream-2 px-6 pt-0 md:px-14 xl:px-18"
    >
      <Reveal className="mx-auto flex max-w-[var(--container-site)] flex-col gap-2 md:flex-row">
        {caseCards.map((card, i) => (
          <div
            key={i}
            className="relative flex min-h-[360px] flex-1 flex-col justify-end overflow-hidden bg-ink-3 p-6 md:h-100 md:p-8"
          >
            {/* Background image — TODO: replace with Metal Labs case study */}
            <SmartImage
              src={assets.caseCards[i].bg}
              alt=""
              placeholderLabel="case study background"
              placeholderTheme="dark"
              className="absolute inset-0 h-full w-full"
              imgClassName="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="relative z-10 text-white">
              {/* Logo placeholder */}
              <div className="mb-4 inline-flex items-center rounded-chip border border-dashed border-white/30 px-3 py-1.5 font-[family-name:var(--font-gridnik)] text-[10px] uppercase tracking-wide text-white/60">
                {card.logo.replace(/^\[|\]$/g, "")}
              </div>
              <p className="max-w-[360px] text-[18px] font-medium leading-[1.3] text-white">
                {card.result.replace(/^\[|\]$/g, "")}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 active:scale-95">
                  {card.button}
                </button>
                <div className="flex gap-2">
                  {card.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-chip border border-white/20 px-2.5 py-1 font-[family-name:var(--font-gridnik)] text-[10px] uppercase tracking-wide text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
