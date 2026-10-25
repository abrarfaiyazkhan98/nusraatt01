import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { formatDate, getAllPosts, getPost } from "@/lib/diary";
import { categoryTone } from "@/components/DiaryCard";
import { PhotoGallery } from "@/components/PhotoGallery";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/diary/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

export default async function DiaryPost({ params }: PageProps<"/diary/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const i = all.findIndex((p) => p.slug === post.slug);
  const newer = all[i - 1];
  const older = all[i + 1];

  return (
    <article className="pt-10 pb-24 sm:pt-14">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <Link href="/diary" className="link-soft inline-flex items-center gap-1.5 text-sm">
          <ArrowLeft size={16} aria-hidden /> back to the diary
        </Link>

        <header className="mt-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span className={`rounded-full px-3 py-0.5 text-xs font-extrabold text-cocoa-deep ${categoryTone[post.category] ?? "bg-pink"}`}>
              {post.category}
            </span>
            <time dateTime={post.date} className="font-hand text-2xl text-cocoa-soft">
              {formatDate(post.date)}
            </time>
            <span className="inline-flex items-center gap-1 text-sm text-cocoa-soft">
              <Clock size={14} aria-hidden /> {post.readingMinutes} min read
            </span>
          </div>
          <h1 className="mt-4 text-4xl leading-[1.1] font-black tracking-[-0.02em] sm:text-5xl">{post.title}</h1>
        </header>

        <div className="relative mx-auto mt-10 -rotate-[0.6deg] rounded-[26px] bg-paper p-2.5 shadow-[var(--shadow-lift)] ring-1 ring-cocoa/5 sm:p-3">
          <span aria-hidden className="tape -top-3 left-10 -rotate-6" />
          <span aria-hidden className="tape -top-3 right-10 rotate-6" style={{ "--tape": "var(--color-pink)" } as React.CSSProperties} />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-pink/50 sm:aspect-[16/10]">
            <Image src={post.cover} alt={post.coverAlt} fill preload sizes="(min-width: 768px) 744px, 100vw" className="object-cover" />
          </div>
        </div>

        <div className="card mt-12 px-6 py-10 sm:px-12 sm:py-14">
          <div className="prose-diary" dangerouslySetInnerHTML={{ __html: post.html }} />
          <p aria-hidden className="mt-10 text-right font-hand text-3xl text-rose">
            ♡
          </p>
        </div>
      </div>

      {post.gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="container-soft mt-16">
          <h2 id="gallery-title" className="mb-10 text-center font-hand text-5xl font-bold">
            little snapshots
          </h2>
          <PhotoGallery photos={post.gallery} label={`Photos from “${post.title}”`} />
        </section>
      )}

      <nav aria-label="More diary pages" className="mx-auto mt-16 grid w-full max-w-3xl gap-4 px-4 sm:grid-cols-2 sm:px-6">
        {older ? (
          <Link href={`/diary/${older.slug}`} className="card group p-5 transition-transform duration-500 hover:-translate-y-1">
            <span className="flex items-center gap-1 text-sm font-extrabold text-cocoa-soft">
              <ArrowLeft size={15} aria-hidden className="transition-transform group-hover:-translate-x-1" /> older page
            </span>
            <span className="mt-1 block font-bold">{older.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link href={`/diary/${newer.slug}`} className="card group p-5 text-right transition-transform duration-500 hover:-translate-y-1">
            <span className="flex items-center justify-end gap-1 text-sm font-extrabold text-cocoa-soft">
              newer page <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </span>
            <span className="mt-1 block font-bold">{newer.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
