import type { Metadata } from "next";
import { Database, Download } from "lucide-react";
import { datasets } from "@/content/datasets";
import { PageHeader } from "@/components/layout/page-header";
import { CodeBlock } from "@/components/code/code-block";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Sample Datasets", description: "Ready-to-use datasets for practising R: student performance, survey, sales, health, housing, weather and built-in R datasets." };

export default function DatasetsPage() {
  return (
    <>
      <PageHeader icon={<Database />} title="Sample Datasets" description="Every dataset here is available in R on every page of the site – no download needed. R Academy datasets are synthetic (generated for learning) but realistic." />
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 lg:grid-cols-2">
        {datasets.map((d) => (
          <section key={d.id} id={d.id} aria-labelledby={`ds-${d.id}`} className="scroll-mt-24 rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id={`ds-${d.id}`} className="text-lg font-semibold">{d.name}</h2>
              <Badge variant={d.source === "built-in" ? "accent" : "primary"}>{d.source === "built-in" ? "Built into R" : "R Academy"}</Badge>
              <span className="text-sm text-muted-foreground">{d.rows} rows · {d.columns.length}{d.source === "built-in" ? "+" : ""} columns</span>
              {d.source === "r-academy" && <a href={`/${d.path}`} download className="ml-auto flex items-center gap-1 text-sm text-accent hover:underline"><Download className="size-4" /> CSV</a>}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
            <CodeBlock code={d.source === "built-in" ? `head(${d.path})` : `${d.id} <- read.csv("${d.path}")\nhead(${d.id})`} workspace="datasets" />
            <details className="text-sm">
              <summary className="cursor-pointer font-medium">Columns</summary>
              <table className="mt-2 w-full text-left text-xs">
                <thead><tr className="text-muted-foreground"><th className="py-1 font-medium">Column</th><th className="py-1 font-medium">Type</th><th className="py-1 font-medium">Description</th></tr></thead>
                <tbody>{d.columns.map((c) => <tr key={c.name} className="border-t border-border align-top"><td className="py-1 pr-2 font-mono font-semibold">{c.name}</td><td className="py-1 pr-2 text-muted-foreground">{c.type}</td><td className="py-1">{c.description}</td></tr>)}</tbody>
              </table>
            </details>
          </section>
        ))}
      </div>
    </>
  );
}
