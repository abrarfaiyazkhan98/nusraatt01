import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-10 pb-10">
      <div className="container-soft">
        <div className="flex flex-col items-center gap-4 border-t border-dashed border-cocoa/15 pt-10 text-center">
          <p className="font-hand text-3xl text-cocoa">{site.hero.signature}</p>
          {site.socials.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-4">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="link-soft" target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="text-sm text-cocoa-soft">
            {site.name}&rsquo;s little corner of the internet ·{" "}
            <Link href="/#top" className="link-soft">
              back to top ↑
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
