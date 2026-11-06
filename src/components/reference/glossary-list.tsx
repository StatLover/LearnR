"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { BookA, Code2, Hexagon, Link2, Search, Sigma, Table2, X, type LucideIcon } from "lucide-react";
import type { GlossaryTerm } from "@/content/types";
import { Markdown } from "@/components/content/markdown";
import { StaticCode } from "@/components/code/static-code";
import { Hexy } from "@/components/brand/mascot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { candy, INK, type Candy } from "./candy";

const CATS: Record<GlossaryTerm["category"], { label: string; color: Candy; icon: LucideIcon }> = {
  programming: { label: "Programming", color: "sky", icon: Code2 },
  r: { label: "R language", color: "grape", icon: Hexagon },
  data: { label: "Data", color: "tangerine", icon: Table2 },
  statistics: { label: "Statistics", color: "mint", icon: Sigma },
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const letterOf = (g: GlossaryTerm) => g.term[0].toUpperCase();

function Pill({ label, count, color, icon: Icon, active, onClick }: { label: string; count: number; color: Candy; icon: LucideIcon; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={candy(color)}
      className={cn(
        "press inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 font-display text-sm font-semibold [&_svg]:size-4",
        active
          ? "border-[var(--c)] bg-[var(--c)] text-[var(--c-fg)] [--press-shadow:var(--c-shadow)]"
          : "border-transparent bg-[var(--c-soft)] text-foreground [--press-shadow:color-mix(in_srgb,var(--c)_35%,transparent)] hover:border-[var(--c)]",
      )}
    >
      <Icon className={cn(!active && INK)} aria-hidden />
      {label}
      <span className={cn("rounded-full px-1.5 text-xs font-bold", active ? "bg-white/25" : "bg-card/70 text-muted-foreground")}>{count}</span>
    </button>
  );
}

export function GlossaryList({ terms }: { terms: GlossaryTerm[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<GlossaryTerm["category"] | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const t = q.trim().toLowerCase();
  const list = useMemo(
    () => terms.filter((g) => (!cat || g.category === cat) && (!t || g.term.toLowerCase().includes(t) || g.definition.toLowerCase().includes(t))),
    [terms, t, cat],
  );
  const letters = useMemo(() => new Set(list.map(letterOf)), [list]);
  const termBySlug = useMemo(() => new Map(terms.map((g) => [g.slug, g])), [terms]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const g of terms) c[g.category] = (c[g.category] ?? 0) + 1;
    return c;
  }, [terms]);

  // Highlight the term named in the address (#slug) – on load, on hash links,
  // and when the site search jumps here (it fires a hashchange event).
  useEffect(() => {
    const read = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      setHighlight(termBySlug.has(slug) ? slug : null);
    };
    const frame = requestAnimationFrame(read);
    window.addEventListener("hashchange", read);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", read);
    };
  }, [termBySlug]);

  /** Jump to a related term, clearing filters first if they hide it. */
  const jump = (e: MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (list.some((g) => g.slug === slug)) return; // normal hash link
    e.preventDefault();
    setQ("");
    setCat(null);
    window.setTimeout(() => {
      window.location.hash = slug;
      document.getElementById(slug)?.scrollIntoView({ block: "start" });
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <label htmlFor="gl-search" className="sr-only">
          Search the glossary
        </label>
        <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl bg-pink text-white">
          <Search className="size-5" />
        </span>
        <input
          ref={input}
          id="gl-search"
          type="search"
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Look up a word, e.g. “vector” or “p-value”"
          className="h-16 w-full rounded-3xl border-2 border-border bg-card pl-15 pr-14 font-display text-lg font-medium shadow-[var(--shadow-card)] placeholder:font-sans placeholder:text-base placeholder:font-semibold placeholder:text-muted-foreground focus-visible:border-pink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink/20 [&::-webkit-search-cancel-button]:hidden"
        />
        {q && (
          <button type="button" onClick={() => { setQ(""); input.current?.focus(); }} aria-label="Clear search" className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-xl text-muted-foreground hover:bg-surface-2 hover:text-foreground">
            <X className="size-5" />
          </button>
        )}
      </div>

      <div role="group" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 pt-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <Pill label="All" count={terms.length} color="pink" icon={BookA} active={cat === null} onClick={() => setCat(null)} />
        {(Object.keys(CATS) as GlossaryTerm["category"][]).map((k) => (
          <Pill key={k} label={CATS[k].label} count={counts[k] ?? 0} color={CATS[k].color} icon={CATS[k].icon} active={cat === k} onClick={() => setCat(cat === k ? null : k)} />
        ))}
      </div>

      <nav aria-label="Jump to letter" className="sticky top-[var(--header-h)] z-20 -mx-5 border-y-2 border-border bg-background/85 px-5 py-2 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sm:mx-0 sm:rounded-2xl sm:border-2 sm:px-2">
        <ul className="relative flex gap-1 overflow-x-auto no-scrollbar lg:justify-between">
          {ALPHABET.map((l) => (
            <li key={l} className="shrink-0">
              {letters.has(l) ? (
                <a href={`#letter-${l}`} className="grid size-8 place-items-center rounded-lg font-display text-sm font-bold text-foreground transition-colors hover:bg-pink hover:text-white">
                  {l}
                </a>
              ) : (
                <span aria-disabled="true" className="grid size-8 place-items-center rounded-lg font-display text-sm font-bold text-muted-foreground/40">
                  <span className="sr-only">No terms for </span>
                  {l}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <p className="font-display text-sm font-semibold text-muted-foreground" aria-live="polite">
        {list.length === terms.length ? `All ${terms.length} terms` : `${list.length} term${list.length === 1 ? "" : "s"}`}
        {cat ? ` in ${CATS[cat].label}` : ""}
        {t ? ` matching “${q.trim()}”` : ""}
      </p>

      {ALPHABET.filter((l) => letters.has(l)).map((l, li) => (
        <section key={l} aria-labelledby={`letter-${l}`}>
          <h2 id={`letter-${l}`} className="mb-4 flex scroll-mt-36 items-center gap-3">
            <span className="hex-clip grid size-12 place-items-center bg-[var(--c)] font-display text-2xl font-bold text-[var(--c-fg)]" style={candy((["pink", "grape", "sky", "mint", "tangerine", "teal", "coral", "primary"] as Candy[])[li % 8])}>
              {l}
            </span>
            <span aria-hidden className="h-0.5 flex-1 rounded-full bg-border" />
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {list
              .filter((g) => letterOf(g) === l)
              .map((g) => {
                const c = CATS[g.category];
                const on = highlight === g.slug;
                return (
                  <article
                    key={g.slug}
                    id={g.slug}
                    aria-labelledby={`${g.slug}-term`}
                    style={candy(c.color)}
                    className={cn(
                      "relative min-w-0 scroll-mt-40 overflow-hidden rounded-3xl border-2 border-border bg-card p-5 pt-6 shadow-[var(--shadow-card)] transition-shadow target:border-[var(--c)] target:ring-4 target:ring-[var(--c)]/25",
                      on && "border-[var(--c)] ring-4 ring-[var(--c)]/25",
                    )}
                  >
                    <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-[var(--c)]" />
                    <div className="flex flex-wrap items-start gap-2">
                      <h3 id={`${g.slug}-term`} className="min-w-0 flex-1 font-display text-xl font-bold tracking-tight">
                        {g.term}
                      </h3>
                      <span className={cn("inline-flex items-center gap-1 rounded-full bg-[var(--c-soft)] px-2.5 py-0.5 text-xs font-extrabold", INK)}>
                        <c.icon className="size-3.5" aria-hidden />
                        {c.label}
                      </span>
                    </div>
                    <div className="mt-2 text-[15px]">
                      <Markdown runnableCode={false}>{g.definition}</Markdown>
                    </div>
                    {g.example && (
                      <div className="mt-3">
                        <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Example</p>
                        <StaticCode code={g.example} className="rounded-2xl border-2 border-border py-2.5" />
                      </div>
                    )}
                    {g.related?.length ? (
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        <span className="mr-1 inline-flex items-center gap-1 text-xs font-extrabold text-muted-foreground">
                          <Link2 className="size-3.5" aria-hidden /> See also
                        </span>
                        {g.related.map((r) => {
                          const target = termBySlug.get(r);
                          return (
                            <a
                              key={r}
                              href={`#${r}`}
                              onClick={(e) => jump(e, r)}
                              style={candy(CATS[target?.category ?? "programming"].color)}
                              className="rounded-full border-2 border-transparent bg-[var(--c-soft)] px-2.5 py-0.5 text-sm font-bold hover:border-[var(--c)]"
                            >
                              {target?.term ?? r}
                            </a>
                          );
                        })}
                      </div>
                    ) : null}
                  </article>
                );
              })}
          </div>
        </section>
      ))}

      {!list.length && (
        <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-border bg-card px-6 py-12 text-center">
          <Hexy mood="think" size={96} />
          <h2 className="mt-3 font-display text-xl font-bold">No terms match “{q.trim()}”</h2>
          <p className="mt-1 max-w-md text-sm font-semibold text-muted-foreground">Try a shorter word or another spelling – or ask the AI tutor to explain it.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setQ(""); setCat(null); }}>
            Show all terms
          </Button>
        </div>
      )}
    </div>
  );
}
