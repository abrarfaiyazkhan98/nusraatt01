import { ExternalLink, Headphones } from "lucide-react";
import { site } from "@/content/site";
import { FadeImage } from "../FadeImage";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { SpotifyEmbed } from "../SpotifyEmbed";

export function Music() {
  const { music } = site;
  const song = music.favoriteSong;

  return (
    <section id="music" aria-labelledby="music-title" className="section">
      <div className="container-soft">
        <SectionHeading id="music-title" eyebrow="music" title={music.heading} intro={music.intro} />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* favourite song */}
          <Reveal className="card group relative overflow-hidden p-6 sm:p-8">
            <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.18em] text-cocoa-soft uppercase">
              <span className="size-2 animate-shimmer rounded-full bg-blush-deep" aria-hidden />
              favorite song
            </p>

            <div className="relative mt-6 mb-2 w-[min(62%,15rem)]">
              {/* vinyl sliding out from behind the sleeve */}
              <div
                aria-hidden
                className="absolute inset-[4%] translate-x-[34%] transition-transform duration-700 ease-[var(--ease-soft)] group-hover:translate-x-[46%]"
              >
                <div className="vinyl size-full animate-spin-slow rounded-full" />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-lavender shadow-[var(--shadow-lift)] ring-1 ring-cocoa/5">
                <FadeImage src={song.artwork} alt={`Album artwork for ${song.title}`} fill sizes="240px" className="object-cover" />
              </div>
            </div>

            <h3 className="mt-6 text-2xl leading-tight font-black">{song.title}</h3>
            <p className="font-semibold text-cocoa-soft">{song.artist}</p>
            <p className="mt-4 rounded-2xl bg-butter/60 px-4 py-3 font-hand text-[1.45rem] leading-snug text-cocoa-deep">
              &ldquo;{song.note}&rdquo;
            </p>
            <a href={song.spotifyUrl} target="_blank" rel="noreferrer" className="btn btn-primary mt-6">
              <SpotifyGlyph />
              Open in Spotify
              <ExternalLink size={15} aria-hidden className="opacity-70" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Reveal>

          {/* playlist */}
          <Reveal delay={120} className="card relative flex flex-col p-6 sm:p-8">
            <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.18em] text-cocoa-soft uppercase">
              <Headphones size={15} aria-hidden />
              {music.playlistName}
            </p>
            <p className="mt-2 mb-5 font-hand text-2xl text-cocoa">press play whenever you like ♡</p>
            <SpotifyEmbed playlistId={music.playlistId} title={`Spotify playlist: ${music.playlistName}`} />
            <Cassette />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SpotifyGlyph() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Zm4.82 15.14a.65.65 0 0 1-.9.22c-2.46-1.5-5.56-1.84-9.2-1.01a.66.66 0 0 1-.3-1.28c3.99-.91 7.4-.52 10.18 1.17.31.19.4.6.22.9Zm1.29-2.86a.82.82 0 0 1-1.13.27c-2.82-1.73-7.11-2.23-10.44-1.22a.82.82 0 1 1-.48-1.57c3.8-1.15 8.53-.6 11.78 1.4.38.24.5.74.27 1.12Zm.11-2.98C14.84 8.8 9.27 8.6 6.05 9.59a.98.98 0 1 1-.57-1.88c3.7-1.12 9.85-.9 13.74 1.4a.98.98 0 0 1-1 1.69Z" />
    </svg>
  );
}

/** a tiny decorative cassette — the reels turn slowly (and stop for reduced motion) */
function Cassette() {
  return (
    <div aria-hidden className="pointer-events-none absolute -top-5 -right-3 rotate-[8deg] sm:-right-5">
      <div className="relative h-14 w-[5.5rem] rounded-lg bg-lavender shadow-[var(--shadow-sticker)] ring-1 ring-cocoa/10">
        <div className="absolute inset-x-2 top-1.5 h-3 rounded-sm bg-paper/80" />
        <div className="absolute inset-x-3 bottom-2 flex h-6 items-center justify-between rounded-full bg-cocoa/80 px-1.5">
          <span className="reel size-4 animate-spin-slow rounded-full" />
          <span className="reel size-4 animate-spin-slow rounded-full" />
        </div>
      </div>
    </div>
  );
}
