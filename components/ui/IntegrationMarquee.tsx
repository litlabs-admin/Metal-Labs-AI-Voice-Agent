import { cn } from "@/lib/cn";
import type { IntegrationLogo } from "@/lib/assets";

// One infinite horizontal row of partner marks, rendered BARE - no per-logo chip. The
// track is the logo list duplicated and translated by exactly half its width plus half a
// gap, so the seam is invisible. Never pauses; no hover state touches it.
//
// The light surface these marks need to be legible is supplied by the caller as a single
// continuous band (see IntegrationsStrip), not by a pill behind each logo.

/** Copies of the list per half-track: enough that one half outruns the widest viewport. */
const REPEATS = 2;

/** Target ink area per mark, in px² at --logo-scale:1px. */
const OPTICAL_AREA = 1900;
const MIN_H = 15; // floor: ultra-wide marks stay legible
const MAX_H = 34; // ceiling: square-ish marks can't outgrow the strip

/**
 * Height (unitless; CSS multiplies by --logo-scale) giving every mark roughly equal ink
 * area regardless of aspect ratio. These marks span 1:1 (ICE) to 7.6:1 (The Work Number);
 * capping height alone would render the widest ~7.6x wider than the narrowest, and
 * capping width inverts the problem. Neither reads as uniform.
 * See the .integration-mark rule in app/globals.css.
 */
export function opticalHeight(w: number, h: number): number {
  const aspect = w / h;
  const raw = Math.sqrt(OPTICAL_AREA / aspect);
  return Math.round(Math.min(MAX_H, Math.max(MIN_H, raw)) * 10) / 10;
}

export function IntegrationMarquee({
  logos,
  duration = 60,
  className,
}: {
  logos: readonly IntegrationLogo[];
  duration?: number;
  className?: string;
}) {
  const half = Array.from(
    { length: REPEATS * logos.length },
    (_, i) => logos[i % logos.length],
  );
  const track = [...half, ...half];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        "[--gap:56px] md:[--gap:72px] xl:[--gap:88px]",
        "[--logo-scale:0.92px] md:[--logo-scale:1px] xl:[--logo-scale:1.1px]",
        className,
      )}
      style={{
        // The row is full-bleed, so the ends need room to dissolve rather than hit a
        // hard edge. Masks the marks only - the band behind them stays solid.
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)",
      }}
    >
      <ul
        className="animate-ml-marquee-half flex w-max items-center gap-[var(--gap)]"
        style={
          { "--marquee-duration": `${duration}s` } as React.CSSProperties
        }
      >
        {track.map((logo, i) => {
          // Only the first pass through the list is real content. Every duplicate is
          // hidden from AT, so each brand is announced exactly once despite N copies.
          const isDuplicate = i >= logos.length;
          return (
            <li
              key={i}
              aria-hidden={isDuplicate || undefined}
              className="flex shrink-0 items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={isDuplicate ? "" : logo.name}
                width={logo.w}
                height={logo.h}
                loading="lazy"
                decoding="async"
                style={
                  {
                    "--logo-h": opticalHeight(logo.w, logo.h),
                  } as React.CSSProperties
                }
                className="integration-mark w-auto max-w-none shrink-0 object-contain"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
