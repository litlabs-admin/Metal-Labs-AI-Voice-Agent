import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { merriweather, cabin, inter, switzer } from "./fonts";
import { SITE_URL } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  // metadataBase resolves the relative canonical and OG URLs used by the blog
  // routes into absolute ones. Without it Next warns and emits relative URLs,
  // which crawlers and social scrapers reject.
  metadataBase: new URL(SITE_URL),
  title: "Metal Labs | The only AI agent platform mortgage lenders will ever need.",
  description:
    "From the first lead call to the final payment, Metal Labs handles every borrower conversation across voice, text, and email. One platform. No gaps. No excuses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${merriweather.variable} ${cabin.variable} ${inter.variable} ${switzer.variable} antialiased`}
    >
      <body className="min-h-screen overflow-x-hidden bg-cream text-text">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
