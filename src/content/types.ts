/**
 * Content model for R Academy.
 *
 * Every lesson, exercise, quiz question, project, function entry, cheat sheet
 * and glossary term on the site is described with these types. Adding a new
 * lesson means adding one object to a module file – the UI, search index,
 * progress tracking and the content verifier (`npm run verify:content`) pick
 * it up automatically.
 *
 * Markdown fields (named `md`, `prompt`, `intro`, `explanation`, …) support
 * GitHub-flavoured markdown: **bold**, `inline code`, lists, tables, links.
 */

export type StageNumber = 1 | 2 | 3;
export type Difficulty = "easy" | "medium" | "challenge";

/* ------------------------------------------------------------------ */
/* Code examples                                                       */
/* ------------------------------------------------------------------ */

export interface LineNote {
  /** The exact code line (or a short multi-line fragment) being explained. */
  code: string;
  /** Plain-English explanation of what that line does (markdown). */
  text: string;
}

export interface CodeExample {
  /** Unique within the lesson, kebab-case. */
  id: string;
  title?: string;
  /** Complete, runnable R code. */
  code: string;
  /** Line-by-line explanation. */
  explanation?: LineNote[];
  /**
   * Exact console output the code produces in R Academy's console (what the
   * learner sees after pressing Run). Verified automatically by
   * `npm run verify:content`. Omit only for code that prints nothing
   * (e.g. only draws a plot) – then set `plot: true` or `noOutput: true`.
   */
  output?: string;
  /** Markdown explanation of the output ("`[1]` means…"). */
  outputNote?: string;
  /** The code draws at least one plot. */
  plot?: boolean;
  /** The code intentionally prints nothing. */
  noOutput?: boolean;
  /** Packages that must be installed for this example (e.g. ["dplyr"]). */
  packages?: string[];
  /** A suggestion inviting the learner to modify the code. */
  tryIt?: string;
  /**
   * Set to false for code whose output legitimately changes between runs
   * (random numbers without set.seed, Sys.Date(), …). Default true.
   */
  verify?: boolean;
  /** The example is expected to stop with an error (used to show mistakes). */
  expectError?: boolean;
}

/* ------------------------------------------------------------------ */
/* Lesson building blocks                                              */
/* ------------------------------------------------------------------ */

export type DiagramName =
  | "console-vs-script"
  | "r-vs-rstudio"
  | "assignment"
  | "data-types"
  | "vector"
  | "indexing"
  | "list"
  | "matrix"
  | "factor"
  | "data-frame"
  | "if-else-flow"
  | "for-loop-flow"
  | "while-loop-flow"
  | "function-anatomy"
  | "pipe"
  | "tidy-data"
  | "pivot"
  | "ggplot-layers"
  | "boxplot-anatomy"
  | "histogram-vs-bar"
  | "center-spread"
  | "normal-curve"
  | "hypothesis-test"
  | "regression-line"
  | "scope"
  | "apply-family"
  | "data-pipeline"
  | "error-anatomy";

export type Block =
  | { kind: "text"; md: string }
  | { kind: "definition"; term: string; md: string }
  | {
      kind: "callout";
      tone: "tip" | "note" | "warning" | "info";
      title?: string;
      md: string;
    }
  | { kind: "code"; example: CodeExample }
  | { kind: "diagram"; name: DiagramName; caption?: string }
  | { kind: "table"; caption?: string; headers: string[]; rows: string[][] }
  /** An inline "check your understanding" question inside the lesson body. */
  | { kind: "question"; question: QuizQuestion }
  | { kind: "steps"; title?: string; items: string[] };

