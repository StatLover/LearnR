import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Clock, Database, Download, ListChecks, Package, ScrollText, Sparkles, Zap } from "lucide-react";
import { projects } from "@/content/projects";
import { getDataset } from "@/content/datasets";
import { Markdown } from "@/components/content/markdown";
import { TopicArt } from "@/components/brand/topic-art";
import { FloatingHexes } from "@/components/brand/decor";
import { BookmarkToggle } from "@/components/exercises/bookmark-toggle";
import { ProjectSteps } from "@/components/projects/project-steps";
import { ProjectMiniProgress, ProjectSidebar, ProjectStartButton, type ProjectLite } from "@/components/projects/project-progress";
import { LevelBadge, levelColor, projectXp } from "@/components/projects/project-meta";
import { Button } from "@/components/ui/button";
import { PROJECT_ART } from "@/lib/game/worlds";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const pr = projects.find((x) => x.id === id);
  return pr ? { title: pr.title, description: pr.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = projects.findIndex((x) => x.id === id);
  const p = projects[index];
  if (!p) notFound();
  const next = projects[index + 1];
  const c = levelColor(p.level);
  const boss = p.level === "capstone";
  const ds = p.datasets.map((d) => getDataset(d)).filter((d): d is NonNullable<typeof d> => Boolean(d));
  const lite: ProjectLite = { id: p.id, title: p.title, steps: p.steps.map((s) => ({ id: s.id, title: s.title })) };

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-x-1.5 text-sm font-bold text-muted-foreground">
          <li>
            <Link href="/projects" className="hover:text-primary">
              Projects
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="text-foreground">
            {p.title}
          </li>
        </ol>
      </nav>

      {/* hero */}
      <header
        className={cn("relative mb-8 overflow-hidden rounded-3xl border-2 shadow-[var(--shadow-card)]", boss ? "border-sun shadow-[0_6px_0_var(--sun-shadow),var(--shadow-card)]" : "border-border")}
        style={{ background: `linear-gradient(120deg, ${c.soft} 0%, var(--card) 72%)` }}
      >
        <div className="blob -left-14 -top-20 size-64" style={{ background: c.main }} />
        <FloatingHexes count={6} className="opacity-60" />
        <div className="relative grid items-center gap-6 p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <LevelBadge level={p.level} />
              <span className="inline-flex items-center gap-1 rounded-full bg-card/80 px-2.5 py-1 text-xs font-bold text-muted-foreground">
                <Clock className="size-3.5" aria-hidden /> about {p.minutes} min
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-card/80 px-2.5 py-1 text-xs font-bold text-muted-foreground">
                <ListChecks className="size-3.5" aria-hidden /> {p.steps.length} steps
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sun-soft px-2.5 py-1 text-xs font-bold text-warning">
                <Zap className="size-3.5 fill-current" aria-hidden /> up to {projectXp(p.steps.length)} XP
              </span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{p.title}</h1>
            <p className="mt-2 max-w-2xl text-base font-semibold text-muted-foreground sm:text-lg">{p.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <ProjectStartButton project={lite} />
              <BookmarkToggle id={`project:${p.id}`} kind="project" title={p.title} href={`/projects/${p.id}`} />
            </div>
          </div>
          <div className={cn("hidden overflow-hidden rounded-3xl border-2 shadow-[var(--shadow-card)] md:block [&_svg]:block", boss ? "border-sun" : "border-border", "rotate-2")}>
            <TopicArt kind={PROJECT_ART[p.id] ?? "table"} bg={c.soft} />
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          {/* mission brief */}
          <section aria-labelledby="brief-title" className="rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
            <h2 id="brief-title" className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
              <span className="grid size-9 place-items-center rounded-xl bg-sky text-white shadow-[0_3px_0_var(--sky-shadow)]" aria-hidden>
                <ScrollText className="size-5" />
              </span>
              Your mission
            </h2>
            <Markdown>{p.intro}</Markdown>
          </section>

          {/* datasets */}
          {ds.map((d) => (
            <section key={d.id} aria-label={`Dataset: ${d.name}`} className="rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
              <div className="flex flex-wrap items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-teal text-white shadow-[0_3px_0_var(--teal-shadow)]" aria-hidden>
                  <Database className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">The dataset</p>
                  <h2 className="font-display text-xl font-semibold leading-tight">{d.name}</h2>
                  <code className="mt-1 inline-block max-w-full overflow-x-auto rounded-lg bg-surface-2 px-2 py-0.5 font-mono text-xs">{d.source === "built-in" ? d.path : `read.csv("${d.path}")`}</code>
                </div>
                {d.source === "r-academy" && (
                  <Button asChild variant="outline" size="sm">
                    <a href={`/${d.path}`} download>
                      <Download /> Download CSV
                    </a>
                  </Button>
                )}
              </div>
              <p className="mt-3 text-sm font-semibold text-muted-foreground">{d.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full bg-teal-soft px-2.5 py-0.5">{d.rows} rows</span>
                <span className="rounded-full bg-teal-soft px-2.5 py-0.5">{d.columns.length} columns</span>
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-muted-foreground">{d.source === "built-in" ? "Built into R" : "Loaded automatically in R"}</span>
              </div>
              <details className="group mt-3 rounded-2xl border-2 border-border">
                <summary className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-bold [&::-webkit-details-marker]:hidden">
                  <ChevronRight className="size-4 transition-transform group-open:rotate-90" aria-hidden /> Show the columns
                </summary>
                <div className="overflow-x-auto border-t-2 border-border">
                  <table className="w-full min-w-[420px] text-left text-sm">
                    <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th scope="col" className="px-4 py-2 font-bold">
                          Column
                        </th>
                        <th scope="col" className="px-4 py-2 font-bold">
                          Type
                        </th>
                        <th scope="col" className="px-4 py-2 font-bold">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.columns.map((col) => (
                        <tr key={col.name} className="border-t-2 border-border">
                          <td className="px-4 py-1.5 font-mono text-xs font-semibold">{col.name}</td>
                          <td className="px-4 py-1.5 text-xs text-muted-foreground">{col.type}</td>
                          <td className="px-4 py-1.5">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </section>
          ))}

          <ProjectMiniProgress project={lite} color={c.main} />

          <div className="flex items-center gap-3 pt-2">
            <Sparkles className="size-5 text-primary" aria-hidden />
            <p className="text-sm font-semibold text-muted-foreground">Each step runs real R in your browser. Earlier steps&apos; solutions run first, so you can always pick up where you left off.</p>
          </div>
          <ProjectSteps project={p} />

          {next && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-dashed border-border bg-card/60 p-4">
              <p className="text-sm font-bold text-muted-foreground">
                Ready for more? The next quest is <span className="text-foreground">{next.title}</span>.
              </p>
              <Button asChild variant="outline">
                <Link href={`/projects/${next.id}`}>
                  Next quest <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
        </div>

        <aside className="space-y-5" aria-label="Project progress">
          <div className="rounded-3xl border-2 border-border bg-card p-5 text-sm shadow-[var(--shadow-card)]">
            <p className="font-display text-lg font-semibold">Skills you will use</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {p.skills.map((s) => (
                <li key={s} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                  {s}
                </li>
              ))}
            </ul>
            {p.packages?.length ? (
              <p className="mt-3 flex items-start gap-1.5 font-semibold text-muted-foreground">
                <Package className="mt-0.5 size-4 shrink-0" aria-hidden /> Packages: {p.packages.join(", ")} (installed automatically)
              </p>
            ) : null}
          </div>
          <div className="lg:sticky lg:top-20">
            <ProjectSidebar project={lite} color={c.main} />
          </div>
        </aside>
      </div>
    </div>
  );
}
