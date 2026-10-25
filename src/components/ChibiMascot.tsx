"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Lightweight illustrated mascot, drawn in SVG so eyes can actually blink and
 * follow the pointer. No sprite-sheet downloads, GIFs or external API keys.
 * Replace the illustration later with a custom character sheet if desired.
 */
export function ChibiMascot({ name, messages }: { name: string; messages: readonly string[] }) {
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [reaction, setReaction] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [hearts, setHearts] = useState(0);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const index = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let active = true;
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeout = setTimeout(() => {
        if (!active) return;
        setBlink(true);
        setTimeout(() => { if (active) setBlink(false); }, 170);
        schedule();
      }, 2700 + Math.random() * 2600);
    };
    schedule();
    return () => { active = false; clearTimeout(timeout); };
  }, [reduced]);

  useEffect(() => {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let lastX = 0, lastY = 0;
    const onMove = (event: PointerEvent) => {
      lastX = Math.max(-1, Math.min(1, (event.clientX - innerWidth / 2) / (innerWidth * .36)));
      lastY = Math.max(-1, Math.min(1, (event.clientY - innerHeight / 2) / (innerHeight * .36)));
      if (!frame) frame = requestAnimationFrame(() => {
        setLook({ x: lastX, y: lastY });
        frame = 0;
      });
    };
    const reset = () => setLook({ x: 0, y: 0 });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (reactionTimer.current) clearTimeout(reactionTimer.current);
  }, []);

  const poke = useCallback(() => {
    const msg = messages[index.current % messages.length] || "hi there! ♡";
    index.current++;
    setBubble(msg);
    setReaction(true);
    setBlink(false);
    if (!reduced) setHearts(v => v + 1);
    if (timer.current) clearTimeout(timer.current);
    if (reactionTimer.current) clearTimeout(reactionTimer.current);
    reactionTimer.current = setTimeout(() => setReaction(false), 650);
    timer.current = setTimeout(() => setBubble(null), 3000);
  }, [messages, reduced]);

  const eye = (cx: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy="162" rx="21" ry={blink || reaction ? 2.3 : 25} fill={blink || reaction ? "#69463F" : "#fffaf7"} />
      {blink || reaction ? (
        <path d={`M ${cx - 19} 162 Q ${cx} 174 ${cx + 19} 162`} stroke="#69463F" strokeWidth="4" fill="none" strokeLinecap="round" />
      ) : (
        <g style={{ transform: `translate(${look.x * 5}px, ${look.y * 5}px)`, transition: "transform 130ms ease-out" }}>
          <ellipse cx={cx} cy="164" rx="14" ry="20" fill="#60453F" />
          <ellipse cx={cx + 2} cy="162" rx="9" ry="14" fill="#2e2426" />
          <circle cx={cx - 4} cy="155" r="5.5" fill="#fff" />
          <circle cx={cx + 7} cy="172" r="2.2" fill="#fff" opacity=".7" />
        </g>
      )}
      <path d={`M ${cx - 20} 142 Q ${cx} 131 ${cx + 19} 143`} fill="none" stroke="#65443f" strokeWidth="3" strokeLinecap="round" />
    </g>
  );

  return (
    <div className="relative mx-auto w-[min(72vw,310px)] sm:w-[340px]">
      <div className="pointer-events-none absolute inset-8 rounded-full bg-pink/70 blur-3xl" aria-hidden />
      <button
        type="button"
        onClick={poke}
        aria-label={`Say hello to ${name}, the animated mascot`}
        className="group relative block w-full cursor-pointer rounded-[40%] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-rose"
      >
        <svg viewBox="0 0 300 315" className={reduced ? "w-full" : "w-full animate-float"} role="img" aria-label={`Cute illustrated mascot of ${name}, with animated eyes`}>
          <defs>
            <linearGradient id="nusraat-hair" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#98705D" />
              <stop offset="1" stopColor="#654638" />
            </linearGradient>
            <linearGradient id="nusraat-pink" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#FCE1EA" />
              <stop offset="1" stopColor="#ECAFC2" />
            </linearGradient>
          </defs>
          <ellipse cx="150" cy="300" rx="87" ry="10" fill="#DBB6B6" opacity=".24" />
          <path d="M80 259 Q35 214 65 130 Q78 60 148 58 Q224 59 238 134 Q261 217 219 265Z" fill="url(#nusraat-hair)" stroke="#69493D" strokeWidth="3" />
          <ellipse cx="151" cy="56" rx="49" ry="39" fill="url(#nusraat-hair)" stroke="#69493D" strokeWidth="3" />
          <path d="M112 47 Q150 33 189 49" stroke="#F3B5C8" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M77 284 Q77 230 118 218 L183 218 Q224 233 225 284 Q149 311 77 284Z" fill="url(#nusraat-pink)" stroke="#D58DA6" strokeWidth="3" />
          <path d="M127 213 L129 238 Q150 253 173 238 L173 213" fill="#F9D7C6" stroke="#B98577" strokeWidth="2" />
          <g style={{ transform: `translate(${look.x * 4}px, ${look.y * 3}px) rotate(${look.x * 2}deg)`, transformOrigin: "150px 155px", transition: "transform 170ms ease-out" }}>
            <ellipse cx="150" cy="155" rx="82" ry="91" fill="#F9D8C8" stroke="#9C7366" strokeWidth="2.5" />
            <ellipse cx="75" cy="171" rx="12" ry="19" fill="#F8D5C4" stroke="#9C7366" strokeWidth="2" />
            <ellipse cx="225" cy="171" rx="12" ry="19" fill="#F8D5C4" stroke="#9C7366" strokeWidth="2" />
            <path d="M69 130 Q69 61 148 65 Q229 63 232 136 Q209 128 191 96 Q160 129 109 117 Q89 142 69 130Z" fill="url(#nusraat-hair)" stroke="#69493D" strokeWidth="2.5" />
            <path d="M90 104 Q124 66 167 81 M151 79 Q193 88 210 117" stroke="#B88A72" strokeWidth="3" fill="none" opacity=".65" />
            <ellipse cx="98" cy="194" rx="20" ry="10" fill="#EF9FAA" opacity=".55" />
            <ellipse cx="203" cy="194" rx="20" ry="10" fill="#EF9FAA" opacity=".55" />
            {eye(113)}{eye(187)}
            <path d="M148 188 Q150 191 152 188" stroke="#C68B7C" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d={reaction ? "M139 210 Q150 224 161 210" : "M141 210 Q150 217 159 210"} stroke="#A76769" strokeWidth="2.7" fill="none" strokeLinecap="round" />
          </g>
          <path d="M91 255 Q64 252 76 276 Q89 293 118 270" fill="#F4C4D4" stroke="#D58DA6" strokeWidth="3" />
          <path d="M208 255 Q236 251 225 277 Q211 293 181 270" fill="#F4C4D4" stroke="#D58DA6" strokeWidth="3" />
          <path d="M104 265 Q118 258 132 269 M170 269 Q184 257 199 265" stroke="#D58DA6" strokeWidth="2" fill="none" />
          <text x="43" y="110" fontSize="23" fill="#EFAFC2">♡</text>
          <text x="248" y="118" fontSize="20" fill="#E9BD68">✦</text>
          <text x="246" y="242" fontSize="23" fill="#EFAFC2">♡</text>
        </svg>
        {hearts > 0 && !reduced && (
          <span key={hearts} aria-hidden className="heart-particle pointer-events-none absolute top-10 right-5 text-3xl text-rose">♥</span>
        )}
      </button>
      <div className={`pointer-events-none absolute -top-2 left-1/2 z-10 max-w-52 -translate-x-1/2 rounded-2xl bg-paper px-4 py-2 font-hand text-xl text-cocoa shadow-lg transition-all duration-300 sm:top-12 sm:left-[86%] sm:translate-x-0 ${bubble ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
        {bubble ?? "hi there! ♡"}
      </div>
      <p className="sr-only" aria-live="polite">{bubble ?? ""}</p>
    </div>
  );
}
