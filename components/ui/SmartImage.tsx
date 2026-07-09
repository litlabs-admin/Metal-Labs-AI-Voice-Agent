"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { PlaceholderFrame } from "./PlaceholderFrame";

// Plain <img> for CDN-fetched reference assets in /public, with a graceful dashed
// placeholder fallback if the file is missing (fetch-assets not run / URL 404'd).
export function SmartImage({
  src,
  alt,
  className,
  placeholderLabel,
  placeholderTheme = "light",
  imgClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  placeholderLabel: string;
  placeholderTheme?: "light" | "dark";
  imgClassName?: string;
}) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <PlaceholderFrame
        label={placeholderLabel}
        theme={placeholderTheme}
        className={className}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      loading="lazy"
      className={cn(imgClassName ?? "h-full w-full object-cover", className)}
    />
  );
}
