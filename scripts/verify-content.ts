/**
 * Content verifier – runs every piece of R code in the course through real R
 * and checks it against what the content claims.
 *
 *   npm run verify:content                 # everything
 *   npm run verify:content -- --module 3   # one module
 *   npm run verify:content -- --projects | --functions | --glossary | --cheatsheets
 *   npm run verify:content -- --file src/content/modules/m03-working-with-data.ts
 *   add --verbose to print every check, --engine webr|native|auto
 *
 * Checks:
 *  - code examples: actual console output == `output`
 *  - mistakes: `wrong` produces `error`; `right` runs cleanly
 *  - predict-output questions: the answer option == actual output
 *  - find-error questions (errorKind "error"): R fails on `errorLine`; `fix` runs
 *  - fill-blank questions: code with the first accepted answer runs
 *  - exercises: solution passes all tests; starter code fails at least one
 *  - projects: each step's solution (run in order) passes its tests
 *  - function reference: example output == `output`
 *  - structure: ids unique, references valid, required parts present
 */
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import type {
  CheatSheet,
  CodeExample,
  Exercise,
  GlossaryTerm,
  Lesson,
  Module,
  Project,
  QuizQuestion,
  RFunction,
} from "../src/content/types";
import { detectPackages } from "../src/lib/r/runtime-r";
import { normalizeOutput } from "../src/lib/r/console";
import { NativeEngine, WebREngine, nativeRAvailable, type EngineRun, type RunRequest } from "./lib/r-engines";

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const VERBOSE = flag("verbose");
const ENGINE = opt("engine") ?? "auto";

const webr = new WebREngine();
const native = nativeRAvailable() ? new NativeEngine() : null;

let failures = 0;
let warningsCount = 0;
let passes = 0;
const report: string[] = [];

function fail(where: string, msg: string) {
  failures++;
  report.push(`\x1b[31m✗ ${where}\x1b[0m\n${indent(msg)}`);
}
function warn(where: string, msg: string) {
  warningsCount++;
  report.push(`\x1b[33m! ${where}\x1b[0m\n${indent(msg)}`);
}
function ok(where: string) {
  passes++;
  if (VERBOSE) console.log(`\x1b[32m✓\x1b[0m ${where}`);
}
const indent = (s: string) =>
  s
    .split("\n")
    .map((l) => "    " + l)
    .join("\n");

async function run(req: RunRequest & { packages?: string[]; history?: string[] }): Promise<EngineRun & { engine: string }> {
  const pkgs = new Set([...(req.packages ?? []), ...detectPackages(req.code), ...(req.history ?? []).flatMap(detectPackages)]);
  const useNative = ENGINE === "native" || (ENGINE === "auto" && pkgs.size > 0);
  if (useNative) {
    if (!native) {
      return { info: null, lines: [], text: "", crashed: `needs packages (${[...pkgs].join(", ")}) but native R is not installed`, engine: "none" };
    }
    return { ...(await native.run(req)), engine: native.name };
  }
  // webR: emulate history by running it first in the same workspace.
  const ws = req.workspace ?? `ws-${Math.random().toString(36).slice(2)}`;
  if (req.history?.length) {
    await webr.run({ code: req.history.join("\n\n"), workspace: ws, fresh: true });
    return { ...(await webr.run({ ...req, workspace: ws, fresh: false })), engine: webr.name };
  }
  return { ...(await webr.run({ ...req, workspace: ws, fresh: req.fresh ?? true })), engine: webr.name };
}

function showDiff(expected: string, actual: string) {
  return `expected:\n${indent(expected || "(nothing)")}\nactual:\n${indent(actual || "(nothing)")}`;
}

function errorText(r: EngineRun) {
  if (r.crashed) return `R crashed: ${r.crashed}`;
  if (r.info?.status === "parse_error") return `syntax error: ${r.info.parse_error?.message} (line ${r.info.parse_error?.line})`;
  if (r.info?.status === "error") return `error on line ${r.info.error?.line_start}: ${r.info.error?.message}`;
  return "";
}

/* ------------------------------------------------------------------ */

