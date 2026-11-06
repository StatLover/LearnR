"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown,
  Bug,
  Calculator,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  GraduationCap,
  ListOrdered,
  MessageCircleQuestion,
  RotateCcw,
  SendHorizontal,
  Square,
  Terminal,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/content/markdown";
import { StaticCode } from "@/components/code/static-code";
import { PlotGallery } from "@/components/code/output-panels";
import { Hexy, HexyAvatar, type HexyMood } from "@/components/brand/mascot";
import { aiStatus, tutor, useTutor, type ChatMessage, type ToolRun } from "@/lib/ai/tutor-store";
import { updateSettings, useSettings, type TutorMode } from "@/lib/store/settings";
import { cn } from "@/lib/utils";
import { LESSON_ACTION, matchAction, QUICK_ACTIONS, SEND_CODE_ACTION, type Availability, type QuickAction, type QuickContext } from "./quick-actions";

export interface ModeInfo {
  value: TutorMode;
  label: string;
  desc: string;
  icon: LucideIcon;
  /** Accent colour name (design token). */
  color: string;
  /** What Hexy does in this mode, for the tutor page. */
  long: string;
}

export const MODES: ModeInfo[] = [
  { value: "beginner", label: "Beginner", desc: "Simple words, analogies and small examples", icon: GraduationCap, color: "mint", long: "Everyday analogies and tiny examples. No jargon – every new word is explained." },
  { value: "step-by-step", label: "Step-by-step", desc: "Every line of code explained", icon: ListOrdered, color: "sky", long: "Breaks code down line by line: what each line does and why it is there." },
  { value: "debugging", label: "Debugging", desc: "Analyse code and real error messages", icon: Bug, color: "coral", long: "Reads your code and R's real error, then explains what went wrong and how to fix it." },
  { value: "practice", label: "Practice", desc: "Exercises at your level", icon: Dumbbell, color: "tangerine", long: "Invents exercises that match your level, then checks your attempt by running it." },
  { value: "quiz", label: "Quiz", desc: "Questions with explanations", icon: MessageCircleQuestion, color: "grape", long: "One question at a time, keeps score, and explains every answer – right or wrong." },
  { value: "statistics", label: "Statistics", desc: "Statistical ideas with R examples", icon: Calculator, color: "teal", long: "The idea in plain words first, then how to do it in R and how to read the result." },
];

const SUGGESTIONS: Record<TutorMode, string[]> = {
  beginner: ["What is a variable in R?", "What is the difference between a vector and a list?", "Why does R use <- instead of =?", "What does [1] mean in the output?"],
  "step-by-step": ["Explain this line by line: students |> filter(math > 80) |> nrow()", "How does a for loop work, step by step?", "Walk me through writing a function that converts °C to °F"],
  debugging: ["Why do I get \"object not found\"?", "What does \"non-numeric argument to binary operator\" mean?", "My if statement says \"the condition has length > 1\""],
  practice: ["Give me an easy exercise about vectors", "Give me a medium exercise using data/students.csv", "Give me a challenge with dplyr"],
  quiz: ["Quiz me on data types", "Quiz me on data frames", "Quiz me on ggplot2 basics"],
  statistics: ["What is a standard deviation, intuitively?", "How do I read a p-value?", "When should I use a t-test?", "What does R-squared tell me?"],
};

/** CSS variables for an accent colour (used by chips and tiles: bg-[var(--a)] etc.). */
export function accentVars(color: string): CSSProperties {
  return { "--a": `var(--${color})`, "--a-soft": `var(--${color}-soft)`, "--a-shadow": `var(--${color}-shadow)` } as CSSProperties;
}
/** Text colour that reads well on a solid accent background. */
export const onAccent = (color: string) => (color === "sun" ? "text-[#3b2600]" : "text-white");

function messageText(m: ChatMessage): string {
  if (typeof m.content === "string") return m.content;
  return m.content
    .filter((b) => b.type === "text")
    .map((b) => String(b.text ?? ""))
    .join("\n\n");
}

const STATUS_LABEL: Record<string, string> = {
  ok: "Ran fine",
  error: "R error",
  parse_error: "Syntax error",
  timeout: "Timed out",
  interrupted: "Stopped",
  invalid: "Unreadable code",
  crashed: "R crashed",
  package_error: "Package problem",
};

