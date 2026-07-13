import { hero } from "@/lib/content";
import { HeroGradientCanvas } from "@/components/ui/HeroGradientCanvas";
import { CallWidget } from "@/components/ui/CallWidget";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

// §3 — hero over the animated green WebGL background + interactive call widget.
export function Hero() {
  return (
    <section
      data-nav-theme="dark"
      className="relative flex h-[calc(100svh-2.25rem)] w-full items-center overflow-hidden bg-ink text-white"
    >
      <HeroGradientCanvas />

      <div className="relative z-10 mx-auto w-full max-w-[var(--container-site)] px-6 pt-24 pb-12 md:px-14 xl:px-18">
        <div className="max-w-[640px]">
          <Reveal as="h1" className="text-balance font-[family-name:var(--font-avantt)] text-display-sm font-medium md:text-headline-md xl:text-display-2xl">
            {hero.headline[0]}
            <br />
            {hero.headline[1]}
          </Reveal>

          <Reveal
            as="p"
            delay={0.08}
            className="mt-5 max-w-[522px] text-[16px] leading-[1.5] text-white/70"
          >
            {hero.subhead}
          </Reveal>

          <Reveal delay={0.16} className="mt-6 flex flex-col gap-4">
            <div>
              <Button variant="light">{hero.cta}</Button>
            </div>
            <CallWidget />
            <p className="font-[family-name:var(--font-gridnik)] text-[12px] uppercase tracking-wide text-white/50">
              {hero.caption}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
