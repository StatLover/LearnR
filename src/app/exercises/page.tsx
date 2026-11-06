import type { Metadata } from "next";
import { Dumbbell } from "lucide-react";
import { modules, getLesson } from "@/content/curriculum";
import { PageHeader } from "@/components/layout/page-header";
import { ExerciseBrowser, type ExerciseSummary } from "@/components/exercises/exercise-browser";

export const metadata: Metadata = { title: "Exercises and Challenges", description: "Practise R with automatically tested exercises at three levels: easy, medium and challenge." };

export default function ExercisesPage() {
  const list: ExerciseSummary[] = modules.flatMap((m) =>
    m.exercises.map((e) => ({ id: e.id, title: e.title, difficulty: e.difficulty, module: m.number, moduleTitle: m.title, lessonTitle: e.lesson ? getLesson(e.lesson)?.title : undefined, prompt: e.prompt.slice(0, 220) })),
  );
  return (
    <>
      <PageHeader
        icon={<Dumbbell />}
        title="Exercises and Challenges"
        description="Write real R code and get instant feedback. Each exercise has automated tests that check your result (so any correct solution passes), progressive hints, a full solution and an explanation. Easy exercises reinforce syntax, medium ones ask you to apply ideas on your own, and challenges are practical problems."
      />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ExerciseBrowser exercises={list} />
      </div>
    </>
  );
}
