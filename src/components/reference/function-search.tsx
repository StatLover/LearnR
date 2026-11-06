"use client";

import { fnSlug } from "@/lib/fn-slug";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookmarkCheck, Dices, LayoutGrid, Package, Search, X } from "lucide-react";
import { Hexy } from "@/components/brand/mascot";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";
import { candy, fnCategory, fnLabel, INK } from "./candy";
import { InlineMd } from "./inline-md";

export interface FnSummary {
  name: string;
  package: string;
  category: string;
  purpose: string;
  syntax: string;
  /** Card number in the library (1-based, stable). */
  no: number;
}

/** The function name in the syntax line is coloured like a function call; the rest is muted. */
function SyntaxPreview({ syntax }: { syntax: string }) {
  const i = syntax.indexOf("(");
  const head = i > 0 ? syntax.slice(0, i) : syntax;
  const rest = i > 0 ? syntax.slice(i) : "";
  return (
    <code className="block truncate rounded-xl border-2 border-border bg-code px-3 py-1.5 font-mono text-xs" title={syntax}>
      <span className="font-bold text-[var(--syn-function)]">{head}</span>
      <span className="text-muted-foreground">{rest}</span>
    </code>
  );
}

function FunctionCard({ f, bookmarked }: { f: FnSummary; bookmarked: boolean }) {
  const cat = fnCategory(f.category);
  const Icon = cat.icon;
  return (
    <Link
      href={`/reference/${fnSlug(f.name)}`}
      style={candy(cat.color)}
      className="group lift flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] hover:border-[var(--c)]"
    >
      <span className="relative block overflow-hidden bg-[var(--c-soft)] px-4 pb-3.5 pt-3.5">
        <span aria-hidden className="absolute -right-5 -top-6 size-20 rounded-full bg-[var(--c)] opacity-15" />
        <span className="relative flex items-center gap-2">
          <span aria-hidden className="hex-clip grid size-8 shrink-0 place-items-center bg-[var(--c)] text-[var(--c-fg)] [&_svg]:size-4">
            <Icon />
          </span>
          <span className={cn("truncate text-[11px] font-extrabold uppercase tracking-wider", INK)}>{f.category}</span>
          <span className="ml-auto font-display text-xs font-semibold text-muted-foreground">
            <span className="sr-only">Card </span>#{String(f.no).padStart(3, "0")}
          </span>
        </span>
        <code className="relative mt-2.5 block truncate font-mono text-xl font-bold text-foreground">{fnLabel(f.name)}</code>
      </span>
      <span className="flex flex-1 flex-col gap-3 p-4">
        <span className="line-clamp-3 text-sm font-semibold text-muted-foreground">
          <InlineMd>{f.purpose}</InlineMd>
        </span>
        <span className="mt-auto block">
          <SyntaxPreview syntax={f.syntax} />
        </span>
      </span>
      <span className="flex items-center gap-2 border-t-2 border-border px-4 py-2.5 text-xs font-bold">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-muted-foreground">
          <Package className="size-3.5" aria-hidden />
          {f.package}
        </span>
        {bookmarked && (
          <span className="inline-flex items-center gap-1 text-primary">
            <BookmarkCheck className="size-4" aria-hidden />
            <span className="sr-only">Bookmarked</span>
          </span>
        )}
        <span className={cn("ml-auto inline-flex items-center gap-1 font-display text-sm font-semibold", INK)}>
          Open
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </span>
    </Link>
  );
}

