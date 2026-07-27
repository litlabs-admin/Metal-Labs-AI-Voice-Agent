"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { blog } from "@/lib/content";

// Error boundaries must be Client Components (Next requirement) so that reset()
// can re-render the segment in place.
//
// Only error.digest is surfaced. The raw message can contain Airtable API
// detail - and in a misconfiguration, request context - which must never reach
// a visitor's browser. The full error is already in the server logs.
export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Blog route error:", error);
  }, [error]);

  return (
    <section
      data-nav-theme="dark"
      className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-5 bg-ink px-6 py-24 text-center text-text-on-dark"
    >
      <h1 className="max-w-[620px] text-display-sm font-light leading-[1.2] text-text-on-dark">
        {blog.errorTitle}
      </h1>
      <p className="max-w-[480px] text-[16px] leading-[1.6] text-white/65">{blog.errorBody}</p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <Button variant="light" onClick={reset}>
          Try again
        </Button>
        <Link
          href="/blog"
          className="text-[15px] text-white/70 underline underline-offset-4 transition-colors hover:text-white"
        >
          Back to all articles
        </Link>
      </div>

      {error.digest ? (
        <p className="mt-2 font-illustration text-[12px] text-white/35">
          Reference: {error.digest}
        </p>
      ) : null}
    </section>
  );
}
