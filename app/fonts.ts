import { Merriweather, Cabin, Inter } from "next/font/google";
import localFont from "next/font/local";

// Brand type system:
//   Headings      → Merriweather 300 (--font-heading)
//   Body / text   → Cabin 400        (--font-body)
//   Buttons       → system sans-serif 400 (see --font-button in globals.css)
//   Illustrations → Inter            (--font-illustration)
//   Footer brand  → Switzer          (--font-switzer)
export const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const switzer = localFont({
  variable: "--font-switzer",
  display: "swap",
  src: [
    { path: "./fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Switzer-Bold.woff2", weight: "700", style: "normal" },
  ],
});
