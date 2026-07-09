import { channels } from "@/lib/content";
import { assets } from "@/lib/assets";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { LogoMarquee } from "@/components/ui/LogoMarquee";

// §7 — dark band: eyebrow + headline (left) + two-row integration logo marquee (right).
export function ChannelsStrip() {
  return (
    <section
      id="solutions"
      data-nav-theme="dark"
      className="w-full bg-black px-6 py-20 text-white md:px-14 xl:px-18 xl:py-24"
    >
      <div className="mx-auto flex max-w-[var(--container-site)] flex-col gap-10 xl:flex-row xl:items-end xl:gap-16">
        <Reveal className="xl:max-w-[330px] xl:shrink-0">
          <Eyebrow className="text-white/50">{channels.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-display-sm font-medium leading-[1.05] tracking-[-1px] text-white md:text-display-lg md:tracking-[-2.9px]">
            {channels.headline[0]}
            <br />
            {channels.headline[1]}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="flex min-w-0 flex-1 flex-col gap-4">
          {/* TODO: replace with channel & LOS / CRM integration logos */}
          <LogoMarquee logos={[...assets.integrations.top]} duration={44} />
          <LogoMarquee logos={[...assets.integrations.bottom]} reverse duration={52} />
        </Reveal>
      </div>
    </section>
  );
}
