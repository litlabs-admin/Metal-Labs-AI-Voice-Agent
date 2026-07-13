import { closing } from "@/lib/content";
import { assets } from "@/lib/assets";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

// Rotating conic sweep — used as a thin animated gradient border on the dark button
// (Vapi's "Sign Up" treatment): the button masks the center, leaving only a ~2px glowing edge.
const CONIC =
  "conic-gradient(from 90deg, #5f3f8b00 0deg 230deg, #2b1a46 275deg, #48f5ee 298deg, #ffffb8 312deg, #ff6b62 330deg, #52253a 352deg, #5f3f8b00 360deg)";

// §12 — closing CTA: static green texture band + spinning conic-glow on the primary button.
export function ClosingCTA() {
  return (
    <section
      id="about"
      data-nav-theme="dark"
      className="relative w-full overflow-hidden bg-black text-white"
    >
      {/* static green texture (reference: /airfoil/green-texture.jpg) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.hero.greenTexture})` }}
      />
      <div className="absolute inset-0 bg-black/32" />

      <Reveal className="relative z-10 mx-auto flex max-w-[var(--container-site)] flex-col items-center justify-center gap-6 px-6 py-20 text-center xl:py-28">
        <h2 className="max-w-[820px] text-display-sm font-light leading-[1.2] tracking-[-0.4px] text-white md:text-display-lg md:tracking-[-1px]">
          {closing.headline}
        </h2>
        <p className="max-w-[600px] text-[17px] leading-[1.5] text-white/80">
          {closing.subline}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          {/* Plain white button (Vapi "Contact Sales") */}
          <Button variant="light">{closing.buttons[0]}</Button>

          {/* Dark button with a thin gradient border; a light arc travels around it (Vapi "Sign Up") */}
          <div className="relative inline-flex overflow-hidden rounded-[10px] p-[1.5px]">
            {/* rotating conic sweep, clipped to the button so only a moving arc shows on the border */}
            <span
              className="animate-ml-spin pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2"
              style={{ background: CONIC, animationDuration: "4s" }}
              aria-hidden
            />
            <button
              type="button"
              className="relative z-10 inline-flex items-center justify-center gap-2 rounded-btn bg-[#0b0b0e] px-6 py-3 text-[15px] font-normal text-white transition-transform duration-300 active:scale-95"
            >
              {closing.buttons[1]}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
