import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Target, Lightbulb, AlertOctagon, Dumbbell, HelpCircle, ListChecks, BookA } from "lucide-react";
import { allLessons, getLesson, moduleOfLesson, nextLesson, previousLesson, lessonsForConcept } from "@/content/curriculum";
import { glossary } from "@/content/glossary";
import { getOutline } from "@/content/outline";
import { LessonShell, BookmarkButton, CompleteButton, LessonNotes } from "@/components/learn/lesson-shell";
import { LessonBlock } from "@/components/learn/lesson-blocks";
import { LessonExercises } from "@/components/learn/lesson-exercises";
import { Quiz } from "@/components/learn/quiz";
import { Markdown } from "@/components/content/markdown";
import { StaticCode } from "@/components/code/static-code";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return allLessons.map((l) => ({ lessonId: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }): Promise<Metadata> {
  const { lessonId } = await params;
  const l = getLesson(lessonId);
  return l ? { title: l.title, description: l.summary } : { title: "Lesson not found" };
}

function SectionTitle({ id, icon, children }: { id: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-12 mb-4 flex scroll-mt-28 items-center gap-2 text-xl font-bold tracking-tight [&_svg]:size-5 [&_svg]:text-primary">
      {icon}
      {children}
    </h2>
  );
}

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();
  const mod = moduleOfLesson(lesson.id)!;
  const prev = previousLesson(lesson.id);
  const next = nextLesson(lesson.id);
  const exercises = lesson.exerciseIds.map((id) => mod.exercises.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => Boolean(e));
  const terms = (lesson.glossary ?? []).map((s) => glossary.find((g) => g.slug === s)).filter((g): g is NonNullable<typeof g> => Boolean(g));
  const reviewLinks: Record<string, { id: string; title: string }> = {};
  for (const q of lesson.quiz) if (q.concept) {
    const l = lessonsForConcept(q.concept)[0];
    if (l) reviewLinks[q.concept] = { id: l.id, title: l.title };
  }
  const indexInModule = mod.lessons.findIndex((l) => l.id === lesson.id);

  const toc = [
    ...lesson.sections.map((s) => ({ id: s.id, title: s.title })),
    { id: "common-mistakes", title: "Common mistakes" },
    { id: "practice", title: "Practice" },
    { id: "quiz", title: "Quiz" },
    { id: "summary", title: "Summary" },
  ];

  return (
    <LessonShell
      outline={getOutline()}
      prevId={prev?.id}
      lesson={{ id: lesson.id, title: lesson.title, playground: lesson.playground, moduleNumber: mod.number, moduleTitle: mod.title, minutes: lesson.minutes }}
    >
      <article className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/learn" className="hover:text-foreground">Learning path</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/learn/module/${mod.id}`} className="hover:text-foreground">Module {mod.number}: {mod.title}</Link>
        </nav>
        <header className="mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">Lesson {mod.number}.{indexInModule + 1}</Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="size-4" /> {lesson.minutes} min
            </span>
            <div className="ml-auto">
              <BookmarkButton id={`lesson:${lesson.id}`} title={lesson.title} href={`/learn/${lesson.id}`} />
            </div>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{lesson.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{lesson.summary}</p>
        </header>

        <section aria-labelledby="objectives" className="mt-6 rounded-xl border border-primary/30 bg-primary-soft/40 p-5">
          <h2 id="objectives" className="flex items-center gap-2 font-semibold">
            <Target className="size-5 text-primary" /> Learning objectives
          </h2>
          <p className="mt-2 font-medium">{lesson.objectives[0]}</p>
          {lesson.objectives.length > 1 && (
            <ul className="mt-2 space-y-1.5 text-sm">
              {lesson.objectives.slice(1).map((o) => (
                <li key={o} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {o}
                </li>
              ))}
            </ul>
          )}
        </section>

        <details className="mt-4 rounded-xl border border-border px-4 py-2 text-sm lg:hidden">
          <summary className="cursor-pointer py-1 font-medium">On this page</summary>
          <ul className="mt-1 space-y-1 pb-2">
            {toc.map((t) => <li key={t.id}><a className="text-accent hover:underline" href={`#${t.id}`}>{t.title}</a></li>)}
          </ul>
        </details>

        <SectionTitle id="big-picture" icon={<Lightbulb />}>The big picture</SectionTitle>
        <Markdown className="text-[1.04rem]">{lesson.intro}</Markdown>

        {lesson.sections.map((s) => (
          <section key={s.id} aria-labelledby={s.id}>
            <h2 id={s.id} className="mt-12 mb-3 scroll-mt-28 text-xl font-bold tracking-tight">{s.title}</h2>
            {s.blocks.map((b, i) => (
              <LessonBlock key={i} block={b} lesson={lesson} />
            ))}
          </section>
        ))}

        <SectionTitle id="common-mistakes" icon={<AlertOctagon />}>Common beginner mistakes</SectionTitle>
        <div className="space-y-4">
          {lesson.mistakes.map((m, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border">
              <p className="border-b border-border bg-surface px-4 py-2.5 font-semibold">{i + 1}. {m.title}</p>
              <div className="grid gap-0 md:grid-cols-2">
                <div className="border-b border-border md:border-b-0 md:border-r">
                  <p className="bg-danger-soft px-3 py-1 text-xs font-semibold text-danger">✗ Mistake</p>
                  <StaticCode code={m.wrong} />
                  {m.error && <pre className="code-static whitespace-pre-wrap border-t border-border bg-console px-4 py-2 text-xs text-danger">{m.error}</pre>}
                </div>
                <div>
                  <p className="bg-success-soft px-3 py-1 text-xs font-semibold text-success">✓ Correct</p>
                  <StaticCode code={m.right} />
                </div>
              </div>
              <div className="border-t border-border px-4 py-3 text-sm">
                <Markdown>{m.why}</Markdown>
              </div>
            </div>
          ))}
        </div>

        <SectionTitle id="practice" icon={<Dumbbell />}>Practice</SectionTitle>
        <p className="mb-4 text-muted-foreground">Write the code yourself, then press <strong>Run &amp; Test</strong>. The tests check your result – any correct solution passes.</p>
        <LessonExercises exercises={exercises} lessonId={lesson.id} />

        <SectionTitle id="quiz" icon={<HelpCircle />}>Quiz</SectionTitle>
        <Quiz questions={lesson.quiz} kind="lesson" lessonId={lesson.id} reviewLinks={reviewLinks} />

        <SectionTitle id="summary" icon={<ListChecks />}>Summary – key concepts</SectionTitle>
        <ul className="space-y-2 rounded-xl border border-border bg-card p-5">
          {lesson.keyPoints.map((k) => (
            <li key={k} className="flex gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
              <Markdown>{k}</Markdown>
            </li>
          ))}
        </ul>
        {terms.length > 0 && (
          <div className="mt-4 rounded-xl border border-border p-4 text-sm">
            <p className="mb-2 flex items-center gap-2 font-semibold">
              <BookA className="size-4 text-primary" /> New terms in this lesson
            </p>
            <div className="flex flex-wrap gap-1.5">
              {terms.map((t) => (
                <Link key={t.slug} href={`/glossary#${t.slug}`} className="rounded-full border border-border px-2.5 py-1 text-xs hover:border-primary hover:bg-primary-soft">
                  {t.term}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <CompleteButton lessonId={lesson.id} nextHref={next ? `/learn/${next.id}` : undefined} nextTitle={next?.title} />
          <LessonNotes lessonId={lesson.id} title={lesson.title} />
        </div>

        <nav aria-label="Lesson navigation" className="mt-8 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={`/learn/${prev.id}`} className="rounded-xl border border-border p-4 hover:bg-surface">
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><ChevronLeft className="size-3.5" /> Previous</span>
              <span className="mt-1 block font-medium">{prev.title}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={`/learn/${next.id}`} className="rounded-xl border border-border p-4 text-right hover:bg-surface">
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">Next <ChevronRight className="size-3.5" /></span>
              <span className="mt-1 block font-medium">{next.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </LessonShell>
  );
}
