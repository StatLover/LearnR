/**
 * The R Code Error Checker's analysis engine.
 *
 * Input: the learner's code and what R really reported when the code was
 * parsed/run (message, the line range of the failing expression, warnings),
 * plus facts gathered from the R session (defined variables, data frame
 * columns, files, functions on the search path).
 *
 * Output: diagnoses that say what kind of problem it is, where it is (only
 * when R or a deterministic check supports the location – the `evidence`
 * field says which), why it happened, how to fix it, and – when a fix can be
 * derived mechanically – a corrected version of the code. Fixes are only
 * shown to learners after R has run them successfully (see fix-loop.ts).
 */
import type { RParseError, RRunInfo } from "../r/console";
import { bracketProblems, replaceSmartQuotes, significant, SMART_QUOTES, tokenize, type Tok } from "../r/tokens";
import {
  assignedNames,
  calledFunctions,
  closest,
  definedFunctions,
  depthAt,
  findNameTokens,
  insertAt,
  lineEndBeforeComment,
  lineText,
  offsetOf,
  packageFor,
  PACKAGE_TYPOS,
  replaceTokens,
} from "./helpers";

export type DiagnosisKind = "syntax" | "runtime" | "warning" | "logic" | "style";

export interface ProposedFix {
  code: string;
  /** Plain-English summary of the change, e.g. "Line 2: `number` → `numbers`". */
  summary: string;
  confidence: "high" | "medium";
}

export interface Diagnosis {
  id: string;
  kind: DiagnosisKind;
  /** e.g. "Object Not Found" */
  category: string;
  title: string;
  /** The exact message R printed (null for static checks). */
  message: string | null;
  lineStart: number | null;
  lineEnd: number | null;
  token?: { line: number; from: number; to: number; text: string } | null;
  /** What the location claim is based on. */
  evidence: string;
  why: string;
  howToFix: string;
  simpler: string;
  tips: string[];
  fix?: ProposedFix | null;
}

export interface AnalysisContext {
  code: string;
  info: RRunInfo | null;
  parseError?: RParseError | null;
  /** Function names on the R search path. */
  functions?: string[];
  /** Variables that exist in the workspace after running. */
  variables?: string[];
  columns?: Record<string, string[]>;
  files?: string[];
  numericText?: string[];
  classes?: Record<string, string>;
  /** Formal argument names of the function in the error call, if known. */
  formals?: string[];
}

const tokOf = (t: Tok) => ({ line: t.line, from: t.col, to: t.col + t.text.length, text: t.text });

function lines(a: number | null, b: number | null) {
  if (a === null) return "";
  return a === b || b === null ? `line ${a}` : `lines ${a}–${b}`;
}

/* ================================================================== */
/* Syntax errors                                                       */
/* ================================================================== */

