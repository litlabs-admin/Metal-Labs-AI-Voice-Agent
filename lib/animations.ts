// Shared Framer Motion variants - single place to tune all reveal/stagger/hover timing.
// Easings/durations mirror the Vapi reference tokens (DESIGN_AUDIT.md §6).
import type { Variants, Transition } from "framer-motion";

export const easeOut: [number, number, number, number] = [0, 0, 0.2, 1];
export const easeInOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
export const easeSlide: [number, number, number, number] = [0.32, 0.72, 0, 1];

// Fire once, when ~20% of the element is visible.
export const viewportOnce = { once: true, amount: 0.2 } as const;

// Section entry: fade + translate-up (~20px).
export const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

// Parent that staggers its reveal children.
export const staggerParent = (stagger = 0.08, delayChildren = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

// Card / button hover lift (matches reference transform spring feel).
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: { y: -4, scale: 1.02 },
  tap: { scale: 0.97 },
} as const;

export const springHover: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 25,
};
