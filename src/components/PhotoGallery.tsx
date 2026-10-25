"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { FadeImage } from "./FadeImage";

export type Photo = { src: string; alt: string; caption?: string };

// gentle, deterministic tilts so server and browser always agree
const TILTS = [-3, 2.2, -1.4, 3, -2.4, 1.6, -0.8, 2.6];
const TAPES = ["var(--color-butter)", "var(--color-pink)", "var(--color-lavender)"];

/** A grid of polaroids that open into a fullscreen, keyboard-friendly viewer. */
export function PhotoGallery({ photos, label }: { photos: readonly Photo[]; label: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const go = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setIndex((i) => {
        if (i !== null) triggers.current[i]?.focus();
        return null;
      });
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const current = index === null ? null : photos[index];

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-10 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={`${p.src}-${i}`} className="flex justify-center">
            <button
              ref={(el) => {
                triggers.current[i] = el;
              }}
              type="button"
              onClick={() => open(i)}
              className="group relative w-full max-w-[17rem] cursor-zoom-in rounded-[6px] bg-paper p-2.5 pb-11 text-left shadow-[var(--shadow-soft)] ring-1 ring-cocoa/5 transition-[rotate,translate,box-shadow] duration-500 ease-[var(--ease-soft)] hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[var(--shadow-lift)] focus-visible:rotate-0 sm:p-3 sm:pb-14"
              style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
              aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.caption ?? p.alt}`}
            >
              {i % 3 === 0 && (
                <span
                  aria-hidden
                  className="tape -top-3 left-1/2 z-10 -translate-x-1/2 -rotate-3"
                  style={{ "--tape": TAPES[i % TAPES.length] } as React.CSSProperties}
                />
              )}
              <span className="relative block aspect-[4/5] overflow-hidden rounded-[3px] bg-pink/50">
                <FadeImage
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 30vw, 46vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
                />
              </span>
              {p.caption && (
                <span className="absolute inset-x-2 bottom-2 truncate text-center font-hand text-xl leading-tight text-cocoa sm:bottom-3 sm:text-2xl">
                  {p.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={label}
        className="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-cream backdrop:bg-cocoa-deep/80 backdrop:backdrop-blur-sm"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {current && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-16 sm:px-20" onClick={(e) => e.target === e.currentTarget && close()}>
            <figure key={index} className="lightbox-photo relative flex max-h-full w-full max-w-3xl flex-col items-center rounded-lg bg-paper p-3 pb-4 shadow-2xl sm:p-4">
              <div className="relative h-[min(68dvh,820px)] w-full">
                <Image src={current.src} alt={current.alt} fill sizes="(min-width: 768px) 768px, 100vw" className="object-contain" />
              </div>
              <figcaption className="mt-3 text-center font-hand text-2xl text-cocoa sm:text-3xl">
                {current.caption ?? current.alt}
              </figcaption>
            </figure>
            <p className="text-sm font-bold tracking-widest text-cream/85" aria-live="polite">
              {index! + 1} / {photos.length}
            </p>
          </div>
        )}
        <button type="button" onClick={close} className="lightbox-btn absolute top-4 right-4" aria-label="Close photo viewer">
          <X size={22} />
        </button>
        {photos.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="lightbox-btn absolute top-1/2 left-3 -translate-y-1/2 sm:left-6" aria-label="Previous photo">
              <ChevronLeft size={24} />
            </button>
            <button type="button" onClick={() => go(1)} className="lightbox-btn absolute top-1/2 right-3 -translate-y-1/2 sm:right-6" aria-label="Next photo">
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
