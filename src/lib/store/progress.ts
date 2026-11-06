/**
 * Learner progress, stored in localStorage for guests and optionally synced to
 * an account (see src/lib/sync). Nothing here imports course content, so the
 * store stays tiny; functions that need the course outline take it as input.
 */
import { createPersistedStore, useStore } from "./create-store";
import { todayKey, uid } from "../utils";

export interface LessonProgress {
  visitedAt?: number;
  completedAt?: number;
  /** Best quiz score as a fraction 0–1. */
  quizBest?: number;
  quizAttempts?: number;
  unlocked?: boolean;
}

export interface ExerciseProgress {
  attempts: number;
  passedAt?: number;
  hintsUsed: number;
  solutionViewed?: boolean;
  code?: string;
}

export interface Bookmark {
  id: string;
  kind: "lesson" | "exercise" | "project" | "function" | "example" | "cheatsheet";
  title: string;
  href: string;
  at: number;
}

export interface Snippet {
  id: string;
  title: string;
  code: string;
  source?: string;
  createdAt: number;
  updatedAt: number;
}

export interface RecentItem {
  kind: "lesson" | "exercise" | "project";
  id: string;
  title: string;
  href: string;
  at: number;
}

export interface Profile {
  name?: string;
  programming?: "none" | "some" | "experienced";
  statistics?: "none" | "some" | "confident";
  goal?: "career" | "study" | "research" | "curiosity" | "work";
  onboarded: boolean;
}

export interface ProgressState {
  version: 1;
  profile: Profile;
  lessons: Record<string, LessonProgress>;
  questions: Record<string, { correct: boolean; attempts: number; at: number }>;
  exercises: Record<string, ExerciseProgress>;
  checkpoints: Record<string, { best: number; attempts: number; passedAt?: number }>;
  projects: Record<string, { steps: Record<string, { passedAt?: number; code?: string }>; startedAt: number }>;
  concepts: Record<string, { right: number; wrong: number }>;
  recent: RecentItem[];
  activityDays: string[];
  bookmarks: Bookmark[];
  notes: Record<string, { text: string; updatedAt: number }>;
  snippets: Snippet[];
  achievements: Record<string, number>;
  stats: { codeRuns: number; errorsAnalyzed: number; fixesApplied: number; tutorMessages: number };
  updatedAt: number;
}

export const emptyProgress = (): ProgressState => ({
  version: 1,
  profile: { onboarded: false },
  lessons: {},
  questions: {},
  exercises: {},
  checkpoints: {},
  projects: {},
  concepts: {},
  recent: [],
  activityDays: [],
  bookmarks: [],
  notes: {},
  snippets: [],
  achievements: {},
  stats: { codeRuns: 0, errorsAnalyzed: 0, fixesApplied: 0, tutorMessages: 0 },
  updatedAt: 0,
});

export const PROGRESS_KEY = "ra-progress";

function migrate(raw: unknown): ProgressState {
  const base = emptyProgress();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<ProgressState>;
  return {
    ...base,
    ...r,
    profile: { ...base.profile, ...(r.profile ?? {}) },
    stats: { ...base.stats, ...(r.stats ?? {}) },
    version: 1,
  };
}

export const progressStore = createPersistedStore<ProgressState>(PROGRESS_KEY, emptyProgress, migrate);

export function useProgress() {
  return useStore(progressStore);
}

/** Update progress; also records today as an active learning day. */
function update(fn: (s: ProgressState) => ProgressState, activity = true) {
  progressStore.set((s) => {
    const next = fn(s);
    const today = todayKey();
    const activityDays = activity && !next.activityDays.includes(today) ? [...next.activityDays, today].slice(-400) : next.activityDays;
    return { ...next, activityDays, updatedAt: Date.now() };
  });
}

function pushRecent(list: RecentItem[], item: RecentItem) {
  return [item, ...list.filter((r) => !(r.kind === item.kind && r.id === item.id))].slice(0, 12);
}

/* --------------------------- actions --------------------------- */

