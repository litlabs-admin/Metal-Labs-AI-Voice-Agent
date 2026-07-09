// Inline SVG UI-chrome icons (matches the reference approach: raw <svg><path>).
import type { SVGProps } from "react";

export function LogoMark({ className }: { className?: string }) {
  // Simple "Metal Labs" wordmark lockup: a mark + text is composed in the nav/footer.
  return (
    <svg viewBox="0 0 28 24" className={className} fill="none" aria-hidden>
      <path
        d="M4 20V6l6 8 6-8v14"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 6v14h4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
      <path d="M5 3.5v9l7-4.5-7-4.5z" />
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path
        d="M3.2 3.5c0-.4.3-.7.7-.7h1.7c.3 0 .6.2.7.5l.7 2c.1.3 0 .6-.2.8l-1 .9a9 9 0 004 4l.9-1c.2-.2.5-.3.8-.2l2 .7c.3.1.5.4.5.7v1.7c0 .4-.3.7-.7.7A11 11 0 013.2 3.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
      <path d="M3.4 5.4H1.6V13h1.8V5.4zM2.5 2.3a1 1 0 100 2.1 1 1 0 000-2.1zM13 8.3c0-1.7-.9-2.5-2.2-2.5-1 0-1.5.6-1.8 1V5.4H7.3V13H9V9c0-.9.4-1.4 1.1-1.4.7 0 1 .5 1 1.4V13H13V8.3z" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
      <path d="M9.5 7l4-5h-1.3L9 6 6.3 2H3l4.3 6L3 13h1.3L8 8.6 10.8 13H14L9.5 7zm-1 1.2l-.5-.7L4.6 3h1.2l2.5 3.6.5.7L11.6 12h-1.2L8.5 8.2z" />
    </svg>
  );
}
