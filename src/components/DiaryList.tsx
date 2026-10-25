"use client";

import { useState } from "react";
import type { PostMeta } from "@/lib/diary";
import { DiaryCard } from "./DiaryCard";

/** All diary posts with gentle category filters. */
export function DiaryList({ posts, categories }: { posts: PostMeta[]; categories: readonly string[] }) {
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? posts.filter((p) => p.category === active) : posts;
  const count = (c: string) => posts.filter((p) => p.category === c).length;

  const chip = (label: string, value: string | null, n: number) => {
    const on = active === value;
    return (
      <li key={label}>
        <button
          type="button"
          aria-pressed={on}
          onClick={() => setActive(value)}
          className={`min-h-11 rounded-full px-4 text-sm font-extrabold transition-all duration-300 active:scale-95 ${
            on ? "bg-cocoa text-cream shadow-[var(--shadow-sticker)]" : "bg-paper text-cocoa ring-1 ring-cocoa/10 hover:bg-pink/60"
          }`}
        >
          {label} <span className={on ? "text-cream/70" : "text-cocoa-soft"}>{n}</span>
        </button>
      </li>
    );
  };

  return (
    <>
      <ul aria-label="Filter by category" className="mb-12 flex flex-wrap justify-center gap-2">
        {chip("all pages", null, posts.length)}
        {categories.map((c) => chip(c.toLowerCase(), c, count(c)))}
      </ul>

      <p className="sr-only" aria-live="polite">
        showing {shown.length} {shown.length === 1 ? "post" : "posts"}
      </p>

      {shown.length > 0 ? (
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((post, i) => (
            <li key={post.slug} className="page-enter" style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}>
              <DiaryCard post={post} index={i} headingLevel={2} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-16 text-center font-hand text-3xl text-cocoa-soft">no pages here yet… soon ♡</p>
      )}
    </>
  );
}
