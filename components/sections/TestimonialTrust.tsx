import { testimonial } from "@/lib/content";
import { assets } from "@/lib/assets";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldText } from "@/components/ui/BoldText";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";

// §4 — featured testimonial (left) + trust logo wall (right).
export function TestimonialTrust() {
  return (
    <section
      data-nav-theme="light"
      className="w-full bg-white px-6 py-14 md:px-14 xl:px-18 xl:py-24"
    >
      <div className="mx-auto grid max-w-[var(--container-site)] grid-cols-1 gap-12 xl:grid-cols-[1.4fr_1fr] xl:gap-16">
        {/* Quote */}
        <Reveal className="max-w-[640px]">
          <blockquote className="text-[22px] leading-[1.4] text-text md:text-[26px]">
            &ldquo;<BoldText text={testimonial.quote} />&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <SmartImage
              src={assets.quoteCompanyLogo}
              alt="Customer company logo"
              placeholderLabel="Company logo"
              imgClassName="h-6 w-auto object-contain"
              className="h-6 w-auto"
            />
            <span className="font-[family-name:var(--font-gridnik)] text-[12px] uppercase tracking-wide text-muted">
              {testimonial.attribution}
            </span>
          </div>
          {/* TODO: replace with a real, attributable customer quote */}
        </Reveal>

        {/* Trust logo wall */}
        <Reveal delay={0.08} className="flex flex-col gap-6 xl:items-start">
          <Eyebrow>{testimonial.eyebrow}</Eyebrow>
          {/* TODO: replace with real US-lender logos */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {assets.trustLogos.map((src, i) => (
              <SmartImage
                key={i}
                src={src}
                alt="Lender logo"
                placeholderLabel="Lender logo"
                imgClassName="h-7 w-auto max-w-[140px] object-contain opacity-70 grayscale"
                className="h-7 w-full"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