/** "Hexy ran R code" – the code the tutor ran, with R's real output and plots. */
function ToolRunCard({ run }: { run: ToolRun }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ok = run.status === "ok";
  return (
    <div className="not-prose my-3 overflow-hidden rounded-2xl border-2 border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-surface-2"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-[0_2px_0_var(--primary-shadow)]" aria-hidden>
          <Terminal className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[13px] font-semibold leading-tight">Hexy ran R code</span>
          <span className="block truncate text-xs text-muted-foreground">{run.purpose || (open ? "Hide the code and output" : "Show the code and R's real output")}</span>
        </span>
        <Badge variant={ok ? "success" : "danger"} className="shrink-0">
          {ok && <Check />}
          {STATUS_LABEL[run.status] ?? run.status}
        </Badge>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div id={id} className="border-t-2 border-border">
          <StaticCode code={run.code} />
          <div className="border-t-2 border-border bg-console">
            <p className="px-4 pt-2 font-display text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Real output from R</p>
            <pre className="code-static max-h-60 overflow-auto whitespace-pre-wrap px-4 pb-3 pt-1 text-xs scrollbar-thin">{run.output || "(no output)"}</pre>
          </div>
        </div>
      )}
      {run.images.length > 0 && (
        <div className="border-t-2 border-border [&_img]:max-h-80 [&_img]:object-contain">
          <PlotGallery images={run.images} />
        </div>
      )}
    </div>
  );
}

