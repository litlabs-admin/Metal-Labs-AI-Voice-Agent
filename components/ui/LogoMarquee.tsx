"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

// Infinite marquee row of logos (duplicated track). Falls back to a subtle dashed
// tile if a logo file is missing (e.g. fetch-assets hasn't run / a URL 404'd).
export function LogoMarquee({
  logos,
  reverse = false,
  duration = 40,
}: {
  logos: string[];
  reverse?: boolean;
  duration?: number;
}) {
  const track = [...logos, ...logos];
  return (
    <div className="marquee-mask w-full min-w-0 max-w-full overflow-hidden">
      <div
        className="flex w-max gap-4 animate-ml-marquee"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {track.map((src, i) => (
          <LogoTile key={i} src={src} />
        ))}
      </div>
    </div>
  );
}

function LogoTile({ src }: { src: string }) {
  const [broken, setBroken] = useState(false);
  // 72px cell holding a 40px logo → generous breathing room, matching Vapi. Natural colors.
  return (
    <div className="flex size-18 shrink-0 items-center justify-center">
      {broken ? (
        <div className="size-10 rounded-chip border border-dashed border-white/20" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className={cn("size-10 object-contain")}
          onError={() => setBroken(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}
