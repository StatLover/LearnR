"use client";

import { useEffect, useImperativeHandle, useLayoutEffect, useRef, type Ref } from "react";
import { EditorState, Compartment, StateEffect, StateField, type Extension, RangeSetBuilder } from "@codemirror/state";
import {
  EditorView,
  Decoration,
  type DecorationSet,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  placeholder as placeholderExt,
  dropCursor,
  rectangularSelection,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, indentOnInput, syntaxHighlighting, indentUnit } from "@codemirror/language";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap, completeAnyWord, completeFromList } from "@codemirror/autocomplete";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { rHighlighter, rLanguage } from "@/lib/r/language";
import { R_COMPLETIONS } from "@/lib/r/completions";
import { useSettings } from "@/lib/store/settings";

export interface LineMark {
  line: number;
  kind: "error" | "warning" | "highlight";
}
export interface TokenMark {
  line: number;
  from: number; // 1-based column
  to: number; // exclusive, 1-based
}

export interface CodeEditorHandle {
  getValue(): string;
  setValue(code: string): void;
  focus(): void;
  scrollToLine(line: number): void;
}

export interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  onRun?: () => void;
  onFormat?: () => void;
  onSave?: () => void;
  readOnly?: boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
  height?: number | string;
  lineMarks?: LineMark[];
  tokenMarks?: TokenMark[];
  ariaLabel?: string;
  placeholder?: string;
  className?: string;
  ref?: Ref<CodeEditorHandle>;
  autoFocus?: boolean;
}

const setMarks = StateEffect.define<{ lines: LineMark[]; tokens: TokenMark[] }>();

const marksField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(setMarks)) {
        const doc = tr.state.doc;
        const items: { from: number; to: number; deco: Decoration }[] = [];
        for (const m of e.value.lines) {
          if (m.line < 1 || m.line > doc.lines) continue;
          const l = doc.line(m.line);
          items.push({ from: l.from, to: l.from, deco: Decoration.line({ class: `cm-${m.kind}-line` }) });
        }
        for (const t of e.value.tokens) {
          if (t.line < 1 || t.line > doc.lines) continue;
          const l = doc.line(t.line);
          const from = Math.min(l.to, l.from + t.from - 1);
          const to = Math.min(l.to, l.from + t.to - 1);
          if (to > from) items.push({ from, to, deco: Decoration.mark({ class: "cm-error-token" }) });
        }
        items.sort((a, b) => a.from - b.from || a.to - b.to);
        const b = new RangeSetBuilder<Decoration>();
        for (const it of items) b.add(it.from, it.to, it.deco);
        deco = b.finish();
      }
    }
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const insertText = (text: string) => (view: EditorView) => {
  view.dispatch(view.state.replaceSelection(text));
  return true;
};

export function CodeEditor({
  value,
  onChange,
  onRun,
  onFormat,
  onSave,
  readOnly = false,
  minHeight = 120,
  maxHeight,
  height,
  lineMarks = [],
  tokenMarks = [],
  ariaLabel = "R code editor",
  placeholder,
  className,
  ref,
  autoFocus,
}: CodeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const settings = useSettings();
  const callbacks = useRef({ onChange, onRun, onFormat, onSave });
  useLayoutEffect(() => {
    callbacks.current = { onChange, onRun, onFormat, onSave };
  });
  const comps = useRef({ lines: new Compartment(), brackets: new Compartment(), readOnly: new Compartment(), size: new Compartment() });

  useImperativeHandle(ref, () => ({
    getValue: () => view.current?.state.doc.toString() ?? value,
    setValue: (code: string) => {
      const v = view.current;
      if (v) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: code } });
    },
    focus: () => view.current?.focus(),
    scrollToLine: (line: number) => {
      const v = view.current;
      if (!v || line < 1 || line > v.state.doc.lines) return;
      const pos = v.state.doc.line(line).from;
      v.dispatch({ effects: EditorView.scrollIntoView(pos, { y: "center" }), selection: { anchor: pos } });
      v.focus();
    },
  }));

  // Create the editor once.
  useEffect(() => {
    if (!host.current) return;
    const c = comps.current;
    const sizeTheme = (minH: number | string, maxH?: number | string, h?: number | string): Extension =>
      EditorView.theme({
        "&": { height: h === undefined ? "auto" : typeof h === "number" ? `${h}px` : h },
        ".cm-scroller": {
          minHeight: typeof minH === "number" ? `${minH}px` : minH,
          maxHeight: maxH === undefined ? "none" : typeof maxH === "number" ? `${maxH}px` : maxH,
          overflow: "auto",
        },
        ".cm-content": { padding: "10px 0" },
        ".cm-line": { padding: "0 12px" },
      });
    const state = EditorState.create({
      doc: value,
      extensions: [
        c.lines.of(settings.lineNumbers ? [lineNumbers(), highlightActiveLineGutter()] : []),
        history(),
        drawSelection(),
        dropCursor(),
        rectangularSelection(),
        indentUnit.of("  "),
        EditorState.tabSize.of(2),
        indentOnInput(),
        bracketMatching(),
        c.brackets.of(settings.autoCloseBrackets ? closeBrackets() : []),
        highlightActiveLine(),
        highlightSelectionMatches(),
        rLanguage,
        syntaxHighlighting(rHighlighter),
        autocompletion({
          override: [completeFromList(R_COMPLETIONS), completeAnyWord],
          activateOnTyping: true,
          icons: false,
        }),
        c.readOnly.of([EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)]),
        c.size.of(sizeTheme(minHeight, maxHeight, height)),
        marksField,
        placeholder ? placeholderExt(placeholder) : [],
        EditorView.contentAttributes.of({ "aria-label": ariaLabel, spellcheck: "false", autocapitalize: "off", autocorrect: "off" }),
        EditorView.lineWrapping,
        keymap.of([
          { key: "Mod-Enter", run: () => (callbacks.current.onRun?.(), true), preventDefault: true },
          { key: "Mod-Shift-f", run: () => (callbacks.current.onFormat?.(), true), preventDefault: true },
          { key: "Mod-s", run: () => (callbacks.current.onSave?.(), Boolean(callbacks.current.onSave)), preventDefault: true },
          { key: "Alt--", run: insertText(" <- "), preventDefault: true },
          { key: "Mod-Shift-m", run: insertText(" |> "), preventDefault: true },
          ...closeBracketsKeymap,
          ...completionKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...defaultKeymap,
          indentWithTab,
        ]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) callbacks.current.onChange?.(u.state.doc.toString());
        }),
      ],
    });
    const v = new EditorView({ state, parent: host.current });
    view.current = v;
    if (autoFocus) v.focus();
    return () => {
      v.destroy();
      view.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the document in sync when the value prop changes from outside.
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  useEffect(() => {
    const v = view.current;
    if (!v) return;
    const c = comps.current;
    v.dispatch({
      effects: [
        c.lines.reconfigure(settings.lineNumbers ? [lineNumbers(), highlightActiveLineGutter()] : []),
        c.brackets.reconfigure(settings.autoCloseBrackets ? closeBrackets() : []),
        c.readOnly.reconfigure([EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)]),
      ],
    });
  }, [settings.lineNumbers, settings.autoCloseBrackets, readOnly]);

  useEffect(() => {
    view.current?.dispatch({ effects: setMarks.of({ lines: lineMarks, tokens: tokenMarks }) });
  }, [lineMarks, tokenMarks]);

  return <div ref={host} className={className} data-testid="code-editor" />;
}
