import { editDistance } from "../utils";
import { significant, tokenize, type Tok } from "../r/tokens";

export const lineText = (code: string, line: number) => code.split("\n")[line - 1] ?? "";

/** Find the closest candidate (case-insensitive match first, then edit distance). */
export function closest(name: string, candidates: Iterable<string>, maxDist?: number): string | null {
  const list = [...new Set(candidates)].filter((c) => c && c !== name);
  const lower = name.toLowerCase();
  const ci = list.find((c) => c.toLowerCase() === lower);
  if (ci) return ci;
  const limit = maxDist ?? (name.length <= 3 ? 1 : name.length <= 6 ? 2 : 3);
  let best: string | null = null;
  let bestD = Infinity;
  for (const c of list) {
    if (Math.abs(c.length - name.length) > limit) continue;
    const d = editDistance(lower, c.toLowerCase());
    if (d < bestD || (d === bestD && best && c.length < best.length)) {
      best = c;
      bestD = d;
    }
  }
  return bestD <= limit ? best : null;
}

/** Identifier tokens (kind name) on lines [from, to] with this exact text. */
export function findNameTokens(code: string, name: string, from: number, to: number): Tok[] {
  return tokenize(code).filter((t) => t.kind === "name" && t.text === name && t.line >= from && t.line <= to);
}

/** Replace tokens (by offset) with new text. */
export function replaceTokens(code: string, toks: Tok[], replacement: string | ((t: Tok) => string)): string {
  const sorted = [...toks].sort((a, b) => b.offset - a.offset);
  let out = code;
  for (const t of sorted) {
    const rep = typeof replacement === "function" ? replacement(t) : replacement;
    out = out.slice(0, t.offset) + rep + out.slice(t.offset + t.text.length);
  }
  return out;
}

/** Offset of a 1-based line/column position. */
export function offsetOf(code: string, line: number, col: number): number {
  const lines = code.split("\n");
  let off = 0;
  for (let i = 0; i < line - 1 && i < lines.length; i++) off += lines[i].length + 1;
  return off + Math.max(0, col - 1);
}

export function insertAt(code: string, offset: number, text: string) {
  return code.slice(0, offset) + text + code.slice(offset);
}

/** End offset of a line, before any trailing comment. */
export function lineEndBeforeComment(code: string, line: number): number {
  const toks = tokenize(code).filter((t) => t.line === line && t.kind !== "ws" && t.kind !== "newline");
  const last = [...toks].reverse().find((t) => t.kind !== "comment");
  if (!last) return offsetOf(code, line, lineText(code, line).length + 1);
  return last.offset + last.text.length;
}

/** Names the code assigns with <-, =, -> or as function arguments / loop variables (with the line). */
export function assignedNames(code: string): { name: string; line: number }[] {
  const toks = significant(tokenize(code));
  const out: { name: string; line: number }[] = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    const next = toks[i + 1];
    const prev = toks[i - 1];
    if (t.kind === "name" && next?.kind === "op" && (next.text === "<-" || next.text === "<<-")) out.push({ name: t.text.replace(/`/g, ""), line: t.line });
    if (t.kind === "name" && next?.kind === "op" && next.text === "=" && (!prev || prev.kind === "newline" || prev.kind === "semi" || prev.line < t.line)) out.push({ name: t.text, line: t.line });
    if (t.kind === "name" && prev?.kind === "op" && (prev.text === "->" || prev.text === "->>")) out.push({ name: t.text, line: t.line });
    if (t.kind === "keyword" && t.text === "for" && toks[i + 2]?.kind === "name") out.push({ name: toks[i + 2].text, line: toks[i + 2].line });
  }
  return out;
}

/** Names assigned a function: f <- function(...) */
export function definedFunctions(code: string): string[] {
  const toks = significant(tokenize(code));
  const out: string[] = [];
  for (let i = 0; i + 2 < toks.length; i++) {
    if (toks[i].kind === "name" && (toks[i + 1].text === "<-" || toks[i + 1].text === "=") && toks[i + 2].text === "function") out.push(toks[i].text);
  }
  return out;
}

/** Function names called in the code: name( */
export function calledFunctions(code: string): { name: string; tok: Tok }[] {
  const toks = significant(tokenize(code));
  const out: { name: string; tok: Tok }[] = [];
  for (let i = 0; i + 1 < toks.length; i++) {
    if (toks[i].kind === "name" && toks[i + 1].kind === "open" && toks[i + 1].text === "(" && toks[i - 1]?.text !== "$" && toks[i - 1]?.text !== "::") out.push({ name: toks[i].text, tok: toks[i] });
  }
  return out;
}

/** Bracket depth (number of open brackets) just before an offset. */
export function depthAt(code: string, offset: number): { depth: number; open: Tok[] } {
  const stack: Tok[] = [];
  for (const t of tokenize(code)) {
    if (t.offset >= offset) break;
    if (t.kind === "open") stack.push(t);
    else if (t.kind === "close") stack.pop();
  }
  return { depth: stack.length, open: stack };
}

/** Which package provides a well-known function that is not part of base R. */
export const FUNCTION_PACKAGES: Record<string, string> = {
  "%>%": "dplyr", mutate: "dplyr", select: "dplyr", arrange: "dplyr", summarise: "dplyr", summarize: "dplyr", group_by: "dplyr",
  ungroup: "dplyr", rename: "dplyr", distinct: "dplyr", left_join: "dplyr", right_join: "dplyr", inner_join: "dplyr", full_join: "dplyr",
  case_when: "dplyr", if_else: "dplyr", across: "dplyr", n_distinct: "dplyr", slice_max: "dplyr", slice_min: "dplyr", slice_head: "dplyr",
  pull: "dplyr", relocate: "dplyr", transmute: "dplyr", tibble: "dplyr", glimpse: "dplyr", bind_rows: "dplyr", desc: "dplyr", n: "dplyr",
  ggplot: "ggplot2", aes: "ggplot2", labs: "ggplot2", ggtitle: "ggplot2", xlab: "ggplot2", ylab: "ggplot2", ggsave: "ggplot2",
  coord_flip: "ggplot2", facet_wrap: "ggplot2", facet_grid: "ggplot2", qplot: "ggplot2",
  pivot_longer: "tidyr", pivot_wider: "tidyr", drop_na: "tidyr", replace_na: "tidyr", separate: "tidyr", unite: "tidyr", fill: "tidyr",
  ymd: "lubridate", mdy: "lubridate", dmy: "lubridate", ymd_hms: "lubridate", year: "lubridate", month: "lubridate", wday: "lubridate",
  floor_date: "lubridate", read_csv: "readr", write_csv: "readr",
};
export function packageFor(fn: string): string | null {
  if (FUNCTION_PACKAGES[fn]) return FUNCTION_PACKAGES[fn];
  if (/^(geom|stat|theme|scale|coord|facet|element|position)_/.test(fn)) return "ggplot2";
  if (/^str_/.test(fn)) return "stringr";
  return null;
}

export const PACKAGE_TYPOS: Record<string, string> = {
  ggplot: "ggplot2", ggplot2s: "ggplot2", gplot2: "ggplot2", dyplr: "dplyr", dplr: "dplyr", deplyr: "dplyr", tidyr2: "tidyr", tidr: "tidyr",
  tidyverce: "tidyverse", stringer: "stringr", lubridat: "lubridate",
};
