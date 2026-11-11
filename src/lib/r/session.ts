/**
 * The in-browser R session (webR). One R process runs in a Web Worker for the
 * whole site; learner code never touches the web server.
 *
 * - Lazy start: R loads the first time something needs it.
 * - A queue makes sure only one piece of code runs at a time.
 * - Every page uses its own "workspace" (an R environment), so variables from
 *   the playground never leak into a lesson or the error checker.
 * - Long-running code is interrupted after a time limit; if R does not
 *   respond to the interrupt, the session is restarted.
 * - Packages used via library()/pkg:: are installed from the webR package
 *   repository on first use; packages that are not available for WebAssembly
 *   are reported clearly.
 */
import type { Shelter, WebR } from "webr";
import { csvDatasets } from "@/content/datasets";
import { R_RUNTIME, detectPackages } from "./runtime-r";
import {
  parseOutput,
  type CheckInfo,
  type ConsoleLine,
  type EnvVariable,
  type RRunInfo,
  type RunResult,
  type TestResult,
} from "./console";
import { withBase } from "../base-path";

export type SessionStatus = "idle" | "loading" | "ready" | "busy" | "error";

export interface SessionState {
  status: SessionStatus;
  message: string;
  crossOriginIsolated: boolean;
  installed: string[];
}

export interface RunOptions {
  workspace: string;
  /** Start the workspace empty before running. */
  fresh?: boolean;
  dark?: boolean;
  timeoutMs?: number;
  plotWidth?: number;
  plotHeight?: number;
  /** Called with progress lines (package installation, etc.). */
  onSystem?: (line: ConsoleLine) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_WEBR_BASE_URL || withBase("/webr/");
const REPO_URL = process.env.NEXT_PUBLIC_WEBR_REPO_URL || "https://repo.r-wasm.org/";

/** Packages whose names are commonly mistyped or that need a hint. */
const PACKAGE_HINTS: Record<string, string> = {
  tidyverse:
    "The full tidyverse is large. In the browser it is faster to load only what you need, e.g. library(dplyr), library(ggplot2), library(tidyr).",
};


class RSession {
  private webR: WebR | null = null;
  private starting: Promise<WebR> | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private listeners = new Set<() => void>();
  private fnNames: string[] | null = null;
  private failedPackages = new Set<string>();
  private generation = 0;
  state: SessionState = { status: "idle", message: "R is not started yet", crossOriginIsolated: false, installed: [] };

