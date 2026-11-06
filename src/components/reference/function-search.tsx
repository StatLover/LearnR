"use client";

import { fnSlug } from "@/lib/fn-slug";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface FnSummary {
  name: string;
  package: string;
  category: string;
  purpose: string;
  syntax: string;
}

export function FunctionSearch({ functions, categories }: { functions: FnSummary[]; categories: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return functions
      .filter((f) => (!cat || f.category === cat) && (!t || f.name.toLowerCase().includes(t) || f.purpose.toLowerCase().includes(t) || f.package.toLowerCase().includes(t)))
      .sort((a, b) => (t ? Number(!a.name.toLowerCase().startsWith(t)) - Number(!b.name.toLowerCase().startsWith(t)) : 0));
  }, [functions, q, cat]);
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <label htmlFor="fn-search" className="sr-only">Search R functions</label>
        <Input id="fn-search" className="h-10 pl-9 text-base" placeholder="Search functions – try “mean”, “missing” or “plot”…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
        <button onClick={() => setCat(null)} aria-pressed={cat === null} className={cn("rounded-full border px-3 py-1 text-xs cursor-pointer", cat === null ? "border-primary bg-primary-soft font-semibold" : "border-border hover:bg-surface-2")}>All ({functions.length})</button>
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c === cat ? null : c)} aria-pressed={cat === c} className={cn("rounded-full border px-3 py-1 text-xs cursor-pointer", cat === c ? "border-primary bg-primary-soft font-semibold" : "border-border hover:bg-surface-2")}>
            {c}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">{list.length} function{list.length === 1 ? "" : "s"}</p>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((f) => (
          <li key={`${f.package}-${f.name}`}>
            <Link href={`/reference/${fnSlug(f.name)}`} className="flex h-full flex-col rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:bg-surface">
              <span className="flex items-center gap-2">
                <code className="font-mono text-base font-semibold text-primary-strong dark:text-primary">{f.name}()</code>
                <Badge variant="outline" className="ml-auto">{f.package}</Badge>
              </span>
              <span className="mt-1 text-sm text-muted-foreground">{f.purpose}</span>
              <code className="mt-2 truncate font-mono text-xs text-muted-foreground">{f.syntax}</code>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
