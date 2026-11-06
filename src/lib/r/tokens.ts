/**
 * A small R tokenizer used by the code formatter and the error analyser
 * (bracket matching, smart-quote detection, locating tokens on a line).
 * It mirrors R's lexical rules closely enough for those jobs; R itself is
 * always used to decide whether code is valid.
 */

export type TokKind =
  | "ws"
  | "newline"
  | "comment"
  | "string"
  | "number"
  | "name"
  | "keyword"
  | "op"
  | "open"
  | "close"
  | "comma"
  | "semi"
  | "unknown";

export interface Tok {
  kind: TokKind;
  text: string;
  /** 1-based line and column of the first character. */
  line: number;
  col: number;
  offset: number;
  /** For strings: was the closing quote found? */
  closed?: boolean;
}

const KEYWORDS = new Set(["if", "else", "repeat", "while", "function", "for", "in", "next", "break", "TRUE", "FALSE", "NULL", "NA", "Inf", "NaN"]);

const OPERATORS = [
  "<<-", "->>", "|>", "%%", "::", ":::", "<-", "->", "<=", ">=", "==", "!=", "&&", "||",
  "+", "-", "*", "/", "^", "<", ">", "!", "&", "|", "~", "?", ":", "=", "$", "@", "\\",
].sort((a, b) => b.length - a.length);

export function tokenize(code: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  let line = 1;
  let col = 1;
  const push = (kind: TokKind, text: string, extra: Partial<Tok> = {}) => {
    toks.push({ kind, text, line, col, offset: i, ...extra });
    for (const ch of text) {
      if (ch === "\n") {
        line++;
        col = 1;
      } else col++;
    }
    i += text.length;
  };
  while (i < code.length) {
    const ch = code[i];
    const rest = code.slice(i);
    if (ch === "\n") {
      push("newline", "\n");
      continue;
    }
    if (ch === " " || ch === "\t" || ch === "\r") {
      const m = /^[ \t\r]+/.exec(rest)!;
      push("ws", m[0]);
      continue;
    }
    if (ch === "#") {
      const m = /^#[^\n]*/.exec(rest)!;
      push("comment", m[0]);
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      let j = i + 1;
      let closed = false;
      while (j < code.length) {
        if (code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code[j] === ch) {
          closed = true;
          j++;
          break;
        }
        j++;
      }
      push(ch === "`" ? "name" : "string", code.slice(i, j), { closed });
      continue;
    }
    // raw strings r"(...)"
    const raw = /^[rR](["'])(-*)([([{])/.exec(rest);
    if (raw) {
      const close = { "(": ")", "[": "]", "{": "}" }[raw[3]]!;
      const end = close + raw[2] + raw[1];
      const k = code.indexOf(end, i + raw[0].length);
      const j = k < 0 ? code.length : k + end.length;
      push("string", code.slice(i, j), { closed: k >= 0 });
      continue;
    }
    const num = /^(?:0[xX][0-9a-fA-F]+L?|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[Li]?)/.exec(rest);
    if (num && (/\d/.test(ch) || (ch === "." && /\d/.test(code[i + 1] ?? "")))) {
      push("number", num[0]);
      continue;
    }
    const name = /^(?:[A-Za-zÀ-￿]|\.(?![0-9]))[A-Za-z0-9._À-￿]*/.exec(rest);
    if (name && !/[‘’“”]/.test(name[0])) {
      push(KEYWORDS.has(name[0]) ? "keyword" : "name", name[0]);
      continue;
    }
    if (ch === "%") {
      const m = /^%[^%\n]*%/.exec(rest);
      if (m) {
        push("op", m[0]);
        continue;
      }
    }
    if ("([{".includes(ch)) {
      push("open", ch === "[" && code[i + 1] === "[" ? "[[" : ch);
      continue;
    }
    if (")]}".includes(ch)) {
      push("close", ch);
      continue;
    }
    if (ch === ",") {
      push("comma", ",");
      continue;
    }
    if (ch === ";") {
      push("semi", ";");
      continue;
    }
    const op = OPERATORS.find((o) => rest.startsWith(o));
    if (op) {
      push("op", op);
      continue;
    }
    push("unknown", ch);
  }
  return toks;
}

/** Tokens that carry meaning (no whitespace/newlines). */
export function significant(toks: Tok[]) {
  return toks.filter((t) => t.kind !== "ws" && t.kind !== "newline");
}

export interface BracketProblem {
  kind: "unclosed" | "unexpected" | "mismatch";
  open?: Tok;
  close?: Tok;
  expected?: string;
}

const PAIR: Record<string, string> = { "(": ")", "[": "]", "[[": "]", "{": "}" };

/** Find unclosed / unexpected / mismatched brackets. */
export function bracketProblems(code: string): BracketProblem[] {
  const stack: Tok[] = [];
  const out: BracketProblem[] = [];
  for (const t of tokenize(code)) {
    if (t.kind === "open") stack.push(t);
    else if (t.kind === "close") {
      const top = stack[stack.length - 1];
      if (!top) out.push({ kind: "unexpected", close: t });
      else if (PAIR[top.text] === t.text) {
        stack.pop();
        // "[[" needs two closing "]"
        if (top.text === "[[") stack.push({ ...top, text: "[" });
      } else {
        out.push({ kind: "mismatch", open: top, close: t, expected: PAIR[top.text] });
        stack.pop();
      }
    }
  }
  for (const t of stack) out.push({ kind: "unclosed", open: t, expected: PAIR[t.text] });
  return out;
}

export const SMART_QUOTES = /[‘’‚‛“”„‟′″]/;

export function replaceSmartQuotes(code: string) {
  return code.replace(/[“”„‟″]/g, '"').replace(/[‘’‚‛′]/g, "'");
}