  subscribe = (l: () => void) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };
  getState = () => this.state;
  private setState(patch: Partial<SessionState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  /** Start R if needed and return the webR instance. */
  ensure(): Promise<WebR> {
    if (this.webR) return Promise.resolve(this.webR);
    if (!this.starting) this.starting = this.start();
    return this.starting;
  }

  private async start(): Promise<WebR> {
    const gen = ++this.generation;
    this.setState({ status: "loading", message: "Starting R in your browser…", crossOriginIsolated: globalThis.crossOriginIsolated ?? false });
    try {
      const { WebR } = await import("webr");
      const webR = new WebR({ baseUrl: BASE_URL, repoUrl: REPO_URL, interactive: false });
      await webR.init();
      this.setState({ message: "Loading R Academy tools…" });
      await webR.evalRVoid(R_RUNTIME);
      await webR.evalRVoid(
        "options(width = 80, warn = 0, digits = 7); try(webr::shim_install(), silent = TRUE); setwd('/home/web_user')",
      );
      this.setState({ message: "Loading sample datasets…" });
      try {
        await webR.FS.mkdir("/home/web_user/data");
      } catch {
        /* already there */
      }
      await Promise.all(
        csvDatasets.map(async (d) => {
          const res = await fetch(withBase(`/${d.path}`));
          if (!res.ok) return;
          const buf = new Uint8Array(await res.arrayBuffer());
          await webR.FS.writeFile(`/home/web_user/${d.path}`, buf);
        }),
      );
      if (gen !== this.generation) throw new Error("R session was restarted during start-up");
      this.webR = webR;
      this.setState({ status: "ready", message: "R is ready" });
      return webR;
    } catch (e) {
      this.starting = null;
      this.setState({ status: "error", message: `R could not start: ${e instanceof Error ? e.message : String(e)}` });
      throw e;
    }
  }

  /** Serialise work on the R process. */
  private enqueue<T>(job: (webR: WebR) => Promise<T>): Promise<T> {
    const run = async () => {
      const webR = await this.ensure();
      this.setState({ status: "busy" });
      try {
        return await job(webR);
      } finally {
        if (this.webR) this.setState({ status: "ready", message: "R is ready" });
      }
    };
    const p = this.queue.then(run, run);
    this.queue = p.catch(() => undefined);
    return p;
  }

  interrupt() {
    this.webR?.interrupt();
  }

  /** Throw away the R process and start a fresh one. */
  async restart() {
    const old = this.webR;
    this.webR = null;
    this.starting = null;
    this.fnNames = null;
    this.queue = Promise.resolve();
    this.setState({ status: "idle", message: "Restarting R…", installed: [] });
    try {
      old?.close();
    } catch {
      /* ignore */
    }
    await this.ensure();
  }

  /* ------------------------- packages ------------------------- */

  private async ensurePackages(webR: WebR, code: string, onSystem?: (l: ConsoleLine) => void): Promise<string[]> {
    const pkgs = detectPackages(code);
    const missing: string[] = [];
    for (const pkg of pkgs) {
      const have = await webR.evalRBoolean(`requireNamespace(${JSON.stringify(pkg)}, quietly = TRUE)`);
      if (have) continue;
      if (this.failedPackages.has(pkg)) {
        missing.push(pkg);
        continue;
      }
      onSystem?.({ kind: "system", text: `Installing package '${pkg}' for the browser (first time only – this can take a moment)…` });
      if (PACKAGE_HINTS[pkg]) onSystem?.({ kind: "system", text: PACKAGE_HINTS[pkg] });
      try {
        await webR.installPackages([pkg], { quiet: true });
      } catch {
        /* checked below */
      }
      const ok = await webR.evalRBoolean(`requireNamespace(${JSON.stringify(pkg)}, quietly = TRUE)`);
      if (ok) {
        this.setState({ installed: [...new Set([...this.state.installed, pkg])] });
        this.fnNames = null;
        onSystem?.({ kind: "system", text: `Package '${pkg}' is ready.` });
      } else {
        this.failedPackages.add(pkg);
        missing.push(pkg);
      }
    }
    return missing;
  }

  /* ------------------------- running code ------------------------- */

  run(code: string, opts: RunOptions): Promise<RunResult> {
    return this.enqueue((webR) => this.runNow(webR, code, opts));
  }

  private async runNow(webR: WebR, code: string, opts: RunOptions): Promise<RunResult> {
    const t0 = performance.now();
    const systemLines: ConsoleLine[] = [];
    const onSystem = (l: ConsoleLine) => {
      systemLines.push(l);
      opts.onSystem?.(l);
    };
    let missing: string[] = [];
    try {
      missing = await this.ensurePackages(webR, code, onSystem);
    } catch {
      /* the run itself will report the problem */
    }
    if (missing.length) {
      for (const pkg of missing) {
        onSystem({
          kind: "error",
          text:
            `The package '${pkg}' could not be loaded in the browser. Either the name is misspelled, or the package ` +
            `is not available for webR (the version of R that runs in web browsers). Packages that need system ` +
            `libraries or compiled code that has not been ported to WebAssembly cannot run here. You can still run this ` +
            `code in R or RStudio on your own computer.`,
        });
      }
    }

    const shelter: Shelter = await new webR.Shelter();
    const dark = Boolean(opts.dark);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let timedOut = false;
    try {
      const env = await new shelter.REnvironment({
        ".ra_code": code,
        ".ra_ws": opts.workspace,
        ".ra_fresh": Boolean(opts.fresh),
        ".ra_dark": dark,
      });
      const capture = shelter.captureR(
        ".ra_json(.ra_run(.ra_code, envir = .ra_workspace(.ra_ws, fresh = .ra_fresh), dark = .ra_dark))",
        {
          env,
          captureStreams: true,
          captureConditions: false,
          withAutoprint: false,
          captureGraphics: {
            width: opts.plotWidth ?? 900,
            height: opts.plotHeight ?? 600,
            pointsize: 15,
            bg: dark ? "#0f172a" : "white",
            capture: true,
          },
        },
      );
      const limit = opts.timeoutMs ?? 30000;
      const timeout = new Promise<"timeout">((resolve) => {
        timer = setTimeout(() => {
          timedOut = true;
          webR.interrupt();
          resolve("timeout");
        }, limit);
      });
      let cap: Awaited<typeof capture> | "timeout" | "dead" = await Promise.race([capture, timeout]);
      if (cap === "timeout") {
        // Give R a few seconds to honour the interrupt before restarting it.
        const grace = new Promise<"dead">((resolve) => setTimeout(() => resolve("dead"), 4000));
        cap = await Promise.race([capture, grace]);
        if (cap === "dead") {
          void this.restartAfterHang();
          return {
            status: "timeout",
            lines: [
              ...systemLines,
              { kind: "error", text: `Your code ran for more than ${Math.round(limit / 1000)} seconds and did not stop when asked, so R was restarted. Look for a loop that never ends (for example a while loop whose condition never becomes FALSE).` },
            ],
            info: null,
            images: [],
            missingPackages: missing,
            elapsedMs: performance.now() - t0,
            code,
          };
        }
      }
      const captured = cap as Awaited<typeof capture>;
      const json = ((await captured.result.toJs()) as { values: string[] }).values[0];
      const info = JSON.parse(json) as RRunInfo;
      const lines = [...systemLines, ...parseOutput(captured.output as { type: string; data: unknown }[])];
      if (timedOut) {
        lines.push({ kind: "error", text: `Stopped after ${Math.round(limit / 1000)} seconds (the time limit can be changed in Settings).` });
      }
      const images = (captured.images as ImageBitmap[]).map(bitmapToDataUrl).filter((x): x is string => Boolean(x));
      return {
        status: timedOut ? "timeout" : info.status,
        lines,
        info,
        images,
        missingPackages: missing,
        elapsedMs: performance.now() - t0,
        code,
      };
    } catch (e) {
      return {
        status: "crashed",
        lines: [...systemLines, { kind: "error", text: `R Academy could not run this code: ${e instanceof Error ? e.message : String(e)}` }],
        info: null,
        images: [],
        missingPackages: missing,
        elapsedMs: performance.now() - t0,
        code,
      };
    } finally {
      if (timer) clearTimeout(timer);
      try {
        await shelter.purge();
      } catch {
        /* session may have been restarted */
      }
    }
  }

  private async restartAfterHang() {
    const old = this.webR;
    this.webR = null;
    this.starting = null;
    this.fnNames = null;
    try {
      old?.close();
    } catch {
      /* ignore */
    }
    this.setState({ status: "idle", message: "R was restarted", installed: [] });
  }

  /** Run code in a fresh workspace, then evaluate exercise tests against it. */
  test(
    code: string,
    tests: { name: string; check: string; failMessage: string }[],
    opts: RunOptions & { keepWorkspace?: boolean },
  ): Promise<{ run: RunResult; tests: TestResult[] }> {
    return this.enqueue(async (webR) => {
      const run = await this.runNow(webR, code, { ...opts, fresh: opts.fresh ?? true });
      if (!run.info) {
        return { run, tests: tests.map((t) => ({ name: t.name, pass: false, failMessage: t.failMessage, error: "The code did not finish." })) };
      }
      const shelter: Shelter = await new webR.Shelter();
      try {
        const out = run.lines.filter((l) => l.kind === "stdout").map((l) => l.text).join("\n");
        const env = await new shelter.REnvironment({
          ".ra_checks": tests.map((t) => t.check),
          ".ra_ws": opts.workspace,
          ".ra_out": out,
          ".ra_err": run.info.error?.message ?? run.info.parse_error?.message ?? "",
          ".ra_plots": run.info.plots,
          ".ra_src": code,
        });
        const cap = await shelter.captureR(
          ".ra_json(.ra_tests(.ra_checks, .ra_workspace(.ra_ws), out = .ra_out, err = if (nzchar(.ra_err)) .ra_err else NULL, plots = .ra_plots, code = .ra_src))",
          { env, captureStreams: true, captureConditions: false, captureGraphics: false },
        );
        const raw = JSON.parse(((await cap.result.toJs()) as { values: string[] }).values[0]) as { pass: boolean; error: string | null }[];
        return { run, tests: raw.map((r, i) => ({ ...r, name: tests[i].name, failMessage: tests[i].failMessage })) };
      } finally {
        await shelter.purge();
      }
    });
  }

  /* ------------------------- inspection helpers ------------------------- */

  private async json<T>(webR: WebR, expr: string, bindings: Record<string, unknown> = {}): Promise<T> {
    const shelter: Shelter = await new webR.Shelter();
    try {
      const env = await new shelter.REnvironment(bindings as never);
      const cap = await shelter.captureR(`.ra_json(${expr})`, { env, captureStreams: true, captureConditions: false, captureGraphics: false });
      return JSON.parse(((await cap.result.toJs()) as { values: string[] }).values[0]) as T;
    } finally {
      await shelter.purge();
    }
  }

  /** Syntax check + tokens, without running the code. */
  check(code: string, workspace: string): Promise<CheckInfo> {
    return this.enqueue((webR) =>
      this.json<CheckInfo>(webR, ".ra_check(.ra_code, envir = .ra_workspace(.ra_ws))", { ".ra_code": code, ".ra_ws": workspace }),
    );
  }

  envSummary(workspace: string): Promise<EnvVariable[]> {
    return this.enqueue((webR) => this.json<EnvVariable[]>(webR, ".ra_env_summary(.ra_workspace(.ra_ws))", { ".ra_ws": workspace }));
  }

  /** Context used by the error analyser. */
  context(workspace: string, names: string[]) {
    return this.enqueue(async (webR) => {
      if (!this.fnNames) this.fnNames = await this.json<string[]>(webR, ".ra_function_names()");
      const bind = { ".ra_ws": workspace, ".ra_names": names.length ? names : [""] };
      const [columns, files, numericText, classes, variables] = await Promise.all([
        this.json<Record<string, string[]>>(webR, ".ra_df_columns(.ra_workspace(.ra_ws))", bind),
        this.json<string[]>(webR, ".ra_files()"),
        this.json<string[]>(webR, ".ra_numeric_text(.ra_names, .ra_workspace(.ra_ws))", bind),
        this.json<Record<string, string>>(webR, ".ra_classes(.ra_names, .ra_workspace(.ra_ws))", bind),
        this.json<EnvVariable[]>(webR, ".ra_env_summary(.ra_workspace(.ra_ws))", bind),
      ]);
      return { functions: this.fnNames, columns, files, numericText, classes: Array.isArray(classes) ? {} : classes, variables };
    });
  }

  formals(fname: string): Promise<string[]> {
    return this.enqueue((webR) => this.json<string[]>(webR, ".ra_formals(.ra_fn)", { ".ra_fn": fname }));
  }

  resetWorkspace(workspace: string) {
    return this.enqueue((webR) => webR.evalRVoid(`.ra_reset_workspace(${JSON.stringify(workspace)})`));
  }

  /** Save an uploaded file into R's working folder (data/uploads are in memory only). */
  writeFile(name: string, data: Uint8Array) {
    return this.enqueue(async (webR) => {
      try {
        await webR.FS.mkdir("/home/web_user/data");
      } catch {
        /* exists */
      }
      await webR.FS.writeFile(`/home/web_user/data/${name}`, data);
    });
  }

  listDataFiles(): Promise<string[]> {
    return this.enqueue((webR) => this.json<string[]>(webR, 'I(list.files("data"))'));
  }
}

function bitmapToDataUrl(bmp: ImageBitmap): string | null {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bmp.width;
    canvas.height = bmp.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bmp, 0, 0);
    bmp.close?.();
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

/** The single R session shared by the whole site. */
export const rSession = new RSession();
