import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flag, Dumbbell, BookOpen } from "lucide-react";
import { getModule, modules, stages, lessonsForConcept } from "@/content/curriculum";
import { getOutline } from "@/content/outline";
import { PageHeader } from "@/components/layout/page-header";
import { ModuleLessonList } from "@/components/path/path-progress";
import { Quiz } from "@/components/learn/quiz";
import { DifficultyBadge } from "@/components/ui/badge";

export function generateStaticParams() {
  return modules.map((m) => ({ moduleId: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ moduleId: string }> }): Promise<Metadata> {
  const m = getModule((await params).moduleId);
  return m ? { title: `Module ${m.number}: ${m.title}`, description: m.description } : {};
}

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const m = getModule((await params).moduleId);
  if (!m) notFound();
  const outline = getOutline();
  const om = outline.modules.find((x) => x.number === m.number)!;
  const stage = stages.find((s) => s.number === m.stage)!;
  const reviewLinks: Record<string, { id: string; title: string }> = {};
  for (const q of m.checkpoint) if (q.concept) {
    const l = lessonsForConcept(q.concept)[0];
    if (l) reviewLinks[q.concept] = { id: l.id, title: l.title };
  }
  return (
    <>
      <PageHeader
        icon={<span className="text-lg font-bold">{m.number}</span>}
        title={`Module ${m.number}: ${m.title}`}
        description={
          <>
            <span className="block text-sm font-medium text-primary">{stage.subtitle} · {stage.title}</span>
            {m.description}
          </>
        }
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-10">
          <section aria-labelledby="lessons">
            <h2 id="lessons" className="mb-3 flex items-center gap-2 text-xl font-bold"><BookOpen className="size-5 text-primary" /> Lessons</h2>
            <ModuleLessonList outline={outline} module={om} />
          </section>
          <section aria-labelledby="checkpoint-title" id="checkpoint" className="scroll-mt-24">
            <h2 id="checkpoint-title" className="mb-1 flex items-center gap-2 text-xl font-bold"><Flag className="size-5 text-primary" /> Module checkpoint</h2>
            <p className="mb-4 text-sm text-muted-foreground">A short assessment of the whole module. Score 70% or more to pass. Missed questions point you to the lesson to review.</p>
            {m.checkpoint.length ? <Quiz questions={m.checkpoint} kind="checkpoint" moduleNumber={m.number} reviewLinks={reviewLinks} /> : <p className="text-sm text-muted-foreground">This module has no checkpoint yet.</p>}
          </section>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="font-semibold">Topics covered</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {m.topics.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="flex items-center gap-2 font-semibold"><Dumbbell className="size-4 text-primary" /> Practice exercises</p>
            <ul className="mt-2 space-y-2 text-sm">
              {m.exercises.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-2">
                  <Link href={`/exercises/${e.id}`} className="hover:text-primary">{e.title}</Link>
                  <DifficultyBadge difficulty={e.difficulty} />
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
