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
  /** Daily challenge per day (YYYY-MM-DD): which exercise, and when it was solved. */
  daily: Record<string, { exerciseId: string; completedAt?: number }>;
  /** Where the learner is inside each lesson (card index) and the furthest card reached. */
  lessonSteps: Record<string, { at: number; max: number }>;
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
  daily: {},
  lessonSteps: {},
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
    daily: r.daily ?? {},
    lessonSteps: r.lessonSteps ?? {},
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
      const today = todayKey();
      const d = s.daily[today];
      const daily = passed && d?.exerciseId === id && !d.completedAt ? { ...s.daily, [today]: { ...d, completedAt: Date.now() } } : s.daily;
      return {
        ...s,
        daily,
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

  setLessonStep(id: string, at: number) {
    update((s) => {
      const prev = s.lessonSteps[id];
      return { ...s, lessonSteps: { ...s.lessonSteps, [id]: { at, max: Math.max(prev?.max ?? 0, at) } } };
    }, false);
  },

  /** Fix today's daily challenge (called once per day when it is first shown). */
  setDailyChallenge(date: string, exerciseId: string) {
    update((s) => (s.daily[date] ? s : { ...s, daily: { ...s.daily, [date]: { exerciseId } } }), false);
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

export * from "./derived";
