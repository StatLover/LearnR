"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, CheckCircle2, Flag, Map as MapIcon, RotateCcw, Star, Target, X, XCircle, Zap } from "lucide-react";
import type { QuizQuestion } from "@/content/types";
import { QuestionCard } from "./question-card";
import { Hexy } from "@/components/brand/mascot";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress";
import { fireConfetti } from "@/components/game/confetti";
import { progress, useProgress } from "@/lib/store/progress";
import { XP } from "@/lib/game/xp";
import { cn } from "@/lib/utils";

export interface QuizProps {
  questions: QuizQuestion[];
  /** Lesson quiz or module checkpoint. */
  kind: "lesson" | "checkpoint";
  lessonId?: string;
  moduleNumber?: number;
  /** concept -> lesson to review */
  reviewLinks?: Record<string, { id: string; title: string }>;
  onComplete?: (score: number) => void;
  /** Accent colour (a CSS colour such as a world colour) for the progress bar. */
  color?: string;
}

const PASS = 0.7;

/** Plain one-line text of a markdown prompt (for the results recap). */
const plain = (md: string) =>
  md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

type Phase = "intro" | "play" | "results";

/**
 * A game-style quiz: one question at a time with a progress bar, a running
 * score and a results screen. Used for lesson quizzes and module checkpoints.
 */
