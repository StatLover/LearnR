/**
 * R syntax highlighting shared by the editor (CodeMirror) and static code
 * blocks, so both use identical tokens and colours in light and dark mode.
 */
import { StreamLanguage, type StreamParser } from "@codemirror/language";
import { r as rMode } from "@codemirror/legacy-modes/mode/r";
import { highlightCode, tagHighlighter, tags } from "@lezer/highlight";

const base = rMode as StreamParser<unknown>;

const rWithCalls: StreamParser<unknown> = {
  ...base,
  name: "r",
  token(stream, state) {
    const style = base.token(stream, state);
    // Words followed by "(" are function calls: colour them like functions.
    if ((style === "variable" || style === "builtin") && stream.match(/^\s*\(/, false)) return "callee";
    return style;
  },
  tokenTable: { callee: tags.function(tags.variableName) },
};

export const rLanguage = StreamLanguage.define(rWithCalls);

export const rHighlighter = tagHighlighter([
  { tag: tags.keyword, class: "tok-keyword" },
  { tag: [tags.atom, tags.bool], class: "tok-atom" },
  { tag: tags.number, class: "tok-number" },
  { tag: [tags.string, tags.special(tags.string)], class: "tok-string" },
  { tag: tags.comment, class: "tok-comment" },
  { tag: tags.operator, class: "tok-operator" },
  { tag: [tags.function(tags.variableName), tags.standard(tags.variableName)], class: "tok-function" },
  { tag: tags.special(tags.variableName), class: "tok-operator" },
  { tag: tags.variableName, class: "tok-variableName" },
  { tag: tags.punctuation, class: "tok-punctuation" },
  { tag: tags.meta, class: "tok-meta" },
]);

export interface Span {
  text: string;
  cls: string;
}

/** Highlight R code into lines of coloured spans (works on the server too). */
export function highlightR(code: string): Span[][] {
  const lines: Span[][] = [[]];
  try {
    const tree = rLanguage.parser.parse(code);
    highlightCode(
      code,
      tree,
      rHighlighter,
      (text, cls) => lines[lines.length - 1].push({ text, cls }),
      () => lines.push([]),
    );
  } catch {
    return code.split("\n").map((l) => [{ text: l, cls: "" }]);
  }
  return lines;
}
