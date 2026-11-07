import type { Metadata } from "next";
import { ArrowRight, ArrowUp, FileText } from "lucide-react";
import { cheatSheets } from "@/content/cheatsheets";
import { PageHeader } from "@/components/layout/page-header";
import { Hexy } from "@/components/brand/mascot";
import { StaticCode } from "@/components/code/static-code";
import { CopyButton } from "@/components/reference/copy-button";
import { PrintButton } from "@/components/reference/print-button";
import { JumpNav } from "@/components/reference/jump-nav";
import { InlineMd } from "@/components/reference/inline-md";
import { candy, INK } from "@/components/reference/candy";
import { sheetMeta } from "@/components/reference/sheet-meta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "R Cheat Sheets", description: "Quick references for R variables, vectors, data frames, loops, functions, dplyr, ggplot2, statistics, strings, dates and error messages." };

/*
 * Printing: whatever theme is on screen, paper gets the light palette, no
 * shadows or backgrounds, and cards that do not break across pages.
 */
const PRINT_CSS = `
@media print {
  .cs-print {
    --background: #fff; --card: #fff; --surface: #fff; --surface-2: #f4f5fa; --code-bg: #f7f7fb;
    --foreground: #15172e; --muted-foreground: #464a6b; --border: #c9cde0; --border-strong: #b0b5cf;
    --syn-keyword: #6f2fd1; --syn-string: #0b7a48; --syn-number: #b33c0c; --syn-comment: #6b708f;
    --syn-function: #2f40b8; --syn-atom: #b8285a; --syn-operator: #a81f50; --syn-variable: #15172e; --syn-punct: #464a6b;
    --shadow-card: none; --c-soft: #fff;
    color: var(--foreground);
  }
  .cs-print .blob { display: none; }
  .cs-print .cs-banner { background: transparent !important; border: 0 !important; break-after: avoid; }
  .cs-print .cs-card { break-inside: auto; }
  .cs-sheet + .cs-sheet { break-before: page; }
}`;

export default function CheatSheetsPage() {
  const sheets = cheatSheets.map((c, i) => ({ ...c, meta: sheetMeta(c.id, i), snippets: c.sections.reduce((n, s) => n + s.items.length, 0) }));
  const total = sheets.reduce((n, s) => n + s.snippets, 0);
  return (
    <div className="cs-print">
      <style>{PRINT_CSS}</style>
      <PageHeader
        icon={<FileText />}
        color="tangerine"
        eyebrow={`${sheets.length} sheets · ${total} snippets`}
        title="R Cheat Sheets"
        description="Compact, copy-ready references for everyday R. Jump to a sheet, copy a snippet with one click, or print the whole collection for your desk."
        art={<Hexy mood="cool" size={120} />}
        className="print:!bg-none"
      >
        <PrintButton label="Print sheets" />
      </PageHeader>

      <JumpNav label="Cheat sheets" items={sheets.map((s) => ({ id: s.id, label: s.title, color: s.meta.color, icon: <s.meta.icon /> }))} />

      <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        {/* Sheet overview cards */}
        <section aria-labelledby="all-sheets" className="print:hidden">
          <h2 id="all-sheets" className="sr-only">
            All cheat sheets
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {sheets.map((s) => (
              <li key={s.id} className="min-w-0">
                <a href={`#${s.id}`} style={candy(s.meta.color)} className="group lift flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] hover:border-[var(--c)]">
                  <span className="relative flex items-center gap-3 overflow-hidden bg-[var(--c)] px-4 py-3.5 text-[var(--c-fg)]">
                    <span aria-hidden className="absolute -right-4 -top-6 size-16 rounded-full bg-white/20" />
                    <span aria-hidden className="grid size-10 place-items-center rounded-xl bg-white/25 [&_svg]:size-5">
                      <s.meta.icon />
                    </span>
                    <span className="relative font-display text-lg font-bold leading-tight">{s.title}</span>
                  </span>
                  <span className="flex flex-1 flex-col gap-3 p-4">
                    <span className="line-clamp-3 text-sm font-semibold text-muted-foreground">{s.description}</span>
                    <span className="mt-auto flex items-center gap-2 text-xs font-extrabold">
                      <span className={cn("rounded-full bg-[var(--c-soft)] px-2 py-0.5", INK)}>{s.snippets} snippets</span>
                      <ArrowRight className={cn("ml-auto size-4 transition-transform group-hover:translate-x-0.5", INK)} aria-hidden />
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 space-y-14 print:mt-0">
          {sheets.map((c) => (
            <section key={c.id} id={c.id} aria-labelledby={`${c.id}-t`} className="cs-sheet scroll-mt-36" style={candy(c.meta.color)}>
              <div className="cs-banner relative overflow-hidden rounded-3xl border-2 border-[var(--c)] bg-[var(--c-soft)] p-5 sm:p-6 print:p-0 print:pb-2">
                <div aria-hidden className="blob -right-10 -top-16 size-48 bg-[var(--c)]" />
                <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-2 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
                  <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--c)] text-[var(--c-fg)] shadow-[0_4px_0_var(--c-shadow)] sm:row-span-2 sm:size-14 print:hidden [&_svg]:size-6 sm:[&_svg]:size-7">
                    <c.meta.icon />
                  </span>
                  <h2 id={`${c.id}-t`} className="font-display text-2xl font-bold tracking-tight sm:text-3xl print:col-span-full">
                    {c.title}
                  </h2>
                  <a href="#main" className="hidden items-center gap-1 rounded-full bg-card px-3 py-1.5 font-display text-sm font-semibold text-muted-foreground hover:text-foreground sm:row-span-2 sm:inline-flex print:hidden">
                    <ArrowUp className="size-4" aria-hidden /> Top
                  </a>
                  <p className="col-span-full max-w-3xl font-semibold text-muted-foreground sm:col-span-1 sm:col-start-2 sm:row-start-2 print:col-span-full">{c.description}</p>
                </div>
              </div>

              <div className="mt-5 gap-4 md:columns-2 xl:columns-3 print:gap-3">
                {c.sections.map((s) => (
                  <div key={s.title} className="cs-card mb-4 break-inside-avoid overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] print:mb-2 print:rounded-xl">
                    <h3 className="flex items-center gap-2.5 border-b-2 border-border px-4 py-3 font-display text-lg font-semibold print:break-after-avoid print:px-3 print:py-1.5 print:text-sm">
                      <svg aria-hidden viewBox="0 0 24 26" className="size-5 shrink-0 print:hidden">
                        <path d="M12 1 L23 7 L23 19 L12 25 L1 19 L1 7 Z" fill="var(--c)" />
                      </svg>
                      {s.title}
                    </h3>
                    <ul className="divide-y-2 divide-border/60">
                      {s.items.map((it, i) => (
                        <li key={i} className="break-inside-avoid px-3 py-3 print:px-2 print:py-1.5">
                          <div className="relative">
                            <StaticCode code={it.code} wrap className="rounded-xl border-2 border-border py-2 pr-11 text-[12.5px] print:rounded-md print:border print:py-1 print:pr-2 print:text-[10.5px] [&>code>span]:px-3 print:[&>code>span]:px-2" />
                            <CopyButton text={it.code} label="Copy snippet" className="absolute right-1.5 top-1.5" />
                          </div>
                          <p className="mt-1.5 px-1 text-sm font-semibold text-muted-foreground print:mt-1 print:text-[11px] print:leading-snug">
                            <InlineMd>{it.description}</InlineMd>
                          </p>
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
    </div>
  );
}
