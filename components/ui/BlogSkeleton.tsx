import { cn } from "@/lib/cn";

// Loading placeholders for the blog routes. Server components with no motion
// library involved - the shimmer is the Tailwind `animate-pulse` utility, which
// globals.css already clamps under prefers-reduced-motion.

function Bar({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-chip bg-hairline/50", className)} />;
}

/** Matches BlogCard's geometry so the swap to real content does not shift layout. */
export function BlogCardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="aspect-[16/10] w-full animate-pulse rounded-card bg-hairline/40" />
      <div className="flex flex-1 flex-col gap-2">
        <Bar className="h-5 w-full" />
        <Bar className="h-5 w-3/4" />
        <Bar className="h-3 w-24" />
      </div>
    </div>
  );
}

export function BlogListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid w-full grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}

/** Matches FeaturedPost's geometry: cover left, meta + title right. */
export function FeaturedPostSkeleton() {
  return (
    <div className="grid w-full gap-8 md:grid-cols-[1.35fr_1fr] md:items-center md:gap-12">
      <div className="aspect-[16/10] w-full animate-pulse rounded-media bg-hairline/40" />
      <div className="flex flex-col gap-4">
        <Bar className="h-3 w-28" />
        <Bar className="h-9 w-full" />
        <Bar className="h-9 w-2/3" />
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-5/6" />
      </div>
    </div>
  );
}

/** Article skeleton: centred meta + title band, then a wide cover, then prose lines. */
export function BlogPostSkeleton() {
  return (
    <>
      <section className="w-full bg-cream px-6 pt-28 pb-10 md:px-14 md:pt-32 xl:px-18">
        <div className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-5">
          <Bar className="h-3 w-56" />
          <Bar className="h-9 w-full" />
          <Bar className="h-9 w-2/3" />
        </div>
      </section>

      <div className="w-full bg-cream px-6 pt-6 md:px-14 xl:px-18">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="aspect-[16/9] w-full animate-pulse rounded-media bg-hairline/40" />
        </div>

        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 py-14">
          {Array.from({ length: 8 }, (_, index) => (
            <Bar key={index} className={cn("h-4", index % 4 === 3 ? "w-2/3" : "w-full")} />
          ))}
        </div>
      </div>
    </>
  );
}
