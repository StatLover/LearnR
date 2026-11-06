"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, Code2, Lightbulb, Lock, PlayCircle, Send, Bug } from "lucide-react";
import { TutorChat, MODES, accentVars, onAccent } from "./tutor-chat";
import { QUICK_ACTIONS, SEND_CODE_ACTION, type QuickAction } from "./quick-actions";
import { CodeRunner, type CodeRunnerHandle } from "@/components/code/code-runner";
import { Button } from "@/components/ui/button";
import { Hexy } from "@/components/brand/mascot";
import { FloatingHexes } from "@/components/brand/decor";
import { aiStatus, tutor, useTutor } from "@/lib/ai/tutor-store";
import { updateSettings, useSettings } from "@/lib/store/settings";
import type { RunResult } from "@/lib/r/console";
import { transcript } from "@/lib/r/console";
import { cn } from "@/lib/utils";

/** Big waving Hexy with a speech bubble, for the page hero. */
export function TutorHeroArt() {
  return (
    <div className="relative h-[200px] w-[280px]" aria-hidden>
      <FloatingHexes count={6} />
      <div className="absolute left-0 top-3 max-w-[150px] rounded-2xl border-2 border-border bg-card px-3 py-2 font-display text-sm font-semibold leading-snug shadow-[var(--shadow-card)] animate-pop-in">
        Ask me anything about R!
        <span className="absolute -bottom-2 right-6 size-3.5 rotate-45 border-b-2 border-r-2 border-border bg-card" />
      </div>
      <Hexy mood="wave" size={150} animate className="absolute bottom-0 right-2" />
    </div>
  );
}

/** Live status chip: is the AI tutor switched on for this server? */
export function TutorStatusChip({ className }: { className?: string }) {
  const [configured, setConfigured] = useState<boolean | null>(null);
  useEffect(() => {
    aiStatus().then((s) => setConfigured(s.configured));
  }, []);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 font-display text-sm font-semibold",
        configured ? "border-mint/50 bg-mint-soft text-success" : configured === false ? "border-sun/60 bg-sun-soft text-warning" : "border-border bg-surface text-muted-foreground",
        className,
      )}
      role="status"
    >
      <span className={cn("size-2.5 rounded-full", configured ? "bg-mint" : configured === false ? "bg-sun" : "bg-border-strong")} aria-hidden />
      {configured === null ? "Checking whether Hexy is awake…" : configured ? "Hexy is online and ready to help" : "Hexy is napping – the AI tutor isn't switched on for this site"}
    </span>
  );
}

const MODE_EXAMPLES: Record<string, string> = {
  beginner: "“What is a variable?”",
  "step-by-step": "“Walk me through this for loop”",
  debugging: "“Why do I get object not found?”",
  practice: "“Give me an easy exercise on vectors”",
  quiz: "“Quiz me on data frames”",
  statistics: "“What is a standard deviation?”",
};

const PROMISES = [
  { icon: PlayCircle, color: "mint", title: "Real output", text: "Hexy runs code in your browser before telling you what it prints." },
  { icon: Lightbulb, color: "sun", title: "Hints before answers", text: "Stuck? You get a nudge first – the full solution only when you ask." },
  { icon: Lock, color: "grape", title: "Private", text: "Your conversation is stored only in this browser." },
];

