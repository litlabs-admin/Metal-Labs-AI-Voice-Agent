"use client";

import { useSyncExternalStore } from "react";

// prefers-reduced-motion that is safe to branch MARKUP on (which element or content renders).
// framer-motion's useReducedMotion reads the media query on the client's first render, so markup
// that depends on it differs from the server HTML and fails hydration. useSyncExternalStore
// renders the server snapshot (false) while hydrating, then re-renders with the real value.
// framer's hook is still fine for animation props (initial/transition), which don't change markup.
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useReducedMotionSafe() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
