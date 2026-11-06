"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import MiniSearch from "minisearch";
import { BookA, BookOpen, Compass, CornerDownLeft, Database, Dumbbell, FileText, FolderKanban, Loader2, Search, SquareFunction, type LucideIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Hexy } from "@/components/brand/mascot";
import { candy, INK, type Candy } from "@/components/reference/candy";
import { cn } from "@/lib/utils";

interface SearchDoc {
  id: string;
  type: string;
  title: string;
  text: string;
  href: string;
  meta?: string;
}

/** Colour, icon and label of each kind of search result. */
const TYPES: Record<string, { color: Candy; icon: LucideIcon }> = {
  Lesson: { color: "primary", icon: BookOpen },
  Exercise: { color: "mint", icon: Dumbbell },
  Project: { color: "sun", icon: FolderKanban },
  Function: { color: "grape", icon: SquareFunction },
  Glossary: { color: "pink", icon: BookA },
  "Cheat sheet": { color: "tangerine", icon: FileText },
  Dataset: { color: "teal", icon: Database },
  Page: { color: "sky", icon: Compass },
};
const typeMeta = (t: string) => TYPES[t] ?? { color: "primary" as Candy, icon: Compass };

const SUGGESTIONS = ["vector", "ggplot", "missing values", "t-test", "data frame", "for loop"];

let isOpen = false;
const listeners = new Set<() => void>();
export function openSearch() {
  isOpen = true;
  listeners.forEach((l) => l());
}
function closeSearch() {
  isOpen = false;
  listeners.forEach((l) => l());
}

let indexPromise: Promise<MiniSearch<SearchDoc>> | null = null;
function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch("/api/search-index")
      .then((r) => r.json() as Promise<SearchDoc[]>)
      .then((docs) => {
        const ms = new MiniSearch<SearchDoc>({
          fields: ["title", "text", "meta"],
          storeFields: ["type", "title", "text", "href", "meta"],
          searchOptions: { boost: { title: 4, meta: 1.5 }, prefix: true, fuzzy: 0.2 },
        });
        ms.addAll(docs);
        return ms;
      })
      .catch((e) => {
        indexPromise = null;
        throw e;
      });
  }
  return indexPromise;
}

/**
 * Pages such as the glossary highlight the #anchor they were opened with.
 * Client-side navigation does not fire "hashchange", so announce it once the
 * address has changed.
 */
