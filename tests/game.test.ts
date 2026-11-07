import { test } from "node:test";
import assert from "node:assert/strict";
import { modules } from "../src/content/curriculum";
import { projects } from "../src/content/projects";
import { buildLessonCards, PHASES } from "../src/components/learn/lesson-cards";
import { allOutlineLessons, emptyProgress, isLessonUnlocked, suggestedNextLesson, type Outline } from "../src/lib/store/progress";
import { exerciseXp, levelInfo, levelThreshold, pickDailyChallenge, totalXp, XP, xpEvents } from "../src/lib/game/xp";
import { badges, newlyEarnedBadges } from "../src/lib/game/badges";
import { LESSON_ART, moduleOrder, worldOfModule, worlds } from "../src/lib/game/worlds";

// Same shape as src/content/outline.ts (which is server-only).
const outline: Outline = {
  modules: modules.map((m) => ({
    number: m.number,
    id: m.id,
    stage: m.stage,
    title: m.title,
    description: m.description,
    topics: m.topics,
    checkpointSize: m.checkpoint.length,
    lessons: m.lessons.map((l) => ({ id: l.id, title: l.title, summary: l.summary, minutes: l.minutes, module: m.number, concepts: l.concepts ?? [], exerciseIds: l.exerciseIds })),
    exercises: m.exercises.map((e) => ({ id: e.id, title: e.title, difficulty: e.difficulty })),
  })),
  projects: projects.map((p) => ({ id: p.id, title: p.title, level: p.level, stepIds: p.steps.map((s) => s.id) })),
};

test("worlds cover every module exactly once and every lesson has art", () => {
  assert.deepEqual([...moduleOrder].sort((a, b) => a - b), modules.map((m) => m.number).sort((a, b) => a - b));
  assert.equal(worlds.length, 7);
  for (const m of modules) for (const l of m.lessons) assert.ok(LESSON_ART[l.id], `art for ${l.id}`);
  assert.equal(worldOfModule(9).id, "statistics-detective");
  assert.equal(worldOfModule(8).id, "r-pro");
});

test("lessons are ordered and unlocked in world order", () => {
  const ordered = allOutlineLessons(outline);
  assert.equal(ordered.length, modules.reduce((a, m) => a + m.lessons.length, 0));
  // Statistical analysis (module 9) comes before intermediate R (module 8).
  const i9 = ordered.findIndex((l) => l.module === 9);
  const i8 = ordered.findIndex((l) => l.module === 8);
  assert.ok(i9 < i8);
  const s = emptyProgress();
  assert.equal(suggestedNextLesson(outline, s)?.id, ordered[0].id);
  assert.ok(isLessonUnlocked(outline, s, ordered[0].id, "guided"));
  assert.ok(!isLessonUnlocked(outline, s, ordered[1].id, "guided"));
  assert.ok(isLessonUnlocked(outline, s, ordered[1].id, "free"));
  s.lessons[ordered[0].id] = { completedAt: 1, visitedAt: 1 };
  assert.ok(isLessonUnlocked(outline, s, ordered[1].id, "guided"));
  assert.equal(suggestedNextLesson(outline, s)?.id, ordered[1].id);
});

test("levels: thresholds grow and levelInfo is consistent", () => {
  assert.equal(levelThreshold(1), 0);
  assert.equal(levelThreshold(2), 100);
  assert.equal(levelThreshold(3), 300);
  assert.equal(levelInfo(0).level, 1);
  assert.equal(levelInfo(99).level, 1);
  assert.equal(levelInfo(100).level, 2);
  const li = levelInfo(450);
  assert.equal(li.level, 3);
  assert.equal(li.floor, 300);
  assert.equal(li.next, 600);
  assert.equal(li.pct, 50);
});

