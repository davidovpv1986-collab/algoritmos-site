/**
 * Генерация Open Graph изображения (1200×630) из фирменного логотипа.
 * Запуск: node scripts/generate-og.mjs
 */
import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logoSvg = readFileSync(join(root, "public", "logo.svg"), "utf8");

/* Перекрашиваем словесную часть логотипа из чёрного в молочный,
   чтобы логотип читался на тёмном фоне. */
const lightLogo = logoSvg.replace(
  /<path d="M1031\.1[\s\S]*?fill="black"\/>/,
  (match) => match.replace('fill="black"', 'fill="#EAF3EF"'),
);

const logoBuffer = Buffer.from(lightLogo);

const background = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#05121A"/>
      <stop offset="1" stop-color="#072230"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.8" cy="0.25" r="0.55">
      <stop offset="0" stop-color="#2DA8A4" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#2DA8A4" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0v72" fill="none" stroke="#16414E" stroke-opacity="0.5"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.5"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
</svg>`;

mkdirSync(join(root, "public"), { recursive: true });

const logoWidth = 760;
const logoHeight = Math.round(logoWidth * (700 / 3437));

await sharp(Buffer.from(background))
  .composite([
    {
      input: await sharp(logoBuffer, { density: 150 })
        .resize(logoWidth, logoHeight)
        .png()
        .toBuffer(),
      top: 190,
      left: Math.round((1200 - logoWidth) / 2),
    },
  ])
  .png()
  .toFile(join(root, "public", "og.png"));

console.log("public/og.png создано (1200×630)");
