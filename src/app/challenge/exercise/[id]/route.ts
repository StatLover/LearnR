import { allExercises, getExercise } from "@/content/curriculum";

/**
 * Full data of one exercise (prompt, tests, hints, solution) for the daily
 * challenge page. Which exercise is today's challenge depends on the learner's
 * progress, which only the browser knows, so the page fetches it on demand
 * instead of shipping every exercise. Pre-rendered for every exercise.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return allExercises.map((e) => ({ id: e.id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const exercise = getExercise((await params).id);
  if (!exercise) return Response.json({ error: "Exercise not found" }, { status: 404 });
  return Response.json(exercise, { headers: { "Cache-Control": "public, max-age=3600" } });
}
