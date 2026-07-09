import { why } from "@/lib/content";
import { assets } from "@/lib/assets";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";

// §8 — left heading column + right 6 icon cells (2 columns), staggered reveal.
export function WhyMetalLabs() {
  return (
    <section
      id="use-cases"
      data-nav-theme="light"
      className="w-full bg-cream-2 px-6 py-20 md:px-14 xl:px-18 xl:py-28"
    >
      <div className="mx-auto grid max-w-[var(--container-site)] grid-cols-1 gap-12 xl:grid-cols-[1fr_1.5fr] xl:gap-16">
        {/* Heading column */}
        <Reveal className="max-w-[420px]">
          <Eyebrow>{why.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-display-sm font-medium leading-[1.05] tracking-[-1px] text-text md:text-display-lg md:tracking-[-2.9px]">
            {why.headline[0]}
            <br />
            {why.headline[1]}
          </h2>
          <p className="mt-5 text-[16px] leading-[1.5] text-muted">{why.subhead}</p>
        </Reveal>

        {/* 6 cells in two columns */}
        <RevealGroup className="flex flex-wrap content-start gap-x-12 gap-y-8" stagger={0.07}>
          {why.cells.map((cell, i) => (
            <RevealItem
              key={cell.label}
              className="w-full md:w-[calc(50%-1.5rem)]"
            >
              <div className="flex flex-col items-start gap-4 md:flex-row">
                <SmartImage
                  src={assets.enterpriseIcons[i]}
                  alt=""
                  placeholderLabel="icon"
                  imgClassName="h-6 w-6 shrink-0 object-contain"
                  className="h-6 w-6 shrink-0"
                />
                <div>
                  <h3 className="text-[17px] font-semibold text-text">{cell.label}</h3>
                  <p className="mt-2 text-[15px] leading-[1.5] text-muted">{cell.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