export const progress = {
  setProfile(p: Partial<Profile>) {
    update((s) => ({ ...s, profile: { ...s.profile, ...p } }), false);
  },

  visitLesson(id: string, title: string) {
    update((s) => ({
      ...s,
      lessons: { ...s.lessons, [id]: { ...s.lessons[id], visitedAt: Date.now() } },
      recent: pushRecent(s.recent, { kind: "lesson", id, title, href: `/learn/${id}`, at: Date.now() }),
    }));
  },

  unlockLesson(id: string) {
    update((s) => ({ ...s, lessons: { ...s.lessons, [id]: { ...s.lessons[id], unlocked: true } } }), false);
  },

  setLessonComplete(id: string, complete: boolean) {
    update((s) => ({
      ...s,
      lessons: { ...s.lessons, [id]: { ...s.lessons[id], completedAt: complete ? Date.now() : undefined } },
    }));
  },

  recordQuestion(id: string, correct: boolean, concept?: string) {
    update((s) => {
      const prev = s.questions[id];
      const concepts = { ...s.concepts };
      // Count a concept only on the first attempt of a question so retries do not skew it.
      if (concept && !prev) {
        const c = concepts[concept] ?? { right: 0, wrong: 0 };
        concepts[concept] = correct ? { ...c, right: c.right + 1 } : { ...c, wrong: c.wrong + 1 };
      }
      return {
        ...s,
        concepts,
        questions: { ...s.questions, [id]: { correct: prev?.correct || correct, attempts: (prev?.attempts ?? 0) + 1, at: Date.now() } },
      };
    });
  },

  recordQuiz(lessonId: string, score: number) {
    update((s) => {
      const l = s.lessons[lessonId] ?? {};
      return {
        ...s,
        lessons: {
          ...s.lessons,
          [lessonId]: { ...l, quizBest: Math.max(l.quizBest ?? 0, score), quizAttempts: (l.quizAttempts ?? 0) + 1 },
        },
      };
    });
  },

  recordCheckpoint(moduleNumber: number, score: number, passMark = 0.7) {
    update((s) => {
      const key = String(moduleNumber);
      const c = s.checkpoints[key] ?? { best: 0, attempts: 0 };
      return {
        ...s,
        checkpoints: {
          ...s.checkpoints,
          [key]: { best: Math.max(c.best, score), attempts: c.attempts + 1, passedAt: c.passedAt ?? (score >= passMark ? Date.now() : undefined) },
        },
      };
    });
  },

  recordExerciseAttempt(id: string, title: string, passed: boolean, code: string) {
    update((s) => {
      const e = s.exercises[id] ?? { attempts: 0, hintsUsed: 0 };
      return {
        ...s,
        exercises: { ...s.exercises, [id]: { ...e, attempts: e.attempts + 1, passedAt: e.passedAt ?? (passed ? Date.now() : undefined), code } },
        recent: pushRecent(s.recent, { kind: "exercise", id, title, href: `/exercises/${id}`, at: Date.now() }),
      };
    });
  },

  saveExerciseCode(id: string, code: string) {
    update((s) => {
      const e = s.exercises[id] ?? { attempts: 0, hintsUsed: 0 };
      return { ...s, exercises: { ...s.exercises, [id]: { ...e, code } } };
    }, false);
  },

  useHint(id: string, level: number) {
    update((s) => {
      const e = s.exercises[id] ?? { attempts: 0, hintsUsed: 0 };
      return { ...s, exercises: { ...s.exercises, [id]: { ...e, hintsUsed: Math.max(e.hintsUsed, level) } } };
    }, false);
  },

  viewSolution(id: string) {
    update((s) => {
      const e = s.exercises[id] ?? { attempts: 0, hintsUsed: 0 };
      return { ...s, exercises: { ...s.exercises, [id]: { ...e, solutionViewed: true } } };
    }, false);
  },

  recordProjectStep(projectId: string, title: string, stepId: string, passed: boolean, code: string) {
    update((s) => {
      const p = s.projects[projectId] ?? { steps: {}, startedAt: Date.now() };
      const st = p.steps[stepId] ?? {};
      return {
        ...s,
        projects: {
          ...s.projects,
          [projectId]: { ...p, steps: { ...p.steps, [stepId]: { ...st, code, passedAt: st.passedAt ?? (passed ? Date.now() : undefined) } } },
        },
        recent: pushRecent(s.recent, { kind: "project", id: projectId, title, href: `/projects/${projectId}`, at: Date.now() }),
      };
    });
  },

  saveProjectCode(projectId: string, stepId: string, code: string) {
    update((s) => {
      const p = s.projects[projectId] ?? { steps: {}, startedAt: Date.now() };
      return { ...s, projects: { ...s.projects, [projectId]: { ...p, steps: { ...p.steps, [stepId]: { ...p.steps[stepId], code } } } } };
    }, false);
  },

  toggleBookmark(b: Omit<Bookmark, "at">) {
    update((s) => {
      const exists = s.bookmarks.some((x) => x.id === b.id);
      return { ...s, bookmarks: exists ? s.bookmarks.filter((x) => x.id !== b.id) : [{ ...b, at: Date.now() }, ...s.bookmarks] };
    }, false);
  },

  setNote(lessonId: string, text: string) {
    update((s) => {
      const notes = { ...s.notes };
      if (text.trim()) notes[lessonId] = { text, updatedAt: Date.now() };
      else delete notes[lessonId];
      return { ...s, notes };
    }, false);
  },

  saveSnippet(title: string, code: string, source?: string): string {
    const id = uid("snip_");
    update((s) => ({ ...s, snippets: [{ id, title, code, source, createdAt: Date.now(), updatedAt: Date.now() }, ...s.snippets].slice(0, 200) }), false);
    return id;
  },

  updateSnippet(id: string, patch: Partial<Pick<Snippet, "title" | "code">>) {
    update((s) => ({ ...s, snippets: s.snippets.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: Date.now() } : x)) }), false);
  },

  deleteSnippet(id: string) {
    update((s) => ({ ...s, snippets: s.snippets.filter((x) => x.id !== id) }), false);
  },

  bumpStat(key: keyof ProgressState["stats"]) {
    update((s) => ({ ...s, stats: { ...s.stats, [key]: s.stats[key] + 1 } }), key !== "tutorMessages");
  },

  grantAchievements(ids: string[]) {
    if (!ids.length) return;
    update((s) => {
      const a = { ...s.achievements };
      for (const id of ids) if (!a[id]) a[id] = Date.now();
      return { ...s, achievements: a };
    }, false);
  },

  reset() {
    progressStore.replace({ ...emptyProgress(), profile: progressStore.get().profile });
  },

  importState(raw: unknown) {
    progressStore.replace(migrate(raw));
  },
};

