import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  validatePhoneNumberLength,
  type CountryCode,
} from "libphonenumber-js/min";

export type { CountryCode };

export const DEFAULT_COUNTRY: CountryCode = "US";

export type CountryOption = { code: CountryCode; dial: string; name: string; label: string };

// Country-code options for the phone field: "United States (+1)", named via Intl so there is
// no hand-kept list. No emoji flags - Windows renders them as bare letters. US leads (the
// product is built for US lenders); the rest sort by name.
export function countryOptions(locale = "en"): CountryOption[] {
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames([locale], { type: "region" });
  } catch {
    // Very old engines: fall back to ISO codes.
  }
  const all = getCountries().map((code) => {
    const dial = `+${getCountryCallingCode(code)}`;
    const name = names?.of(code) ?? code;
    return { code, dial, name, label: `${name} (${dial})` };
  });
  all.sort((a, b) =>
    a.code === DEFAULT_COUNTRY ? -1 : b.code === DEFAULT_COUNTRY ? 1 : a.name.localeCompare(b.name),
  );
  return all;
}

export type PhoneError = "empty" | "chars" | "short" | "long" | "invalid";

// Only what people actually type into a phone field: digits, spaces, ( ) . - and a leading +.
const PHONE_CHARS_RE = /^\+?[\d\s().-]+$/;

/**
 * Browser-side phone check against the selected country. Uses the compact "min" metadata
 * (length rules) to keep the homepage bundle small; the API route re-checks with the full
 * "max" metadata and anything it rejects comes back as "invalid".
 */
export function phoneError(raw: string, country: CountryCode): PhoneError | null {
  const phone = raw.trim();
  if (!phone) return "empty";
  if (!PHONE_CHARS_RE.test(phone)) return "chars";
  switch (validatePhoneNumberLength(phone, country)) {
    case "TOO_SHORT":
    case "NOT_A_NUMBER":
      return "short";
    case "TOO_LONG":
      return "long";
    case "INVALID_COUNTRY":
    case "INVALID_LENGTH":
      return "invalid";
  }
  return isValidPhoneNumber(phone, country) ? null : "invalid";
}
