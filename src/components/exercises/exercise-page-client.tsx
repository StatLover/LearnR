"use client";

import Link from "next/link";
import type { Exercise } from "@/content/types";
import { ExerciseCard } from "@/components/learn/exercise-card";
import { TutorChat } from "@/components/tutor/tutor-chat";
import { Card } from "@/components/ui/card";
import { tutor } from "@/lib/ai/tutor-store";
import { useProgress } from "@/lib/store/progress";

export function ExercisePageClient({ exercise, lessonId, lessonTitle }: { exercise: Exercise; lessonId?: string; lessonTitle?: string }) {
  const s = useProgress();
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <ExerciseCard
          task={exercise}
          onAskTutor={(code) => void tutor.send(`I'm working on the exercise "${exercise.title}". Please give me a hint, not the solution.\n\nMy attempt:\n\`\`\`r\n${code}\n\`\`\``, { lessonId, exerciseId: exercise.id })}
        />
        {lessonId && (
          <p className="mt-3 text-sm text-muted-foreground">
            Need a refresher? This exercise practises the lesson <Link href={`/learn/${lessonId}`} className="text-accent underline">{lessonTitle}</Link>.
          </p>
        )}
      </div>
      <Card className="flex h-[70vh] min-h-[480px] flex-col overflow-hidden lg:sticky lg:top-20">
        <TutorChat compact exerciseId={exercise.id} lessonId={lessonId} lessonTitle={lessonTitle} getCode={() => ({ code: s.exercises[exercise.id]?.code ?? exercise.starterCode, output: null })} />
      </Card>
    </div>
  );
}