function CategoryChip({ label, count, color, icon: Icon, active, onClick }: { label: string; count: number; color: Parameters<typeof candy>[0]; icon: typeof LayoutGrid; active: boolean; onClick: () => void }) {
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

export function FunctionSearch({ functions, categories }: { functions: FnSummary[]; categories: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const state = useProgress();
  const bookmarked = useMemo(() => new Set(state.bookmarks.map((b) => b.id)), [state.bookmarks]);

  // "/" focuses the search box (unless you are typing somewhere else).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      input.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const t = q.trim().toLowerCase();
  const list = useMemo(() => {
    return functions
      .filter(
        (f) =>
          (!cat || f.category === cat) &&
          (!t || f.name.toLowerCase().includes(t) || f.purpose.toLowerCase().includes(t) || f.package.toLowerCase().includes(t) || f.category.toLowerCase().includes(t)),
      )
      .sort((a, b) => (t ? Number(!a.name.toLowerCase().startsWith(t)) - Number(!b.name.toLowerCase().startsWith(t)) : 0));
  }, [functions, t, cat]);
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of functions) m.set(f.category, (m.get(f.category) ?? 0) + 1);
    return m;
  }, [functions]);

  const grouped = !t && !cat;
  const isMarked = (f: FnSummary) => bookmarked.has(`fn:${f.package}:${f.name}`);
  const surprise = () => {
    const pool = list.length ? list : functions;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) router.push(`/reference/${fnSlug(pick.name)}`);
  };
  const grid = (items: FnSummary[]) => (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((f) => (
        <li key={`${f.package}-${f.name}`} className="min-w-0">
          <FunctionCard f={f} bookmarked={isMarked(f)} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="fn-search" className="sr-only">
            Search R functions
          </label>
          <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl bg-grape text-white">
            <Search className="size-5" />
          </span>
          <input
            ref={input}
            id="fn-search"
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search – try “mean”, “missing” or “plot”"
            className="h-16 w-full rounded-3xl border-2 border-border bg-card pl-15 pr-14 font-display text-lg font-medium shadow-[var(--shadow-card)] placeholder:font-sans placeholder:text-base placeholder:font-semibold placeholder:text-muted-foreground focus-visible:border-grape focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-grape/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {q ? (
            <button type="button" onClick={() => { setQ(""); input.current?.focus(); }} aria-label="Clear search" className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-xl text-muted-foreground hover:bg-surface-2 hover:text-foreground">
              <X className="size-5" />
            </button>
          ) : (
            <kbd aria-hidden className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-lg border-2 border-border bg-surface-2 px-2 py-0.5 font-mono text-xs font-bold text-muted-foreground sm:block">/</kbd>
          )}
        </div>
        <Button variant="grape" size="xl" onClick={surprise} className="h-12 rounded-2xl sm:h-16 sm:rounded-3xl">
          <Dices /> Surprise me
        </Button>
      </div>

      <div role="group" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 pt-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <CategoryChip label="All" count={functions.length} color="primary" icon={LayoutGrid} active={cat === null} onClick={() => setCat(null)} />
        {categories.map((c) => {
          const meta = fnCategory(c);
          return <CategoryChip key={c} label={c} count={counts.get(c) ?? 0} color={meta.color} icon={meta.icon} active={cat === c} onClick={() => setCat(c === cat ? null : c)} />;
        })}
      </div>

      <p className="font-display text-sm font-semibold text-muted-foreground" aria-live="polite">
        {list.length === functions.length ? `All ${list.length} function cards` : `${list.length} function card${list.length === 1 ? "" : "s"}`}
        {cat ? ` in ${cat}` : ""}
        {t ? ` matching “${q.trim()}”` : ""}
      </p>

      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-border bg-card px-6 py-12 text-center">
          <Hexy mood="think" size={96} />
          <h2 className="mt-3 font-display text-xl font-bold">No cards match “{q.trim()}”</h2>
          <p className="mt-1 max-w-md text-sm font-semibold text-muted-foreground">Try a shorter word, a different spelling, or search all categories. You can also describe what you want to do, like “round” or “count”.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setQ(""); setCat(null); }}>
            Show all functions
          </Button>
        </div>
      ) : grouped ? (
        <div className="space-y-10">
          {categories.map((c) => {
            const meta = fnCategory(c);
            const Icon = meta.icon;
            const items = list.filter((f) => f.category === c);
            if (!items.length) return null;
            const id = `cat-${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            return (
              <section key={c} aria-labelledby={id} style={candy(meta.color)}>
                <div className="mb-4 flex items-center gap-3">
                  <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--c)] text-[var(--c-fg)] shadow-[0_4px_0_var(--c-shadow)] [&_svg]:size-5">
                    <Icon />
                  </span>
                  <h2 id={id} className="font-display text-2xl font-bold tracking-tight">
                    {c}
                  </h2>
                  <span className={cn("rounded-full bg-[var(--c-soft)] px-2.5 py-0.5 text-xs font-extrabold", INK)}>{items.length} cards</span>
                  <span aria-hidden className="hidden h-0.5 flex-1 rounded-full bg-[var(--c-soft)] sm:block" />
                </div>
                {grid(items)}
              </section>
            );
          })}
        </div>
      ) : (
        grid(list)
      )}
    </div>
  );
}
