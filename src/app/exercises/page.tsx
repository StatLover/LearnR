import type { Metadata } from "next";
import { Dumbbell } from "lucide-react";
import { modules, getLesson } from "@/content/curriculum";
import { PageHeader } from "@/components/layout/page-header";
import { Hexy } from "@/components/brand/mascot";
import { TopicArt } from "@/components/brand/topic-art";
import { ExerciseBrowser, type ExerciseSummary } from "@/components/exercises/exercise-browser";
import { PracticeStats } from "@/components/exercises/practice-stats";
import { DailyBanner } from "@/components/challenge/daily-banner";
import { LESSON_ART, moduleOrder, worldOfModule } from "@/lib/game/worlds";
import { exerciseXp } from "@/lib/game/xp";

export const metadata: Metadata = {
  title: "Practice – exercises and daily challenge",
  description: "Practise R with automatically tested exercises across seven worlds at three levels – easy, medium and challenge – plus a new daily challenge every day.",
};

export default function ExercisesPage() {
  const ordered = [...modules].sort((a, b) => moduleOrder.indexOf(a.number) - moduleOrder.indexOf(b.number));
  const list: ExerciseSummary[] = ordered.flatMap((m) =>
    m.exercises.map((e) => {
      const world = worldOfModule(m.number);
      return {
        id: e.id,
        title: e.title,
        difficulty: e.difficulty,
        module: m.number,
        moduleTitle: m.title,
        lessonTitle: e.lesson ? getLesson(e.lesson)?.title : undefined,
        prompt: e.prompt.slice(0, 220),
        world: world.id,
        thumb: <TopicArt kind={(e.lesson && LESSON_ART[e.lesson]) || world.art} bg={world.color.soft} />,
        xp: exerciseXp(e.difficulty),
      };
    }),
  );
  return (
    <>
      <PageHeader
        icon={<Dumbbell />}
        color="grape"
        eyebrow="Practice arena"
        title="Practice makes progress"
        description={`${list.length} hands-on R exercises across seven worlds. Write real code, press Check, and R tests your answer instantly – any correct solution passes. Hints, solutions and explanations are always one click away.`}
        art={<Hexy mood="cool" size={124} animate />}
      />
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
        <DailyBanner />
        <PracticeStats exercises={list.map((e) => ({ id: e.id, difficulty: e.difficulty }))} />
        <ExerciseBrowser exercises={list} />
      </div>
    </>
  );
}
