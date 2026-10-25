"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";

const links = [
  { label: "Home", href: "/", section: "top" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Diary", href: "/diary", section: "diary" },
  { label: "Memories", href: "/#memories", section: "memories" },
  { label: "Music", href: "/#music", section: "music" },
] as const;

type Section = (typeof links)[number]["section"];

/** Which homepage section is currently in the middle of the screen. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<Section>("top");
  useEffect(() => {
    if (!enabled) return;
    const ids = ["top", "about", "music", "diary", "memories", "favorites", "note"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.id;
          // sections without their own nav item light up the closest one
          setActive(id === "favorites" || id === "note" ? "memories" : (id as Section));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

export function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const section = useActiveSection(onHome);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isActive = (s: Section) => (onHome ? section === s : s === "diary" && pathname.startsWith("/diary"));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on Escape or a tap outside (links close it on click)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !toggleRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Main"
        className={`relative mx-auto flex max-w-3xl items-center justify-between gap-2 rounded-full py-1.5 pr-1.5 pl-5 transition-all duration-500 ease-[var(--ease-soft)] ${
          scrolled || open
            ? "bg-paper/85 shadow-[var(--shadow-soft)] ring-1 ring-cocoa/5 backdrop-blur-md"
            : "bg-paper/40 ring-1 ring-cocoa/[0.03]"
        }`}
      >
        <Link href="/" className="group flex items-center gap-1 rounded-full py-1 font-hand text-[1.7rem] leading-none font-bold">
          <span>{site.name.toLowerCase()}</span>
          <span aria-hidden className="text-blush-deep transition-transform duration-500 ease-[var(--ease-bounce)] group-hover:scale-125 group-hover:-rotate-12">
            ♡
          </span>
        </Link>

        {/* desktop */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                aria-current={isActive(l.section) ? (onHome ? "true" : "page") : undefined}
                className={`relative block rounded-full px-4 py-2 text-[0.95rem] font-bold transition-colors duration-300 ${
                  isActive(l.section) ? "bg-pink text-cocoa-deep" : "text-cocoa-soft hover:bg-pink/40 hover:text-cocoa"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* mobile */}
        <button
          ref={toggleRef}
          type="button"
          className="grid size-11 place-items-center rounded-full bg-pink/70 text-cocoa-deep transition-transform active:scale-95 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} strokeWidth={2.4} /> : <Menu size={20} strokeWidth={2.4} />}
        </button>

        <div
          ref={menuRef}
          id="mobile-menu"
          hidden={!open}
          className="absolute top-[calc(100%+0.5rem)] right-0 left-0 rounded-[28px] bg-paper/95 p-2 shadow-[var(--shadow-lift)] ring-1 ring-cocoa/5 backdrop-blur-md md:hidden"
        >
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l.section) ? (onHome ? "true" : "page") : undefined}
                  className={`flex min-h-12 items-center justify-between rounded-2xl px-4 font-bold ${
                    isActive(l.section) ? "bg-pink text-cocoa-deep" : "text-cocoa hover:bg-cream"
                  }`}
                >
                  {l.label}
                  {isActive(l.section) && <span aria-hidden className="text-blush-deep">♡</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