async function checkExample(where: string, ex: CodeExample) {
  const r = await run({ code: ex.code, packages: ex.packages });
  if (r.crashed) return fail(where, `R crashed: ${r.crashed}`);
  const errored = r.info?.status !== "ok";
  if (errored && !ex.expectError) return fail(where, `${errorText(r)}\nconsole:\n${indent(r.text)}`);
  if (!errored && ex.expectError) return fail(where, "expected an error (expectError: true) but the code ran cleanly");
  if (ex.plot && (r.info?.plots ?? 0) === 0) warn(where, "marked plot: true but no plot was drawn");
  if (ex.verify === false) return ok(where);
  if (ex.output === undefined) {
    if (ex.plot || ex.noOutput) {
      if (ex.noOutput && normalizeOutput(r.text)) warn(where, `marked noOutput but printed:\n${indent(r.text)}`);
      return ok(where);
    }
    return fail(where, `missing \`output\`. Actual output is:\n${indent(r.text)}`);
  }
  if (normalizeOutput(ex.output) !== normalizeOutput(r.text)) {
    return fail(where, `output mismatch (${r.engine})\n${showDiff(normalizeOutput(ex.output), normalizeOutput(r.text))}`);
  }
  ok(where);
}

async function checkQuestion(where: string, q: QuizQuestion, pkgs?: string[]) {
  switch (q.type) {
    case "multiple-choice":
    case "predict-output": {
      if (q.answer < 0 || q.answer >= q.options.length) return fail(where, `answer index ${q.answer} out of range`);
      if (q.optionFeedback && q.optionFeedback.length !== q.options.length)
        warn(where, "optionFeedback length differs from options length");
      if (new Set(q.options).size !== q.options.length) return fail(where, "duplicate options");
      if (q.type === "predict-output") {
        const r = await run({ code: q.code, packages: pkgs });
        if (r.crashed) return fail(where, r.crashed);
        const actual = normalizeOutput(r.text);
        const expected = normalizeOutput(q.options[q.answer]);
        if (actual !== expected) return fail(where, `predict-output answer is wrong\n${showDiff(expected, actual)}`);
        const others = q.options.filter((o, i) => i !== q.answer && normalizeOutput(o) === actual);
        if (others.length) return fail(where, "another option is identical to the real output");
      }
      return ok(where);
    }
    case "fill-blank": {
      const n = q.code.split("___").length - 1;
      if (n !== 1) return fail(where, `fill-blank code must contain exactly one ___ (found ${n})`);
      if (!q.accept.length) return fail(where, "no accepted answers");
      const r = await run({ code: q.code.replace("___", q.accept[0]), packages: pkgs });
      if (r.info?.status !== "ok") return fail(where, `code with the answer "${q.accept[0]}" fails: ${errorText(r)}`);
      return ok(where);
    }
    case "find-error": {
      const lines = q.code.split("\n");
      if (q.errorLine < 1 || q.errorLine > lines.length) return fail(where, "errorLine outside the code");
      if (q.errorKind === "error") {
        const r = await run({ code: q.code, packages: pkgs });
        const st = r.info?.status;
        if (st === "parse_error") {
          const l = r.info!.parse_error!.line;
          // R reports a syntax error where it notices it: the faulty line or the next one.
          const eoi = /end of input/.test(r.info!.parse_error!.message);
          if (l !== q.errorLine && l !== q.errorLine + 1 && !(eoi && l !== null && l >= q.errorLine))
            return fail(where, `syntax error reported on line ${l}, but errorLine is ${q.errorLine}`);
        } else if (st === "error") {
          const e = r.info!.error!;
          if (q.errorLine < e.line_start || q.errorLine > e.line_end)
            return fail(where, `R stops on lines ${e.line_start}-${e.line_end} (${e.message}), but errorLine is ${q.errorLine}`);
        } else return fail(where, "errorKind is \"error\" but the code ran without an error");
      }
      const f = await run({ code: q.fix, packages: pkgs });
      if (f.info?.status !== "ok") return fail(where, `fix does not run: ${errorText(f)}`);
      return ok(where);
    }
    case "true-false":
      return ok(where);
  }
}

async function checkExercise(where: string, ex: Exercise) {
  if (!ex.tests.length) return fail(where, "exercise has no tests");
  if (ex.hints.length < 2) warn(where, "fewer than 2 hints");
  const sol = await run({ code: ex.solution, tests: ex.tests, packages: ex.packages });
  if (sol.crashed) return fail(where, `solution crashed: ${sol.crashed}`);
  if (sol.info?.status !== "ok") return fail(where, `solution fails: ${errorText(sol)}\nconsole:\n${indent(sol.text)}`);
  const failed = (sol.tests ?? []).filter((t) => !t.pass);
  if (failed.length)
    return fail(where, `solution fails tests:\n${failed.map((t) => `- ${t.name}${t.error ? ` (R error: ${t.error})` : ""}`).join("\n")}`);
  const st = await run({ code: ex.starterCode, tests: ex.tests, packages: ex.packages });
  if ((st.tests ?? []).every((t) => t.pass) && st.info?.status === "ok")
    warn(where, "starter code already passes every test");
  ok(where);
}

