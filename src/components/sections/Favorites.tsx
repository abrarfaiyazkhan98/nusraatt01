import { site } from "@/content/site";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

const tones = ["bg-paper", "bg-butter/70", "bg-lavender", "bg-pink/70", "bg-paper"];
const tilts = ["rotate-[0.8deg]", "-rotate-1", "rotate-[0.4deg]", "-rotate-[0.6deg]", "rotate-1"];

export function Favorites() {
  const { favorites } = site;
  return (
    <section id="favorites" aria-labelledby="favorites-title" className="section">
      <div className="container-soft">
        <SectionHeading id="favorites-title" eyebrow="favorites" title={favorites.heading} intro={favorites.intro} />

        <ul className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.lists.map((list, i) => (
            <Reveal
              as="li"
              key={list.title}
              delay={(i % 3) * 80}
              className={`group relative rounded-[24px] p-6 shadow-[var(--shadow-soft)] ring-1 ring-cocoa/5 transition-[rotate,translate] duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:rotate-0 ${tones[i % tones.length]} ${tilts[i % tilts.length]}`}
            >
              <div className="flex items-center gap-3">
                <span aria-hidden className="sticker size-11 text-xl transition-transform duration-500 ease-[var(--ease-bounce)] group-hover:-rotate-12">
                  {list.emoji}
                </span>
                <h3 className="font-hand text-[1.8rem] leading-none font-bold">favorite {list.title}</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {list.items.map((item, j) => (
                  <li key={j} className="flex items-baseline gap-2.5">
                    <span aria-hidden className="text-sm text-blush-deep">
                      ♡
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}

          {/* quotes */}
          <Reveal
            as="li"
            delay={160}
            className="relative rounded-[24px] bg-cocoa p-6 text-cream shadow-[var(--shadow-soft)] sm:col-span-2 lg:col-span-1 lg:-rotate-1"
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className="grid size-11 place-items-center rounded-full bg-cream/15 text-xl">
                ❝
              </span>
              <h3 className="font-hand text-[1.8rem] leading-none font-bold">favorite quotes</h3>
            </div>
            <ul className="mt-4 space-y-4">
              {favorites.quotes.map((q, j) => (
                <li key={j}>
                  <figure>
                    <blockquote className="font-hand text-[1.55rem] leading-snug">&ldquo;{q.text}&rdquo;</blockquote>
                    <figcaption className="mt-1 text-sm font-bold text-cream/80">— {q.by}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
