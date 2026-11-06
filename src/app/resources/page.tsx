import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Library, FileText, BookA, Database, BarChart3, Bug, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Cheat Sheets and Resources", description: "R Academy reference material and trusted external resources for learning R." };

const INTERNAL = [
  { href: "/cheatsheets", icon: FileText, title: "Cheat sheets", desc: "Variables, vectors, data frames, loops, functions, dplyr, ggplot2, statistics, strings & dates, errors." },
  { href: "/reference", icon: Library, title: "Function reference", desc: "Searchable documentation of the R functions beginners use most." },
  { href: "/glossary", icon: BookA, title: "Glossary", desc: "Programming and statistics terms in plain English." },
  { href: "/datasets", icon: Database, title: "Sample datasets", desc: "Ready-to-use data for practice and projects." },
  { href: "/visualize", icon: BarChart3, title: "Visualization lab", desc: "Generate and customise charts with real R code." },
  { href: "/error-checker", icon: Bug, title: "Error checker", desc: "Understand and fix R error messages." },
];
const EXTERNAL = [
  { href: "https://www.r-project.org/", title: "The R Project", desc: "Download R for your computer and read the official manuals." },
  { href: "https://posit.co/download/rstudio-desktop/", title: "RStudio Desktop", desc: "The most popular editor for R on your own computer." },
  { href: "https://r4ds.hadley.nz/", title: "R for Data Science (2nd ed.)", desc: "Free online book on the tidyverse workflow." },
  { href: "https://docs.r-wasm.org/webr/latest/", title: "webR documentation", desc: "How R runs in the browser – the technology behind this site." },
  { href: "https://ggplot2.tidyverse.org/", title: "ggplot2 documentation", desc: "Reference for every geom, scale and theme." },
  { href: "https://dplyr.tidyverse.org/", title: "dplyr documentation", desc: "Reference and articles for data manipulation." },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHeader icon={<BookOpen />} title="Cheat Sheets and Resources" description="Everything you need to look things up quickly – here on R Academy and elsewhere." />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
        <section aria-labelledby="internal"><h2 id="internal" className="mb-4 text-xl font-bold">On R Academy</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{INTERNAL.map((r) => <li key={r.href}><Link href={r.href} className="flex h-full gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/50"><r.icon className="size-6 shrink-0 text-primary" /><span><span className="block font-semibold">{r.title}</span><span className="mt-1 block text-sm text-muted-foreground">{r.desc}</span></span></Link></li>)}</ul>
        </section>
        <section aria-labelledby="external"><h2 id="external" className="mb-4 text-xl font-bold">Trusted external resources</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{EXTERNAL.map((r) => <li key={r.href}><a href={r.href} target="_blank" rel="noreferrer noopener" className="flex h-full gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/50"><ExternalLink className="size-5 shrink-0 text-accent" /><span><span className="block font-semibold">{r.title}</span><span className="mt-1 block text-sm text-muted-foreground">{r.desc}</span></span></a></li>)}</ul>
        </section>
      </div>
    </>
  );
}
