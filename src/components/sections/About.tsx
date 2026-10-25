import { site, type Tone } from "@/content/site";
import { FadeImage } from "../FadeImage";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export const toneClass: Record<Tone, string> = {
  pink: "bg-pink/80",
  butter: "bg-butter/80",
  lavender: "bg-lavender",
  cream: "bg-paper",
};

const tilts = ["-rotate-1", "rotate-1", "-rotate-[0.6deg]", "rotate-[1.4deg]", "rotate-[0.4deg]", "-rotate-[1.2deg]"];

export function About() {
  const { about } = site;
  const photo = site.memories.photos.find((p) => !p.src.includes("placeholder")) ?? site.memories.photos[0];

  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="container-soft">
        <SectionHeading id="about-title" eyebrow="about" title={about.heading} />

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          {/* bio card with a taped photo */}
          <Reveal className="card relative mx-auto max-w-md p-6 pt-8 sm:p-8 lg:sticky lg:top-28">
            <span aria-hidden className="tape -top-3 left-8 -rotate-6" />
            <div className="flex items-start gap-5">
              <div className="relative w-28 shrink-0 rotate-[-4deg] rounded-[4px] bg-paper p-1.5 pb-6 shadow-[var(--shadow-sticker)] ring-1 ring-cocoa/5 sm:w-32">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-pink">
                  <FadeImage src={photo.src} alt={photo.alt} fill sizes="128px" className="object-cover object-top" />
                </div>
                <span aria-hidden className="absolute inset-x-0 bottom-0.5 text-center font-hand text-base">
                  that&rsquo;s me!
                </span>
              </div>
              <p className="pt-1 font-hand text-[1.7rem] leading-[1.15] text-cocoa">hello, friend ♡</p>
            </div>
            <p className="mt-5 text-[1.05rem] leading-relaxed">{about.bio}</p>
            <p aria-hidden className="mt-4 text-right font-hand text-2xl text-rose">
              — {site.name.toLowerCase()}
            </p>
          </Reveal>

          {/* little fact cards */}
          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {about.facts.map((f, i) => (
              <Reveal
                as="li"
                key={f.label}
                delay={(i % 2) * 90 + Math.floor(i / 2) * 60}
                className={`group relative rounded-[24px] p-5 shadow-[var(--shadow-soft)] ring-1 ring-cocoa/5 transition-[rotate,translate] duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:rotate-0 sm:p-6 ${toneClass[f.tone]} ${tilts[i % tilts.length]}`}
              >
                <span
                  aria-hidden
                  className="sticker absolute -top-3 -right-2 size-11 text-xl transition-transform duration-500 ease-[var(--ease-bounce)] group-hover:scale-110 group-hover:rotate-12"
                >
                  {f.emoji}
                </span>
                <h3 className="font-hand text-[1.6rem] leading-tight font-bold">{f.label}</h3>
                <p className="mt-1.5 text-cocoa">{f.value}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
