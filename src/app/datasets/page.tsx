import type { Metadata } from "next";
import { ChevronDown, Columns3, Database, Download, Rows3, Sparkles, Hexagon } from "lucide-react";
import type { DatasetInfo } from "@/content/types";
import type { TopicKind } from "@/lib/game/worlds";
import { datasets } from "@/content/datasets";
import { PageHeader } from "@/components/layout/page-header";
import { Hexy } from "@/components/brand/mascot";
import { TopicArt } from "@/components/brand/topic-art";
import { CodeBlock } from "@/components/code/code-block";
import { Button } from "@/components/ui/button";
import { JumpNav } from "@/components/reference/jump-nav";
import { candy, INK, type Candy } from "@/components/reference/candy";
import { cn } from "@/lib/utils";
import { withBase } from "@/lib/base-path";

export const metadata: Metadata = { title: "Sample Datasets", description: "Ready-to-use datasets for practising R: student performance, survey, sales, health, housing, weather and built-in R datasets." };

/** Thumbnail illustration and colour per dataset. */
const LOOK: Record<string, { art: TopicKind; color: Candy }> = {
  students: { art: "report", color: "sky" },
  survey: { art: "center", color: "pink" },
  sales: { art: "bar", color: "tangerine" },
  patients: { art: "bell", color: "teal" },
  customers_messy: { art: "clean", color: "coral" },
  housing: { art: "regression", color: "grape" },
  weather: { art: "calendar", color: "sun" },
  mtcars: { art: "correlation", color: "primary" },
  iris: { art: "scatter", color: "mint" },
  airquality: { art: "missing", color: "sky" },
};
const look = (d: DatasetInfo) => LOOK[d.id] ?? { art: "table" as TopicKind, color: "teal" as Candy };

/** Colour of a column type chip. */
function typeColor(type: string): Candy {
  if (type.startsWith("character")) return type.includes("date") ? "sun" : "pink";
  if (type === "integer" || type === "numeric") return "sky";
  if (type === "factor") return "tangerine";
  if (type === "logical") return "grape";
  return "teal";
}

function DatasetCard({ d }: { d: DatasetInfo }) {
  const l = look(d);
  const builtIn = d.source === "built-in";
  const code = builtIn ? `head(${d.path})` : `${d.id} <- read.csv("${d.path}")\nhead(${d.id})`;
  return (
    <article id={d.id} aria-labelledby={`ds-${d.id}`} style={candy(l.color)} className="flex min-w-0 scroll-mt-36 flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] target:border-[var(--c)] target:ring-4 target:ring-[var(--c)]/25">
      <div className="relative h-36 overflow-hidden bg-[var(--c-soft)] sm:h-44">
        <TopicArt kind={l.art} bg="var(--c-soft)" className="mx-auto h-full w-auto" />
        <span className={cn("absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold shadow-sm", builtIn ? "bg-card text-foreground" : "bg-[var(--c)] text-[var(--c-fg)]")}>
          {builtIn ? <Hexagon className="size-3.5" aria-hidden /> : <Sparkles className="size-3.5" aria-hidden />}
          {builtIn ? "Built into R" : "R Academy"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div>
          <h3 id={`ds-${d.id}`} className="font-display text-xl font-bold tracking-tight">
            {d.name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-extrabold">
            <span className={cn("inline-flex items-center gap-1 rounded-full bg-[var(--c-soft)] px-2.5 py-1", INK)}>
              <Rows3 className="size-3.5" aria-hidden /> {d.rows} rows
            </span>
            <span className={cn("inline-flex items-center gap-1 rounded-full bg-[var(--c-soft)] px-2.5 py-1", INK)}>
              <Columns3 className="size-3.5" aria-hidden /> {d.columns.length}
              {builtIn ? "+" : ""} columns
            </span>
            <code className="inline-flex items-center rounded-full bg-surface-2 px-2.5 py-1 font-mono font-bold text-muted-foreground">{d.path}</code>
          </div>
          <p className="mt-3 font-semibold text-muted-foreground">{d.description}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Peek inside – press Run</p>
          <CodeBlock code={code} workspace="datasets" className="my-0" />
        </div>

        <details className="group rounded-2xl border-2 border-border bg-surface-2/50 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl px-4 py-3 font-display font-semibold hover:bg-surface-2">
            <Columns3 className={cn("size-4", INK)} aria-hidden />
            Columns ({d.columns.length})
            <ChevronDown className="ml-auto size-4 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="overflow-x-auto px-2 pb-2 scrollbar-thin">
            <table className="w-full min-w-[26rem] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-2 py-2 font-extrabold">Column</th>
                  <th scope="col" className="px-2 py-2 font-extrabold">Type</th>
                  <th scope="col" className="px-2 py-2 font-extrabold">Description</th>
                </tr>
              </thead>
              <tbody>
                {d.columns.map((c) => (
                  <tr key={c.name} className="border-t-2 border-border/70 align-top">
                    <th scope="row" className="px-2 py-2 font-mono text-[13px] font-bold">{c.name}</th>
                    <td className="px-2 py-2">
                      <span style={candy(typeColor(c.type))} className={cn("whitespace-nowrap rounded-full bg-[var(--c-soft)] px-2 py-0.5 text-xs font-extrabold", INK)}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-2 py-2 font-semibold">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        {!builtIn && (
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
            <Button asChild variant="outline" size="sm">
              <a href={withBase(`/${d.path}`)} download>
                <Download /> Download CSV
              </a>
            </Button>
            <span className="text-xs font-semibold text-muted-foreground">For R or RStudio on your own computer.</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default function DatasetsPage() {
  const groups = [
    { id: "r-academy-data", title: "R Academy datasets", desc: "Synthetic (generated for learning) but realistic CSV files – read them with read.csv().", items: datasets.filter((d) => d.source === "r-academy") },
    { id: "built-in-data", title: "Built into R", desc: "Classic datasets that come with R itself – just type their name.", items: datasets.filter((d) => d.source === "built-in") },
  ];
  return (
    <>
      <PageHeader
        icon={<Database />}
        color="teal"
        eyebrow={`Data playground · ${datasets.length} datasets`}
        title="Sample Datasets"
        description="Every dataset here is ready in R on every page of the site – no download needed. Press Run to peek inside, then explore it in the playground."
        art={<Hexy mood="happy" size={120} />}
      />
      <JumpNav label="Datasets" items={datasets.map((d) => ({ id: d.id, label: d.name.replace(/ \(built-in\)$/, ""), color: look(d).color }))} />
      <div className="mx-auto max-w-7xl space-y-12 px-5 py-8 sm:py-10">
        {groups.map((g) => (
          <section key={g.id} aria-labelledby={g.id}>
            <h2 id={g.id} className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {g.title}
            </h2>
            <p className="mt-1 font-semibold text-muted-foreground">{g.desc}</p>
            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {g.items.map((d) => (
                <DatasetCard key={d.id} d={d} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
