"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  ListTree,
  MessageCircleQuestion,
  PencilLine,
  Play,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
  Bug,
  Map as MapIcon,
} from "lucide-react";
import type { Exercise, Lesson } from "@/content/types";
import type { World } from "@/lib/game/worlds";
import { buildLessonCards, PHASES, type LessonCard, type Phase } from "./lesson-cards";
import { LessonBlock } from "./lesson-blocks";
import { ExampleBlock } from "./example-block";
import { ExerciseCard } from "./exercise-card";
import { QuestionCard } from "./question-card";
import { LessonNotes } from "./lesson-shell";
import { CodeRunner, type CodeRunnerHandle } from "@/components/code/code-runner";
import { CodeBlock } from "@/components/code/code-block";
import { Markdown } from "@/components/content/markdown";
import { TutorChat } from "@/components/tutor/tutor-chat";
import { Hexy } from "@/components/brand/mascot";
import { TopicArt } from "@/components/brand/topic-art";
import { ThemeSwitch } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { toast } from "@/components/ui/toast";
import { useGame, useOutline } from "@/components/game/outline-context";
import { fireConfetti } from "@/components/game/confetti";
import { codeMessage, tutor } from "@/lib/ai/tutor-store";
import { isLessonUnlocked, progress, useProgress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { exerciseXp, XP } from "@/lib/game/xp";
import { LESSON_ART } from "@/lib/game/worlds";
import { cn } from "@/lib/utils";

export interface LessonPlayerProps {
  lesson: Lesson;
  exercises: Exercise[];
  module: { number: number; id: string; title: string };
  world: World;
  lessonNumber: string;
  prev?: { id: string; title: string };
  next?: { id: string; title: string; world?: { name: string; number: number; changed: boolean } };
  terms: { slug: string; term: string }[];
}

const PHASE_ICON: Record<Phase, typeof BookOpen> = { learn: BookOpen, watch: Play, try: PencilLine, challenge: Target, feedback: MessageCircleQuestion, xp: Zap };
const noop = () => () => {};

function PhaseChip({ phase }: { phase: Phase }) {
  const Icon = PHASE_ICON[phase];
  const label = PHASES.find((p) => p.id === phase)!.label;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs font-semibold uppercase tracking-wider text-white" style={{ background: "var(--world)" }}>
      <Icon className="size-3.5" /> {label}
    </span>
  );
}

