"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Ban,
  Bug,
  CheckCircle2,
  ClipboardCheck,
  CornerDownLeft,
  FolderX,
  Hash,
  Info,
  Lightbulb,
  ListChecks,
  Loader2,
  MapPin,
  MessageCircleQuestion,
  MessageSquareQuote,
  Package,
  Parentheses,
  RotateCcw,
  Search,
  SearchX,
  ShieldCheck,
  Sparkles,
  SpellCheck,
  Tag,
  Undo2,
  Wand2,
  Wrench,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { CodeEditor, type CodeEditorHandle, type LineMark, type TokenMark } from "@/components/code/code-editor";
import { ConsoleView, PlotGallery } from "@/components/code/output-panels";
import { StaticCode } from "@/components/code/static-code";
import { Markdown } from "@/components/content/markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { fireConfetti } from "@/components/game/confetti";
import { DiffView } from "./diff-view";
import { DetectiveHexy } from "./detective-hexy";
import { LineExcerpt } from "./line-excerpt";
import { rSession } from "@/lib/r/session";
import { transcript, type CheckInfo, type RunResult } from "@/lib/r/console";
import { analyzeParseError, analyzeRun, outputChecks, staticChecks, type AnalysisContext, type Diagnosis } from "@/lib/errors/analyze";
import { verifyFix, type VerifiedFix } from "@/lib/errors/fix-loop";
import { definedFunctions } from "@/lib/errors/helpers";
import { significant, tokenize } from "@/lib/r/tokens";
import { AI_NEEDS_SERVER, aiStatus, codeMessage, tutor } from "@/lib/ai/tutor-store";
import { progress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { useResolvedTheme } from "@/hooks/use-theme";
import { useRSession } from "@/hooks/use-r-session";
import type { HexyMood } from "@/components/brand/mascot";
import { cn } from "@/lib/utils";
import { withBase } from "@/lib/base-path";

const EXAMPLES: { label: string; code: string; icon: LucideIcon; color: string }[] = [
  { label: "Object not found", code: "numbers <- c(10, 20, 30)\nmean(number)", icon: SearchX, color: "coral" },
  { label: "Missing bracket", code: 'greeting <- "Hello, R!"\nprint(greeting\nnchar(greeting)', icon: Parentheses, color: "sky" },
  { label: "Text + number", code: 'price <- "10"\nquantity <- 3\ntotal <- price * quantity\ntotal', icon: Hash, color: "grape" },
  { label: "else on a new line", code: 'temperature <- 25\nif (temperature > 20) {\n  print("Warm")\n}\nelse {\n  print("Cold")\n}', icon: CornerDownLeft, color: "tangerine" },
  { label: "Missing package", code: "students <- read.csv(\"data/students.csv\")\nstudents |>\n  filter(math > 90) |>\n  select(name, math)", icon: Package, color: "teal" },
  { label: "Wrong file path", code: 'students <- read.csv("students.csv")\nhead(students)', icon: FolderX, color: "pink" },
  { label: "Result is NA", code: "scores <- c(90, 85, NA, 70)\nmean(scores)", icon: Ban, color: "mint" },
  { label: "Typo in function", code: "ages <- c(23, 35, 41)\nlenght(ages)", icon: SpellCheck, color: "sun" },
];

const KIND_STYLE = {
  syntax: { label: "Syntax error", variant: "danger", icon: XCircle, tone: "coral", meaning: "R could not read (parse) the code, so it stopped before running it." },
  runtime: { label: "Runtime error", variant: "danger", icon: XCircle, tone: "coral", meaning: "R understood the code, started running it and stopped at this problem." },
  warning: { label: "Warning", variant: "warning", icon: AlertTriangle, tone: "sun", meaning: "The code ran, but R warned you that something looks wrong." },
  logic: { label: "Logical issue", variant: "info", icon: Info, tone: "sky", meaning: "The code ran, but the result may not be what you meant." },
  style: { label: "Suggestion", variant: "default", icon: Lightbulb, tone: "grape", meaning: "Not an error – a tip to make the code clearer or safer." },
} as const;

const accent = (color: string) => ({ "--a": `var(--${color})`, "--a-soft": `var(--${color}-soft)`, "--a-shadow": `var(--${color}-shadow)` }) as CSSProperties;
const onAccent = (color: string) => (color === "sun" ? "text-[#3b2600]" : "text-white");
const isError = (d: Diagnosis) => d.kind === "syntax" || d.kind === "runtime";

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

/** One numbered clue inside a case file. */
function Clue({ n, icon: Icon, color, title, children, extra }: { n: number; icon: LucideIcon; color: string; title: string; children: ReactNode; extra?: ReactNode }) {
  return (
    <li className="relative flex gap-3 animate-fade-up" style={{ ...accent(color), animationDelay: `${n * 60}ms` }}>
      <span className="flex flex-col items-center">
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--a)] shadow-[0_3px_0_var(--a-shadow)]", onAccent(color))} aria-hidden>
          <Icon className="size-[18px]" />
        </span>
        <span className="mt-1.5 w-0.5 flex-1 rounded-full bg-border" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-display text-[15px] font-semibold leading-tight">
            <span className="mr-1.5 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clue {n}</span>
            {title}
          </h4>
          {extra}
        </div>
        <div className="mt-1.5 space-y-2 text-sm">{children}</div>
      </div>
    </li>
  );
}

