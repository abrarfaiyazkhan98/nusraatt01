import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Diary posts are plain Markdown files in src/content/diary.
 * The file name becomes the address: `slow-sunday.md` → /diary/slow-sunday
 *
 * Reads are synchronous on purpose: the content is the same for every visitor,
 * so Next.js bakes it into static pages at build time.
 */

export const DIARY_DIR = path.join(process.cwd(), "src", "content", "diary");

export type GalleryImage = { src: string; alt: string; caption?: string };

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
  excerpt: string;
  cover: string;
  coverAlt: string;
  gallery: GalleryImage[];
  sample: boolean;
};

export type Post = PostMeta & { html: string; readingMinutes: number };

function str(value: unknown, field: string, file: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Diary post "${file}" is missing "${field}" in its front matter.`);
  }
  return value.trim();
}

export function parsePost(slug: string, source: string): Post {
  const { data, content } = matter(source);
  const file = `${slug}.md`;
  const gallery = Array.isArray(data.gallery)
    ? (data.gallery as GalleryImage[]).filter((g) => g && typeof g.src === "string")
    : [];
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: str(data.title, "title", file),
    date: str(data.date, "date", file),
    category: str(data.category, "category", file),
    excerpt: str(data.excerpt, "excerpt", file),
    cover: str(data.cover, "cover", file),
    coverAlt: typeof data.coverAlt === "string" ? data.coverAlt : "",
    gallery: gallery.map((g) => ({ src: g.src, alt: g.alt ?? "", caption: g.caption })),
    sample: data.sample === true,
    html: marked.parse(content, { async: false, gfm: true }),
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

function slugs(): string[] {
  if (!fs.existsSync(DIARY_DIR)) return [];
  return fs
    .readdirSync(DIARY_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPost(slug: string): Post | null {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const file = path.join(DIARY_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return parsePost(slug, fs.readFileSync(file, "utf8"));
}

/** Newest first. */
export function getAllPosts(): Post[] {
  return slugs()
    .map((slug) => getPost(slug)!)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Newest first, without the article bodies — light enough to send to the browser. */
export function getAllPostMeta(): PostMeta[] {
  return getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    excerpt: p.excerpt,
    cover: p.cover,
    coverAlt: p.coverAlt,
    gallery: p.gallery,
    sample: p.sample,
  }));
}

export { formatDate } from "./date";