async function checkLesson(where: string, lesson: Lesson, mod: Module) {
  const req: [boolean, string][] = [
    [lesson.objectives.length >= 1, "objectives"],
    [lesson.intro.length > 50, "intro (simple explanation)"],
    [lesson.sections.length >= 1, "sections"],
    [lesson.mistakes.length >= 1, "common mistakes"],
    [lesson.exerciseIds.length >= 1, "at least one exercise"],
    [lesson.quiz.length >= 3, "a quiz with at least 3 questions"],
    [lesson.keyPoints.length >= 3, "at least 3 key points"],
  ];
  for (const [cond, what] of req) if (!cond) fail(where, `lesson is missing ${what}`);
  const examples = lesson.sections.flatMap((s) => s.blocks).filter((b) => b.kind === "code");
  if (!examples.length) fail(where, "lesson has no code examples");
  if (!examples.some((b) => b.kind === "code" && b.example.explanation?.length))
    fail(where, "no code example has a line-by-line explanation");
  for (const id of lesson.exerciseIds)
    if (!mod.exercises.some((e) => e.id === id)) fail(where, `exerciseIds references unknown exercise "${id}"`);

  const pkgs = lesson.packages;
  for (const s of lesson.sections) {
    for (const [i, b] of s.blocks.entries()) {
      const w = `${where} › ${s.id} › block ${i + 1}`;
      if (b.kind === "code") await checkExample(`${w} (example "${b.example.id}")`, { ...b.example, packages: b.example.packages ?? pkgs });
      if (b.kind === "question") await checkQuestion(`${w} (question ${b.question.id})`, b.question, pkgs);
    }
  }
  for (const [i, m] of lesson.mistakes.entries()) {
    const w = `${where} › mistake ${i + 1} "${m.title}"`;
    const wr = await run({ code: m.wrong, packages: pkgs });
    if (m.error) {
      if (!wr.text.includes(m.error) && !(wr.info?.parse_error?.message ?? "").includes(m.error))
        fail(w, `wrong code should print "${m.error}" but printed:\n${indent(wr.text)}`);
    }
    const rt = await run({ code: m.right, packages: pkgs });
    if (rt.info?.status !== "ok") fail(w, `right code fails: ${errorText(rt)}`);
    else ok(w);
  }
  for (const q of lesson.quiz) await checkQuestion(`${where} › quiz ${q.id}`, q, pkgs);
  const pg = await run({ code: lesson.playground, packages: pkgs });
  if (pg.info?.status !== "ok") warn(`${where} › playground`, `playground starter code fails: ${errorText(pg)}`);
}

async function checkModule(mod: Module) {
  const where = `Module ${mod.number}`;
  if (!mod.lessons.length) return warn(where, "module has no lessons yet");
  const lessonIds = new Set<string>();
  for (const l of mod.lessons) {
    if (lessonIds.has(l.id)) fail(where, `duplicate lesson id ${l.id}`);
    lessonIds.add(l.id);
    if (l.module !== mod.number) fail(where, `lesson ${l.id} has module ${l.module}`);
    await checkLesson(`${where} › ${l.id}`, l, mod);
  }
  for (const ex of mod.exercises) await checkExercise(`${where} › exercise ${ex.id}`, ex);
  if (mod.checkpoint.length < 4) warn(where, "checkpoint has fewer than 4 questions");
  for (const q of mod.checkpoint) await checkQuestion(`${where} › checkpoint ${q.id}`, q);
}

async function checkProject(p: Project) {
  const history: string[] = [];
  for (const step of p.steps) {
    const where = `Project ${p.id} › ${step.id}`;
    const r = await run({ code: step.solution, tests: step.tests, packages: p.packages, history: [...history] });
    if (r.crashed) fail(where, r.crashed);
    else if (r.info?.status !== "ok") fail(where, `solution fails: ${errorText(r)}\nconsole:\n${indent(r.text)}`);
    else {
      const failed = (r.tests ?? []).filter((t) => !t.pass);
      if (failed.length) fail(where, `solution fails tests:\n${failed.map((t) => `- ${t.name}${t.error ? ` (R error: ${t.error})` : ""}`).join("\n")}`);
      else ok(where);
    }
    history.push(step.solution);
  }
}

