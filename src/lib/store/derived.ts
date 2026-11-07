/**
 * Pure helpers derived from progress and the course outline. This module has
 * no client-only imports, so server components (and the XP / badge logic) can
 * use it; the progress store re-exports everything for convenience.
 */
import type { ProgressState } from "./progress";
import { todayKey } from "../utils";
import { moduleOrder } from "../game/worlds";

export interface OutlineLesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  module: number;
  concepts: string[];
  exerciseIds: string[];
}
export interface OutlineModule {
  number: number;
  id: string;
  stage: number;
  title: string;
  description: string;
  topics: string[];
  lessons: OutlineLesson[];
  exercises: { id: string; title: string; difficulty: string }[];
  checkpointSize: number;
}
export interface Outline {
  modules: OutlineModule[];
  projects: { id: string; title: string; stepIds: string[]; level: string }[];
}

/** All lessons in learning order (world order: modules 1–7, 9, 8, 10). */
export function allOutlineLessons(o: Outline) {
  return [...o.modules].sort((a, b) => moduleOrder.indexOf(a.number) - moduleOrder.indexOf(b.number)).flatMap((m) => m.lessons);
}

export function currentStreak(days: string[], today = todayKey()): number {
  if (!days.length) return 0;
  const set = new Set(days);
  const d = new Date(today + "T12:00:00");
  // The streak is still alive if the learner was active yesterday but not yet today.
  if (!set.has(todayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(todayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function longestStreak(days: string[]): number {
  const sorted = [...new Set(days)].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of sorted) {
    const d = new Date(k + "T12:00:00");
    run = prev && Math.round((d.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export function isLessonUnlocked(o: Outline, s: ProgressState, lessonId: string, mode: "guided" | "free"): boolean {
  if (mode === "free") return true;
  const lessons = allOutlineLessons(o);
  const i = lessons.findIndex((l) => l.id === lessonId);
  if (i <= 0) return true;
  const lp = s.lessons[lessonId];
  if (lp?.unlocked || lp?.completedAt) return true;
  if (s.profile.programming === "experienced") return true;
  return Boolean(s.lessons[lessons[i - 1].id]?.completedAt);
}

export function suggestedNextLesson(o: Outline, s: ProgressState): OutlineLesson | undefined {
  const lessons = allOutlineLessons(o);
  return lessons.find((l) => !s.lessons[l.id]?.completedAt) ?? undefined;
}

export function courseCompletion(o: Outline, s: ProgressState) {
  const lessons = allOutlineLessons(o);
  const done = lessons.filter((l) => s.lessons[l.id]?.completedAt).length;
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}

export function moduleCompletion(m: OutlineModule, s: ProgressState) {
  const done = m.lessons.filter((l) => s.lessons[l.id]?.completedAt).length;
  return { done, total: m.lessons.length, pct: m.lessons.length ? Math.round((done / m.lessons.length) * 100) : 0 };
}

/** Concepts the learner is struggling with (≥ 2 wrong first attempts and ≥ 40% wrong). */
export function weakConcepts(s: ProgressState): { concept: string; wrong: number; right: number }[] {
  return Object.entries(s.concepts)
    .filter(([, v]) => v.wrong >= 2 && v.wrong / (v.wrong + v.right) >= 0.4)
    .map(([concept, v]) => ({ concept, ...v }))
    .sort((a, b) => b.wrong - a.wrong);
}

