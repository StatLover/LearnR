import { AlertTriangle, BookMarked, Info, Lightbulb, StickyNote } from "lucide-react";
import type { Block, Lesson } from "@/content/types";
import { Markdown } from "@/components/content/markdown";
import { Diagram } from "./diagrams";
import { ExampleBlock } from "./example-block";
import { QuestionCard } from "./question-card";
import { cn } from "@/lib/utils";

const CALLOUT = {
  tip: { icon: Lightbulb, cls: "border-mint/40 bg-mint-soft", title: "Pro tip", color: "text-success", chip: "bg-mint" },
  note: { icon: StickyNote, cls: "border-border bg-surface-2/60", title: "Note", color: "text-muted-foreground", chip: "bg-border-strong" },
  warning: { icon: AlertTriangle, cls: "border-sun/50 bg-sun-soft", title: "Watch out", color: "text-warning", chip: "bg-sun" },
  info: { icon: Info, cls: "border-sky/40 bg-sky-soft", title: "Good to know", color: "text-info", chip: "bg-sky" },
};

export function LessonBlock({ block, lesson }: { block: Block; lesson: Lesson }) {
  switch (block.kind) {
    case "text":
      return <Markdown>{block.md}</Markdown>;
    case "definition":
      return (
        <div className="my-5 flex gap-3 rounded-2xl border-2 border-primary/30 bg-primary-soft/60 px-4 py-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-white" aria-hidden>
            <BookMarked className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold text-primary-strong dark:text-primary">
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
        <aside className={cn("my-5 flex gap-3 rounded-2xl border-2 px-4 py-4", c.cls)}>
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl text-white", c.chip)} aria-hidden>
            <c.icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className={cn("font-display text-base font-semibold", c.color)}>{block.title ?? c.title}</p>
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
        <div className="my-5 overflow-x-auto rounded-2xl border-2 border-border">
          <table className="w-full border-collapse text-sm">
            {block.caption && <caption className="border-b-2 border-border bg-surface-2 px-4 py-2 text-left font-display text-sm font-semibold">{block.caption}</caption>}
            <thead className="bg-surface-2/60">
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
          <p className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-primary">Quick check</p>
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
                <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">{i + 1}</span>
                <Markdown className="min-w-0 flex-1">{it}</Markdown>
              </li>
            ))}
          </ol>
        </div>
      );
  }
}
