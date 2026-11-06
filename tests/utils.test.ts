import { test } from "node:test";
import assert from "node:assert/strict";
import { formatR, sameTokens } from "../src/lib/r/format";
import { bracketProblems, tokenize } from "../src/lib/r/tokens";
import { detectPackages } from "../src/lib/r/runtime-r";
import { parseOutput, normalizeOutput } from "../src/lib/r/console";
import { mergeProgress } from "../src/lib/sync/merge";
import { currentStreak, longestStreak, emptyProgress } from "../src/lib/store/progress";

test("formatter normalises spacing and indentation without changing tokens", () => {
  const src = "x<-c(1,2,3)\nif(x[1]>0){\nprint(-x[-1])\n}else{\nprint('no')\n}";
  const out = formatR(src);
  assert.equal(out, "x <- c(1, 2, 3)\nif (x[1] > 0) {\n  print(-x[-1])\n} else {\n  print('no')\n}");
  assert.ok(sameTokens(src, out));
});

test("formatter keeps strings and comments untouched", () => {
  const src = 'y<-"a  ,b" # keep   this';
  assert.equal(formatR(src), 'y <- "a  ,b" # keep   this');
});

test("tokenizer handles numbers, strings, operators", () => {
  const kinds = tokenize("x <- 1e-5 %in% c('a')").filter((t) => t.kind !== "ws").map((t) => t.kind);
  assert.deepEqual(kinds, ["name", "op", "number", "op", "name", "open", "string", "close"]);
});

test("bracket problems are found", () => {
  assert.equal(bracketProblems("f(1, 2")[0].kind, "unclosed");
  assert.equal(bracketProblems("f(1))")[0].kind, "unexpected");
  assert.equal(bracketProblems("c(1, 2]")[0].kind, "mismatch");
  assert.equal(bracketProblems("x[[1]]").length, 0);
});

test("package detection ignores base packages and comments", () => {
  assert.deepEqual(detectPackages("library(dplyr)\n# library(foo)\nggplot2::ggplot(x)\nlibrary(stats)").sort(), ["dplyr", "ggplot2"]);
});

test("console parsing tags warnings and errors", () => {
  const lines = parseOutput([
    { type: "stdout", data: "[1] 1" },
    { type: "stderr", data: "\x1eWWarning message:" },
    { type: "stderr", data: "\x1eEError: boom" },
  ]);
  assert.deepEqual(lines.map((l) => l.kind), ["stdout", "warning", "error"]);
  assert.equal(normalizeOutput("a  \n\n"), "a");
});

test("progress merge keeps completions from both sides", () => {
  const a = { ...emptyProgress(), lessons: { l1: { completedAt: 5 } }, updatedAt: 10 };
  const b = { ...emptyProgress(), lessons: { l2: { completedAt: 7 }, l1: { quizBest: 0.8 } }, updatedAt: 20 };
  const m = mergeProgress(a, b);
  assert.equal(m.lessons.l1.completedAt, 5);
  assert.equal(m.lessons.l1.quizBest, 0.8);
  assert.equal(m.lessons.l2.completedAt, 7);
});

test("streaks", () => {
  assert.equal(currentStreak(["2026-11-04", "2026-11-05", "2026-11-06"], "2026-11-06"), 3);
  assert.equal(currentStreak(["2026-11-04", "2026-11-05"], "2026-11-06"), 2);
  assert.equal(currentStreak(["2026-11-01"], "2026-11-06"), 0);
  assert.equal(longestStreak(["2026-01-01", "2026-01-02", "2026-01-05"]), 2);
});