test("XP is derived from progress without double counting", () => {
  const s = emptyProgress();
  assert.equal(totalXp(s, outline), 0);
  const lesson = modules[0].lessons[0];
  const ex = modules[0].exercises.find((e) => e.id === lesson.exerciseIds[0])!;
  s.lessons[lesson.id] = { completedAt: 1000, visitedAt: 1 };
  s.exercises[ex.id] = { attempts: 2, hintsUsed: 0, passedAt: 2000 };
  s.questions["q1"] = { correct: true, attempts: 1, at: 3000 };
  s.questions["q2"] = { correct: true, attempts: 2, at: 3000 };
  s.questions["q3"] = { correct: false, attempts: 1, at: 3000 };
  const expected = XP.lesson + exerciseXp(ex.difficulty) + XP.question + XP.questionRetry;
  assert.equal(totalXp(s, outline), expected);
  assert.equal(xpEvents(s, outline).length, 4);
  // Viewing the solution halves the exercise XP.
  s.exercises[ex.id].solutionViewed = true;
  assert.equal(totalXp(s, outline), expected - exerciseXp(ex.difficulty) + exerciseXp(ex.difficulty, true));
});

test("daily challenge is deterministic and comes from reached modules", () => {
  const s = emptyProgress();
  const a = pickDailyChallenge("2026-11-06", s, outline);
  const b = pickDailyChallenge("2026-11-06", s, outline);
  assert.equal(a, b);
  const first = [...outline.modules].sort((x, y) => moduleOrder.indexOf(x.number) - moduleOrder.indexOf(y.number))[0];
  assert.ok(first.exercises.some((e) => e.id === a), "a beginner gets a challenge from the first module");
});

test("badges: ids are unique and first-lesson is earned once", () => {
  assert.equal(new Set(badges.map((b) => b.id)).size, badges.length);
  const s = emptyProgress();
  assert.ok(!newlyEarnedBadges(s, outline).includes("first-lesson"));
  s.lessons[modules[0].lessons[0].id] = { completedAt: 1, visitedAt: 1 };
  assert.ok(newlyEarnedBadges(s, outline).includes("first-lesson"));
  s.achievements["first-lesson"] = 1;
  assert.ok(!newlyEarnedBadges(s, outline).includes("first-lesson"));
});

test("lesson cards keep every example, question, challenge and quiz item exactly once, in phase order", () => {
  for (const m of modules)
    for (const l of m.lessons) {
      const exercises = l.exerciseIds.map((id) => m.exercises.find((e) => e.id === id)!);
      const cards = buildLessonCards(l, exercises);
      const blocks = l.sections.flatMap((s) => s.blocks);
      const examples = cards.flatMap((c) => (c.kind === "watch" ? [c.example] : []));
      assert.deepEqual(examples, blocks.flatMap((b) => (b.kind === "code" ? [b.example] : [])), `${l.id}: examples`);
      const checks = cards.flatMap((c) => (c.kind === "check" ? [c.question.id] : []));
      assert.deepEqual(checks, blocks.flatMap((b) => (b.kind === "question" ? [b.question.id] : [])), `${l.id}: checks`);
      // Every other block appears exactly once (as a learn block, lead-in or follow-up).
      const other = cards.flatMap((c) => (c.kind === "learn" ? c.blocks : c.kind === "watch" ? [...c.lead, ...c.follow] : []));
      assert.equal(other.length, blocks.filter((b) => b.kind !== "code" && b.kind !== "question").length, `${l.id}: text blocks`);
      assert.equal(cards.filter((c) => c.kind === "challenge").length, exercises.length);
      assert.equal(cards.filter((c) => c.kind === "quiz").length, l.quiz.length);
      assert.equal(cards[0].kind, "intro");
      assert.equal(cards[cards.length - 1].kind, "complete");
      // Practice phases come in order after the teaching phases.
      const order = PHASES.map((p) => p.id);
      const tail = cards.filter((c) => c.phase !== "learn" && c.phase !== "watch").map((c) => order.indexOf(c.phase));
      assert.deepEqual(tail, [...tail].sort((a, b) => a - b), `${l.id}: phase order`);
    }
});
