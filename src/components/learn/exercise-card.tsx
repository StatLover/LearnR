"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, Eye, FlaskConical, GitCompare, Lightbulb, Loader2, Play, RotateCcw, Sparkles, XCircle, Download, Trophy } from "lucide-react";
import type { Exercise } from "@/content/types";
import { CodeEditor, type CodeEditorHandle, type LineMark } from "@/components/code/code-editor";
import { ConsoleView, PlotGallery } from "@/components/code/output-panels";
import { StaticCode } from "@/components/code/static-code";
import { Markdown } from "@/components/content/markdown";
import { DiffView } from "@/components/error-checker/diff-view";
import { Button } from "@/components/ui/button";
import { DifficultyBadge, Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { rSession } from "@/lib/r/session";
import type { RunResult, TestResult } from "@/lib/r/console";
import { progress, useProgress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { useResolvedTheme } from "@/hooks/use-theme";
import { cn, downloadText } from "@/lib/utils";

export interface ExerciseTask {
  id: string;
  title: string;
  prompt: string;
  expected?: string;
  starterCode: string;
  hints: string[];
  solution: string;
  explanation: string;
  tests: Exercise["tests"];
  difficulty?: Exercise["difficulty"];
}

export interface ExerciseCardProps {
  task: ExerciseTask;
  /** Where the exercise lives (for recent activity). */
  kind?: "exercise" | "project-step";
  /** For project steps: code of earlier steps to run first. */
  setupCode?: string;
  workspace?: string;
  savedCode?: string;
  passed?: boolean;
  onResult?: (passed: boolean, code: string) => void;
  onCodeChange?: (code: string) => void;
  onAskTutor?: (code: string) => void;
  headerExtra?: React.ReactNode;
}

export function ExerciseCard({ task, kind = "exercise", setupCode, workspace, savedCode, passed: passedProp, onResult, onCodeChange, onAskTutor, headerExtra }: ExerciseCardProps) {
  const state = useProgress();
  const ep = state.exercises[task.id];
  const [code, setCode] = useState(task.starterCode);
  const [running, setRunning] = useState<null | "run" | "test">(null);
  const [result, setResult] = useState<RunResult | null>(null);
  const [tests, setTests] = useState<TestResult[] | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [confirmSolution, setConfirmSolution] = useState(false);
  const [compare, setCompare] = useState(false);
  const editor = useRef<CodeEditorHandle>(null);
  const settings = useSettings();
  const theme = useResolvedTheme();
  const passed = passedProp ?? Boolean(ep?.passedAt);
  const ws = workspace ?? `exercise:${task.id}`;

  // Restore the learner's last code after mount.
  useEffect(() => {
    const saved = savedCode ?? (kind === "exercise" ? ep?.code : undefined);
    if (saved) setCode(saved);
    if (kind === "exercise" && ep?.hintsUsed) setHintsShown(Math.min(ep.hintsUsed, task.hints.length));
    if (kind === "exercise" && ep?.solutionViewed) setShowSolution(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  const opts = () => ({ workspace: ws, dark: settings.plotTheme === "auto" && theme === "dark", timeoutMs: settings.runTimeout * 1000 });

  const prepare = async () => {
    if (setupCode?.trim()) await rSession.run(setupCode, { ...opts(), fresh: true });
  };

  const change = (c: string) => {
    setCode(c);
    onCodeChange?.(c);
    if (kind === "exercise") progress.saveExerciseCode(task.id, c);
  };

  const run = async () => {
    setRunning("run");
    try {
      await prepare();
      setResult(await rSession.run(editor.current?.getValue() ?? code, { ...opts(), fresh: !setupCode }));
    } finally {
      setRunning(null);
    }
  };

  const runTests = async () => {
    setRunning("test");
    const src = editor.current?.getValue() ?? code;
    try {
      await prepare();
      const out = await rSession.test(src, task.tests, { ...opts(), fresh: !setupCode });
      setResult(out.run);
      setTests(out.tests);
      const ok = out.tests.length > 0 && out.tests.every((t) => t.pass);
      if (kind === "exercise") progress.recordExerciseAttempt(task.id, task.title, ok, src);
      onResult?.(ok, src);
    } finally {
      setRunning(null);
    }
  };

  const nextHint = () => {
    const n = Math.min(task.hints.length, hintsShown + 1);
    setHintsShown(n);
    if (kind === "exercise") progress.useHint(task.id, n);
  };

  const reveal = () => {
    setShowSolution(true);
    setConfirmSolution(false);
    if (kind === "exercise") progress.viewSolution(task.id);
  };

  const passCount = tests?.filter((t) => t.pass).length ?? 0;
  const allPass = tests !== null && tests.length > 0 && passCount === tests.length;
  const marks: LineMark[] = [];
  const info = result?.info;
  if (info?.status === "error" && info.error) for (let l = info.error.line_start; l <= info.error.line_end; l++) marks.push({ line: l, kind: "error" });
  if (info?.status === "parse_error" && info.parse_error?.line) marks.push({ line: info.parse_error.line, kind: "error" });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card" id={`exercise-${task.id}`}>
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3">
        <FlaskConical className="size-4 text-primary" />
        <h3 className="font-semibold">{task.title}</h3>
        {task.difficulty && <DifficultyBadge difficulty={task.difficulty} />}
        {passed && (
          <Badge variant="success">
            <CheckCircle2 /> Passed
          </Badge>
        )}
        <div className="ml-auto">{headerExtra}</div>
      </div>

      <div className="space-y-3 p-4">
        <Markdown>{task.prompt}</Markdown>
        {task.expected && (
          <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Expected result</p>
            <Markdown runnableCode={false}>{task.expected}</Markdown>
          </div>
        )}
      </div>

      <div className="border-y border-border">
        <div className="flex flex-wrap items-center gap-1 bg-surface px-2 py-1.5">
          <Button size="sm" onClick={runTests} disabled={!!running}>
            {running === "test" ? <Loader2 className="animate-spin" /> : <FlaskConical />} Run &amp; Test
          </Button>
          <Button size="sm" variant="outline" onClick={run} disabled={!!running}>
            {running === "run" ? <Loader2 className="animate-spin" /> : <Play />} Run
          </Button>
          <div className="ml-auto flex gap-0.5">
            <Button size="sm" variant="ghost" onClick={() => change(task.starterCode)} aria-label="Reset to the starter code">
              <RotateCcw /> Reset
            </Button>
            <Button size="sm" variant="ghost" onClick={() => downloadText(`${task.id}.R`, editor.current?.getValue() ?? code, "text/x-r")} aria-label="Download your code">
              <Download />
            </Button>
          </div>
        </div>
        <CodeEditor ref={editor} value={code} onChange={change} onRun={runTests} minHeight={140} maxHeight={420} lineMarks={marks} ariaLabel={`Your solution for: ${task.title}`} />
      </div>

      {(result || running) && (
        <div className="border-b border-border">
          <ConsoleView lines={result?.lines ?? []} running={!!running} empty="(Your code printed nothing.)" maxHeight={240} />
          {result && result.images.length > 0 && <PlotGallery images={result.images} />}
        </div>
      )}

      {tests && (
        <div className="space-y-2 border-b border-border p-4" role="status">
          <p className={cn("flex items-center gap-2 font-semibold", allPass ? "text-success" : "text-foreground")}>
            {allPass ? <Trophy className="size-5" /> : <FlaskConical className="size-5 text-muted-foreground" />}
            {allPass ? "All tests passed – great job!" : `${passCount} of ${tests.length} checks passed`}
          </p>
          {!allPass && passCount > 0 && <p className="text-sm text-muted-foreground">You&apos;re on the right track. Fix the remaining checks below.</p>}
          <ul className="space-y-1.5">
            {tests.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                {t.pass ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-label="passed" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-label="failed" />}
                <span>
                  <Markdown runnableCode={false}>{t.name}</Markdown>
                  {!t.pass && (
                    <span className="block text-muted-foreground">
                      <Markdown runnableCode={false}>{t.failMessage}</Markdown>
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          {result?.info?.status === "error" && <p className="text-sm text-danger">Your code stopped with an error (see the console above) – fix that first. The Error Checker can explain it.</p>}
        </div>
      )}

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={nextHint} disabled={hintsShown >= task.hints.length}>
            <Lightbulb /> {hintsShown === 0 ? "Get a hint" : hintsShown >= task.hints.length ? "No more hints" : `Next hint (${hintsShown + 1}/${task.hints.length})`}
          </Button>
          {!showSolution && (
            <Button size="sm" variant="outline" onClick={() => (allPass || passed ? reveal() : setConfirmSolution(true))}>
              <Eye /> Show solution
            </Button>
          )}
          {(showSolution || allPass) && (
            <Button size="sm" variant="outline" onClick={() => setCompare((c) => !c)}>
              <GitCompare /> {compare ? "Hide comparison" : "Compare with the solution"}
            </Button>
          )}
          {onAskTutor && (
            <Button size="sm" variant="outline" onClick={() => onAskTutor(editor.current?.getValue() ?? code)}>
              <Sparkles /> Ask the AI tutor
            </Button>
          )}
        </div>
        {hintsShown > 0 && (
          <ol className="space-y-2">
            {task.hints.slice(0, hintsShown).map((h, i) => (
              <li key={i} className="flex gap-2 rounded-lg bg-warning-soft px-3 py-2 text-sm">
                <span className="font-semibold text-warning">Hint {i + 1}</span>
                <Markdown runnableCode={false}>{h}</Markdown>
              </li>
            ))}
          </ol>
        )}
        {compare && <DiffView before={editor.current?.getValue() ?? code} after={task.solution} beforeLabel="Your code" afterLabel="Example solution" />}
        {(showSolution || allPass) && (
          <div className="space-y-2 rounded-lg border border-border p-3">
            {showSolution && (
              <>
                <p className="text-sm font-semibold">Example solution</p>
                <StaticCode code={task.solution} lineNumbers className="rounded-md border border-border" />
              </>
            )}
            <p className="text-sm font-semibold">Explanation</p>
            <Markdown>{task.explanation}</Markdown>
            {allPass && !showSolution && <p className="text-xs text-muted-foreground">Your own solution passed every check – there is often more than one correct way. Use “Compare with the solution” to see another approach.</p>}
          </div>
        )}
        {!tests && !passed && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Circle className="size-3" /> Press <strong>Run &amp; Test</strong> (or Ctrl+Enter) to check your answer automatically.
          </p>
        )}
      </div>

      <Dialog open={confirmSolution} onOpenChange={setConfirmSolution}>
        <DialogContent title="Show the solution?" description="You learn the most by struggling a little first. Hints give you a nudge without spoiling it.">
          <div className="flex flex-wrap justify-end gap-2">
            {hintsShown < task.hints.length && (
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmSolution(false);
                  nextHint();
                }}
              >
                <Lightbulb /> Give me a hint instead
              </Button>
            )}
            <Button onClick={reveal}>
              <Eye /> Show the solution
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
