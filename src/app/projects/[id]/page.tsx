import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Database, Download, Package } from "lucide-react";
import { projects } from "@/content/projects";
import { getDataset } from "@/content/datasets";
import { Markdown } from "@/components/content/markdown";
import { ProjectProgress, ProjectSteps } from "@/components/projects/project-steps";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/learn/lesson-shell";

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
  const p = projects.find((x) => x.id === id);
  if (!p) notFound();
  const ds = p.datasets.map((d) => getDataset(d)).filter((d): d is NonNullable<typeof d> => Boolean(d));
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">Projects</Link>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={p.level === "capstone" ? "warning" : p.level === "intermediate" ? "info" : "success"}>{p.level === "capstone" ? "Capstone project" : `${p.level[0].toUpperCase()}${p.level.slice(1)} project`}</Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="size-4" /> about {p.minutes} min</span>
            <div className="ml-auto"><BookmarkButton id={`project:${p.id}`} kind="project" title={p.title} href={`/projects/${p.id}`} /></div>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{p.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{p.summary}</p>
          <div className="mt-6">
            <Markdown>{p.intro}</Markdown>
          </div>
          {ds.map((d) => (
            <div key={d.id} className="mt-6 rounded-xl border border-border bg-card p-4">
              <p className="flex flex-wrap items-center gap-2 font-semibold">
                <Database className="size-4 text-primary" /> Dataset: {d.name}
                <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">{d.source === "built-in" ? d.path : `read.csv("${d.path}")`}</code>
                {d.source === "r-academy" && (
                  <a href={`/${d.path}`} download className="ml-auto flex items-center gap-1 text-sm font-normal text-accent hover:underline"><Download className="size-4" /> Download CSV</a>
                )}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{d.description} ({d.rows} rows)</p>
              <details className="mt-2 text-sm">
                <summary className="cursor-pointer font-medium">Columns</summary>
                <table className="mt-2 w-full text-left text-xs">
                  <tbody>
                    {d.columns.map((c) => (
                      <tr key={c.name} className="border-t border-border"><td className="py-1 pr-3 font-mono font-semibold">{c.name}</td><td className="py-1 pr-3 text-muted-foreground">{c.type}</td><td className="py-1">{c.description}</td></tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </div>
          ))}
          <div className="mt-8">
            <ProjectSteps project={p} />
          </div>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-4">
            <ProjectProgress project={p} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-sm">
            <p className="font-semibold">Skills you will use</p>
            <div className="mt-2 flex flex-wrap gap-1">{p.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}</div>
            {p.packages?.length ? <p className="mt-3 flex items-center gap-1.5 text-muted-foreground"><Package className="size-4" /> Packages: {p.packages.join(", ")} (installed automatically)</p> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
