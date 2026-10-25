#!/usr/bin/env node
/**
 * Turn a big camera photo into a small, web-friendly WebP.
 *
 *   npm run photo -- <input.jpg> <output-name> [--max 1800] [--crop x,y,w,h] [--quality 82]
 *
 * Examples
 *   npm run photo -- ~/Desktop/beach.jpg memories/beach
 *     → public/images/memories/beach.webp
 *
 *   npm run photo -- ~/Desktop/me.jpg portrait --crop 630,1450,2300,2300 --max 1200
 *     → crops a square around the face first (pixel coordinates of the upright photo)
 *
 * RAW files (.CR2, .NEF…) can't be read directly. Convert them on a Mac first:
 *   sips -s format jpeg IMG_0001.CR2 --out IMG_0001.jpg
 *
 * The original file is never modified.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const args = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) flags[args[i].slice(2)] = args[++i];
  else positional.push(args[i]);
}

const [input, name] = positional;
if (!input || !name) {
  console.error("usage: npm run photo -- <input> <output-name> [--max 1800] [--crop x,y,w,h] [--quality 82]");
  process.exit(1);
}

const max = Number(flags.max ?? 1800);
const quality = Number(flags.quality ?? 82);
const out = join("public", "images", `${name.replace(/\.webp$/, "")}.webp`);
await mkdir(dirname(out), { recursive: true });

// .rotate() applies the camera's EXIF orientation so portraits stay upright.
let image = sharp(input).rotate();
if (flags.crop) {
  // Extracting after rotate needs a materialised buffer.
  const upright = await image.toBuffer();
  const [left, top, width, height] = flags.crop.split(",").map(Number);
  image = sharp(upright).extract({ left, top, width, height });
}

const info = await image
  .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
  .webp({ quality, effort: 6, smartSubsample: true })
  .toFile(out);

console.log(`✓ ${out}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