export function ErrorChecker() {
  const [code, setCode] = useState(EXAMPLES[0].code);
  /** The learner's own code from before a fix was applied (for “Restore my original code”). */
  const [backup, setBackup] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "check" | "run" | "ai">(null);
  const [fixing, setFixing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [checked, setChecked] = useState<CheckInfo | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);
  const [fix, setFix] = useState<VerifiedFix | null>(null);
  const [fixFor, setFixFor] = useState<string | null>(null);
  const [fixTried, setFixTried] = useState(false);
  const [simple, setSimple] = useState<Record<string, boolean>>({});
  const [ai, setAi] = useState<AiAnalysis | null>(null);
  const [aiFixRun, setAiFixRun] = useState<RunResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [analyzedCode, setAnalyzedCode] = useState<string | null>(null);
  /** The code a fix put into the editor – to celebrate when it passes. */
  const [appliedFix, setAppliedFix] = useState<string | null>(null);
  const editor = useRef<CodeEditorHandle>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const fixRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const settings = useSettings();
  const theme = useResolvedTheme();
  const session = useRSession();
  const router = useRouter();

  const stale = analyzedCode !== null && analyzedCode !== code;
  const working = Boolean(busy) || fixing;

  const reveal = (el: HTMLElement | null, always = false) => {
    if (!el) return;
    if (!always && window.matchMedia("(min-width: 1024px)").matches) return;
    const r = el.getBoundingClientRect();
    if (always || r.top < 0 || r.top > window.innerHeight * 0.6) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetResults = () => {
    setResult(null);
    setChecked(null);
    setDiagnoses(null);
    setFix(null);
    setFixFor(null);
    setFixTried(false);
    setAi(null);
    setAiFixRun(null);
    setAiError(null);
    setSimple({});
  };

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

  /** Check without running: syntax + static checks. */
  const checkCode = async (src = code) => {
    resetResults();
    setBusy("check");
    setAnalyzedCode(src);
    try {
      const info = await rSession.check(src, "checker");
      setChecked(info);
      if (!info.ok && info.parse_error) {
        const d = analyzeParseError(src, info.parse_error);
        setDiagnoses([d]);
        progress.bumpStat("errorsAnalyzed");
        return;
      }
      const ds = staticChecks(src);
      const defined = new Set(definedFunctions(src));
      const hasLibrary = /\b(library|require)\s*\(/.test(src);
      const unknown = (info.unknown_functions ?? []).filter((f) => !defined.has(f));
      for (const f of unknown) {
        const tok = significant(tokenize(src)).find((t) => t.kind === "name" && t.text === f);
        ds.unshift({
          id: `unknown-fn-${f}`,
          kind: hasLibrary ? "style" : "runtime",
          category: hasLibrary ? "Possible Problem – Function From a Package" : "Possible Problem – Unknown Function",
          title: `\`${f}()\` is not currently available`,
          message: null,
          lineStart: tok?.line ?? null,
          lineEnd: tok?.line ?? null,
          token: tok ? { line: tok.line, from: tok.col, to: tok.col + f.length, text: f } : null,
          evidence: `Static check: R has no function called \`${f}\` loaded right now and the code does not define one.${hasLibrary ? " Your code loads packages, which may provide it – press Find My Error to know for sure." : " Running this code would most likely stop here."}`,
          why: `R looked for a function named \`${f}\` and did not find one.`,
          howToFix: "Check the spelling, or load the package that provides it with `library()`. Press **Find My Error** for a definite answer.",
          simpler: `R doesn't know \`${f}\` yet.`,
          tips: [],
        });
      }
      setDiagnoses(ds);
    } finally {
      setBusy(null);
    }
  };

  /** Find My Error: run the code for real, then explain what happened. */
  const runAnalyze = async (src = code): Promise<{ r: RunResult; ds: Diagnosis[]; v: VerifiedFix | null } | null> => {
    resetResults();
    setBusy("run");
    setAnalyzedCode(src);
    try {
      const r = await rSession.run(src, runOpts());
      setResult(r);
      if (!r.info) {
        setDiagnoses([]);
        return { r, ds: [], v: null };
      }
      const ctx = await gather(r, src, "checker");
      const ds = [...analyzeRun({ code: src, info: r.info, ...ctx })];
      if (r.info.status === "ok") ds.push(...outputChecks(src, r.lines.filter((l) => l.kind === "stdout").map((l) => l.text)));
      setDiagnoses(ds);
      if (ds.some(isError)) progress.bumpStat("errorsAnalyzed");
      // Verify the first fix straight away so learners see a real corrected result.
      const first = ds.find((d) => d.fix);
      let v: VerifiedFix | null = null;
      if (first) {
        setFixTried(true);
        setFixFor(first.id);
        setVerifying(true);
        try {
          v = await verifyFix(src, first, {
            run: (c) => rSession.run(c, { ...runOpts(), workspace: "checker-fix" }),
            context: (res, c) => gather(res, c, "checker-fix"),
          });
        } finally {
          setVerifying(false);
        }
        setFix(v);
      }
      return { r, ds, v };
    } finally {
      setBusy(null);
    }
  };

  const findError = async () => {
    const out = await runAnalyze();
    if (out) reveal(reportRef.current);
  };

  /** Explain with AI: ask the AI, then verify its fix in R. */
  const explainAi = async (simpler = false, pre?: { r: RunResult; ds: Diagnosis[] }): Promise<AiAnalysis | null> => {
    const src = code;
    let r = pre?.r ?? result;
    let ds = pre?.ds ?? diagnoses;
    if (!r || (!pre && stale)) {
      const out = await runAnalyze(src);
      if (!out) return null;
      r = out.r;
      ds = out.ds;
    }
    if (!aiConfigured) {
      setAiError(
        AI_NEEDS_SERVER
          ? "AI explanations need a server, and this copy of R Academy is a static site. The rule-based analysis above is based on what R reported."
          : "AI explanations are not configured on this server (the site owner needs to set ANTHROPIC_API_KEY). The rule-based analysis above is based on what R reported.",
      );
      return null;
    }
    setBusy("ai");
    setAiError(null);
    try {
      const res = await fetch(withBase("/api/ai/analyze"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: src,
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
      if (a.fixed_code && a.fixed_code.trim() !== src.trim()) {
        setAiFixRun(await rSession.run(a.fixed_code, { ...runOpts(), workspace: "checker-fix" }));
      }
      return a;
    } catch (e) {
      setAiError(e instanceof Error ? e.message : String(e));
      return null;
    } finally {
      setBusy(null);
    }
  };

  const explainWithAi = async () => {
    await explainAi();
    reveal(aiRef.current, true);
  };

  /** Fix it for me: find a corrected version that R has really run. */
  const fixCode = async () => {
    setFixing(true);
    try {
      const out = !result || stale ? await runAnalyze() : { r: result, ds: diagnoses ?? [], v: fix };
      if (!out) return;
      if (out.v) {
        reveal(fixRef.current, true);
        return;
      }
      const hasErr = out.ds.some(isError) || out.r.status !== "ok";
      if (!hasErr) {
        toast("No errors to fix", { description: out.ds.length ? "R ran your code without errors – the clues are still worth a look." : "R ran your code without errors.", tone: "success" });
        reveal(reportRef.current);
        return;
      }
      const a = ai ?? (aiConfigured ? await explainAi(false, out) : null);
      if (a?.fixed_code) reveal(aiRef.current, true);
      else {
        toast("No automatic fix found", { description: "Read the explanation for how to fix it, or ask the AI tutor.", tone: "info" });
        reveal(reportRef.current);
      }
    } finally {
      setFixing(false);
    }
  };

  /** Apply fix & test: put the corrected code in the editor and run the investigation again. */
  const applyAndTest = async (newCode: string) => {
    if (backup === null) setBackup(code);
    setCode(newCode);
    setAppliedFix(newCode);
    progress.bumpStat("fixesApplied");
    toast("Fix applied – testing it now", { description: "Your original code is kept – use “Restore my original code” to go back." });
    reveal(reportRef.current, true);
    const out = await runAnalyze(newCode);
    if (out && out.r.status === "ok" && !out.ds.some(isError)) fireConfetti({ y: 0.4, count: 120 });
  };

  const restore = () => {
    if (backup === null) return;
    setCode(backup);
    setBackup(null);
    setAppliedFix(null);
  };

  const loadCode = (c: string) => {
    setCode(c);
    resetResults();
    setBackup(null);
    setAnalyzedCode(null);
    setAppliedFix(null);
  };

  const runLatest = useRef(runAnalyze);
  useLayoutEffect(() => {
    runLatest.current = runAnalyze;
  });

  // Code handed over from another page (sessionStorage) – only readable after hydration.
  // With "ra-check-auto" set, start the investigation straight away (R starts on demand).
  const handedOver = useRef(false);
  useEffect(() => {
    aiStatus().then((s) => setAiConfigured(s.configured));
    if (handedOver.current) return;
    try {
      const incoming = sessionStorage.getItem("ra-check-code");
      const auto = sessionStorage.getItem("ra-check-auto") === "1";
      sessionStorage.removeItem("ra-check-auto");
      if (incoming) {
        handedOver.current = true;
        sessionStorage.removeItem("ra-check-code");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCode(incoming);
        if (auto)
          window.setTimeout(async () => {
            const out = await runLatest.current(incoming);
            if (out) reveal(reportRef.current);
          }, 60);
      }
    } catch {
      /* ignore */
    }
  }, []);

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

  const errors = (diagnoses ?? []).filter(isError);
  const warnings = (diagnoses ?? []).filter((d) => d.kind === "warning");
  const others = (diagnoses ?? []).filter((d) => d.kind === "logic" || d.kind === "style");
  const solvedByFix = Boolean(result && appliedFix !== null && analyzedCode === appliedFix && !stale && !errors.length && result.status === "ok");

  const askTutor = () => {
    tutor.queue(codeMessage(code, result ? transcript(result.lines) : null, "Please help me understand and fix the problem in this R code."));
    router.push("/tutor");
  };

  // ---------- The case report headline ----------
  const first = errors[0];
  const verdict = (() => {
    if (!diagnoses) return null;
    if (first) {
      const label = KIND_STYLE[first.kind].label;
      const where = first.lineStart ? ` on line ${first.lineStart}` : "";
      return {
        mood: "oops" as HexyMood,
        stamp: "Case open",
        tone: "coral",
        title: result || first.kind === "syntax" ? `${label} found${where}` : `Possible ${label.toLowerCase()} spotted${where}`,
        text: "Hexy collected the clues below: what kind of problem it is, where it is, why it happened and how to fix it.",
      };
    }
    const extras = [warnings.length && `${warnings.length} warning${warnings.length > 1 ? "s" : ""}`, others.length && `${others.length} suggestion${others.length > 1 ? "s" : ""}`].filter(Boolean).join(" and ");
    if (result && result.status === "ok") {
      return {
        mood: (extras ? "happy" : "celebrate") as HexyMood,
        stamp: "Case closed",
        tone: "mint",
        title: solvedByFix ? "Solved! The fixed code runs without errors" : "No errors – your code ran successfully",
        text: extras ? `R reported no errors, but there ${extras.startsWith("1 ") ? "is" : "are"} ${extras} worth a look below.` : "R reported no errors or warnings, and the checker found nothing suspicious.",
      };
    }
    if (result) {
      return { mood: "oops" as HexyMood, stamp: "Case open", tone: "sun", title: result.status === "timeout" ? "Your code took too long to run" : "R could not finish running your code", text: "See what R printed below." };
    }
    return {
      mood: "point" as HexyMood,
      stamp: "Checked",
      tone: "sky",
      title: checked?.ok ? "No syntax errors found" : "Check complete",
      text: extras ? `R can read this code. There ${extras.startsWith("1 ") ? "is" : "are"} ${extras} below. Press Find My Error to see what happens when it runs.` : "R can read this code. Press Find My Error to see what happens when it really runs.",
    };
  })();

  // ---------- Case file for one diagnosis ----------
  const caseFile = (d: Diagnosis, index: number) => {
    const k = KIND_STYLE[d.kind];
    const isSimple = simple[d.id];
    const dFix = fixFor === d.id ? fix : null;
    const fixSlot = fixFor === d.id || (isError(d) && d === first);
    const before = analyzedCode ?? code;
    let n = 0;
    return (
      <article key={d.id} className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] animate-fade-up" aria-labelledby={`case-${d.id}`} style={accent(k.tone)}>
        <header className="flex flex-wrap items-start gap-3 border-b-2 border-border bg-gradient-to-r from-[var(--a-soft)] to-transparent px-5 py-4">
          <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--a)] shadow-[0_3px_0_var(--a-shadow)]", onAccent(k.tone))} aria-hidden>
            <k.icon className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">Case file #{index + 1}</p>
            <h3 id={`case-${d.id}`} className="font-display text-lg font-semibold leading-snug [&_p]:inline">
              <Markdown runnableCode={false}>{d.title}</Markdown>
            </h3>
          </div>
        </header>
        <ol className="space-y-4 p-5">
          <Clue n={++n} icon={Tag} color="grape" title="Error type">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={k.variant}>{k.label}</Badge>
              <span className="font-display text-sm font-semibold">{d.category}</span>
            </div>
            <p className="text-muted-foreground">{k.meaning}</p>
          </Clue>

          {(d.message || isError(d)) && (
            <Clue n={++n} icon={MessageSquareQuote} color="coral" title="The exact R message">
              {d.message ? (
                <pre className="code-static whitespace-pre-wrap rounded-2xl border-2 border-coral/30 bg-danger-soft px-3.5 py-2.5 text-[13px] text-danger">{d.message}</pre>
              ) : (
                <p className="text-muted-foreground">R hasn&apos;t printed a message yet – this was spotted by checking the code without running it. Press Find My Error to see R&apos;s real message.</p>
              )}
            </Clue>
          )}

          <Clue
            n={++n}
            icon={MapPin}
            color="sky"
            title="Where"
            extra={
              d.lineStart ? (
                <Button size="sm" variant="ghost" className="h-7 rounded-lg px-2 text-xs" onClick={() => editor.current?.scrollToLine(d.lineStart!)} disabled={stale}>
                  Show me in the editor
                </Button>
              ) : null
            }
          >
            {d.lineStart ? (
              <>
                <p className="font-semibold">
                  Line {d.lineStart}
                  {d.lineEnd && d.lineEnd !== d.lineStart ? `–${d.lineEnd}` : ""}
                  {d.token ? (
                    <>
                      {" "}
                      at <code className="rounded-md bg-danger-soft px-1.5 py-0.5 font-mono text-xs text-danger">{d.token.text}</code>
                    </>
                  ) : null}
                </p>
                {!stale && <LineExcerpt code={before} lineStart={d.lineStart} lineEnd={d.lineEnd} token={d.token} kind={isError(d) ? "error" : d.kind === "warning" ? "warning" : "highlight"} />}
              </>
            ) : (
              <p className="text-muted-foreground">R didn&apos;t point to one specific line for this.</p>
            )}
            <div className="rounded-2xl bg-surface-2/70 px-3.5 py-2.5 text-xs text-muted-foreground">
              <span className="font-display font-semibold text-foreground">🔎 How we know: </span>
              <Markdown runnableCode={false} className="inline [&>p]:inline">
                {d.evidence}
              </Markdown>
            </div>
          </Clue>

          <Clue
            n={++n}
            icon={Lightbulb}
            color="sun"
            title="What went wrong"
            extra={
              <Button size="sm" variant="ghost" className="h-7 rounded-lg px-2 text-xs" onClick={() => setSimple((s) => ({ ...s, [d.id]: !s[d.id] }))} aria-pressed={!!isSimple}>
                <MessageCircleQuestion /> {isSimple ? "Show the full explanation" : "Explain more simply"}
              </Button>
            }
          >
            {isSimple ? (
              <div className="rounded-2xl bg-primary-soft/70 px-3.5 py-2.5 animate-pop-in">
                <p className="font-display text-xs font-semibold uppercase tracking-wider text-primary-strong dark:text-primary">In very simple words</p>
                <Markdown runnableCode={false}>{d.simpler}</Markdown>
              </div>
            ) : (
              <Markdown runnableCode={false}>{d.why}</Markdown>
            )}
          </Clue>

          <Clue n={++n} icon={Wrench} color="tangerine" title="How to fix it">
            <Markdown runnableCode={false}>{d.howToFix}</Markdown>
            {d.tips.length > 0 && (
              <div className="rounded-2xl border-2 border-dashed border-border px-3.5 py-2.5">
                <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avoid it next time</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {d.tips.map((t) => (
                    <li key={t}>
                      <Markdown runnableCode={false}>{t}</Markdown>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Clue>

          {fixSlot && (
            <Clue
              n={++n}
              icon={ShieldCheck}
              color="mint"
              title="Corrected code"
              extra={
                dFix ? (
                  <Badge variant={dFix.confidence === "high" ? "success" : "info"}>
                    <CheckCircle2 /> {dFix.confidence === "high" ? "Verified by R · confident fix" : "Verified by R · likely fix – check it matches what you meant"}
                  </Badge>
                ) : null
              }
            >
              {dFix ? (
                <div ref={fixRef} className="scroll-mt-24 space-y-2">
                  <DiffView before={before} after={dFix.code} />
                  <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">What R printed when it ran the corrected code</p>
                  <div className="overflow-hidden rounded-2xl border-2 border-border">
                    <ConsoleView lines={dFix.result.lines} empty="(The corrected code printed nothing.)" maxHeight={220} />
                    {dFix.result.images.length > 0 && <PlotGallery images={dFix.result.images} />}
                  </div>
                </div>
              ) : verifying && fixFor === d.id ? (
                <p className="flex items-center gap-2 font-semibold text-muted-foreground">
                  <Loader2 className="size-4 animate-spin text-primary" /> Testing a possible fix in R…
                </p>
              ) : d.fix && !result ? (
                <div className="space-y-2">
                  <p className="text-muted-foreground">Hexy has an idea for a fix, but only shows corrected code after R has run it successfully.</p>
                  <Button size="sm" variant="success" onClick={() => void findError()} disabled={working}>
                    <Wand2 /> Run to verify a fix
                  </Button>
                </div>
              ) : result && fixTried ? (
                <p className="text-muted-foreground">No automatic fix could be confirmed by running R. Follow “How to fix it” above{aiConfigured ? ", or press Explain with AI for a suggestion that R will test" : ""}.</p>
              ) : (
                <p className="text-muted-foreground">Hexy has no automatic fix for this one – follow “How to fix it” above{aiConfigured ? ", or press Explain with AI for a suggestion that R will test" : ""}.</p>
              )}
            </Clue>
          )}

          {dFix && (
            <Clue n={++n} icon={ListChecks} color="teal" title="Why the correction works">
              <ul className="space-y-1.5">
                {dFix.steps.map((s) => (
                  <li key={s} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                    <Markdown runnableCode={false}>{s}</Markdown>
                  </li>
                ))}
              </ul>
              <div className="text-muted-foreground">
                <strong className="text-foreground">The cause:</strong>{" "}
                <Markdown runnableCode={false} className="inline [&>p]:inline">
                  {d.simpler}
                </Markdown>{" "}
                The change above removes that cause – and the proof is that R ran the corrected code without an error.
              </div>
              {dFix.remaining.length > 0 && <p className="text-xs text-muted-foreground">Still worth a look: {dFix.remaining.map((r) => r.title.replace(/`/g, "")).join("; ")}.</p>}
            </Clue>
          )}

          {dFix && (
            <Clue n={++n} icon={Wand2} color="primary" title="Apply the fix & test it">
              <p className="text-muted-foreground">Puts the corrected code into the editor and runs Find My Error again, so you can see it pass. Your original code is kept.</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="success" onClick={() => void applyAndTest(dFix.code)} disabled={working}>
                  <Wand2 /> Apply fix &amp; test
                </Button>
                <Button variant="outline" onClick={askTutor}>
                  <Sparkles /> Discuss with Hexy
                </Button>
              </div>
            </Clue>
          )}
        </ol>
      </article>
    );
  };

  const busyText = busy === "check" ? "Asking R to read your code (without running it)…" : busy === "ai" ? "Asking Hexy's AI brain for a second opinion…" : session.status === "loading" || session.status === "idle" ? "Starting R in your browser – the first time takes a few seconds…" : "Running your code in real R…";

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* ---------- The crime scene: the code ---------- */}
        <div className="min-w-0 space-y-4 lg:self-start lg:[@media(min-height:860px)]:sticky lg:[@media(min-height:860px)]:top-[calc(var(--header-h)+1rem)]">
          <div>
            <p id="cases-label" className="mb-2 font-display text-sm font-semibold text-muted-foreground">
              🗂️ Pick a case to crack – each one has a classic beginner mistake:
            </p>
            <div role="group" aria-labelledby="cases-label" className="flex flex-wrap gap-2">
              {EXAMPLES.map((e, i) => {
                const on = code === e.code;
                return (
                  <button
                    key={e.label}
                    type="button"
                    aria-pressed={on}
                    onClick={() => loadCode(e.code)}
                    style={accent(e.color)}
                    className={cn(
                      "press flex cursor-pointer items-center gap-1.5 rounded-full border-2 py-1 pl-1 pr-3 font-display text-[13px] font-semibold",
                      on ? "border-[var(--a)] bg-[var(--a-soft)] [--press-shadow:var(--a)]" : "border-border bg-surface [--press-shadow:var(--border)] hover:border-[var(--a)]",
                    )}
                  >
                    <span className={cn("grid size-6 place-items-center rounded-full bg-[var(--a)]", onAccent(e.color))} aria-hidden>
                      <e.icon className="size-3.5" />
                    </span>
                    <span className="sr-only">Case {i + 1}: </span>
                    {e.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-center gap-2 border-b-2 border-border bg-surface-2/70 px-3 py-2">
              <span className="mr-1 hidden items-center gap-1.5 sm:flex" aria-hidden>
                <span className="size-3 rounded-full bg-coral" />
                <span className="size-3 rounded-full bg-sun" />
                <span className="size-3 rounded-full bg-mint" />
              </span>
              <h2 className="font-display text-sm font-semibold">The crime scene: your R code</h2>
              <div className="ml-auto flex flex-wrap items-center gap-1">
                {backup !== null && backup !== code && (
                  <Button size="sm" variant="ghost" onClick={restore}>
                    <Undo2 /> Restore my original code
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => loadCode("")} disabled={!code}>
                  <RotateCcw /> Clear
                </Button>
              </div>
            </div>
            <CodeEditor
              ref={editor}
              value={code}
              onChange={setCode}
              onRun={() => void findError()}
              minHeight={280}
              maxHeight={440}
              lineMarks={marks.lines}
              tokenMarks={marks.tokens}
              ariaLabel="Paste or write the R code to check"
              placeholder="Paste your R code here…"
            />
            <div className="space-y-2.5 border-t-2 border-border bg-surface-2/50 p-3">
              <Button size="lg" className="w-full text-[17px]" onClick={() => void findError()} disabled={working || !code.trim()}>
                {busy === "run" && !fixing ? <Loader2 className="animate-spin" /> : <Search />} Find My Error
              </Button>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Button variant="outline" size="sm" onClick={() => void checkCode()} disabled={working || !code.trim()}>
                  {busy === "check" ? <Loader2 className="animate-spin" /> : <ClipboardCheck />} Check without running
                </Button>
                <Button variant="grape" size="sm" onClick={() => void explainWithAi()} disabled={working || !code.trim()}>
                  {busy === "ai" && !fixing ? <Loader2 className="animate-spin" /> : <Sparkles />} Explain with AI
                </Button>
                <Button variant="success" size="sm" onClick={() => void fixCode()} disabled={working || !code.trim()}>
                  {fixing ? <Loader2 className="animate-spin" /> : <Wand2 />} Fix it for me
                </Button>
              </div>
              <p className="text-center text-xs font-semibold text-muted-foreground">
                Tip: <kbd className="rounded border border-border bg-surface px-1 font-mono text-[11px]">Ctrl</kbd>+<kbd className="rounded border border-border bg-surface px-1 font-mono text-[11px]">Enter</kbd> in the editor also runs Find My Error.
              </p>
            </div>
          </div>
        </div>

        {/* ---------- The case report ---------- */}
        <section className="min-w-0 space-y-5" aria-labelledby="report-title">
          <h2 id="report-title" className="sr-only">
            Investigation report
          </h2>
          <p role="status" className="sr-only">
            {working ? busyText : verdict ? `${verdict.title}. ${verdict.text}` : ""}
          </p>

          {stale && diagnoses && (
            <p className="flex items-center gap-2 rounded-2xl border-2 border-sun/50 bg-sun-soft px-4 py-2.5 text-sm font-semibold">
              <AlertTriangle className="size-4 shrink-0 text-warning" aria-hidden /> The code has changed since it was investigated – press Find My Error again to update the clues.
            </p>
          )}

          {!diagnoses && !busy && (
            <div className="rounded-3xl border-2 border-dashed border-border-strong bg-card/70 p-6 text-center sm:p-8">
              <DetectiveHexy mood="point" size={112} className="mx-auto" />
              <p className="mt-4 font-display text-2xl font-bold">Ready to investigate!</p>
              <p className="mx-auto mt-1 max-w-md text-sm font-semibold text-muted-foreground">
                Paste your code (or pick a case) and press <strong className="text-foreground">Find My Error</strong>. Hexy runs it in real R and collects the clues:
              </p>
              <ol className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-2 text-left text-[13px] font-semibold">
                {[
                  ["Error type", Tag, "grape"],
                  ["The exact R message", MessageSquareQuote, "coral"],
                  ["Where it happened", MapPin, "sky"],
                  ["What went wrong", Lightbulb, "sun"],
                  ["How to fix it", Wrench, "tangerine"],
                  ["Corrected code, run by R", ShieldCheck, "mint"],
                ].map(([label, Icon, color], i) => {
                  const I = Icon as LucideIcon;
                  return (
                    <li key={label as string} className="flex items-center gap-2 rounded-2xl border-2 border-border bg-surface px-2.5 py-2" style={accent(color as string)}>
                      <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg bg-[var(--a)]", onAccent(color as string))} aria-hidden>
                        <I className="size-4" />
                      </span>
                      <span>
                        <span className="sr-only">Clue {i + 1}: </span>
                        {label as string}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {busy && !diagnoses && (
            <div className="flex items-center gap-4 rounded-3xl border-2 border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DetectiveHexy mood="think" size={84} animate />
              <div>
                <p className="font-display text-xl font-semibold">Investigating…</p>
                <p className="mt-0.5 text-sm font-semibold text-muted-foreground">{busyText}</p>
                <span className="mt-2 flex gap-1" aria-hidden>
                  <span className="typing-dot size-2 rounded-full bg-primary" />
                  <span className="typing-dot size-2 rounded-full bg-primary" />
                  <span className="typing-dot size-2 rounded-full bg-primary" />
                </span>
              </div>
            </div>
          )}

          {verdict && (
            <div
              ref={reportRef}
              className="relative scroll-mt-24 overflow-hidden rounded-3xl border-2 border-[var(--a)] bg-[var(--a-soft)] p-5 shadow-[var(--shadow-card)] animate-pop-in"
              style={accent(verdict.tone)}
            >
              <span
                className="absolute right-4 top-4 hidden rotate-[-8deg] rounded-lg border-[3px] border-[var(--a)] px-2 py-0.5 font-display text-sm font-bold uppercase tracking-widest text-[var(--a)] opacity-80 sm:block"
                aria-hidden
              >
                {verdict.stamp}
              </span>
              <div className="flex items-center gap-4">
                <DetectiveHexy mood={working ? "think" : verdict.mood} size={78} />
                <div className="min-w-0 flex-1 sm:pr-28">
                  <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">Case report</p>
                  <p className="font-display text-xl font-bold leading-tight sm:text-2xl">{verdict.title}</p>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">{verdict.text}</p>
                </div>
              </div>
              {(diagnoses?.length ?? 0) > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {errors.length > 0 && <Badge variant="danger">{errors.length} error{errors.length > 1 ? "s" : ""}</Badge>}
                  {warnings.length > 0 && <Badge variant="warning">{warnings.length} warning{warnings.length > 1 ? "s" : ""}</Badge>}
                  {others.length > 0 && <Badge variant="info">{others.length} suggestion{others.length > 1 ? "s" : ""}</Badge>}
                </div>
              )}
              {(solvedByFix || (first && !working)) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {solvedByFix && backup !== null && backup !== code && (
                    <Button size="sm" variant="outline" onClick={restore}>
                      <Undo2 /> Restore my original code
                    </Button>
                  )}
                  {first && (
                    <Button size="sm" variant="outline" onClick={askTutor}>
                      <Sparkles /> Ask Hexy about it
                    </Button>
                  )}
                </div>
              )}
              {working && diagnoses && (
                <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" /> {verifying ? "Testing a possible fix in R…" : busyText}
                </p>
              )}
            </div>
          )}

          {result && (
            <div className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
              <p className="flex items-center gap-2 border-b-2 border-border bg-surface-2/70 px-4 py-2 font-display text-sm font-semibold">
                <Bug className="size-4 text-primary" aria-hidden /> Evidence: what R printed
              </p>
              <ConsoleView lines={result.lines} empty="(Your code printed nothing.)" maxHeight={240} />
              {result.images.length > 0 && <PlotGallery images={result.images} />}
            </div>
          )}

          {(diagnoses ?? []).map((d, i) => caseFile(d, i))}

          <div ref={aiRef} className="scroll-mt-24 space-y-5 empty:hidden">
            {aiError && (
              <div role="alert" className="rounded-3xl border-2 border-sun/60 bg-sun-soft p-4 text-sm">
                <p className="flex items-center gap-2 font-display font-semibold text-warning">
                  <AlertTriangle className="size-4" aria-hidden /> AI explanation unavailable
                </p>
                <p className="mt-1 font-semibold text-muted-foreground">{aiError}</p>
              </div>
            )}

            {busy === "ai" && diagnoses && (
              <div className="flex items-center gap-3 rounded-3xl border-2 border-grape/40 bg-grape-soft p-4 text-sm font-semibold">
                <Loader2 className="size-5 animate-spin text-grape" aria-hidden /> Asking Hexy&apos;s AI brain for a second opinion…
              </div>
            )}

            {ai && (
              <div className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)] animate-fade-up">
                <div className="flex flex-wrap items-center gap-2 border-b-2 border-border bg-gradient-to-r from-grape-soft to-transparent px-5 py-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-grape text-white shadow-[0_3px_0_var(--grape-shadow)]" aria-hidden>
                    <Sparkles className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">Second opinion from Hexy AI</h3>
                  <Badge variant="grape">{ai.category}</Badge>
                </div>
                <div className="space-y-3 p-5 text-sm">
                  <p className="font-display text-base font-semibold">{ai.summary}</p>
                  {ai.location.line && (
                    <p className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <MapPin className="size-3.5" aria-hidden /> Location: line {ai.location.line} ({ai.location.basis === "reported_by_r" ? "reported by R" : ai.location.basis === "inferred_from_code" ? "inferred from the code" : "uncertain"}) – {ai.location.note}
                    </p>
                  )}
                  <Markdown runnableCode={false}>{ai.explanation}</Markdown>
                  <div>
                    <p className="font-display font-semibold">How to fix it</p>
                    <Markdown runnableCode={false}>{ai.how_to_fix}</Markdown>
                  </div>
                  {ai.fixed_code && (
                    <div className="space-y-2">
                      <DiffView before={analyzedCode ?? code} after={ai.fixed_code} afterLabel="AI suggestion" />
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
                          <p className={cn("flex items-center gap-1.5 text-xs font-bold", aiFixRun.status === "ok" ? "text-success" : "text-danger")}>
                            {aiFixRun.status === "ok" ? <CheckCircle2 className="size-4" aria-hidden /> : <XCircle className="size-4" aria-hidden />}
                            {aiFixRun.status === "ok" ? "Verified: the suggested code ran successfully in R. Real output:" : "Not verified: the suggested code still fails when run in R:"}
                          </p>
                          <div className="mt-1 overflow-hidden rounded-2xl border-2 border-border">
                            <ConsoleView lines={aiFixRun.lines} empty="(No output.)" maxHeight={200} />
                            {aiFixRun.images.length > 0 && <PlotGallery images={aiFixRun.images} />}
                          </div>
                        </div>
                      ) : (
                        <StaticCode code={ai.fixed_code} className="rounded-2xl border-2 border-border" />
                      )}
                      {aiFixRun?.status === "ok" && (
                        <Button variant="success" onClick={() => void applyAndTest(ai.fixed_code!)} disabled={working}>
                          <Wand2 /> Apply fix &amp; test
                        </Button>
                      )}
                    </div>
                  )}
                  {ai.prevention_tips.length > 0 && (
                    <div className="rounded-2xl border-2 border-dashed border-border px-3.5 py-2.5">
                      <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avoid it next time</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {ai.prevention_tips.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button size="sm" variant="outline" onClick={() => void explainAi(true)} disabled={working}>
                    <MessageCircleQuestion /> Explain more simply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ---------- How the detective works ---------- */}
      <section aria-labelledby="toolkit-title">
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">How it works</p>
        <h2 id="toolkit-title" className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Your detective toolkit
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Search, color: "primary", title: "Find My Error", text: "Runs the code in real R in your browser, records exactly which line failed, and explains R's message." },
            { icon: ClipboardCheck, color: "sky", title: "Check without running", text: "Asks R to read (parse) your code without running it, and looks for common mistakes." },
            { icon: Sparkles, color: "grape", title: "Explain with AI", text: "Asks Hexy's AI for a deeper explanation based on R's real output. Its fix is tested in R too." },
            { icon: Wand2, color: "mint", title: "Fix it for me", text: "Suggests corrected code – only shown as working after R has run it successfully." },
          ].map((tool) => (
            <div key={tool.title} className="rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)]" style={accent(tool.color)}>
              <span className={cn("grid size-11 place-items-center rounded-2xl bg-[var(--a)] shadow-[0_3px_0_var(--a-shadow)]", onAccent(tool.color))} aria-hidden>
                <tool.icon className="size-6" />
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold">{tool.title}</h3>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{tool.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
