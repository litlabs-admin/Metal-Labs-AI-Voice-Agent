"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js/min";
import { Button } from "./Button";
import { Orb } from "./Orb";
import { StatusPill } from "./StatusPill";
import { CountrySelect } from "./CountrySelect";
import { CloseIcon } from "./Icons";
import { hearItLive as copy } from "@/lib/content";
import {
  countryOptions,
  DEFAULT_COUNTRY,
  phoneError,
  type CountryCode,
  type CountryOption,
} from "@/lib/phone";
import { emailError, nameError, normalizeName } from "@/lib/validation";
import styles from "./HearItLive.module.css";

// Hero "Hear it live": a button that opens a call-me form in a native <dialog>. On submit the
// server asks the Metal Labs API to have the demo agent ring the visitor's phone; the dialog
// then swaps to the agent pill and steps through timed labels. There is no call-status API, so
// the labels are paced, not live - "Call placed" is the furthest the site can honestly claim.
// The API holds the request open while it dials, so the labels advance while the request is
// still in flight; only "Call placed" waits for the server's answer.

type Phase = "form" | "calling" | "done" | "error";
type Field = "name" | "email" | "phone" | "consent";
type Values = { name: string; email: string; country: CountryCode; phone: string; consent: boolean };
type Errors = Partial<Record<Field, string>>;

const FIELDS: Field[] = ["name", "email", "phone", "consent"];
const EMPTY: Values = { name: "", email: "", country: DEFAULT_COUNTRY, phone: "", consent: false };
// Rendered before the full list is built on first open, so SSR and hydration agree.
const FALLBACK_COUNTRIES: CountryOption[] = [
  { code: DEFAULT_COUNTRY, dial: "+1", name: "United States", label: "United States (+1)" },
];
// Pill timeline (ms after submit). "Call placed" shows at MIN_PLACED_AT or when the server
// answers, whichever is later.
const CALLING_AT = 2500;
const PICK_UP_AT = 7000;
const MIN_PLACED_AT = 10000;

// Same rules the API route applies (lib/validation.ts, lib/phone.ts), with a specific message
// for each way a field can be wrong.
function validate(v: Values): Errors {
  const e: Errors = {};
  const name = nameError(v.name);
  const email = emailError(v.email);
  const phone = phoneError(v.phone, v.country);
  if (name) e.name = copy.errors.name[name];
  if (email) e.email = copy.errors.email[email];
  if (phone) e.phone = copy.errors.phone[phone];
  if (!v.consent) e.consent = copy.errors.consent;
  return e;
}

// What the server says when it rejects a field the browser passed (e.g. the phone fails the
// full-metadata check).
const SERVER_ERRORS: Record<Field, string> = {
  name: copy.errors.name.chars,
  email: copy.errors.email.invalid,
  phone: copy.errors.phone.invalid,
  consent: copy.errors.consent,
};

