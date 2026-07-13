import { hero } from "@/lib/content";
import { HeroGradientCanvas } from "@/components/ui/HeroGradientCanvas";
import { HeroActions } from "@/components/ui/HeroActions";
import { Reveal } from "@/components/ui/Reveal";

// §3 - hero: copy anchored bottom-left so the background imagery carries the top
// two-thirds of the frame.
export function Hero() {
  return (
    <section
      data-nav-theme="dark"
      className="relative flex h-[calc(100svh-2.25rem)] w-full items-end overflow-hidden bg-ink text-white"
    >
      <HeroGradientCanvas />

      {/* Deliberately NOT in the site container - the hero copy hugs the viewport's
          bottom-left corner rather than aligning to the centered grid. */}
      {/* Two columns sharing one baseline: headline hugs the bottom-left corner,
          sub-copy + CTAs sit bottom-right, mirroring the reference composition. */}
      <div className="relative z-10 flex w-full flex-col gap-10 px-6 pt-24 pb-8 md:flex-row md:items-end md:justify-between md:gap-16 md:px-10 md:pb-10">
        <div className="max-w-180">
          <Reveal
            as="h1"
            className="text-balance font-heading text-display-sm font-light md:text-headline-xs xl:text-headline-sm"
          >
            {hero.headline[0]}
            <br />
            {hero.headline[1]}
          </Reveal>

          <Reveal
            as="p"
            delay={0.12}
            className="mt-7 font-illustration text-[12px] uppercase tracking-wide text-white/50"
          >
            {hero.caption}
          </Reveal>
        </div>

        <Reveal
          delay={0.08}
          className="flex shrink-0 flex-col items-start gap-6 md:max-w-md md:items-end md:pb-1 md:text-right"
        >
          <p className="text-pretty text-base font-light leading-snug text-white/85 md:text-lg">
            {hero.subhead}
          </p>
          <HeroActions />
        </Reveal>
      </div>
    </section>
  );
}
