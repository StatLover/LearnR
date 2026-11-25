"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, CircleDashed } from "lucide-react";
import type { Exercise } from "@/content/types";
import { ExerciseCard } from "@/components/learn/exercise-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <ExerciseCard task={exercise} />
      {lessonId && (
        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          {lessonThumb && <div className="hidden w-24 shrink-0 overflow-hidden rounded-2xl border border-border sm:block [&_svg]:block">{lessonThumb}</div>}
          <div className="min-w-0 flex-1 basis-48">
            <p className="flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wider text-primary">
              <BookOpen className="size-4" aria-hidden /> Need a refresher?
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
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
  );
}
