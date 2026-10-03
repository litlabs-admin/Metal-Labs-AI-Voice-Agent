// Line icons for the Pricing "What's included" rows. Raw inline SVG like components/ui/Icons.tsx,
// drawn on one 24px grid at stroke 1.5 so the six read as a set.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function Voice(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.5 4h2.8l1.4 3.6-1.9 1.3a10 10 0 0 0 5.3 5.3l1.3-1.9 3.6 1.4v2.8a1.5 1.5 0 0 1-1.5 1.5A14.5 14.5 0 0 1 4 5.5 1.5 1.5 0 0 1 5.5 4z" />
      <path d="M15 4.5a5 5 0 0 1 4.5 4.5M15 7.6a2 2 0 0 1 1.4 1.4" />
    </svg>
  );
}

function Message(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4.2 3.2a.5.5 0 0 1-.8-.4V16h0a1 1 0 0 1-1-1z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </svg>
  );
}

function Shield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 18.5 6v5.2c0 4.1-2.7 7.6-6.5 9.3-3.8-1.7-6.5-5.2-6.5-9.3V6z" />
      <path d="m9.2 12.2 2 2 3.8-3.9" />
    </svg>
  );
}

function Plug(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3.5v4M15 3.5v4" />
      <path d="M6.5 7.5h11v3a5.5 5.5 0 0 1-11 0z" />
      <path d="M12 16v4.5" />
    </svg>
  );
}

function Document(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13.5 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.5z" />
      <path d="M13.5 3.5v5h5M9 13h6M9 16.5h4" />
    </svg>
  );
}

function Support(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <path d="M4.5 13.5h2.5v5H5.5a1 1 0 0 1-1-1zM19.5 13.5H17v5h1.5a1 1 0 0 0 1-1z" />
      <path d="M17 18.5c0 1.2-1.6 2-4 2" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden {...props}>
      <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const INCLUDED_ICONS = {
  voice: Voice,
  message: Message,
  shield: Shield,
  plug: Plug,
  document: Document,
  support: Support,
} as const;