/* --------------------------- derived data --------------------------- */

export interface OutlineLesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  module: number;
  concepts: string[];
  exerciseIds: string[];
}
export interface OutlineModule {
  number: number;
  id: string;
  stage: number;
  title: string;
  description: string;
  topics: string[];
  lessons: OutlineLesson[];
  exercises: { id: string; title: string; difficulty: string }[];
  checkpointSize: number;
}
export interface Outline {
  modules: OutlineModule[];
  projects: { id: string; title: string; stepIds: string[]; level: string }[];
}

export function allOutlineLessons(o: Outline) {
  return o.modules.flatMap((m) => m.lessons);
}

export function currentStreak(days: string[], today = todayKey()): number {
  if (!days.length) return 0;
  const set = new Set(days);
  const d = new Date(today + "T12:00:00");
  // The streak is still alive if the learner was active yesterday but not yet today.
  if (!set.has(todayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(todayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function longestStreak(days: string[]): number {
  const sorted = [...new Set(days)].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of sorted) {
    const d = new Date(k + "T12:00:00");
    run = prev && Math.round((d.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export function isLessonUnlocked(o: Outline, s: ProgressState, lessonId: string, mode: "guided" | "free"): boolean {
  if (mode === "free") return true;
  const lessons = allOutlineLessons(o);
  const i = lessons.findIndex((l) => l.id === lessonId);
  if (i <= 0) return true;
  const lp = s.lessons[lessonId];
  if (lp?.unlocked || lp?.completedAt) return true;
  if (s.profile.programming === "experienced") return true;
  return Boolean(s.lessons[lessons[i - 1].id]?.completedAt);
}

export function suggestedNextLesson(o: Outline, s: ProgressState): OutlineLesson | undefined {
  const lessons = allOutlineLessons(o);
  return lessons.find((l) => !s.lessons[l.id]?.completedAt) ?? undefined;
}

export function courseCompletion(o: Outline, s: ProgressState) {
  const lessons = allOutlineLessons(o);
  const done = lessons.filter((l) => s.lessons[l.id]?.completedAt).length;
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}

export function moduleCompletion(m: OutlineModule, s: ProgressState) {
  const done = m.lessons.filter((l) => s.lessons[l.id]?.completedAt).length;
  return { done, total: m.lessons.length, pct: m.lessons.length ? Math.round((done / m.lessons.length) * 100) : 0 };
}

/** Concepts the learner is struggling with (≥ 2 wrong first attempts and ≥ 40% wrong). */
export function weakConcepts(s: ProgressState): { concept: string; wrong: number; right: number }[] {
  return Object.entries(s.concepts)
    .filter(([, v]) => v.wrong >= 2 && v.wrong / (v.wrong + v.right) >= 0.4)
    .map(([concept, v]) => ({ concept, ...v }))
    .sort((a, b) => b.wrong - a.wrong);
}

/* --------------------------- achievements --------------------------- */

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (s: ProgressState, o: Outline) => boolean;
}

const passedExercises = (s: ProgressState) => Object.values(s.exercises).filter((e) => e.passedAt).length;
const completedLessons = (s: ProgressState) => Object.values(s.lessons).filter((l) => l.completedAt).length;

export const achievements: AchievementDef[] = [
  { id: "first-run", title: "First Run", description: "Ran your first line of R code.", icon: "play", check: (s) => s.stats.codeRuns >= 1 },
  { id: "first-lesson", title: "Hello, R!", description: "Completed your first lesson.", icon: "book-open", check: (s) => completedLessons(s) >= 1 },
  { id: "five-lessons", title: "On a Roll", description: "Completed five lessons.", icon: "flame", check: (s) => completedLessons(s) >= 5 },
  { id: "first-exercise", title: "Problem Solver", description: "Passed your first exercise.", icon: "check-circle", check: (s) => passedExercises(s) >= 1 },
  { id: "ten-exercises", title: "Practice Makes Progress", description: "Passed ten exercises.", icon: "dumbbell", check: (s) => passedExercises(s) >= 10 },
  {
    id: "challenge",
    title: "Challenge Accepted",
    description: "Passed a challenge-level exercise.",
    icon: "mountain",
    check: (s, o) => o.modules.some((m) => m.exercises.some((e) => e.difficulty === "challenge" && s.exercises[e.id]?.passedAt)),
  },
  { id: "perfect-quiz", title: "Perfect Score", description: "Answered every question of a lesson quiz correctly.", icon: "star", check: (s) => Object.values(s.lessons).some((l) => (l.quizBest ?? 0) >= 1) },
  { id: "checkpoint", title: "Checkpoint Cleared", description: "Passed a module checkpoint.", icon: "flag", check: (s) => Object.values(s.checkpoints).some((c) => c.passedAt) },
  { id: "debugger", title: "Bug Hunter", description: "Used the Error Checker to analyse an error.", icon: "bug", check: (s) => s.stats.errorsAnalyzed >= 1 },
  {
    id: "stage-1",
    title: "Foundations Complete",
    description: "Completed every lesson in Stage 1.",
    icon: "trophy",
    check: (s, o) => {
      const ls = o.modules.filter((m) => m.stage === 1).flatMap((m) => m.lessons);
      return ls.length > 0 && ls.every((l) => s.lessons[l.id]?.completedAt);
    },
  },
  {
    id: "project",
    title: "Data Detective",
    description: "Completed every step of a guided project.",
    icon: "search",
    check: (s, o) => o.projects.some((p) => p.stepIds.length > 0 && p.stepIds.every((st) => s.projects[p.id]?.steps[st]?.passedAt)),
  },
  { id: "streak-3", title: "Three-Day Streak", description: "Learned on three days in a row.", icon: "calendar", check: (s) => longestStreak(s.activityDays) >= 3 },
  { id: "streak-7", title: "Week of R", description: "Learned on seven days in a row.", icon: "calendar-check", check: (s) => longestStreak(s.activityDays) >= 7 },
];

export function newlyEarned(s: ProgressState, o: Outline): string[] {
  return achievements.filter((a) => !s.achievements[a.id] && a.check(s, o)).map((a) => a.id);
}
