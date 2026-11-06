/**
 * R engines used by the content verifier.
 *
 *  - WebREngine: the same webR (R compiled to WebAssembly) that runs in the
 *    browser, running in Node. Authoritative for base-R content.
 *  - NativeEngine: a locally installed R (Rscript). Used for content that
 *    needs CRAN packages (dplyr, ggplot2, …) when the webR package repository
 *    is not reachable from the machine running the verifier.
 *
 * Both load exactly the same R helper code (src/lib/r/runtime-r.ts).
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { WebR } from "webr";
import { R_RUNTIME } from "../../src/lib/r/runtime-r";
import { parseMergedText, parseOutput, transcript, type ConsoleLine, type RRunInfo, type TestResult } from "../../src/lib/r/console";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "public", "data");
const CACHE = join(ROOT, ".verify-cache");

export interface EngineRun {
  info: RRunInfo | null;
  lines: ConsoleLine[];
  text: string;
  tests?: TestResult[];
  crashed?: string;
}

export interface RunRequest {
  code: string;
  /** Workspace name; runs with the same name share variables. */
  workspace?: string;
  /** Start the workspace empty. */
  fresh?: boolean;
  /** Exercise tests to evaluate after the code. */
  tests?: { name: string; check: string; failMessage: string }[];
}

export interface Engine {
  name: string;
  run(req: RunRequest): Promise<EngineRun>;
  close(): Promise<void>;
}

function rString(s: string) {
  return JSON.stringify(s); // a JSON string literal is a valid R string literal for our content
}

/* ------------------------------------------------------------------ */

export class WebREngine implements Engine {
  name = "webR";
  private webR!: WebR;
  private ready: Promise<void> | null = null;

  async init() {
    if (!this.ready) {
      this.ready = (async () => {
        this.webR = new WebR({ baseUrl: join(ROOT, "node_modules", "webr", "dist") + "/", interactive: false });
        await this.webR.init();
        await this.webR.evalRVoid(R_RUNTIME);
        try {
          await this.webR.FS.mkdir("/home/web_user/data");
        } catch {
          /* exists */
        }
        for (const f of readdirSync(DATA_DIR)) {
          await this.webR.FS.writeFile(`/home/web_user/data/${f}`, new Uint8Array(readFileSync(join(DATA_DIR, f))));
        }
        await this.webR.evalRVoid(
          'options(width = 80, device = function(...) grDevices::pdf(NULL)); setwd("/home/web_user")',
        );
      })();
    }
    return this.ready;
  }

  async run(req: RunRequest): Promise<EngineRun> {
    await this.init();
    const shelter = await new this.webR.Shelter();
    try {
      const env = await new shelter.REnvironment({
        ".ra_code": req.code,
        ".ra_ws": req.workspace ?? "verify",
        ".ra_fresh": req.fresh ?? true,
      });
      const cap = await shelter.captureR(
        ".ra_json(.ra_run(.ra_code, envir = .ra_workspace(.ra_ws, fresh = .ra_fresh)))",
        { env, captureStreams: true, captureConditions: false, captureGraphics: false, withAutoprint: false },
      );
      const json = ((await cap.result.toJs()) as { values: string[] }).values[0];
      const info = JSON.parse(json) as RRunInfo;
      const lines = parseOutput(cap.output as { type: string; data: unknown }[]);
      const result: EngineRun = { info, lines, text: transcript(lines) };
      if (req.tests?.length) {
        const out = lines.filter((l) => l.kind === "stdout").map((l) => l.text).join("\n");
        const tenv = await new shelter.REnvironment({
          ".ra_checks": req.tests.map((t) => t.check),
          ".ra_ws": req.workspace ?? "verify",
          ".ra_out": out,
          ".ra_err": info.error?.message ?? info.parse_error?.message ?? "",
          ".ra_plots": info.plots,
          ".ra_src": req.code,
        });
        const tcap = await shelter.captureR(
          '.ra_json(.ra_tests(.ra_checks, .ra_workspace(.ra_ws), out = .ra_out, err = if (nzchar(.ra_err)) .ra_err else NULL, plots = .ra_plots, code = .ra_src))',
          { env: tenv, captureStreams: true, captureConditions: false, captureGraphics: false },
        );
        const tjson = ((await tcap.result.toJs()) as { values: string[] }).values[0];
        const raw = JSON.parse(tjson) as { pass: boolean; error: string | null }[];
        result.tests = raw.map((r, i) => ({ ...r, name: req.tests![i].name, failMessage: req.tests![i].failMessage }));
      }
      return result;
    } catch (e) {
      return { info: null, lines: [], text: "", crashed: String(e) };
    } finally {
      await shelter.purge();
    }
  }

  async close() {
    if (this.ready) this.webR.close();
  }
}

/* ------------------------------------------------------------------ */

