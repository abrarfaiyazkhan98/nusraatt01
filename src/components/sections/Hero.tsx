import Link from "next/link";
import { ArrowDown, BookHeart } from "lucide-react";
import { site } from "@/content/site";
import { HeroMascot } from "../HeroMascot";

export function Hero() {
  const { hero } = site;
  // the trailing heart is drawn in pink
  const hasHeart = hero.greeting.trim().endsWith("♡");
  const greeting = hasHeart ? hero.greeting.trim().slice(0, -1).trimEnd() : hero.greeting;
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-x-clip pt-10 pb-16 sm:pt-16 sm:pb-24">
      <div className="container-soft flex flex-col items-center text-center">
        <HeroMascot messages={hero.messages} name={site.name} />
        <p aria-hidden className="mt-5 font-hand text-xl text-cocoa-soft/80 sm:mt-6">
          psst — boop her ♡
        </p>

        <h1 id="hero-title" className="mt-6 text-[2.6rem] leading-[1.05] font-black tracking-[-0.03em] text-cocoa sm:text-7xl">
          {greeting}
          {hasHeart && (
            <span className="ml-2 inline-block text-blush-deep" aria-hidden>
              ♡
            </span>
          )}
        </h1>
        <p className="mt-4 text-xl font-semibold text-cocoa sm:text-2xl">{hero.intro}</p>
        <p className="mt-3 max-w-md text-cocoa-soft">{hero.tagline}</p>

        <div className="mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link href="/#about" className="btn btn-primary">
            Get to know me
            <ArrowDown size={18} aria-hidden />
          </Link>
          <Link href="/diary" className="btn btn-soft">
            <BookHeart size={18} aria-hidden className="text-blush-deep" />
            Read my diary
          </Link>
        </div>

        <p
          aria-hidden
          className="mt-10 inline-block -rotate-3 rounded-md bg-butter/90 px-3 py-1 font-hand text-xl text-cocoa-deep shadow-[var(--shadow-sticker)] sm:absolute sm:right-[8%] sm:bottom-24 sm:mt-0 lg:right-[14%]"
        >
          {hero.signature}
        </p>
      </div>
    </section>
  );
}
