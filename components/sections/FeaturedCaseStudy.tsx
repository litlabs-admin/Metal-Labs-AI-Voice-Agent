import { featuredCase } from "@/lib/content";
import { assets } from "@/lib/assets";
import { Reveal } from "@/components/ui/Reveal";
import { PlayIcon } from "@/components/ui/Icons";

// §9 — full-width dark featured case-study card with background video + overlay.
export function FeaturedCaseStudy() {
  return (
    <section
      data-nav-theme="light"
      className="w-full bg-cream-2 px-6 pt-4 pb-2 md:px-14 xl:px-18"
    >
      <Reveal className="mx-auto max-w-[var(--container-site)]">
        <div className="relative flex min-h-[440px] flex-col justify-end overflow-hidden bg-ink-2 p-6 md:h-[500px] md:p-10 xl:h-[585px]">
          {/* Background video */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={assets.featuredCase.video}
            muted
            loop
            autoPlay
            playsInline
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 max-w-[760px] text-white">
            {/* Customer logo — TODO: real attributable case study */}
            <div className="mb-6 inline-flex items-center rounded-chip border border-dashed border-white/30 px-3 py-2 font-[family-name:var(--font-gridnik)] text-[11px] uppercase tracking-wide text-white/60">
              {featuredCase.logo.replace(/^\[|\]$/g, "")}
            </div>
            <p className="font-[family-name:var(--font-gridnik)] text-[12px] uppercase tracking-wide text-white/60">
              {featuredCase.category.replace(/^\[|\]$/g, "")}
            </p>
            <blockquote className="mt-4 text-[22px] font-medium leading-[1.3] tracking-[-0.4px] text-white md:text-[30px]">
              {featuredCase.quote.replace(/^\[|\]$/g, "")}
            </blockquote>
            <p className="mt-4 text-[15px] text-white/70">
              {featuredCase.attribution.replace(/^\[|\]$/g, "")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-[14px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 active:scale-95">
                <span className="flex size-6 items-center justify-center rounded-full bg-white text-black">
                  <PlayIcon className="size-3" />
                </span>
                {featuredCase.button}
              </button>
              <div className="flex gap-2">
                {featuredCase.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-chip border border-white/20 px-3 py-1.5 font-[family-name:var(--font-gridnik)] text-[10px] uppercase tracking-wide text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
