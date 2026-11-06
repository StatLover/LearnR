import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Clock, Layers } from "lucide-react";
import { modules, stages } from "@/content/curriculum";
import { projects } from "@/content/projects";
import { getOutline } from "@/content/outline";
import { PageHeader } from "@/components/layout/page-header";
import { ContinueCard, ModuleBadge, ModuleLessonList } from "@/components/path/path-progress";
import { Roadmap } from "@/components/path/roadmap";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Learning Path",
  description: "The complete R Academy curriculum: three stages and ten modules from absolute beginner to intermediate R.",
};

export default function LearnPage() {
  const outline = getOutline();
  const totalMin = modules.flatMap((m) => m.lessons).reduce((a, l) => a + l.minutes, 0);
  return (
    <>
      <PageHeader
        icon={<GraduationCap />}
        title="Learning Path"
        description={
          <>
            Ten modules in three stages take you from “What is programming?” to statistical models and complete data projects. Lessons build on each other – follow them in order, or jump to what you need.
            <span className="mt-2 flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1"><Layers className="size-4" /> {modules.reduce((a, m) => a + m.lessons.length, 0)} lessons · {modules.reduce((a, m) => a + m.exercises.length, 0)} exercises · {projects.length} projects</span>
              <span className="flex items-center gap-1"><Clock className="size-4" /> about {Math.round(totalMin / 60)} hours of lessons</span>
            </span>
          </>
        }
      />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
        <ContinueCard outline={outline} />
        <section aria-labelledby="roadmap-title">
          <h2 id="roadmap-title" className="mb-1 text-xl font-bold">Roadmap</h2>
          <p className="mb-4 text-sm text-muted-foreground">The recommended order: each module builds on the ones before it. Click a module to open it.</p>
          <Roadmap outline={outline} />
        </section>
        {stages.map((st) => (
          <section key={st.number} aria-labelledby={`stage-${st.number}`}>
            <div className="mb-4">
              <Badge variant="primary">{st.subtitle}</Badge>
              <h2 id={`stage-${st.number}`} className="mt-2 text-2xl font-bold">{st.title}</h2>
              <p className="mt-1 max-w-3xl text-muted-foreground">{st.description}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {modules.filter((m) => m.stage === st.number).map((m) => {
                const om = outline.modules.find((x) => x.number === m.number)!;
                return (
                  <article key={m.number} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft font-bold text-primary">{m.number}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold"><Link href={`/learn/module/${m.id}`} className="hover:text-primary">{m.title}</Link></h3>
                          <ModuleBadge module={om} />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                        <p className="mt-2 text-xs text-muted-foreground"><strong className="font-medium text-foreground">Topics:</strong> {m.topics.join(" · ")}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <ModuleLessonList outline={outline} module={om} />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
