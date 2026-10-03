// Field rules for the "Hear it live" form, shared by the dialog and its API route so the
// browser and the server can never disagree about what is valid. Each check returns a
// reason code (null = valid); the copy for each code lives in lib/content.ts.

export type NameError = "empty" | "short" | "chars";
export type EmailError = "empty" | "invalid";

/** Collapse runs of whitespace and trim - what we validate is what we send. */
export const normalizeName = (raw: string) => raw.replace(/\s+/g, " ").trim();

// Letters in any script (accents included), joined by a space, hyphen, apostrophe or period:
// "Mary-Jane O'Neil", "José Álvarez", "J. R. Smith", "Jr." - but no digits, @, or URLs.
const NAME_RE = /^[\p{L}\p{M}]+(?:(?:\. |[ '’.-])[\p{L}\p{M}]+)*\.?$/u;

export function nameError(raw: string): NameError | null {
  const name = normalizeName(raw);
  if (!name) return "empty";
  if (!NAME_RE.test(name)) return "chars";
  if ((name.match(/\p{L}/gu) ?? []).length < 2) return "short";
  return null;
}

// RFC 5321-practical: dot-atom local part (no leading, trailing or doubled dots, max 64),
// hostname labels without edge hyphens, and an alphabetic TLD. Deliberately no lookbehind,
// which older Safari cannot parse.
const LOCAL_RE = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const DOMAIN_RE = /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

export function emailError(raw: string): EmailError | null {
  const email = raw.trim();
  if (!email) return "empty";
  if (email.length > 254) return "invalid";
  const at = email.lastIndexOf("@");
  if (at < 1) return "invalid";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length > 64 || !LOCAL_RE.test(local) || !DOMAIN_RE.test(domain)) return "invalid";
  return null;
}
