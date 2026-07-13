// Downloads Vapi CDN reference assets into /public/design so the Metal Labs clone
// renders real imagery as swappable placeholders. Run once: `node scripts/fetch-assets.mjs`.
// Assets that already ship on disk (fonts, hero webms, trust SVGs, lottie) are copied
// separately during setup and are NOT re-fetched here.
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "design");

const PRISMIC = "https://vapimarketingsite.cdn.prismic.io/vapimarketingsite";
const IMG = "https://images.prismic.io/vapimarketingsite";
// Next image optimizer on the live site (serves the /integrations logo PNGs)
const NEXTIMG = (p, w = 128) =>
  `https://vapi.ai/_next/image?url=${encodeURIComponent(p)}&w=${w}&q=75`;

// dest (relative to public/design) -> source URL
const assets = {
  // Enterprise capability icons (§8 "Why Metal Labs")
  "icons/enterprise-0-headphone.svg": `${PRISMIC}/ah5EJQeQX7-eWhkO_enterprise-feature-0-headphone.svg`,
  "icons/enterprise-1-handshake.svg": `${PRISMIC}/ah5EJweQX7-eWhkP_enterprise-feature-1-handshake.svg`,
  "icons/enterprise-2-lock.svg": `${PRISMIC}/ah5EKQeQX7-eWhkQ_enterprise-feature-2-lock.svg`,
  "icons/enterprise-3-trend-up.svg": `${PRISMIC}/ah5EKweQX7-eWhkR_enterprise-feature-3-trend-up.svg`,
  "icons/enterprise-4-select-area.png": `${IMG}/ah5ELQeQX7-eWhkS_enterprise-feature-4-select-area.png?auto=format,compress`,
  "icons/enterprise-5-shield-check.svg": `${PRISMIC}/ah5ELweQX7-eWhkT_enterprise-feature-5-shield-check.svg`,
  // Product feature icons (§5/§6)
  "icons/thermometer.svg": `${PRISMIC}/ah56KgeQX7-eWhtN_product-content-1-icon-thermometer.svg`,
  // Featured case study (§9 Kavak)
  "case/hero-logo.svg": `${PRISMIC}/ah6ApgeQX7-eWhvD_case-study-hero-logo.svg`,
  // Two case-study cards (§10)
  "case/card-0-bg.png": `${IMG}/ah6AqgeQX7-eWhvE_case-study-card-0-bg.png?auto=format,compress`,
  "case/card-0-logo.png": `${IMG}/ajHb0o1P9HI4Ulwh_image1-1-.png?auto=format,compress`,
  "case/card-1-bg.png": `${IMG}/ah6ArgeQX7-eWhvG_case-study-card-1-bg.png?auto=format,compress`,
  "case/card-1-logo.svg": `${PRISMIC}/ah6AsAeQX7-eWhvI_case-study-card-1-logo.svg`,
  // Closing CTA green texture (§12)
  "hero/green-texture.jpg": NEXTIMG("/airfoil/green-texture.jpg", 1920),
};

// Integration logos (§7): top-row 0..12, bottom-row 0..17
for (let i = 0; i <= 12; i++)
  assets[`integrations/top-${i}.png`] = NEXTIMG(`/integrations/top-row/top-row/${i}/image.png`, 128);
for (let i = 0; i <= 17; i++)
  assets[`integrations/bottom-${i}.png`] = NEXTIMG(`/integrations/bottom-row/bottom-row/${i}/image.png`, 128);

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

let ok = 0, fail = 0, skip = 0;
for (const [dest, url] of Object.entries(assets)) {
  const outPath = join(OUT, dest);
  if (await exists(outPath)) { skip++; continue; }
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, buf);
    ok++;
    console.log(`  ✓ ${dest} (${(buf.length / 1024).toFixed(0)}kb)`);
  } catch (err) {
    fail++;
    console.warn(`  ✗ ${dest} - ${err.message} (will render dashed placeholder)`);
  }
}
console.log(`\nDone. ${ok} fetched, ${skip} skipped, ${fail} failed.`);
