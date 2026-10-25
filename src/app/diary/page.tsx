import type { Metadata } from "next";
import { site } from "@/content/site";
import { getAllPostMeta } from "@/lib/diary";
import { DiaryList } from "@/components/DiaryList";
import { Squiggle } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "diary",
  description: `${site.diary.heading} ${site.diary.intro}`,
};

export default function DiaryPage() {
  const posts = getAllPostMeta();

  return (
    <div className="container-soft pt-14 pb-24 sm:pt-20">
      <header className="mb-10 flex flex-col items-center text-center">
        <p className="rounded-full bg-paper px-3 py-1 text-xs font-extrabold tracking-[0.18em] text-cocoa-soft uppercase ring-1 ring-cocoa/10">
          my little diary
        </p>
        <h1 className="mt-4 font-hand text-6xl font-bold sm:text-7xl">{site.diary.heading}</h1>
        <Squiggle className="mt-2" />
        <p className="mt-4 max-w-md text-cocoa-soft">{site.diary.intro}</p>
      </header>
      <DiaryList posts={posts} categories={site.diary.categories} />
    </div>
  );
}
