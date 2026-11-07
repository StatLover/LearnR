"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Eye, FlaskConical, GitCompare, Lightbulb, Loader2, Play, RotateCcw, Sparkles, XCircle, Download, Trophy, Target } from "lucide-react";
import type { Exercise } from "@/content/types";
import { CodeEditor, type CodeEditorHandle, type LineMark } from "@/components/code/code-editor";
import { ConsoleView, PlotGallery } from "@/components/code/output-panels";
import { StaticCode } from "@/components/code/static-code";
import { Markdown } from "@/components/content/markdown";
import { DiffView } from "@/components/error-checker/diff-view";
import { Button } from "@/components/ui/button";
import { DifficultyBadge, Badge, XpBadge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Hexy } from "@/components/brand/mascot";
import { fireConfetti } from "@/components/game/confetti";
import { rSession } from "@/lib/r/session";
import type { RunResult, TestResult } from "@/lib/r/console";
import { progress, useProgress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { useResolvedTheme } from "@/hooks/use-theme";
import { encourage, exerciseXp, praise, XP } from "@/lib/game/xp";
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
  /** Label shown above the title, e.g. "Challenge 1 of 2" or "Daily challenge". */
  eyebrow?: string;
  /** Override the XP shown (defaults to the exercise XP for its difficulty). */
  xp?: number;
}

