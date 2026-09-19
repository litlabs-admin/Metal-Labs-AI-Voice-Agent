import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

// Same chrome as app/privacy/layout.tsx - Navbar and Footer are not in the
// root layout, so each non-homepage route group supplies them.
export default function TrustLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex w-full flex-col">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