function announceHash(href: string) {
  const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
  if (!hash) return;
  const start = performance.now();
  const tick = () => {
    if (window.location.hash === hash) window.dispatchEvent(new HashChangeEvent("hashchange"));
    else if (performance.now() - start < 2000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-grid min-w-6 place-items-center rounded-md border-2 border-border bg-surface px-1 font-mono text-[11px] font-bold text-foreground">{children}</kbd>;
}

export function SearchDialog() {
  const open = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => isOpen,
    () => false,
  );
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<MiniSearch<SearchDoc> | null>(null);
  const [failed, setFailed] = useState(false);
  const [sel, setSel] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open && !index) loadIndex().then(setIndex).catch(() => setFailed(true));
  }, [open, index]);

  const results = useMemo(() => {
    if (!index || !q.trim()) return [];
    return index.search(q).slice(0, 30) as unknown as (SearchDoc & { score: number })[];
  }, [index, q]);

  // Keep the highlighted result in view while moving with the arrow keys.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const go = (href: string) => {
    closeSearch();
    setQ("");
    router.push(href);
    announceHash(href);
  };
  const pick = (text: string) => {
    setQ(text);
    setSel(0);
    inputRef.current?.focus();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? openSearch() : closeSearch())}>
      <DialogContent title="Search R Academy" hideTitle className="max-w-2xl overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b-2 border-border bg-primary-soft/50 py-3 pl-4 pr-14">
          <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-[0_3px_0_var(--primary-shadow)]">
            <Search className="size-5" />
          </span>
          <input
            ref={inputRef}
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(results.length - 1, s + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(0, s - 1));
              } else if (e.key === "Home" && results.length) {
                e.preventDefault();
                setSel(0);
              } else if (e.key === "End" && results.length) {
                e.preventDefault();
                setSel(results.length - 1);
              } else if (e.key === "Enter" && results[sel]) go(results[sel].href);
            }}
            placeholder="Search lessons, functions, exercises, glossary…"
            className="h-11 min-w-0 flex-1 bg-transparent font-display text-lg font-medium outline-none placeholder:font-sans placeholder:text-base placeholder:font-semibold placeholder:text-muted-foreground"
            aria-label="Search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[sel] ? `sr-${results[sel].id}` : undefined}
          />
          {!index && !failed && <Loader2 className="size-5 shrink-0 animate-spin text-muted-foreground" aria-label="Loading the search index" />}
        </div>

        <div className="max-h-[60vh] min-h-0 flex-1 overflow-y-auto p-2 scrollbar-thin">
          <p className="sr-only" aria-live="polite">
            {q.trim() && index ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}
          </p>
          {failed && <p className="m-2 rounded-2xl bg-coral-soft p-4 text-sm font-semibold text-danger">The search index could not be loaded. Check your connection and try again.</p>}

          {!q.trim() && (
            <div className="flex flex-col items-center px-4 py-8 text-center">
              <Hexy mood="think" size={72} />
              <p className="mt-3 font-display text-lg font-semibold">What would you like to find?</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">Lessons, exercises, projects, functions, glossary terms, cheat sheets and datasets.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => pick(s)}
                    style={candy((["grape", "pink", "mint", "sky", "tangerine", "teal"] as Candy[])[i % 6])}
                    className="cursor-pointer rounded-full border-2 border-transparent bg-[var(--c-soft)] px-3 py-1 font-display text-sm font-semibold hover:border-[var(--c)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q.trim() && index && results.length === 0 && (
            <div className="flex flex-col items-center px-4 py-8 text-center">
              <Hexy mood="oops" size={64} />
              <p className="mt-3 font-semibold">No results for “{q}”.</p>
              <p className="text-sm font-semibold text-muted-foreground">Try a different word, or ask the AI tutor.</p>
            </div>
          )}

          <ul ref={listRef} id="search-results" role="listbox" aria-label="Search results" className="space-y-1">
            {results.map((r, i) => {
              const t = typeMeta(r.type);
              const on = i === sel;
              return (
                <li
                  key={r.id}
                  id={`sr-${r.id}`}
                  data-index={i}
                  role="option"
                  aria-selected={on}
                  onClick={() => go(r.href)}
                  onMouseMove={() => sel !== i && setSel(i)}
                  style={candy(t.color)}
                  className={cn("flex cursor-pointer items-start gap-3 rounded-2xl border-2 px-3 py-2.5", on ? "border-[var(--c)] bg-[var(--c-soft)]" : "border-transparent")}
                >
                  <span aria-hidden className={cn("mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl [&_svg]:size-[18px]", on ? "bg-[var(--c)] text-[var(--c-fg)]" : cn("bg-[var(--c-soft)]", INK))}>
                    <t.icon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-display text-[15px] font-semibold">{r.title}</span>
                      <span className={cn("shrink-0 rounded-full px-2 py-px text-[11px] font-extrabold", on ? "bg-card" : "bg-[var(--c-soft)]", INK)}>{r.type}</span>
                    </span>
                    <span className="block truncate text-xs font-semibold text-muted-foreground">
                      {r.meta ? `${r.meta} · ` : ""}
                      {r.text.slice(0, 120)}
                    </span>
                  </span>
                  {on && <CornerDownLeft className={cn("mt-2 size-4 shrink-0", INK)} aria-hidden />}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden items-center gap-4 border-t-2 border-border bg-surface-2/60 px-4 py-2.5 text-xs font-bold text-muted-foreground sm:flex" aria-hidden>
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> to move
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd> to open
          </span>
          <span className="flex items-center gap-1">
            <Kbd>esc</Kbd> to close
          </span>
          <span className="ml-auto flex items-center gap-1">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd> anywhere
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
