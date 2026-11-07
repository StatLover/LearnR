/**
 * Turns a lesson into a sequence of short "cards" for the step-by-step
 * lesson player:
 *
 *   Learn → Watch it work → Try it → Challenge → Feedback → Earn XP
 *
 * Explanations stay next to the code they introduce: the text just before a
 * code example becomes that example's lead-in, longer explanations become
 * their own "Learn" cards, and inline questions become quick checks.
 */
import type { Block, CodeExample, Exercise, Lesson, QuizQuestion } from "@/content/types";

export type Phase = "learn" | "watch" | "try" | "challenge" | "feedback" | "xp";

export const PHASES: { id: Phase; label: string; short: string }[] = [
  { id: "learn", label: "Learn", short: "Learn" },
  { id: "watch", label: "Watch it work", short: "Watch" },
  { id: "try", label: "Try it yourself", short: "Try" },
  { id: "challenge", label: "Challenge", short: "Challenge" },
  { id: "feedback", label: "Get feedback", short: "Feedback" },
  { id: "xp", label: "Earn XP", short: "XP" },
];

export type LessonCard =
  | { kind: "intro"; phase: "learn"; title: string }
  | { kind: "learn"; phase: "learn"; title: string; blocks: Block[] }
  | { kind: "watch"; phase: "watch"; title: string; section: string; lead: Block[]; example: CodeExample; follow: Block[] }
  | { kind: "check"; phase: "learn"; title: string; question: QuizQuestion }
  | { kind: "try"; phase: "try"; title: string }
  | { kind: "mistakes"; phase: "try"; title: string }
  | { kind: "challenge"; phase: "challenge"; title: string; exercise: Exercise; index: number; total: number }
  | { kind: "quiz"; phase: "feedback"; title: string; question: QuizQuestion; index: number; total: number }
  | { kind: "complete"; phase: "xp"; title: string };

/** How many short blocks before an example stay with it as its lead-in. */
const MAX_LEAD = 3;
const LEAD_KINDS = new Set<Block["kind"]>(["text", "definition"]);
const FOLLOW_KINDS = new Set<Block["kind"]>(["text", "callout", "definition"]);

export function buildLessonCards(lesson: Lesson, exercises: Exercise[]): LessonCard[] {
  const cards: LessonCard[] = [{ kind: "intro", phase: "learn", title: lesson.title }];
  for (const section of lesson.sections) {
    let buffer: Block[] = [];
    let lastWatch: Extract<LessonCard, { kind: "watch" }> | null = null;
    const flushLearn = (blocks: Block[]) => {
      if (blocks.length) cards.push({ kind: "learn", phase: "learn", title: section.title, blocks });
    };
    for (const b of section.blocks) {
      if (b.kind === "code") {
        // Keep the last short text blocks as the example's lead-in; earlier
        // material (definitions, diagrams, longer text) gets its own card.
        let split = buffer.length;
        let n = 0;
        while (split > 0 && n < MAX_LEAD && LEAD_KINDS.has(buffer[split - 1].kind)) {
          split--;
          n++;
        }
        flushLearn(buffer.slice(0, split));
        lastWatch = { kind: "watch", phase: "watch", title: b.example.title ?? section.title, section: section.title, lead: buffer.slice(split), example: b.example, follow: [] };
        cards.push(lastWatch);
        buffer = [];
      } else if (b.kind === "question") {
        flushLearn(buffer);
        buffer = [];
        lastWatch = null;
        cards.push({ kind: "check", phase: "learn", title: "Quick check", question: b.question });
      } else buffer.push(b);
    }
    if (buffer.length) {
      // Short wrap-up text right after an example belongs with that example.
      const short = buffer.length <= 3 && buffer.every((b) => FOLLOW_KINDS.has(b.kind));
      if (lastWatch && short && cards[cards.length - 1] === lastWatch) lastWatch.follow = buffer;
      else flushLearn(buffer);
    }
  }
  cards.push({ kind: "try", phase: "try", title: "Your turn: experiment!" });
  if (lesson.mistakes.length) cards.push({ kind: "mistakes", phase: "try", title: "Avoid these common mistakes" });
  exercises.forEach((exercise, index) => cards.push({ kind: "challenge", phase: "challenge", title: exercise.title, exercise, index, total: exercises.length }));
  lesson.quiz.forEach((question, index) => cards.push({ kind: "quiz", phase: "feedback", title: "Knowledge check", question, index, total: lesson.quiz.length }));
  cards.push({ kind: "complete", phase: "xp", title: "Lesson complete!" });
  return cards;
}

export function firstIndexOfPhase(cards: LessonCard[], phase: Phase) {
  return cards.findIndex((c) => c.phase === phase);
}
