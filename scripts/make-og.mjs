#!/usr/bin/env node
/**
 * Builds the social sharing preview (src/app/opengraph-image.jpg) from the hero portrait.
 *
 *   npm run og
 */
import sharp from "sharp";

const W = 1200;
const H = 630;
const SIZE = 430;
const CX = W - 290;

const dots = `<pattern id="d" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1.3" fill="#6F5554" fill-opacity="0.13"/></pattern>`;

const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>${dots}</defs>
  <rect width="100%" height="100%" fill="#FFFCF7"/>
  <rect width="100%" height="100%" fill="url(#d)"/>
  <ellipse cx="${CX}" cy="${H / 2 + 8}" rx="252" ry="240" fill="#FFF0B8" transform="rotate(-8 ${CX} ${H / 2})"/>
  <ellipse cx="${CX + 8}" cy="${H / 2}" rx="238" ry="230" fill="#F8DDE5" transform="rotate(12 ${CX} ${H / 2})"/>
  <text x="88" y="270" font-family="Avenir Next, Helvetica Neue, Arial, sans-serif" font-weight="800" font-size="60" fill="#6F5554" letter-spacing="-1.5">hi, i'm nusraat <tspan fill="#D9849D">♡</tspan></text>
  <text x="90" y="338" font-family="Avenir Next, Helvetica Neue, Arial, sans-serif" font-weight="600" font-size="30" fill="#6F5554">welcome to my little corner</text>
  <text x="90" y="378" font-family="Avenir Next, Helvetica Neue, Arial, sans-serif" font-weight="600" font-size="30" fill="#6F5554">of the internet.</text>
  <rect x="88" y="430" width="300" height="50" rx="25" fill="#6F5554"/>
  <text x="238" y="462" text-anchor="middle" font-family="Avenir Next, Helvetica Neue, Arial, sans-serif" font-weight="700" font-size="19" fill="#FFFCF7">diary · music · memories</text>
</svg>`);

const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}"/></svg>`,
);
const ring = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE + 20}" height="${SIZE + 20}"><circle cx="${(SIZE + 20) / 2}" cy="${(SIZE + 20) / 2}" r="${(SIZE + 20) / 2}" fill="#ffffff"/></svg>`,
);

const portrait = await sharp("public/images/portrait.webp")
  .resize(SIZE, SIZE)
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

await sharp(background)
  .composite([
    { input: ring, left: CX - (SIZE + 20) / 2, top: H / 2 - (SIZE + 20) / 2 },
    { input: portrait, left: CX - SIZE / 2, top: H / 2 - SIZE / 2 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("src/app/opengraph-image.jpg");

console.log("✓ src/app/opengraph-image.jpg");
