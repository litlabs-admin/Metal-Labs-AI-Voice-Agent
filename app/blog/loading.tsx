import { BlogListSkeleton, FeaturedPostSkeleton } from "@/components/ui/BlogSkeleton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { blog } from "@/lib/content";

// Streamed instantly while getPublishedPosts() resolves. Wrapped in a Suspense
// boundary by Next automatically. Mirrors the real page's featured post +
// grid geometry so the swap to content does not shift layout.
export default function BlogLoading() {
  return (
    <>
      <section data-nav-theme="light" className="w-full bg-cream px-6 pt-28 pb-16 md:px-14 md:pt-32 xl:px-18">
        <div className="mx-auto w-full max-w-[var(--container-site)]">
          <Eyebrow className="mb-6 block">{blog.eyebrow}</Eyebrow>
          <FeaturedPostSkeleton />
        </div>
      </section>

      <section className="w-full border-t border-hairline bg-cream px-6 py-16 md:px-14 xl:px-18">
        <div className="mx-auto flex w-full max-w-[var(--container-site)] flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-[28px] font-light text-text md:text-[32px]">
              {blog.allTitle}
            </h2>
            <p className="text-[15px] text-muted">{blog.allSubtitle}</p>
          </div>
          <BlogListSkeleton />
        </div>
      </section>
    </>
  );
}
