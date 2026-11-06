"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { GlossaryTerm } from "@/content/types";
import { Input } from "@/components/ui/input";
import { Markdown } from "@/components/content/markdown";
import { StaticCode } from "@/components/code/static-code";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATS = { programming: "Programming", r: "R language", data: "Data", statistics: "Statistics" } as const;

export function GlossaryList({ terms }: { terms: GlossaryTerm[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return terms.filter((g) => (!cat || g.category === cat) && (!t || g.term.toLowerCase().includes(t) || g.definition.toLowerCase().includes(t)));
  }, [terms, q, cat]);
  const letters = [...new Set(list.map((g) => g.term[0].toUpperCase()))];
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <label htmlFor="gl-search" className="sr-only">Search the glossary</label>
        <Input id="gl-search" className="h-10 pl-9 text-base" placeholder="Search terms…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
        <button onClick={() => setCat(null)} aria-pressed={cat === null} className={cn("rounded-full border px-3 py-1 text-xs cursor-pointer", cat === null ? "border-primary bg-primary-soft font-semibold" : "border-border")}>All</button>
        {Object.entries(CATS).map(([k, v]) => (
          <button key={k} onClick={() => setCat(cat === k ? null : k)} aria-pressed={cat === k} className={cn("rounded-full border px-3 py-1 text-xs cursor-pointer", cat === k ? "border-primary bg-primary-soft font-semibold" : "border-border")}>{v}</button>
        ))}
      </div>
      <nav aria-label="Jump to letter" className="flex flex-wrap gap-1 text-sm">
        {letters.map((l) => <a key={l} href={`#letter-${l}`} className="grid size-7 place-items-center rounded-md border border-border hover:bg-surface-2">{l}</a>)}
      </nav>
      {letters.map((l) => (
        <section key={l} aria-labelledby={`letter-${l}`}>
          <h2 id={`letter-${l}`} className="mb-2 mt-6 scroll-mt-24 text-xl font-bold text-primary">{l}</h2>
          <dl className="grid gap-3 md:grid-cols-2">
            {list.filter((g) => g.term[0].toUpperCase() === l).map((g) => (
              <div key={g.slug} id={g.slug} className="scroll-mt-24 rounded-xl border border-border bg-card p-4 target:border-primary target:ring-2 target:ring-primary/30">
                <dt className="flex items-center gap-2 font-semibold">{g.term} <Badge variant="outline" className="ml-auto">{CATS[g.category]}</Badge></dt>
                <dd className="mt-1 space-y-2 text-sm">
                  <Markdown runnableCode={false}>{g.definition}</Markdown>
                  {g.example && <StaticCode code={g.example} className="rounded-md border border-border" />}
                  {g.related?.length ? (
                    <p className="text-xs text-muted-foreground">
                      Related: {g.related.map((r, i) => <span key={r}>{i > 0 && ", "}<a className="text-accent hover:underline" href={`#${r}`}>{terms.find((t) => t.slug === r)?.term ?? r}</a></span>)}
                    </p>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
      {!list.length && <p className="text-muted-foreground">No terms match “{q}”.</p>}
    </div>
  );
}
