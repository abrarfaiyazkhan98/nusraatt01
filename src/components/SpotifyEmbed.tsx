"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Spotify's official embed player. It isn't loaded until it's about to scroll into view,
 * so it costs nothing on first load. Never autoplays.
 */
export function SpotifyEmbed({ playlistId, title }: { playlistId: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-[352px] overflow-hidden rounded-[18px] bg-pink/40">
      {!ready && (
        <div aria-hidden className="absolute inset-0 flex flex-col gap-3 p-4">
          <div className="flex gap-3">
            <div className="size-24 animate-shimmer rounded-xl bg-pink" />
            <div className="flex flex-1 flex-col gap-2 pt-2">
              <div className="h-4 w-2/3 animate-shimmer rounded-full bg-pink" />
              <div className="h-3 w-1/3 animate-shimmer rounded-full bg-pink" />
            </div>
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-9 animate-shimmer rounded-lg bg-pink/70" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
      )}
      {mount && (
        <iframe
          title={title}
          src={`https://open.spotify.com/embed/playlist/${encodeURIComponent(playlistId)}?utm_source=generator`}
          width="100%"
          height="352"
          loading="lazy"
          allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          onLoad={() => setReady(true)}
          className={`relative border-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
