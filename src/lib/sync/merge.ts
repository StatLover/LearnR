/**
 * Merge two copies of learner progress (this browser + the account) without
 * losing work from either: completions and passes are kept, best scores win,
 * lists are unioned, and for text (notes, code) the newest version wins.
 */
import type { ProgressState } from "../store/progress";

const minDefined = (a?: number, b?: number) => (a === undefined ? b : b === undefined ? a : Math.min(a, b));
const maxDefined = (a?: number, b?: number) => (a === undefined ? b : b === undefined ? a : Math.max(a, b));

function mergeRecord<T>(a: Record<string, T>, b: Record<string, T>, f: (x: T | undefined, y: T | undefined) => T): Record<string, T> {
  const out: Record<string, T> = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) out[k] = f(a[k], b[k]);
  return out;
}

export function mergeProgress(local: ProgressState, remote: ProgressState): ProgressState {
  const newer = local.updatedAt >= remote.updatedAt ? local : remote;
  return {
    ...newer,
    profile: { ...remote.profile, ...local.profile, onboarded: local.profile.onboarded || remote.profile.onboarded },
    lessons: mergeRecord(local.lessons, remote.lessons, (x = {}, y = {}) => ({
      visitedAt: maxDefined(x.visitedAt, y.visitedAt),
      completedAt: minDefined(x.completedAt, y.completedAt),
      quizBest: maxDefined(x.quizBest, y.quizBest),
      quizAttempts: Math.max(x.quizAttempts ?? 0, y.quizAttempts ?? 0),
      unlocked: x.unlocked || y.unlocked,
    })),
    questions: mergeRecord(local.questions, remote.questions, (x, y) => ({
      correct: Boolean(x?.correct || y?.correct),
      attempts: Math.max(x?.attempts ?? 0, y?.attempts ?? 0),
      at: Math.max(x?.at ?? 0, y?.at ?? 0),
    })),
    exercises: mergeRecord(local.exercises, remote.exercises, (x, y) => {
      const newest = (x?.attempts ?? 0) >= (y?.attempts ?? 0) ? x : y;
      return {
        attempts: Math.max(x?.attempts ?? 0, y?.attempts ?? 0),
        passedAt: minDefined(x?.passedAt, y?.passedAt),
        hintsUsed: Math.max(x?.hintsUsed ?? 0, y?.hintsUsed ?? 0),
        solutionViewed: Boolean(x?.solutionViewed || y?.solutionViewed),
        code: newest?.code ?? x?.code ?? y?.code,
      };
    }),
    checkpoints: mergeRecord(local.checkpoints, remote.checkpoints, (x, y) => ({
      best: Math.max(x?.best ?? 0, y?.best ?? 0),
      attempts: Math.max(x?.attempts ?? 0, y?.attempts ?? 0),
      passedAt: minDefined(x?.passedAt, y?.passedAt),
    })),
    projects: mergeRecord(local.projects, remote.projects, (x, y) => ({
      startedAt: minDefined(x?.startedAt, y?.startedAt) ?? Date.now(),
      steps: mergeRecord(x?.steps ?? {}, y?.steps ?? {}, (s, t) => ({ passedAt: minDefined(s?.passedAt, t?.passedAt), code: s?.code ?? t?.code })),
    })),
    concepts: mergeRecord(local.concepts, remote.concepts, (x, y) => ({ right: Math.max(x?.right ?? 0, y?.right ?? 0), wrong: Math.max(x?.wrong ?? 0, y?.wrong ?? 0) })),
    recent: [...local.recent, ...remote.recent]
      .sort((a, b) => b.at - a.at)
      .filter((r, i, arr) => arr.findIndex((z) => z.kind === r.kind && z.id === r.id) === i)
      .slice(0, 12),
    activityDays: [...new Set([...local.activityDays, ...remote.activityDays])].sort(),
    bookmarks: [...local.bookmarks, ...remote.bookmarks.filter((b) => !local.bookmarks.some((x) => x.id === b.id))],
    notes: mergeRecord(local.notes, remote.notes, (x, y) => ((x?.updatedAt ?? 0) >= (y?.updatedAt ?? 0) ? x! : y!)),
    snippets: [...local.snippets, ...remote.snippets.filter((s) => !local.snippets.some((x) => x.id === s.id))].sort((a, b) => b.updatedAt - a.updatedAt),
    achievements: mergeRecord(local.achievements, remote.achievements, (x, y) => minDefined(x, y) ?? Date.now()),
    stats: {
      codeRuns: Math.max(local.stats.codeRuns, remote.stats.codeRuns),
      errorsAnalyzed: Math.max(local.stats.errorsAnalyzed, remote.stats.errorsAnalyzed),
      fixesApplied: Math.max(local.stats.fixesApplied, remote.stats.fixesApplied),
      tutorMessages: Math.max(local.stats.tutorMessages, remote.stats.tutorMessages),
    },
    daily: mergeRecord(local.daily ?? {}, remote.daily ?? {}, (x, y) => ({ exerciseId: (x ?? y)!.exerciseId, completedAt: minDefined(x?.completedAt, y?.completedAt) })),
    lessonSteps: mergeRecord(local.lessonSteps ?? {}, remote.lessonSteps ?? {}, (x, y) => ((x?.max ?? 0) >= (y?.max ?? 0) ? x! : y!)),
    updatedAt: Math.max(local.updatedAt, remote.updatedAt),
    version: 1,
  };
}
