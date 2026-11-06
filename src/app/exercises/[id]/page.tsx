import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight, LayoutGrid } from "lucide-react";
import type { Exercise } from "@/content/types";
import { allExercises, getExercise, getLesson, getModule } from "@/content/curriculum";
import { TopicArt } from "@/components/brand/topic-art";
import { ExercisePageClient, ExerciseStatus } from "@/components/exercises/exercise-page-client";
import { BookmarkToggle } from "@/components/exercises/bookmark-toggle";
import { WorldChip } from "@/components/exercises/world-chip";
import { Button } from "@/components/ui/button";
import { DifficultyBadge, XpBadge } from "@/components/ui/badge";
import { LESSON_ART, moduleOrder, worldOfModule } from "@/lib/game/worlds";
import { exerciseXp } from "@/lib/game/xp";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return allExercises.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getExercise((await params).id);
  return e ? { title: `${e.title} – exercise`, description: e.prompt.slice(0, 150) } : {};
}

/** Exercises in the order of the learning worlds (the same order as the practice hub). */
const ordered = [...allExercises].sort((a, b) => moduleOrder.indexOf(a.module) - moduleOrder.indexOf(b.module));

const artFor = (e: Exercise) => (e.lesson && LESSON_ART[e.lesson]) || worldOfModule(e.module).art;

function NeighbourCard({ ex, dir }: { ex: Exercise; dir: "prev" | "next" }) {
  const w = worldOfModule(ex.module);
  return (
    <Link
      href={`/exercises/${ex.id}`}
      rel={dir}
      className={cn("group lift flex items-center gap-4 rounded-3xl border-2 border-border bg-card p-3 pr-5 shadow-[var(--shadow-card)]", dir === "next" && "flex-row-reverse pl-5 pr-3 text-right")}
    >
      <div className="w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-border sm:w-28 [&_svg]:block">
        <TopicArt kind={artFor(ex)} bg={w.color.soft} />
      </div>
      <div className={cn("min-w-0 flex-1", dir === "next" && "flex flex-col items-end")}>
        <p className="flex items-center gap-1 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {dir === "prev" ? (
            <>
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden /> Previous
            </>
          ) : (
            <>
              Next up <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </>
          )}
        </p>
        <p className="mt-0.5 line-clamp-2 font-display text-lg font-semibold leading-snug group-hover:text-primary">{ex.title}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <DifficultyBadge difficulty={ex.difficulty} />
        </div>
      </div>
    </Link>
  );
}

export default async function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const ex = getExercise((await params).id);
  if (!ex) notFound();
  const mod = getModule(ex.module)!;
  const lesson = ex.lesson ? getLesson(ex.lesson) : undefined;
  const world = worldOfModule(mod.number);
  const i = ordered.findIndex((e) => e.id === ex.id);
  const prev = ordered[i - 1];
  const next = ordered[i + 1];
  const thumb = <TopicArt kind={artFor(ex)} bg={world.color.soft} />;

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm font-bold text-muted-foreground">
          <li>
            <Link href="/exercises" className="hover:text-primary">
              Practice
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-4" />
          </li>
          <li>
            <Link href={`/learn/module/${mod.id}`} className="hover:text-primary">
              Module {mod.number}: {mod.title}
            </Link>
          </li>
          {lesson && (
            <>
              <li aria-hidden className="hidden sm:block">
                <ChevronRight className="size-4" />
              </li>
              <li className="hidden sm:block">
                <Link href={`/learn/${lesson.id}`} className="hover:text-primary">
                  {lesson.title}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden>
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="text-foreground">
            {ex.title}
          </li>
        </ol>
      </nav>

      <header
        className="relative mb-6 overflow-hidden rounded-3xl border-2 border-border shadow-[var(--shadow-card)]"
        style={{ background: `linear-gradient(115deg, ${world.color.soft} 0%, var(--card) 78%)` }}
      >
        <div className="blob -left-12 -top-20 size-56" style={{ background: world.color.main }} />
        <div className="relative flex items-center gap-6 p-5 sm:p-6">
          <div className="min-w-0 flex-1">
            <WorldChip world={world} />
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{ex.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={ex.difficulty} />
              <XpBadge xp={exerciseXp(ex.difficulty)} />
              <ExerciseStatus id={ex.id} />
              <span className="ml-auto sm:ml-1">
                <BookmarkToggle id={`exercise:${ex.id}`} kind="exercise" title={ex.title} href={`/exercises/${ex.id}`} />
              </span>
            </div>
          </div>
          <div className="hidden w-48 shrink-0 rotate-2 overflow-hidden rounded-2xl border-2 border-border shadow-[var(--shadow-card)] sm:block md:w-56 [&_svg]:block">{thumb}</div>
        </div>
      </header>

      <ExercisePageClient exercise={ex} lessonId={lesson?.id} lessonTitle={lesson?.title} lessonThumb={lesson ? thumb : undefined} />

      <nav aria-label="More exercises" className="mt-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {prev ? <NeighbourCard ex={prev} dir="prev" /> : <span className="hidden sm:block" />}
          {next && <NeighbourCard ex={next} dir="next" />}
        </div>
        <div className="mt-5 flex justify-center">
          <Button asChild variant="ghost">
            <Link href="/exercises">
              <LayoutGrid /> All exercises
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
}