export function Quiz({ questions, kind, lessonId, moduleNumber, reviewLinks = {}, onComplete, color = "var(--primary)" }: QuizProps) {
  const [phase, setPhase] = useState<Phase>(kind === "checkpoint" ? "intro" : "play");
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [startedAt, setStartedAt] = useState(0);
  const state = useProgress();
  const rootRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);

  const total = questions.length;
  const q = questions[Math.min(index, total - 1)];
  const answered = Object.keys(results).length;
  const correct = questions.filter((x) => results[x.id]).length;
  const score = total ? correct / total : 0;
  const pct = Math.round(score * 100);
  const passed = score >= PASS;
  const currentAnswered = q ? q.id in results : false;
  const isLast = index >= total - 1;
  const best = kind === "lesson" && lessonId ? state.lessons[lessonId]?.quizBest : moduleNumber !== undefined ? state.checkpoints[String(moduleNumber)]?.best : undefined;
  const cp = moduleNumber !== undefined ? state.checkpoints[String(moduleNumber)] : undefined;
  const newlyPassed = kind === "checkpoint" && Boolean(cp?.passedAt && startedAt && cp.passedAt >= startedAt);
  const label = kind === "checkpoint" ? "checkpoint" : "quiz";

  // Move keyboard focus to "Continue" once a question has been answered.
  useEffect(() => {
    if (!currentAnswered) return;
    continueRef.current?.focus({ preventScroll: true });
  }, [currentAnswered]);

  const bringIntoView = () => {
    const el = rootRef.current;
    if (el && el.getBoundingClientRect().top < 72) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const start = () => {
    setResults({});
    setIndex(0);
    setRound((r) => r + 1);
    setStartedAt(Date.now());
    setPhase("play");
    requestAnimationFrame(() => questionRef.current?.focus({ preventScroll: true }));
  };

  const onAnswered = (id: string, ok: boolean) => {
    // Only the first answer to each question counts towards the score.
    if (id in results) return;
    const next = { ...results, [id]: ok };
    setResults(next);
    if (Object.keys(next).length === total) {
      const s = questions.filter((x) => next[x.id]).length / total;
      if (kind === "lesson" && lessonId) progress.recordQuiz(lessonId, s);
      if (kind === "checkpoint" && moduleNumber !== undefined) progress.recordCheckpoint(moduleNumber, s);
      onComplete?.(s);
    }
  };

  const advance = () => {
    if (!isLast) {
      setIndex((i) => i + 1);
      requestAnimationFrame(() => {
        questionRef.current?.focus({ preventScroll: true });
        bringIntoView();
      });
      return;
    }
    setPhase("results");
    if (passed) setTimeout(() => fireConfetti({ y: 0.4, count: score === 1 ? 180 : 130 }), 250);
    requestAnimationFrame(bringIntoView);
  };

  if (!total) return <p className="text-sm text-muted-foreground">This {label} has no questions yet.</p>;

  const missedConcepts = [...new Set(questions.filter((x) => results[x.id] === false && x.concept).map((x) => x.concept!))];
  // Several concepts can point to the same lesson: list each lesson once.
  const reviewLessons = [...new Map(missedConcepts.filter((c) => reviewLinks[c]).map((c) => [reviewLinks[c].id, reviewLinks[c]])).values()];
  const otherConcepts = missedConcepts.filter((c) => !reviewLinks[c]);

  return (
    <div ref={rootRef} className="scroll-mt-24 overflow-clip rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
      {/* ---------------------------- intro ---------------------------- */}
      {phase === "intro" && (
        <div className="relative flex flex-col items-center px-5 py-8 text-center sm:px-8 sm:py-10">
          <Hexy mood={cp?.passedAt ? "cool" : "think"} size={110} animate />
          <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{cp?.passedAt ? "Checkpoint cleared – go again?" : "Ready for the checkpoint?"}</h3>
          <p className="mt-2 max-w-lg text-[15px] font-semibold text-muted-foreground">
            {total} questions about the whole module, one at a time. Score {Math.round(PASS * 100)}% or more to pass. If you miss something, you will get a link to the lesson to review.
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2 text-sm font-bold">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1">
              <Target className="size-4 text-primary" aria-hidden /> {total} questions
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1">
              <Flag className="size-4 text-success" aria-hidden /> Pass at {Math.round(PASS * 100)}%
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-sun-soft px-3 py-1 text-warning">
              <Zap className="size-4 fill-current" aria-hidden /> {cp?.passedAt ? "Bonus already won" : `+${XP.checkpoint} XP for passing`}
            </li>
          </ul>
          {best !== undefined && (
            <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
              <Star className="size-4 fill-sun text-sun" aria-hidden /> Your best: {Math.round(best * 100)}%{cp?.passedAt ? " · passed" : ""}
            </p>
          )}
          <Button size="xl" className="mt-6" onClick={start}>
            {cp?.attempts ? "Retake the checkpoint" : "Start the checkpoint"} <ArrowRight />
          </Button>
        </div>
      )}

      {/* ---------------------------- play ----------------------------- */}
      {phase === "play" && (
        <>
          <div className="flex items-center gap-3 border-b-2 border-border bg-surface-2/60 px-4 py-3 sm:px-5">
            <span className="shrink-0 font-display text-sm font-semibold tabular-nums">
              <span className="sr-only">Question </span>
              {index + 1}
              <span className="text-muted-foreground">/{total}</span>
            </span>
            <div
              role="progressbar"
              aria-label={`${label[0].toUpperCase()}${label.slice(1)} progress`}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={answered}
              aria-valuetext={`${answered} of ${total} answered`}
              className="flex min-w-0 flex-1 gap-1"
            >
              {questions.map((x, i) => {
                const r = results[x.id];
                return (
                  <span
                    key={x.id}
                    className={cn("h-3 flex-1 rounded-full transition-colors duration-300", r === true ? "bg-mint" : r === false ? "bg-coral" : i === index ? "" : "bg-surface-3")}
                    style={r === undefined && i === index ? { background: `color-mix(in srgb, ${color} 45%, var(--surface-3))` } : undefined}
                  />
                );
              })}
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-mint-soft px-2.5 py-0.5 font-display text-sm font-semibold text-success tabular-nums" aria-label={`Score: ${correct} correct`}>
              <Check className="size-4" strokeWidth={3} aria-hidden /> {correct}
            </span>
          </div>

          <div ref={questionRef} tabIndex={-1} key={`${round}-${q.id}`} className="p-4 outline-none animate-fade-up sm:p-6" aria-label={`Question ${index + 1} of ${total}`} role="group">
            <QuestionCard question={q} bare onAnswered={(ok) => onAnswered(q.id, ok)} />
          </div>

          {/* Once answered, the Continue bar sticks to the bottom of the screen (above the phone tab bar). */}
          <div
            className={cn(
              "z-10 flex flex-wrap items-center justify-between gap-3 border-t-2 px-4 py-3 transition-colors sm:px-6",
              currentAnswered ? "sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] lg:bottom-0" : "",
              currentAnswered ? (results[q.id] ? "border-mint/50 bg-mint-soft" : "border-coral/50 bg-coral-soft") : "border-border bg-surface-2",
            )}
          >
            <p className="text-sm font-bold text-muted-foreground">
              {currentAnswered
                ? results[q.id]
                  ? "Correct – that counts towards your score."
                  : "Not this time – the explanation above shows why. Your first answer is what counts."
                : best !== undefined
                  ? `Best score so far: ${Math.round(best * 100)}%`
                  : "Pick an answer, then press Check."}
            </p>
            {currentAnswered && (
              <Button ref={continueRef} size="lg" variant={results[q.id] ? "success" : "primary"} onClick={advance} className="animate-pop-in max-sm:w-full">
                {isLast ? "See results" : "Continue"} <ArrowRight />
              </Button>
            )}
          </div>
        </>
      )}

      {/* --------------------------- results --------------------------- */}
      {phase === "results" && (
        <div role="status" className="px-5 py-8 sm:px-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="relative shrink-0">
              <ProgressRing value={pct} size={148} stroke={14} color={passed ? "var(--mint)" : "var(--sun)"} label={`Score: ${pct}%`}>
                <span className="block text-[34px] leading-none">{pct}%</span>
              </ProgressRing>
              <Hexy mood={passed ? "celebrate" : "think"} size={58} className="absolute -bottom-3 -right-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn("font-display text-sm font-semibold uppercase tracking-wider", passed ? "text-success" : "text-warning")}>
                {kind === "checkpoint" ? (passed ? "Checkpoint passed" : "Not passed yet") : score === 1 ? "Perfect score" : "Quiz complete"}
              </p>
              <h3 className="mt-0.5 font-display text-3xl font-bold leading-tight">
                {score === 1 ? "Flawless – every answer right!" : passed ? "Great work!" : score >= 0.5 ? `So close – ${Math.round(PASS * 100)}% passes` : "Not quite yet – keep going!"}
              </h3>
              <p className="mt-1.5 text-[15px] font-semibold text-muted-foreground">
                You got <strong className="text-foreground">{correct}</strong> of {total} right.{" "}
                {passed
                  ? kind === "checkpoint"
                    ? "You have shown you understand this module."
                    : "Read the explanations for anything you missed."
                  : "Mistakes are how everyone learns – review the lessons below, then try again."}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm font-bold sm:justify-start">
                {newlyPassed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sun-soft px-3 py-1 text-warning">
                    <Zap className="size-4 fill-current" aria-hidden /> +{XP.checkpoint} XP checkpoint bonus
                  </span>
                )}
                {best !== undefined && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-muted-foreground">
                    <Star className="size-4 fill-sun text-sun" aria-hidden /> Best: {Math.round(best * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <ol className="mt-7 grid gap-2 sm:grid-cols-2" aria-label="Your answers">
            {questions.map((x, i) => {
              const ok = results[x.id];
              return (
                <li key={x.id} className={cn("flex items-start gap-2.5 rounded-2xl border-2 px-3 py-2 text-sm", ok ? "border-mint/40 bg-mint-soft/60" : "border-coral/40 bg-coral-soft/60")}>
                  {ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-label="Correct" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-label="Incorrect" />}
                  <span className="min-w-0">
                    <span className="font-bold">Q{i + 1}.</span> <span className="line-clamp-2 inline font-semibold">{plain(x.prompt)}</span>
                  </span>
                </li>
              );
            })}
          </ol>

          {missedConcepts.length > 0 && (
            <div className="mt-6 rounded-2xl border-2 border-dashed border-border p-4">
              <p className="flex items-center gap-2 font-display font-semibold">
                <BookOpen className="size-5 text-primary" aria-hidden /> Review {reviewLessons.length === 1 ? "this lesson" : "these lessons"}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {reviewLessons.map((l) => (
                  <li key={l.id}>
                    <Link href={`/learn/${l.id}`} className="press inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-3 py-1.5 text-sm font-bold hover:bg-surface-2 [--press-shadow:var(--border)]">
                      {l.title} <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </li>
                ))}
                {otherConcepts.map((c) => (
                  <li key={c} className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 px-3 py-1.5 text-sm font-bold text-muted-foreground">
                    <X className="size-3.5" aria-hidden /> {c.replace(/-/g, " ")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Button variant={passed ? "outline" : "primary"} size="lg" onClick={start}>
              <RotateCcw /> Retake {label}
            </Button>
            {kind === "checkpoint" && passed && (
              <Button asChild variant="success" size="lg">
                <Link href="/learn">
                  <MapIcon /> Back to the map
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
