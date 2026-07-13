import { cn } from "@/lib/cn";

// Inter (illustration face), 10px, uppercase, tracked - eyebrow/label style.
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
        "font-illustration text-eyebrow font-medium uppercase text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
