/**
 * Achievement badges. Each badge is checked against progress; earned badges
 * are stored with the date they were earned (progress.achievements).
 */
import { allOutlineLessons, currentStreak, longestStreak, type Outline, type ProgressState } from "../store/progress";
import { levelInfo, totalXp } from "./xp";
import { worlds } from "./worlds";

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  /** lucide icon name (see components/game/badge.tsx) */
  icon: string;
  /** CSS colour variable name, e.g. "mint" */
  color: string;
  group: "Getting started" | "Worlds" | "Practice" | "Consistency" | "Milestones";
  check: (s: ProgressState, o: Outline, xp: number) => boolean;
}

const passed = (s: ProgressState) => Object.values(s.exercises).filter((e) => e.passedAt).length;
const completed = (s: ProgressState) => Object.values(s.lessons).filter((l) => l.completedAt).length;
const dailies = (s: ProgressState) => Object.values(s.daily ?? {}).filter((d) => d.completedAt).length;

export const badges: BadgeDef[] = [
  { id: "first-run", title: "First Run", description: "Ran your first line of R code.", icon: "play", color: "mint", group: "Getting started", check: (s) => s.stats.codeRuns >= 1 },
  { id: "first-lesson", title: "Hello, R!", description: "Completed your first lesson.", icon: "book-open", color: "sky", group: "Getting started", check: (s) => completed(s) >= 1 },
  { id: "first-exercise", title: "Problem Solver", description: "Passed your first challenge.", icon: "check-circle", color: "grape", group: "Getting started", check: (s) => passed(s) >= 1 },
  { id: "debugger", title: "Bug Hunter", description: "Investigated an error with the Error Detective.", icon: "bug", color: "coral", group: "Getting started", check: (s) => s.stats.errorsAnalyzed >= 1 },
  { id: "curious", title: "Curious Mind", description: "Asked the AI tutor a question.", icon: "message-circle", color: "pink", group: "Getting started", check: (s) => s.stats.tutorMessages >= 1 },
  ...worlds.map<BadgeDef>((w) => ({
    id: `world-${w.id}`,
    title: w.name,
    description: `Completed every lesson in World ${w.number}: ${w.name}.`,
    icon: "map",
    color: w.color.main.replace(/^var\(--|\)$/g, ""),
    group: "Worlds",
    check: (s, o) => {
      const ls = o.modules.filter((m) => w.modules.includes(m.number)).flatMap((m) => m.lessons);
      return ls.length > 0 && ls.every((l) => s.lessons[l.id]?.completedAt);
    },
  })),
  { id: "five-lessons", title: "On a Roll", description: "Completed five lessons.", icon: "flame", color: "tangerine", group: "Practice", check: (s) => completed(s) >= 5 },
  { id: "ten-exercises", title: "Practice Pays", description: "Passed ten challenges.", icon: "dumbbell", color: "sky", group: "Practice", check: (s) => passed(s) >= 10 },
  {
    id: "challenge",
    title: "Summit",
    description: "Passed a challenge-level exercise.",
    icon: "mountain",
    color: "grape",
    group: "Practice",
    check: (s, o) => o.modules.some((m) => m.exercises.some((e) => e.difficulty === "challenge" && s.exercises[e.id]?.passedAt)),
  },
  { id: "perfect-quiz", title: "Perfect Score", description: "Got every quiz question in a lesson right.", icon: "star", color: "sun", group: "Practice", check: (s) => Object.values(s.lessons).some((l) => (l.quizBest ?? 0) >= 1) },
  { id: "checkpoint", title: "Checkpoint Cleared", description: "Passed a module checkpoint.", icon: "flag", color: "teal", group: "Practice", check: (s) => Object.values(s.checkpoints).some((c) => c.passedAt) },
  { id: "project", title: "Data Detective", description: "Completed a guided project.", icon: "search", color: "pink", group: "Practice", check: (s, o) => o.projects.some((p) => p.stepIds.length > 0 && p.stepIds.every((st) => s.projects[p.id]?.steps[st]?.passedAt)) },
  { id: "daily-1", title: "Daily Challenger", description: "Solved a daily challenge.", icon: "calendar", color: "sun", group: "Consistency", check: (s) => dailies(s) >= 1 },
  { id: "daily-7", title: "Challenge Seeker", description: "Solved seven daily challenges.", icon: "calendar-check", color: "tangerine", group: "Consistency", check: (s) => dailies(s) >= 7 },
  { id: "streak-3", title: "Warming Up", description: "Learned three days in a row.", icon: "flame", color: "coral", group: "Consistency", check: (s) => longestStreak(s.activityDays) >= 3 },
  { id: "streak-7", title: "Week of R", description: "Learned seven days in a row.", icon: "flame", color: "tangerine", group: "Consistency", check: (s) => longestStreak(s.activityDays) >= 7 },
  { id: "xp-500", title: "500 XP", description: "Earned 500 XP.", icon: "zap", color: "sun", group: "Milestones", check: (_s, _o, xp) => xp >= 500 },
  { id: "xp-2000", title: "2,000 XP", description: "Earned 2,000 XP.", icon: "zap", color: "tangerine", group: "Milestones", check: (_s, _o, xp) => xp >= 2000 },
  { id: "level-5", title: "Level 5", description: "Reached level 5.", icon: "trophy", color: "grape", group: "Milestones", check: (_s, _o, xp) => levelInfo(xp).level >= 5 },
  { id: "level-10", title: "Level 10", description: "Reached level 10.", icon: "crown", color: "sun", group: "Milestones", check: (_s, _o, xp) => levelInfo(xp).level >= 10 },
  {
    id: "halfway",
    title: "Halfway There",
    description: "Completed half of all lessons.",
    icon: "mountain",
    color: "mint",
    group: "Milestones",
    check: (s, o) => {
      const all = allOutlineLessons(o);
      return all.length > 0 && completed(s) >= all.length / 2;
    },
  },
];

export function newlyEarnedBadges(s: ProgressState, o: Outline): string[] {
  const xp = totalXp(s, o);
  return badges.filter((b) => !s.achievements[b.id] && b.check(s, o, xp)).map((b) => b.id);
}

export { currentStreak };
