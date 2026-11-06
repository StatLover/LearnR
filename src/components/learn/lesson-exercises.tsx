"use client";

import type { Exercise } from "@/content/types";
import { ExerciseCard } from "./exercise-card";
import { tutor } from "@/lib/ai/tutor-store";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function LessonExercises({ exercises, lessonId }: { exercises: Exercise[]; lessonId: string }) {
  return (
    <div className="space-y-5">
      {exercises.map((e) => (
        <ExerciseCard
          key={e.id}
          task={e}
          onAskTutor={(code) => {
            window.dispatchEvent(new CustomEvent("ra:open-tutor"));
            void tutor.send(`I'm working on the exercise "${e.title}". Please give me a hint, not the solution.\n\nMy attempt:\n\`\`\`r\n${code}\n\`\`\``, { lessonId, exerciseId: e.id });
          }}
          headerExtra={
            <Link href={`/exercises/${e.id}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              Open on its own page <ExternalLink className="size-3" />
            </Link>
          }
        />
      ))}
    </div>
  );
}
