/**
 * Hexy's quick actions: one-tap prompts built from what the learner is
 * looking at – their code and its real output, the lesson, the exercise and
 * the tutor's last answer. Every prompt starts with "<Label>:" so the chat
 * can show it as a tidy chip instead of a wall of instructions.
 */
import { BookOpen, Bug, Code2, Lightbulb, MessageCircleQuestion, Send, Shuffle, Sprout, type LucideIcon } from "lucide-react";
import { codeMessage } from "@/lib/ai/tutor-store";

export type QuickActionId = "explain" | "simpler" | "hint" | "mistake" | "example" | "quiz" | "lesson" | "send";

export interface QuickContext {
  /** The learner's code and its real console output (output is null when it has not been run). */
  code: { code: string; output: string | null } | null;
  lessonId?: string;
  lessonTitle?: string;
  exerciseId?: string;
  /** Text of the tutor's last answer, if any. */
  lastAnswer: string | null;
  /** True when there is any conversation so far. */
  hasConversation: boolean;
}

/** What is available right now – used to enable/disable the buttons. */
export interface Availability {
  hasCode: boolean;
  hasLesson: boolean;
  hasExercise: boolean;
  hasAnswer: boolean;
  hasConversation: boolean;
}

export interface QuickAction {
  id: QuickActionId;
  label: string;
  /** Accent colour name (design token). */
  color: string;
  icon: LucideIcon;
  /** Why the action can't be used right now, or null when it can. */
  unavailable(a: Availability): string | null;
  prompt(ctx: QuickContext): string;
}

const NEED_CODE = "Write some code in the editor first.";
const NEED_ANSWER = "Ask Hexy a question first.";

const hasCode = (c: QuickContext) => Boolean(c.code?.code.trim());
const lessonName = (c: QuickContext) => (c.lessonTitle ? `"${c.lessonTitle}"` : c.lessonId ? `"${c.lessonId}"` : null);

/** A short one-line quote of an earlier answer (code blocks left out). */
function quote(text: string, max = 240) {
  const one = text.replace(/```[\s\S]*?```/g, "[code]").replace(/\s+/g, " ").trim();
  return one.length > max ? `${one.slice(0, max).trimEnd()}…` : one;
}

