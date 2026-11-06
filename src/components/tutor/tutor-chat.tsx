"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Code2, Lightbulb, Loader2, Send, Sparkles, Square, Trash2, User, BookOpen, AlertTriangle, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Markdown } from "@/components/content/markdown";
import { StaticCode } from "@/components/code/static-code";
import { PlotGallery } from "@/components/code/output-panels";
import { aiStatus, codeMessage, tutor, useTutor, type ChatMessage, type ToolRun } from "@/lib/ai/tutor-store";
import { updateSettings, useSettings, type TutorMode } from "@/lib/store/settings";
import { cn } from "@/lib/utils";

export const MODES: { value: TutorMode; label: string; desc: string }[] = [
  { value: "beginner", label: "Beginner", desc: "Simple words, analogies and small examples" },
  { value: "step-by-step", label: "Step-by-step", desc: "Every line of code explained" },
  { value: "debugging", label: "Debugging", desc: "Analyse code and real error messages" },
  { value: "practice", label: "Practice", desc: "Exercises at your level" },
  { value: "quiz", label: "Quiz", desc: "Questions with explanations" },
  { value: "statistics", label: "Statistics", desc: "Statistical ideas with R examples" },
];

const SUGGESTIONS: Record<TutorMode, string[]> = {
  beginner: ["What is a variable in R?", "What is the difference between a vector and a list?", "Why does R use <- instead of =?", "What does [1] mean in the output?"],
  "step-by-step": ["Explain this line by line: students |> filter(math > 80) |> nrow()", "How does a for loop work, step by step?", "Walk me through writing a function that converts °C to °F"],
  debugging: ["Why do I get \"object not found\"?", "What does \"non-numeric argument to binary operator\" mean?", "My if statement says \"the condition has length > 1\""],
  practice: ["Give me an easy exercise about vectors", "Give me a medium exercise using data/students.csv", "Give me a challenge with dplyr"],
  quiz: ["Quiz me on data types", "Quiz me on data frames", "Quiz me on ggplot2 basics"],
  statistics: ["What is a standard deviation, intuitively?", "How do I read a p-value?", "When should I use a t-test?", "What does R-squared tell me?"],
};

function messageText(m: ChatMessage): string {
  if (typeof m.content === "string") return m.content;
  return m.content
    .filter((b) => b.type === "text")
    .map((b) => String(b.text ?? ""))
    .join("\n\n");
}

