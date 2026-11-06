import { AlertTriangle, BookMarked, Info, Lightbulb, StickyNote } from "lucide-react";
import type { Block, Lesson } from "@/content/types";
import { Markdown } from "@/components/content/markdown";
import { Diagram } from "./diagrams";
import { ExampleBlock } from "./example-block";
import { QuestionCard } from "./question-card";
import { cn } from "@/lib/utils";

const CALLOUT = {
  tip: { icon: Lightbulb, cls: "border-success/40 bg-success-soft", title: "Tip", color: "text-success" },
  note: { icon: StickyNote, cls: "border-border bg-surface", title: "Note", color: "text-muted-foreground" },
  warning: { icon: AlertTriangle, cls: "border-warning/40 bg-warning-soft", title: "Watch out", color: "text-warning" },
  info: { icon: Info, cls: "border-info/40 bg-info-soft", title: "Good to know", color: "text-info" },
};

export function LessonBlock({ block, lesson }: { block: Block; lesson: Lesson }) {
  switch (block.kind) {
    case "text":
      return <Markdown>{block.md}</Markdown>;
    case "definition":
      return (
        <div className="my-4 flex gap-3 rounded-xl border-l-4 border-primary bg-primary-soft/50 px-4 py-3">
          <BookMarked className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0">
            <p className="font-semibold">
              <span className="sr-only">Definition: </span>
              {block.term}
            </p>
            <Markdown>{block.md}</Markdown>
          </div>
        </div>
      );
    case "callout": {
      const c = CALLOUT[block.tone];
      return (
        <aside className={cn("my-4 flex gap-3 rounded-xl border px-4 py-3", c.cls)}>
          <c.icon className={cn("mt-0.5 size-5 shrink-0", c.color)} aria-hidden />
          <div className="min-w-0">
            <p className="font-semibold">{block.title ?? c.title}</p>
            <Markdown>{block.md}</Markdown>
          </div>
        </aside>
      );
    }
    case "code":
      return <ExampleBlock example={block.example} lessonId={lesson.id} lessonTitle={lesson.title} />;
    case "diagram":
      return <Diagram name={block.name} caption={block.caption} />;
    case "table":
      return (
        <div className="my-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            {block.caption && <caption className="border-b border-border bg-surface px-3 py-2 text-left text-xs font-semibold text-muted-foreground">{block.caption}</caption>}
            <thead className="bg-surface">
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} scope="col" className="border-b border-border px-3 py-2 text-left font-semibold">
                    <Markdown runnableCode={false}>{h}</Markdown>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0 align-top">
                  {r.map((c, j) => (
                    <td key={j} className="px-3 py-2">
                      <Markdown runnableCode={false}>{c}</Markdown>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "question":
      return (
        <div className="my-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">Check your understanding</p>
          <QuestionCard question={block.question} />
        </div>
      );
    case "steps":
      return (
        <div className="my-4">
          {block.title && <p className="mb-2 font-semibold">{block.title}</p>}
          <ol className="space-y-2">
            {block.items.map((it, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                <Markdown className="min-w-0 flex-1">{it}</Markdown>
              </li>
            ))}
          </ol>
        </div>
      );
  }
}
