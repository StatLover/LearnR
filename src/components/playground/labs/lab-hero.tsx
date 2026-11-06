import Link from "next/link";
import { BookOpen, ChevronLeft, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { LabArt } from "./lab-art";
import { TOPIC_CLASS, type LabInfo } from "./lab-list";

/** Compact, colourful hero at the top of a single lab. */
export function LabHero({ lab }: { lab: LabInfo }) {
  return (
    <div className="relative overflow-hidden border-b-2 border-border" style={{ background: `linear-gradient(135deg, var(--${lab.color}-soft) 0%, var(--background) 75%)` }}>
      <div className="blob -left-20 -top-24 size-72" style={{ background: `var(--${lab.color})` }} />
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-5 py-6 sm:py-8">
        <div className="min-w-0 flex-1 basis-80">
          <nav aria-label="Breadcrumb">
            <Link href="/visualize" className="inline-flex items-center gap-1 rounded-full bg-card/70 px-3 py-1 font-display text-sm font-semibold text-muted-foreground hover:text-foreground">
              <ChevronLeft className="size-4" /> All R Labs
            </Link>
          </nav>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{lab.title}</h1>
          <p className="mt-2 max-w-2xl text-[15px] font-semibold text-muted-foreground">{lab.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {lab.topics.map((t) => (
              <span key={t} className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", TOPIC_CLASS[t])}>
                {t}
              </span>
            ))}
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-bold text-muted-foreground">{lab.level}</span>
            <span className="flex items-center gap-1 rounded-full bg-mint-soft px-2.5 py-0.5 text-xs font-bold text-success">
              <Cpu className="size-3.5" /> Real R in your browser
            </span>
            {lab.lesson && (
              <Link href={`/learn/${lab.lesson.id}`} className="flex items-center gap-1 text-xs font-bold text-primary underline-offset-4 hover:underline">
                <BookOpen className="size-3.5" /> Lesson: {lab.lesson.title}
              </Link>
            )}
          </div>
        </div>
        <div className="hidden w-56 shrink-0 overflow-hidden rounded-3xl border-2 border-border shadow-[var(--shadow-card)] md:block">
          <LabArt lab={lab} className="block" />
        </div>
      </div>
    </div>
  );
}