export function LessonPlayer({ lesson, exercises, module, world, lessonNumber, prev, next, terms }: LessonPlayerProps) {
  const cards = useMemo(() => buildLessonCards(lesson, exercises), [lesson, exercises]);
  const state = useProgress();
  const settings = useSettings();
  const outline = useOutline();
  const game = useGame();
  const router = useRouter();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [index, setIndex] = useState(0);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [quiz, setQuiz] = useState<Record<string, boolean>>({});
  const [editCode, setEditCode] = useState<string | null>(null);
  const [tried, setTried] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const runner = useRef<CodeRunnerHandle>(null);
  const restored = useRef(false);
  const card = cards[Math.min(index, cards.length - 1)];
  const completed = Boolean(state.lessons[lesson.id]?.completedAt);
  const unlocked = !mounted || isLessonUnlocked(outline, state, lesson.id, settings.learningMode);
  const tryIdeas = useMemo(() => lesson.sections.flatMap((s) => s.blocks).flatMap((b) => (b.kind === "code" && b.example.tryIt ? [b.example.tryIt] : [])), [lesson]);

  // Record the visit and resume where the learner left off.
  useEffect(() => {
    progress.visitLesson(lesson.id, lesson.title);
  }, [lesson.id, lesson.title]);
  useEffect(() => {
    if (!mounted || restored.current) return;
    restored.current = true;
    const saved = progress && state.lessonSteps?.[lesson.id];
    if (saved && saved.at > 0 && saved.at < cards.length - 1 && !completed) {
      // Restoring the saved position needs localStorage, so it happens after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIndex(saved.at);
      toast("Welcome back!", { description: "Picking up where you left off.", tone: "info" });
    }
  }, [mounted, state.lessonSteps, lesson.id, cards.length, completed]);

  const go = useCallback(
    (i: number) => {
      const n = Math.max(0, Math.min(cards.length - 1, i));
      setIndex(n);
      setEditCode(null);
      progress.setLessonStep(lesson.id, n);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (cards[n].kind === "complete" && !state.lessons[lesson.id]?.completedAt) {
        progress.setLessonComplete(lesson.id, true);
        setTimeout(() => fireConfetti({ y: 0.3, count: 180 }), 250);
      }
    },
    [cards, lesson.id, state.lessons],
  );

  // Keyboard: Alt+→ / Alt+← move between cards.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const quizQuestions = lesson.quiz;
  const onQuizAnswer = (id: string, ok: boolean) => {
    if (id in quiz) return;
    const n = { ...quiz, [id]: ok };
    setQuiz(n);
    // Record the score once every question has been answered (outside the state updater, which must stay pure).
    if (Object.keys(n).length === quizQuestions.length) progress.recordQuiz(lesson.id, quizQuestions.filter((q) => n[q.id]).length / quizQuestions.length);
  };

  const currentCode = (): { code: string; output: string | null } | null => {
    if (card.kind === "watch") return { code: editCode ?? card.example.code, output: editCode ? null : (card.example.output ?? null) };
    if (card.kind === "try") {
      const code = runner.current?.getCode() ?? lesson.playground;
      return { code, output: null };
    }
    if (card.kind === "challenge") return { code: state.exercises[card.exercise.id]?.code ?? card.exercise.starterCode, output: null };
    if ((card.kind === "quiz" || card.kind === "check") && "code" in card.question && card.question.code) return { code: card.question.code, output: null };
    return null;
  };

  const askTutor = (text?: string) => {
    setTutorOpen(true);
    if (text) void tutor.send(text, { lessonId: lesson.id, exerciseId: card.kind === "challenge" ? card.exercise.id : undefined });
  };

  const phaseIdx = PHASES.findIndex((p) => p.id === card.phase);
  // Every question in the lesson earns XP: the quick checks between steps and the final quiz.
  const allQuestions = [...cards.flatMap((c) => (c.kind === "check" ? [c.question] : [])), ...quizQuestions];
  const lessonXp = XP.lesson + exercises.reduce((a, e) => a + exerciseXp(e.difficulty), 0) + allQuestions.length * XP.question;
  const earnedXp =
    (completed ? XP.lesson : 0) +
    exercises.reduce((a, e) => a + (state.exercises[e.id]?.passedAt ? exerciseXp(e.difficulty, state.exercises[e.id]?.solutionViewed) : 0), 0) +
    allQuestions.reduce((a, q) => a + (state.questions[q.id]?.correct ? (state.questions[q.id].attempts <= 1 ? XP.question : XP.questionRetry) : 0), 0);

  const nextLabel = (() => {
    if (card.kind === "intro") return "Let's start";
    if (card.kind === "complete") return next ? "Next lesson" : "Back to the map";
    if (index === cards.length - 2) return "Finish lesson";
    if (card.kind === "challenge" && !state.exercises[card.exercise.id]?.passedAt) return "Skip for now";
    if ((card.kind === "quiz" || card.kind === "check") && !(card.question.id in quiz) && !state.questions[card.question.id]) return "Skip";
    return "Continue";
  })();
  const nextIsSkip = nextLabel === "Skip" || nextLabel === "Skip for now";

  const onNext = () => {
    if (card.kind === "complete") router.push(next ? `/learn/${next.id}` : `/learn#world-${world.id}`);
    else go(index + 1);
  };

  const styleVars = { ["--world" as string]: world.color.main, ["--world-soft" as string]: world.color.soft, ["--world-shadow" as string]: world.color.shadow } as React.CSSProperties;
  const bookmarked = state.bookmarks.some((b) => b.id === `lesson:${lesson.id}`);

  if (!unlocked) {
    return (
      <div className="grid min-h-screen place-items-center px-5" style={styleVars}>
        <div className="max-w-md text-center">
          <Hexy mood="sleep" size={130} className="mx-auto" />
          <p className="mt-4 font-display text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--world)" }}>Lesson {lessonNumber} · {world.name}</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{lesson.title}</h1>
          <p className="mt-3 font-semibold text-muted-foreground">
            This lesson builds on {prev ? <strong className="text-foreground">{prev.title}</strong> : "the previous lesson"}. Finish that first – or peek ahead if you like.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {prev && (
              <Button asChild size="lg">
                <Link href={`/learn/${prev.id}`}>Go to the previous lesson</Link>
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={() => progress.unlockLesson(lesson.id)}>
              Open anyway
            </Button>
          </div>
          <Link href="/learn" className="mt-5 inline-block text-sm font-bold text-primary underline">
            Back to the map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" style={styleVars}>
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b-2 border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-3 sm:gap-3 sm:px-5">
          <Button asChild variant="ghost" size="icon" aria-label="Close lesson and go back to the map">
            <Link href={`/learn#world-${world.id}`}>
              <X />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <ProgressBar value={((index + 1) / cards.length) * 100} color="var(--world)" size="lg" label={`Lesson progress: step ${index + 1} of ${cards.length}`} />
          </div>
          <span className="hidden font-display text-sm font-semibold text-muted-foreground sm:inline">
            {index + 1}/{cards.length}
          </span>
          <span className="flex items-center gap-1 font-display text-sm font-semibold text-warning" aria-label={`${game.xp} XP`}>
            <Zap className="size-5 fill-sun text-sun" /> {game.xp.toLocaleString()}
          </span>
          <Button variant="ghost" size="icon" onClick={() => setOutlineOpen(true)} aria-label="Lesson outline">
            <ListTree />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-pressed={bookmarked}
            onClick={() => progress.toggleBookmark({ id: `lesson:${lesson.id}`, kind: "lesson", title: lesson.title, href: `/learn/${lesson.id}` })}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this lesson"}
            className="hidden sm:inline-flex"
          >
            {bookmarked ? <BookmarkCheck className="text-primary" /> : <Bookmark />}
          </Button>
          <ThemeSwitch className="hidden md:inline-flex" />
          <Button variant={tutorOpen ? "primary" : "outline"} size="sm" onClick={() => setTutorOpen((o) => !o)} aria-pressed={tutorOpen}>
            <Sparkles /> <span className="hidden sm:inline">Ask AI</span>
          </Button>
        </div>
        {/* Phase stepper */}
        <nav aria-label="Lesson steps" className="no-scrollbar mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-3 pb-2 sm:justify-center sm:px-5">
          {PHASES.map((p, i) => {
            const first = cards.findIndex((c) => c.phase === p.id);
            const last = cards.length - 1 - [...cards].reverse().findIndex((c) => c.phase === p.id);
            const done = first >= 0 && index > last;
            const current = p.id === card.phase;
            const Icon = PHASE_ICON[p.id];
            return (
              <button
                key={p.id}
                onClick={() => first >= 0 && go(first)}
                disabled={first < 0}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-1 font-display text-xs font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40",
                  current ? "border-transparent text-white" : done ? "border-transparent bg-surface-2 text-foreground" : "border-border text-muted-foreground hover:bg-surface-2",
                )}
                style={current ? { background: "var(--world)" } : undefined}
              >
                <span className={cn("grid size-5 place-items-center rounded-full text-[10px]", current ? "bg-white/25" : done ? "text-white" : "bg-surface-2")} style={done && !current ? { background: "var(--world)" } : undefined}>
                  {done ? <Check className="size-3" /> : <Icon className="size-3" />}
                </span>
                <span className={cn(i > 0 && !current && "hidden sm:inline")}>{p.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-1">
        <main id="lesson-main" className="min-w-0 flex-1 pb-32">
          <div key={index} className="mx-auto max-w-3xl px-4 py-6 sm:px-6 animate-fade-up">
            <CardView
              card={card}
              lesson={lesson}
              world={world}
              moduleTitle={module.title}
              lessonNumber={lessonNumber}
              cardsTotal={cards.length}
              lessonXp={lessonXp}
              earnedXp={earnedXp}
              quiz={quiz}
              onQuizAnswer={onQuizAnswer}
              runner={runner}
              setEditCode={setEditCode}
              tryIdeas={tryIdeas}
              tried={tried}
              setTried={setTried}
              revealed={revealed}
              setRevealed={setRevealed}
              askTutor={askTutor}
              terms={terms}
              next={next}
              completed={completed}
              exercisesPassed={exercises.filter((e) => state.exercises[e.id]?.passedAt).length}
              exercisesTotal={exercises.length}
            />
          </div>
        </main>

        {tutorOpen && (
          <aside className="fixed inset-0 z-50 flex flex-col bg-background lg:sticky lg:top-[7.25rem] lg:z-auto lg:h-[calc(100vh-7.25rem)] lg:w-[420px] lg:shrink-0 lg:border-l-2 lg:border-border xl:w-[460px]" aria-label="AI tutor">
            <div className="flex items-center gap-2 border-b-2 border-border px-4 py-2 lg:hidden">
              <span className="font-display font-semibold">Ask Hexy</span>
              <Button size="icon-sm" variant="ghost" className="ml-auto" onClick={() => setTutorOpen(false)} aria-label="Close the AI tutor">
                <X />
              </Button>
            </div>
            <TutorChat compact lessonId={lesson.id} lessonTitle={lesson.title} exerciseId={card.kind === "challenge" ? card.exercise.id : undefined} getCode={currentCode} className="h-full min-h-0 flex-1" />
          </aside>
        )}
      </div>

      {/* Bottom action bar */}
      <div className={cn("fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur", tutorOpen && "lg:right-[420px] xl:right-[460px]")}>
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 sm:px-6">
          <Button variant="outline" size="lg" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous step">
            <ArrowLeft /> <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button variant="ghost" size="lg" onClick={() => askTutor()} className="hidden sm:inline-flex">
            <Sparkles /> Ask AI
          </Button>
          <div className="ml-auto" />
          <Button variant={nextIsSkip ? "outline" : card.kind === "complete" ? "primary" : "success"} size="lg" onClick={onNext} className="min-w-36">
            {nextLabel} {card.kind === "complete" && !next ? <MapIcon /> : <ArrowRight />}
          </Button>
        </div>
      </div>

      {/* Outline drawer */}
      {outlineOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Lesson outline">
          <button className="absolute inset-0 bg-[#0c0f24]/50 cursor-default" onClick={() => setOutlineOpen(false)} aria-label="Close outline" />
          <div className="absolute inset-y-0 left-0 flex w-[min(92vw,380px)] flex-col bg-surface shadow-2xl animate-fade-up">
            <div className="flex items-center gap-2 border-b-2 border-border p-4">
              <div className="min-w-0 flex-1">
                <p className="font-display text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--world)" }}>Lesson {lessonNumber}</p>
                <p className="truncate font-display text-lg font-semibold">{lesson.title}</p>
              </div>
              <Button size="icon-sm" variant="ghost" onClick={() => setOutlineOpen(false)} aria-label="Close outline">
                <X />
              </Button>
            </div>
            <ol className="flex-1 space-y-0.5 overflow-y-auto p-3 scrollbar-thin">
              {cards.map((c, i) => {
                const Icon = PHASE_ICON[c.phase];
                const showHeader = i === 0 || cards[i - 1].phase !== c.phase;
                return (
                  <li key={i}>
                    {showHeader && <p className="mt-3 px-2 pb-1 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground first:mt-0">{PHASES.find((p) => p.id === c.phase)!.label}</p>}
                    <button
                      onClick={() => {
                        go(i);
                        setOutlineOpen(false);
                      }}
                      aria-current={i === index ? "step" : undefined}
                      className={cn("flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm font-semibold cursor-pointer", i === index ? "bg-primary-soft text-primary" : "hover:bg-surface-2")}
                    >
                      <span className={cn("grid size-6 shrink-0 place-items-center rounded-lg", i < index ? "text-white" : "bg-surface-2 text-muted-foreground")} style={i < index ? { background: "var(--world)" } : undefined}>
                        {i < index ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
                      </span>
                      <span className="truncate">{c.kind === "quiz" ? `Question ${c.index + 1}` : c.kind === "challenge" ? `Challenge: ${c.title}` : c.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="border-t-2 border-border p-3 text-xs font-semibold text-muted-foreground">Tip: Alt + → and Alt + ← move between steps.</div>
          </div>
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        Step {index + 1} of {cards.length}: {PHASES[phaseIdx]?.label} – {card.title}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface CardViewProps {
  card: LessonCard;
  lesson: Lesson;
  world: World;
  moduleTitle: string;
  lessonNumber: string;
  cardsTotal: number;
  lessonXp: number;
  earnedXp: number;
  quiz: Record<string, boolean>;
  onQuizAnswer: (id: string, ok: boolean) => void;
  runner: React.RefObject<CodeRunnerHandle | null>;
  setEditCode: (c: string | null) => void;
  tryIdeas: string[];
  tried: Record<number, boolean>;
  setTried: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  revealed: Record<number, boolean>;
  setRevealed: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  askTutor: (text?: string) => void;
  terms: { slug: string; term: string }[];
  next?: LessonPlayerProps["next"];
  completed: boolean;
  exercisesPassed: number;
  exercisesTotal: number;
}

function CardView({ runner, ...p }: CardViewProps) {
  const { card, lesson, world } = p;
  switch (card.kind) {
    case "intro":
      return (
        <div>
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
            <div className="relative" style={{ background: "var(--world-soft)" }}>
              <TopicArt kind={LESSON_ART[lesson.id] ?? world.art} bg="transparent" className="mx-auto max-h-52" />
              <div className="absolute bottom-2 right-3 hidden sm:block">
                <Hexy mood="wave" size={86} animate />
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="text-white" style={{ background: "var(--world)" }}>World {world.number} · {world.name}</Badge>
                <Badge variant="outline">Lesson {p.lessonNumber}</Badge>
                <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground"><Clock className="size-3.5" /> {lesson.minutes} min</span>
                <span className="flex items-center gap-1 text-xs font-bold text-warning"><Zap className="size-3.5 fill-current" /> up to {p.lessonXp} XP</span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{lesson.title}</h1>
              <p className="mt-2 text-lg font-semibold text-muted-foreground">{lesson.summary}</p>
              <div className="mt-5 rounded-2xl border-2 border-border bg-surface-2/50 p-4">
                <p className="font-display font-semibold">In this lesson you will…</p>
                <ul className="mt-2 space-y-2">
                  {lesson.objectives.map((o, i) => (
                    <li key={o} className="flex gap-2 text-[15px] font-semibold">
                      <span className="grid size-6 shrink-0 place-items-center rounded-lg text-xs font-bold text-white" style={{ background: "var(--world)" }}>{i + 1}</span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                {p.cardsTotal} short steps · {p.exercisesTotal} challenge{p.exercisesTotal === 1 ? "" : "s"} · {lesson.quiz.length} quiz questions{p.completed ? " · ✓ completed – revisit any step" : ""}
              </p>
            </div>
          </div>
          <section className="mt-6 rounded-3xl border-2 border-border bg-card p-6" aria-labelledby="big-picture">
            <h2 id="big-picture" className="flex items-center gap-2 font-display text-xl font-semibold">
              <Eye className="size-5" style={{ color: "var(--world)" }} /> The big picture
            </h2>
            <Markdown className="mt-3 text-[1.03rem]">{lesson.intro}</Markdown>
          </section>
        </div>
      );
    case "learn":
      return (
        <article>
          <PhaseChip phase="learn" />
          <h2 className="mt-3 font-display text-3xl font-bold">{card.title}</h2>
          <div className="mt-4 rounded-3xl border-2 border-border bg-card p-6 text-[1.02rem]">
            {card.blocks.map((b, i) => (
              <LessonBlock key={i} block={b} lesson={lesson} />
            ))}
          </div>
        </article>
      );
    case "watch":
      return (
        <article>
          <PhaseChip phase="watch" />
          <h2 className="mt-3 font-display text-3xl font-bold">{card.section}</h2>
          {card.lead.length > 0 && (
            <div className="mt-4 text-[1.02rem]">
              {card.lead.map((b, i) => (
                <LessonBlock key={i} block={b} lesson={lesson} />
              ))}
            </div>
          )}
          <div className="mt-4">
            <ExampleBlock example={card.example} lessonId={lesson.id} lessonTitle={lesson.title} onEditChange={p.setEditCode} />
          </div>
          {card.follow.length > 0 && (
            <div className="mt-4 text-[1.02rem]">
              {card.follow.map((b, i) => (
                <LessonBlock key={i} block={b} lesson={lesson} />
              ))}
            </div>
          )}
        </article>
      );
    case "check":
      return (
        <article>
          <PhaseChip phase="learn" />
          <h2 className="mt-3 font-display text-3xl font-bold">Quick check ✋</h2>
          <p className="mt-1 font-semibold text-muted-foreground">A tiny question to lock in what you just learned.</p>
          <div className="mt-4 rounded-3xl border-2 border-border bg-card p-6">
            <QuestionCard question={card.question} bare />
          </div>
        </article>
      );
    case "try":
      return (
        <article>
          <PhaseChip phase="try" />
          <div className="mt-3 flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-3xl font-bold">{card.title}</h2>
              <p className="mt-1 font-semibold text-muted-foreground">This playground is yours. Change the code, break it, fix it – press Run (or Ctrl + Enter) to see what real R does.</p>
            </div>
            <Hexy mood="point" size={84} className="hidden shrink-0 sm:block" />
          </div>
          <div className="mt-4">
            <CodeRunner
              ref={runner}
              workspace={`lesson:${lesson.id}`}
              variant="panel"
              initialCode={lesson.playground}
              storageKey={`lesson:${lesson.id}`}
              downloadName={`${lesson.id}.R`}
              title={lesson.title}
              onCodeChange={(c) => p.setEditCode(c)}
              onAskTutor={(code, r) => p.askTutor(codeMessage(code, r && r.code === code ? r.lines.map((l) => l.text).join("\n") : null))}
              editorMinHeight={200}
            />
          </div>
          {p.tryIdeas.length > 0 && (
            <div className="mt-5 rounded-3xl border-2 border-border bg-card p-5">
              <p className="font-display text-lg font-semibold">Ideas to try</p>
              <ul className="mt-3 space-y-2">
                {p.tryIdeas.map((t, i) => (
                  <li key={i}>
                    <label className={cn("flex cursor-pointer items-start gap-3 rounded-2xl border-2 px-4 py-3 text-[15px] transition-colors", p.tried[i] ? "border-mint bg-mint-soft" : "border-border hover:bg-surface-2")}>
                      <input type="checkbox" className="mt-1 size-4 accent-[var(--mint)]" checked={Boolean(p.tried[i])} onChange={(e) => p.setTried((s) => ({ ...s, [i]: e.target.checked }))} />
                      <Markdown runnableCode={false} className={cn(p.tried[i] && "opacity-70")}>{t}</Markdown>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      );
    case "mistakes":
      return (
        <article>
          <PhaseChip phase="try" />
          <h2 className="mt-3 font-display text-3xl font-bold">{card.title}</h2>
          <p className="mt-1 font-semibold text-muted-foreground">Every programmer makes these. Run the broken code to see R&apos;s real message, guess the problem, then reveal the fix.</p>
          <div className="mt-5 space-y-5">
            {lesson.mistakes.map((m, i) => (
              <div key={i} className="overflow-hidden rounded-3xl border-2 border-border bg-card">
                <div className="flex items-center gap-3 border-b-2 border-border bg-coral-soft px-5 py-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-coral text-white"><Bug className="size-5" /></span>
                  <p className="font-display text-lg font-semibold">{m.title}</p>
                </div>
                <div className="p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-danger">The buggy code</p>
                  <CodeBlock code={m.wrong} workspace={`lesson:${lesson.id}:mistake`} label="R" />
                  {!p.revealed[i] ? (
                    <Button variant="sun" onClick={() => p.setRevealed((r) => ({ ...r, [i]: true }))}>
                      <Eye /> Reveal the fix
                    </Button>
                  ) : (
                    <div className="animate-pop-in">
                      <div className="rounded-2xl bg-surface-2/60 px-4 py-3 text-[15px]">
                        <Markdown>{m.why}</Markdown>
                      </div>
                      <p className="mb-1 mt-3 text-xs font-bold uppercase tracking-wider text-success">The fix</p>
                      <CodeBlock code={m.right} workspace={`lesson:${lesson.id}:mistake`} label="R" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>
      );
    case "challenge":
      return (
        <article>
          <PhaseChip phase="challenge" />
          <h2 className="sr-only">Challenge {card.index + 1} of {card.total}: {card.title}</h2>
          <div className="mt-4">
            <ExerciseCard
              task={card.exercise}
              eyebrow={`Challenge ${card.index + 1} of ${card.total}`}
              onAskTutor={(code) => p.askTutor(`I'm working on the challenge "${card.exercise.title}". Please give me a hint, not the solution.\n\nMy attempt:\n\`\`\`r\n${code}\n\`\`\``)}
            />
          </div>
        </article>
      );
    case "quiz":
      return (
        <article>
          <PhaseChip phase="feedback" />
          <div className="mt-3 flex items-center gap-3">
            <h2 className="font-display text-3xl font-bold">Knowledge check</h2>
            <span className="ml-auto font-display text-sm font-semibold text-muted-foreground">
              {card.index + 1} / {card.total}
            </span>
          </div>
          <div className="mt-2 flex gap-1.5" aria-hidden>
            {lesson.quiz.map((q, i) => (
              <span key={q.id} className={cn("h-2 flex-1 rounded-full", q.id in p.quiz ? (p.quiz[q.id] ? "bg-mint" : "bg-coral") : i === card.index ? "bg-primary" : "bg-surface-3")} />
            ))}
          </div>
          <div className="mt-5 rounded-3xl border-2 border-border bg-card p-6">
            <QuestionCard key={card.question.id} question={card.question} index={card.index} total={card.total} onAnswered={(ok) => p.onQuizAnswer(card.question.id, ok)} bare />
          </div>
        </article>
      );
    case "complete": {
      const answered = Object.keys(p.quiz).length;
      const right = Object.values(p.quiz).filter(Boolean).length;
      return (
        <article className="text-center">
          <Hexy mood="celebrate" size={150} className="mx-auto" animate />
          <h2 className="mt-2 font-display text-4xl font-bold">Lesson complete!</h2>
          <p className="mt-2 text-lg font-semibold text-muted-foreground">You finished “{lesson.title}”. Brilliant work!</p>
          <div className="mx-auto mt-6 grid max-w-xl grid-cols-3 gap-3">
            <div className="rounded-3xl border-2 border-sun/50 bg-sun-soft p-4">
              <Zap className="mx-auto size-7 fill-sun text-sun" />
              <p className="mt-1 font-display text-2xl font-bold">{p.earnedXp}</p>
              <p className="text-xs font-bold text-muted-foreground">XP earned here</p>
            </div>
            <div className="rounded-3xl border-2 border-grape/40 bg-grape-soft p-4">
              <Target className="mx-auto size-7 text-grape" />
              <p className="mt-1 font-display text-2xl font-bold">
                {p.exercisesPassed}/{p.exercisesTotal}
              </p>
              <p className="text-xs font-bold text-muted-foreground">challenges solved</p>
            </div>
            <div className="rounded-3xl border-2 border-mint/40 bg-mint-soft p-4">
              <CheckCircle2 className="mx-auto size-7 text-success" />
              <p className="mt-1 font-display text-2xl font-bold">{answered ? `${right}/${answered}` : "–"}</p>
              <p className="text-xs font-bold text-muted-foreground">quiz answers right</p>
            </div>
          </div>
          {p.exercisesPassed < p.exercisesTotal && <p className="mt-3 text-sm font-semibold text-muted-foreground">Come back anytime to finish the remaining challenges for extra XP.</p>}
          {p.next?.world?.changed && (
            <div className="mx-auto mt-6 flex max-w-xl items-center gap-3 rounded-3xl border-2 border-primary/40 bg-primary-soft p-4 text-left">
              <Trophy className="size-8 shrink-0 text-primary" />
              <p className="font-semibold">
                New world unlocked: <strong>World {p.next.world.number} · {p.next.world.name}</strong>
              </p>
            </div>
          )}
          <div className="mx-auto mt-8 max-w-xl rounded-3xl border-2 border-border bg-card p-6 text-left">
            <p className="font-display text-lg font-semibold">What you learned</p>
            <ul className="mt-3 space-y-2">
              {lesson.keyPoints.map((k) => (
                <li key={k} className="flex gap-2 text-[15px]">
                  <CheckCircle2 className="mt-1 size-4 shrink-0" style={{ color: "var(--world)" }} />
                  <Markdown>{k}</Markdown>
                </li>
              ))}
            </ul>
            {p.terms.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.terms.map((t) => (
                  <Link key={t.slug} href={`/glossary#${t.slug}`} className="rounded-full border-2 border-border px-3 py-1 text-xs font-bold hover:border-primary hover:bg-primary-soft">
                    {t.term}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="mx-auto mt-6 max-w-xl text-left">
            <LessonNotes lessonId={lesson.id} title={lesson.title} />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button asChild variant="outline" size="lg">
              <Link href={`/learn#world-${world.id}`}>
                <MapIcon /> Back to the map
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/challenge">
                <Trophy /> Daily challenge
              </Link>
            </Button>
          </div>
          {p.completed && (
            <button className="mt-4 cursor-pointer text-xs font-bold text-muted-foreground underline-offset-2 hover:underline" onClick={() => progress.setLessonComplete(lesson.id, false)}>
              Mark this lesson as not complete
            </button>
          )}
        </article>
      );
    }
  }
}
