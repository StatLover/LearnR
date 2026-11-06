import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, ChevronRight, Dumbbell, Flag, Lightbulb, Zap } from "lucide-react";
import { getModule, modules, stages, lessonsForConcept } from "@/content/curriculum";
import { Quiz } from "@/components/learn/quiz";
import { Hexy } from "@/components/brand/mascot";
import { TopicArt } from "@/components/brand/topic-art";
import { FloatingHexes } from "@/components/brand/decor";
import { ModuleLessons } from "@/components/challenge/module-lessons";
import { WorldChip, worldInk } from "@/components/exercises/world-chip";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/ui/badge";
import { LESSON_ART, worldOfModule } from "@/lib/game/worlds";
import { XP } from "@/lib/game/xp";

export function generateStaticParams() {
  return modules.map((m) => ({ moduleId: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ moduleId: string }> }): Promise<Metadata> {
  const m = getModule((await params).moduleId);
  return m ? { title: `Module ${m.number}: ${m.title}`, description: m.description } : {};
}

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const m = getModule((await params).moduleId);
  if (!m) notFound();
  const stage = stages.find((s) => s.number === m.stage)!;
  const world = worldOfModule(m.number);
  const reviewLinks: Record<string, { id: string; title: string }> = {};
  for (const q of m.checkpoint)
    if (q.concept) {
      const l = lessonsForConcept(q.concept)[0];
      if (l) reviewLinks[q.concept] = { id: l.id, title: l.title };
    }
  const thumbs = Object.fromEntries(m.lessons.map((l) => [l.id, <TopicArt key={l.id} kind={LESSON_ART[l.id] ?? world.art} bg={world.color.soft} />]));
  const first = m.lessons[0];

  return (
    <>
      {/* world-coloured hero */}
      <section className="relative overflow-hidden border-b-2 border-border" style={{ background: `linear-gradient(135deg, ${world.color.soft} 0%, var(--background) 72%)` }}>
        <div className="blob -left-16 -top-24 size-72" style={{ background: world.color.main }} />
        <div className="blob -right-10 top-10 size-56" style={{ background: "var(--pink)", opacity: 0.16 }} />
        <FloatingHexes count={7} />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-5 py-9 sm:py-12">
          <span className="relative grid size-20 shrink-0 place-items-center sm:size-24" aria-hidden>
            <svg viewBox="0 0 40 44" className="absolute inset-0 size-full">
              <path d="M20 3 L36 12 L36 32 L20 41 L4 32 L4 12 Z" fill={world.color.shadow} transform="translate(0 2)" stroke={world.color.shadow} strokeWidth="3" strokeLinejoin="round" />
              <path d="M20 3 L36 12 L36 32 L20 41 L4 32 L4 12 Z" fill={world.color.main} stroke={world.color.main} strokeWidth="3" strokeLinejoin="round" />
              <path d="M20 6 L33 13.5 L33 19 Q20 15 7 19 L7 13.5 Z" fill="#ffffff" opacity="0.25" />
            </svg>
            <span className={`relative font-display text-3xl font-bold sm:text-4xl ${world.color.main.includes("--sun") ? "text-[#3b2600]" : "text-white"}`}>{m.number}</span>
          </span>
          <div className="min-w-0 flex-1 basis-72">
            <div className="flex flex-wrap items-center gap-2">
              <WorldChip world={world} className="bg-card/80" />
              <span className="text-xs font-bold text-muted-foreground">
                {stage.subtitle} · {stage.title}
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Module {m.number}: {m.title}
            </h1>
            <p className="mt-2 max-w-3xl text-[15px] font-semibold text-muted-foreground">{m.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
              <li className="inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1">
                <BookOpen className="size-4" style={{ color: worldInk(world) }} aria-hidden /> {m.lessons.length} lessons
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1">
                <Dumbbell className="size-4" style={{ color: worldInk(world) }} aria-hidden /> {m.exercises.length} exercises
              </li>
              {m.checkpoint.length > 0 && (
                <li className="inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1">
                  <Flag className="size-4" style={{ color: worldInk(world) }} aria-hidden /> {m.checkpoint.length}-question checkpoint
                </li>
              )}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              {m.checkpoint.length > 0 && (
                <Button asChild size="lg">
                  <a href="#checkpoint">
                    <Flag /> Take the checkpoint
                  </a>
                </Button>
              )}
              {first && (
                <Button asChild size="lg" variant="outline">
                  <Link href={`/learn/${first.id}`}>
                    <BookOpen /> Start the lessons
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="hidden shrink-0 md:block">
            <Hexy mood="point" size={140} animate />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-labelledby="checkpoint-title" id="checkpoint" className="min-w-0 scroll-mt-24">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl text-white shadow-[0_3px_0_var(--edge)]" style={{ background: world.color.main, ["--edge" as string]: world.color.shadow }} aria-hidden>
              <Flag className={`size-5 ${world.color.main.includes("--sun") ? "text-[#3b2600]" : ""}`} />
            </span>
            <div>
              <h2 id="checkpoint-title" className="font-display text-2xl font-bold tracking-tight">
                World checkpoint
              </h2>
              <p className="text-sm font-semibold text-muted-foreground">
                A short challenge on the whole module. Pass with 70% for a +{XP.checkpoint} XP bonus.
              </p>
            </div>
          </div>
          {m.checkpoint.length ? (
            <Quiz questions={m.checkpoint} kind="checkpoint" moduleNumber={m.number} reviewLinks={reviewLinks} color={world.color.main} />
          ) : (
            <p className="rounded-3xl border-2 border-dashed border-border bg-card p-6 text-sm font-semibold text-muted-foreground">This module has no checkpoint yet.</p>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-dashed border-border bg-card/60 p-4">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
            <p className="text-sm font-semibold text-muted-foreground">
              Tip: the checkpoint mixes questions from every lesson below. If one trips you up, the results screen links straight to the lesson that explains it – review it and retake as often as you like. Your best score is kept.
            </p>
          </div>
        </section>

        <aside className="space-y-5" aria-label="About this module">
          <section aria-labelledby="lessons-title" className="rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 id="lessons-title" className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
              <BookOpen className="size-5 text-primary" aria-hidden /> Lessons in this module
            </h2>
            <ModuleLessons moduleNumber={m.number} color={world.color.main} thumbs={thumbs} />
          </section>

          <section aria-labelledby="topics-title" className="rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 id="topics-title" className="mb-3 font-display text-lg font-semibold">
              Topics covered
            </h2>
            <ul className="flex flex-wrap gap-1.5">
              {m.topics.map((t) => (
                <li key={t} className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: world.color.soft, color: worldInk(world) }}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="practice-title" className="rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 id="practice-title" className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
              <Dumbbell className="size-5 text-primary" aria-hidden /> Practice exercises
            </h2>
            <ul className="space-y-1">
              {m.exercises.map((e) => (
                <li key={e.id}>
                  <Link href={`/exercises/${e.id}`} className="group flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 hover:bg-surface-2">
                    <span className="min-w-0 text-sm font-bold group-hover:text-primary">{e.title}</span>
                    <DifficultyBadge difficulty={e.difficulty} />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={`/exercises?module=${m.number}`} className="mt-3 inline-flex items-center gap-1 px-2 text-sm font-bold text-primary hover:underline">
              Open in Practice <ChevronRight className="size-4" aria-hidden />
            </Link>
          </section>

          <Link href="/challenge" className="lift group flex items-center gap-3 rounded-3xl border-2 border-sun/60 p-4 shadow-[var(--shadow-card)]" style={{ background: "linear-gradient(120deg, var(--sun-soft), var(--card))" }}>
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sun text-[#3b2600] shadow-[0_3px_0_var(--sun-shadow)]" aria-hidden>
              <Zap className="size-5 fill-current" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display font-semibold">Daily challenge</span>
              <span className="block text-xs font-bold text-muted-foreground">One exercise a day for +{XP.daily} XP</span>
            </span>
            <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </aside>
      </div>
    </>
  );
}
