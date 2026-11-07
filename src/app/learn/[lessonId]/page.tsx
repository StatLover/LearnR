import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allLessons, getLesson, modules, moduleOfLesson } from "@/content/curriculum";
import { glossary } from "@/content/glossary";
import { moduleOrder, worldOfModule } from "@/lib/game/worlds";
import { LessonPlayer } from "@/components/learn/lesson-player";

export function generateStaticParams() {
  return allLessons.map((l) => ({ lessonId: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }): Promise<Metadata> {
  const { lessonId } = await params;
  const l = getLesson(lessonId);
  return l ? { title: l.title, description: l.summary } : { title: "Lesson not found" };
}

/** Lessons in the order learners meet them on the map (world order). */
const ordered = [...modules].sort((a, b) => moduleOrder.indexOf(a.number) - moduleOrder.indexOf(b.number)).flatMap((m) => m.lessons);

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();
  const mod = moduleOfLesson(lesson.id)!;
  const world = worldOfModule(mod.number);
  const i = ordered.findIndex((l) => l.id === lesson.id);
  const prev = i > 0 ? ordered[i - 1] : undefined;
  const next = ordered[i + 1];
  const nextWorld = next ? worldOfModule(next.module) : undefined;
  const worldLessons = ordered.filter((l) => worldOfModule(l.module).id === world.id);
  const lessonNumber = `${world.number}.${worldLessons.findIndex((l) => l.id === lesson.id) + 1}`;
  const exercises = lesson.exerciseIds.map((id) => mod.exercises.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => Boolean(e));
  const terms = (lesson.glossary ?? [])
    .map((s) => glossary.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => ({ slug: g.slug, term: g.term }));

  return (
    <LessonPlayer
      lesson={lesson}
      exercises={exercises}
      module={{ number: mod.number, id: mod.id, title: mod.title }}
      world={world}
      lessonNumber={lessonNumber}
      prev={prev ? { id: prev.id, title: prev.title } : undefined}
      next={next ? { id: next.id, title: next.title, world: nextWorld ? { name: nextWorld.name, number: nextWorld.number, changed: nextWorld.id !== world.id } : undefined } : undefined}
      terms={terms}
    />
  );
}
