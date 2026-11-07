/**
 * XP, levels and daily challenges.
 *
 * XP is *derived* from real progress (completed lessons, passed exercises,
 * correct answers …) instead of being stored separately. That means XP can
 * never be double-counted, existing progress is rewarded automatically, and
 * account sync needs nothing extra.
 */
// Imported by server components too, so only the store's *types* are used here.
import type { ProgressState } from "../store/progress";
import { allOutlineLessons, type Outline } from "../store/derived";
import { todayKey } from "../utils";
import { moduleOrder } from "./worlds";

export const XP = {
  lesson: 50,
  exercise: { easy: 15, medium: 25, challenge: 40 } as Record<string, number>,
  /** Correct on the first try / after a retry. */
  question: 5,
  questionRetry: 2,
  checkpoint: 100,
  projectStep: 30,
  projectComplete: 100,
  daily: 50,
};

export interface XpEvent {
  at: number;
  amount: number;
  reason: string;
}

export function exerciseXp(difficulty: string, solutionViewed?: boolean) {
  const base = XP.exercise[difficulty] ?? 15;
  return solutionViewed ? Math.round(base / 2) : base;
}

/** Every XP-earning event, derived from progress. */
export function xpEvents(s: ProgressState, o: Outline): XpEvent[] {
  const ev: XpEvent[] = [];
  const titles = new Map(allOutlineLessons(o).map((l) => [l.id, l.title]));
  for (const [id, l] of Object.entries(s.lessons)) if (l.completedAt) ev.push({ at: l.completedAt, amount: XP.lesson, reason: `Lesson: ${titles.get(id) ?? id}` });
  const diff = new Map(o.modules.flatMap((m) => m.exercises.map((e) => [e.id, e] as const)));
  for (const [id, e] of Object.entries(s.exercises)) {
    if (!e.passedAt) continue;
    const meta = diff.get(id);
    ev.push({ at: e.passedAt, amount: exerciseXp(meta?.difficulty ?? "easy", e.solutionViewed), reason: `Exercise: ${meta?.title ?? id}` });
  }
  for (const q of Object.values(s.questions)) if (q.correct) ev.push({ at: q.at, amount: q.attempts <= 1 ? XP.question : XP.questionRetry, reason: "Correct answer" });
  for (const [n, c] of Object.entries(s.checkpoints)) if (c.passedAt) ev.push({ at: c.passedAt, amount: XP.checkpoint, reason: `Module ${n} checkpoint` });
  for (const p of o.projects) {
    const ps = s.projects[p.id];
    if (!ps) continue;
    let last = 0;
    for (const st of p.stepIds) {
      const at = ps.steps[st]?.passedAt;
      if (at) {
        ev.push({ at, amount: XP.projectStep, reason: `Project step: ${p.title}` });
        last = Math.max(last, at);
      }
    }
    if (p.stepIds.length && p.stepIds.every((st) => ps.steps[st]?.passedAt)) ev.push({ at: last, amount: XP.projectComplete, reason: `Project complete: ${p.title}` });
  }
  for (const d of Object.values(s.daily ?? {})) if (d.completedAt) ev.push({ at: d.completedAt, amount: XP.daily, reason: "Daily challenge" });
  return ev;
}

export function totalXp(s: ProgressState, o: Outline): number {
  return xpEvents(s, o).reduce((a, e) => a + e.amount, 0);
}

/* ------------------------------- levels ------------------------------- */

/** XP needed to reach a level: 0, 100, 300, 600, 1000, 1500, … */
export function levelThreshold(level: number): number {
  return 50 * level * (level - 1);
}

const TITLES: [number, string][] = [
  [1, "R Rookie"],
  [2, "R Explorer"],
  [4, "Data Adventurer"],
  [6, "Logic Builder"],
  [8, "Data Wizard"],
  [10, "Visualization Creator"],
  [12, "Statistics Detective"],
  [14, "R Pro"],
  [18, "R Legend"],
];

export function levelTitle(level: number): string {
  let t = TITLES[0][1];
  for (const [l, name] of TITLES) if (level >= l) t = name;
  return t;
}

export interface LevelInfo {
  level: number;
  title: string;
  xp: number;
  /** XP at the start of this level and needed for the next. */
  floor: number;
  next: number;
  /** 0–100 progress towards the next level. */
  pct: number;
}

export function levelInfo(xp: number): LevelInfo {
  let level = 1;
  while (xp >= levelThreshold(level + 1)) level++;
  const floor = levelThreshold(level);
  const next = levelThreshold(level + 1);
  return { level, title: levelTitle(level), xp, floor, next, pct: Math.round(((xp - floor) / (next - floor)) * 100) };
}

/* ------------------------------ daily XP ------------------------------ */

export function xpOnDay(events: XpEvent[], day: string): number {
  return events.filter((e) => todayKey(new Date(e.at)) === day).reduce((a, e) => a + e.amount, 0);
}

/** XP per day for the last `n` days, oldest first. */
export function xpByDay(events: XpEvent[], n = 7): { day: string; label: string; xp: number }[] {
  const out: { day: string; label: string; xp: number }[] = [];
  const d = new Date();
  d.setDate(d.getDate() - (n - 1));
  for (let i = 0; i < n; i++) {
    const day = todayKey(d);
    out.push({ day, label: d.toLocaleDateString(undefined, { weekday: "short" }), xp: xpOnDay(events, day) });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/* --------------------------- daily challenge --------------------------- */

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Pick today's challenge: an exercise from the modules the learner has reached
 * (so it is always doable), preferring ones not yet passed. Deterministic for
 * a given day, so it does not change on reload.
 */
export function pickDailyChallenge(day: string, s: ProgressState, o: Outline): string | null {
  const ordered = [...o.modules].sort((a, b) => moduleOrder.indexOf(a.number) - moduleOrder.indexOf(b.number));
  let reached = 0;
  ordered.forEach((m, i) => {
    if (m.lessons.some((l) => s.lessons[l.id]?.completedAt || s.lessons[l.id]?.visitedAt)) reached = i;
  });
  const pool = ordered.slice(0, reached + 1).flatMap((m) => m.exercises);
  if (!pool.length) return null;
  const fresh = pool.filter((e) => !s.exercises[e.id]?.passedAt);
  const list = fresh.length ? fresh : pool;
  return list[hash(day) % list.length].id;
}

export function todaysChallenge(s: ProgressState, o: Outline) {
  const day = todayKey();
  const stored = s.daily?.[day];
  const id = stored?.exerciseId ?? pickDailyChallenge(day, s, o);
  return { day, exerciseId: id, completed: Boolean(stored?.completedAt), stored: Boolean(stored) };
}

/* ------------------------- encouragement copy -------------------------- */

const PRAISE = ["Brilliant!", "You nailed it!", "Great job!", "Spot on!", "Excellent work!", "That's exactly right!", "Superb!", "You're on fire!"];
const ENCOURAGE = [
  "Almost! Mistakes are how programmers learn – let's look at why.",
  "Not quite – but you're close. Read the explanation and try again.",
  "Every R programmer sees this. Take a breath and give it another go!",
  "Good try! Check the hint below – you've got this.",
  "Nearly there. Small details matter in code – let's find the one that slipped.",
];

export function praise(seed = Date.now()) {
  return PRAISE[seed % PRAISE.length];
}
export function encourage(seed = Date.now()) {
  return ENCOURAGE[seed % ENCOURAGE.length];
}