/** The question followed by the learner's code and its real output (when there is code). */
function withCode(c: QuickContext, question: string) {
  return hasCode(c) ? codeMessage(c.code!.code, c.code!.output, question) : question;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "explain",
    label: "Explain This Code",
    color: "sky",
    icon: Code2,
    unavailable: (a) => (a.hasCode ? null : NEED_CODE),
    prompt: (c) =>
      withCode(
        c,
        [
          "Explain This Code: please walk me through my code line by line.",
          "",
          "For each line (or small group of lines), show the code and then say in simple words what it does and why. If a line uses a function I might not know yet, tell me what that function does. Finish with one sentence that sums up what the whole code does.",
          c.code?.output === null ? "If it helps, run it with run_r_code so we can look at the real output together." : "",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
  },
  {
    id: "simpler",
    label: "Make It Simpler",
    color: "mint",
    icon: Sprout,
    unavailable: (a) => (a.hasAnswer ? null : NEED_ANSWER),
    prompt: (c) =>
      [
        "Make It Simpler: I didn't fully get your last answer. Please explain it again in simpler words.",
        "",
        "Use short sentences and no jargon (if you need a technical word, explain it). Use one everyday analogy, keep it short, and end with one tiny R example I can run.",
        c.lastAnswer ? `\nYour last answer began: “${quote(c.lastAnswer)}”` : "",
      ].join("\n"),
  },
  {
    id: "hint",
    label: "Give Me a Hint",
    color: "sun",
    icon: Lightbulb,
    unavailable: (a) => (a.hasExercise || a.hasLesson || a.hasCode || a.hasConversation ? null : "Open a lesson or an exercise, or write some code first."),
    prompt: (c) => {
      const rules = "Give me the smallest useful nudge for my next step – a question to think about, or the idea or function to look at. Do NOT give me the solution or the finished code.";
      if (c.exerciseId)
        return withCode(c, `Give Me a Hint: I'm stuck on the current exercise${lessonName(c) ? ` (from the lesson ${lessonName(c)})` : ""}.\n\n${rules}${hasCode(c) ? "\n\nHere is my attempt so far." : ""}`);
      if (hasCode(c)) return withCode(c, `Give Me a Hint: I'm working on the code below${lessonName(c) ? ` while studying the lesson ${lessonName(c)}` : ""} and I'm not sure what to do next.\n\n${rules}`);
      if (c.lessonId) return `Give Me a Hint: I'm studying the lesson ${lessonName(c)}. Give me a hint that helps me understand its key idea or get started with its practice tasks.\n\n${rules}`;
      return `Give Me a Hint: help me with what we were just talking about.\n\n${rules}`;
    },
  },
  {
    id: "mistake",
    label: "Find My Mistake",
    color: "coral",
    icon: Bug,
    unavailable: (a) => (a.hasCode ? null : NEED_CODE),
    prompt: (c) =>
      withCode(
        c,
        [
          `Find My Mistake: please help me find what's wrong with my code${c.exerciseId ? " (my attempt at the current exercise)" : ""}.`,
          "",
          "Base your answer on R's real output. If I haven't run the code yet, run it with run_r_code first. Then tell me:",
          "1. What went wrong (quote the exact error or warning, if there is one).",
          "2. Where – only name a line if the error message or a run confirms it.",
          "3. Why it happened, in simple words.",
          c.exerciseId ? "4. How to fix it – as a hint, without giving me the full exercise solution." : "4. How to fix it, with corrected code that you have checked with run_r_code.",
          "5. One tip to avoid this next time.",
          "If there is no error, check whether the code does what I probably meant.",
        ].join("\n"),
      ),
  },
  {
    id: "example",
    label: "Give Me Another Example",
    color: "grape",
    icon: Shuffle,
    unavailable: (a) => (a.hasAnswer || a.hasLesson || a.hasCode ? null : NEED_ANSWER),
    prompt: (c) => {
      const how = "Use different data or a different everyday situation, keep it small, run it with run_r_code so the output is real, and explain the output in one or two sentences.";
      if (c.lastAnswer)
        return `Give Me Another Example: please show me one more small, different example of the idea in your last answer${lessonName(c) ? ` (I'm studying the lesson ${lessonName(c)})` : ""}.\n\n${how}\n\nYour last answer began: “${quote(c.lastAnswer, 200)}”`;
      if (c.lessonId) return `Give Me Another Example: please show me one small new example of the main idea of the lesson ${lessonName(c)}.\n\n${how}`;
      return withCode(c, `Give Me Another Example: please show me another small example that uses the same idea as my code below.\n\n${how}`);
    },
  },
  {
    id: "quiz",
    label: "Quiz Me",
    color: "tangerine",
    icon: MessageCircleQuestion,
    unavailable: () => null,
    prompt: (c) => {
      const topic = lessonName(c) ? `the lesson ${lessonName(c)}` : c.hasConversation ? "what we have been talking about" : "R basics that match my level";
      return `Quiz Me: ask me ONE quiz question about ${topic}.\n\nMake it multiple choice (A–D) or a short "what does this code print?" question. Don't reveal the answer yet – wait for my reply, then tell me whether I'm right and explain why.`;
    },
  },
];

/** Shown when the chat sits next to a lesson. */
export const LESSON_ACTION: QuickAction = {
  id: "lesson",
  label: "Explain This Lesson",
  color: "primary",
  icon: BookOpen,
  unavailable: (a) => (a.hasLesson ? null : "Open a lesson first."),
  prompt: (c) => `Explain This Lesson: please explain the main ideas of this lesson (${lessonName(c) ?? "the current lesson"}) in simple words, with one small example.`,
};

/** Shown when there is an editor next to the chat: sends the code and its real output. */
export const SEND_CODE_ACTION: QuickAction = {
  id: "send",
  label: "Send My Code",
  color: "primary",
  icon: Send,
  unavailable: (a) => (a.hasCode ? null : NEED_CODE),
  prompt: (c) => codeMessage(c.code?.code ?? "", c.code?.output ?? null),
};

const LABELLED = [...QUICK_ACTIONS, LESSON_ACTION];

/** If a user message came from a quick action, return the action and the text after its label. */
export function matchAction(text: string): { action: QuickAction; rest: string } | null {
  for (const a of LABELLED) {
    if (!text.startsWith(`${a.label}:`)) continue;
    const rest = text.slice(a.label.length + 1).trimStart();
    return { action: a, rest: rest.charAt(0).toUpperCase() + rest.slice(1) };
  }
  return null;
}