export interface LessonSection {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Mistake {
  title: string;
  /** Code that contains the mistake. */
  wrong: string;
  /**
   * The exact error/warning text R prints for `wrong` (a distinctive
   * substring is enough, e.g. "object 'Scores' not found"). Leave undefined
   * for mistakes that produce wrong results silently (logic mistakes).
   */
  error?: string;
  /** Why it happens, in plain English (markdown). */
  why: string;
  /** Corrected code. */
  right: string;
}

/* ------------------------------------------------------------------ */
/* Quizzes                                                             */
/* ------------------------------------------------------------------ */

interface QuestionBase {
  /** Unique across the whole site, e.g. "m2-l1-q3". */
  id: string;
  prompt: string;
  /** Why the correct answer is correct (markdown). */
  explanation: string;
  /** Concept tag used for adaptive "review this" recommendations. */
  concept?: string;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: "multiple-choice";
  code?: string;
  options: string[];
  /** Index into options. */
  answer: number;
  /** Optional feedback per option (why each wrong option is wrong). */
  optionFeedback?: string[];
}

export interface PredictOutputQuestion extends QuestionBase {
  type: "predict-output";
  /** Code whose output the learner predicts. Verified automatically. */
  code: string;
  /** Options are exact console outputs, e.g. "[1] 6". */
  options: string[];
  answer: number;
  optionFeedback?: string[];
}

export interface FillBlankQuestion extends QuestionBase {
  type: "fill-blank";
  /** Code containing exactly one `___` placeholder. */
  code: string;
  /** Accepted answers (compared after trimming; whitespace-insensitive). */
  accept: string[];
  hint?: string;
}

export interface FindErrorQuestion extends QuestionBase {
  type: "find-error";
  /** Code with a mistake on one line. The learner clicks the faulty line. */
  code: string;
  /** 1-based line number of the mistake. */
  errorLine: number;
  /**
   * "error" = R stops with an error on that line (verified automatically);
   * "logic" = the code runs but gives the wrong result.
   */
  errorKind: "error" | "logic";
  /** Corrected version of the code. */
  fix: string;
}

export interface TrueFalseQuestion extends QuestionBase {
  type: "true-false";
  code?: string;
  answer: boolean;
}

export type QuizQuestion =
  | MultipleChoiceQuestion
  | PredictOutputQuestion
  | FillBlankQuestion
  | FindErrorQuestion
  | TrueFalseQuestion;

/* ------------------------------------------------------------------ */
/* Exercises                                                           */
/* ------------------------------------------------------------------ */

/**
 * An automated test for an exercise. `check` is an R expression that must
 * evaluate to TRUE. It is evaluated in an environment that can see every
 * variable the learner's code created, plus these helpers:
 *
 *   .out          – character(1): everything the learner's code printed
 *   .error        – NULL, or the error message if the code stopped with an error
 *   .plots        – integer: number of plots drawn
 *   .code         – character(1): the learner's source code
 *   .defined("x") – TRUE if the learner's code created a variable named x
 *   .has_geom(p, "GeomPoint") – TRUE if ggplot `p` has a layer with that geom
 *
 * Prefer checking *values* (so any correct solution passes) over checking
 * the code text. Use `isTRUE(all.equal(a, b))` for numbers.
 */
export interface ExerciseTest {
  /** Short description shown to the learner, e.g. "`total` equals 60". */
  name: string;
  /** R expression returning TRUE when the requirement is met. */
  check: string;
  /** Friendly, specific hint shown when this test fails. */
  failMessage: string;
}

export interface Exercise {
  /** Unique across the site, e.g. "m2-variables-easy". */
  id: string;
  title: string;
  difficulty: Difficulty;
  /** Module number 1–10. */
  module: number;
  /** Lesson id this exercise practises (optional). */
  lesson?: string;
  concepts?: string[];
  /** Problem description (markdown). */
  prompt: string;
  starterCode: string;
  /** Expected behaviour / result (markdown). */
  expected: string;
  /** Progressive hints – gentle first, nearly-the-answer last. */
  hints: string[];
  /** A correct solution. Verified: it must pass every test. */
  solution: string;
  /** Detailed explanation of the solution (markdown). */
  explanation: string;
  tests: ExerciseTest[];
  packages?: string[];
  datasets?: string[];
}

/* ------------------------------------------------------------------ */
/* Lessons, modules, curriculum                                        */
/* ------------------------------------------------------------------ */

export interface Lesson {
  /** Globally unique kebab-case slug, used in the URL. */
  id: string;
  module: number;
  title: string;
  /** One-sentence description for lesson cards. */
  summary: string;
  /** Estimated minutes. */
  minutes: number;
  /** Learning objectives. The first is the main objective. */
  objectives: string[];
  /** The simple, plain-English explanation of the topic (markdown). */
  intro: string;
  /** Detailed concept sections with examples. */
  sections: LessonSection[];
  /** Common beginner mistakes. */
  mistakes: Mistake[];
  /** Ids of exercises (defined in the module's `exercises`). */
  exerciseIds: string[];
  /** End-of-lesson quiz (3–6 questions, mixed types). */
  quiz: QuizQuestion[];
  /** Summary of key concepts (one sentence each). */
  keyPoints: string[];
  /** Concept tags covered (for adaptive recommendations). */
  concepts?: string[];
  /** Glossary slugs introduced in this lesson. */
  glossary?: string[];
  /** Starter code shown in the lesson's side playground. */
  playground: string;
  /** Lesson ids that should be completed first. */
  prerequisites?: string[];
  datasets?: string[];
  packages?: string[];
}

export interface Module {
  number: number;
  /** kebab-case slug */
  id: string;
  stage: StageNumber;
  title: string;
  description: string;
  /** Topics covered (for the learning path & roadmap). */
  topics: string[];
  lessons: Lesson[];
  exercises: Exercise[];
  /** Module checkpoint – a short assessment after the module (4–6 questions). */
  checkpoint: QuizQuestion[];
}

export interface Stage {
  number: StageNumber;
  title: string;
  subtitle: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export interface ProjectStep {
  id: string;
  title: string;
  /** Instructions (markdown). */
  instructions: string;
  /**
   * Starter code. Each step's code runs after the previous steps' solutions,
   * so a step can use variables created earlier in the project.
   */
  starterCode: string;
  hints: string[];
  solution: string;
  explanation: string;
  /** Checkpoint tests (same format as exercise tests). */
  tests: ExerciseTest[];
}

export interface Project {
  id: string;
  title: string;
  level: "beginner" | "intermediate" | "capstone";
  summary: string;
  /** Background story / goal (markdown). */
  intro: string;
  /** Dataset ids used (see src/content/datasets.ts). */
  datasets: string[];
  skills: string[];
  /** Estimated minutes. */
  minutes: number;
  packages?: string[];
  steps: ProjectStep[];
  /** Closing reflection: what was learned, ideas to go further (markdown). */
  wrapUp: string;
}

/* ------------------------------------------------------------------ */
/* Reference material                                                  */
/* ------------------------------------------------------------------ */

export interface RFunction {
  /** e.g. "mean" */
  name: string;
  /** "base", "stats", "utils", "dplyr", "ggplot2", "tidyr", … */
  package: string;
  category: string;
  purpose: string;
  /** Usage signature, e.g. "mean(x, trim = 0, na.rm = FALSE)" */
  syntax: string;
  args: { name: string; description: string }[];
  example: string;
  /** Exact console output of `example` (verified). */
  output: string;
  mistakes: string[];
  related: string[];
  /** The example draws a plot (output may then be empty). */
  plot?: boolean;
}

export interface CheatSheet {
  id: string;
  title: string;
  description: string;
  sections: {
    title: string;
    items: { code: string; description: string }[];
  }[];
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  category: "programming" | "r" | "data" | "statistics";
  /** Plain-English definition (markdown). */
  definition: string;
  /** Optional short R example. */
  example?: string;
  related?: string[];
}

export interface DatasetInfo {
  id: string;
  name: string;
  /** Path to read it from inside R, e.g. "data/students.csv". */
  path: string;
  description: string;
  rows: number;
  columns: { name: string; type: string; description: string }[];
  /** Built-in R dataset (no file) vs. a CSV shipped with R Academy. */
  source: "r-academy" | "built-in";
}