export function TutorPage() {
  const settings = useSettings();
  const t = useTutor();
  const runner = useRef<CodeRunnerHandle>(null);
  const chatBox = useRef<HTMLDivElement>(null);
  const [last, setLast] = useState<RunResult | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);

  useEffect(() => {
    aiStatus().then((s) => setConfigured(s.configured));
  }, []);

  // Links can open the tutor with a question: /tutor?q=<question> puts it in the message box,
  // /tutor?q=<question>&send=1 asks it straight away, and &mode=<mode> picks the tutor mode.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q")?.trim().slice(0, 4000);
    const mode = params.get("mode");
    if (!q && !mode) return;
    const m = MODES.find((x) => x.value === mode);
    if (m) updateSettings({ tutorMode: m.value });
    if (q) {
      if (params.get("send") === "1") tutor.queue(q);
      // The URL is only readable after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      else setDraft(q);
    }
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.hash);
  }, []);

  const getCode = () => {
    const code = runner.current?.getCode() ?? "";
    return code.trim() ? { code, output: last && last.code === code ? transcript(last.lines) : null } : null;
  };

  const lastAnswer = (() => {
    for (let i = t.messages.length - 1; i >= 0; i--) {
      const m = t.messages[i];
      if (m.role !== "assistant") continue;
      const s = typeof m.content === "string" ? m.content : m.content.filter((b) => b.type === "text").map((b) => String(b.text ?? "")).join("\n\n");
      if (s.trim()) return s;
    }
    return null;
  })();

  const sendFromScratchpad = (a: QuickAction) => {
    const code = getCode();
    if (!code) {
      setNote("Write some R code in the scratchpad first.");
      return;
    }
    if (t.busy) {
      setNote("Hexy is still answering – wait a moment or press Stop in the chat.");
      return;
    }
    setNote(null);
    void tutor.send(a.prompt({ code, lastAnswer, hasConversation: t.messages.length > 0 }), { mode: settings.tutorMode });
    // On small screens the chat is above the scratchpad – bring it into view.
    const box = chatBox.current;
    if (box && box.getBoundingClientRect().top < 0) box.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onModeKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = MODES.findIndex((m) => m.value === settings.tutorMode);
    const keys: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: MODES.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const n = (keys[e.key] + MODES.length) % MODES.length;
    updateSettings({ tutorMode: MODES[n].value });
    e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]")[n]?.focus();
  };

  const scratchActions = [SEND_CODE_ACTION, ...QUICK_ACTIONS.filter((a) => a.id === "explain" || a.id === "mistake")];
  const off = configured === false;

  return (
    <div className="space-y-10">
      {/* What Hexy can do */}
      <section aria-labelledby="modes-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Six ways to learn</p>
            <h2 id="modes-title" className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              What Hexy can do
            </h2>
            <p className="mt-1 max-w-2xl text-[15px] font-semibold text-muted-foreground">Pick a mode and Hexy changes how it teaches. You can switch at any time – in the chat too.</p>
          </div>
        </div>
        <div role="radiogroup" aria-labelledby="modes-title" onKeyDown={onModeKey} className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {MODES.map((m) => {
            const on = settings.tutorMode === m.value;
            const Icon = m.icon;
            return (
              <button
                key={m.value}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                onClick={() => updateSettings({ tutorMode: m.value })}
                style={accentVars(m.color)}
                className={cn(
                  "press group relative flex cursor-pointer flex-col items-start rounded-3xl border-2 p-4 text-left",
                  on ? "border-[var(--a)] bg-[var(--a-soft)] [--press-shadow:var(--a)]" : "border-border bg-card [--press-shadow:var(--border)] hover:border-[var(--a)]",
                )}
              >
                {on && (
                  <span className={cn("absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-[var(--a)] animate-pop-in", onAccent(m.color))} aria-hidden>
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                )}
                <span className={cn("grid size-11 place-items-center rounded-2xl bg-[var(--a)] shadow-[0_3px_0_var(--a-shadow)] transition-transform group-hover:-rotate-6", onAccent(m.color))} aria-hidden>
                  <Icon className="size-6" />
                </span>
                <span className="mt-3 font-display text-lg font-semibold leading-tight">{m.label}</span>
                <span className="mt-1 text-[13px] font-semibold leading-snug text-muted-foreground">{m.long}</span>
                <span className="mt-2 hidden text-xs font-semibold text-muted-foreground sm:block">
                  Try: <span className="text-foreground">{MODE_EXAMPLES[m.value]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Chat + scratchpad */}
      <section aria-labelledby="chat-title" className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <h2 id="chat-title" className="sr-only">
          Chat with Hexy
        </h2>
        <div ref={chatBox} className="flex h-[80svh] max-h-[880px] min-h-[560px] scroll-mt-20 flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
          <TutorChat key={draft ?? "chat"} getCode={getCode} initialText={draft ?? undefined} />
        </div>

        <aside aria-labelledby="scratch-title" className="min-w-0 space-y-4">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sky text-white shadow-[0_3px_0_var(--sky-shadow)]" aria-hidden>
              <Code2 className="size-6" />
            </span>
            <div>
              <h2 id="scratch-title" className="font-display text-xl font-semibold leading-tight">
                Your code scratchpad
              </h2>
              <p className="mt-0.5 text-sm font-semibold text-muted-foreground">Write or paste R code, press Run, then ask Hexy about it. Hexy sees your code together with R&apos;s real output.</p>
            </div>
          </div>
          <CodeRunner
            ref={runner}
            workspace="tutor-scratch"
            variant="panel"
            storageKey="tutor-scratch"
            title="Tutor scratchpad"
            initialCode={'# Paste or write R code here, then press Run\nscores <- c(72, 85, 90)\nmean(scores)\n'}
            onResult={setLast}
            downloadName="tutor-code.R"
          />
          <div className="rounded-3xl border-2 border-border bg-card p-4">
            <p className="font-display text-sm font-semibold">Ask Hexy about this code</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {scratchActions.map((a) => {
                const Icon = a.id === "send" ? Send : a.id === "mistake" ? Bug : a.icon;
                return (
                  <Button key={a.id} size="sm" variant={a.id === "mistake" ? "danger" : a.id === "explain" ? "accent" : "primary"} disabled={off || t.busy} onClick={() => sendFromScratchpad(a)}>
                    <Icon /> {a.label}
                  </Button>
                );
              })}
            </div>
            <p className="mt-2 min-h-4 text-xs font-semibold text-muted-foreground" aria-live="polite">
              {off ? "These buttons need the AI tutor, which isn't switched on for this site." : note ? `💡 ${note}` : last ? "Hexy will also see the output of your last run." : "Tip: press Run first so Hexy can see R's real output too."}
            </p>
          </div>
          <ul className="grid gap-2.5">
            {PROMISES.map((p) => (
              <li key={p.title} className="flex items-start gap-3 rounded-2xl border-2 border-border bg-surface px-3.5 py-3" style={accentVars(p.color)}>
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl bg-[var(--a)]", onAccent(p.color))} aria-hidden>
                  <p.icon className="size-4" />
                </span>
                <span className="text-sm">
                  <span className="block font-display font-semibold">{p.title}</span>
                  <span className="font-semibold text-muted-foreground">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
