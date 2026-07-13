import { cn } from "@/lib/cn";

// Clearly-marked, swappable placeholder for any [amber-bracketed] asset in the brief.
// Renders a dashed frame + label so missing assets are obvious. TODO: swap for real assets.
export function PlaceholderFrame({
  label,
  className,
  theme = "light",
}: {
  label: string;
  className?: string;
  theme?: "light" | "dark";
}) {
  const strip = label.replace(/^\[|\]$/g, "");
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${strip}`}
      className={cn(
        "flex items-center justify-center rounded-card border-2 border-dashed p-4 text-center",
        theme === "dark"
          ? "border-white/25 bg-white/5 text-white/60"
          : "border-black/20 bg-black/[0.03] text-black/50",
        className,
      )}
    >
      <span className="font-illustration text-[11px] uppercase leading-relaxed tracking-wide">
        {strip}
      </span>
    </div>
  );
}
