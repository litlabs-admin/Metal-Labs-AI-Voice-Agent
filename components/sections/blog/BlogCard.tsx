import Image from "next/image";
import Link from "next/link";
import { CoverFallback } from "@/components/sections/blog/CoverFallback";
import { formatPostDate, type BlogPost } from "@/lib/blog";

// Grid card: cover, title, date. No border, badge or excerpt - mirrors the
// reference's minimal "All Posts" grid.
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col gap-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card bg-cream-2">
        {post.cover ? (
          <Image
            src={post.cover.url}
            alt={post.cover.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-(--ease-out-ml) group-hover:scale-[1.03]"
          />
        ) : (
          <CoverFallback />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="line-clamp-2 font-heading text-[20px] font-light leading-[1.35] tracking-[-0.2px] text-text">
          {post.title}
        </h3>

        <span className="font-illustration text-[13px] text-muted">
          {formatPostDate(post.publishedAt)}
        </span>
      </div>
    </Link>
  );
}
