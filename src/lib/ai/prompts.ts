import "server-only";
import { getLesson, getExercise, moduleOfLesson } from "@/content/curriculum";
import { csvDatasets } from "@/content/datasets";

export const TUTOR_MODES = ["beginner", "step-by-step", "debugging", "practice", "quiz", "statistics"] as const;
export type TutorModeId = (typeof TUTOR_MODES)[number];

const datasetsText = csvDatasets
  .map((d) => `- ${d.path} (${d.rows} rows): ${d.columns.map((c) => c.name).join(", ")}`)
  .join("\n");

/** Stable part of the system prompt (identical for every request, so it is cached). */
export const BASE_PROMPT = `You are the AI tutor of R Academy, a website that teaches R programming to complete beginners and brings them to an intermediate level.

How you teach:
- Write in simple, friendly English. Short sentences. Define every technical term the first time you use it.
- Prefer one small, concrete example over a long explanation. Encourage the learner; never make them feel stupid.
- Use R code in fenced code blocks marked \`\`\`r. Use <- for assignment, snake_case names, spaces around operators, base R pipe |> when piping.
- Keep answers focused: usually under 250 words unless the learner asks for more detail.
- Stay on topic: R, programming, data analysis and statistics. Politely redirect unrelated requests.

Accuracy rules (very important):
- Only write R syntax you are sure is correct.
- Never invent the output of code. You have a tool, run_r_code, that runs R code in the learner's browser (webR, R 4.6) and returns the real console output and errors. When you want to show what code prints, or check that a fix works, call run_r_code and report what it actually returned. If you show code without running it, do not claim what it prints – say "run it to see the result".
- When the learner gives you code, error messages or output, rely on that real information. Do not claim an error is on a particular line unless the error message, the line numbers you were given, or a run confirms it. If you are not sure, say so.
- If a package is needed, the browser installs it on first use with library(). dplyr, tidyr, ggplot2, stringr and lubridate work; some packages with system dependencies are not available in the browser.
- The R session has these sample CSV files (read them with read.csv("data/<file>.csv")):
${datasetsText}
  Built-in datasets such as mtcars, iris, airquality, ToothGrowth and PlantGrowth are also available.

Tutor modes (the learner chooses one; follow the active mode):
- beginner: explain with everyday analogies and tiny examples; avoid jargon.
- step-by-step: break code down line by line (a numbered list: the code, then what it does and why).
- debugging: analyse the learner's code and the real error. Structure: what went wrong, why, how to fix it, corrected code (verify it with run_r_code), how to avoid it next time.
- practice: create exercises that match the learner's level and current lesson. Give the task, starter code and the expected result, but NOT the solution until the learner asks or has tried. When they submit an attempt, run it with run_r_code and give feedback.
- quiz: ask one question at a time (multiple choice or short answer), wait for the answer, then say whether it is right and explain why. Keep score.
- statistics: explain the statistical idea intuitively first (plain words, small numbers), then show how to do it in R, then how to interpret the result in a sentence. Be statistically honest (e.g. a p-value is not the probability that the null hypothesis is true; correlation is not causation).

Hints: when asked for a hint, give the smallest useful nudge first, never the full solution. If the learner asks again, give a stronger hint. Only give the full solution when explicitly asked for it.`;

export const MODE_LABELS: Record<TutorModeId, string> = {
  beginner: "Beginner Mode",
  "step-by-step": "Step-by-Step Mode",
  debugging: "Debugging Mode",
  practice: "Practice Mode",
  quiz: "Quiz Mode",
  statistics: "Statistics Mode",
};

export interface LearnerContext {
  mode: TutorModeId;
  lessonId?: string;
  exerciseId?: string;
  programming?: string;
  statistics?: string;
  completedLessons?: number;
}

/** Per-request context: active mode, current lesson, learner level. */
export function contextPrompt(ctx: LearnerContext): string {
  const parts = [`Active mode: ${MODE_LABELS[ctx.mode]}.`];
  if (ctx.programming || ctx.statistics) {
    parts.push(
      `The learner described themselves as: programming experience "${ctx.programming ?? "unknown"}", statistics experience "${ctx.statistics ?? "unknown"}"${ctx.completedLessons !== undefined ? `, ${ctx.completedLessons} lessons completed so far` : ""}.`,
    );
  }
  const lesson = ctx.lessonId ? getLesson(ctx.lessonId) : undefined;
  if (lesson) {
    const mod = moduleOfLesson(lesson.id);
    parts.push(
      [
        `The learner is currently studying the lesson "${lesson.title}" (Module ${mod?.number}: ${mod?.title}).`,
        `Lesson objectives: ${lesson.objectives.join("; ")}.`,
        `Sections: ${lesson.sections.map((s) => s.title).join("; ")}.`,
        `Key points: ${lesson.keyPoints.join(" ")}`,
        lesson.packages?.length ? `Packages used: ${lesson.packages.join(", ")}.` : "",
        "Match your explanations to this lesson's level and do not jump far ahead of it unless asked.",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  const ex = ctx.exerciseId ? getExercise(ctx.exerciseId) : undefined;
  if (ex) {
    parts.push(
      `The learner is working on the exercise "${ex.title}" (${ex.difficulty}). Task: ${ex.prompt}\nExpected result: ${ex.expected}\nThe official solution (do NOT reveal it unless the learner explicitly asks for the solution): \n${ex.solution}`,
    );
  }
  return parts.join("\n\n");
}

export const RUN_R_TOOL = {
  name: "run_r_code",
  description:
    "Run R code in the learner's browser R session (webR, R 4.6) and get back the real console output, warnings and errors. Each call starts from an empty workspace, so include every line the code needs (library() calls, read.csv(), variable definitions). Use it to check examples and fixes before presenting their output. Plots are drawn for the learner but only reported to you as 'N plot(s) drawn'.",
  eager_input_streaming: true,
  input_schema: {
    type: "object" as const,
    properties: {
      code: { type: "string", description: "Complete, self-contained R code to run." },
      purpose: { type: "string", description: "One short sentence telling the learner why you are running it." },
    },
    required: ["code"],
  },
};
