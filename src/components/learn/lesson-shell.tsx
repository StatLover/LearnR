"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Code2,
  Lock,
  ListTree,
  Sparkles,
  X,
  Flag,
  NotebookPen,
  Download,
} from "lucide-react";
import { CodeRunner, type CodeRunnerHandle } from "@/components/code/code-runner";
import { TutorChat } from "@/components/tutor/tutor-chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress";
import { toast } from "@/components/ui/toast";
import { codeMessage, tutor } from "@/lib/ai/tutor-store";
import { isLessonUnlocked, moduleCompletion, progress, useProgress, type Outline } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import type { RunResult } from "@/lib/r/console";
import { transcript } from "@/lib/r/console";
import { cn, downloadText } from "@/lib/utils";

export interface LessonMeta {
  id: string;
  title: string;
  playground: string;
  moduleNumber: number;
  moduleTitle: string;
  minutes: number;
}

/* ---------------------------- navigation ---------------------------- */

export function LessonNav({ outline, currentId, onNavigate }: { outline: Outline; currentId?: string; onNavigate?: () => void }) {
  const state = useProgress();
  const settings = useSettings();
  const currentModule = outline.modules.find((m) => m.lessons.some((l) => l.id === currentId))?.number;
  const [open, setOpen] = useState<Record<number, boolean>>(() => (currentModule ? { [currentModule]: true } : { 1: true }));
  return (
    <nav aria-label="Course contents" className="space-y-1 text-sm">
      {outline.modules.map((m) => {
        const c = moduleCompletion(m, state);
        const isOpen = open[m.number];
        return (
          <div key={m.number}>
            <button
              onClick={() => setOpen((o) => ({ ...o, [m.number]: !o[m.number] }))}
              aria-expanded={isOpen}
              className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left hover:bg-surface-2 cursor-pointer"
            >
              {isOpen ? <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-muted-foreground">Module {m.number}</span>
                <span className="block font-semibold leading-snug">{m.title}</span>
                {m.lessons.length > 0 && <ProgressBar value={c.pct} className="mt-1.5 h-1" label={`Module ${m.number} progress`} />}
              </span>
            </button>
            {isOpen && (
              <ul className="mb-2 ml-4 space-y-0.5 border-l border-border pl-2">
                {m.lessons.map((l) => {
                  const done = Boolean(state.lessons[l.id]?.completedAt);
                  const unlocked = isLessonUnlocked(outline, state, l.id, settings.learningMode);
                  const current = l.id === currentId;
                  return (
                    <li key={l.id}>
                      <Link
                        href={`/learn/${l.id}`}
                        onClick={onNavigate}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "flex items-start gap-2 rounded-md px-2 py-1.5 leading-snug",
                          current ? "bg-primary-soft font-semibold text-primary-strong dark:text-primary" : "hover:bg-surface-2",
                          !unlocked && !current && "text-muted-foreground",
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-label="Completed" />
                        ) : !unlocked ? (
                          <Lock className="mt-0.5 size-3.5 shrink-0" aria-label="Locked" />
                        ) : (
                          <Circle className={cn("mt-0.5 size-4 shrink-0", current ? "text-primary" : "text-muted-foreground/60")} aria-label="Not completed" />
                        )}
                        <span>{l.title}</span>
                      </Link>
                    </li>
                  );
                })}
                {m.checkpointSize > 0 && (
                  <li>
                    <Link href={`/learn/module/${m.id}#checkpoint`} onClick={onNavigate} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-surface-2">
                      {state.checkpoints[String(m.number)]?.passedAt ? <CheckCircle2 className="size-4 text-success" /> : <Flag className="size-4" />}
                      Module checkpoint
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ---------------------------- notes & completion ---------------------------- */

export function LessonNotes({ lessonId, title }: { lessonId: string; title: string }) {
  const state = useProgress();
  const saved = state.notes[lessonId]?.text ?? "";
  const [text, setText] = useState(saved);
  const [lastSaved, setLastSaved] = useState(saved);
  const [status, setStatus] = useState<"saved" | "typing">("saved");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // When the stored note changes (another tab, sync, first load), show it.
  if (saved !== lastSaved) {
    setLastSaved(saved);
    if (status === "saved") setText(saved);
  }
  const change = (v: string) => {
    setText(v);
    setStatus("typing");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      progress.setNote(lessonId, v);
      setStatus("saved");
    }, 600);
  };
  return (
    <section aria-labelledby="notes-title" className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <NotebookPen className="size-4 text-primary" />
        <h2 id="notes-title" className="font-semibold">
          My notes
        </h2>
        <span className="ml-auto text-xs text-muted-foreground" aria-live="polite">
          {status === "typing" ? "Saving…" : saved ? "Saved" : ""}
        </span>
        {text && (
          <Button size="icon-sm" variant="ghost" aria-label="Download notes" onClick={() => downloadText(`${lessonId}-notes.md`, `# Notes: ${title}\n\n${text}\n`, "text/markdown")}>
            <Download />
          </Button>
        )}
      </div>
      <label htmlFor="lesson-notes" className="sr-only">
        Your notes for this lesson
      </label>
      <Textarea id="lesson-notes" rows={4} value={text} onChange={(e) => change(e.target.value)} placeholder="Write down what you learned, questions you have, or code you want to remember. Notes are saved automatically." />
    </section>
  );
}

export function CompleteButton({ lessonId, nextHref, nextTitle }: { lessonId: string; nextHref?: string; nextTitle?: string }) {
  const state = useProgress();
  const done = Boolean(state.lessons[lessonId]?.completedAt);
  const router = useRouter();
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-4">
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{done ? "Lesson completed 🎉" : "Finished this lesson?"}</p>
        <p className="text-sm text-muted-foreground">{done ? "Great work. Your progress is saved." : "Mark it complete to track your progress and unlock the next lesson."}</p>
      </div>
      <Button variant={done ? "outline" : "primary"} onClick={() => {
        progress.setLessonComplete(lessonId, !done);
        if (!done) toast("Lesson complete!", { description: nextTitle ? `Up next: ${nextTitle}` : "You've reached the end of the course content." });
      }}>
        <CheckCircle2 /> {done ? "Mark as not complete" : "Mark lesson complete"}
      </Button>
      {nextHref && (
        <Button
          variant={done ? "primary" : "outline"}
          onClick={() => {
            if (!done) progress.setLessonComplete(lessonId, true);
            router.push(nextHref);
          }}
        >
          Next lesson <ChevronRight />
        </Button>
      )}
    </div>
  );
}

export function BookmarkButton({ id, title, href, kind = "lesson" }: { id: string; title: string; href: string; kind?: "lesson" | "exercise" | "project" | "function" | "cheatsheet" }) {
  const state = useProgress();
  const on = state.bookmarks.some((b) => b.id === id);
  return (
    <Button variant="outline" size="sm" aria-pressed={on} onClick={() => progress.toggleBookmark({ id, kind, title, href })}>
      {on ? <BookmarkCheck className="text-primary" /> : <Bookmark />} {on ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}

/* ---------------------------- the three-panel shell ---------------------------- */

type MobileTab = "lesson" | "contents" | "code" | "tutor";
const noopSubscribe = () => () => {};

export function LessonShell({ outline, lesson, children, prevId }: { outline: Outline; lesson: LessonMeta; children: ReactNode; prevId?: string; prevTitle?: string }) {
  const [tab, setTab] = useState<MobileTab>("lesson");
  const [side, setSide] = useState<"code" | "tutor">("code");
  const [drawer, setDrawer] = useState(false);
  const runner = useRef<CodeRunnerHandle>(null);
  const last = useRef<RunResult | null>(null);
  const state = useProgress();
  const settings = useSettings();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const unlocked = !mounted || isLessonUnlocked(outline, state, lesson.id, settings.learningMode);
  const prev = outline.modules.flatMap((m) => m.lessons).find((l) => l.id === prevId);

  useEffect(() => {
    progress.visitLesson(lesson.id, lesson.title);
  }, [lesson.id, lesson.title]);

  // Code examples send their code here with "Try in playground".
  useEffect(() => {
    const onCode = (e: Event) => {
      const code = (e as CustomEvent<string>).detail;
      runner.current?.setCode(code);
      setSide("code");
      setTab("code");
      toast("Loaded into the playground", { description: "Edit the code and press Run.", tone: "info" });
    };
    const onTutor = () => {
      setSide("tutor");
      setTab("tutor");
    };
    window.addEventListener("ra:playground", onCode);
    window.addEventListener("ra:open-tutor", onTutor);
    return () => {
      window.removeEventListener("ra:playground", onCode);
      window.removeEventListener("ra:open-tutor", onTutor);
    };
  }, []);

  const askTutor = (code: string, result: RunResult | null) => {
    setSide("tutor");
    setTab("tutor");
    void tutor.send(codeMessage(code, result && result.code === code ? transcript(result.lines) : null), { lessonId: lesson.id });
  };

  const tabs: { id: MobileTab; label: string; icon: typeof BookOpen }[] = [
    { id: "lesson", label: "Lesson", icon: BookOpen },
    { id: "contents", label: "Contents", icon: ListTree },
    { id: "code", label: "Code", icon: Code2 },
    { id: "tutor", label: "AI Tutor", icon: Sparkles },
  ];

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* Mobile / tablet tab bar */}
      <div role="tablist" aria-label="Lesson panels" className="sticky top-[var(--header-h)] z-30 grid grid-cols-4 border-b border-border bg-background lg:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id);
              if (t.id === "code" || t.id === "tutor") setSide(t.id);
            }}
            className={cn("flex flex-col items-center gap-0.5 py-2 text-xs font-medium cursor-pointer", tab === t.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[260px_minmax(0,1fr)_minmax(400px,32vw)]">
        {/* Left: course navigation */}
        <aside
          className={cn(
            "border-r border-border p-3 lg:hidden xl:sticky xl:top-[var(--header-h)] xl:block xl:h-[calc(100vh-var(--header-h))] xl:overflow-y-auto scrollbar-thin",
            tab === "contents" ? "block" : "hidden",
          )}
          aria-label="Lesson navigation"
        >
          <Link href="/learn" className="mb-2 block px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
            ← Learning path
          </Link>
          <LessonNav outline={outline} currentId={lesson.id} onNavigate={() => setTab("lesson")} />
        </aside>

        {/* Center: lesson content */}
        <div className={cn("min-w-0", tab === "lesson" ? "block" : "hidden lg:block")}>
          <div className="hidden px-6 pt-4 lg:block xl:hidden">
            <Button size="sm" variant="outline" onClick={() => setDrawer(true)}>
              <ListTree /> Course contents
            </Button>
          </div>
          {!unlocked ? (
            <div className="mx-auto max-w-xl px-6 py-16 text-center">
              <Lock className="mx-auto size-10 text-muted-foreground" />
              <h1 className="mt-4 text-xl font-bold">{lesson.title}</h1>
              <p className="mt-2 text-muted-foreground">
                This lesson builds on {prev ? <strong>{prev.title}</strong> : "the previous lesson"}. We recommend finishing that first – but you are free to look ahead.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {prev && (
                  <Button asChild>
                    <Link href={`/learn/${prev.id}`}>Go to the previous lesson</Link>
                  </Button>
                )}
                <Button variant="outline" onClick={() => progress.unlockLesson(lesson.id)}>
                  Open anyway
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                You can unlock every lesson in <Link href="/settings" className="underline">Settings → Learning mode</Link>.
              </p>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Right: playground + tutor */}
        <aside
          className={cn(
            "border-l border-border bg-surface/40 lg:sticky lg:top-[var(--header-h)] lg:flex lg:h-[calc(100vh-var(--header-h))] lg:flex-col",
            tab === "code" || tab === "tutor" ? "flex flex-col" : "hidden",
          )}
          aria-label="Code playground and AI tutor"
        >
          <div role="tablist" aria-label="Side panel" className="hidden gap-1 border-b border-border p-2 lg:flex">
            <button role="tab" aria-selected={side === "code"} onClick={() => setSide("code")} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium cursor-pointer", side === "code" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <Code2 className="size-4" /> Playground
            </button>
            <button role="tab" aria-selected={side === "tutor"} onClick={() => setSide("tutor")} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium cursor-pointer", side === "tutor" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <Sparkles className="size-4" /> AI Tutor
            </button>
          </div>
          <div className={cn("min-h-0 flex-1 overflow-y-auto p-3 scrollbar-thin", side === "code" ? "block" : "hidden")}>
            <p className="mb-2 text-xs text-muted-foreground">Experiment freely – this playground keeps its own variables for this lesson. Use “Try in playground” on any example to load it here.</p>
            <CodeRunner
              ref={runner}
              workspace={`lesson:${lesson.id}`}
              variant="panel"
              initialCode={lesson.playground}
              storageKey={`lesson:${lesson.id}`}
              downloadName={`${lesson.id}.R`}
              title={lesson.title}
              onResult={(r) => (last.current = r)}
              onAskTutor={askTutor}
              editorMaxHeight={380}
              outputMaxHeight={300}
            />
          </div>
          <div className={cn("min-h-[480px] flex-1 flex-col lg:min-h-0", side === "tutor" ? "flex" : "hidden")}>
            <TutorChat
              compact
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              className="h-full min-h-0 flex-1"
              getCode={() => {
                const code = runner.current?.getCode() ?? "";
                return code.trim() ? { code, output: last.current && last.current.code === code ? transcript(last.current.lines) : null } : null;
              }}
            />
          </div>
        </aside>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 hidden lg:block xl:hidden" role="dialog" aria-modal="true" aria-label="Course contents">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-80 overflow-y-auto bg-background p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="px-2 font-semibold">Course contents</span>
              <Button size="icon-sm" variant="ghost" onClick={() => setDrawer(false)} aria-label="Close course contents">
                <X />
              </Button>
            </div>
            <LessonNav outline={outline} currentId={lesson.id} onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
