/**
 * Turning raw webR output into console lines, and the result types shared by
 * the browser R session and the content verifier.
 */

export type ConsoleKind = "stdout" | "stderr" | "error" | "warning" | "message" | "info" | "system";

export interface ConsoleLine {
  kind: ConsoleKind;
  text: string;
}

export interface RawOutput {
  type: string;
  data: unknown;
}

const TAGS: Record<string, ConsoleKind> = { E: "error", W: "warning", M: "message", I: "info" };

/** Convert webR captureR() output entries into typed console lines. */
export function parseOutput(entries: RawOutput[]): ConsoleLine[] {
  const lines: ConsoleLine[] = [];
  for (const e of entries) {
    if (e.type !== "stdout" && e.type !== "stderr") continue;
    const data = String(e.data ?? "");
    if (e.type === "stderr" && data.startsWith("\x1e")) {
      lines.push({ kind: TAGS[data[1]] ?? "stderr", text: data.slice(2) });
    } else {
      lines.push({ kind: e.type as ConsoleKind, text: data });
    }
  }
  return lines;
}

/** Parse a plain text stream (native R verifier) where stderr was merged into stdout. */
export function parseMergedText(text: string): ConsoleLine[] {
  const raw = text.replace(/\n$/, "").split("\n");
  if (raw.length === 1 && raw[0] === "") return [];
  return parseOutput(
    raw.map((l) => (l.startsWith("\x1e") ? { type: "stderr", data: l } : { type: "stdout", data: l })),
  );
}

/** The console transcript as plain text (what a learner would copy). */
export function transcript(lines: ConsoleLine[], opts: { includeInfo?: boolean } = {}): string {
  return lines
    .filter((l) => (opts.includeInfo ? true : l.kind !== "info" && l.kind !== "system"))
    .map((l) => l.text)
    .join("\n");
}

/** Normalise output for comparisons: trailing spaces and blank edges ignored. */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .replace(/^\n+|\n+$/g, "");
}

export interface RParseError {
  line: number | null;
  col: number | null;
  message: string;
  context: string;
  raw: string;
}

export interface RErrorInfo {
  message: string;
  call: string | null;
  class: string[];
  line_start: number;
  line_end: number;
  expr: number;
  stack: string[];
}

export interface RWarningInfo {
  message: string;
  call: string | null;
  line_start: number;
  line_end: number;
}

export interface RTable {
  label: string;
  nrow: number;
  ncol: number;
  names: string[];
  types: string[];
  rows: string[][];
}

/** Structured result returned by the R helper .ra_run(). */
export interface RRunInfo {
  status: "ok" | "error" | "parse_error" | "interrupted";
  n_expr: number;
  completed: number;
  error: RErrorInfo | null;
  warnings: RWarningInfo[];
  parse_error: RParseError | null;
  plots: number;
  tables: RTable[];
  elapsed: number;
}

export type RunStatus = RRunInfo["status"] | "timeout" | "crashed" | "package_error";

export interface RunResult {
  status: RunStatus;
  lines: ConsoleLine[];
  info: RRunInfo | null;
  /** PNG data URLs of plots drawn (browser only). */
  images: string[];
  /** Packages that could not be installed. */
  missingPackages: string[];
  elapsedMs: number;
  code: string;
}

export interface TestResult {
  name: string;
  pass: boolean;
  failMessage: string;
  error: string | null;
}

export interface EnvVariable {
  name: string;
  class: string;
  type: string;
  size: string;
  preview: string;
}

export interface TokenInfo {
  l1: number;
  c1: number;
  l2: number;
  c2: number;
  /** R parser token type, e.g. SYMBOL, SYMBOL_FUNCTION_CALL, STR_CONST. */
  t: string;
  x: string;
}

export interface CheckInfo {
  ok: boolean;
  parse_error?: RParseError;
  n_expr?: number;
  tokens?: TokenInfo[];
  unknown_functions?: string[];
  packages?: string[];
}
