/**
 * A lightweight outline of the course (no lesson bodies) that server
 * components pass to client components such as the dashboard, so the full
 * course content never has to be shipped to the browser just to show progress.
 */
import "server-only";
import { modules } from "./curriculum";
import { projects } from "./projects";
import type { Outline } from "@/lib/store/progress";

let cached: Outline | null = null;

export function getOutline(): Outline {
  if (cached) return cached;
  cached = {
    modules: modules.map((m) => ({
      number: m.number,
      id: m.id,
      stage: m.stage,
      title: m.title,
      description: m.description,
      topics: m.topics,
      checkpointSize: m.checkpoint.length,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        summary: l.summary,
        minutes: l.minutes,
        module: m.number,
        concepts: l.concepts ?? [],
        exerciseIds: l.exerciseIds,
      })),
      exercises: m.exercises.map((e) => ({ id: e.id, title: e.title, difficulty: e.difficulty })),
    })),
    projects: projects.map((p) => ({ id: p.id, title: p.title, level: p.level, stepIds: p.steps.map((s) => s.id) })),
  };
  return cached;
}
