import type { Metadata } from "next";
import { merriweather, cabin, inter, switzer } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metal Labs — The only AI agent platform mortgage lenders will ever need.",
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
      <body className="min-h-screen overflow-x-hidden bg-cream text-text">{children}</body>
    </html>
  );
}