export function nativeRAvailable(): boolean {
  try {
    execFileSync("Rscript", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export class NativeEngine implements Engine {
  name = "native R";
  private counter = 0;
  private runtimeFile: string;

  constructor() {
    mkdirSync(CACHE, { recursive: true });
    this.runtimeFile = join(CACHE, `runtime-${process.pid}.R`); // per process: parallel verifier runs must not overwrite each other
    writeFileSync(this.runtimeFile, R_RUNTIME);
    const dataLink = join(CACHE, "data");
    if (!existsSync(dataLink)) {
      mkdirSync(dataLink, { recursive: true });
      for (const f of readdirSync(DATA_DIR)) writeFileSync(join(dataLink, f), readFileSync(join(DATA_DIR, f)));
    }
  }

  /**
   * Native runs are one R process per request, so a "workspace" spanning
   * several requests is emulated by replaying earlier code (see `history`).
   */
  async run(req: RunRequest & { history?: string[] }): Promise<EngineRun> {
    const id = `${process.pid}-${++this.counter}`;
    const codeFile = join(CACHE, `code-${id}.R`);
    const histFile = join(CACHE, `hist-${id}.R`);
    const testsFile = join(CACHE, `tests-${id}.R`);
    writeFileSync(codeFile, req.code);
    writeFileSync(histFile, (req.history ?? []).join("\n\n"));
    writeFileSync(
      testsFile,
      `.ra_checks <- c(${(req.tests ?? []).map((t) => rString(t.check)).join(", ")})\n`,
    );
    const driver = `
options(width = 80, warn = 0, device = function(...) grDevices::pdf(NULL))
suppressMessages(source(${rString(this.runtimeFile)}))
setwd(${rString(CACHE)})
ws <- .ra_workspace("verify", fresh = TRUE)
hist <- paste(readLines(${rString(histFile)}, warn = FALSE), collapse = "\\n")
if (nzchar(hist)) invisible(utils::capture.output(.ra_run(hist, envir = ws), type = "output"))
code <- paste(readLines(${rString(codeFile)}, warn = FALSE, encoding = "UTF-8"), collapse = "\\n")
sink(stdout(), type = "message")
res <- .ra_run(code, envir = ws)
sink(type = "message")
cat("\\n\\037RESULT", .ra_json(res), "\\n", sep = "")
source(${rString(testsFile)})
if (length(.ra_checks)) {
  out <- ""  # filled by the caller-side split below; tests needing .out use the stdout passed via env var
  out <- Sys.getenv("RA_OUT_FILE")
  outtxt <- if (nzchar(out) && file.exists(out)) paste(readLines(out, warn = FALSE), collapse = "\\n") else ""
  err <- if (!is.null(res$error)) res$error$message else if (!is.null(res$parse_error)) res$parse_error$message else NULL
  tr <- .ra_tests(.ra_checks, ws, out = outtxt, err = err, plots = res$plots, code = code)
  cat("\\n\\037TESTS", .ra_json(tr), "\\n", sep = "")
}
`;
    const driverFile = join(CACHE, `driver-${id}.R`);
    writeFileSync(driverFile, driver);
    // First pass: run code to learn its stdout; second pass (only if tests) passes stdout to tests.
    const exec = (env: NodeJS.ProcessEnv) =>
      spawnSync("Rscript", ["--vanilla", driverFile], { encoding: "utf8", env, timeout: 60000 });
    let proc = exec({ ...process.env, LANG: "en_US.UTF-8", LC_ALL: "C.UTF-8" });
    const parse = (stdout: string) => {
      const ri = stdout.lastIndexOf("\n\x1fRESULT");
      const body = ri >= 0 ? stdout.slice(0, ri) : stdout;
      const rest = ri >= 0 ? stdout.slice(ri + 8) : "";
      const resultJson = rest.split("\n")[0];
      const ti = rest.indexOf("\x1fTESTS");
      const testsJson = ti >= 0 ? rest.slice(ti + 6).split("\n")[0] : null;
      return { body, resultJson, testsJson };
    };
    let parsed = parse(proc.stdout ?? "");
    if (!parsed.resultJson) {
      return { info: null, lines: [], text: "", crashed: (proc.stderr || proc.stdout || "no output").slice(-2000) };
    }
    let lines = parseMergedText(parsed.body);
    if (req.tests?.length) {
      const outFile = join(CACHE, `out-${id}.txt`);
      writeFileSync(outFile, lines.filter((l) => l.kind === "stdout").map((l) => l.text).join("\n"));
      proc = exec({ ...process.env, LANG: "en_US.UTF-8", LC_ALL: "C.UTF-8", RA_OUT_FILE: outFile });
      parsed = parse(proc.stdout ?? "");
      lines = parseMergedText(parsed.body);
    }
    const info = JSON.parse(parsed.resultJson) as RRunInfo;
    const result: EngineRun = { info, lines, text: transcript(lines) };
    if (req.tests?.length && parsed.testsJson) {
      const raw = JSON.parse(parsed.testsJson) as { pass: boolean; error: string | null }[];
      result.tests = raw.map((r, i) => ({ ...r, name: req.tests![i].name, failMessage: req.tests![i].failMessage }));
    }
    return result;
  }

  async close() {}
}
