import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { MorePosts } from "@/components/sections/blog/MorePosts";
import { PostHeader } from "@/components/sections/blog/PostHeader";
import { TagChips } from "@/components/sections/blog/TagList";
import { getPostBySlug, getPublishedPosts, type BlogPost } from "@/lib/blog";
import { Markdown } from "@/lib/markdown";
import { SITE_URL, brand } from "@/lib/content";

/** Up to 3 other published posts, newest first, for the "More Posts" block. */
const MORE_POSTS_COUNT = 3;

// 1 hour ISR, matching the listing. Must be a literal - Next reads this
// statically at build time.
export const revalidate = 3600;

// Posts published to Airtable after the last build still resolve: the slug is
// not in generateStaticParams, so it renders on first request and is then cached.
export const dynamicParams = true;

// Next 16: params is a Promise and must be awaited (see the "Async Request APIs"
// breaking change in node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md).
type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

/** Prerender one static route per published post at build time. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // No throw here: an unknown slug must still return renderable metadata so the
  // not-found page has a sane <title>.
  if (!post) {
    return { title: "Article not found | Metal Labs", robots: { index: false } };
  }

  const url = post.canonicalUrl ?? `${SITE_URL}/blog/${post.slug}`;
  const images = post.cover
    ? [
        {
          url: post.cover.url,
          width: post.cover.width,
          height: post.cover.height,
          alt: post.cover.alt,
        },
      ]
    : undefined;

  return {
    title: `${post.title} | ${brand.name}`,
    description: post.excerpt,
    // Populated from the Keyword multi-select; omitted entirely when empty.
    keywords: post.keywords.length > 0 ? post.keywords : undefined,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      siteName: brand.name,
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images,
    },
  };
}

/**
 * schema.org BlogPosting, per node_modules/next/dist/docs/01-app/02-guides/json-ld.md.
 * Escaping "<" prevents a body containing "</script>" from breaking out of the
 * script tag - the standard guard when embedding JSON in HTML.
 */
function jsonLd(post: BlogPost): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: brand.name },
    mainEntityOfPage: post.canonicalUrl ?? `${SITE_URL}/blog/${post.slug}`,
    ...(post.cover ? { image: [post.cover.url] } : {}),
    ...(post.category ? { articleSection: post.category } : {}),
    ...(post.keywords.length > 0 ? { keywords: post.keywords.join(", ") } : {}),
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Unknown or unpublished slug -> app/blog/not-found.tsx with a real HTTP 404.
  if (!post) notFound();

  // getPublishedPosts() is React cache()-wrapped, so this reuses the same
  // Airtable round-trip made for generateStaticParams/getPostBySlug above -
  // no extra request.
  const morePosts = (await getPublishedPosts())
    .filter((other) => other.slug !== post.slug)
    .slice(0, MORE_POSTS_COUNT);

  return (
    <article data-nav-theme="light">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(post) }}
      />

      <PostHeader post={post} />

      <div className="w-full bg-white px-6 pb-20 md:px-14 xl:px-18">
        <div className="mx-auto w-full max-w-[720px] pt-14">
          <Markdown source={post.body} />

          {post.tags.length > 0 ? (
            <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-8">
              <span className="font-illustration text-eyebrow font-medium uppercase text-muted">
                Tagged
              </span>
              <TagChips tags={post.tags} />
            </div>
          ) : null}
        </div>
      </div>

      <MorePosts posts={morePosts} />

      {/* Reuses the homepage closing CTA rather than duplicating a blog-specific one. */}
      <ClosingCTA />
    </article>
  );
}
