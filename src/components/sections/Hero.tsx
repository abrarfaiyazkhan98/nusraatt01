import Link from "next/link";
import { ArrowDown, BookHeart } from "lucide-react";
import { site } from "@/content/site";
import { ChibiMascot } from "../ChibiMascot";

export function Hero() {
  const { hero } = site;
  // the trailing heart is drawn in pink
  const hasHeart = hero.greeting.trim().endsWith("♡");
  const greeting = hasHeart ? hero.greeting.trim().slice(0, -1).trimEnd() : hero.greeting;
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-x-clip pt-10 pb-16 sm:pt-12 sm:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_32%,rgba(248,221,229,.5),transparent_57%)]" />
      <div aria-hidden className="pointer-events-none absolute left-[5%] top-[20%] hidden -rotate-6 flex-col gap-2 rounded-lg border-[9px] border-white bg-white p-2 shadow-[var(--shadow-lift)] lg:flex">
        <div className="grid h-32 w-32 place-items-center bg-gradient-to-br from-blush/60 via-butter to-lavender text-5xl">🌷</div>
        <span className="font-hand text-xl text-cocoa">good things ahead ♡</span>
      </div>
      <div aria-hidden className="pointer-events-none absolute right-[7%] top-[27%] hidden rotate-3 font-hand text-2xl leading-relaxed text-cocoa-soft xl:block">
        same girl...<br />bigger dreams ♡<br />kinder days ♡<br />happier me
      </div>
      <div aria-hidden className="pointer-events-none absolute left-[12%] bottom-[20%] hidden -rotate-6 rounded-lg bg-butter/65 px-6 py-4 font-hand text-xl leading-relaxed text-cocoa shadow-[var(--shadow-sticker)] lg:block">
        ☑ kinder days<br />☑ bigger dreams<br />☑ good coffee ♡
      </div>
      <div aria-hidden className="pointer-events-none absolute right-[14%] bottom-[20%] hidden text-6xl opacity-75 lg:block">🐈</div>
      <div className="container-soft flex flex-col items-center text-center">
        <ChibiMascot messages={hero.messages} name={site.name} />
        <p aria-hidden className="mt-5 font-hand text-xl text-cocoa-soft/80 sm:mt-6">
          psst — say hi ♡
        </p>

        <h1 id="hero-title" className="mt-6 font-hand text-[3.4rem] leading-[1.05] font-black tracking-[-0.03em] text-cocoa sm:text-[5.5rem]">
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
          <Link href="/#about" className="btn btn-primary !bg-blush-deep !text-white hover:!bg-rose">
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
