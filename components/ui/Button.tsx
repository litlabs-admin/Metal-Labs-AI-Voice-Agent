import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "light" | "dark" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn px-5 py-2.5 text-[15px] font-button font-normal " +
  "transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap";

const variants: Record<Variant, string> = {
  // Dark pill on light backgrounds (reference primary CTA)
  primary: "bg-black text-white hover:bg-black/85",
  // White pill on dark backgrounds
  light: "bg-white text-black hover:bg-white/90",
  // Dark pill on green/dark bands
  dark: "bg-black text-white hover:bg-ink-2",
  ghost:
    "bg-white/10 text-white border border-white/15 hover:bg-white/15 backdrop-blur-sm",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: { variant?: Variant } & ComponentPropsWithoutRef<"button">) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}
