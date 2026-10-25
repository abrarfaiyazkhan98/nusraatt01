import { Reveal } from "./Reveal";

/** Handwritten section title with a little squiggle underneath. */
export function SectionHeading({
  id,
  title,
  intro,
  eyebrow,
  align = "center",
}: {
  id?: string;
  title: string;
  intro?: string;
  eyebrow?: string;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <Reveal className={`mb-12 flex flex-col gap-3 sm:mb-16 ${center ? "items-center text-center" : "items-start"}`}>
      {eyebrow && (
        <p className="rounded-full bg-paper px-3 py-1 text-xs font-extrabold tracking-[0.18em] text-cocoa-soft uppercase ring-1 ring-cocoa/10">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="font-hand text-[2.75rem] leading-[1.05] font-bold text-cocoa sm:text-6xl">
        {title}
      </h2>
      <Squiggle className={center ? "" : "-ml-1"} />
      {intro && <p className="max-w-md text-cocoa-soft">{intro}</p>}
    </Reveal>
  );
}

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden width="120" height="12" viewBox="0 0 120 12" fill="none" className={`text-blush ${className}`}>
      <path
        d="M2 7c8-6 14 4 22 0s14-6 22 0 14 4 22 0 14-6 22 0 14 4 22 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
