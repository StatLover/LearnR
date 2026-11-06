"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from "react";
import {
  Play,
  Square,
  RotateCcw,
  Copy,
  Wand2,
  Download,
  Eraser,
  Save,
  Keyboard,
  Terminal,
  ImageIcon,
  Table2,
  Boxes,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";
import { CodeEditor, type CodeEditorHandle, type LineMark } from "./code-editor";
import { ConsoleView, DataViewer, EnvironmentPane, PlotGallery } from "./output-panels";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { rSession } from "@/lib/r/session";
import type { ConsoleLine, EnvVariable, RTable, RunResult } from "@/lib/r/console";
import { formatR } from "@/lib/r/format";
import { useRSession } from "@/hooks/use-r-session";
import { useResolvedTheme } from "@/hooks/use-theme";
import { useSettings } from "@/lib/store/settings";
import { progress } from "@/lib/store/progress";
import { cn, copyText, downloadText } from "@/lib/utils";

export interface CodeRunnerProps {
  initialCode: string;
  /** R environment name; code runs in the same workspace share variables. */
  workspace: string;
  title?: string;
  /** "full": playground style; "compact": inline example; "panel": side panel. */
  variant?: "full" | "compact" | "panel";
  editorMinHeight?: number;
  editorMaxHeight?: number | string;
  outputMaxHeight?: number | string;
  /** Persist edits under this key (localStorage). */
  storageKey?: string;
  downloadName?: string;
  /** Start each run from an empty workspace. */
  freshEachRun?: boolean;
  onResult?: (r: RunResult) => void;
  onCodeChange?: (code: string) => void;
  /** Ask the AI tutor about this code + output. */
  onAskTutor?: (code: string, result: RunResult | null) => void;
  extraToolbar?: ReactNode;
  showSave?: boolean;
  autoRun?: boolean;
  className?: string;
  /** Lines to highlight from outside (e.g. error checker). */
  lineMarks?: LineMark[];
  ref?: React.Ref<CodeRunnerHandle>;
}

export interface CodeRunnerHandle {
  setCode(code: string): void;
  getCode(): string;
  run(): Promise<RunResult | null>;
}

function readStored(key?: string) {
  if (!key || typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(`ra-code:${key}`);
  } catch {
    return null;
  }
}

export function CodeRunner({
  initialCode,
  workspace,
  title,
  variant = "full",
  editorMinHeight,
  editorMaxHeight,
  outputMaxHeight,
  storageKey,
  downloadName = "r-academy-code.R",
  freshEachRun = false,
  onResult,
  onCodeChange,
  onAskTutor,
  extraToolbar,
  showSave = true,
  autoRun = false,
  className,
  lineMarks,
  ref,
}: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState<ConsoleLine[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [tables, setTables] = useState<RTable[]>([]);
  const [vars, setVars] = useState<EnvVariable[]>([]);
  const [last, setLast] = useState<RunResult | null>(null);
  const [tab, setTab] = useState("console");
  const [errorLines, setErrorLines] = useState<LineMark[]>([]);
  const [copied, setCopied] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const editor = useRef<CodeEditorHandle>(null);
  const session = useRSession();
  const theme = useResolvedTheme();
  const settings = useSettings();
  const compact = variant === "compact";

  // Restore saved edits after mount (avoids hydration mismatch).
  useEffect(() => {
    const saved = readStored(storageKey);
    // Restoring from localStorage can only happen after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved !== null && saved !== initialCode) setCode(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const persist = useCallback(
    (c: string) => {
      if (!storageKey) return;
      try {
        if (c === initialCode) window.localStorage.removeItem(`ra-code:${storageKey}`);
        else window.localStorage.setItem(`ra-code:${storageKey}`, c);
      } catch {
        /* ignore */
      }
    },
    [storageKey, initialCode],
  );

  const onChange = (c: string) => {
    setCode(c);
    persist(c);
    onCodeChange?.(c);
    if (errorLines.length) setErrorLines([]);
  };

  const run = useCallback(async (): Promise<RunResult | null> => {
    const src = editor.current?.getValue() ?? code;
    if (!src.trim()) {
      setLines([{ kind: "system", text: "There is no code to run yet – type some R code first." }]);
      return null;
    }
    setRunning(true);
    setTab((t) => (t === "env" ? t : "console"));
    const live: ConsoleLine[] = [];
    setLines([]);
    try {
      const result = await rSession.run(src, {
        workspace,
        fresh: freshEachRun,
        dark: settings.plotTheme === "auto" && theme === "dark",
        timeoutMs: settings.runTimeout * 1000,
        onSystem: (l) => {
          live.push(l);
          setLines([...live]);
        },
      });
      setLines(result.lines);
      setImages(result.images);
      setTables(result.info?.tables ?? []);
      setLast(result);
      const marks: LineMark[] = [];
      const info = result.info;
      if (info?.status === "parse_error" && info.parse_error?.line) marks.push({ line: info.parse_error.line, kind: "error" });
      if (info?.status === "error" && info.error) {
        for (let l = info.error.line_start; l <= info.error.line_end; l++) marks.push({ line: l, kind: "error" });
      }
      for (const w of info?.warnings ?? []) if (!marks.some((m) => m.line === w.line_start)) marks.push({ line: w.line_start, kind: "warning" });
      setErrorLines(marks);
      if (result.images.length && (!result.lines.some((l) => l.kind === "stdout") || compact)) setTab("plots");
      progress.bumpStat("codeRuns");
      onResult?.(result);
      rSession
        .envSummary(workspace)
        .then(setVars)
        .catch(() => setVars([]));
      return result;
    } finally {
      setRunning(false);
    }
  }, [code, workspace, freshEachRun, settings.plotTheme, settings.runTimeout, theme, onResult, compact]);

  useEffect(() => {
    if (autoRun) void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCodeExternal = useCallback(
    (c: string) => {
      setCode(c);
      persist(c);
    },
    [persist],
  );

  useImperativeHandle(ref, () => ({ setCode: setCodeExternal, getCode: () => editor.current?.getValue() ?? code, run }), [setCodeExternal, code, run]);

  const reset = () => {
    setCodeExternal(initialCode);
    setErrorLines([]);
    toast("Code reset", { description: "The original code is back.", tone: "info" });
  };
  const copy = async () => {
    if (await copyText(editor.current?.getValue() ?? code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  const format = () => {
    const src = editor.current?.getValue() ?? code;
    const f = formatR(src);
    if (f === src) toast("Code is already tidy", { tone: "info" });
    else {
      setCodeExternal(f);
      toast("Code formatted", { description: "Indentation and spacing now follow the tidyverse style guide." });
    }
  };
  const download = () => downloadText(downloadName.endsWith(".R") ? downloadName : `${downloadName}.R`, editor.current?.getValue() ?? code, "text/x-r");
  const save = () => {
    progress.saveSnippet(title ?? `Code from ${new Date().toLocaleString()}`, editor.current?.getValue() ?? code, typeof window !== "undefined" ? window.location.pathname : undefined);
    toast("Saved to your dashboard", { description: "Find it under Saved code on your Dashboard." });
  };
  const stop = () => rSession.interrupt();
  const askTutor = () => onAskTutor?.(editor.current?.getValue() ?? code, last);
  const runNow = () => void run();
  const clear = () => {
    setLines([]);
    setImages([]);
    setTables([]);
  };

  const loadingR = session.status === "loading";
  const editorMin = editorMinHeight ?? (compact ? 60 : variant === "panel" ? 160 : 240);

  return (
    <div className={cn("flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface px-2 py-1.5">
        <Button size="sm" onClick={() => void run()} disabled={running} aria-label="Run code (Ctrl+Enter)" className="mr-1">
          {running ? <Loader2 className="animate-spin" /> : <Play />}
          {running ? "Running" : "Run"}
        </Button>
        {running && (
          <Button size="sm" variant="outline" onClick={stop} aria-label="Stop running code">
            <Square /> Stop
          </Button>
        )}
        {title && !compact && <span className="ml-1 hidden truncate text-sm font-medium text-muted-foreground sm:inline">{title}</span>}
        <div className="ml-auto flex items-center gap-0.5">
          {extraToolbar}
          <IconBtn label="Reset code" onClick={reset} icon={<RotateCcw />} />
          <IconBtn label={copied ? "Copied!" : "Copy code"} onClick={copy} icon={copied ? <Check className="text-success" /> : <Copy />} />
          {!compact && <IconBtn label="Format code" onClick={format} icon={<Wand2 />} shortcut="Ctrl+Shift+F" />}
          <IconBtn label="Download as .R file" onClick={download} icon={<Download />} />
          {showSave && !compact && <IconBtn label="Save to dashboard" onClick={save} icon={<Save />} shortcut="Ctrl+S" />}
          {!compact && <IconBtn label="Clear console" onClick={clear} icon={<Eraser />} />}
          {!compact && <IconBtn label="Keyboard shortcuts" onClick={() => setShowKeys(true)} icon={<Keyboard />} />}
          {onAskTutor && <IconBtn label="Ask the AI tutor about this code" onClick={askTutor} icon={<Sparkles />} />}
        </div>
      </div>

      <CodeEditor
        ref={editor}
        value={code}
        onChange={onChange}
        onRun={runNow}
        onFormat={format}
        onSave={showSave ? save : undefined}
        minHeight={editorMin}
        maxHeight={editorMaxHeight ?? (compact ? 420 : 560)}
        lineMarks={lineMarks ?? errorLines}
        ariaLabel={title ? `R code editor: ${title}` : "R code editor"}
      />

      {(lines.length > 0 || running || !compact || images.length > 0) && (
        <Tabs value={tab} onValueChange={setTab} className="border-t border-border">
          <div className="flex items-center gap-2 bg-surface px-2 py-1">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="console">
                <Terminal /> Console
              </TabsTrigger>
              <TabsTrigger value="plots">
                <ImageIcon /> Plots{images.length ? ` (${images.length})` : ""}
              </TabsTrigger>
              {!compact && (
                <>
                  <TabsTrigger value="data">
                    <Table2 /> Data{tables.length ? ` (${tables.length})` : ""}
                  </TabsTrigger>
                  <TabsTrigger value="env">
                    <Boxes /> Environment
                  </TabsTrigger>
                </>
              )}
            </TabsList>
            <span className="ml-auto truncate text-xs text-muted-foreground" aria-live="polite">
              {loadingR ? session.message : running ? "" : last ? `Ran in ${(last.elapsedMs / 1000).toFixed(2)} s` : session.status === "ready" ? "R is ready" : "R starts when you press Run"}
            </span>
          </div>
          <TabsContent value="console">
            <ConsoleView lines={lines} running={running} maxHeight={outputMaxHeight ?? (compact ? 260 : 320)} className="min-h-[72px]" />
          </TabsContent>
          <TabsContent value="plots" className="overflow-auto" style={{ maxHeight: outputMaxHeight ?? 520 }}>
            <PlotGallery images={images} />
          </TabsContent>
          {!compact && (
            <>
              <TabsContent value="data">
                <DataViewer tables={tables} />
              </TabsContent>
              <TabsContent value="env" style={{ maxHeight: outputMaxHeight ?? 320 }} className="overflow-auto">
                <EnvironmentPane vars={vars} />
              </TabsContent>
            </>
          )}
        </Tabs>
      )}

      <Dialog open={showKeys} onOpenChange={setShowKeys}>
        <DialogContent title="Keyboard shortcuts" description="These work while the code editor has focus.">
          <ShortcutTable />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function IconBtn({ label, onClick, icon, shortcut }: { label: string; onClick: () => void; icon: ReactNode; shortcut?: string }) {
  return (
    <Tooltip content={shortcut ? `${label} (${shortcut})` : label}>
      <Button variant="ghost" size="icon-sm" onClick={onClick} aria-label={label}>
        {icon}
      </Button>
    </Tooltip>
  );
}

export function ShortcutTable() {
  const rows: [string, string][] = [
    ["Ctrl / ⌘ + Enter", "Run the code"],
    ["Ctrl / ⌘ + Shift + F", "Format (tidy) the code"],
    ["Ctrl / ⌘ + S", "Save the code to your dashboard"],
    ["Alt + -", "Insert the assignment arrow <-"],
    ["Ctrl / ⌘ + Shift + M", "Insert the pipe |>"],
    ["Ctrl / ⌘ + /", "Comment or uncomment the selected lines"],
    ["Ctrl / ⌘ + Z  /  Ctrl / ⌘ + Shift + Z", "Undo / redo"],
    ["Ctrl / ⌘ + F", "Find (and replace) in the code"],
    ["Ctrl + Space", "Show autocomplete suggestions"],
    ["Tab / Shift + Tab", "Indent / un-indent"],
    ["Esc, then Tab", "Leave the editor with the keyboard"],
  ];
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} className="border-t border-border first:border-0">
            <td className="py-2 pr-4 font-mono text-xs whitespace-nowrap">{k}</td>
            <td className="py-2 text-muted-foreground">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
