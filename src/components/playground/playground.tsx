"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bug, Database, FolderOpen, Play, Save, Sparkles, Trash2, Undo2, Upload, ArrowRight } from "lucide-react";
import { CodeRunner, type CodeRunnerHandle } from "@/components/code/code-runner";
import { TopicArt } from "@/components/brand/topic-art";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { codeMessage, tutor } from "@/lib/ai/tutor-store";
import { transcript } from "@/lib/r/console";
import { progress, useProgress } from "@/lib/store/progress";
import type { DatasetInfo } from "@/content/types";
import { timeAgo } from "@/lib/utils";
import { DatasetList, UploadPanel } from "./data-panel";
import { starters } from "./starters";

const WELCOME = `# Welcome to the R Academy playground!
# Write any R code here and press Run (or Ctrl + Enter).
# Your code runs in real R, right in your browser.

students <- read.csv("data/students.csv")
head(students)

mean(students$math)
hist(students$math, main = "Math scores", col = "steelblue")
`;

const TAB_CLASS = "flex-col gap-0.5 px-1 py-1.5 text-[11px] sm:text-xs [&_svg]:size-4";

export function Playground({ datasets }: { datasets: DatasetInfo[] }) {
  const runner = useRef<CodeRunnerHandle>(null);
  const router = useRouter();
  const s = useProgress();
  const [tab, setTab] = useState("starters");
  const [undo, setUndo] = useState<{ title: string; code: string } | null>(null);

  // Code sent from other pages ("Open in playground").
  useEffect(() => {
    try {
      const incoming = sessionStorage.getItem("ra-open-code");
      if (incoming) {
        sessionStorage.removeItem("ra-open-code");
        runner.current?.setCode(incoming);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const insert = (code: string) => {
    const cur = runner.current?.getCode() ?? "";
    runner.current?.setCode(cur.trim() ? `${cur.replace(/\s*$/, "")}\n\n${code}\n` : `${code}\n`);
    toast("Code added to the editor", { description: "Press Run (or Ctrl + Enter) to try it.", tone: "info" });
  };

  /** Replace the editor's code (keeping the old code for one-click undo). */
  const load = (title: string, code: string, run: boolean) => {
    const prev = runner.current?.getCode() ?? "";
    runner.current?.setCode(code);
    setUndo(prev.trim() && prev.trim() !== code.trim() ? { title, code: prev } : null);
    if (run) setTimeout(() => void runner.current?.run(), 60);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0">
        <CodeRunner
          ref={runner}
          workspace="playground"
          initialCode={WELCOME}
          storageKey="playground"
          title="Playground"
          downloadName="playground.R"
          editorMinHeight={340}
          outputMaxHeight={460}
          onAskTutor={(code, r) => {
            tutor.queue(codeMessage(code, r && r.code === code ? transcript(r.lines) : null));
            router.push("/tutor");
          }}
          extraToolbar={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                try {
                  sessionStorage.setItem("ra-check-code", runner.current?.getCode() ?? "");
                } catch {
                  /* ignore */
                }
                router.push("/error-checker");
              }}
              aria-label="Check this code in the Error Checker"
            >
              <Bug /> <span className="hidden md:inline">Check errors</span>
            </Button>
          }
        />
      </div>

      <aside aria-label="Playground tools" className="lg:sticky lg:top-20">
        <div className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="border-b-2 border-border bg-surface-2/60 p-2">
              <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
                <TabsTrigger value="starters" className={TAB_CLASS}>
                  <Sparkles /> Starters
                </TabsTrigger>
                <TabsTrigger value="data" className={TAB_CLASS}>
                  <Database /> Datasets
                </TabsTrigger>
                <TabsTrigger value="upload" className={TAB_CLASS}>
                  <Upload /> Upload
                </TabsTrigger>
                <TabsTrigger value="saved" className={TAB_CLASS}>
                  <Save /> Saved{s.snippets.length ? ` (${s.snippets.length})` : ""}
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="scrollbar-thin p-3 lg:max-h-[calc(100dvh-11rem)] lg:overflow-y-auto">
              {undo && (
                <div role="status" className="mb-3 flex items-center gap-2 rounded-2xl bg-sun-soft px-3 py-2 text-xs font-bold animate-fade-up">
                  <span className="min-w-0 flex-1">Loaded “{undo.title}”. Your previous code was replaced.</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 shrink-0"
                    onClick={() => {
                      runner.current?.setCode(undo.code);
                      setUndo(null);
                    }}
                  >
                    <Undo2 /> Undo
                  </Button>
                </div>
              )}

              <TabsContent value="starters" className="space-y-2.5">
                <p className="px-1 text-xs font-semibold text-muted-foreground">One click loads an example into the editor and runs it. Then change it and make it yours!</p>
                <ul className="space-y-2.5">
                  {starters.map((st) => (
                    <li key={st.id}>
                      <button
                        type="button"
                        onClick={() => load(st.title, st.code, true)}
                        className="press group flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 border-border bg-surface p-2 text-left hover:bg-surface-2 [--press-shadow:var(--border)]"
                        aria-label={`Load and run the example: ${st.title}`}
                      >
                        <span className="w-20 shrink-0 overflow-hidden rounded-xl">
                          <TopicArt kind={st.art} bg={`var(--${st.color}-soft)`} className="block" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[15px] font-semibold leading-tight">{st.title}</span>
                          <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">{st.description}</span>
                        </span>
                        <span className="grid size-8 shrink-0 place-items-center rounded-full text-white transition-transform group-hover:scale-110" style={{ background: `var(--${st.color})` }} aria-hidden>
                          <Play className="size-4 fill-current" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="data" className="space-y-2.5">
                <p className="px-1 text-xs font-semibold text-muted-foreground">
                  Sample datasets are ready inside R. <strong className="text-foreground">Insert</strong> adds code that loads one.{" "}
                  <Link href="/datasets" className="font-bold text-primary underline-offset-4 hover:underline">
                    About the data
                  </Link>
                </p>
                <DatasetList datasets={datasets} onInsert={insert} />
              </TabsContent>

              <TabsContent value="upload">
                <UploadPanel onInsert={insert} />
              </TabsContent>

              <TabsContent value="saved" className="space-y-2.5">
                {s.snippets.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-border px-4 py-6 text-center text-sm font-semibold text-muted-foreground">
                    <Save className="mx-auto mb-2 size-7 text-primary" />
                    Press the save icon (or <kbd className="font-mono text-xs">Ctrl + S</kbd>) in any editor to keep code here and on your dashboard.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {s.snippets.map((sn) => (
                      <li key={sn.id} className="rounded-2xl border-2 border-border bg-surface p-3 text-sm">
                        <p className="truncate font-bold">{sn.title}</p>
                        <p className="text-xs font-semibold text-muted-foreground">Saved {timeAgo(sn.updatedAt)}</p>
                        <div className="mt-2 flex gap-1.5">
                          <Button size="sm" variant="outline" onClick={() => load(sn.title, sn.code, false)}>
                            <FolderOpen /> Open
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => progress.deleteSnippet(sn.id)} aria-label={`Delete ${sn.title}`}>
                            <Trash2 />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/dashboard" className="flex items-center justify-center gap-1 pt-1 text-xs font-bold text-primary underline-offset-4 hover:underline">
                  All saved code on your dashboard <ArrowRight className="size-3.5" />
                </Link>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </aside>
    </div>
  );
}
