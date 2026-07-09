"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { PlaceholderFrame } from "./PlaceholderFrame";

// Loads a Lottie JSON (the product/agents dashboard visuals, as on Vapi) and plays it.
// TODO: replace with Metal Labs screenshots. Falls back to a dashed placeholder on error.
export function ProductLottie({
  src,
  label,
  className,
}: {
  src: string;
  label: string;
  className?: string;
}) {
  const [data, setData] = useState<object | null>(null);
  const [broken, setBroken] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let alive = true;
    fetch(src)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => alive && setData(j))
      .catch(() => alive && setBroken(true));
    return () => {
      alive = false;
    };
  }, [src]);

  if (broken) {
    return <PlaceholderFrame label={label} theme="dark" className={cn("min-h-64", className)} />;
  }
  if (!data) {
    return (
      <div
        className={cn(
          "min-h-64 animate-ml-pulse rounded-media bg-white/5",
          className,
        )}
      />
    );
  }
  return (
    <Lottie
      animationData={data}
      loop={!reduce}
      autoplay={!reduce}
      className={cn("h-full w-full", className)}
    />
  );
}
