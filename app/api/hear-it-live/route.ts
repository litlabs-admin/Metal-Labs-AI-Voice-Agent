import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";
import { NextResponse } from "next/server";
import { emailError, nameError, normalizeName } from "@/lib/validation";

/* =========================================================================
   "Hear it live" - the hero's call-me form posts here.
   -------------------------------------------------------------------------
   POST /api/hear-it-live  { name, email, country, phone, consent }
   Validates the visitor's details, then asks the Metal Labs outbound-call API
   to have the demo agent ring that number. The API key never leaves the
   server; the browser only ever sees { ok } or a coarse error code.

   No captcha or rate limit yet - see the TODO below before the upstream call.
   ========================================================================= */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// The upstream holds the request open while it dials (observed: >15s, with the phone already
// ringing), so give the function room beyond UPSTREAM_TIMEOUT_MS.
export const maxDuration = 60;

const CALLS_URL = "https://api.metallabs.io/outbound/calls";
const DEFAULT_AGENT_ID = "7140c526-cf45-4396-bb31-be5123f8e4a4";
const PURPOSE = "Website live demo: visitor requested a call from the Metal Labs agent";
const UPSTREAM_TIMEOUT_MS = 45_000;

type Field = "name" | "email" | "phone" | "consent";

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const apiKey = process.env.METALLABS_API_KEY;

  // Fail closed: without a key there is nothing to call with.
  if (!apiKey) {
    console.error("METALLABS_API_KEY is not set - refusing to place calls. See .env.example.");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Re-validate everything: the client checks are for UX, not trust.
  // Same rules as the form (lib/validation.ts); the phone gets the stricter "max" metadata.
  const name = normalizeName(str(body.name, 80));
  const email = str(body.email, 254);
  const country = str(body.country, 2).toUpperCase() as CountryCode;
  const phone = parsePhoneNumberFromString(str(body.phone, 32), country || undefined);

  const fields: Partial<Record<Field, true>> = {};
  if (nameError(name)) fields.name = true;
  if (emailError(email)) fields.email = true;
  if (!phone?.isValid()) fields.phone = true;
  if (body.consent !== true) fields.consent = true;
  if (Object.keys(fields).length > 0 || !phone) {
    return NextResponse.json({ ok: false, error: "invalid", fields }, { status: 400 });
  }

  // TODO captcha + rate limit: verify a Turnstile token and cap calls per IP / per number
  // here, before any call is placed. Until then this endpoint can be used to trigger calls.

  try {
    const res = await fetch(CALLS_URL, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        agent_id: process.env.METALLABS_AGENT_ID || DEFAULT_AGENT_ID,
        phone: phone.number, // E.164
        purpose: PURPOSE,
        context: { contact_name: name, contact_email: email },
      }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });

    if (!res.ok) {
      // Log the upstream detail for us; the visitor gets a generic failure.
      const detail = await res.text().catch(() => "");
      console.error(`Outbound call failed: ${res.status} ${detail.slice(0, 500)}`);
      return NextResponse.json({ ok: false, error: "call_failed" }, { status: 502 });
    }
  } catch (err) {
    // A timeout means the API accepted the request and is still working on it - the call goes
    // out while it holds the connection, and aborting our side does not cancel it. Report it
    // as in progress, not failed. Connection errors (DNS, refused, reset) fail fast and land
    // below as real failures.
    if ((err as { name?: unknown } | null)?.name === "TimeoutError") {
      console.warn(`Outbound call: no upstream response after ${UPSTREAM_TIMEOUT_MS}ms; treating as placed.`);
      return NextResponse.json({ ok: true, pending: true }, { status: 202 });
    }
    console.error("Outbound call request errored:", err);
    return NextResponse.json({ ok: false, error: "call_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
