"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  ClipboardCheck,
  Info,
  Lightbulb,
  Loader2,
  MapPin,
  Play,
  RotateCcw,
  Sparkles,
  Wand2,
  Wrench,
  XCircle,
  MessageCircleQuestion,
  Undo2,
} from "lucide-react";
import { CodeEditor, type CodeEditorHandle, type LineMark, type TokenMark } from "@/components/code/code-editor";
import { ConsoleView, PlotGallery } from "@/components/code/output-panels";
import { StaticCode } from "@/components/code/static-code";
import { Markdown } from "@/components/content/markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { DiffView } from "./diff-view";
import { rSession } from "@/lib/r/session";
import { transcript, type CheckInfo, type RunResult } from "@/lib/r/console";
import { analyzeParseError, analyzeRun, outputChecks, staticChecks, type AnalysisContext, type Diagnosis } from "@/lib/errors/analyze";
import { verifyFix, type VerifiedFix } from "@/lib/errors/fix-loop";
import { definedFunctions } from "@/lib/errors/helpers";
import { significant, tokenize } from "@/lib/r/tokens";
import { aiStatus, codeMessage, tutor } from "@/lib/ai/tutor-store";
import { progress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { useResolvedTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const EXAMPLES: { label: string; code: string }[] = [
  { label: "Object not found", code: "numbers <- c(10, 20, 30)\nmean(number)" },
  { label: "Missing bracket", code: 'greeting <- "Hello, R!"\nprint(greeting\nnchar(greeting)' },
  { label: "Text + number", code: 'price <- "10"\nquantity <- 3\ntotal <- price * quantity\ntotal' },
  { label: "else on a new line", code: 'temperature <- 25\nif (temperature > 20) {\n  print("Warm")\n}\nelse {\n  print("Cold")\n}' },
  { label: "Missing package", code: "students <- read.csv(\"data/students.csv\")\nstudents |>\n  filter(math > 90) |>\n  select(name, math)" },
  { label: "Wrong file path", code: 'students <- read.csv("students.csv")\nhead(students)' },
  { label: "Result is NA", code: "scores <- c(90, 85, NA, 70)\nmean(scores)" },
  { label: "Typo in function", code: "ages <- c(23, 35, 41)\nlenght(ages)" },
];

const KIND_STYLE = {
  syntax: { label: "Syntax error", variant: "danger", icon: XCircle },
  runtime: { label: "Runtime error", variant: "danger", icon: XCircle },
  warning: { label: "Warning", variant: "warning", icon: AlertTriangle },
  logic: { label: "Logical issue", variant: "info", icon: Info },
  style: { label: "Suggestion", variant: "default", icon: Lightbulb },
} as const;

interface AiAnalysis {
  kind: string;
  category: string;
  summary: string;
  explanation: string;
  how_to_fix: string;
  location: { line: number | null; basis: string; note: string };
  fixed_code: string | null;
  changes: { line: number | null; before: string; after: string; reason: string }[];
  prevention_tips: string[];
}

function identifierNames(code: string) {
  return [...new Set(significant(tokenize(code)).filter((t) => t.kind === "name").map((t) => t.text))].slice(0, 200);
}

export function ErrorChecker() {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [original, setOriginal] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "check" | "run" | "ai" | "fix">(null);
  const [result, setResult] = useState<RunResult | null>(null);
  const [checked, setChecked] = useState<CheckInfo | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);
  const [fix, setFix] = useState<VerifiedFix | null>(null);
  const [fixTried, setFixTried] = useState(false);
  const [simple, setSimple] = useState<Record<string, boolean>>({});
  const [ai, setAi] = useState<AiAnalysis | null>(null);
  const [aiFixRun, setAiFixRun] = useState<RunResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [analyzedCode, setAnalyzedCode] = useState<string | null>(null);
  const editor = useRef<CodeEditorHandle>(null);
  const settings = useSettings();
  const theme = useResolvedTheme();
  const router = useRouter();

  useEffect(() => {
    aiStatus().then((s) => setAiConfigured(s.configured));
    try {
      const incoming = sessionStorage.getItem("ra-check-code");
      if (incoming) {
        sessionStorage.removeItem("ra-check-code");
        setCode(incoming);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const resetResults = () => {
    setResult(null);
    setChecked(null);
    setDiagnoses(null);
    setFix(null);
    setFixTried(false);
    setAi(null);
    setAiFixRun(null);
    setAiError(null);
    setSimple({});
  };

  const stale = analyzedCode !== null && analyzedCode !== code;

  const runOpts = (fresh = true) => ({
    workspace: "checker",
    fresh,
    dark: settings.plotTheme === "auto" && theme === "dark",
    timeoutMs: settings.runTimeout * 1000,
  });

  const gather = async (r: RunResult, src: string, workspace: string): Promise<Omit<AnalysisContext, "code" | "info">> => {
    try {
      const c = await rSession.context(workspace, identifierNames(src));
      let formals: string[] | undefined;
      const fn = r.info?.error?.call?.split("(")[0];
      if (fn && /unused argument/.test(r.info?.error?.message ?? "")) formals = await rSession.formals(fn).catch(() => undefined);
      return { functions: [...c.functions, ...definedFunctions(src)], variables: c.variables.map((v) => v.name), columns: c.columns, files: c.files, numericText: c.numericText, classes: c.classes, formals };
    } catch {
      return {};
    }
  };

  /** Check My Code: syntax + static checks, without running anything. */
  const checkCode = async () => {
    resetResults();
    setBusy("check");
    setOriginal(code);
    setAnalyzedCode(code);
    try {
      const info = await rSession.check(code, "checker");
      setChecked(info);
      if (!info.ok && info.parse_error) {
        const d = analyzeParseError(code, info.parse_error);
        setDiagnoses([d]);
        progress.bumpStat("errorsAnalyzed");
        return;
      }
      const ds = staticChecks(code);
      const defined = new Set(definedFunctions(code));
      const hasLibrary = /\b(library|require)\s*\(/.test(code);
      const unknown = (info.unknown_functions ?? []).filter((f) => !defined.has(f));
      for (const f of unknown) {
        const tok = significant(tokenize(code)).find((t) => t.kind === "name" && t.text === f);
        ds.unshift({
          id: `unknown-fn-${f}`,
          kind: hasLibrary ? "style" : "runtime",
          category: hasLibrary ? "Possible Problem – Function From a Package" : "Possible Problem – Unknown Function",
          title: `\`${f}()\` is not currently available`,
          message: null,
          lineStart: tok?.line ?? null,
          lineEnd: tok?.line ?? null,
          token: tok ? { line: tok.line, from: tok.col, to: tok.col + f.length, text: f } : null,
          evidence: `Static check: R has no function called \`${f}\` loaded right now and the code does not define one.${hasLibrary ? " Your code loads packages, which may provide it – press Run and Analyze to know for sure." : " Running this code would most likely stop here."}`,
          why: `R looked for a function named \`${f}\` and did not find one.`,
          howToFix: "Check the spelling, or load the package that provides it with `library()`. Press **Run and Analyze** for a definite answer.",
          simpler: `R doesn't know \`${f}\` yet.`,
          tips: [],
        });
      }
      setDiagnoses(ds);
    } finally {
      setBusy(null);
    }
  };

  /** Run and Analyze: run the code for real, then explain what happened. */
  const runAnalyze = async (): Promise<{ r: RunResult; ds: Diagnosis[] } | null> => {
    resetResults();
    setBusy("run");
    setOriginal(code);
    setAnalyzedCode(code);
    try {
      const r = await rSession.run(code, runOpts());
      setResult(r);
      if (!r.info) {
        setDiagnoses([]);
        return { r, ds: [] };
      }
      const ctx = await gather(r, code, "checker");
      const ds = [...analyzeRun({ code, info: r.info, ...ctx })];
      if (r.info.status === "ok") ds.push(...outputChecks(code, r.lines.filter((l) => l.kind === "stdout").map((l) => l.text)));
      setDiagnoses(ds);
      if (ds.some((d) => d.kind === "syntax" || d.kind === "runtime")) progress.bumpStat("errorsAnalyzed");
      // Verify the first fix straight away so learners see a real corrected result.
      const first = ds.find((d) => d.fix);
      if (first) {
        setFixTried(true);
        const v = await verifyFix(code, first, {
          run: (c) => rSession.run(c, { ...runOpts(), workspace: "checker-fix" }),
          context: (res, c) => gather(res, c, "checker-fix"),
        });
        setFix(v);
      }
      return { r, ds };
    } finally {
      setBusy(null);
    }
  };

  /** Explain My Error: ask the AI, then verify its fix in R. */
  const explainAi = async (simpler = false) => {
    let r = result;
    let ds = diagnoses;
    if (!r || stale) {
      const out = await runAnalyze();
      if (!out) return;
      r = out.r;
      ds = out.ds;
    }
    if (!aiConfigured) {
      setAiError("AI explanations are not configured on this server (the site owner needs to set ANTHROPIC_API_KEY). The rule-based analysis above is based on what R reported.");
      return;
    }
    setBusy("ai");
    setAiError(null);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          console: transcript(r.lines),
          status: r.status,
          errorLine: r.info?.error?.line_start ?? r.info?.parse_error?.line ?? null,
          ruleDiagnosis: ds?.length ? ds.map((d) => `${d.category}: ${d.title}${d.lineStart ? ` (line ${d.lineStart})` : ""}`).join("\n") : undefined,
          simpler,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "The AI could not analyse the code.");
      const a = j.analysis as AiAnalysis;
      setAi(a);
      setAiFixRun(null);
      if (a.fixed_code && a.fixed_code.trim() !== code.trim()) {
        setAiFixRun(await rSession.run(a.fixed_code, { ...runOpts(), workspace: "checker-fix" }));
      }
    } catch (e) {
      setAiError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  };

  /** Fix My Code: produce a verified corrected version. */
  const fixCode = async () => {
    let current = fix;
    if (!result || stale) {
      await runAnalyze();
      return;
    }
    if (!current && aiConfigured && !ai) await explainAi();
    current = fix;
    if (!current && !ai?.fixed_code) toast("No automatic fix found", { description: "Read the explanation for how to fix it, or ask the AI tutor.", tone: "info" });
  };

  const applyFix = (newCode: string) => {
    if (original === null) setOriginal(code);
    setCode(newCode);
    progress.bumpStat("fixesApplied");
    toast("Fix applied", { description: "Your original code is kept – use “Restore my original code” to go back." });
    setAnalyzedCode(null);
  };

  const marks = useMemo(() => {
    const lines: LineMark[] = [];
    const tokens: TokenMark[] = [];
    if (stale) return { lines, tokens };
    for (const d of diagnoses ?? []) {
      if (d.lineStart) {
        for (let l = d.lineStart; l <= (d.lineEnd ?? d.lineStart); l++)
          if (!lines.some((x) => x.line === l)) lines.push({ line: l, kind: d.kind === "syntax" || d.kind === "runtime" ? "error" : d.kind === "warning" ? "warning" : "highlight" });
      }
      if (d.token) tokens.push({ line: d.token.line, from: d.token.from, to: d.token.to });
    }
    return { lines, tokens };
  }, [diagnoses, stale]);

  const errors = (diagnoses ?? []).filter((d) => d.kind === "syntax" || d.kind === "runtime");
  const warnings = (diagnoses ?? []).filter((d) => d.kind === "warning");
  const others = (diagnoses ?? []).filter((d) => d.kind === "logic" || d.kind === "style");

  const askTutor = () => {
    tutor.queue(codeMessage(code, result ? transcript(result.lines) : null, "Please help me understand and fix the problem in this R code."));
    router.push("/tutor");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-3">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-3 py-2">
            <span className="text-sm font-medium">Your R code</span>
            <div className="ml-auto flex flex-wrap items-center gap-1">
              {original !== null && original !== code && (
                <Button size="sm" variant="ghost" onClick={() => { setCode(original); setAnalyzedCode(null); }}>
                  <Undo2 /> Restore my original code
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => { setCode(""); resetResults(); setOriginal(null); }}>
                <RotateCcw /> Clear
              </Button>
            </div>
          </div>
          <CodeEditor
            ref={editor}
            value={code}
            onChange={setCode}
            onRun={() => void runAnalyze()}
            minHeight={300}
            maxHeight={520}
            lineMarks={marks.lines}
            tokenMarks={marks.tokens}
            ariaLabel="Paste or write the R code to check"
            placeholder="Paste your R code here…"
          />
          <div className="grid grid-cols-2 gap-2 border-t border-border bg-surface p-3 sm:grid-cols-4">
            <Button variant="outline" onClick={checkCode} disabled={!!busy || !code.trim()}>
              {busy === "check" ? <Loader2 className="animate-spin" /> : <ClipboardCheck />} Check My Code
            </Button>
            <Button onClick={() => void runAnalyze()} disabled={!!busy || !code.trim()}>
              {busy === "run" ? <Loader2 className="animate-spin" /> : <Play />} Run and Analyze
            </Button>
            <Button variant="outline" onClick={() => void explainAi()} disabled={!!busy || !code.trim()}>
              {busy === "ai" ? <Loader2 className="animate-spin" /> : <Sparkles />} Explain My Error
            </Button>
            <Button variant="outline" onClick={() => void fixCode()} disabled={!!busy || !code.trim()}>
              {busy === "fix" ? <Loader2 className="animate-spin" /> : <Wrench />} Fix My Code
            </Button>
          </div>
        </Card>
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Try an example with a common beginner mistake:</p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((e) => (
              <button
                key={e.label}
                onClick={() => {
                  setCode(e.code);
                  resetResults();
                  setOriginal(null);
                  setAnalyzedCode(null);
                }}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs hover:border-primary hover:bg-primary-soft cursor-pointer"
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
        <Card className="p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">How the checker works</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Check My Code</strong> asks R to read (parse) your code without running it, and looks for common mistakes.</li>
            <li><strong>Run and Analyze</strong> runs the code in real R in your browser, records exactly which line failed, and explains the message.</li>
            <li><strong>Explain My Error</strong> asks the AI tutor for a deeper explanation based on R&apos;s real output.</li>
            <li><strong>Fix My Code</strong> suggests corrected code – it is only shown as working after R has run it successfully.</li>
          </ul>
        </Card>
      </div>

      <div className="min-w-0 space-y-4" aria-live="polite">
        {stale && diagnoses && (
          <p className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground">The code has changed since it was analysed – run the analysis again to update the results.</p>
        )}
        {!diagnoses && !busy && (
          <Card className="grid place-items-center p-10 text-center">
            <Bug className="size-10 text-primary" />
            <p className="mt-3 font-semibold">Paste your code and press “Run and Analyze”</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">You&apos;ll see what kind of problem it is, where it is, why it happened and how to fix it – with corrected code that has really been run.</p>
          </Card>
        )}
        {busy && !diagnoses && (
          <Card className="flex items-center gap-3 p-6 text-sm">
            <Loader2 className="size-5 animate-spin text-primary" /> {busy === "check" ? "Asking R to read your code…" : busy === "ai" ? "Asking the AI tutor…" : "Running your code in R…"}
          </Card>
        )}

        {diagnoses && (
          <Card className={cn("flex items-start gap-3 p-4", errors.length ? "border-danger/40" : warnings.length || others.length ? "border-warning/40" : "border-success/40")}>
            {errors.length ? <XCircle className="mt-0.5 size-5 text-danger" /> : warnings.length || others.length ? <AlertTriangle className="mt-0.5 size-5 text-warning" /> : <CheckCircle2 className="mt-0.5 size-5 text-success" />}
            <div>
              <p className="font-semibold">
                {errors.length
                  ? `${errors[0].kind === "syntax" ? "Syntax error" : "Runtime error"} found`
                  : result
                    ? "Your code ran without errors"
                    : checked?.ok
                      ? "No syntax errors found"
                      : "Analysis complete"}
              </p>
              <p className="text-sm text-muted-foreground">
                {[errors.length && `${errors.length} error`, warnings.length && `${warnings.length} warning${warnings.length > 1 ? "s" : ""}`, others.length && `${others.length} suggestion${others.length > 1 ? "s" : ""}`].filter(Boolean).join(" · ") ||
                  (result ? "R reported no errors or warnings, and the checker found nothing suspicious." : "R can read this code. Press Run and Analyze to check what happens when it runs.")}
              </p>
            </div>
          </Card>
        )}

        {result && (
          <Card className="overflow-hidden">
            <p className="border-b border-border bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground">Console – what R printed</p>
            <ConsoleView lines={result.lines} empty="(Your code printed nothing.)" maxHeight={260} />
            {result.images.length > 0 && <PlotGallery images={result.images} />}
          </Card>
        )}

        {(diagnoses ?? []).map((d) => {
          const k = KIND_STYLE[d.kind];
          const isSimple = simple[d.id];
          return (
            <Card key={d.id} className="overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
                <k.icon className={cn("size-5", d.kind === "warning" ? "text-warning" : d.kind === "logic" ? "text-info" : d.kind === "style" ? "text-muted-foreground" : "text-danger")} />
                <Badge variant={k.variant}>{k.label}</Badge>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{d.category}</span>
              </div>
              <div className="space-y-3 p-4 text-sm">
                <h3 className="text-base font-semibold">
                  <Markdown runnableCode={false}>{d.title}</Markdown>
                </h3>
                {d.message && <pre className="code-static whitespace-pre-wrap rounded-md bg-danger-soft px-3 py-2 text-[13px] text-danger">{d.message}</pre>}
                {d.lineStart && (
                  <button className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline cursor-pointer" onClick={() => editor.current?.scrollToLine(d.lineStart!)}>
                    <MapPin className="size-4" /> Problem location: line {d.lineStart}
                    {d.lineEnd && d.lineEnd !== d.lineStart ? `–${d.lineEnd}` : ""}
                    {d.token ? <code className="rounded bg-surface-2 px-1 font-mono text-xs">{d.token.text}</code> : null}
                  </button>
                )}
                <p className="rounded-md bg-surface px-3 py-2 text-xs text-muted-foreground">
                  <span className="font-semibold">How we know: </span>
                  {d.evidence}
                </p>
                {isSimple ? (
                  <div className="rounded-lg bg-primary-soft/60 p-3">
                    <p className="text-xs font-semibold text-primary-strong dark:text-primary">In very simple words</p>
                    <Markdown runnableCode={false}>{d.simpler}</Markdown>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-semibold">Why it happened</p>
                      <Markdown runnableCode={false}>{d.why}</Markdown>
                    </div>
                    <div>
                      <p className="font-semibold">How to fix it</p>
                      <Markdown runnableCode={false}>{d.howToFix}</Markdown>
                    </div>
                  </>
                )}
                {d.tips.length > 0 && (
                  <div>
                    <p className="flex items-center gap-1.5 font-semibold">
                      <Lightbulb className="size-4 text-warning" /> Tips to avoid this next time
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {d.tips.map((t) => (
                        <li key={t}>
                          <Markdown runnableCode={false}>{t}</Markdown>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSimple((s) => ({ ...s, [d.id]: !s[d.id] }))}>
                    <MessageCircleQuestion /> {isSimple ? "Show the full explanation" : "Explain More Simply"}
                  </Button>
                  {d.fix && !result && (
                    <Button size="sm" variant="outline" onClick={() => void runAnalyze()}>
                      <Wand2 /> Run to verify a fix
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {result && fixTried && !fix && errors.length > 0 && (
          <Card className="p-4 text-sm text-muted-foreground">
            No automatic fix could be confirmed by running R. Follow the steps above{aiConfigured ? ", or press Explain My Error for the AI tutor's suggestion" : ""}.
          </Card>
        )}

        {fix && (
          <Card className="overflow-hidden border-success/40">
            <div className="flex flex-wrap items-center gap-2 border-b border-border bg-success-soft px-4 py-3">
              <CheckCircle2 className="size-5 text-success" />
              <span className="font-semibold">Corrected code – verified by running it in R</span>
              <Badge variant={fix.confidence === "high" ? "success" : "info"} className="ml-auto">
                {fix.confidence === "high" ? "Confident fix" : "Likely fix – check it matches what you meant"}
              </Badge>
            </div>
            <div className="space-y-3 p-4 text-sm">
              <DiffView before={original ?? code} after={fix.code} />
              <div>
                <p className="font-semibold">What changed</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {fix.steps.map((s) => (
                    <li key={s}>
                      <Markdown runnableCode={false}>{s}</Markdown>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold">Output of the corrected code</p>
                <p className="text-xs text-muted-foreground">This is what R actually printed when the corrected code ran.</p>
                <div className="mt-1 overflow-hidden rounded-lg border border-border">
                  <ConsoleView lines={fix.result.lines} empty="(The corrected code printed nothing.)" maxHeight={220} />
                  {fix.result.images.length > 0 && <PlotGallery images={fix.result.images} />}
                </div>
              </div>
              {fix.remaining.length > 0 && (
                <p className="text-xs text-muted-foreground">Note: {fix.remaining.map((r) => r.title.replace(/`/g, "")).join("; ")}.</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => applyFix(fix.code)}>
                  <Wand2 /> Apply Fix
                </Button>
                <Button variant="outline" onClick={askTutor}>
                  <Sparkles /> Discuss with the AI tutor
                </Button>
              </div>
            </div>
          </Card>
        )}

        {aiError && (
          <Card role="alert" className="border-warning/40 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold text-warning">
              <AlertTriangle className="size-4" /> AI explanation unavailable
            </p>
            <p className="mt-1 text-muted-foreground">{aiError}</p>
          </Card>
        )}

        {ai && (
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-border bg-accent-soft px-4 py-3">
              <Sparkles className="size-5 text-accent" />
              <span className="font-semibold">AI tutor&apos;s explanation</span>
              <Badge variant="accent">{ai.category}</Badge>
            </div>
            <div className="space-y-3 p-4 text-sm">
              <p className="font-medium">{ai.summary}</p>
              {ai.location.line && (
                <p className="text-xs text-muted-foreground">
                  Location: line {ai.location.line} ({ai.location.basis === "reported_by_r" ? "reported by R" : ai.location.basis === "inferred_from_code" ? "inferred from the code" : "uncertain"}) – {ai.location.note}
                </p>
              )}
              <Markdown runnableCode={false}>{ai.explanation}</Markdown>
              <div>
                <p className="font-semibold">How to fix it</p>
                <Markdown runnableCode={false}>{ai.how_to_fix}</Markdown>
              </div>
              {ai.fixed_code && (
                <div className="space-y-2">
                  <DiffView before={code} after={ai.fixed_code} afterLabel="AI suggestion" />
                  {ai.changes.length > 0 && (
                    <ul className="list-disc space-y-1 pl-5">
                      {ai.changes.map((c, i) => (
                        <li key={i}>
                          {c.line ? `Line ${c.line}: ` : ""}
                          <code className="font-mono text-xs">{c.before}</code> → <code className="font-mono text-xs">{c.after}</code> – {c.reason}
                        </li>
                      ))}
                    </ul>
                  )}
                  {aiFixRun ? (
                    <div>
                      <p className={cn("text-xs font-semibold", aiFixRun.status === "ok" ? "text-success" : "text-danger")}>
                        {aiFixRun.status === "ok" ? "✓ The suggested code ran successfully in R. Real output:" : "✗ The suggested code still fails when run in R:"}
                      </p>
                      <div className="mt-1 overflow-hidden rounded-lg border border-border">
                        <ConsoleView lines={aiFixRun.lines} empty="(No output.)" maxHeight={200} />
                        {aiFixRun.images.length > 0 && <PlotGallery images={aiFixRun.images} />}
                      </div>
                    </div>
                  ) : (
                    <StaticCode code={ai.fixed_code} />
                  )}
                  {aiFixRun?.status === "ok" && (
                    <Button onClick={() => applyFix(ai.fixed_code!)}>
                      <Wand2 /> Apply Fix
                    </Button>
                  )}
                </div>
              )}
              {ai.prevention_tips.length > 0 && (
                <ul className="list-disc space-y-1 pl-5">
                  {ai.prevention_tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              <Button size="sm" variant="outline" onClick={() => void explainAi(true)} disabled={!!busy}>
                <MessageCircleQuestion /> Explain More Simply
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
