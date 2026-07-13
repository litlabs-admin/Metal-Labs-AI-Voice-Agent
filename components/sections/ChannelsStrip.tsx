import { channels } from "@/lib/content";
import { assets } from "@/lib/assets";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { IntegrationCarousel } from "@/components/ui/IntegrationCarousel";

// §7 - dark band: centered eyebrow + headline, with the full-bleed integration carousel
// directly beneath (channel tiles stepping past the Metal Labs hub).
export function ChannelsStrip() {
  return (
    <section
      id="channels"
      data-nav-theme="dark"
      className="w-full overflow-hidden bg-black py-20 text-white xl:py-24"
    >
      <div className="px-6 md:px-14 xl:px-18">
        <Reveal className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          <Eyebrow className="text-white/50">{channels.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-display-sm font-light leading-[1.2] tracking-[-0.4px] text-white md:text-display-lg md:tracking-[-1px]">
            {channels.headline[0]}
            <br />
            {channels.headline[1]}
          </h2>
        </Reveal>
      </div>

      {/* Full-bleed: the row runs edge to edge, outside the 1296px container. */}
      <Reveal delay={0.1} className="mt-10 xl:mt-14">
        <IntegrationCarousel icons={[...assets.channels.icons]} />
      </Reveal>
    </section>
  );
}
