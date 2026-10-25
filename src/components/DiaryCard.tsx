import Link from "next/link";
import { formatDate } from "@/lib/date";
import type { PostMeta } from "@/lib/diary";
import { FadeImage } from "./FadeImage";

const tilts = ["-rotate-1", "rotate-[0.8deg]", "-rotate-[0.5deg]", "rotate-[1.2deg]", "-rotate-[1.3deg]", "rotate-[0.4deg]"];
const tapes = ["var(--color-butter)", "var(--color-pink)", "var(--color-lavender)"];

export const categoryTone: Record<string, string> = {
  "Little thoughts": "bg-lavender",
  "Life lately": "bg-butter",
  "Happy moments": "bg-pink",
  "Places I've been": "bg-[#e3f1e6]",
  "Things I love": "bg-pink",
};

/** A scrapbook page for one diary post. The whole card is clickable via the title link. */
export function DiaryCard({ post, index = 0, headingLevel = 3 }: { post: PostMeta; index?: number; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return (
    <article
      className={`group relative flex h-full flex-col rounded-[22px] bg-paper p-3 pb-6 shadow-[var(--shadow-soft)] ring-1 ring-cocoa/5 transition-[rotate,translate,box-shadow] duration-500 ease-[var(--ease-soft)] focus-within:rotate-0 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[var(--shadow-lift)] ${tilts[index % tilts.length]}`}
    >
      <span
        aria-hidden
        className="tape -top-3 left-1/2 z-10 -translate-x-1/2 rotate-[4deg]"
        style={{ "--tape": tapes[index % tapes.length] } as React.CSSProperties}
      />
      <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-pink/50">
        <FadeImage
          src={post.cover}
          alt={post.coverAlt}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
        />
        {post.sample && (
          <span className="absolute top-3 right-3 rounded-full bg-paper/90 px-2.5 py-0.5 text-xs font-extrabold tracking-wide text-cocoa-soft">
            sample
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 pt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className={`rounded-full px-3 py-0.5 text-xs font-extrabold text-cocoa-deep ${categoryTone[post.category] ?? "bg-pink"}`}>
            {post.category}
          </span>
          <time dateTime={post.date} className="font-hand text-xl text-cocoa-soft">
            {formatDate(post.date)}
          </time>
        </div>
        <Heading className="mt-3 text-[1.35rem] leading-snug font-black">
          <Link href={`/diary/${post.slug}`} className="after:absolute after:inset-0 after:rounded-[22px] focus-visible:outline-none">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-3 text-[0.98rem] text-cocoa-soft">{post.excerpt}</p>
        <span aria-hidden className="mt-auto pt-4 text-sm font-extrabold text-rose transition-transform duration-300 group-hover:translate-x-1">
          read this page →
        </span>
      </div>
      {/* focus ring for the whole card when the link is focused */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] ring-cocoa group-has-[a:focus-visible]:ring-[2.5px]" />
    </article>
  );
}
