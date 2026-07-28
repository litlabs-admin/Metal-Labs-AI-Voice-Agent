import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FeaturedPost } from "@/components/sections/blog/FeaturedPost";
import { PostGrid } from "@/components/sections/blog/PostGrid";
import { getPublishedPosts } from "@/lib/blog";
import { blog } from "@/lib/content";

// 1 hour ISR. Mirrors BLOG_REVALIDATE in lib/blog.ts - Next requires a literal
// here because this export is read statically at build time.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: blog.metaTitle,
  description: blog.metaDescription,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: blog.metaTitle,
    description: blog.metaDescription,
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: blog.metaTitle,
    description: blog.metaDescription,
  },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    // An empty Airtable table is a normal state, not an error - render a calm
    // message rather than throwing into the error boundary.
    return (
      <section data-nav-theme="light" className="w-full bg-white px-6 pt-28 pb-20 md:px-14 md:pt-32 xl:px-18">
        <div className="mx-auto flex w-full max-w-[var(--container-site)] flex-col items-center gap-3 py-20 text-center">
          <Eyebrow className="mb-3">{blog.eyebrow}</Eyebrow>
          <h1 className="text-[24px] font-light text-text">{blog.emptyTitle}</h1>
          <p className="max-w-[420px] text-[15px] leading-[1.6] text-muted">{blog.emptyBody}</p>
        </div>
      </section>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <>
      <FeaturedPost post={featured} />

      {rest.length > 0 ? (
        <section data-nav-theme="light" className="w-full border-t border-hairline bg-white px-6 py-16 md:px-14 xl:px-18">
          <div className="mx-auto flex w-full max-w-[var(--container-site)] flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-[28px] font-light text-text md:text-[32px]">
                {blog.allTitle}
              </h2>
              <p className="text-[15px] text-muted">{blog.allSubtitle}</p>
            </div>

            <PostGrid posts={rest} />
          </div>
        </section>
      ) : null}
    </>
  );
}
