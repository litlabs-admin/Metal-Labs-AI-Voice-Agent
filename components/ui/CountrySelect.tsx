"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import type { CountryCode, CountryOption } from "@/lib/phone";
import { CheckIcon, ChevronDown, SearchIcon } from "./Icons";
import styles from "./CountrySelect.module.css";

// Searchable country-code picker for the "Hear it live" phone field. Replaces a native
// <select>, whose OS-drawn list clashed with the site. ARIA combobox pattern: the search box
// owns focus and points at the highlighted option via aria-activedescendant.
//
// The list is a manual popover in the top layer, so it escapes the dialog card's scroll
// clipping and is positioned against the viewport. It stays a DOM child of the <dialog>, so
// the modal's focus containment still includes it. Dismissal (outside press, Escape, Tab,
// pick) is handled here, not by the browser.

type Props = {
  value: CountryCode;
  options: CountryOption[];
  onChange: (code: CountryCode) => void;
  /** Called after a pick, so the caller can move focus on (to the number field). */
  onPicked?: () => void;
  label: string;
  searchPlaceholder: string;
  emptyText: string;
  invalid?: boolean;
  className?: string;
};

type Placement = { left: number; width: number; maxHeight: number; top?: number; bottom?: number };

const GAP = 6;
const EDGE = 16;
const MAX_HEIGHT = 320;
const MAX_WIDTH = 340;

// Case- and accent-insensitive: "cote" finds "Côte d'Ivoire".
const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

function filterOptions(options: CountryOption[], query: string): CountryOption[] {
  const q = fold(query.trim());
  if (!q) return options;
  const digits = q.replace(/\D/g, "");
  const starts: CountryOption[] = [];
  const rest: CountryOption[] = [];
  for (const o of options) {
    const name = fold(o.name);
    if (name.startsWith(q) || o.code.toLowerCase() === q) starts.push(o);
    else if (name.includes(q) || (digits && o.dial.slice(1).startsWith(digits))) rest.push(o);
  }
  return [...starts, ...rest];
}

export function CountrySelect({
  value,
  options,
  onChange,
  onPicked,
  label,
  searchPlaceholder,
  emptyText,
  invalid,
  className,
}: Props) {
  const id = useId();
  const listId = `${id}-list`;
  const optionId = (code: string) => `${id}-opt-${code}`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [place, setPlace] = useState<Placement | null>(null);

  const placed = place !== null;
  const selected = options.find((o) => o.code === value);
  const filtered = useMemo(() => filterOptions(options, query), [options, query]);
  const activeOption = filtered[Math.min(active, filtered.length - 1)];

  function openList() {
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.code === value)));
    setOpen(true);
  }

  function closeList(refocus: boolean) {
    setOpen(false);
    setPlace(null);
    if (refocus) triggerRef.current?.focus();
  }

  function pick(o: CountryOption) {
    onChange(o.code);
    setOpen(false);
    setPlace(null);
    if (onPicked) onPicked();
    else triggerRef.current?.focus();
  }

  // Promote the list into the top layer (Popover API), then place it under the trigger - or
  // above, when there isn't room below. In the top layer its fixed coordinates are always the
  // viewport's: as a plain fixed child of the <dialog>, any transform on the dialog (its
  // open animation) re-anchors it to the dialog and throws it off by the dialog's offset.
  // Uses the visual viewport so an open mobile keyboard counts as lost space.
  useLayoutEffect(() => {
    if (!open) return;
    const pop = popRef.current;
    if (pop && typeof pop.showPopover === "function" && !pop.matches(":popover-open")) {
      pop.showPopover();
    }
    let frame = 0;
    const measure = () => {
      const t = triggerRef.current;
      if (!t) return;
      const r = t.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const width = Math.min(MAX_WIDTH, vw - EDGE * 2);
      const left = Math.min(Math.max(EDGE, r.left), vw - width - EDGE);
      const below = vh - r.bottom - GAP - EDGE;
      const above = r.top - GAP - EDGE;
      setPlace(
        below >= 220 || below >= above
          ? { left, width, top: r.bottom + GAP, maxHeight: Math.min(MAX_HEIGHT, below) }
          : { left, width, bottom: window.innerHeight - r.top + GAP, maxHeight: Math.min(MAX_HEIGHT, above) },
      );
    };
    const schedule = (e?: Event) => {
      // Scrolling the list itself must not re-measure.
      if (e && popRef.current?.contains(e.target as Node)) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    window.visualViewport?.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      window.visualViewport?.removeEventListener("resize", schedule);
    };
  }, [open]);

  // On open: focus the search on pointer-and-keyboard devices; on touch, leave the keyboard
  // closed so it doesn't cover the list. Runs once per open, after the first placement.
  useEffect(() => {
    if (!open || !placed) return;
    if (document.activeElement !== searchRef.current && window.matchMedia("(pointer: fine)").matches) {
      searchRef.current?.focus({ preventScroll: true });
    }
  }, [open, placed]);

  // Keep the highlighted option in view - the current country on open, then keyboard moves.

  useEffect(() => {
    if (!open || !placed || !activeOption) return;
    document.getElementById(optionId(activeOption.code))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, placed, activeOption?.code]);

  // Outside press closes. Escape closes this list only - captured on window so the <dialog>
  // never sees it and stays open.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
      setPlace(null);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      setPlace(null);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  function onSearchKey(e: KeyboardEvent<HTMLInputElement>) {
    const last = filtered.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "PageDown":
        e.preventDefault();
        setActive((i) => Math.min(last, i + 8));
        break;
      case "PageUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 8));
        break;
      case "Enter":
        e.preventDefault(); // never submit the surrounding form from here
        if (activeOption) pick(activeOption);
        break;
      case "Tab":
        closeList(false);
        break;
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={cn(styles.trigger, className)}
        data-invalid={invalid || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${selected?.label ?? value}`}
        onClick={() => (open ? closeList(false) : openList())}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            openList();
          }
        }}
      >
        <span className={styles.value}>
          {selected ? `${selected.code} ${selected.dial}` : value}
        </span>
        <ChevronDown className={styles.chevron} data-open={open} />
      </button>

      {open && (
        <div
          ref={popRef}
          popover="manual"
          className={styles.popover}
          data-placed={placed}
          style={
            place
              ? { left: place.left, width: place.width, top: place.top, bottom: place.bottom, maxHeight: place.maxHeight }
              : undefined
          }
        >
          <div className={styles.search}>
            <SearchIcon className={styles.searchIcon} />
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              aria-label={searchPlaceholder}
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeOption ? optionId(activeOption.code) : undefined}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKey}
            />
          </div>

          {filtered.length > 0 ? (
            <ul id={listId} role="listbox" aria-label={label} className={styles.list}>
              {filtered.map((o, i) => (
                <li
                  key={o.code}
                  id={optionId(o.code)}
                  role="option"
                  aria-selected={o.code === value}
                  data-active={o === activeOption}
                  className={styles.option}
                  // Keep focus in the search box; select on click.
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseMove={() => i !== active && setActive(i)}
                  onClick={() => pick(o)}
                >
                  <span className={styles.name}>{o.name}</span>
                  <span className={styles.dial}>{o.dial}</span>
                  <span className={styles.check}>{o.code === value && <CheckIcon />}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty} role="status">
              {emptyText}
            </p>
          )}
        </div>
      )}
    </>
  );
}
