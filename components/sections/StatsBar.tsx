import { stats } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";

// §11 — centered headline + 5-up stat row with count-up + hairline dividers.
export function StatsBar() {
  return (
    <section
      data-nav-theme="light"
      className="w-full bg-cream-2 px-6 py-20 md:px-14 xl:px-18 xl:py-28"
    >
      <div className="mx-auto max-w-[var(--container-site)]">
        <Reveal>
          <h2 className="text-center text-display-sm font-medium leading-[1.05] tracking-[-1px] text-text md:text-[48px] md:tracking-[-2px]">
            {stats.headline}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap justify-center xl:flex-nowrap">
            {stats.items.map((s, i) => (
              <div
                key={i}
                className="flex w-1/2 flex-col items-center gap-2 px-4 py-4 text-center sm:w-1/3 xl:w-auto xl:flex-1 xl:border-r xl:border-[var(--color-divider)] xl:last:border-r-0"
              >
                <span className="text-[40px] font-medium leading-none tracking-[-1.5px] text-text md:text-[48px]">
                  <StatCounter value={s.value} display={s.display} suffix={s.suffix} />
                </span>
                <span className="text-[14px] text-muted">{s.label}</span>
              </div>
            ))}
          </div>
          {/* TODO: replace [STAT] with real metrics */}
        </Reveal>
      </div>
    </section>
  );
}
