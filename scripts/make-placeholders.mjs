#!/usr/bin/env node
/**
 * Generates the soft pastel placeholder images used until real photos are added.
 *
 *   npm run placeholders
 *
 * Every file is clearly labelled "placeholder" so it's obvious what still needs replacing.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const palettes = [
  ["#F8DDE5", "#FFF0B8"],
  ["#EDE4FA", "#F8DDE5"],
  ["#FFF0B8", "#FFFCF7"],
  ["#F8DDE5", "#EDE4FA"],
  ["#FFFCF7", "#EFAFC2"],
  ["#EDE4FA", "#FFF0B8"],
];

const doodles = {
  heart: `<path d="M0 -14 C -8 -30, -34 -22, -26 -2 C -20 12, -4 20, 0 28 C 4 20, 20 12, 26 -2 C 34 -22, 8 -30, 0 -14 Z" />`,
  flower: `<g>${[0, 72, 144, 216, 288]
    .map((r) => `<ellipse rx="11" ry="20" cy="-20" transform="rotate(${r})" />`)
    .join("")}<circle r="9" fill="#FFF0B8" /></g>`,
  star: `<path d="M0 -30 L8 -9 L30 -9 L12 4 L19 26 L0 13 L-19 26 L-12 4 L-30 -9 L-8 -9 Z" />`,
  sun: `<g><circle r="16" />${[0, 45, 90, 135, 180, 225, 270, 315]
    .map((r) => `<rect x="-2.5" y="-32" width="5" height="10" rx="2.5" transform="rotate(${r})" />`)
    .join("")}</g>`,
  cloud: `<path d="M-30 10 a14 14 0 0 1 4 -27 a18 18 0 0 1 34 -4 a14 14 0 0 1 22 15 a12 12 0 0 1 -2 16 Z" />`,
  note: `<g><rect x="-4" y="-28" width="6" height="42" rx="3" /><ellipse cx="-10" cy="16" rx="12" ry="9" /><path d="M2 -28 q20 6 18 22 q-6 -10 -18 -10 Z" /></g>`,
};

const items = [
  // diary covers (4:3)
  ["placeholders/cover-1", 1200, 900, 0, "heart", "cover photo"],
  ["placeholders/cover-2", 1200, 900, 1, "flower", "cover photo"],
  ["placeholders/cover-3", 1200, 900, 2, "sun", "cover photo"],
  ["placeholders/cover-4", 1200, 900, 3, "cloud", "cover photo"],
  ["placeholders/cover-5", 1200, 900, 4, "star", "cover photo"],
  ["placeholders/cover-6", 1200, 900, 5, "note", "cover photo"],
  // polaroids (4:5)
  ["placeholders/moment-1", 1000, 1250, 1, "flower", "photo"],
  ["placeholders/moment-2", 1000, 1250, 2, "sun", "photo"],
  ["placeholders/moment-3", 1000, 1250, 3, "heart", "photo"],
  ["placeholders/moment-4", 1000, 1250, 5, "cloud", "photo"],
  ["placeholders/moment-5", 1000, 1250, 0, "star", "photo"],
  // album art
  ["placeholders/album", 800, 800, 3, "note", "album art"],
];

function svg(w, h, [a, b], doodle, label) {
  const scale = Math.min(w, h) / 260;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <pattern id="dots" width="${18 * scale}" height="${18 * scale}" patternUnits="userSpaceOnUse">
      <circle cx="${9 * scale}" cy="${9 * scale}" r="${1.2 * scale}" fill="#6F5554" fill-opacity="0.12"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#dots)"/>
  <g transform="translate(${w / 2} ${h / 2 - 14 * scale}) scale(${scale})" fill="#EFAFC2" fill-opacity="0.9">${doodles[doodle]}</g>
  <text x="50%" y="${h / 2 + 46 * scale}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
    font-size="${11 * scale}" letter-spacing="${1.5 * scale}" fill="#6F5554" fill-opacity="0.55">${label.toUpperCase()} · PLACEHOLDER</text>
</svg>`;
}

for (const [name, w, h, p, doodle, label] of items) {
  const out = join("public", "images", `${name}.webp`);
  await mkdir(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg(w, h, palettes[p], doodle, label)))
    .webp({ quality: 80 })
    .toFile(out);
  console.log("✓", out);
}
