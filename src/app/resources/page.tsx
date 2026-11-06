import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookA, BookOpen, BookText, Bug, Code2, Database, FileText, FlaskConical, Globe, Library, Monitor, Sparkles, ChartScatter, Wrench, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Hexy } from "@/components/brand/mascot";
import { candy, INK, type Candy } from "@/components/reference/candy";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Cheat Sheets and Resources", description: "R Academy reference material and trusted external resources for learning R." };

const INTERNAL: { href: string; icon: LucideIcon; title: string; desc: string; color: Candy }[] = [
  { href: "/cheatsheets", icon: FileText, title: "Cheat sheets", desc: "Variables, vectors, data frames, loops, functions, dplyr, ggplot2, statistics, strings & dates, errors.", color: "tangerine" },
  { href: "/reference", icon: Library, title: "Function reference", desc: "Searchable cards for the R functions beginners use most – each with a runnable example.", color: "grape" },
  { href: "/glossary", icon: BookA, title: "Glossary", desc: "Programming and statistics terms in plain English.", color: "pink" },
  { href: "/datasets", icon: Database, title: "Sample datasets", desc: "Ready-to-use data for practice and projects.", color: "teal" },
  { href: "/playground", icon: Code2, title: "R Playground", desc: "Write and run any R code – with a console, plots, data and variables.", color: "mint" },
  { href: "/visualize", icon: FlaskConical, title: "R Labs", desc: "Interactive simulations and charts powered by real R code.", color: "sky" },
  { href: "/error-checker", icon: Bug, title: "Error Detective", desc: "Paste code that fails – understand the R error message and fix it.", color: "coral" },
  { href: "/tutor", icon: Sparkles, title: "AI Tutor", desc: "Ask questions about R and statistics in your own words.", color: "primary" },
];

const EXTERNAL: { href: string; icon: LucideIcon; title: string; desc: string; color: Candy }[] = [
  { href: "https://www.r-project.org/", icon: Globe, title: "The R Project", desc: "Download R for your computer and read the official manuals.", color: "sky" },
  { href: "https://posit.co/download/rstudio-desktop/", icon: Monitor, title: "RStudio Desktop", desc: "The most popular editor for R on your own computer.", color: "mint" },
  { href: "https://r4ds.hadley.nz/", icon: BookText, title: "R for Data Science (2nd ed.)", desc: "Free online book on the tidyverse workflow.", color: "grape" },
  { href: "https://docs.r-wasm.org/webr/latest/", icon: BookOpen, title: "webR documentation", desc: "How R runs in the browser – the technology behind this site.", color: "teal" },
  { href: "https://ggplot2.tidyverse.org/", icon: ChartScatter, title: "ggplot2 documentation", desc: "Reference for every geom, scale and theme.", color: "pink" },
  { href: "https://dplyr.tidyverse.org/", icon: Wrench, title: "dplyr documentation", desc: "Reference and articles for data manipulation.", color: "tangerine" },
];

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        icon={<BookOpen />}
        color="sky"
        eyebrow="Your toolbox"
        title="Cheat Sheets and Resources"
        description="Everything you need to look things up quickly – here on R Academy and elsewhere."
        art={<Hexy mood="wave" size={120} />}
      />
      <div className="mx-auto max-w-7xl space-y-12 px-5 py-8 sm:py-10">
        <section aria-labelledby="internal">
          <h2 id="internal" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            On R Academy
          </h2>
          <p className="mt-1 font-semibold text-muted-foreground">Reference pages and hands-on tools – all running real R in your browser.</p>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INTERNAL.map((r) => (
              <li key={r.href} className="min-w-0">
                <Link href={r.href} style={candy(r.color)} className="group lift relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)] hover:border-[var(--c)]">
                  <span aria-hidden className="absolute -right-8 -top-8 size-28 rounded-full bg-[var(--c-soft)]" />
                  <span aria-hidden className="relative grid size-14 place-items-center rounded-2xl bg-[var(--c)] text-[var(--c-fg)] shadow-[0_4px_0_var(--c-shadow)] transition-transform group-hover:-rotate-6 [&_svg]:size-7">
                    <r.icon />
                  </span>
                  <span className="relative mt-4 font-display text-lg font-bold">{r.title}</span>
                  <span className="relative mt-1 flex-1 text-sm font-semibold text-muted-foreground">{r.desc}</span>
                  <span className={cn("relative mt-4 inline-flex items-center gap-1 font-display text-sm font-semibold", INK)}>
                    Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="external">
          <h2 id="external" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Trusted external resources
          </h2>
          <p className="mt-1 font-semibold text-muted-foreground">Official sites and free books for when you continue with R on your own computer.</p>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXTERNAL.map((r) => (
              <li key={r.href} className="min-w-0">
                <a href={r.href} target="_blank" rel="noreferrer noopener" style={candy(r.color)} className="group lift flex h-full items-start gap-4 rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)] hover:border-[var(--c)]">
                  <span aria-hidden className={cn("grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--c-soft)] [&_svg]:size-6", INK)}>
                    <r.icon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start gap-1 font-display text-lg font-bold leading-snug">
                      {r.title}
                      <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-muted-foreground">{r.desc}</span>
                    <span className={cn("mt-2 block truncate font-mono text-xs font-bold", INK)}>{host(r.href)}</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
