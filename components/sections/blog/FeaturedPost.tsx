import Image from "next/image";
import Link from "next/link";
import { CoverFallback } from "@/components/sections/blog/CoverFallback";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { formatPostDate, type BlogPost } from "@/lib/blog";
import { blog } from "@/lib/content";

// Newest post, presented large above the "All Posts" grid. Its title is the
// page's <h1> - the listing has no separate hero heading, mirroring the
// reference layout where the featured post itself opens the page.
export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <section data-nav-theme="light" className="w-full bg-white px-6 pt-28 pb-16 md:px-14 md:pt-32 xl:px-18">
      <Reveal className="mx-auto w-full max-w-[var(--container-site)]">
        <Eyebrow className="mb-6 block">{blog.eyebrow}</Eyebrow>

        <Link href={`/blog/${post.slug}`} className="group grid w-full gap-8 md:grid-cols-[1.35fr_1fr] md:items-center md:gap-12">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-media bg-cream-2">
            {post.cover ? (
              <Image
                src={post.cover.url}
                alt={post.cover.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 ease-(--ease-out-ml) group-hover:scale-[1.03]"
              />
            ) : (
              <CoverFallback />
            )}
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-illustration text-[13px] text-muted">
              {formatPostDate(post.publishedAt)}
            </span>

            <h1 className="text-display-sm font-light leading-[1.2] tracking-[-0.4px] text-text md:text-headline-xs">
              {post.title}
            </h1>

            <p className="line-clamp-3 text-[16px] leading-[1.6] text-muted">
              {post.excerpt}
            </p>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
