import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/lib/content";

// Site-wide share image: the navbar lockup (sphere + wordmark) on cream.
// Without it, link previews pick an arbitrary image from the page.
// Satori can't read woff2, so the wordmark font ships as a static TTF.
export const alt = brand.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [logo, merriweatherBold] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/logo.png"), "base64"),
    readFile(join(process.cwd(), "app/fonts/Merriweather-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          background: "#fffaea",
          color: "#09090b",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo}`} width={180} height={180} alt="" />
        <div
          style={{
            fontFamily: "Merriweather",
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {brand.name}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Merriweather", data: merriweatherBold, style: "normal", weight: 700 }],
    }
  );
}
