import Link from "next/link";
import { BlogCard } from "@/components/sections/blog/BlogCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { BlogPost } from "@/lib/blog";
import { blog } from "@/lib/content";

// Up to 3 other posts, shown at the foot of an article before the closing CTA.
export function MorePosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section data-nav-theme="light" className="w-full border-t border-hairline bg-cream px-6 py-16 md:px-14 xl:px-18">
      <div className="mx-auto flex w-full max-w-[var(--container-site)] flex-col gap-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-[28px] font-light text-text md:text-[32px]">
            {blog.morePostsTitle}
          </h2>
          <Link
            href="/blog"
            className="shrink-0 text-[14px] font-medium text-text underline decoration-mint decoration-2 underline-offset-4"
          >
            {blog.viewAllLabel} →
          </Link>
        </div>

        <RevealGroup className="grid w-full grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3" stagger={0.06}>
          {posts.map((post) => (
            <RevealItem key={post.id} className="h-full">
              <BlogCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
