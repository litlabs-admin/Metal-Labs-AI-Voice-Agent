import { cn } from "@/lib/cn";

// Gridnik, 10px, uppercase, tracked — the reference eyebrow/label style.
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-[family-name:var(--font-gridnik)] text-eyebrow font-medium uppercase text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
