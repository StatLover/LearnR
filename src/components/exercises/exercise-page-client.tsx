"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, CircleDashed } from "lucide-react";
import type { Exercise } from "@/content/types";
import { ExerciseCard } from "@/components/learn/exercise-card";
import { TutorChat } from "@/components/tutor/tutor-chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tutor } from "@/lib/ai/tutor-store";
import { useProgress } from "@/lib/store/progress";

/** "Solved" / "Not solved yet" chip for the exercise hero. */
export function ExerciseStatus({ id }: { id: string }) {
  const e = useProgress().exercises[id];
  if (e?.passedAt)
    return (
      <Badge variant="success">
        <CheckCircle2 /> Solved
      </Badge>
    );
  return (
    <Badge variant="outline">
      <CircleDashed /> {e?.attempts ? `Not solved yet · ${e.attempts} ${e.attempts === 1 ? "try" : "tries"}` : "Not solved yet"}
    </Badge>
  );
}

export function ExercisePageClient({ exercise, lessonId, lessonTitle, lessonThumb }: { exercise: Exercise; lessonId?: string; lessonTitle?: string; lessonThumb?: ReactNode }) {
  const s = useProgress();
  const askTutor = (code: string) => {
    void tutor.send(`I'm working on the exercise "${exercise.title}". Please give me a hint, not the solution.\n\nMy attempt:\n\`\`\`r\n${code}\n\`\`\``, { lessonId, exerciseId: exercise.id });
    // On phones and tablets the tutor sits below the exercise – bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) document.getElementById("tutor-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="min-w-0 space-y-5">
        <ExerciseCard task={exercise} onAskTutor={askTutor} />
        {lessonId && (
          <div className="flex flex-wrap items-center gap-4 rounded-3xl border-2 border-border bg-card p-4 shadow-[var(--shadow-card)]">
            {lessonThumb && <div className="hidden w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-border sm:block [&_svg]:block">{lessonThumb}</div>}
            <div className="min-w-0 flex-1 basis-48">
              <p className="flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wider text-primary">
                <BookOpen className="size-4" aria-hidden /> Need a refresher?
              </p>
              <p className="mt-0.5 text-sm font-semibold text-muted-foreground">
                This exercise practises the lesson <strong className="text-foreground">{lessonTitle}</strong>.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/learn/${lessonId}`}>
                Review the lesson <ArrowRight />
              </Link>
            </Button>
          </div>
        )}
      </div>
      <aside id="tutor-panel" aria-label="AI tutor" className="scroll-mt-24 lg:sticky lg:top-20 lg:self-start">
        <div className="flex h-[70vh] min-h-[480px] flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] lg:h-[calc(100vh-7rem)] lg:max-h-[860px]">
          <TutorChat compact exerciseId={exercise.id} lessonId={lessonId} lessonTitle={lessonTitle} getCode={() => ({ code: s.exercises[exercise.id]?.code ?? exercise.starterCode, output: null })} />
        </div>
      </aside>
    </div>
  );
}
