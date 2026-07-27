import Link from "next/link";
import { blog } from "@/lib/content";

// Rendered by notFound() in app/blog/[slug]/page.tsx, and for any unmatched
// path under /blog. Served with a real HTTP 404.
export default function BlogNotFound() {
  return (
    <section
      data-nav-theme="dark"
      className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-5 bg-ink px-6 py-24 text-center text-text-on-dark"
    >
      <span className="font-illustration text-eyebrow font-medium uppercase text-mint">404</span>

      <h1 className="max-w-[620px] text-display-sm font-light leading-[1.2] text-text-on-dark">
        {blog.notFoundTitle}
      </h1>
      <p className="max-w-[480px] text-[16px] leading-[1.6] text-white/65">
        {blog.notFoundBody}
      </p>

      <Link
        href="/blog"
        className="mt-2 text-[15px] text-white underline decoration-mint decoration-2 underline-offset-4"
      >
        Browse all articles
      </Link>
    </section>
  );
}
