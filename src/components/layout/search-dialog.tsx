"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import MiniSearch from "minisearch";
import { Search, CornerDownLeft, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchDoc {
  id: string;
  type: string;
  title: string;
  text: string;
  href: string;
  meta?: string;
}

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

  useEffect(() => setSel(0), [q]);

  const go = (href: string) => {
    closeSearch();
    setQ("");
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? openSearch() : closeSearch())}>
      <DialogContent title="Search R Academy" hideTitle className="max-w-2xl p-0">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-5 text-muted-foreground" />
          <input
            ref={inputRef}
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(results.length - 1, s + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(0, s - 1));
              } else if (e.key === "Enter" && results[sel]) go(results[sel].href);
            }}
            placeholder="Search lessons, functions, exercises, glossary…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            aria-label="Search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[sel] ? `sr-${results[sel].id}` : undefined}
          />
          {!index && !failed && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
          {failed && <p className="p-4 text-sm text-danger">The search index could not be loaded. Check your connection and try again.</p>}
          {!q.trim() && (
            <div className="p-4 text-sm text-muted-foreground">
              Try <button className="text-accent underline" onClick={() => setQ("vector")}>vector</button>,{" "}
              <button className="text-accent underline" onClick={() => setQ("ggplot")}>ggplot</button>,{" "}
              <button className="text-accent underline" onClick={() => setQ("missing values")}>missing values</button> or{" "}
              <button className="text-accent underline" onClick={() => setQ("t-test")}>t-test</button>.
            </div>
          )}
          {q.trim() && index && results.length === 0 && <p className="p-4 text-sm text-muted-foreground">No results for “{q}”. Try a different word, or ask the AI tutor.</p>}
          <ul id="search-results" role="listbox" aria-label="Search results">
            {results.map((r, i) => (
              <li key={r.id} id={`sr-${r.id}`} role="option" aria-selected={i === sel}>
                <button
                  onClick={() => go(r.href)}
                  onMouseEnter={() => setSel(i)}
                  className={cn("flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left cursor-pointer", i === sel && "bg-surface-2")}
                >
                  <Badge variant={r.type === "Lesson" ? "primary" : r.type === "Function" ? "accent" : "default"} className="mt-0.5 w-20 justify-center">
                    {r.type}
                  </Badge>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{r.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{r.meta ? `${r.meta} · ` : ""}{r.text.slice(0, 120)}</span>
                  </span>
                  {i === sel && <CornerDownLeft className="mt-1 size-4 text-muted-foreground" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
