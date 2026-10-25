"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type Heart = { id: number; left: number; dx: number; rot: number; dur: number; size: number; color: string };

const HEART_COLORS = ["#EFAFC2", "#D9849D", "#F8DDE5", "#FFE08A"];
const MAX_TILT = { x: 7, y: 10 }; // degrees

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * The photo at the top of the homepage.
 * It never distorts the face — all the life comes from gentle 3D tilt, a pointer-following glow,
 * floating, little hearts, and a speech bubble.
 */
export function Portrait({ src, alt, messages, name }: { src: string; alt: string; messages: readonly string[]; name: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const squishRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  const [hearts, setHearts] = useState<Heart[]>([]);
  const [bubble, setBubble] = useState<string | null>(null);
  const lastMessage = useRef(-1);
  const bubbleTimer = useRef<number>(undefined);
  const heartId = useRef(0);

  /* ── speech bubble ─────────────────────────────────────────── */
  const say = useCallback((text: string, ms = 3200) => {
    setBubble(text);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), ms);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      lastMessage.current = 0;
      say(messages[0], 3800);
    }, 1100);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(bubbleTimer.current);
    };
  }, [messages, say]);

  /* ── hearts ────────────────────────────────────────────────── */
  const spawnHearts = useCallback((count: number) => {
    const next: Heart[] = Array.from({ length: count }, () => ({
      id: ++heartId.current,
      left: 15 + Math.random() * 70,
      dx: (Math.random() - 0.5) * 90,
      rot: (Math.random() - 0.5) * 50,
      dur: 1.8 + Math.random() * 1.4,
      size: 14 + Math.random() * 12,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    }));
    setHearts((h) => [...h.slice(-14), ...next]);
  }, []);

  // an occasional heart drifts up while the portrait is on screen
  useEffect(() => {
    if (reduced) return;
    let visible = true;
    let timer: number;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (rootRef.current) io.observe(rootRef.current);
    const loop = () => {
      if (visible && !document.hidden) spawnHearts(1);
      timer = window.setTimeout(loop, 2800 + Math.random() * 2600);
    };
    timer = window.setTimeout(loop, 2200);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [reduced, spawnHearts]);

  /* ── tilt + glow + parallax (spring-smoothed, mouse & pen only) ── */
  useEffect(() => {
    const root = rootRef.current;
    const tilt = tiltRef.current;
    if (!root || !tilt || reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const target = { x: 0, y: 0, gx: 50, gy: 40, glow: 0 };
    const cur = { ...target };
    let raf = 0;

    const step = () => {
      let moving = false;
      for (const k of Object.keys(target) as (keyof typeof target)[]) {
        const d = target[k] - cur[k];
        cur[k] += d * 0.09;
        if (Math.abs(d) > 0.01) moving = true;
      }
      tilt.style.setProperty("--rx", `${(-cur.y * MAX_TILT.x).toFixed(2)}deg`);
      tilt.style.setProperty("--ry", `${(cur.x * MAX_TILT.y).toFixed(2)}deg`);
      root.style.setProperty("--gx", `${cur.gx.toFixed(1)}%`);
      root.style.setProperty("--gy", `${cur.gy.toFixed(1)}%`);
      root.style.setProperty("--glow", cur.glow.toFixed(3));
      root.style.setProperty("--px", cur.x.toFixed(3));
      root.style.setProperty("--py", cur.y.toFixed(3));
      raf = moving ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = tilt.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      target.x = clamp((e.clientX - cx) / (window.innerWidth / 2));
      target.y = clamp((e.clientY - cy) / (window.innerHeight / 2));
      target.gx = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      target.gy = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      target.glow = Math.max(0.25, 1 - dist / (r.width * 1.6));
      kick();
    };
    const onLeave = () => {
      Object.assign(target, { x: 0, y: 0, gx: 50, gy: 40, glow: 0 });
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  /* ── poke! ─────────────────────────────────────────────────── */
  const poke = () => {
    let i = Math.floor(Math.random() * messages.length);
    if (messages.length > 1 && i === lastMessage.current) i = (i + 1) % messages.length;
    lastMessage.current = i;
    say(messages[i]);
    if (reduced) return;
    spawnHearts(6);
    squishRef.current?.animate(
      [
        { transform: "scale(1) rotate(0deg)" },
        { transform: "scale(0.94, 0.95) rotate(-2deg)" },
        { transform: "scale(1.04) rotate(1.5deg)" },
        { transform: "scale(1) rotate(0deg)" },
      ],
      { duration: 650, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    );
  };

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-[min(76vw,340px)] sm:w-[380px]"
      style={{ "--px": 0, "--py": 0, "--gx": "50%", "--gy": "40%", "--glow": 0 } as CSSProperties}
    >
      {/* soft colour blobs the photo sits on, so it feels part of the page */}
      <div
        aria-hidden
        className="blob absolute -inset-[7%] bg-butter/80"
        style={{ translate: "calc(var(--px) * -10px) calc(var(--py) * -8px)", rotate: "-8deg" }}
      />
      <div
        aria-hidden
        className="blob absolute -inset-[3%] bg-pink/70 [animation-delay:-5s]"
        style={{ translate: "calc(var(--px) * -5px) calc(var(--py) * -4px)", rotate: "14deg" }}
      />

      {/* floating stickers (parallax) */}
      <Sticker className="-top-1 -left-3 size-12 text-xl text-blush-deep sm:-left-6" depth={18} delay="0s">
        ♡
      </Sticker>
      <Sticker className="top-[14%] -right-4 size-10 text-lg sm:-right-8" depth={24} delay="-2s" tone="bg-butter">
        ✿
      </Sticker>
      <Sticker className="-right-1 bottom-[6%] size-11 text-base sm:-right-3" depth={14} delay="-3.5s" tone="bg-lavender">
        ✦
      </Sticker>

      {/* floating + tilting photo */}
      <div className={reduced ? "" : "animate-float"}>
        <div
          ref={tiltRef}
          className="[perspective:900px]"
          style={{ transform: "perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))" }}
        >
          <button
            type="button"
            onClick={poke}
            className="group relative block aspect-square w-full cursor-pointer rounded-full focus-visible:outline-offset-8"
          >
            <span ref={squishRef} className="block size-full">
              <span className="blob relative block size-full overflow-hidden bg-pink shadow-[var(--shadow-lift)] ring-[6px] ring-paper sm:ring-8">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  preload
                  sizes="(min-width: 640px) 380px, 76vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
                />
                {/* warm light that follows the pointer */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                  style={{
                    opacity: "var(--glow)",
                    background: "radial-gradient(circle at var(--gx) var(--gy), rgb(255 240 184 / 0.9), transparent 55%)",
                  }}
                />
              </span>
            </span>
            <span className="sr-only">Say hi to {name}</span>
          </button>
        </div>
      </div>

      {/* hearts */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[10%] h-0">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="heart-particle absolute"
            style={
              {
                left: `${h.left}%`,
                fontSize: h.size,
                color: h.color,
                "--dx": `${h.dx}px`,
                "--rot": `${h.rot}deg`,
                "--dur": `${h.dur}s`,
              } as CSSProperties
            }
            onAnimationEnd={() => setHearts((all) => all.filter((x) => x.id !== h.id))}
          >
            ♥
          </span>
        ))}
      </div>

      {/* speech bubble */}
      <div
        className={`pointer-events-none absolute -top-6 left-1/2 z-10 w-max max-w-[15rem] origin-bottom transition-all duration-500 ease-[var(--ease-bounce)] sm:top-[2%] sm:left-[78%] sm:origin-bottom-left ${
          bubble ? "-translate-x-1/2 scale-100 opacity-100 sm:translate-x-0" : "-translate-x-1/2 translate-y-2 scale-75 opacity-0 sm:translate-x-0"
        }`}
      >
        <p className="relative rounded-[22px] bg-paper px-4 py-2.5 font-hand text-[1.45rem] leading-tight font-bold text-cocoa shadow-[var(--shadow-lift)] ring-1 ring-cocoa/5">
          {bubble ?? " "}
          <span
            aria-hidden
            className="absolute -bottom-1.5 left-1/2 size-3.5 -translate-x-1/2 rotate-45 rounded-[3px] bg-paper sm:left-5 sm:translate-x-0"
          />
        </p>
      </div>
      {/* announce what she says without moving focus */}
      <p className="sr-only" aria-live="polite">
        {bubble ?? ""}
      </p>
    </div>
  );
}

function Sticker({
  children,
  className,
  depth,
  delay,
  tone = "bg-paper",
}: {
  children: React.ReactNode;
  className: string;
  depth: number;
  delay: string;
  tone?: string;
}) {
  return (
    <span
      aria-hidden
      className={`absolute z-10 ${className}`}
      style={{ translate: `calc(var(--px) * ${depth}px) calc(var(--py) * ${depth}px)` }}
    >
      <span
        className={`sticker size-full animate-sway ${tone}`}
        style={{ animationDelay: delay, "--r": "-8deg" } as CSSProperties}
      >
        {children}
      </span>
    </span>
  );
}
