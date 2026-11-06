import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeParseError, analyzeRuntimeError, analyzeWarnings, staticChecks, outputChecks } from "../src/lib/errors/analyze";
import type { RRunInfo } from "../src/lib/r/console";

const info = (p: Partial<RRunInfo>): RRunInfo => ({ status: "error", n_expr: 2, completed: 1, error: null, warnings: [], parse_error: null, plots: 0, tables: [], elapsed: 0, ...p });
const err = (message: string, line: number, call: string | null = null) => ({ message, call, class: ["simpleError"], line_start: line, line_end: line, expr: line, stack: [] });

test("object not found: suggests the existing variable and fixes only that token", () => {
  const code = "numbers <- c(10, 20, 30)\nmean(number)";
  const d = analyzeRuntimeError({ code, info: info({ error: err("object 'number' not found", 2) }), variables: ["numbers"] })!;
  assert.equal(d.category, "Object Not Found");
  assert.equal(d.lineStart, 2);
  assert.deepEqual(d.token, { line: 2, from: 6, to: 12, text: "number" });
  assert.equal(d.fix?.code, "numbers <- c(10, 20, 30)\nmean(numbers)");
});

test("object not found: case differences are explained as case-sensitivity", () => {
  const code = "Score <- 5\nscore * 2";
  const d = analyzeRuntimeError({ code, info: info({ error: err("object 'score' not found", 2) }), variables: ["Score"] })!;
  assert.match(d.why, /case-sensitive/);
  assert.equal(d.fix?.code, "Score <- 5\nScore * 2");
});

test("object used before it is created is not 'fixed' by guessing", () => {
  const code = "print(total)\ntotal <- 10";
  const d = analyzeRuntimeError({ code, info: info({ error: err("object 'total' not found", 1) }), variables: [] })!;
  assert.match(d.title, /before it is created/);
  assert.equal(d.fix ?? null, null);
});

test("could not find function: package function gets library()", () => {
  const code = 'df <- read.csv("data/students.csv")\nselect(df, name)';
  const d = analyzeRuntimeError({ code, info: info({ error: err('could not find function "select"', 2, "select(df, name)") }), functions: ["mean", "print"] })!;
  assert.match(d.title, /dplyr/);
  assert.equal(d.fix?.code.split("\n")[0], "library(dplyr)");
});

test("could not find function: typo is corrected", () => {
  const code = "x <- 1:3\nlenght(x)";
  const d = analyzeRuntimeError({ code, info: info({ error: err('could not find function "lenght"', 2, "lenght(x)") }), functions: ["length", "mean"] })!;
  assert.equal(d.fix?.code, "x <- 1:3\nlength(x)");
});

test("text used as number: quoted numbers are unquoted", () => {
  const code = 'x <- "10" + 5';
  const d = analyzeRuntimeError({ code, info: info({ error: err("non-numeric argument to binary operator", 1, '"10" + 5') }), classes: {} })!;
  assert.equal(d.fix?.code, "x <- 10 + 5");
});

test("text used as number: character variable converted with as.numeric", () => {
  const code = 'price <- "10"\nprice * 3';
  const d = analyzeRuntimeError({ code, info: info({ error: err("non-numeric argument to binary operator", 2, "price * 3") }), classes: { price: "character" }, numericText: ["price"] })!;
  assert.equal(d.fix?.code, 'price <- "10"\nas.numeric(price) * 3');
});

test("wrong file path is corrected to an existing file", () => {
  const code = 'd <- read.csv("students.csv")';
  const d = analyzeRuntimeError({ code, info: info({ error: err("cannot open the connection", 1, 'file(file, "rt")'), warnings: [{ message: "cannot open file 'students.csv': No such file or directory", call: null, line_start: 1, line_end: 1 }] }), files: ["data", "data/students.csv"] })!;
  assert.equal(d.fix?.code, 'd <- read.csv("data/students.csv")');
});

test("syntax: missing closing bracket before next line", () => {
  const code = 'print("hi"\nx <- 1';
  const d = analyzeParseError(code, { line: 2, col: 1, message: "unexpected symbol", context: "", raw: "<text>:2:1: unexpected symbol" });
  assert.match(d.category, /Missing Closing Bracket/);
  assert.equal(d.fix?.code, 'print("hi")\nx <- 1');
});

test("syntax: else on its own line is joined", () => {
  const code = "if (x > 1) {\n  1\n}\nelse {\n  2\n}";
  const d = analyzeParseError(code, { line: 4, col: 1, message: "unexpected 'else'", context: "", raw: "" });
  assert.equal(d.fix?.code, "if (x > 1) {\n  1\n} else {\n  2\n}");
});

test("syntax: = inside if becomes ==", () => {
  const code = "if (x = 5) print(x)";
  const d = analyzeParseError(code, { line: 1, col: 7, message: "unexpected '='", context: "", raw: "" });
  assert.equal(d.fix?.code, "if (x == 5) print(x)");
});

test("syntax: missing comma in c()", () => {
  const code = "c(1 2, 3)";
  const d = analyzeParseError(code, { line: 1, col: 5, message: "unexpected numeric constant", context: "", raw: "" });
  assert.equal(d.fix?.code, "c(1, 2, 3)");
});

test("syntax: curly quotes are replaced", () => {
  const code = "print(“hello”)";
  const d = analyzeParseError(code, { line: 1, col: 7, message: "unexpected input", context: "", raw: "" });
  assert.equal(d.fix?.code, 'print("hello")');
});

test("syntax: for without parentheses", () => {
  const code = "for i in 1:3 {\n  print(i)\n}";
  const d = analyzeParseError(code, { line: 1, col: 5, message: "unexpected symbol", context: "", raw: "" });
  assert.equal(d.fix?.code.split("\n")[0], "for (i in 1:3) {");
});

test("warnings are explained and keep their line", () => {
  const ds = analyzeWarnings({ code: 'as.numeric("a")', info: info({ status: "ok", warnings: [{ message: "NAs introduced by coercion", call: null, line_start: 1, line_end: 1 }] }) });
  assert.equal(ds[0].kind, "warning");
  assert.equal(ds[0].lineStart, 1);
});

test("static checks: == NA and na_rm", () => {
  const ds = staticChecks("x <- c(1, NA)\nx == NA\nmean(x, na_rm = TRUE)");
  assert.ok(ds.some((d) => d.id.startsWith("na-compare") && d.fix?.code.includes("is.na(x)")));
  assert.ok(ds.some((d) => d.id.startsWith("na_rm") && d.fix?.code.includes("na.rm = TRUE")));
});

test("output checks only fire when R printed NA", () => {
  assert.equal(outputChecks("mean(x)", ["[1] 5"]).length, 0);
  assert.equal(outputChecks("mean(x)", ["[1] NA"]).length, 1);
  assert.equal(outputChecks("mean(x, na.rm = TRUE)", ["[1] NA"]).length, 0);
});
