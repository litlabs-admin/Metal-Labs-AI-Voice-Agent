import { omnichannel } from "@/lib/content";
import { assets } from "@/lib/assets";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WordScrollReveal } from "@/components/ui/WordScrollReveal";
import { ChannelCard } from "./omnichannel/ChannelCard";

// The reference draws its eyebrow mark as two offset gradient bars (the second
// rotated 180°) inside a 16x8 box, rather than as an icon.
const TAG_GRADIENT = "linear-gradient(270deg, #0d6b4d 0%, #62f6b5 100%)";

// §4 — white section directly under the hero, ported from the reference template's
// "Problem" section:
// eyebrow + scroll-revealed headline + a zero-gap strip of three hover cards.
// Card hairlines: every card carries its top+left border and the strip closes
// itself with right+bottom, so the grid reads as single 1px rules at every
// breakpoint (3-across, 2-up, or stacked).
export function Omnichannel() {
  return (
    <section
      id="omnichannel"
      data-nav-theme="light"
      className="w-full bg-white px-5 py-20 md:px-[30px] md:py-[100px] xl:py-[140px]"
    >
      <div className="mx-auto flex w-full max-w-[var(--container-site)] flex-col items-center gap-10 md:gap-[60px] xl:gap-20">
        {/* Title block — 828px cap, 20px rhythm, centred (matches the reference) */}
        <div className="flex w-full max-w-[828px] flex-col items-center gap-5">
          <div className="flex w-min items-center gap-1.5 py-1 pr-2">
            <span className="relative h-2 w-4 flex-none">
              <span
                className="absolute left-0 top-1 aspect-[3.579/1] w-[88%]"
                style={{ background: TAG_GRADIENT }}
              />
              <span
                className="absolute right-0 top-0 aspect-[3.5/1] w-[88%] rotate-180"
                style={{ background: TAG_GRADIENT }}
              />
            </span>
            <Eyebrow className="whitespace-pre text-text">{omnichannel.eyebrow}</Eyebrow>
          </div>

          <WordScrollReveal
            text={omnichannel.headline}
            defaultColor="rgba(9, 9, 11, 0.3)"
            activeColor="#09090b"
            className="font-heading text-[26px] font-light leading-[1.2] tracking-[0] md:text-[38px] xl:text-[44px]"
          />

          <p className="max-w-[640px] text-center text-[16px] leading-[26px] text-muted">
            {omnichannel.subhead}
          </p>
        </div>

        <div className="grid w-full grid-cols-1 border-b border-r border-black/10 md:grid-cols-2 xl:grid-cols-3">
          {omnichannel.cards.map((card, i) => (
            <ChannelCard
              key={card.kicker}
              icon={assets.omnichannelIcons[i]}
              kicker={card.kicker}
              title={card.title}
              body={card.body}
              className={i === 2 ? "md:col-span-2 xl:col-span-1" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
