import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { cheatSheets } from "@/content/cheatsheets";
import { PageHeader } from "@/components/layout/page-header";
import { StaticCode } from "@/components/code/static-code";
import { CopyButton } from "@/components/reference/copy-button";
import { Markdown } from "@/components/content/markdown";
import { PrintButton } from "@/components/reference/print-button";

export const metadata: Metadata = { title: "R Cheat Sheets", description: "Quick references for R variables, vectors, data frames, loops, functions, dplyr, ggplot2, statistics, strings, dates and error messages." };

export default function CheatSheetsPage() {
  return (
    <>
      <PageHeader icon={<FileText />} title="R Cheat Sheets" description="Compact, copy-ready references for everyday R. Use the links to jump to a sheet; print this page for a paper copy.">
        <PrintButton />
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav aria-label="Cheat sheets" className="mb-8 flex flex-wrap gap-2 print:hidden">
          {cheatSheets.map((c) => <a key={c.id} href={`#${c.id}`} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-primary hover:bg-primary-soft">{c.title}</a>)}
        </nav>
        <div className="space-y-12">
          {cheatSheets.map((c) => (
            <section key={c.id} id={c.id} aria-labelledby={`${c.id}-t`} className="scroll-mt-24 break-inside-avoid">
              <h2 id={`${c.id}-t`} className="text-2xl font-bold">{c.title}</h2>
              <p className="mt-1 text-muted-foreground">{c.description}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {c.sections.map((s) => (
                  <div key={s.title} className="break-inside-avoid rounded-xl border border-border bg-card">
                    <h3 className="border-b border-border bg-surface px-4 py-2 font-semibold">{s.title}</h3>
                    <ul className="divide-y divide-border">
                      {s.items.map((it, i) => (
                        <li key={i} className="group px-2 py-2">
                          <div className="flex items-start gap-1">
                            <StaticCode code={it.code} className="min-w-0 flex-1 rounded-md bg-code py-1.5 text-[12.5px] [&>code>span]:px-2" wrap />
                            <CopyButton text={it.code} label="Copy snippet" />
                          </div>
                          <div className="mt-1 px-2 text-sm text-muted-foreground"><Markdown runnableCode={false}>{it.description}</Markdown></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
