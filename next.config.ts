import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hides the dev-only Next.js route indicator badge that overlaps the hero copy.
  devIndicators: false,

  images: {
    // Airtable serves attachments from signed *.airtableusercontent.com URLs.
    // next/image refuses remote hosts that are not listed here. Note `domains`
    // is deprecated in Next 16 - remotePatterns is the supported form.
    //
    // Routing blog covers through next/image also insulates us from the fact
    // that those signed URLs expire after ~2h: the optimizer fetches and
    // re-encodes the file server-side once, so browsers never request Airtable
    // directly. See the cover note in lib/blog.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.airtableusercontent.com",
      },
    ],
  },
};

export default nextConfig;
