import { feature } from "@/lib/content";
import { assets } from "@/lib/assets";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { ProductLottie } from "@/components/ui/ProductLottie";

// §6 — two-column feature: analytics/rescheduler screenshot (left) + icon/headline/body (right).
export function FeatureBlock() {
  return (
    <section
      data-nav-theme="light"
      className="w-full bg-cream-2 px-6 pb-20 md:px-14 xl:px-18 xl:pb-28"
    >
      <div className="mx-auto grid max-w-[var(--container-site)] grid-cols-1 items-center gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:gap-16">
        {/* Screenshot (Lottie stand-in). TODO: replace with Metal Labs screenshot */}
        <Reveal className="order-2 xl:order-1">
          <div className="overflow-hidden rounded-media bg-ink shadow-[0_18px_45px_#00000080] ring-1 ring-inset ring-white/10">
            <ProductLottie
              src={assets.product.reschedulerLottie}
              label="Appointment rescheduler / analytics screenshot"
              className="aspect-[16/10] w-full"
            />
          </div>
        </Reveal>

        <Reveal delay={0.08} className="order-1 max-w-[480px] xl:order-2">
          <SmartImage
            src={assets.product.thermometerIcon}
            alt=""
            placeholderLabel="icon"
            imgClassName="h-7 w-7 object-contain"
            className="h-7 w-7"
          />
          <h2 className="mt-5 text-display-sm font-medium leading-[1.1] tracking-[-1px] text-text md:text-[44px] md:tracking-[-2px]">
            {feature.headline[0]}
            <br />
            {feature.headline[1]}
          </h2>
          <p className="mt-5 text-[16px] leading-[1.5] text-muted">{feature.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
