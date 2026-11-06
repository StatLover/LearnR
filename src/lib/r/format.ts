/**
 * "Format Code": re-indents R code and normalises spacing following the
 * tidyverse style guide. It only ever changes whitespace – the sequence of
 * meaningful tokens is compared before and after, and the original code is
 * returned untouched if anything would change.
 */
import { significant, tokenize, type Tok } from "./tokens";

const SPACED_OPS = new Set([
  "<-", "<<-", "->", "->>", "=", "==", "!=", "<", ">", "<=", ">=", "&", "&&", "|", "||", "+", "-", "*", "/", "~", "|>",
]);
const TIGHT_OPS = new Set(["^", ":", "::", ":::", "$", "@"]);
const CONTINUATION = new Set(["|>", "+", "-", "*", "/", "&", "&&", "|", "||", "<-", "=", "~", ","]);

function isUnary(prev: Tok | undefined): boolean {
  if (!prev) return true;
  if (prev.kind === "open" || prev.kind === "comma" || prev.kind === "semi") return true;
  if (prev.kind === "op") return true;
  if (prev.kind === "keyword" && !["TRUE", "FALSE", "NULL", "NA", "Inf", "NaN"].includes(prev.text)) return true;
  return false;
}

export function formatR(code: string): string {
  const toks = tokenize(code.replace(/\r\n/g, "\n"));
  // Split into lines of significant tokens (keeping comments).
  const lines: Tok[][] = [[]];
  for (const t of toks) {
    if (t.kind === "newline") lines.push([]);
    else if (t.kind !== "ws") lines[lines.length - 1].push(t);
  }

  const out: string[] = [];
  let depth = 0;
  let continuation = false;
  let blank = 0;
  // Brackets opened on each line: the indent level they started from.
  const parenStack: number[] = [];

  for (const line of lines) {
    if (!line.length) {
      blank++;
      if (blank <= 1 && out.length) out.push("");
      continue;
    }
    blank = 0;
    // Lines starting with closing brackets are dedented.
    let lead = 0;
    while (lead < line.length && line[lead].kind === "close") lead++;
    const indentLevel = Math.max(0, depth - Math.min(lead, depth)) + (continuation && depth === 0 ? 1 : 0);
    let text = "";
    for (let i = 0; i < line.length; i++) {
      const t = line[i];
      const prev = line[i - 1];
      let sep = "";
      if (i > 0) {
        if (t.kind === "comment") sep = " ";
        else if (t.kind === "comma" || t.kind === "semi") sep = "";
        else if (t.kind === "close") sep = t.text === "}" ? " " : "";
        else if (prev.kind === "open") sep = prev.text === "{" ? " " : "";
        else if (prev.kind === "comma" || prev.kind === "semi") sep = " ";
        else if (t.kind === "open") {
          // f(x), x[1]  vs  if (x), for (i in x), function (x) -> function(x)
          if (prev.kind === "keyword" && ["if", "for", "while"].includes(prev.text)) sep = " ";
          else if (t.text === "{" ) sep = " ";
          else if (prev.kind === "op" && SPACED_OPS.has(prev.text)) sep = " ";
          else if (prev.kind === "op" && /^%.*%$/.test(prev.text)) sep = " ";
          else if (prev.kind === "keyword" && prev.text === "in") sep = " ";
          else sep = "";
        } else if (t.kind === "op") {
          if (TIGHT_OPS.has(t.text)) sep = "";
          else if ((t.text === "-" || t.text === "+") && isUnary(prev)) sep = prev.kind === "op" || prev.kind === "keyword" ? " " : "";
          else if (t.text === "!") sep = prev.kind === "op" || prev.kind === "keyword" ? " " : "";
          else if (t.text === "~" && isUnary(prev)) sep = " ";
          else if (SPACED_OPS.has(t.text) || /^%.*%$/.test(t.text)) sep = " ";
          else if (t.text === "?") sep = " ";
          else sep = "";
        } else if (prev.kind === "op") {
          if (TIGHT_OPS.has(prev.text)) sep = "";
          else if ((prev.text === "-" || prev.text === "+") && isUnary(line[i - 2])) sep = "";
          else if (prev.text === "!") sep = "";
          else if (prev.text === "~" && isUnary(line[i - 2])) sep = "";
          else sep = " ";
        } else if (prev.kind === "close" && t.kind === "keyword" && t.text === "else") sep = " ";
        else if (prev.kind === "close" && (t.kind === "name" || t.kind === "keyword" || t.kind === "number" || t.kind === "string")) sep = " ";
        else sep = " ";
      }
      text += sep + t.text;
      if (t.kind === "open") {
        parenStack.push(depth);
        depth++;
      } else if (t.kind === "close") {
        depth = Math.max(0, depth - 1);
        parenStack.pop();
      }
    }
    out.push("  ".repeat(indentLevel) + text);
    const last = [...line].reverse().find((t) => t.kind !== "comment");
    continuation = Boolean(last && last.kind === "op" && CONTINUATION.has(last.text)) || Boolean(last && last.kind === "op" && /^%.*%$/.test(last.text));
  }
  while (out.length && out[out.length - 1] === "") out.pop();
  const formatted = out.join("\n") + (code.endsWith("\n") ? "\n" : "");
  return sameTokens(code, formatted) ? formatted : code;
}

/** True when two pieces of code have the same meaningful tokens. */
export function sameTokens(a: string, b: string): boolean {
  const ta = significant(tokenize(a)).map((t) => t.text);
  const tb = significant(tokenize(b)).map((t) => t.text);
  return ta.length === tb.length && ta.every((x, i) => x === tb[i]);
}
