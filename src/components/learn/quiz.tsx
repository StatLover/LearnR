"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, RotateCcw, Target } from "lucide-react";
import type { QuizQuestion } from "@/content/types";
import { QuestionCard } from "./question-card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { progress, useProgress } from "@/lib/store/progress";

export interface QuizProps {
  questions: QuizQuestion[];
  /** Lesson quiz or module checkpoint. */
  kind: "lesson" | "checkpoint";
  lessonId?: string;
  moduleNumber?: number;
  /** concept -> lesson to review */
  reviewLinks?: Record<string, { id: string; title: string }>;
  onComplete?: (score: number) => void;
}

export function Quiz({ questions, kind, lessonId, moduleNumber, reviewLinks = {}, onComplete }: QuizProps) {
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const state = useProgress();
  const answered = Object.keys(results).length;
  const done = answered === questions.length;
  const score = done ? questions.filter((q) => results[q.id]).length / questions.length : 0;
  const best = kind === "lesson" && lessonId ? state.lessons[lessonId]?.quizBest : moduleNumber !== undefined ? state.checkpoints[String(moduleNumber)]?.best : undefined;

  const onAnswered = (id: string, ok: boolean) => {
    setResults((r) => {
      if (id in r) return r;
      const next = { ...r, [id]: ok };
      if (Object.keys(next).length === questions.length) {
        const s = questions.filter((q) => next[q.id]).length / questions.length;
        if (kind === "lesson" && lessonId) progress.recordQuiz(lessonId, s);
        if (kind === "checkpoint" && moduleNumber !== undefined) progress.recordCheckpoint(moduleNumber, s);
        onComplete?.(s);
      }
      return next;
    });
  };

  const missedConcepts = [...new Set(questions.filter((q) => results[q.id] === false && q.concept).map((q) => q.concept!))];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Target className="size-4 text-primary" />
        <span>
          {answered} of {questions.length} answered
        </span>
        <ProgressBar value={(answered / questions.length) * 100} className="max-w-48" label="Quiz progress" />
        {best !== undefined && <span className="text-muted-foreground">Best score: {Math.round(best * 100)}%</span>}
      </div>
      {questions.map((q, i) => (
        <QuestionCard key={`${round}-${q.id}`} question={q} index={i} onAnswered={(ok) => onAnswered(q.id, ok)} />
      ))}
      {done && (
        <div role="status" className="rounded-xl border border-border bg-surface p-5">
          <p className="flex items-center gap-2 text-lg font-semibold">
            <Award className="size-5 text-primary" /> You scored {Math.round(score * 100)}% ({questions.filter((q) => results[q.id]).length}/{questions.length})
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {score === 1
              ? "Perfect! You have a solid grasp of this material."
              : score >= 0.7
                ? kind === "checkpoint"
                  ? "Checkpoint passed – nice work. Review the explanations for the questions you missed."
                  : "Good work! Read the explanations for any questions you missed."
                : "Keep going – mistakes are how everyone learns. Re-read the parts below, then try again."}
          </p>
          {missedConcepts.length > 0 && (
            <div className="mt-3 text-sm">
              <p className="font-medium">Worth reviewing:</p>
              <ul className="mt-1 list-disc pl-5">
                {missedConcepts.map((c) => (
                  <li key={c}>
                    {reviewLinks[c] ? (
                      <Link className="text-accent underline" href={`/learn/${reviewLinks[c].id}`}>
                        {reviewLinks[c].title}
                      </Link>
                    ) : (
                      c.replace(/-/g, " ")
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setResults({});
              setRound((r) => r + 1);
            }}
          >
            <RotateCcw /> Retake {kind === "checkpoint" ? "checkpoint" : "quiz"}
          </Button>
        </div>
      )}
    </div>
  );
}
