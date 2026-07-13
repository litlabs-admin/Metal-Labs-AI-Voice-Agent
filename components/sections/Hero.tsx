import { hero } from "@/lib/content";
import { HeroGradientCanvas } from "@/components/ui/HeroGradientCanvas";
import { HeroActions } from "@/components/ui/HeroActions";
import { Reveal } from "@/components/ui/Reveal";

// §3 — hero: copy anchored bottom-left so the background imagery carries the top
// two-thirds of the frame.
export function Hero() {
  return (
    <section
      data-nav-theme="dark"
      className="relative flex h-[calc(100svh-2.25rem)] w-full items-end overflow-hidden bg-ink text-white"
    >
      <HeroGradientCanvas />

      {/* Deliberately NOT in the site container — the hero copy hugs the viewport's
          bottom-left corner rather than aligning to the centered grid. */}
      <div className="relative z-10 w-full px-6 pt-24 pb-8 md:px-10 md:pb-10">
        <div className="max-w-180">
          <Reveal
            as="h1"
            className="text-balance font-heading text-display-sm font-light md:text-headline-xs xl:text-headline-sm"
          >
            {hero.headline[0]}
            <br />
            {hero.headline[1]}
          </Reveal>

          <Reveal delay={0.08} className="mt-7 flex flex-col gap-4">
            <HeroActions />
            <p className="font-illustration text-[12px] uppercase tracking-wide text-white/50">
              {hero.caption}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
