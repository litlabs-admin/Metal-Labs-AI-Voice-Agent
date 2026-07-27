import { LogoMark } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

// Stand-in for a post with no Cover Image attachment. Fills the same aspect box
// the real image would occupy, so a missing cover never collapses the layout or
// shifts the grid - it just reads as an unillustrated post.
export function CoverFallback({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex h-full w-full items-center justify-center bg-ink bg-[radial-gradient(circle_at_30%_20%,rgba(98,246,181,0.22),transparent_60%)]",
        className,
      )}
    >
      <LogoMark className="h-10 w-10 text-white/25" />
    </div>
  );
}
