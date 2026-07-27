import Image from "next/image";
import { CoverFallback } from "@/components/sections/blog/CoverFallback";
import { Reveal } from "@/components/ui/Reveal";
import { formatPostDate, type BlogPost } from "@/lib/blog";

// Article masthead: centred meta line + title on cream, then a wide cover
// image below - mirrors the reference's centred editorial layout.
export function PostHeader({ post }: { post: BlogPost }) {
  return (
    <>
      <section data-nav-theme="light" className="w-full bg-cream px-6 pt-28 pb-10 text-center md:px-14 md:pt-32 xl:px-18">
        <Reveal className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-5">
          <p className="font-illustration text-[13px] text-muted">
            {post.author} · <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time> ·{" "}
            {post.readingMinutes} min read
          </p>

          <h1 className="text-display-sm font-light leading-[1.2] tracking-[-0.4px] text-text md:text-headline-xs">
            {post.title}
          </h1>
        </Reveal>
      </section>

      <div className="w-full bg-cream px-6 pt-6 md:px-14 xl:px-18">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-media bg-cream-2">
            {post.cover ? (
              <Image
                src={post.cover.url}
                alt={post.cover.alt}
                fill
                // Above the fold on every article, so it is the LCP candidate.
                priority
                sizes="(max-width: 1100px) 100vw, 1100px"
                className="object-cover"
              />
            ) : (
              <CoverFallback />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
