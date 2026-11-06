"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, Trash2, Bug } from "lucide-react";
import { CodeRunner, type CodeRunnerHandle } from "@/components/code/code-runner";
import { DataPanel } from "./data-panel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { codeMessage, tutor } from "@/lib/ai/tutor-store";
import { transcript } from "@/lib/r/console";
import { progress, useProgress } from "@/lib/store/progress";
import type { DatasetInfo } from "@/content/types";
import { timeAgo } from "@/lib/utils";

const WELCOME = `# Welcome to the R Academy playground!
# Write any R code here and press Run (or Ctrl + Enter).
# Your code runs in real R, right in your browser.

students <- read.csv("data/students.csv")
head(students)

mean(students$math)
hist(students$math, main = "Math scores", col = "steelblue")
`;

export function Playground({ datasets }: { datasets: DatasetInfo[] }) {
  const runner = useRef<CodeRunnerHandle>(null);
  const router = useRouter();
  const s = useProgress();

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
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-2">
        <CodeRunner
          ref={runner}
          workspace="playground"
          initialCode={WELCOME}
          storageKey="playground"
          title="Playground"
          downloadName="playground.R"
          editorMinHeight={320}
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
      <aside className="space-y-4">
        <Tabs defaultValue="data">
          <TabsList className="w-full">
            <TabsTrigger value="data" className="flex-1">Data</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">Saved code ({s.snippets.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="data" className="mt-3">
            <DataPanel datasets={datasets} onInsert={insert} />
          </TabsContent>
          <TabsContent value="saved" className="mt-3">
            {s.snippets.length === 0 ? (
              <p className="text-sm text-muted-foreground">Press the save icon (or Ctrl+S) in any editor to keep code here and on your dashboard.</p>
            ) : (
              <ul className="space-y-2">
                {s.snippets.map((sn) => (
                  <li key={sn.id} className="rounded-lg border border-border bg-card p-2.5 text-sm">
                    <p className="truncate font-medium">{sn.title}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(sn.updatedAt)}</p>
                    <div className="mt-1.5 flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => runner.current?.setCode(sn.code)}>
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
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  );
}