export function analyzeParseError(code: string, pe: RParseError): Diagnosis {
  const msg = pe.message;
  const line = pe.line;
  const col = pe.col;
  const loc = line !== null ? `R's parser stopped at line ${line}, column ${col}.` : "R's parser could not read the code.";
  const base: Diagnosis = {
    id: "syntax",
    kind: "syntax",
    category: "Syntax Error",
    title: "R could not understand the code",
    message: pe.raw.replace(/^<text>:/, "line "),
    lineStart: line,
    lineEnd: line,
    evidence: `${loc} A syntax error means R did not run any of the code.`,
    why: "R reads all of your code before running it. Somewhere the code does not follow R's grammar, so R stops before running anything.",
    howToFix: "Look at the position R points to (and the line just before it) for a missing or extra symbol.",
    simpler: "R found a typo in the way the code is written, so it could not run it.",
    tips: ["Read the line R points to and the line before it – the real mistake is often just before the marked spot."],
  };
  const toks = tokenize(code);
  const at = line !== null && col !== null ? toks.find((t) => t.line === line && t.col <= col && col < t.col + Math.max(1, t.text.length) && t.kind !== "ws") : undefined;
  if (at) base.token = tokOf(at);
  const sig = significant(toks);
  const idx = at ? sig.indexOf(at) : -1;
  const prev = idx > 0 ? sig[idx - 1] : undefined;
  const next = idx >= 0 ? sig[idx + 1] : undefined;

  // 1. Curly “smart” quotes copied from documents or web pages.
  if (SMART_QUOTES.test(code) && /unexpected (input|symbol|string constant|INCOMPLETE_STRING)/.test(msg)) {
    return {
      ...base,
      category: "Syntax Error – Curly Quotes",
      title: "Curly quotes instead of straight quotes",
      why: "Your code contains curly quotes such as “ ” or ‘ ’. Word processors, chat apps and some websites turn straight quotes into curly ones. R only understands straight quotes: `\"` and `'`.",
      howToFix: "Replace every curly quote with a straight quote.",
      simpler: "Your quotes are the fancy curly kind. R needs the plain straight kind: \" or '.",
      tips: ["Type code directly in the editor instead of copying it from documents.", "If you copy code, paste it into a plain-text editor first."],
      fix: { code: replaceSmartQuotes(code), summary: "Replaced curly quotes (“ ” ‘ ’) with straight quotes.", confidence: "high" },
    };
  }

  // 2. A string that is never closed.
  if (/INCOMPLETE_STRING/.test(msg)) {
    const open = toks.find((t) => t.kind === "string" && t.closed === false);
    let fix: ProposedFix | null = null;
    if (open) {
      const q = open.text[0];
      const lt = lineText(code, open.line);
      const rest = lt.slice(open.col);
      const closeParen = rest.lastIndexOf(")");
      const insertCol = closeParen >= 0 ? open.col + closeParen + 1 : lt.length + 1;
      fix = { code: insertAt(code, offsetOf(code, open.line, insertCol), q), summary: `Line ${open.line}: added the missing closing ${q} quote.`, confidence: "medium" };
    }
    return {
      ...base,
      category: "Syntax Error – Unclosed Text",
      title: "A text string was opened but never closed",
      lineStart: open?.line ?? line,
      lineEnd: open?.line ?? line,
      token: open ? { line: open.line, from: open.col, to: open.col + 1, text: open.text[0] } : base.token,
      evidence: open ? `R reported an incomplete string; the quote that is never closed is on line ${open.line}, column ${open.col}.` : base.evidence,
      why: "Text in R starts and ends with the same quote mark. One of your quotes has no partner, so R thinks the rest of the code is still part of that text.",
      howToFix: "Add the missing closing quote at the end of the text.",
      simpler: "You started some text with a quote but forgot to finish it with another quote.",
      tips: ["Every \" needs a matching \".", "The editor adds the closing quote automatically when you type the first one."],
      fix,
    };
  }

  // 3. Code ends while a bracket is still open.
  if (/end of input/.test(msg)) {
    const probs = bracketProblems(code).filter((p) => p.kind === "unclosed");
    const last = probs[probs.length - 1];
    let fix: ProposedFix | null = null;
    if (last?.open) {
      const o = last.open;
      const closer = last.expected ?? ")";
      if (closer === "}") fix = { code: code.replace(/\s*$/, "") + "\n}\n", summary: `Added the missing } that closes the { on line ${o.line}.`, confidence: "medium" };
      else {
        const end = lineEndBeforeComment(code, o.line);
        fix = { code: insertAt(code, end, closer), summary: `Line ${o.line}: added the missing ${closer}.`, confidence: "medium" };
      }
    }
    return {
      ...base,
      category: "Syntax Error – Missing Closing Bracket",
      title: last?.open ? `The ${last.open.text} on line ${last.open.line} is never closed` : "The code ends too early",
      lineStart: last?.open?.line ?? line,
      lineEnd: last?.open?.line ?? line,
      token: last?.open ? tokOf(last.open) : null,
      evidence: last?.open
        ? `R reached the end of the code while still waiting for a closing bracket. Matching the brackets shows that the ${last.open.text} on line ${last.open.line}, column ${last.open.col} has no partner.`
        : `R reached the end of the code while still expecting more (reported at ${lines(line, line)}).`,
      why: "Every opening bracket – `(`, `[` or `{` – needs a matching closing bracket. R reached the end of your code while it was still waiting for one.",
      howToFix: last?.expected ? `Add the missing \`${last.expected}\`.` : "Finish the last expression (for example, add the value after an operator).",
      simpler: "You opened a bracket but never closed it.",
      tips: ["Click just after a bracket: the editor highlights its partner.", "Count your opening and closing brackets – they must match."],
      fix,
    };
  }

  // 4. Extra or mismatched closing bracket.
  if (/unexpected '[)\]}]'/.test(msg)) {
    const probs = bracketProblems(code).filter((p) => p.kind !== "unclosed");
    const p = probs[0];
    let fix: ProposedFix | null = null;
    if (p?.kind === "unexpected" && p.close) fix = { code: code.slice(0, p.close.offset) + code.slice(p.close.offset + 1), summary: `Line ${p.close.line}: removed the extra ${p.close.text}.`, confidence: "medium" };
    if (p?.kind === "mismatch" && p.close && p.expected) fix = { code: code.slice(0, p.close.offset) + p.expected + code.slice(p.close.offset + 1), summary: `Line ${p.close.line}: changed ${p.close.text} to ${p.expected} so it matches the ${p.open?.text} on line ${p.open?.line}.`, confidence: "medium" };
    return {
      ...base,
      category: "Syntax Error – Unexpected Bracket",
      title: p?.kind === "mismatch" ? "Brackets do not match" : "An extra closing bracket",
      token: p?.close ? tokOf(p.close) : base.token,
      lineStart: p?.close?.line ?? line,
      lineEnd: p?.close?.line ?? line,
      why:
        p?.kind === "mismatch"
          ? `A bracket was closed with the wrong type: the ${p.open?.text} on line ${p.open?.line} must be closed with \`${p.expected}\`.`
          : "There is a closing bracket that has no opening partner, so R does not know what it closes.",
      howToFix: p?.kind === "mismatch" ? `Use \`${p.expected}\` instead.` : "Remove the extra bracket – or add the missing opening bracket earlier.",
      simpler: "Your brackets don't pair up correctly.",
      tips: ["( ) are for function calls and grouping, [ ] for picking elements, { } for blocks of code."],
      fix,
    };
  }

  // 5. else on its own line.
  if (/unexpected 'else'/.test(msg) && at) {
    const prevTok = prev;
    let fix: ProposedFix | null = null;
    if (prevTok) {
      const from = prevTok.offset + prevTok.text.length;
      fix = { code: code.slice(0, from) + " " + code.slice(at.offset), summary: `Moved \`else\` up to line ${prevTok.line}, right after the ${prevTok.text === "}" ? "closing }" : "if part"}.`, confidence: "high" };
    }
    return {
      ...base,
      category: "Syntax Error – Misplaced else",
      title: "`else` must be on the same line as the closing `}`",
      why: "When R reaches the end of the `if (...) { ... }` line, it thinks the `if` statement is finished. An `else` that starts a new line therefore comes as a surprise.",
      howToFix: "Write `} else {` on one line.",
      simpler: "Put `else` right after the `}` on the same line, like `} else {`.",
      tips: ["The pattern is always: `if (condition) {` … `} else {` … `}`."],
      fix,
    };
  }

  // 6. '=' used where a comparison was meant: if (x = 5)
  if (/unexpected '='/.test(msg) && at) {
    const { open } = depthAt(code, at.offset);
    const lastOpen = open[open.length - 1];
    const before = lastOpen ? sig[sig.indexOf(lastOpen) - 1] : undefined;
    if (lastOpen && before && before.kind === "keyword" && (before.text === "if" || before.text === "while")) {
      return {
        ...base,
        category: "Syntax Error – Assignment Instead of Comparison",
        title: "Use `==` to compare, not `=`",
        why: "A single `=` gives a value to something (like `<-`). To *ask* whether two things are equal you need a double `==`.",
        howToFix: "Change `=` to `==` inside the condition.",
        simpler: "`=` means \"make it equal\". `==` means \"is it equal?\". Conditions need `==`.",
        tips: ["Comparison operators: `==`, `!=`, `<`, `>`, `<=`, `>=`."],
        fix: { code: code.slice(0, at.offset) + "==" + code.slice(at.offset + 1), summary: `Line ${at.line}: changed \`=\` to \`==\`.`, confidence: "high" },
      };
    }
  }

  // 7. "=>" or "=<" instead of ">=" / "<=".
  if (/unexpected '[<>]'/.test(msg) && at && prev?.text === "=" && prev.offset + 1 === at.offset) {
    const op = at.text === ">" ? ">=" : "<=";
    return {
      ...base,
      category: "Syntax Error – Operator Written Backwards",
      title: `Write \`${op}\`, not \`=${at.text}\``,
      why: `R's "greater/less than or equal" operators put the \`=\` last: \`>=\` and \`<=\`.`,
      howToFix: `Replace \`=${at.text}\` with \`${op}\`.`,
      simpler: `Swap the two symbols: \`${op}\`.`,
      tips: ["Say it out loud: \"greater than or equal\" → `>` first, then `=`."],
      fix: { code: code.slice(0, prev.offset) + op + code.slice(at.offset + 1), summary: `Line ${at.line}: \`=${at.text}\` → \`${op}\`.`, confidence: "high" },
    };
  }

  // 8. for / if / while without parentheses: for i in 1:10
  if (/unexpected symbol/.test(msg) && prev?.kind === "keyword" && ["for", "if", "while"].includes(prev.text)) {
    const lt = lineText(code, prev.line);
    const kwEnd = prev.col - 1 + prev.text.length;
    const braceIdx = lt.indexOf("{", kwEnd);
    const condEnd = braceIdx >= 0 ? braceIdx : lt.replace(/#.*/, "").trimEnd().length;
    const cond = lt.slice(kwEnd, condEnd).trim();
    const newLine = lt.slice(0, kwEnd) + ` (${cond})` + (braceIdx >= 0 ? " " + lt.slice(braceIdx) : "");
    const all = code.split("\n");
    all[prev.line - 1] = newLine;
    return {
      ...base,
      category: "Syntax Error – Missing Parentheses",
      title: `\`${prev.text}\` needs its condition in parentheses`,
      why: `In R the part after \`${prev.text}\` must be wrapped in round brackets, for example \`${prev.text === "for" ? "for (i in 1:10)" : `${prev.text} (x > 5)`}\`.`,
      howToFix: `Put parentheses around \`${cond}\`.`,
      simpler: `Write \`${prev.text} (${cond})\` – with brackets.`,
      tips: ["Python lets you skip the brackets, R does not."],
      fix: cond ? { code: all.join("\n"), summary: `Line ${prev.line}: added parentheses around \`${cond}\`.`, confidence: "high" } : null,
    };
  }

  // 9. Unexpected symbol / constant: missing comma, operator or line break; spaces in a name.
  if (/unexpected (symbol|numeric constant|string constant)/.test(msg) && at && prev) {
    const { depth, open } = depthAt(code, at.offset);
    const startOfLine = !sig.some((t) => t.line === at.line && t.offset < at.offset);
    // 9a. A bracket opened earlier is still open at the start of this line.
    if (startOfLine && depth > 0 && open[open.length - 1].line < at.line) {
      const o = open[open.length - 1];
      const closer = { "(": ")", "[": "]", "[[": "]]", "{": "}" }[o.text] ?? ")";
      if (closer !== "}") {
        const prevLine = prev.line;
        const end = lineEndBeforeComment(code, prevLine);
        return {
          ...base,
          category: "Syntax Error – Missing Closing Bracket",
          title: `The ${o.text} opened on line ${o.line} is not closed`,
          lineStart: o.line,
          lineEnd: at.line,
          token: tokOf(o),
          evidence: `R stopped at line ${at.line}, column ${at.col}. Matching the brackets shows that the ${o.text} on line ${o.line} is still open there, so R read line ${at.line} as part of the same expression.`,
          why: `Because the ${o.text} on line ${o.line} was never closed, R kept reading and treated line ${at.line} as part of the same command – which does not make sense to it.`,
          howToFix: `Add the missing \`${closer}\` at the end of line ${prevLine}.`,
          simpler: "A bracket on an earlier line was never closed.",
          tips: ["Click next to a bracket to see its partner highlighted."],
          fix: { code: insertAt(code, end, closer), summary: `Line ${prevLine}: added the missing ${closer}.`, confidence: "medium" },
        };
      }
    }
    // 9b. Spaces inside a variable name: my score <- 10
    if (prev.kind === "name" && at.kind === "name" && next?.kind === "op" && (next.text === "<-" || next.text === "=")) {
      const joined = `${prev.text}_${at.text}`;
      const pattern = new RegExp(`\\b${prev.text}\\s+${at.text}\\b`, "g");
      return {
        ...base,
        category: "Syntax Error – Space in a Name",
        title: "Variable names cannot contain spaces",
        token: { line: prev.line, from: prev.col, to: at.col + at.text.length, text: `${prev.text} ${at.text}` },
        why: `R reads \`${prev.text} ${at.text}\` as two separate names next to each other, which is not valid R.`,
        howToFix: `Join the words with an underscore: \`${joined}\` (and use the same name everywhere).`,
        simpler: "Names can't have spaces. Use an underscore instead, like `my_score`.",
        tips: ["Good names: `total_sales`, `average_age`, `student_count`."],
        fix: { code: code.replace(pattern, joined), summary: `Renamed \`${prev.text} ${at.text}\` to \`${joined}\`.`, confidence: "high" },
      };
    }
    // 9c. A number directly before a name or bracket: 2x
    if (prev.kind === "number" && prev.offset + prev.text.length === at.offset && at.kind === "name") {
      if (next?.kind === "op" && (next.text === "<-" || next.text === "=")) {
        return {
          ...base,
          category: "Syntax Error – Invalid Name",
          title: "Names cannot start with a number",
          token: { line: prev.line, from: prev.col, to: at.col + at.text.length, text: prev.text + at.text },
          why: `\`${prev.text}${at.text}\` starts with a digit. R names must start with a letter (or a dot).`,
          howToFix: `Choose a name that starts with a letter, for example \`${at.text}_${prev.text}\`.`,
          simpler: "A name can't begin with a number.",
          tips: ["`score1` is fine, `1score` is not."],
          fix: null,
        };
      }
      return {
        ...base,
        category: "Syntax Error – Missing Operator",
        title: "Missing `*` for multiplication",
        why: `In maths \`${prev.text}${at.text}\` means "${prev.text} times ${at.text}", but R needs the multiplication sign written out.`,
        howToFix: `Write \`${prev.text} * ${at.text}\`.`,
        simpler: "Use `*` to multiply.",
        tips: ["R never guesses multiplication: always write `*`."],
        fix: { code: insertAt(code, at.offset, " * ").replace(`${prev.text} *  `, `${prev.text} * `), summary: `Line ${at.line}: added \`*\` between \`${prev.text}\` and \`${at.text}\`.`, confidence: "high" },
      };
    }
    const prevIsValue = ["name", "number", "string", "close", "keyword"].includes(prev.kind);
    if (prevIsValue && depth > 0) {
      // 9d. print("a" "b") – special-case two strings in print()
      const callOpen = open[open.length - 1];
      const callName = sig[sig.indexOf(callOpen) - 1];
      if (callName?.text === "print" && prev.kind === "string" && at.kind === "string") {
        const newCode = code.slice(0, callOpen.offset + 1) + "paste(" + code.slice(callOpen.offset + 1, at.offset).replace(/\s+$/, "") + ", " + code.slice(at.offset, at.offset + at.text.length) + ")" + code.slice(at.offset + at.text.length);
        return {
          ...base,
          category: "Syntax Error – Missing Comma",
          title: "Two pieces of text next to each other",
          why: "R found two strings with nothing between them. Values inside a function call must be separated by commas – and `print()` prints only one thing, so the texts need to be joined first.",
          howToFix: "Join the pieces with `paste()` (which also adds a space between them), or use `cat()`.",
          simpler: "To print two bits of text together, glue them with `paste()`.",
          tips: ['`paste("Hello", "World")` gives "Hello World"; `paste0()` joins without a space.'],
          fix: { code: newCode, summary: `Line ${at.line}: joined the two texts with \`paste()\`.`, confidence: "medium" },
        };
      }
      return {
        ...base,
        category: "Syntax Error – Missing Comma",
        title: "A comma is missing",
        why: `Inside the brackets, \`${prev.text}\` and \`${at.text}\` are written next to each other. R needs a comma between separate values or arguments.`,
        howToFix: `Add a comma before \`${at.text}\`.`,
        simpler: "Separate the values with commas, like `c(1, 2, 3)`.",
        tips: ["Arguments and values inside `( )` are always separated by commas."],
        fix: { code: code.slice(0, prev.offset + prev.text.length) + ", " + code.slice(at.offset), summary: `Line ${at.line}: added a comma before \`${at.text}\`.`, confidence: "medium" },
      };
    }
    if (prevIsValue && depth === 0 && prev.line === at.line) {
      const hasAssign = sig.some((t) => t.line === at.line && t.offset < at.offset && (t.text === "<-" || t.text === "="));
      if (hasAssign && next) {
        const indent = (lineText(code, at.line).match(/^\s*/) ?? [""])[0];
        return {
          ...base,
          category: "Syntax Error – Two Commands on One Line",
          title: "Two commands are written on the same line",
          why: `After \`${prev.text}\` R expected the command to end, but \`${at.text}\` follows on the same line.`,
          howToFix: "Put each command on its own line (or separate them with `;`).",
          simpler: "Write one command per line.",
          tips: ["One statement per line keeps code readable."],
          fix: { code: code.slice(0, prev.offset + prev.text.length) + "\n" + indent + code.slice(at.offset), summary: `Line ${at.line}: started a new line before \`${at.text}\`.`, confidence: "medium" },
        };
      }
      return {
        ...base,
        category: "Syntax Error – Unexpected Value",
        title: `R did not expect \`${at.text}\` here`,
        why: `\`${prev.text}\` and \`${at.text}\` are next to each other with nothing between them. R needs an operator (such as \`+\`, \`*\` or \`<-\`), a comma, or a new line.`,
        howToFix: "Add the missing operator or comma – or remove the extra word.",
        simpler: "Two things are side by side without anything connecting them.",
        tips: ["Check for a missing `+`, `,`, `<-` or `(`."],
      };
    }
  }

  // 10. Operator at the start of a line (pipe or + on the wrong line).
  if (/unexpected (SPECIAL|'\|>'|'\|')/.test(msg) && at && prev && prev.line < at.line) {
    const end = lineEndBeforeComment(code, prev.line);
    const fixed = insertAt(code.slice(0, at.offset) + code.slice(at.offset + at.text.length).replace(/^ /, ""), end, ` ${at.text}`);
    return {
      ...base,
      category: "Syntax Error – Operator on the Wrong Line",
      title: `\`${at.text}\` must go at the end of the previous line`,
      why: `R considers a command finished at the end of a line if nothing tells it to continue. Because \`${at.text}\` starts line ${at.line}, R had already finished the command on line ${prev.line}.`,
      howToFix: `Move \`${at.text}\` to the end of line ${prev.line}.`,
      simpler: `Put \`${at.text}\` at the end of the line, not the beginning of the next one.`,
      tips: ["Operators such as `|>`, `%>%` and `+` (in ggplot2) always end a line when a command continues."],
      fix: { code: fixed, summary: `Moved \`${at.text}\` from the start of line ${at.line} to the end of line ${prev.line}.`, confidence: "high" },
    };
  }

  // 11. Thousands separator: 1,000
  if (/unexpected ','/.test(msg) && at && prev?.kind === "number" && next?.kind === "number" && /^\d{3}$/.test(next.text) && depthAt(code, at.offset).depth === 0) {
    return {
      ...base,
      category: "Syntax Error – Number With a Comma",
      title: "Numbers cannot contain commas",
      why: "R uses commas to separate values, so `1,000` looks like two values. Write large numbers without separators.",
      howToFix: `Write \`${prev.text}${next.text}\`.`,
      simpler: "Write 1000, not 1,000.",
      tips: ["You can use `1e6` for one million."],
      fix: { code: code.slice(0, at.offset) + code.slice(at.offset + 1), summary: `Line ${at.line}: removed the thousands separator.`, confidence: "high" },
    };
  }

  // 12. Several values assigned without c(): x <- 1, 2, 3
  if (/unexpected ','/.test(msg) && at && depthAt(code, at.offset).depth === 0) {
    const lt = lineText(code, at.line);
    const m = /^(\s*[A-Za-z.][\w.]*\s*(?:<-|=)\s*)(.+?)\s*$/.exec(lt.replace(/\s*#.*$/, ""));
    if (m) {
      const all = code.split("\n");
      all[at.line - 1] = `${m[1]}c(${m[2]})`;
      return {
        ...base,
        category: "Syntax Error – Missing c()",
        title: "Use c() to combine several values",
        why: "To store several values in one variable, R needs them combined into a vector with `c()`. Without it, R sees a comma where it does not belong.",
        howToFix: "Wrap the values in `c( )`.",
        simpler: "Put the values inside `c( )`, like `c(1, 2, 3)`.",
        tips: ["`c()` stands for *combine*."],
        fix: { code: all.join("\n"), summary: `Line ${at.line}: wrapped the values in \`c()\`.`, confidence: "high" },
      };
    }
  }

  // 13. Invalid characters
  if (/unexpected input/.test(msg)) {
    return {
      ...base,
      category: "Syntax Error – Unexpected Character",
      title: "A character R does not understand",
      why: "The marked position contains a character that has no meaning in R code here (for example a stray symbol, an invisible character copied from a web page, or a backslash outside text).",
      howToFix: "Delete the character and type it again with your keyboard.",
      simpler: "There's a strange character at the marked spot. Delete it and retype it.",
      tips: ["Copying code from PDFs or chat apps sometimes brings in invisible characters."],
    };
  }

  // Generic
  const what = /unexpected (.+)/.exec(msg)?.[1];
  return {
    ...base,
    title: what ? `R found ${what.replace(/^'(.*)'$/, "`$1`")} where it did not expect it` : base.title,
    why: `${base.why}${what ? ` Here R was surprised by ${what.replace(/^'(.*)'$/, "`$1`")}.` : ""}`,
  };
}

/* ================================================================== */
/* Runtime errors                                                      */
/* ================================================================== */

export function analyzeRuntimeError(ctx: AnalysisContext): Diagnosis | null {
  const err = ctx.info?.error;
  if (!err) return null;
  const { code } = ctx;
  const msg = err.message;
  const l1 = err.line_start;
  const l2 = err.line_end;
  const stack = err.stack ?? [];
  const insideUserFn = stack.length > 1 ? stack[stack.length - 2] : null;
  const evidence =
    `R stopped with an error while running ${lines(l1, l2)}${err.call ? ` (in the call \`${err.call}\`)` : ""}. ` +
    (stack.length > 1 ? `Call stack: ${stack.map((s) => `\`${s.length > 60 ? s.slice(0, 57) + "…" : s}\``).join(" → ")}.` : "") +
    " Code before this line ran normally; code after it did not run.";
  const base: Diagnosis = {
    id: "runtime",
    kind: "runtime",
    category: "Runtime Error",
    title: "R stopped with an error",
    message: err.call ? `Error in ${err.call} : ${msg}` : `Error: ${msg}`,
    lineStart: l1,
    lineEnd: l2,
    evidence,
    why: "The code is written correctly, but something went wrong while R was running it.",
    howToFix: "Read the error message: it usually names the function and the value that caused the problem.",
    simpler: "The code looked fine, but R hit a problem while running it.",
    tips: [],
  };
  const defined = new Set([...(ctx.variables ?? []), ...assignedNames(code).map((a) => a.name)]);
  const columnsAll = Object.entries(ctx.columns ?? {});

  // Object not found
  let m = /object '([^']+)' not found/.exec(msg);
  if (m) {
    const name = m[1];
    const toks = findNameTokens(code, name, l1, l2);
    const token = toks[0] ? tokOf(toks[0]) : null;
    const assignedLater = assignedNames(code).find((a) => a.name === name && a.line > l2);
    const varMatch = closest(name, defined);
    const colOwners = columnsAll.filter(([, cols]) => cols.includes(name)).map(([df]) => df);
    const colMatch = closest(name, columnsAll.flatMap(([, cols]) => cols));
    const d: Diagnosis = {
      ...base,
      category: "Object Not Found",
      title: `R cannot find anything called \`${name}\``,
      token,
      evidence: base.evidence + (token ? ` \`${name}\` appears on line ${token.line}.` : ""),
      why: `You used the name \`${name}\`, but no variable with that name exists at this point.`,
      howToFix: "Check the spelling (R is case-sensitive) and make sure the variable is created before it is used.",
      simpler: `R doesn't know what \`${name}\` is.`,
      tips: ["R is case-sensitive: `Score` and `score` are different names.", "Create a variable before you use it – code runs from top to bottom."],
    };
    if (assignedLater) {
      return {
        ...d,
        title: `\`${name}\` is used before it is created`,
        why: `\`${name}\` is created on line ${assignedLater.line}, but it is used earlier, on ${lines(l1, l2)}. R runs code from top to bottom, so at that moment \`${name}\` does not exist yet.`,
        howToFix: `Move the line that creates \`${name}\` (line ${assignedLater.line}) above line ${l1}.`,
        simpler: `You're using \`${name}\` before you made it. Create it first.`,
      };
    }
    if (varMatch && toks.length) {
      const sameCase = varMatch.toLowerCase() === name.toLowerCase();
      return {
        ...d,
        title: sameCase ? `\`${name}\` should be \`${varMatch}\` (capital letters matter)` : `Did you mean \`${varMatch}\`?`,
        why: sameCase
          ? `You created a variable called \`${varMatch}\`, but wrote \`${name}\`. R is case-sensitive, so it treats these as two different names.`
          : `You created a variable named \`${varMatch}\`, but on ${lines(l1, l2)} you wrote \`${name}\`. R treats these as two different names.`,
        howToFix: `Use exactly the same name: \`${varMatch}\`.`,
        simpler: `You typed \`${name}\` but your variable is called \`${varMatch}\`.`,
        tips: ["R is case-sensitive, and variable names must match exactly.", "Use autocomplete (start typing, then Ctrl + Space) to avoid typos."],
        fix: { code: replaceTokens(code, toks, varMatch), summary: `Line ${toks[0].line}: \`${name}\` → \`${varMatch}\`.`, confidence: "high" },
      };
    }
    if (colOwners.length && toks.length) {
      const df = colOwners[0];
      return {
        ...d,
        category: "Object Not Found – Column Name",
        title: `\`${name}\` is a column of \`${df}\`, not a variable`,
        why: `\`${name}\` is the name of a column inside the data frame \`${df}\`. On its own, R looks for a separate variable called \`${name}\` – and there is none.`,
        howToFix: `Refer to the column through its data frame: \`${df}$${name}\`.`,
        simpler: `Tell R which table the column is in: \`${df}$${name}\`.`,
        tips: ["Use `df$column` to get a column.", "dplyr functions such as `filter()` and `mutate()` let you use column names directly."],
        fix: colOwners.length === 1 ? { code: replaceTokens(code, toks, `${df}$${name}`), summary: `Line ${toks[0].line}: \`${name}\` → \`${df}$${name}\`.`, confidence: "medium" } : null,
      };
    }
    if (colMatch && toks.length) {
      return {
        ...d,
        category: "Object Not Found – Column Name",
        title: `Did you mean the column \`${colMatch}\`?`,
        why: `There is no \`${name}\`, but one of your data frames has a column called \`${colMatch}\`. Column names must be spelled exactly, including capital letters.`,
        howToFix: `Use \`${colMatch}\`. Run \`names(your_data)\` to see all column names.`,
        simpler: `The column is called \`${colMatch}\`, not \`${name}\`.`,
        tips: ["`names(df)` lists the exact column names."],
        fix: { code: replaceTokens(code, toks, colMatch), summary: `Line ${toks[0].line}: \`${name}\` → \`${colMatch}\`.`, confidence: "medium" },
      };
    }
    // A bare word inside print()/cat()/paste(): probably meant as text.
    const inText = toks.find((t) => {
      const before = significant(tokenize(code)).filter((x) => x.offset < t.offset);
      const p1 = before[before.length - 1];
      const p2 = before[before.length - 2];
      return p1?.text === "(" && ["print", "cat", "paste", "paste0"].includes(p2?.text ?? "");
    });
    if (inText) {
      return {
        ...d,
        title: `Did you mean the text "${name}"?`,
        why: `Without quotes, R thinks \`${name}\` is the name of a variable and looks for it. To use it as text, it needs quotes.`,
        howToFix: `Write "${name}" with quotes.`,
        simpler: "Words you want to show as text need quotes around them.",
        tips: ['`print(hello)` prints the variable hello; `print("hello")` prints the word hello.'],
        fix: { code: replaceTokens(code, [inText], `"${name}"`), summary: `Line ${inText.line}: put quotes around ${name}.`, confidence: "medium" },
      };
    }
    return d;
  }

  // Could not find function
  m = /could not find function "([^"]+)"/.exec(msg);
  if (m) {
    const fn = m[1];
    const callToks = calledFunctions(code).filter((c) => c.name === fn && c.tok.line >= l1 && c.tok.line <= l2).map((c) => c.tok);
    const token = callToks[0] ? tokOf(callToks[0]) : null;
    const pkg = packageFor(fn);
    const later = definedFunctions(code).includes(fn) ? assignedNames(code).find((a) => a.name === fn) : undefined;
    const d: Diagnosis = {
      ...base,
      category: "Function Not Found",
      title: `There is no function called \`${fn}()\``,
      token,
      evidence: base.evidence + (token ? ` \`${fn}(\` appears on line ${token.line}.` : ""),
      why: `R does not know a function named \`${fn}\`. Either the name is misspelled, or the function comes from a package that has not been loaded with \`library()\`.`,
      howToFix: "Check the spelling, or load the package that provides the function.",
      simpler: `R doesn't have a function called \`${fn}\`.`,
      tips: ["Function names are case-sensitive: `Mean()` is not `mean()`.", "Functions from packages need `library(package)` first."],
    };
    if (later && later.line > l2) {
      return { ...d, title: `\`${fn}()\` is used before it is defined`, why: `You define \`${fn}\` on line ${later.line}, but call it earlier, on ${lines(l1, l2)}.`, howToFix: `Move the definition of \`${fn}\` above its first use.`, simpler: "Define the function before you use it." };
    }
    if (fn === "%>%") {
      return {
        ...d,
        title: "The pipe `%>%` needs a package",
        why: "`%>%` comes from the magrittr package, which dplyr loads for you. Base R has its own pipe, `|>`, which always works.",
        howToFix: "Add `library(dplyr)` at the top, or replace `%>%` with `|>`.",
        simpler: "Load dplyr first, or use `|>` instead.",
        fix: { code: `library(dplyr)\n${code}`, summary: "Added `library(dplyr)` at the top.", confidence: "high" },
      };
    }
    if (pkg) {
      return {
        ...d,
        category: "Function Not Found – Package Not Loaded",
        title: `\`${fn}()\` comes from the ${pkg} package`,
        why: `\`${fn}()\` is not part of base R – it lives in the **${pkg}** package. A package's functions only become available after \`library(${pkg})\`.`,
        howToFix: `Add \`library(${pkg})\` at the top of your code.`,
        simpler: `Write \`library(${pkg})\` first so R knows where \`${fn}\` comes from.`,
        tips: ["Put all `library()` calls at the top of your script.", "On this website packages are installed automatically the first time you load them."],
        fix: { code: `library(${pkg})\n${code}`, summary: `Added \`library(${pkg})\` at the top.`, confidence: "high" },
      };
    }
    const match = closest(fn, [...(ctx.functions ?? []), ...definedFunctions(code)]);
    if (match && callToks.length) {
      return {
        ...d,
        title: `Did you mean \`${match}()\`?`,
        why: `\`${fn}\` is not a function R knows, but \`${match}\` is very similar${match.toLowerCase() === fn.toLowerCase() ? " – only the capital letters differ, and R is case-sensitive" : " – it looks like a typo"}.`,
        howToFix: `Use \`${match}()\`.`,
        simpler: `It's spelled \`${match}\`.`,
        fix: { code: replaceTokens(code, callToks, match), summary: `Line ${callToks[0].line}: \`${fn}()\` → \`${match}()\`.`, confidence: "high" },
      };
    }
    return d;
  }

  // Maths with text
  if (/non-numeric argument to (binary operator|mathematical function)|invalid 'type' \(character\) of argument|'x' must be numeric/.test(msg)) {
    const lineToks = tokenize(code).filter((t) => t.kind === "name" && t.line >= l1 && t.line <= l2);
    const textVars = [...new Set(lineToks.map((t) => t.text))].filter((n) => ctx.classes?.[n] === "character");
    const convertible = textVars.filter((n) => ctx.numericText?.includes(n));
    const strings = tokenize(code).filter((t) => t.kind === "string" && t.line >= l1 && t.line <= l2 && /^["']-?\d+(\.\d+)?["']$/.test(t.text));
    let fix: ProposedFix | null = null;
    if (convertible.length) {
      const toks = lineToks.filter((t) => convertible.includes(t.text));
      // Do not wrap the target of an assignment.
      const sig = significant(tokenize(code));
      const targets = toks.filter((t) => {
        const nx = sig[sig.indexOf(sig.find((s) => s.offset === t.offset)!) + 1];
        return !(nx && (nx.text === "<-" || nx.text === "="));
      });
      if (targets.length) fix = { code: replaceTokens(code, targets, (t) => `as.numeric(${t.text})`), summary: `Line ${targets[0].line}: converted ${convertible.map((n) => `\`${n}\``).join(", ")} to numbers with \`as.numeric()\`.`, confidence: "medium" };
    } else if (strings.length) {
      fix = { code: replaceTokens(code, strings, (t) => t.text.slice(1, -1)), summary: `Line ${strings[0].line}: removed the quotes around ${strings.map((s) => s.text).join(", ")} so they are numbers.`, confidence: "high" };
    }
    return {
      ...base,
      category: "Type Error – Text Used as a Number",
      title: "Maths was done with text",
      token: strings[0] ? tokOf(strings[0]) : textVars.length ? tokOf(lineToks.find((t) => t.text === textVars[0])!) : null,
      why:
        textVars.length || strings.length
          ? `${textVars.length ? `${textVars.map((n) => `\`${n}\``).join(", ")} ${textVars.length > 1 ? "are" : "is"} text (character), not ${textVars.length > 1 ? "numbers" : "a number"}.` : ""} ${strings.length ? `${strings.map((s) => s.text).join(", ")} ${strings.length > 1 ? "are" : "is"} written in quotes, which makes ${strings.length > 1 ? "them" : "it"} text.` : ""} R cannot add, multiply or take the square root of text – even text that looks like a number, such as "10".`
          : "One of the values used in a calculation is text (character) rather than a number. R cannot do arithmetic with text.",
      howToFix: "Convert the text to numbers with `as.numeric()`, or remove the quotes if you typed the number yourself.",
      simpler: '"10" (with quotes) is text. 10 (without quotes) is a number. Only numbers can do maths.',
      tips: ["Use `class(x)` to check whether something is numeric or character.", "Columns read from a CSV become text if they contain symbols like $ or %."],
      fix,
    };
  }

  // Unused argument
  m = /unused arguments? \((.+)\)/.exec(msg);
  if (m) {
    const argName = /^([\w.]+)\s*=/.exec(m[1])?.[1];
    const match = argName && ctx.formals?.length ? closest(argName, ctx.formals) : null;
    let fix: ProposedFix | null = null;
    if (argName && match) {
      const toks = findNameTokens(code, argName, l1, l2);
      if (toks.length) fix = { code: replaceTokens(code, toks, match), summary: `Line ${toks[0].line}: argument \`${argName}\` → \`${match}\`.`, confidence: "high" };
    }
    const fnName = err.call?.split("(")[0];
    return {
      ...base,
      category: "Argument Error – Unknown Argument",
      title: argName ? `\`${fnName}()\` has no argument called \`${argName}\`` : "An argument the function does not accept",
      why: `You passed \`${m[1]}\` to \`${fnName}()\`, but that function does not have an argument with this name.${match ? ` It does have one called \`${match}\`.` : ""}`,
      howToFix: match ? `Use \`${match}\`.` : `Check the arguments with \`?${fnName}\`.`,
      simpler: match ? `The argument is called \`${match}\`.` : "The function doesn't have that option.",
      tips: [`Type \`args(${fnName})\` to list the arguments a function accepts.`],
      fix,
    };
  }

  m = /argument "([^"]+)" is missing, with no default/.exec(msg);
  if (m) {
    return {
      ...base,
      category: "Argument Error – Missing Argument",
      title: `The required argument \`${m[1]}\` was not given`,
      why: `The function${insideUserFn ? ` \`${insideUserFn.split("(")[0]}()\`` : ""} needs a value for \`${m[1]}\`, but none was provided and there is no default.`,
      howToFix: `Pass a value for \`${m[1]}\` when you call the function${err.call ? ` (\`${err.call}\`)` : ""}.`,
      simpler: `The function needs \`${m[1]}\`, but you didn't give it.`,
      tips: ["Function arguments without a default value must always be supplied."],
    };
  }

  if (/missing value where TRUE\/FALSE needed/.test(msg)) {
    return {
      ...base,
      category: "Logical Error – NA in a Condition",
      title: "The condition was NA (unknown)",
      why: "An `if` or `while` needs a clear TRUE or FALSE. Here the condition was `NA` – usually because a value is missing, and comparing NA to anything gives NA.",
      howToFix: "Check for missing values first, for example `if (!is.na(x) && x > 5)`, or remove them with `na.rm = TRUE` in summaries.",
      simpler: "The if-question had no clear yes/no answer because a value is missing (NA).",
      tips: ["`NA > 5` is `NA`, not FALSE.", "Use `is.na()` to test for missing values."],
    };
  }
  if (/the condition has length > 1/.test(msg)) {
    return {
      ...base,
      category: "Logical Error – Vector in a Condition",
      title: "`if` was given several TRUE/FALSE values",
      why: "`if` can only check one TRUE or FALSE at a time, but the condition produced a vector with several values (one per element).",
      howToFix: "Use `ifelse()` to decide for every element, or `any()` / `all()` to combine the values into one.",
      simpler: "`if` asks one yes/no question; you gave it many answers.",
      tips: ['`ifelse(scores > 50, "pass", "fail")` works element by element.'],
    };
  }
  if (/argument is of length zero/.test(msg)) {
    return {
      ...base,
      category: "Logical Error – Empty Condition",
      title: "The condition is empty",
      why: "The value tested by `if`/`while` has no elements at all – for example a column name with a typo (`df$wrong_name` gives `NULL`) or an empty result.",
      howToFix: "Print the condition's value to see what it contains, and check column names with `names()`.",
      simpler: "The if-question was asked about nothing.",
      tips: ["`df$colum` with a typo gives NULL silently."],
    };
  }
  if (/undefined columns selected/.test(msg)) {
    const strs = tokenize(code).filter((t) => t.kind === "string" && t.line >= l1 && t.line <= l2);
    const allCols = columnsAll.flatMap(([, c]) => c);
    const bad = strs.find((s) => !allCols.includes(s.text.slice(1, -1)));
    const match = bad ? closest(bad.text.slice(1, -1), allCols) : null;
    return {
      ...base,
      category: "Data Frame Error – Unknown Column",
      title: "A column name does not exist",
      token: bad ? tokOf(bad) : null,
      why: `You asked for a column that is not in the data frame${bad ? ` (${bad.text})` : ""}.${match ? ` A column called "${match}" does exist.` : ""}`,
      howToFix: "Check the exact column names with `names(df)`.",
      simpler: "That column name isn't in the table.",
      tips: ["Remember: rows come before the comma, columns after: `df[rows, columns]`."],
      fix: bad && match ? { code: replaceTokens(code, [bad], `${bad.text[0]}${match}${bad.text[0]}`), summary: `Line ${bad.line}: ${bad.text} → "${match}".`, confidence: "medium" } : null,
    };
  }
  m = /cannot open file '([^']+)'|cannot open the connection|'([^']+)' does not exist/.exec(msg);
  if (m || /No such file or directory/.test(msg) || ctx.info?.warnings.some((w) => /cannot open file/.test(w.message))) {
    const w = ctx.info?.warnings.find((x) => /cannot open file '([^']+)'/.test(x.message));
    const file = m?.[1] ?? m?.[2] ?? (w ? /cannot open file '([^']+)'/.exec(w.message)?.[1] : undefined);
    const strTok = file ? tokenize(code).find((t) => t.kind === "string" && t.text.slice(1, -1) === file) : undefined;
    const match = file ? closest(file, ctx.files ?? []) ?? (ctx.files ?? []).find((f) => f.endsWith("/" + file.split("/").pop())) : null;
    return {
      ...base,
      category: "File Error – File Not Found",
      title: file ? `R cannot find the file "${file}"` : "R cannot open the file",
      token: strTok ? tokOf(strTok) : null,
      why: "R looked for the file in its working folder and did not find it. The name or the folder in the path is probably different.",
      howToFix: match ? `Use the path "${match}".` : 'Check the file name and folder. On this site, sample data is in the "data/" folder, e.g. "data/students.csv". Files you upload on the Playground also go there.',
      simpler: "The file isn't where you told R to look.",
      tips: ['Run `list.files("data")` to see the available files.', "File names are case-sensitive."],
      fix: strTok && match ? { code: replaceTokens(code, [strTok], `"${match}"`), summary: `Line ${strTok.line}: "${file}" → "${match}".`, confidence: "high" } : null,
    };
  }
  m = /there is no package called [‘'"]([^’'"]+)[’'"]/.exec(msg);
  if (m) {
    const pkg = m[1];
    const correct = PACKAGE_TYPOS[pkg];
    const toks = tokenize(code).filter((t) => (t.kind === "name" || t.kind === "string") && t.text.replace(/["']/g, "") === pkg);
    return {
      ...base,
      category: "Package Error",
      title: correct ? `The package is called \`${correct}\`, not \`${pkg}\`` : `The package \`${pkg}\` is not available`,
      token: toks[0] ? tokOf(toks[0]) : null,
      why: correct
        ? `There is no package named \`${pkg}\` – the correct name is \`${correct}\`.`
        : `R could not load \`${pkg}\`. Either the name is misspelled, or it is not available in webR (the browser version of R). Packages that need system libraries or compiled code not yet ported to WebAssembly cannot run in the browser.`,
      howToFix: correct ? `Write \`library(${correct})\`.` : "Check the spelling. If the package is not available in the browser, run this code in R/RStudio on your computer.",
      simpler: correct ? `Spell it \`${correct}\`.` : "That package can't be loaded here.",
      tips: ["Popular packages that work here: dplyr, tidyr, ggplot2, stringr, lubridate."],
      fix: correct && toks.length ? { code: replaceTokens(code, toks, (t) => (t.kind === "string" ? `"${correct}"` : correct)), summary: `\`${pkg}\` → \`${correct}\`.`, confidence: "high" } : null,
    };
  }
  if (/invalid argument to unary operator|Cannot use `\+` with a single argument/.test(msg)) {
    const lt = lineText(code, l1);
    if (/^\s*\+/.test(lt) && l1 > 1) {
      const all = code.split("\n");
      let p = l1 - 2;
      while (p > 0 && !all[p].trim()) p--;
      const end = lineEndBeforeComment(code, p + 1);
      const fixed = insertAt(code, end, " +");
      const fixedLines = fixed.split("\n");
      fixedLines[l1 - 1] = fixedLines[l1 - 1].replace(/^(\s*)\+\s*/, "$1");
      return {
        ...base,
        category: "Syntax Mistake – `+` on a New Line",
        title: "The `+` must go at the end of the previous line",
        token: { line: l1, from: lt.indexOf("+") + 1, to: lt.indexOf("+") + 2, text: "+" },
        why: `Line ${p + 1} looked like a complete command, so R ran it on its own. Then line ${l1} started with \`+\`, which has nothing to add to.`,
        howToFix: `Move the \`+\` to the end of line ${p + 1}.`,
        simpler: "In ggplot2, put `+` at the end of a line, not the start of the next.",
        tips: ["When a command continues on the next line, end the line with an operator (`+`, `|>`, `,`)."],
        fix: { code: fixedLines.join("\n"), summary: `Moved \`+\` from the start of line ${l1} to the end of line ${p + 1}.`, confidence: "high" },
      };
    }
  }
  if (/attempt to apply non-function/.test(msg)) {
    const toks = significant(tokenize(code)).filter((t) => t.line >= l1 && t.line <= l2);
    const i = toks.findIndex((t, k) => (t.kind === "number" || t.kind === "close") && toks[k + 1]?.text === "(" && toks[k + 1].offset === t.offset + t.text.length);
    const t = i >= 0 ? toks[i] : undefined;
    return {
      ...base,
      category: "Syntax Mistake – Missing Operator",
      title: "Something that is not a function was called like one",
      token: t ? tokOf(t) : null,
      why: "R saw a value followed directly by `(`, so it tried to use the value as a function. In maths `2(3 + 4)` means multiplication, but R needs `*`.",
      howToFix: "Add `*` between the value and the bracket, or check that the name before `(` really is a function.",
      simpler: "Write `2 * (3 + 4)`, not `2(3 + 4)`.",
      tips: ["Only functions can be followed by `( )`."],
      fix: t ? { code: insertAt(code, t.offset + t.text.length, " * "), summary: `Line ${t.line}: added \`*\` after \`${t.text}\`.`, confidence: "high" } : null,
    };
  }
  if (/\$ operator is invalid for atomic vectors/.test(msg))
    return { ...base, category: "Type Error – `$` on a Vector", title: "`$` only works on lists and data frames", why: "`$` picks a named part out of a list or a data frame. The object before `$` is a plain vector, which has no parts to pick.", howToFix: "Use `[ ]` with a position or name for vectors, e.g. `x[1]` or `x[\"name\"]`. Check the object with `class()`.", simpler: "You can't use `$` on a simple vector.", tips: ["`str(x)` shows what kind of object you have."] };
  if (/object of type 'closure' is not subsettable/.test(msg)) {
    const fnNames = new Set(ctx.functions ?? []);
    const t = significant(tokenize(code)).find((x, k, arr) => x.line >= l1 && x.line <= l2 && x.kind === "name" && fnNames.has(x.text) && ["$", "["].includes(arr[k + 1]?.text ?? "") && !defined.has(x.text));
    return {
      ...base,
      category: "Type Error – Function Used as Data",
      title: t ? `\`${t.text}\` is a function, not your data` : "A function was used as if it were data",
      token: t ? tokOf(t) : null,
      why: `${t ? `\`${t.text}\` is the name of a built-in R function. ` : ""}You used \`$\` or \`[ ]\` on it as if it were a data frame – usually because the data was never created (or was saved under another name), so R found the function instead.`,
      howToFix: "Make sure your data is created first (for example with `read.csv()`), and use that variable's exact name.",
      simpler: "That name belongs to a function, not to your data.",
      tips: ["Avoid naming data `data`, `df`, `c` or `mean` – those are function names."],
    };
  }
  m = /arguments imply differing number of rows: (.+)/.exec(msg);
  if (m) return { ...base, category: "Data Frame Error – Different Lengths", title: "Columns have different lengths", why: `A data frame needs every column to have the same number of values, but the columns have ${m[1]} values.`, howToFix: "Make every vector the same length (count the values in each `c()`).", simpler: "Each column must have the same number of values.", tips: ["`length(x)` tells you how many values a vector has."] };
  m = /replacement has (\d+) rows?, data has (\d+)/.exec(msg);
  if (m) return { ...base, category: "Data Frame Error – Wrong Length", title: `A new column has ${m[1]} values but the data frame has ${m[2]} rows`, why: "When you add or replace a column, it needs one value per row.", howToFix: `Give exactly ${m[2]} values – or a single value that is repeated for every row.`, simpler: "The new column needs one value per row.", tips: ["`nrow(df)` tells you the number of rows."] };
  if (/subscript out of bounds/.test(msg)) return { ...base, category: "Index Error – Out of Bounds", title: "You asked for a position that does not exist", why: "You used `[[ ]]` or a matrix index with a position (or name) larger than what the object contains.", howToFix: "Check the size with `length()` or `dim()` and use a valid position.", simpler: "That position doesn't exist.", tips: ["Positions in R start at 1, not 0."] };
  if (/incorrect number of dimensions/.test(msg)) return { ...base, category: "Index Error – Wrong Dimensions", title: "`[row, column]` used on something without rows and columns", why: "`x[i, j]` works for data frames and matrices. A vector has only one dimension, so use `x[i]`.", howToFix: "Use a single index for vectors.", simpler: "A vector has no columns – use one number in [ ].", tips: ["`dim(x)` is NULL for vectors."] };
  if (/non-conformable/.test(msg)) return { ...base, category: "Matrix Error – Incompatible Sizes", title: "Matrix sizes do not fit together", why: "The two matrices or arrays have shapes that cannot be combined this way.", howToFix: "Check the shapes with `dim()`. For element-wise multiplication use `*`; for matrix multiplication the columns of the first must equal the rows of the second.", simpler: "The two tables have incompatible shapes.", tips: [] };
  if (/plot.new has not been called yet/.test(msg)) return { ...base, category: "Plot Error – No Plot Yet", title: "There is no plot to add to", why: "Functions like `lines()`, `points()`, `abline()` and `legend()` add to an existing plot, but no plot had been drawn yet.", howToFix: "Draw the plot first (for example `plot(x, y)`) and then add lines or points.", simpler: "Draw the chart first, then add extras to it.", tips: [] };
  if (/invalid \(do_set\) left-hand side to assignment|invalid assignment target/.test(msg)) return { ...base, category: "Assignment Error", title: "The left side of `<-` must be a name", why: "`<-` stores the value on its right in the name on its left. The left side here is not a valid name (for example a number or a quoted text).", howToFix: "Write the variable name on the left: `x <- 5`.", simpler: "Put the name on the left of `<-` and the value on the right.", tips: [] };

  return {
    ...base,
    why: `R reported: “${msg}”. ${base.why}`,
    tips: ["Copy the error message into the AI tutor or a search engine – most R errors have well-known causes.", "Run your code line by line to find the first line that fails."],
  };
}

/* ================================================================== */
/* Warnings                                                            */
/* ================================================================== */

export function analyzeWarnings(ctx: AnalysisContext): Diagnosis[] {
  const out: Diagnosis[] = [];
  for (const [i, w] of (ctx.info?.warnings ?? []).entries()) {
    const base: Diagnosis = {
      id: `warning-${i}`,
      kind: "warning",
      category: "Warning",
      title: "R finished, but warned you about something",
      message: w.call ? `Warning message: In ${w.call} : ${w.message}` : `Warning message: ${w.message}`,
      lineStart: w.line_start,
      lineEnd: w.line_end,
      evidence: `R raised this warning while running ${lines(w.line_start, w.line_end)}. A warning does not stop the code, but the result may not be what you expect.`,
      why: `R reported: “${w.message}”.`,
      howToFix: "Check the result of that line carefully.",
      simpler: "The code ran, but R thinks something might be wrong.",
      tips: [],
    };
    if (/NAs introduced by coercion/.test(w.message))
      out.push({ ...base, category: "Warning – Values Became NA", title: "Some text could not be turned into numbers", why: 'You converted text to numbers (e.g. with `as.numeric()`), and some values were not valid numbers – such as "ten", "$5" or "N/A". R replaced them with `NA` (missing).', howToFix: 'Look at the values that became NA. Clean them first (e.g. `gsub("[$,]", "", x)`), or accept that they are missing.', simpler: "Some values weren't numbers, so R marked them as missing (NA).", tips: ["`x[is.na(as.numeric(x))]` shows the values that could not be converted."] });
    else if (/longer object length is not a multiple of shorter object length/.test(w.message))
      out.push({ ...base, category: "Warning – Lengths Do Not Match", title: "Two vectors of different lengths were combined", why: "When R combines vectors of different lengths it repeats (recycles) the shorter one. Because the longer length is not a multiple of the shorter, the repetition does not line up evenly – this is almost always a mistake.", howToFix: "Make sure both vectors have the same length (check with `length()`).", simpler: "The two lists of numbers have different lengths.", tips: [] });
    else if (/NaNs produced/.test(w.message))
      out.push({ ...base, category: "Warning – Impossible Maths (NaN)", title: "A calculation had no valid answer", why: "For example `sqrt(-1)` or `log(-5)`: these have no real-number answer, so R returns `NaN` (Not a Number).", howToFix: "Check for negative or zero values before taking square roots or logarithms.", simpler: "You asked for something impossible, like the square root of a negative number.", tips: [] });
    else if (/argument is not numeric or logical: returning NA/.test(w.message))
      out.push({ ...base, category: "Warning – Mean of Non-Numbers", title: "`mean()` was given something that is not numeric", why: "`mean()` only works on numbers (or TRUE/FALSE). It was given text or a whole data frame, so it returned NA.", howToFix: "Pass a numeric vector, e.g. a single column: `mean(df$score)`. Convert text with `as.numeric()` if needed.", simpler: "You can only average numbers.", tips: ["`colMeans()` or `summary()` work on whole data frames."] });
    else if (/number of items to replace is not a multiple of replacement length/.test(w.message))
      out.push({ ...base, category: "Warning – Wrong Number of Values", title: "The number of values does not match the places to fill", why: "You assigned several values to a selection of a different size, so R repeated or dropped values.", howToFix: "Assign exactly as many values as you selected.", simpler: "Too many or too few values for the spots you chose.", tips: [] });
    else if (/Removed \d+ rows? containing/.test(w.message))
      out.push({ ...base, category: "Warning – Rows Left Out of the Plot", title: "ggplot2 skipped rows with missing values", why: "Some rows had `NA` (or values outside the axis limits) in the plotted columns, so ggplot2 could not draw them.", howToFix: "This is often fine. To be explicit, remove missing values first (e.g. `tidyr::drop_na()` or `filter(!is.na(col))`).", simpler: "Some points were missing, so they weren't drawn.", tips: [] });
    else if (/Chi-squared approximation may be incorrect/.test(w.message))
      out.push({ ...base, category: "Warning – Small Expected Counts", title: "Some groups are too small for the chi-square test", why: "The chi-square test is reliable when every expected count is about 5 or more. Some cells here are smaller, so the p-value may be inaccurate.", howToFix: "Combine small categories, or use `fisher.test()` for small tables.", simpler: "The groups are too small for this test to be reliable.", tips: [] });
    else out.push(base);
  }
  return out;
}

/* ================================================================== */
/* Static checks (no R error, but likely logic/style problems)         */
/* ================================================================== */

export function staticChecks(code: string): Diagnosis[] {
  const out: Diagnosis[] = [];
  const sig = significant(tokenize(code));
  const mk = (d: Omit<Diagnosis, "message" | "lineEnd"> & { lineEnd?: number | null }): Diagnosis => ({ message: null, lineEnd: d.lineStart, ...d });
  for (let i = 0; i < sig.length; i++) {
    const t = sig[i];
    const nx = sig[i + 1];
    if (t.kind === "op" && (t.text === "==" || t.text === "!=") && nx?.text === "NA") {
      const left = sig[i - 1];
      const fixCode =
        left?.kind === "name" ? code.slice(0, left.offset) + `${t.text === "!=" ? "!" : ""}is.na(${left.text})` + code.slice(nx.offset + nx.text.length) : null;
      out.push(
        mk({
          id: `na-compare-${t.line}`,
          kind: "logic",
          category: "Logical Issue – Comparing With NA",
          title: `\`${t.text} NA\` never gives TRUE or FALSE`,
          lineStart: t.line,
          token: { line: t.line, from: t.col, to: nx.col + 2, text: `${t.text} NA` },
          evidence: `Static check: the code contains \`${t.text} NA\` on line ${t.line}. R does not report this as an error – it silently returns NA.`,
          why: "`NA` means \"unknown\". Asking whether something equals an unknown value gives an unknown answer, so `x == NA` is always NA – never TRUE.",
          howToFix: "Use `is.na(x)` to test for missing values (and `!is.na(x)` for not missing).",
          simpler: "Use `is.na(x)` to check for missing values.",
          tips: [],
          fix: fixCode ? { code: fixCode, summary: `Line ${t.line}: \`${left!.text} ${t.text} NA\` → \`${t.text === "!=" ? "!" : ""}is.na(${left!.text})\`.`, confidence: "high" } : null,
        }),
      );
    }
    if (t.kind === "name" && t.text === "na_rm" && nx?.text === "=") {
      out.push(
        mk({
          id: `na_rm-${t.line}`,
          kind: "logic",
          category: "Logical Issue – Misspelled Argument",
          title: "`na_rm` should be `na.rm`",
          lineStart: t.line,
          token: { line: t.line, from: t.col, to: t.col + 5, text: "na_rm" },
          evidence: `Static check: \`na_rm =\` appears on line ${t.line}. Functions such as mean() and sum() accept extra arguments, so R silently ignores the misspelled one instead of reporting an error.`,
          why: "The argument that removes missing values is spelled with a dot: `na.rm`. A misspelled argument is ignored by `mean()`, `sum()`, `max()` …, so missing values are *not* removed and the result may be NA.",
          howToFix: "Write `na.rm = TRUE`.",
          simpler: "It's `na.rm` with a dot.",
          tips: [],
          fix: { code: replaceTokens(code, [t], "na.rm"), summary: `Line ${t.line}: \`na_rm\` → \`na.rm\`.`, confidence: "high" },
        }),
      );
    }
    if (t.kind === "name" && (t.text === "T" || t.text === "F") && !["$", "@", "::"].includes(sig[i - 1]?.text ?? "") && nx?.text !== "<-" && nx?.text !== "=") {
      out.push(
        mk({
          id: `tf-${t.line}-${t.col}`,
          kind: "style",
          category: "Style Tip",
          title: `Write \`${t.text === "T" ? "TRUE" : "FALSE"}\` instead of \`${t.text}\``,
          lineStart: t.line,
          token: { line: t.line, from: t.col, to: t.col + 1, text: t.text },
          evidence: `Static check: \`${t.text}\` on line ${t.line}.`,
          why: "`T` and `F` are ordinary variables that can be overwritten (e.g. `T <- 0`), while `TRUE` and `FALSE` always mean what they say.",
          howToFix: `Use \`${t.text === "T" ? "TRUE" : "FALSE"}\`.`,
          simpler: "Spell out TRUE and FALSE.",
          tips: [],
        }),
      );
    }
    if (t.kind === "name" && t.text === "setwd" && nx?.text === "(") {
      out.push(mk({ id: `setwd-${t.line}`, kind: "style", category: "Browser Note", title: "`setwd()` points to a folder on your own computer", lineStart: t.line, evidence: `Static check: \`setwd(\` on line ${t.line}.`, why: "In the browser, R has its own small file system that does not include your computer's folders, so paths like \"C:/Users/…\" do not exist here.", howToFix: 'Remove `setwd()`. Sample data is in "data/", and uploaded files are saved there too.', simpler: "Your computer's folders aren't available here.", tips: [] }));
    }
  }
  return out;
}

/** Everything the error checker knows about a run, most important first. */
export function analyzeRun(ctx: AnalysisContext): Diagnosis[] {
  const out: Diagnosis[] = [];
  const pe = ctx.parseError ?? ctx.info?.parse_error ?? null;
  if (pe) out.push(analyzeParseError(ctx.code, pe));
  else {
    const rt = analyzeRuntimeError(ctx);
    if (rt) out.push(rt);
    out.push(...analyzeWarnings(ctx));
    out.push(...staticChecks(ctx.code));
  }
  return out;
}

/**
 * Checks based on what R actually printed: e.g. mean() printing NA because
 * the data contains missing values and na.rm = TRUE was not used.
 */
export function outputChecks(code: string, stdout: string[]): Diagnosis[] {
  const out: Diagnosis[] = [];
  if (!stdout.some((l) => /^\[1\] NA$/.test(l.trim()))) return out;
  const calls = calledFunctions(code).filter((c) => ["mean", "sum", "max", "min", "median", "sd", "var", "range", "quantile"].includes(c.name));
  const toks = significant(tokenize(code));
  const without = calls.filter((c) => {
    // find the call's closing bracket and check for na.rm inside it
    const start = toks.findIndex((t) => t.offset === c.tok.offset);
    let depth = 0;
    for (let k = start + 1; k < toks.length; k++) {
      if (toks[k].kind === "open") depth++;
      else if (toks[k].kind === "close") {
        depth--;
        if (depth === 0) return true;
      } else if (depth === 1 && toks[k].text === "na.rm") return false;
    }
    return true;
  });
  if (!without.length) return out;
  const c = without[0];
  out.push({
    id: `na-result-${c.tok.line}`,
    kind: "logic",
    category: "Logical Issue – Result is NA",
    title: `\`${c.name}()\` returned NA`,
    message: null,
    lineStart: c.tok.line,
    lineEnd: c.tok.line,
    token: { line: c.tok.line, from: c.tok.col, to: c.tok.col + c.name.length, text: c.name },
    evidence: `R printed [1] NA, and \`${c.name}()\` on line ${c.tok.line} is called without \`na.rm = TRUE\`. If the data contains missing values (NA), this is why the result is NA.`,
    why: `If even one value is missing (\`NA\`), R cannot know the true ${c.name === "sum" ? "total" : "answer"}, so \`${c.name}()\` returns \`NA\` – unless you tell it to ignore missing values.`,
    howToFix: `Add \`na.rm = TRUE\`, for example \`${c.name}(x, na.rm = TRUE)\` – and think about whether ignoring missing values makes sense for your data.`,
    simpler: "Your data has a missing value, so R answered \"unknown\". Add `na.rm = TRUE` to skip missing values.",
    tips: ["`sum(is.na(x))` counts the missing values."],
    fix: null,
  });
  return out;
}
