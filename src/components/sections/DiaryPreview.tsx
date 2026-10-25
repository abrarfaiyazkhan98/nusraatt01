import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { getAllPosts } from "@/lib/diary";
import { DiaryCard } from "../DiaryCard";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function DiaryPreview() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="diary" aria-labelledby="diary-title" className="section relative">
      {/* a soft paper band behind the diary */}
      <div aria-hidden className="absolute inset-x-0 inset-y-10 -z-10 -skew-y-2 bg-pink/30" />
      <div className="container-soft">
        <SectionHeading id="diary-title" eyebrow="diary" title={site.diary.heading} intro={site.diary.intro} />
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={i * 100}>
              <DiaryCard post={post} index={i} />
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-12 flex justify-center">
          <Link href="/diary" className="btn btn-soft">
            read every page
            <ArrowRight size={18} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