async function checkFunction(f: RFunction) {
  const where = `Function ${f.package}::${f.name}`;
  const r = await run({ code: f.example });
  if (r.info?.status !== "ok") return fail(where, `example fails: ${errorText(r)}`);
  if (f.plot && !f.output) return ok(where);
  if (normalizeOutput(f.output) !== normalizeOutput(r.text))
    return fail(where, `output mismatch (${r.engine})\n${showDiff(normalizeOutput(f.output), normalizeOutput(r.text))}`);
  ok(where);
}

/* ------------------------------------------------------------------ */

function uniqueIds(all: { id: string; where: string }[]) {
  const seen = new Map<string, string>();
  for (const { id, where } of all) {
    if (seen.has(id)) fail(where, `duplicate id "${id}" (also in ${seen.get(id)})`);
    else seen.set(id, where);
  }
}

async function loadFile(path: string): Promise<Record<string, unknown>> {
  return import(pathToFileURL(resolve(path)).href);
}

async function main() {
  const t0 = Date.now();
  const file = opt("file");
  const moduleNum = opt("module");
  const all = !file && !moduleNum && !flag("projects") && !flag("functions") && !flag("glossary") && !flag("cheatsheets");

  let modules: Module[] = [];
  let projects: Project[] = [];
  let functions: RFunction[] = [];
  let glossary: GlossaryTerm[] = [];
  let sheets: CheatSheet[] = [];

  if (file) {
    const m = await loadFile(file);
    for (const v of Object.values(m)) {
      if (Array.isArray(v) && v.length) {
        const first = v[0] as Record<string, unknown>;
        if ("steps" in first) projects.push(...(v as Project[]));
        else if ("syntax" in first) functions.push(...(v as RFunction[]));
        else if ("definition" in first) glossary.push(...(v as GlossaryTerm[]));
        else if ("sections" in first && "description" in first) sheets.push(...(v as CheatSheet[]));
      } else if (v && typeof v === "object" && "lessons" in (v as object)) modules.push(v as Module);
    }
  } else {
    const c = await loadFile("src/content/curriculum.ts");
    modules = c.modules as Module[];
    if (moduleNum) modules = modules.filter((m) => m.number === Number(moduleNum));
    if (all || flag("projects")) projects = (await loadFile("src/content/projects.ts")).projects as Project[];
    if (all || flag("functions")) functions = (await loadFile("src/content/functions.ts")).rFunctions as RFunction[];
    if (all || flag("glossary")) glossary = (await loadFile("src/content/glossary.ts")).glossary as GlossaryTerm[];
    if (all || flag("cheatsheets")) sheets = (await loadFile("src/content/cheatsheets.ts")).cheatSheets as CheatSheet[];
  }

  // structural uniqueness
  uniqueIds(modules.flatMap((m) => m.lessons.map((l) => ({ id: l.id, where: `Module ${m.number}` }))));
  uniqueIds(modules.flatMap((m) => m.exercises.map((e) => ({ id: e.id, where: `Module ${m.number}` }))));
  uniqueIds(
    modules.flatMap((m) => [
      ...m.lessons.flatMap((l) => [
        ...l.quiz,
        ...l.sections.flatMap((s) => s.blocks.flatMap((b) => (b.kind === "question" ? [b.question] : []))),
      ]),
      ...m.checkpoint,
    ]).map((q) => ({ id: q.id, where: "questions" })),
  );

  for (const m of modules) await checkModule(m);
  for (const p of projects) await checkProject(p);
  for (const f of functions) await checkFunction(f);
  uniqueIds(glossary.map((g) => ({ id: g.slug, where: "glossary" })));
  for (const g of glossary) {
    if (g.example) {
      const r = await run({ code: g.example });
      if (r.info?.status !== "ok") fail(`Glossary ${g.slug}`, `example fails: ${errorText(r)}`);
      else ok(`Glossary ${g.slug}`);
    }
  }
  for (const s of sheets) {
    for (const sec of s.sections) {
      for (const it of sec.items) {
        if (!it.code.trim()) fail(`Cheat sheet ${s.id}`, `empty code in "${sec.title}"`);
      }
    }
    ok(`Cheat sheet ${s.id}`);
  }

  await webr.close();
  console.log(report.join("\n"));
  console.log(
    `\n${passes} checks passed, \x1b[31m${failures} failed\x1b[0m, \x1b[33m${warningsCount} warnings\x1b[0m  (${((Date.now() - t0) / 1000).toFixed(1)}s)`,
  );
  if (!native) console.log("note: native R not found – content that needs packages could not be verified");
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
