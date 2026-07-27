import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { BLOG_CACHE_TAG } from "@/lib/blog";

/* =========================================================================
   On-demand revalidation webhook for Airtable.
   -------------------------------------------------------------------------
   POST /api/revalidate  with the shared secret, and every Airtable-backed
   page drops its cached data immediately instead of waiting out the 1h ISR
   window. Wire this to an Airtable automation ("when Status becomes
   Published -> send POST request") for instant publishing.

   The hourly revalidate in lib/blog.ts stays in place as a safety net, so
   content still refreshes on its own if this webhook ever stops firing.

   Why revalidateTag and not updateTag: updateTag gives read-your-own-writes
   semantics but can ONLY be called from a Server Action. A webhook has to be
   a Route Handler, so revalidateTag is the supported API here.
   ========================================================================= */

// node:crypto for the timing-safe comparison below.
export const runtime = "nodejs";
// Never cache the webhook itself.
export const dynamic = "force-dynamic";

/**
 * Constant-time secret comparison, so response timing cannot be used to
 * discover the secret one character at a time.
 *
 * Accepts either an `Authorization: Bearer <secret>` header (preferred - not
 * captured in access logs) or a `?secret=` query param (easier to configure in
 * Airtable's automation UI, but it does end up in server logs).
 */
function isAuthorized(request: Request, expected: string): boolean {
  const header = request.headers.get("authorization");
  const fromHeader = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const fromQuery = new URL(request.url).searchParams.get("secret");
  const provided = fromHeader ?? fromQuery;
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on a length mismatch, so the lengths are checked
  // first. Leaking the secret's length is not a meaningful risk.
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.AIRTABLE_REVALIDATE_SECRET;

  // Fail closed. A missing secret must never mean "allow anyone to revalidate".
  if (!expected) {
    console.error(
      "AIRTABLE_REVALIDATE_SECRET is not set - refusing to revalidate. See .env.example.",
    );
    return NextResponse.json(
      { revalidated: false, error: "not_configured" },
      { status: 500 },
    );
  }

  if (!isAuthorized(request, expected)) {
    return NextResponse.json(
      { revalidated: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  // Two calls are required, and both matter.
  //
  // revalidateTag drops the cached Airtable *responses*. On its own that is not
  // enough here: /blog and /blog/[slug] are statically prerendered, so a visitor
  // would still be served the previously rendered HTML and the fresh fetch would
  // never run. (Verified - tag-only invalidation left the pages untouched.)
  //
  // revalidatePath with type "layout" drops the rendered *pages*: it invalidates
  // app/blog/layout.tsx and everything beneath it, so the listing and every post
  // page are both covered by one call.
  revalidateTag(BLOG_CACHE_TAG, { expire: 0 });
  revalidatePath("/blog", "layout");

  return NextResponse.json({
    revalidated: true,
    tag: BLOG_CACHE_TAG,
    path: "/blog",
  });
}
