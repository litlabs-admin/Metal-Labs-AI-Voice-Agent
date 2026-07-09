import localFont from "next/font/local";

// Self-hosted from the Vapi reference (see DESIGN_AUDIT.md §1).
export const avantt = localFont({
  variable: "--font-avantt",
  display: "swap",
  src: [
    { path: "./fonts/Avantt-Thin.woff2", weight: "100", style: "normal" },
    { path: "./fonts/Avantt-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Avantt-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Avantt-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Avantt-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Avantt-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const gridnik = localFont({
  variable: "--font-gridnik",
  display: "swap",
  src: [{ path: "./fonts/FoundryGridnik-Medium.otf", weight: "500", style: "normal" }],
});
