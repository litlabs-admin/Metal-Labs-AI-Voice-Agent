import { unified } from "@/lib/content";
import { assets } from "@/lib/assets";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { ProductLottie } from "@/components/ui/ProductLottie";

// §5 - cream section: centered eyebrow + headline + subhead, then a 2-column row
// (sub-feature text left, product screenshot right) matching Vapi's airfoil product layout.
export function UnifiedPlatform() {
  return (
    <section
      id="product"
      data-nav-theme="light"
      className="w-full bg-cream-2 px-6 py-20 md:px-14 xl:px-18 xl:py-28"
    >
      <div className="mx-auto max-w-[var(--container-site)]">
        <Reveal className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          <Eyebrow>{unified.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-display-sm font-light leading-[1.2] tracking-[-0.4px] text-text md:text-display-lg md:tracking-[-1px]">
            {unified.headline[0]}
            <br />
            {unified.headline[1]}
          </h2>
          <p className="mt-5 max-w-[560px] text-[16px] leading-[1.5] text-muted">
            {unified.subhead}
          </p>
        </Reveal>

        {/* 2-column row: sub-feature (left) + product screenshot (right) */}
        <Reveal
          delay={0.1}
          className="mt-14 grid grid-cols-1 items-center gap-10 xl:grid-cols-[0.85fr_1.15fr] xl:gap-16"
        >
          <div className="max-w-[440px]">
            <SmartImage
              src={assets.product.waveformIcon}
              alt=""
              placeholderLabel="icon"
              imgClassName="h-7 w-7 object-contain"
              className="h-7 w-7"
            />
            <h3 className="mt-5 text-[24px] font-light leading-[1.3] tracking-[-0.2px] text-text md:text-[28px]">
              {unified.subFeature.heading}
            </h3>
            <p className="mt-4 text-[16px] leading-[1.5] text-muted">
              {unified.subFeature.body}
            </p>
          </div>

          {/* Product screenshot (Lottie stand-in). TODO: replace with Metal Labs screenshot */}
          <div className="overflow-hidden rounded-media bg-ink shadow-[0_18px_45px_#00000080] ring-1 ring-inset ring-white/10">
            <ProductLottie
              src={assets.product.agentsLottie}
              label="Agents dashboard screenshot"
              className="aspect-[16/10] w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
