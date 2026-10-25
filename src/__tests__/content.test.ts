import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { site } from "../content/site";
import { formatDate, getAllPosts, getPost, parsePost } from "../lib/diary";
import { LIMITS, validateNote } from "../lib/notes";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);

describe("site content", () => {
  it("points at images that exist", () => {
    const srcs = [
      site.hero.portrait.src,
      site.music.favoriteSong.artwork,
      ...site.memories.photos.map((p) => p.src),
    ];
    for (const src of srcs) expect(fs.existsSync(publicFile(src)), src).toBe(true);
  });

  it("gives every photo alt text", () => {
    expect(site.hero.portrait.alt.length).toBeGreaterThan(10);
    for (const p of site.memories.photos) expect(p.alt.trim(), p.src).not.toBe("");
  });

  it("has a speech bubble message to show", () => {
    expect(site.hero.messages.length).toBeGreaterThan(0);
  });
});

describe("diary", () => {
  const posts = getAllPosts();

  it("loads at least six posts, newest first", () => {
    expect(posts.length).toBeGreaterThanOrEqual(6);
    const dates = posts.map((p) => p.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("only uses known categories, valid dates and existing images", () => {
    for (const p of posts) {
      expect(site.diary.categories, p.slug).toContain(p.category);
      expect(p.date, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(fs.existsSync(publicFile(p.cover)), p.cover).toBe(true);
      for (const g of p.gallery) expect(fs.existsSync(publicFile(g.src)), g.src).toBe(true);
    }
  });

  it("ignores the _template file and rejects odd slugs", () => {
    expect(posts.find((p) => p.slug.startsWith("_"))).toBeUndefined();
    expect(getPost("../package")).toBeNull();
    expect(getPost("does-not-exist")).toBeNull();
  });

  it("parses front matter and renders markdown", () => {
    const post = parsePost(
      "test",
      `---\ntitle: hi\ndate: 2026-01-02\ncategory: Life lately\nexcerpt: e\ncover: /x.webp\n---\n\nhello **world**`,
    );
    expect(post.date).toBe("2026-01-02");
    expect(post.html).toContain("<strong>world</strong>");
    expect(post.sample).toBe(false);
  });

  it("explains which field is missing", () => {
    expect(() => parsePost("broken", "---\ntitle: x\n---\nhi")).toThrow(/broken\.md.*date/);
  });

  it("formats dates without timezone drift", () => {
    expect(formatDate("2026-01-01")).toBe("January 1, 2026");
  });
});

describe("note validation", () => {
  it("requires a name and a message", () => {
    expect(validateNote({ name: " ", message: "" })).toEqual({
      name: expect.any(String),
      message: expect.any(String),
    });
  });

  it("enforces length limits", () => {
    const errors = validateNote({ name: "a".repeat(LIMITS.name + 1), message: "b".repeat(LIMITS.message + 1) });
    expect(errors.name).toBeDefined();
    expect(errors.message).toBeDefined();
  });

  it("accepts a kind little note", () => {
    expect(validateNote({ name: "Mia", message: "your site is so cute!" })).toEqual({});
  });
});