function ToolRunView({ run }: { run: ToolRun }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-2 overflow-hidden rounded-lg border border-border bg-surface text-sm">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-muted-foreground cursor-pointer" aria-expanded={open}>
        {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        <Code2 className="size-3.5" /> The tutor ran R code {run.purpose ? `– ${run.purpose}` : ""}
        <span className={cn("ml-auto", run.status === "ok" ? "text-success" : "text-danger")}>{run.status === "ok" ? "ran successfully" : run.status}</span>
      </button>
      {open && (
        <div className="border-t border-border">
          <StaticCode code={run.code} />
          <pre className="code-static max-h-60 overflow-auto border-t border-border bg-console px-4 py-2 text-xs whitespace-pre-wrap">{run.output || "(no output)"}</pre>
        </div>
      )}
      {run.images.length > 0 && <PlotGallery images={run.images} />}
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
}

export function TutorChat({ lessonId, lessonTitle, exerciseId, getCode, compact, className }: TutorChatProps) {
  const t = useTutor();
  const settings = useSettings();
  const [text, setText] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ctx = { lessonId, exerciseId, mode: settings.tutorMode };

  useEffect(() => {
    aiStatus().then((s) => setConfigured(s.configured));
  }, []);
  useEffect(() => {
    if (configured) {
      const q = tutor.takeQueued();
      if (q) void tutor.send(q, ctx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [t.messages.length, t.streaming, t.activity]);

  const send = (msg: string) => {
    if (!msg.trim() || t.busy) return;
    setText("");
    void tutor.send(msg, ctx);
  };

  const visible = t.messages.filter((m) => !(m.role === "user" && Array.isArray(m.content)));
  const disabled = configured === false;

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <Sparkles className="size-4 text-primary" aria-hidden />
        <label htmlFor="tutor-mode" className="sr-only">
          Tutor mode
        </label>
        <Select id="tutor-mode" value={settings.tutorMode} onChange={(e) => updateSettings({ tutorMode: e.target.value as TutorMode })} className="h-8 text-xs">
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label} mode
            </option>
          ))}
        </Select>
        <span className="hidden text-xs text-muted-foreground xl:inline">{MODES.find((m) => m.value === settings.tutorMode)?.desc}</span>
        <Button size="sm" variant="ghost" className="ml-auto" onClick={() => tutor.clear()} disabled={!t.messages.length} aria-label="Clear conversation">
          <Trash2 /> {compact ? "" : "Clear"}
        </Button>
      </div>

      <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 scrollbar-thin" aria-live="polite" aria-label="Conversation with the AI tutor">
        {configured === false && (
          <div className="rounded-lg border border-warning/40 bg-warning-soft p-3 text-sm">
            <p className="flex items-center gap-2 font-semibold text-warning">
              <AlertTriangle className="size-4" /> The AI tutor is not configured on this server
            </p>
            <p className="mt-1 text-muted-foreground">
              To switch it on, the site owner sets <code className="font-mono">ANTHROPIC_API_KEY</code> in the server environment (see <code className="font-mono">.env.example</code>). Everything else – lessons, running R, the Error Checker&apos;s rule-based analysis – works without it.
            </p>
          </div>
        )}
        {visible.length === 0 && configured !== false && (
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 rounded-lg bg-primary-soft/60 p-3">
              <Bot className="mt-0.5 size-5 shrink-0 text-primary" />
              <p>
                Hi! I&apos;m your R tutor{lessonTitle ? <> – I can see you&apos;re studying <strong>{lessonTitle}</strong></> : ""}. Ask me anything about R, your code or statistics. When I show you what code does, I run it in your browser first so the output is real.
              </p>
            </div>
            <p className="text-xs font-medium text-muted-foreground">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS[settings.tutorMode].map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-card px-3 py-1.5 text-left text-xs hover:border-primary hover:bg-primary-soft cursor-pointer">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {t.messages.map((m, i) => {
          if (m.role === "user" && Array.isArray(m.content)) return null;
          if (m.role === "user")
            return (
              <div key={i} className="flex justify-end gap-2">
                <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-accent-soft px-3.5 py-2.5 text-sm">
                  <Markdown runnableCode={false}>{messageText(m)}</Markdown>
                </div>
                <User className="mt-1 size-5 shrink-0 text-muted-foreground" aria-label="You" />
              </div>
            );
          const blocks = Array.isArray(m.content) ? m.content : [{ type: "text", text: m.content }];
          return (
            <div key={i} className="flex gap-2">
              <Bot className="mt-1 size-5 shrink-0 text-primary" aria-label="Tutor" />
              <div className="min-w-0 flex-1 text-sm">
                {blocks.map((b, j) =>
                  b.type === "text" && String(b.text).trim() ? (
                    <Markdown key={j} workspace="tutor-examples">{String(b.text)}</Markdown>
                  ) : b.type === "tool_use" && t.toolRuns[String(b.id)] ? (
                    <ToolRunView key={j} run={t.toolRuns[String(b.id)]} />
                  ) : null,
                )}
              </div>
            </div>
          );
        })}
        {t.busy && (
          <div className="flex gap-2">
            <Bot className="mt-1 size-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1 text-sm">
              {t.streaming ? <Markdown runnableCode={false}>{t.streaming}</Markdown> : null}
              <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" /> {t.activity ?? "Thinking…"}
              </p>
            </div>
          </div>
        )}
        {t.error && (
          <div role="alert" className="rounded-lg border border-danger/40 bg-danger-soft p-3 text-sm text-danger">
            {t.error}
            {t.retryText && (
              <Button size="sm" variant="outline" className="ml-2" onClick={() => send(t.retryText!)}>
                <RotateCcw /> Try again
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {getCode && (
            <Button
              size="sm"
              variant="outline"
              disabled={disabled || t.busy}
              onClick={() => {
                const c = getCode();
                if (c?.code.trim()) send(codeMessage(c.code, c.output));
              }}
            >
              <Code2 /> Send my code to AI
            </Button>
          )}
          {lessonId && (
            <Button size="sm" variant="outline" disabled={disabled || t.busy} onClick={() => send(`Please explain the main ideas of this lesson ("${lessonTitle ?? lessonId}") in simple words, with one small example.`)}>
              <BookOpen /> Explain this lesson
            </Button>
          )}
          {(lessonId || exerciseId) && (
            <Button
              size="sm"
              variant="outline"
              disabled={disabled || t.busy}
              onClick={() => {
                const c = getCode?.();
                send(
                  exerciseId
                    ? `I'm stuck on this exercise. Please give me a small hint – not the solution.${c?.code ? `\n\nMy attempt so far:\n\`\`\`r\n${c.code}\n\`\`\`` : ""}`
                    : `Can you give me a hint to help me understand this lesson better, without giving away the answers?${c?.code ? `\n\nMy code:\n\`\`\`r\n${c.code}\n\`\`\`` : ""}`,
                );
              }}
            >
              <Lightbulb /> Ask for a hint
            </Button>
          )}
        </div>
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
          }}
        >
          <label htmlFor={`tutor-input-${compact ? "c" : "f"}`} className="sr-only">
            Message the AI tutor
          </label>
          <textarea
            id={`tutor-input-${compact ? "c" : "f"}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(text);
              }
            }}
            rows={compact ? 2 : 3}
            disabled={disabled}
            placeholder={disabled ? "The AI tutor is not available on this server." : "Ask a question… (Enter to send, Shift+Enter for a new line)"}
            className="min-h-10 flex-1 resize-y rounded-lg border border-border bg-card px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-60"
          />
          {t.busy ? (
            <Button type="button" variant="outline" onClick={() => tutor.stop()} aria-label="Stop the answer">
              <Square />
            </Button>
          ) : (
            <Button type="submit" disabled={disabled || !text.trim()} aria-label="Send message">
              <Send />
            </Button>
          )}
        </form>
        {!compact && (
          <p className="mt-2 text-xs text-muted-foreground">
            The tutor can make mistakes. Code it shows is checked by running it in your browser. Your conversation is stored only in this browser. <Link href="/settings" className="underline">Settings</Link>
          </p>
        )}
      </div>
    </div>
  );
}
