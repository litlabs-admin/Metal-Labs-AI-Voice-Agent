import { cn } from "@/lib/cn";

// Channel/integration strip: a full-bleed row of app tiles scrolling continuously in one
// direction. Pure CSS marquee - no hover pause, no step/settle; it never stops. The track
// is a duplicated icon list translated by exactly half its width, so the seam is invisible.
const REPEATS = 4; // enough copies of the icon list that one half of the track outruns any viewport

export function IntegrationCarousel({
  icons,
  duration = 40,
  className,
}: {
  icons: string[];
  duration?: number;
  className?: string;
}) {
  const half = Array.from(
    { length: REPEATS * icons.length },
    (_, i) => icons[i % icons.length],
  );
  const track = [...half, ...half];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden py-10 [--gap:22px] [--tile:56px] md:py-14 md:[--gap:30px] md:[--tile:76px]",
        className,
      )}
      aria-hidden="true"
      style={{
        // Longer fade than the shared .marquee-mask: the row is full-bleed, so the ends
        // need room to dissolve rather than hit a hard edge.
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%)",
      }}
    >
      <div
        className="animate-ml-marquee-half flex w-max gap-[var(--gap)]"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {track.map((src, i) => (
          <div
            key={i}
            className="flex size-[var(--tile)] shrink-0 items-center justify-center rounded-[5px] bg-white/[0.04] shadow-[0_3px_3px_0_rgba(0,0,0,0.04)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading="lazy"
              className="size-[calc(var(--tile)*0.52)] object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
