import type { Exercise, Lesson, Module, QuizQuestion, Stage } from "./types";
import { module01 } from "./modules/m01-introduction";
import { module02 } from "./modules/m02-fundamentals";
import { module03 } from "./modules/m03-working-with-data";
import { module04 } from "./modules/m04-programming-logic";
import { module05 } from "./modules/m05-data-manipulation";
import { module06 } from "./modules/m06-data-visualization";
import { module07 } from "./modules/m07-descriptive-statistics";
import { module08 } from "./modules/m08-intermediate-r";
import { module09 } from "./modules/m09-statistical-analysis";
import { module10 } from "./modules/m10-real-world-projects";

export const stages: Stage[] = [
  {
    number: 1,
    title: "Absolute Beginner",
    subtitle: "Stage 1",
    description: "No programming experience needed. Learn what R is, write your first code and understand the building blocks of every R program.",
  },
  {
    number: 2,
    title: "Developing Practical Skills",
    subtitle: "Stage 2",
    description: "Work with real datasets: import, clean and transform data, draw informative charts and describe data with statistics.",
  },
  {
    number: 3,
    title: "Intermediate R Programming",
    subtitle: "Stage 3",
    description: "Write more powerful code, run statistical tests, fit models and complete full data analysis projects.",
  },
];

export const modules: Module[] = [
  module01,
  module02,
  module03,
  module04,
  module05,
  module06,
  module07,
  module08,
  module09,
  module10,
];

/** All lessons in course order. */
export const allLessons: Lesson[] = modules.flatMap((m) => m.lessons);

export const allExercises: Exercise[] = modules.flatMap((m) => m.exercises);

export function getModule(idOrNumber: string | number): Module | undefined {
  return modules.find((m) => m.id === idOrNumber || m.number === Number(idOrNumber));
}

export function getLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export function getExercise(id: string): Exercise | undefined {
  return allExercises.find((e) => e.id === id);
}

export function lessonIndex(id: string): number {
  return allLessons.findIndex((l) => l.id === id);
}

export function nextLesson(id: string): Lesson | undefined {
  const i = lessonIndex(id);
  return i >= 0 ? allLessons[i + 1] : undefined;
}

export function previousLesson(id: string): Lesson | undefined {
  const i = lessonIndex(id);
  return i > 0 ? allLessons[i - 1] : undefined;
}

export function moduleOfLesson(id: string): Module | undefined {
  return modules.find((m) => m.lessons.some((l) => l.id === id));
}

/** Every quiz-style question in the course with where it lives. */
export function allQuestions(): { question: QuizQuestion; lessonId?: string; moduleNumber: number }[] {
  return modules.flatMap((m) => [
    ...m.lessons.flatMap((l) => [
      ...l.quiz.map((q) => ({ question: q, lessonId: l.id, moduleNumber: m.number })),
      ...l.sections.flatMap((s) =>
        s.blocks.flatMap((b) => (b.kind === "question" ? [{ question: b.question, lessonId: l.id, moduleNumber: m.number }] : [])),
      ),
    ]),
    ...m.checkpoint.map((q) => ({ question: q, moduleNumber: m.number })),
  ]);
}

/** Lessons that teach a given concept tag (used for "review this" suggestions). */
export function lessonsForConcept(concept: string): Lesson[] {
  return allLessons.filter((l) => l.concepts?.includes(concept));
}
