"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ComponentPropsWithoutRef } from "react";

type Props<T extends ElementType> = {
  as?: T;
  delay?: number;
} & ComponentPropsWithoutRef<T>;

/** Softly fades & rises its children into view the first time they scroll on screen. */
export function Reveal<T extends ElementType = "div">({ as, delay = 0, className = "", style, ...rest }: Props<T>) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <Tag ref={ref} className={`reveal ${className}`} style={{ ...style, "--delay": `${delay}ms` } as CSSProperties} {...rest} />;
}
