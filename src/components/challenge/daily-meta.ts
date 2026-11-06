import type { Outline } from "@/lib/store/progress";
import { LESSON_ART, worldOfModule, type TopicKind, type World } from "@/lib/game/worlds";
import type { Difficulty } from "@/content/types";

export interface ExerciseMeta {
  id: string;
  title: string;
  difficulty: Difficulty;
  module: number;
  moduleTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  world: World;
  art: TopicKind;
}

/** Look up an exercise in the lightweight course outline (titles, world, illustration). */
export function exerciseMeta(o: Outline, id: string): ExerciseMeta | null {
  for (const m of o.modules) {
    const e = m.exercises.find((x) => x.id === id);
    if (!e) continue;
    const lesson = m.lessons.find((l) => l.exerciseIds.includes(id));
    const world = worldOfModule(m.number);
    return {
      id,
      title: e.title,
      difficulty: (["easy", "medium", "challenge"].includes(e.difficulty) ? e.difficulty : "easy") as Difficulty,
      module: m.number,
      moduleTitle: m.title,
      lessonId: lesson?.id,
      lessonTitle: lesson?.title,
      world,
      art: (lesson && LESSON_ART[lesson.id]) ?? world.art,
    };
  }
  return null;
}

/** Format a YYYY-MM-DD day key in the visitor's locale. */
export function formatDay(day: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) {
  return new Date(`${day}T12:00:00`).toLocaleDateString(undefined, opts);
}
