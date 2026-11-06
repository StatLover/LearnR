import type { Metadata } from "next";
import Link from "next/link";
import { FolderKanban, Clock, Database } from "lucide-react";
import { projects } from "@/content/projects";
import { getDataset } from "@/content/datasets";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Projects", description: "Guided real-world R data projects with sample datasets, checkpoints and solutions – including a capstone exploratory data analysis." };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        icon={<FolderKanban />}
        title="Real-World Data Projects"
        description="Put your skills together on realistic datasets. Each project is split into steps with clear instructions, hints, automatic checkpoints and an explained solution. Finish with the capstone: a complete exploratory data analysis report."
      />
      <div className="mx-auto max-w-7xl px-4 py-8">
        {projects.length === 0 && <p className="text-muted-foreground">Projects are being prepared.</p>}
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/projects/${p.id}`} className="flex h-full flex-col rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md">
                <div className="flex items-center gap-2">
                  <Badge variant={p.level === "capstone" ? "warning" : p.level === "intermediate" ? "info" : "success"}>{p.level === "capstone" ? "Capstone" : p.level[0].toUpperCase() + p.level.slice(1)}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3.5" /> {p.minutes} min · {p.steps.length} steps</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold">{p.title}</h2>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{p.summary}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Database className="size-3.5" /> {p.datasets.map((d) => getDataset(d)?.name ?? d).join(", ")}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.skills.slice(0, 5).map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
