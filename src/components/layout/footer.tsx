"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hexy } from "@/components/brand/mascot";
import { isFocusRoute } from "./header";

const COLS = [
  { title: "Learn", links: [["/learn", "Learning map"], ["/exercises", "Practice & daily challenge"], ["/projects", "Projects"], ["/dashboard", "My dashboard"]] },
  { title: "Tools", links: [["/playground", "R Playground"], ["/error-checker", "Error Detective"], ["/tutor", "AI Tutor"], ["/visualize", "R Labs"]] },
  { title: "Reference", links: [["/reference", "Functions"], ["/cheatsheets", "Cheat sheets"], ["/glossary", "Glossary"], ["/datasets", "Datasets"]] },
];

export function Footer() {
  const pathname = usePathname();
  if (isFocusRoute(pathname)) return null;
  return (
    <footer className="relative mt-16 overflow-hidden border-t-2 border-border bg-surface pb-24 lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold">
            <Hexy size={44} mood="wave" /> <span><span className="text-primary">R</span> Academy</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">Learn R by playing with it: bite-sized lessons, real R in your browser, challenges, XP and a friendly AI tutor.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-primary">{c.title}</p>
            <ul className="mt-3 space-y-2 text-sm font-semibold">
              {c.links.map(([href, label]) => (
                <li key={href}>
                  <Link className="text-muted-foreground hover:text-foreground" href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-border">
        <p className="mx-auto max-w-7xl px-5 py-4 text-xs font-semibold text-muted-foreground">
          R runs entirely in your browser with webR (R compiled to WebAssembly) – your code is never sent to our server. Sample datasets are synthetic and for learning only.
        </p>
      </div>
    </footer>
  );
}
