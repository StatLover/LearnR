import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { allExercises, getExercise, getLesson, getModule } from "@/content/curriculum";
import { ExercisePageClient } from "@/components/exercises/exercise-page-client";

export function generateStaticParams() {
  return allExercises.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getExercise((await params).id);
  return e ? { title: `${e.title} – exercise`, description: e.prompt.slice(0, 150) } : {};
}

export default async function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const ex = getExercise((await params).id);
  if (!ex) notFound();
  const mod = getModule(ex.module)!;
  const lesson = ex.lesson ? getLesson(ex.lesson) : undefined;
  const i = allExercises.findIndex((e) => e.id === ex.id);
  const prev = allExercises[i - 1];
  const next = allExercises[i + 1];
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link href="/exercises" className="hover:text-foreground">Exercises</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/learn/module/${mod.id}`} className="hover:text-foreground">Module {mod.number}: {mod.title}</Link>
        {lesson && (
          <>
            <span className="mx-1.5">/</span>
            <Link href={`/learn/${lesson.id}`} className="hover:text-foreground">{lesson.title}</Link>
          </>
        )}
      </nav>
      <h1 className="mb-4 text-2xl font-bold tracking-tight">{ex.title}</h1>
      <ExercisePageClient exercise={ex} lessonId={lesson?.id} lessonTitle={lesson?.title} />
      <nav aria-label="Exercise navigation" className="mt-6 flex justify-between gap-3">
        {prev ? <Link href={`/exercises/${prev.id}`} className="flex items-center gap-1 text-sm text-accent hover:underline"><ChevronLeft className="size-4" /> {prev.title}</Link> : <span />}
        {next && <Link href={`/exercises/${next.id}`} className="flex items-center gap-1 text-sm text-accent hover:underline">{next.title} <ChevronRight className="size-4" /></Link>}
      </nav>
    </div>
  );
}