export function HearItLive() {
  const reduce = useReducedMotion() ?? false;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const inputs = useRef<Partial<Record<Field, HTMLInputElement | null>>>({});
  const timers = useRef<number[]>([]);
  const reqId = useRef(0);
  const inFlight = useRef(false);
  const downOnBackdrop = useRef(false);

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [label, setLabel] = useState<string>(copy.status.connecting);
  const [countries, setCountries] = useState<CountryOption[] | null>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Errors>({});

  const clientErrors = validate(values);
  const errorFor = (f: Field) => (touched[f] ? (serverErrors[f] ?? clientErrors[f]) : undefined);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  // Lock page scroll while open, padding out the scrollbar's width so nothing shifts.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, pad: document.body.style.paddingRight };
    html.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      html.style.overflow = prev.overflow;
      document.body.style.paddingRight = prev.pad;
    };
  }, [open]);

  // Leaving the form moves focus to the status layer (the focused submit button goes inert);
  // coming back puts it on the first field that needs fixing.
  useEffect(() => {
    if (!open) return;
    if (phase === "form") {
      const first = FIELDS.find((f) => serverErrors[f]) ?? "name";
      inputs.current[first]?.focus();
    } else if (phase === "calling") {
      statusRef.current?.focus();
    }
    // Only phase transitions should move focus, not every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => clearTimers(), []);

  function openDialog() {
    if (!countries) setCountries(countryOptions());
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeDialog() {
    dialogRef.current?.close(); // fires "close" -> onClose below
  }

  // Runs for every close path: the X, Esc, the backdrop, the Close button. Abandons any
  // in-flight request and resets to the form (values kept) for next time.
  function onClose() {
    reqId.current++;
    inFlight.current = false;
    clearTimers();
    setOpen(false);
    setPhase("form");
  }

  // Blurring an empty field doesn't flag it - the name field is focused on open, so clicking
  // anywhere else would otherwise show "Please enter your name" before anything was typed.
  // Empty fields are flagged on submit instead; once flagged, errors update as you type.
  function touchIfFilled(f: Field, value: string) {
    if (value.trim()) setTouched((t) => (t[f] ? t : { ...t, [f]: true }));
  }

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (key in serverErrors) setServerErrors((e) => ({ ...e, [key]: undefined }));
  }

  // Tidy the number on blur rather than per keystroke, so editing mid-number never jumps the
  // caret. A pasted/autofilled "+44 ..." also switches the country to match.
  function onPhoneBlur() {
    const raw = values.phone.trim();
    if (!raw) return;
    touchIfFilled("phone", raw);
    if (raw.startsWith("+")) {
      const parsed = parsePhoneNumberFromString(raw);
      if (parsed?.country) {
        setValues((v) => ({ ...v, country: parsed.country!, phone: parsed.formatNational() }));
        return;
      }
    }
    update("phone", new AsYouType(values.country).input(raw));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;

    setTouched({ name: true, email: true, phone: true, consent: true });
    setServerErrors({});
    const firstInvalid = FIELDS.find((f) => clientErrors[f]);
    if (firstInvalid) {
      inputs.current[firstInvalid]?.focus();
      return;
    }

    inFlight.current = true;
    const id = ++reqId.current;
    clearTimers();
    setLabel(copy.status.connecting);
    setPhase("calling");

    // "Call placed" needs both the server's OK and the earlier labels to have played out;
    // whichever comes second settles it.
    let accepted = false;
    let minElapsed = false;
    const settle = () => {
      clearTimers();
      setLabel(copy.status.placed);
      setPhase("done");
    };
    timers.current.push(
      window.setTimeout(() => setLabel(copy.status.calling), CALLING_AT),
      window.setTimeout(() => setLabel(copy.status.pickUp), PICK_UP_AT),
      window.setTimeout(() => {
        minElapsed = true;
        if (accepted) settle();
      }, MIN_PLACED_AT),
    );

    try {
      const res = await fetch("/api/hear-it-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: normalizeName(values.name),
          email: values.email.trim(),
          country: values.country,
          phone: values.phone.trim(),
          consent: values.consent,
        }),
      });
      const data: { ok?: boolean; fields?: Partial<Record<Field, true>> } = await res
        .json()
        .catch(() => ({}));
      if (id !== reqId.current) return; // dialog was closed meanwhile

      if (res.ok && data.ok) {
        accepted = true;
        if (minElapsed) settle();
      } else if (res.status === 400 && data.fields && Object.keys(data.fields).length > 0) {
        clearTimers();
        const errs: Errors = {};
        for (const f of FIELDS) if (data.fields[f]) errs[f] = SERVER_ERRORS[f];
        setServerErrors(errs);
        setPhase("form");
      } else {
        clearTimers();
        setPhase("error");
      }
    } catch {
      if (id === reqId.current) {
        clearTimers();
        setPhase("error");
      }
    } finally {
      if (id === reqId.current) inFlight.current = false;
    }
  }

  function backToForm() {
    clearTimers();
    setPhase("form");
  }

  const showForm = phase === "form";
  const describe = (f: Field) => (errorFor(f) ? `hil-${f}-error` : undefined);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className={styles.trigger}
        onClick={openDialog}
        aria-haspopup="dialog"
      >
        <Orb state="composing" size={22} dark />
        {copy.cta}
      </Button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="hil-title"
        onClose={onClose}
        onMouseDown={(e) => {
          downOnBackdrop.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          // Only a press that both starts and ends on the backdrop closes - dragging a text
          // selection out of a field must not.
          if (downOnBackdrop.current && e.target === e.currentTarget) closeDialog();
          downOnBackdrop.current = false;
        }}
      >
        <div className={styles.card}>
          <div className={styles.stack}>
            <div className={styles.layer} data-hidden={!showForm} inert={!showForm}>
              <header className={styles.header}>
                <h2 id="hil-title" className={`font-heading font-light ${styles.title}`}>
                  {copy.title}
                </h2>
                <p className={styles.subtitle}>{copy.subtitle}</p>
              </header>

              <form className={styles.form} onSubmit={onSubmit} noValidate>
                <div className={styles.field}>
                  <label htmlFor="hil-name" className={styles.label}>
                    {copy.nameLabel}
                  </label>
                  <input
                    ref={(el) => {
                      inputs.current.name = el;
                    }}
                    id="hil-name"
                    className={styles.input}
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    placeholder={copy.namePlaceholder}
                    value={values.name}
                    onChange={(e) => update("name", e.target.value)}
                    onBlur={() => {
                      touchIfFilled("name", values.name);
                      if (values.name !== normalizeName(values.name)) update("name", normalizeName(values.name));
                    }}
                    aria-invalid={!!errorFor("name")}
                    aria-describedby={describe("name")}
                  />
                  {errorFor("name") && (
                    <p id="hil-name-error" className={styles.error}>
                      {errorFor("name")}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="hil-email" className={styles.label}>
                    {copy.emailLabel}
                  </label>
                  <input
                    ref={(el) => {
                      inputs.current.email = el;
                    }}
                    id="hil-email"
                    className={styles.input}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={254}
                    placeholder={copy.emailPlaceholder}
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                    onBlur={() => {
                      touchIfFilled("email", values.email);
                      if (values.email !== values.email.trim()) update("email", values.email.trim());
                    }}
                    aria-invalid={!!errorFor("email")}
                    aria-describedby={describe("email")}
                  />
                  {errorFor("email") && (
                    <p id="hil-email-error" className={styles.error}>
                      {errorFor("email")}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="hil-phone" className={styles.label}>
                    {copy.phoneLabel}
                  </label>
                  <div className={styles.phoneRow}>
                    <CountrySelect
                      value={values.country}
                      options={countries ?? FALLBACK_COUNTRIES}
                      onChange={(code) => update("country", code)}
                      onPicked={() => inputs.current.phone?.focus()}
                      label={copy.countryLabel}
                      searchPlaceholder={copy.countrySearch}
                      emptyText={copy.countryEmpty}
                      invalid={!!errorFor("phone")}
                    />
                    <input
                      ref={(el) => {
                        inputs.current.phone = el;
                      }}
                      id="hil-phone"
                      className={styles.input}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      maxLength={32}
                      value={values.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      onBlur={onPhoneBlur}
                      aria-invalid={!!errorFor("phone")}
                      aria-describedby={describe("phone")}
                    />
                  </div>
                  {errorFor("phone") && (
                    <p id="hil-phone-error" className={styles.error}>
                      {errorFor("phone")}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.consent}>
                    <input
                      ref={(el) => {
                        inputs.current.consent = el;
                      }}
                      type="checkbox"
                      checked={values.consent}
                      onChange={(e) => {
                        update("consent", e.target.checked);
                        setTouched((t) => ({ ...t, consent: true }));
                      }}
                      aria-invalid={!!errorFor("consent")}
                      aria-describedby={describe("consent")}
                    />
                    <span>
                      {copy.consent}{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer">
                        {copy.consentLink}
                      </a>
                      .
                    </span>
                  </label>
                  {errorFor("consent") && (
                    <p id="hil-consent-error" className={styles.error}>
                      {errorFor("consent")}
                    </p>
                  )}
                </div>

                <Button type="submit" variant="primary" className={styles.submit}>
                  {copy.submit}
                </Button>
              </form>
            </div>

            <div
              ref={statusRef}
              className={`${styles.layer} ${styles.status}`}
              data-hidden={showForm}
              inert={showForm}
              tabIndex={-1}
            >
              {/* Mounted only while shown: a visibility-hidden orb would keep its rAF loop running. */}
              {showForm ? null : phase === "error" ? (
                <p className={styles.note} data-error="true" role="alert">
                  {copy.errors.failed}
                </p>
              ) : (
                <>
                  <div role="status" aria-live="polite">
                    <StatusPill label={label} reduce={reduce} />
                  </div>
                  <p className={styles.note}>{label === copy.status.connecting ? "" : copy.placedNote}</p>
                </>
              )}
              <div className={styles.actions}>
                {phase === "done" && (
                  <button type="button" className={styles.secondary} onClick={backToForm}>
                    {copy.notReceived} {copy.retry}
                  </button>
                )}
                {phase === "error" && (
                  <Button type="button" variant="primary" onClick={backToForm}>
                    {copy.retry}
                  </Button>
                )}
                {(phase === "done" || phase === "error") && (
                  <button type="button" className={styles.secondary} onClick={closeDialog}>
                    {copy.close}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* After the content in DOM order so showModal() focuses the first field, not this. */}
          <button type="button" className={styles.close} onClick={closeDialog} aria-label={copy.close}>
            <CloseIcon />
          </button>
        </div>
      </dialog>
    </>
  );
}
