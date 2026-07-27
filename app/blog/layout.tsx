import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

// Navbar and Footer live in app/page.tsx rather than the root layout, so /blog
// routes do not inherit them. This nested layout supplies the same chrome using
// the identical <main> structure, which keeps app/page.tsx and Navbar.tsx
// completely untouched.
export default function BlogLayout({
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