/** The learner's message. Quick-action prompts show as a chip; long messages fold. */
function UserBubble({ text, compact }: { text: string; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const match = matchAction(text);
  const body = match?.rest ?? text;
  const long = body.length > 360 || body.split("\n").length > 9;
  const folded = long && !expanded;
  const Icon = match?.action.icon;
  return (
    <div className="flex justify-end animate-fade-up">
      <div className={cn("min-w-0 rounded-3xl rounded-tr-lg border-2 border-primary/25 bg-primary-soft px-4 py-2.5", compact ? "max-w-[92%] text-sm" : "max-w-[85%] text-[15px]")}>
        <span className="sr-only">You said: </span>
        {match && Icon && (
          <span className={cn("mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-[var(--a)] px-2.5 py-0.5 font-display text-xs font-semibold", onAccent(match.action.color))} style={accentVars(match.action.color)}>
            <Icon className="size-3.5" aria-hidden /> {match.action.label}
          </span>
        )}
        <div className={cn(folded && "max-h-40 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]")}>
          <Markdown runnableCode={false}>{body}</Markdown>
        </div>
        {long && (
          <button type="button" onClick={() => setExpanded((e) => !e)} className="mt-1 cursor-pointer font-display text-xs font-semibold text-primary-strong hover:underline dark:text-primary" aria-expanded={expanded}>
            {expanded ? "Show less" : "Show the full message"}
          </button>
        )}
      </div>
    </div>
  );
}

function HexyRow({ mood = "happy", continued, compact, children, label = true }: { mood?: HexyMood; continued?: boolean; compact?: boolean; children: ReactNode; label?: boolean }) {
  // Narrow layout: Hexy's name sits above a full-width bubble, so code blocks get room.
  if (compact && label)
    return (
      <div className={cn("animate-fade-up", continued && "-mt-2")}>
        {!continued && (
          <div className="mb-1.5 flex items-center gap-2">
            <HexyAvatar size={28} mood={mood} className="rounded-xl shadow-[0_2px_0_var(--border)]" />
            <p className="font-display text-xs font-semibold text-primary-strong dark:text-primary">Hexy</p>
          </div>
        )}
        {children}
      </div>
    );
  const size = compact ? 30 : 38;
  return (
    <div className={cn("flex items-start gap-2.5 animate-fade-up", continued && "-mt-2")}>
      {continued ? <span className="shrink-0" style={{ width: size }} aria-hidden /> : <HexyAvatar size={size} mood={mood} className="shadow-[0_2px_0_var(--border)]" />}
      <div className="min-w-0 flex-1">
        {!continued && label && <p className="mb-1 font-display text-xs font-semibold text-primary-strong dark:text-primary">Hexy</p>}
        {children}
      </div>
    </div>
  );
}

const bubble = (compact?: boolean) =>
  cn(
    "rounded-3xl rounded-tl-lg border-2 border-border bg-card shadow-[var(--shadow-card)]",
    // In narrow bubbles, tighten the Run / Copy / Playground buttons of code blocks so they fit.
    compact ? "px-3.5 py-2.5 text-sm [&_.not-prose_button]:px-2" : "px-4 py-3 text-[15px]",
  );

/** A row of chips. With `scroll`, it scrolls sideways and fades/arrows show that there is more. */
function ChipStrip({ scroll, label, children }: { scroll?: boolean; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const update = () => {
    const el = ref.current;
    if (el) setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  };
  useEffect(() => {
    const el = ref.current;
    if (!el || !scroll || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [scroll]);
  if (!scroll)
    return (
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5 px-3 pt-2.5">
        {children}
      </div>
    );
  const fade = (l: boolean, r: boolean) => `linear-gradient(to right, ${l ? "transparent, black 36px" : "black"}, ${r ? "black calc(100% - 44px), transparent" : "black"})`;
  const nudge = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  const arrow = "absolute top-1/2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-border bg-card text-muted-foreground shadow-[var(--shadow-card)] hover:text-foreground";
  return (
    <div className="relative">
      <div
        ref={ref}
        role="group"
        aria-label={label}
        onScroll={update}
        className="no-scrollbar flex gap-1.5 overflow-x-auto px-3 pb-1.5 pt-2.5"
        style={{ maskImage: fade(edges.left, edges.right), WebkitMaskImage: fade(edges.left, edges.right) }}
      >
        {children}
      </div>
      {edges.left && (
        <button type="button" tabIndex={-1} aria-hidden onClick={() => nudge(-1)} className={cn(arrow, "left-1 mt-0.5")}>
          <ChevronLeft className="size-4" />
        </button>
      )}
      {edges.right && (
        <button type="button" tabIndex={-1} aria-hidden onClick={() => nudge(1)} className={cn(arrow, "right-1 mt-0.5")}>
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  );
}

/** Friendly notice shown when the server has no AI key. */
function NotConfigured({ compact }: { compact?: boolean }) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border-2 border-sun/60 bg-sun-soft p-4 text-sm animate-pop-in">
      <div className="flex items-center gap-3">
        <Hexy mood="sleep" size={compact ? 56 : 72} className="shrink-0" />
        <div>
          <p className="font-display text-lg font-semibold leading-tight">Hexy is napping 💤</p>
          <p className="mt-0.5 font-semibold text-muted-foreground">The AI tutor isn&apos;t switched on for this copy of R Academy yet.</p>
        </div>
      </div>
      <p className="mt-3 font-bold">To wake Hexy up, the site owner needs to:</p>
      <ol className="mt-2 space-y-2">
        {[
          <>Get an API key from the Anthropic Console.</>,
          <>
            Add it to the server&apos;s environment as <code className="rounded bg-surface px-1 font-mono text-[12px]">ANTHROPIC_API_KEY</code> – for example in <code className="rounded bg-surface px-1 font-mono text-[12px]">.env.local</code> (see <code className="rounded bg-surface px-1 font-mono text-[12px]">.env.example</code>).
          </>,
          <>Restart the server.</>,
        ].map((step, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-sun font-display text-xs font-bold text-[#3b2600]" aria-hidden>
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-muted-foreground">
        Everything else works without it: lessons, exercises, running R in your browser and the <Link href="/error-checker" className="font-bold text-primary underline underline-offset-2">Error Detective</Link>&apos;s rule-based analysis. The key stays on the server – it is never sent to your browser.
      </p>
    </div>
  );
}

export interface TutorChatProps {
  lessonId?: string;
  lessonTitle?: string;
  exerciseId?: string;
  /** Returns the learner's current code and console output, if there is an editor nearby. */
  getCode?: () => { code: string; output: string | null } | null;
  compact?: boolean;
  className?: string;
  /** Text to put in the message box when the chat opens (e.g. from a /tutor?q=… link). */
  initialText?: string;
}

export function TutorChat({ lessonId, lessonTitle, exerciseId, getCode, compact, className, initialText }: TutorChatProps) {
  const t = useTutor();
  const settings = useSettings();
  const [text, setText] = useState(initialText ?? "");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [hasCode, setHasCode] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [quizNudge, setQuizNudge] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [showJump, setShowJump] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stick = useRef(true);
  const programmatic = useRef(0);
  const getCodeRef = useRef(getCode);
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  // Narrow containers (side drawers, phones) get the compact layout automatically.
  const [narrow, setNarrow] = useState(false);
  const dense = compact || narrow;
  const mode = MODES.find((m) => m.value === settings.tutorMode) ?? MODES[0];
  const ctx = { lessonId, exerciseId, mode: settings.tutorMode };

  useLayoutEffect(() => {
    getCodeRef.current = getCode;
  });

  useEffect(() => {
    aiStatus().then((s) => setConfigured(s.configured));
  }, []);
  useEffect(() => {
    if (!initialText) return;
    const el = inputRef.current;
    el?.focus({ preventScroll: true });
    el?.setSelectionRange(el.value.length, el.value.length);
  }, [initialText]);
  useEffect(() => {
    if (configured) {
      const q = tutor.takeQueued();
      if (q) void tutor.send(q, ctx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || compact || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 560));
    ro.observe(el);
    return () => ro.disconnect();
  }, [compact]);

  // The editor next to the chat changes without re-rendering us: check now and then whether it has code.
  useEffect(() => {
    const tick = () => setHasCode(Boolean(getCodeRef.current?.()?.code.trim()));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  // Keep the newest message in view – unless the learner scrolled up to read.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (stick.current) {
      programmatic.current = Date.now();
      el.scrollTo({ top: el.scrollHeight, behavior: t.streaming ? "auto" : "smooth" });
    } else if (t.messages.length || t.streaming) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowJump(true);
    }
  }, [t.messages.length, t.streaming, t.activity, t.error, t.busy]);

  const onScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
    if (near) {
      stick.current = true;
      setShowJump(false);
    } else if (Date.now() - programmatic.current > 600) stick.current = false;
  };
  const jumpToLatest = () => {
    stick.current = true;
    setShowJump(false);
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  };

  // Grow the message box with its content.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight + 4, dense ? 140 : 200)}px`;
  }, [text, dense]);

  const disabled = configured === false;

  const send = (msg: string) => {
    if (!msg.trim() || t.busy || disabled) return false;
    stick.current = true;
    setShowJump(false);
    setNotice(null);
    void tutor.send(msg, ctx);
    return true;
  };
  const submit = () => {
    if (send(text)) setText("");
  };

  const lastAnswer = (() => {
    for (let i = t.messages.length - 1; i >= 0; i--) {
      const m = t.messages[i];
      if (m.role === "assistant") {
        const s = messageText(m).trim();
        if (s) return s;
      }
    }
    return null;
  })();
  const avail: Availability = { hasCode, hasLesson: Boolean(lessonId), hasExercise: Boolean(exerciseId), hasAnswer: Boolean(lastAnswer), hasConversation: t.messages.length > 0 };
  const actions: QuickAction[] = [...QUICK_ACTIONS, ...(lessonId ? [LESSON_ACTION] : []), ...(getCode ? [SEND_CODE_ACTION] : [])];
  const blockedReason = (a: QuickAction) => (disabled ? "The AI tutor isn't switched on for this site." : t.busy ? "Hexy is still answering – wait a moment or press Stop." : a.unavailable(avail));

  const runAction = (a: QuickAction) => {
    const why = blockedReason(a);
    if (why) {
      setNotice(why);
      return;
    }
    const qc: QuickContext = { code: getCode?.() ?? null, lessonId, lessonTitle, exerciseId, lastAnswer, hasConversation: t.messages.length > 0 };
    if ((a.id === "explain" || a.id === "mistake" || a.id === "send") && !qc.code?.code.trim()) {
      setHasCode(false);
      setNotice("Write some code in the editor first.");
      return;
    }
    if (send(a.prompt(qc)) && a.id === "quiz" && settings.tutorMode !== "quiz") setQuizNudge(true);
  };

  const onModeKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = MODES.findIndex((m) => m.value === settings.tutorMode);
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % MODES.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + MODES.length) % MODES.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = MODES.length - 1;
    if (n < 0) return;
    e.preventDefault();
    updateSettings({ tutorMode: MODES[n].value });
    const btn = e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]")[n];
    btn?.focus();
  };

  const headerMood: HexyMood = configured === false ? "sleep" : t.busy ? "think" : t.error ? "oops" : "happy";
  const status = configured === null ? "Waking up…" : configured === false ? "Napping – the AI tutor isn't switched on" : t.busy ? (t.activity ?? "Thinking…") : `${mode.label} mode · ${mode.desc.toLowerCase()}`;

  // Messages, grouped: Hexy's follow-up turns (after running code) join the previous bubble group.
  const rows: ReactNode[] = [];
  let prev: "user" | "assistant" | null = null;
  t.messages.forEach((m, i) => {
    if (m.role === "user" && Array.isArray(m.content)) return; // tool results – shown as "Hexy ran R code" cards
    if (m.role === "user") {
      prev = "user";
      rows.push(<UserBubble key={i} text={messageText(m)} compact={dense} />);
      return;
    }
    const blocks = Array.isArray(m.content) ? m.content : [{ type: "text", text: m.content }];
    const parts = blocks
      .map((b, j) =>
        b.type === "text" && String(b.text ?? "").trim() ? (
          <Markdown key={j} workspace="tutor-examples">
            {String(b.text)}
          </Markdown>
        ) : b.type === "tool_use" && t.toolRuns[String(b.id)] ? (
          <ToolRunCard key={j} run={t.toolRuns[String(b.id)]} />
        ) : null,
      )
      .filter(Boolean);
    if (!parts.length) return;
    const continued = prev === "assistant";
    prev = "assistant";
    rows.push(
      <HexyRow key={i} continued={continued} compact={dense}>
        <div className={bubble(dense)}>
          <span className="sr-only">Hexy said: </span>
          {parts}
        </div>
      </HexyRow>,
    );
  });

  const empty = rows.length === 0;

  return (
    <div ref={rootRef} className={cn("flex h-full min-h-0 flex-1 flex-col bg-card", className)}>
      {/* Header: who you're talking to, and the mode */}
      <div className="border-b-2 border-border bg-gradient-to-r from-primary-soft via-card to-card">
        <div className="flex items-center gap-2.5 px-3 pb-2 pt-2.5">
          <span className="relative shrink-0">
            <HexyAvatar size={dense ? 38 : 44} mood={headerMood} className="bg-card shadow-[0_2px_0_var(--border)]" />
            <span
              className={cn("absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-card", configured ? "bg-mint" : configured === false ? "bg-border-strong" : "bg-sun")}
              aria-hidden
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold leading-tight">
              Hexy <span className="text-xs font-medium text-muted-foreground">· your R tutor</span>
            </p>
            <p className="truncate text-xs font-semibold text-muted-foreground" title={status}>
              {status}
            </p>
          </div>
          {confirmClear ? (
            <div className="flex shrink-0 items-center gap-1 animate-pop-in">
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  tutor.clear();
                  setConfirmClear(false);
                  setQuizNudge(false);
                  setNotice(null);
                }}
              >
                <Trash2 /> Clear
              </Button>
              <Button size="icon-sm" variant="ghost" onClick={() => setConfirmClear(false)} aria-label="Keep the conversation">
                <X />
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" className="shrink-0" onClick={() => setConfirmClear(true)} disabled={!t.messages.length} aria-label="Clear conversation" title="Clear conversation">
              <Trash2 /> {!dense && <span>New chat</span>}
            </Button>
          )}
        </div>
        <div className="px-3 pb-2.5">
          <div role="radiogroup" aria-label="How Hexy helps you (tutor mode)" onKeyDown={onModeKey} className={cn("flex gap-1.5", dense ? "items-center" : "flex-wrap")}>
            {MODES.map((m) => {
              const on = m.value === settings.tutorMode;
              const Icon = m.icon;
              const iconOnly = dense && !on;
              return (
                <button
                  key={m.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={`${m.label} mode: ${m.desc}`}
                  title={`${m.label}: ${m.desc}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => updateSettings({ tutorMode: m.value })}
                  style={accentVars(m.color)}
                  className={cn(
                    "press flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border-2 font-display text-[13px] font-semibold",
                    iconOnly ? "w-9 px-0" : "px-3",
                    on ? "border-transparent bg-[var(--a)] text-white [--press-shadow:var(--a-shadow)]" : "border-border bg-surface text-foreground [--press-shadow:var(--border)] hover:border-[var(--a)] hover:bg-[var(--a-soft)]",
                  )}
                >
                  <Icon className={cn("size-4", !on && "text-[var(--a)]")} aria-hidden />
                  {!iconOnly && <span>{m.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={listRef}
          onScroll={onScroll}
          className={cn("h-full space-y-4 overflow-y-auto scrollbar-thin", dense ? "p-3" : "p-4")}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Conversation with Hexy, the AI tutor"
          tabIndex={0}
        >
          {configured === false && <NotConfigured compact={dense} />}

          {empty && configured !== false && (
            <div className="flex flex-col items-center pt-2 text-center">
              <Hexy mood="wave" size={dense ? 78 : 104} animate />
              <div className={cn("relative mt-2 max-w-md", bubble(dense), "rounded-3xl")}>
                <span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-border bg-card" aria-hidden />
                <p className="relative font-semibold">
                  Hi, I&apos;m <strong className="text-primary-strong dark:text-primary">Hexy</strong> – your R learning buddy! 👋{" "}
                  {lessonTitle ? (
                    <>
                      I can see you&apos;re studying <strong>{lessonTitle}</strong>.{" "}
                    </>
                  ) : exerciseId ? (
                    <>I can see the exercise you&apos;re working on. </>
                  ) : null}
                  Ask me anything about R, your code or statistics. When I show you what code does, I run it in your browser first – so the output is real.
                </p>
              </div>
              <p className="mt-4 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">Try asking</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS[settings.tutorMode].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    disabled={!configured || t.busy}
                    className="press cursor-pointer rounded-2xl border-2 border-border bg-surface px-3 py-1.5 text-left text-[13px] font-semibold [--press-shadow:var(--border)] hover:border-primary hover:bg-primary-soft disabled:cursor-default disabled:opacity-60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {rows}

          {t.busy && (
            <div aria-hidden>
              <HexyRow mood="think" compact={dense} label={false}>
                {t.streaming ? (
                  <div className={bubble(dense)}>
                    <Markdown runnableCode={false}>{t.streaming}</Markdown>
                  </div>
                ) : null}
                <div className={cn("inline-flex items-center gap-2 rounded-full border-2 border-border bg-surface px-3 py-1.5 text-xs font-bold text-muted-foreground", t.streaming && "mt-2")}>
                  <span className="flex gap-1">
                    <span className="typing-dot size-1.5 rounded-full bg-primary" />
                    <span className="typing-dot size-1.5 rounded-full bg-primary" />
                    <span className="typing-dot size-1.5 rounded-full bg-primary" />
                  </span>
                  {t.activity ?? (t.streaming ? "Hexy is typing…" : "Hexy is thinking…")}
                </div>
              </HexyRow>
            </div>
          )}

          {t.error && (
            <div role="alert">
              <HexyRow mood="oops" compact={dense} label={false}>
                <div className={cn(bubble(dense), "border-coral/40 bg-coral-soft")}>
                  <p className="font-display font-semibold text-danger">Oops – that didn&apos;t work</p>
                  <p className="mt-0.5">{t.error}</p>
                  {(t.retryText || t.messages.length >= 60) && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {t.retryText && (
                        <Button size="sm" variant="danger" onClick={() => send(t.retryText!)}>
                          <RotateCcw /> Try again
                        </Button>
                      )}
                      {t.messages.length >= 60 && (
                        <Button size="sm" variant="outline" onClick={() => tutor.clear()}>
                          <Trash2 /> Start a new chat
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </HexyRow>
            </div>
          )}
        </div>
        <p className="sr-only" role="status">
          {t.busy ? (t.activity ?? "Hexy is thinking…") : ""}
        </p>
        {showJump && (
          <button
            type="button"
            onClick={jumpToLatest}
            className="press absolute bottom-3 left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 font-display text-xs font-semibold text-white [--press-shadow:var(--primary-shadow)] animate-pop-in"
          >
            <ArrowDown className="size-3.5" aria-hidden /> Jump to the latest
          </button>
        )}
      </div>

      {/* Quick actions + message box */}
      <div className="border-t-2 border-border bg-surface/70">
        {quizNudge && settings.tutorMode !== "quiz" && (
          <div className="mx-3 mt-2.5 flex items-center gap-2 rounded-2xl border-2 border-grape/40 bg-grape-soft px-3 py-2 text-xs font-semibold animate-pop-in">
            <MessageCircleQuestion className="size-4 shrink-0 text-grape" aria-hidden />
            <span className="min-w-0 flex-1">Want a whole quiz with a score? Switch to Quiz mode.</span>
            <Button
              size="sm"
              variant="grape"
              className="h-7 rounded-lg px-2.5 text-xs"
              onClick={() => {
                updateSettings({ tutorMode: "quiz" });
                setQuizNudge(false);
              }}
            >
              Switch
            </Button>
            <button type="button" onClick={() => setQuizNudge(false)} className="grid size-6 cursor-pointer place-items-center rounded-md text-muted-foreground hover:bg-surface-2" aria-label="Dismiss">
              <X className="size-3.5" />
            </button>
          </div>
        )}
        <ChipStrip scroll={dense} label="Quick help from Hexy">
          {actions.map((a) => {
            const why = blockedReason(a);
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                type="button"
                aria-disabled={why ? true : undefined}
                title={why ?? undefined}
                onClick={() => runAction(a)}
                style={accentVars(a.color)}
                className={cn(
                  "press flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-2 border-border bg-surface pl-1 pr-3 font-display text-[13px] font-semibold [--press-shadow:var(--border)]",
                  why ? "cursor-not-allowed opacity-50" : "hover:border-[var(--a)] hover:bg-[var(--a-soft)]",
                )}
              >
                <span className={cn("grid size-6 place-items-center rounded-full bg-[var(--a)]", onAccent(a.color))} aria-hidden>
                  <Icon className="size-3.5" />
                </span>
                {a.label}
              </button>
            );
          })}
        </ChipStrip>
        <p className="min-h-0 px-3 text-xs font-semibold text-muted-foreground" aria-live="polite">
          {notice && <span className="mt-1.5 block animate-fade-up">💡 {notice}</span>}
        </p>
        <form
          className="relative p-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label htmlFor={`${uid}-input`} className="sr-only">
            Message Hexy
          </label>
          <div className="relative">
            <textarea
              id={`${uid}-input`}
              ref={inputRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (notice) setNotice(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              disabled={disabled}
              placeholder={disabled ? "Hexy isn't available on this server." : "Ask Hexy anything about R…"}
              className="block min-h-[52px] w-full resize-none rounded-2xl border-2 border-border bg-card py-3 pl-4 pr-14 text-[15px] font-semibold leading-snug shadow-[inset_0_2px_0_var(--surface-2)] placeholder:font-medium placeholder:text-muted-foreground focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-60 scrollbar-thin"
            />
            <div className="absolute bottom-[7px] right-[7px]">
              {t.busy ? (
                <Button type="button" size="icon-sm" variant="danger" onClick={() => tutor.stop()} aria-label="Stop the answer" title="Stop">
                  <Square className="fill-current" />
                </Button>
              ) : (
                <Button type="submit" size="icon-sm" disabled={disabled || !text.trim()} aria-label="Send message">
                  <SendHorizontal />
                </Button>
              )}
            </div>
          </div>
          {!dense && (
            <p className="mt-2 text-xs text-muted-foreground">
              <kbd className="rounded border border-border bg-surface px-1 font-mono text-[11px]">Enter</kbd> to send ·{" "}
              <kbd className="rounded border border-border bg-surface px-1 font-mono text-[11px]">Shift</kbd>+<kbd className="rounded border border-border bg-surface px-1 font-mono text-[11px]">Enter</kbd> for a new line. Hexy can make mistakes – code output is real because it runs in your browser. Your chat stays in this browser.{" "}
              <Link href="/settings" className="font-bold text-primary underline underline-offset-2">
                Settings
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