export function ExerciseCard({ task, kind = "exercise", setupCode, workspace, savedCode, passed: passedProp, onResult, onCodeChange, onAskTutor, headerExtra, eyebrow, xp }: ExerciseCardProps) {
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
  const [attempt, setAttempt] = useState(0);
  const editor = useRef<CodeEditorHandle>(null);
  const settings = useSettings();
  const theme = useResolvedTheme();
  const passed = passedProp ?? Boolean(ep?.passedAt);
  const ws = workspace ?? `exercise:${task.id}`;
  const reward = xp ?? (kind === "project-step" ? XP.projectStep : exerciseXp(task.difficulty ?? "easy"));

  // Restore the learner's last code after mount.
  useEffect(() => {
    const saved = savedCode ?? (kind === "exercise" ? ep?.code : undefined);
    // Saved progress lives in localStorage, so it is restored after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setAttempt((a) => a + 1);
      const ok = out.tests.length > 0 && out.tests.every((t) => t.pass);
      if (ok) fireConfetti({ y: 0.45, count: passed ? 60 : 140 });
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
    <div className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]" id={`exercise-${task.id}`}>
      <div className="flex flex-wrap items-center gap-3 border-b-2 border-border bg-gradient-to-r from-grape-soft to-transparent px-5 py-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-grape text-white shadow-[0_3px_0_var(--grape-shadow)]">
          <Target className="size-6" />
        </span>
        <div className="min-w-0 flex-1 basis-[11rem]">
          {eyebrow && <p className="font-display text-xs font-semibold uppercase tracking-wider text-grape">{eyebrow}</p>}
          <h3 className="font-display text-xl font-semibold leading-tight">{task.title}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {task.difficulty && <DifficultyBadge difficulty={task.difficulty} />}
          {passed ? (
            <Badge variant="success">
              <CheckCircle2 /> Solved
            </Badge>
          ) : (
            <XpBadge xp={reward} />
          )}
          {headerExtra}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <Markdown>{task.prompt}</Markdown>
        {task.expected && (
          <div className="rounded-2xl border-2 border-dashed border-border bg-surface-2/50 px-4 py-3 text-sm">
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-primary">🎯 Goal</p>
            <Markdown runnableCode={false}>{task.expected}</Markdown>
          </div>
        )}
      </div>

      <div className="mx-5 overflow-hidden rounded-2xl border-2 border-border">
        <div className="flex flex-wrap items-center gap-1.5 border-b-2 border-border bg-surface-2/70 px-3 py-2">
          <Button size="sm" variant="success" onClick={runTests} disabled={!!running}>
            {running === "test" ? <Loader2 className="animate-spin" /> : <FlaskConical />} Check my code
          </Button>
          <Button size="sm" variant="outline" onClick={run} disabled={!!running}>
            {running === "run" ? <Loader2 className="animate-spin" /> : <Play />} Run
          </Button>
          <div className="ml-auto flex gap-0.5">
            <Button size="sm" variant="ghost" onClick={() => change(task.starterCode)} aria-label="Reset to the starter code">
              <RotateCcw /> <span className="hidden sm:inline">Reset</span>
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={() => downloadText(`${task.id}.R`, editor.current?.getValue() ?? code, "text/x-r")} aria-label="Download your code">
              <Download />
            </Button>
          </div>
        </div>
        <CodeEditor ref={editor} value={code} onChange={change} onRun={runTests} minHeight={150} maxHeight={420} lineMarks={marks} ariaLabel={`Your solution for: ${task.title}`} />
        {(result || running) && (
          <div className="border-t-2 border-border">
            <ConsoleView lines={result?.lines ?? []} running={!!running} empty="(Your code printed nothing.)" maxHeight={240} />
            {result && result.images.length > 0 && <PlotGallery images={result.images} />}
          </div>
        )}
      </div>

      {tests && (
        <div role="status" className={cn("mx-5 mt-4 rounded-2xl border-2 p-4 animate-slide-up", allPass ? "border-mint bg-mint-soft" : "border-coral/50 bg-coral-soft")}>
          <div className="flex items-start gap-3">
            <Hexy mood={allPass ? "celebrate" : "oops"} size={58} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className={cn("font-display text-xl font-semibold", allPass ? "text-success" : "text-danger")}>
                {allPass ? `${praise(attempt + task.id.length)} ${passed ? "Challenge solved!" : ""}` : passCount > 0 ? `${passCount} of ${tests.length} checks passed – almost there!` : encourage(attempt + task.id.length)}
              </p>
              {allPass && (
                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-warning">
                  <Trophy className="size-4" /> +{reward} XP{ep?.solutionViewed && kind === "exercise" ? " (half XP – you peeked at the solution)" : ""}
                </p>
              )}
              <ul className="mt-2 space-y-1.5">
                {tests.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                    {t.pass ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-label="passed" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-label="failed" />}
                    <span className="font-semibold">
                      <Markdown runnableCode={false}>{t.name}</Markdown>
                      {!t.pass && (
                        <span className="block font-medium text-muted-foreground">
                          <Markdown runnableCode={false}>{t.failMessage}</Markdown>
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              {result?.info?.status === "error" && <p className="mt-2 text-sm font-semibold text-danger">Your code stopped with an error (see the console) – fix that first. The Error Detective can explain it.</p>}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 p-5">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="sun" onClick={nextHint} disabled={hintsShown >= task.hints.length}>
            <Lightbulb /> {hintsShown === 0 ? "Hint" : hintsShown >= task.hints.length ? "No more hints" : `Next hint (${hintsShown + 1}/${task.hints.length})`}
          </Button>
          {!showSolution && (
            <Button size="sm" variant="outline" onClick={() => (allPass || passed ? reveal() : setConfirmSolution(true))}>
              <Eye /> Show solution
            </Button>
          )}
          {(showSolution || allPass) && (
            <Button size="sm" variant="outline" onClick={() => setCompare((c) => !c)}>
              <GitCompare /> {compare ? "Hide comparison" : "Compare with solution"}
            </Button>
          )}
          {onAskTutor && (
            <Button size="sm" variant="outline" onClick={() => onAskTutor(editor.current?.getValue() ?? code)}>
              <Sparkles /> Ask AI
            </Button>
          )}
        </div>
        {hintsShown > 0 && (
          <ol className="space-y-2">
            {task.hints.slice(0, hintsShown).map((h, i) => (
              <li key={i} className="flex gap-3 rounded-2xl border-2 border-sun/40 bg-sun-soft px-4 py-3 text-sm animate-pop-in">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-sun font-display text-xs font-bold text-[#3b2600]">{i + 1}</span>
                <Markdown runnableCode={false}>{h}</Markdown>
              </li>
            ))}
          </ol>
        )}
        {compare && <DiffView before={code} after={task.solution} beforeLabel="Your code" afterLabel="Example solution" />}
        {(showSolution || allPass) && (
          <div className="space-y-2 rounded-2xl border-2 border-border p-4">
            {showSolution && (
              <>
                <p className="font-display font-semibold">Example solution</p>
                <StaticCode code={task.solution} lineNumbers className="rounded-xl border-2 border-border" />
              </>
            )}
            <p className="font-display font-semibold">How it works</p>
            <Markdown>{task.explanation}</Markdown>
            {allPass && !showSolution && <p className="text-xs font-semibold text-muted-foreground">Your own solution passed every check – there is often more than one correct way. Use “Compare with solution” to see another approach.</p>}
          </div>
        )}
        {!tests && !passed && <p className="text-xs font-semibold text-muted-foreground">Press <strong>Check my code</strong> (or Ctrl+Enter) – R runs your code and checks the result automatically.</p>}
      </div>

      <Dialog open={confirmSolution} onOpenChange={setConfirmSolution}>
        <DialogContent title="Peek at the solution?" description="You learn the most by struggling a little first. A hint gives you a nudge without spoiling it – and solving it yourself earns full XP.">
          <div className="flex flex-wrap justify-end gap-2">
            {hintsShown < task.hints.length && (
              <Button
                variant="sun"
                onClick={() => {
                  setConfirmSolution(false);
                  nextHint();
                }}
              >
                <Lightbulb /> Give me a hint
              </Button>
            )}
            <Button variant="outline" onClick={reveal}>
              <Eye /> Show the solution
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
