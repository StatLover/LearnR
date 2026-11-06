import "server-only";
import { fnSlug } from "@/lib/fn-slug";
import { modules } from "@/content/curriculum";
import { projects } from "@/content/projects";
import { rFunctions } from "@/content/functions";
import { glossary } from "@/content/glossary";
import { cheatSheets } from "@/content/cheatsheets";
import { datasets } from "@/content/datasets";

export interface SearchDoc {
  id: string;
  type: "Lesson" | "Exercise" | "Project" | "Function" | "Glossary" | "Cheat sheet" | "Dataset" | "Page";
  title: string;
  text: string;
  href: string;
  meta?: string;
}

// Markdown punctuation is removed, but ">" stays (it is part of R operators such as %>% and |>); only quote markers at line starts go.
const strip = (md: string) => md.replace(/^\s*>\s?/gm, "").replace(/[`*_#\[\]()]/g, " ").replace(/\s+/g, " ").trim();

const PAGES: SearchDoc[] = [
  { id: "p-learn", type: "Page", title: "Learning Path", text: "all modules course curriculum roadmap stages", href: "/learn" },
  { id: "p-play", type: "Page", title: "R Code Playground", text: "write and run R code editor console upload csv", href: "/playground" },
  { id: "p-err", type: "Page", title: "R Code Error Checker", text: "debug fix error message explain my error syntax", href: "/error-checker" },
  { id: "p-tutor", type: "Page", title: "AI Tutor", text: "ask questions chat assistant help hint explain", href: "/tutor" },
  { id: "p-ex", type: "Page", title: "Exercises and Challenges", text: "practice coding problems", href: "/exercises" },
  { id: "p-proj", type: "Page", title: "Projects", text: "real world data analysis projects capstone", href: "/projects" },
  { id: "p-dash", type: "Page", title: "Dashboard", text: "progress streak achievements saved code bookmarks notes", href: "/dashboard" },
  { id: "p-viz", type: "Page", title: "Visualization Lab", text: "plots charts ggplot2 histogram scatter export", href: "/visualize" },
  { id: "p-set", type: "Page", title: "Settings", text: "theme dark mode font size account sync", href: "/settings" },
];

export function buildSearchDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [...PAGES];
  for (const m of modules) {
    for (const l of m.lessons) {
      const body = l.sections
        .flatMap((s) => [s.title, ...s.blocks.map((b) => (b.kind === "text" ? b.md : b.kind === "definition" ? `${b.term} ${b.md}` : b.kind === "code" ? b.example.title ?? "" : ""))])
        .join(" ");
      docs.push({
        id: `l-${l.id}`,
        type: "Lesson",
        title: l.title,
        text: strip(`${l.summary} ${l.objectives.join(" ")} ${l.keyPoints.join(" ")} ${body}`).slice(0, 3000),
        href: `/learn/${l.id}`,
        meta: `Module ${m.number} · ${m.title}`,
      });
    }
    for (const e of m.exercises) {
      docs.push({ id: `e-${e.id}`, type: "Exercise", title: e.title, text: strip(e.prompt).slice(0, 600), href: `/exercises/${e.id}`, meta: `Module ${m.number} · ${e.difficulty}` });
    }
  }
  for (const p of projects) docs.push({ id: `pr-${p.id}`, type: "Project", title: p.title, text: strip(`${p.summary} ${p.skills.join(" ")}`), href: `/projects/${p.id}`, meta: p.level });
  for (const f of rFunctions)
    docs.push({ id: `f-${f.package}-${f.name}`, type: "Function", title: `${f.name}()`, text: strip(`${f.purpose} ${f.syntax} ${f.category}`), href: `/reference/${fnSlug(f.name)}`, meta: f.package });
  for (const g of glossary) docs.push({ id: `g-${g.slug}`, type: "Glossary", title: g.term, text: strip(g.definition), href: `/glossary#${g.slug}`, meta: g.category });
  for (const c of cheatSheets) docs.push({ id: `c-${c.id}`, type: "Cheat sheet", title: c.title, text: strip(`${c.description} ${c.sections.map((s) => s.title).join(" ")}`), href: `/cheatsheets#${c.id}` });
  for (const d of datasets) docs.push({ id: `d-${d.id}`, type: "Dataset", title: d.name, text: strip(`${d.description} ${d.columns.map((c) => c.name).join(" ")}`), href: `/datasets#${d.id}` });
  return docs;
}
