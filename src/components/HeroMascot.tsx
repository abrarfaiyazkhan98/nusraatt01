"use client";

import { Mascot } from "page-mascot";
import { preload } from "react-dom";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type Heart = { id: number; left: number; dx: number; rot: number; dur: number; size: number; color: string };
type Idle = "blink" | "surprised" | "wink" | "bashful" | "sleepy";

const DIRECTIONS = "/mascots/nusraat-directions.webp";
const REACTIONS = "/mascots/nusraat-reactions.webp";
const HEART_COLORS = ["#FFE08A", "#F6C945", "#FFD36E", "#F3B63F"];
// cells of the reactions sheet, in page-mascot's order
const CELL: Record<Idle, number> = { blink: 0, surprised: 3, wink: 4, bashful: 5, sleepy: 6 };
const MOODS: Idle[] = ["surprised", "wink", "bashful"];
const SLEEP_AFTER = 25_000; // ms without any pointer, scroll or key activity

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
 * Little chibi Nusraat at the top of the homepage.
 * page-mascot does the head-turning and the boop reactions; everything here sits around it —
 * floating, a soft shadow, hearts, a speech bubble, and the odd idle blink or mood, which is
 * drawn as an overlay so the library's own state is never touched.
 */
export function HeroMascot({ messages, name }: { messages: readonly string[]; name: string }) {
  preload(DIRECTIONS, { as: "image" });
  preload(REACTIONS, { as: "image" });

  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const [hearts, setHearts] = useState<Heart[]>([]);
  const [bubble, setBubble] = useState<string | null>(null);
  const [idle, setIdle] = useState<Idle | null>(null);
  const lastMessage = useRef(-1);
  const bubbleTimer = useRef<number>(undefined);
  const heartId = useRef(0);
  const quietUntil = useRef(0); // no idle moods while a boop is playing
  const lastActive = useRef(0);

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
      left: 20 + Math.random() * 60,
      dx: (Math.random() - 0.5) * 90,
      rot: (Math.random() - 0.5) * 50,
      dur: 1.8 + Math.random() * 1.4,
      size: 13 + Math.random() * 11,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    }));
    setHearts((h) => [...h.slice(-14), ...next]);
  }, []);

  /* ── idle life: blinks, the odd mood, and a nap when nobody's around ── */
  useEffect(() => {
    let visible = true;
    let timer: number;
    let clear: number;
    lastActive.current = Date.now();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (rootRef.current) io.observe(rootRef.current);

    const show = (mood: Idle, ms: number) => {
      setIdle(mood);
      window.clearTimeout(clear);
      clear = window.setTimeout(() => setIdle(null), ms);
    };
    const wake = () => {
      lastActive.current = Date.now();
      setIdle((m) => (m === "sleepy" ? null : m));
    };
    let moods = 0;
    const loop = () => {
      timer = window.setTimeout(loop, 3200 + Math.random() * 3000);
      if (!visible || document.hidden || Date.now() < quietUntil.current) return;
      if (Date.now() - lastActive.current > SLEEP_AFTER) {
        window.clearTimeout(clear);
        setIdle("sleepy");
        return;
      }
      if (++moods % 4 === 0) show(MOODS[Math.floor(Math.random() * MOODS.length)], 1400);
      else show("blink", 160);
    };
    timer = window.setTimeout(loop, 2600);

    const events = ["pointermove", "pointerdown", "keydown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(clear);
      io.disconnect();
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, []);

  // an occasional heart drifts up while she's on screen
  useEffect(() => {
    if (reduced) return;
    let visible = true;
    let timer: number;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (rootRef.current) io.observe(rootRef.current);
    const loop = () => {
      if (visible && !document.hidden) spawnHearts(1);
      timer = window.setTimeout(loop, 3400 + Math.random() * 3000);
    };
    timer = window.setTimeout(loop, 2400);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [reduced, spawnHearts]);

  /* ── boop! (the library plays the reaction; this adds the extras) ── */
  const clearIdle = () => {
    quietUntil.current = Date.now() + 1600;
    lastActive.current = Date.now();
    setIdle(null);
  };
  const boop = () => {
    clearIdle();
    let i = Math.floor(Math.random() * messages.length);
    if (messages.length > 1 && i === lastMessage.current) i = (i + 1) % messages.length;
    lastMessage.current = i;
    say(messages[i]);
    if (!reduced) spawnHearts(6);
  };

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex flex-col items-center [-webkit-tap-highlight-color:transparent] [touch-action:manipulation]"
    >
      <div className={reduced ? "" : "animate-float"}>
        <div
          className="relative size-[184px] sm:size-[220px]"
          data-mascot-idle={idle ?? undefined}
          onPointerDownCapture={clearIdle}
          onClickCapture={boop}
        >
          <Mascot
            directions={DIRECTIONS}
            reactions={REACTIONS}
            size={220}
            label={`little ${name} mascot`}
            className="size-full! rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush-deep"
          />
          {/* idle blink / mood, same sheet and same cell maths as the library */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: `url(${REACTIONS})`,
              backgroundSize: "300% 300%",
              backgroundPosition: `${((idle ? CELL[idle] : 0) % 3) * 50}% ${Math.floor((idle ? CELL[idle] : 0) / 3) * 50}%`,
              opacity: idle ? 1 : 0,
            }}
          />
        </div>
      </div>

      {/* soft shadow under her, breathing with the float */}
      <span
        aria-hidden
        className={`mascot-shadow -mt-3 h-4 w-32 rounded-[50%] sm:w-40 ${reduced ? "" : "animate-float-shadow"}`}
      />

      {/* hearts */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[12%] h-0">
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
        className={`pointer-events-none absolute -top-10 left-1/2 z-10 w-max max-w-[15rem] origin-bottom transition-all duration-500 ease-[var(--ease-bounce)] sm:top-[4%] sm:left-[86%] sm:origin-bottom-left ${
          bubble ? "-translate-x-1/2 scale-100 opacity-100 sm:translate-x-0" : "-translate-x-1/2 translate-y-2 scale-75 opacity-0 sm:translate-x-0"
        }`}
      >
        <p className="relative rounded-[22px] bg-paper px-4 py-2.5 font-hand text-[1.45rem] leading-tight font-bold text-cocoa shadow-[var(--shadow-lift)] ring-1 ring-cocoa/5">
          {bubble ?? " "}
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
