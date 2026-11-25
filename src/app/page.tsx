import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck, CheckCircle2, FolderKanban, MessageCircleQuestion, PencilLine, Play, ShieldCheck, Target, Zap } from "lucide-react";
import { modules } from "@/content/curriculum";
import { projects } from "@/content/projects";
import { rFunctions } from "@/content/functions";
import { HomeCta } from "@/components/home/home-cta";
import { ErrorDemo } from "@/components/home/error-demo";
import { CodeRunner } from "@/components/code/code-runner";
import { Hexy } from "@/components/brand/mascot";
import { TopicArt } from "@/components/brand/topic-art";
import { Reveal } from "@/components/brand/reveal";
import { HexBadge } from "@/components/game/hex-badge";
import { Button } from "@/components/ui/button";
import { worlds } from "@/lib/game/worlds";
import { badges } from "@/lib/game/badges";
import { XP } from "@/lib/game/xp";

const DEMO = `# This is real R, running in your browser.
# Press Run (or Ctrl + Enter), then change the numbers.
scores <- c(80, 90, 100)
mean(scores)

barplot(scores, names.arg = c("Ana", "Ben", "Cai"),
        col = "#5ba881", main = "Quiz scores")
`;

const STEPS = [
  { icon: BookOpen, color: "primary", title: "Learn", text: "A short, clear explanation of one idea. Every new term is explained the first time it appears." },
  { icon: Play, color: "sky", title: "Watch it work", text: "Run a real example, compare it with the expected output and read it line by line." },
  { icon: PencilLine, color: "grape", title: "Try it yourself", text: "Edit the code in your own playground. Change it, break it, fix it." },
  { icon: Target, color: "tangerine", title: "Complete a challenge", text: "Write code that solves a task. Automated R tests check the result – any correct solution passes." },
  { icon: MessageCircleQuestion, color: "teal", title: "Get feedback", text: "Immediate feedback on every answer, with hints and explanations." },
  { icon: Zap, color: "mint", title: "Track progress", text: "Earn XP, keep a streak and see each world fill up as you go." },
];

const TOOLS = [
  { href: "/playground", art: "console", color: "sky", title: "R Playground", text: "Editor, console, plots, data viewer, sample datasets and CSV upload." },
  { href: "/exercises", art: "test", color: "grape", title: "Practice", text: "Easy, medium and challenge problems with automated tests, hints and solutions." },
  { href: "/challenge", art: "calendar", color: "sun", title: "Daily challenge", text: "One new exercise every day from the topics you have reached." },
  { href: "/projects", art: "report", color: "pink", title: "Projects", text: "Clean messy data, explore surveys and write a complete analysis report." },
  { href: "/reference", art: "package", color: "teal", title: "Reference", text: "A searchable function reference, printable cheat sheets and a glossary." },
  { href: "/visualize", art: "bell", color: "tangerine", title: "R Labs", text: "Interactive simulations for distributions, sampling, correlation and regression." },
] as const;

const SHOWCASE = ["first-run", "first-lesson", "debugger", "streak-7"];

export default function HomePage() {
  const lessonCount = modules.reduce((a, m) => a + m.lessons.length, 0);
  const exerciseCount = modules.reduce((a, m) => a + m.exercises.length, 0);
  const shown = SHOWCASE.map((id) => badges.find((b) => b.id === id)).filter((b): b is NonNullable<typeof b> => Boolean(b));
  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
              <span className="size-1.5 rounded-full bg-mint" aria-hidden /> Free · runs in your browser · no installation
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Learn R. Write Code.
              <br />
              <span className="text-primary">Unlock Your Potential.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              A structured, hands-on course in R and data analysis – from your first line of code to statistics and real projects. Every example runs in real R, right on this page.
            </p>
            <HomeCta className="mt-8" />
            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              {[
                { n: lessonCount, label: "lessons" },
                { n: exerciseCount, label: "exercises" },
                { n: projects.length, label: "projects" },
                { n: rFunctions.length, label: "functions" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-2xl font-bold">{s.n}</dd>
                  <dd className="text-sm text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0">
            <CodeRunner initialCode={DEMO} workspace="home-demo" variant="compact" title="Try R right now" showSave={false} editorMinHeight={170} downloadName="first-r-code.R" />
            <p className="mt-3 text-center text-xs text-muted-foreground">Real R (webR). The first run takes a few seconds while R starts in your browser.</p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- How it works */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20" aria-labelledby="how-title">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">How it works</p>
          <h2 id="how-title" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Every lesson follows the same six steps
          </h2>
          <p className="mt-3 text-muted-foreground">One idea at a time, with real R output at every step and a clear next action.</p>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 50} className="flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl [&_svg]:size-5" style={{ background: `var(--${s.color}-soft)`, color: `var(--${s.color})` }} aria-hidden>
                <s.icon />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">
                  <span className="mr-1.5 text-muted-foreground">{i + 1}.</span>
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------------- Worlds */}
      <section className="border-y border-border bg-surface" aria-labelledby="worlds-title">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">The learning path</p>
              <h2 id="worlds-title" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Seven worlds, from first steps to real projects
              </h2>
              <p className="mt-3 text-muted-foreground">Each world is a sequence of short lessons, exercises and a checkpoint. No experience is needed to start.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/learn">
                Open the learning map <ArrowRight />
              </Link>
            </Button>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {worlds.map((w, i) => {
              const mods = w.modules.map((n) => modules.find((m) => m.number === n)!).filter(Boolean);
              const lessons = mods.reduce((a, m) => a + m.lessons.length, 0);
              return (
                <Reveal as="li" key={w.id} delay={i * 40}>
                  <Link href={`/learn#world-${w.id}`} className="lift group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
                    <div style={{ background: w.color.soft }}>
                      <TopicArt kind={w.art} bg="transparent" className="h-32 w-full" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: w.color.main }}>
                        World {w.number}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-semibold">{w.name}</h3>
                      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{w.tagline}</p>
                      <p className="mt-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span>
                          {lessons} lessons · {mods.reduce((a, m) => a + m.exercises.length, 0)} exercises
                        </span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" style={{ color: w.color.main }} aria-hidden />
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
            <Reveal as="li" delay={worlds.length * 40}>
              <Link href="/projects" className="lift group flex h-full flex-col justify-between rounded-3xl border border-dashed border-border-strong bg-background p-5">
                <div>
                  <FolderKanban className="size-6 text-primary" aria-hidden />
                  <h3 className="mt-3 font-display text-lg font-semibold">Then: real projects</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">Six guided analyses on realistic datasets, ending with a complete exploratory data analysis.</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Browse projects <ArrowRight className="size-4" aria-hidden />
                </span>
              </Link>
            </Reveal>
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------- Error detective */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20" aria-labelledby="detective-title">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-coral">Debugging</p>
            <h2 id="detective-title" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              The R Error Detective
            </h2>
            <p className="mt-3 text-muted-foreground">Error messages are part of learning to code. The Error Detective runs your code in real R and turns the message into a clear explanation – without guessing.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "The exact error R reported, in plain English",
                "The line where it happened, when R says so",
                "Why it happened and how to fix it",
                "Corrected code – shown only after R has run it successfully",
                "Apply the fix and test it in one click",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden /> {t}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-7">
              <Link href="/error-checker">
                Open the Error Detective <ArrowRight />
              </Link>
            </Button>
          </div>
          <Reveal>
            <ErrorDemo />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- Progress */}
      <section className="border-y border-border bg-surface" aria-labelledby="progress-title">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Motivation</p>
            <h2 id="progress-title" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              See your progress, every day
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">Lessons, exercises and correct answers earn XP. A daily goal, a streak and a daily challenge help you build a steady habit. Your progress is saved in this browser.</p>
            <dl className="mt-6 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Lesson", xp: XP.lesson, icon: BookOpen },
                { label: "Exercise", xp: `${XP.exercise.easy}–${XP.exercise.challenge}`, icon: Target },
                { label: "Daily challenge", xp: XP.daily, icon: CalendarCheck },
              ].map((r) => (
                <div key={r.label} className="rounded-2xl border border-border bg-card p-3">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <r.icon className="size-3.5" aria-hidden /> {r.label}
                  </dt>
                  <dd className="mt-1 font-display text-lg font-bold">{r.xp} XP</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/challenge">
                  <CalendarCheck /> Today&apos;s challenge
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/dashboard">
                  My dashboard <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <p className="font-display text-base font-semibold">Badges you can earn</p>
            <ul className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {shown.map((b) => (
                <li key={b.id} className="text-center">
                  <HexBadge icon={b.icon} color={b.color} size={56} className="mx-auto" />
                  <p className="mt-2 text-sm font-semibold leading-tight">{b.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{b.description}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
              {badges.length} badges in total – see them all on your{" "}
              <Link href="/dashboard" className="font-semibold text-primary underline-offset-4 hover:underline">
                dashboard
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Tools */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20" aria-labelledby="tools-title">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Toolbox</p>
        <h2 id="tools-title" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to practise
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t, i) => (
            <Reveal as="li" key={t.href} delay={i * 40}>
              <Link href={t.href} className="lift group flex h-full items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                <span className="h-16 w-24 shrink-0 overflow-hidden rounded-xl" style={{ background: `var(--${t.color}-soft)` }}>
                  <TopicArt kind={t.art} bg="transparent" className="h-full w-full" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 font-display text-base font-semibold">
                    {t.title} <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{t.text}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------- Final CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
          <Hexy mood="happy" size={56} className="mx-auto" />
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">Ready to write your first R program?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Your progress is saved automatically in this browser. You can create an optional account later to sync across devices.</p>
          <HomeCta className="mt-8" center />
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-4" aria-hidden /> Your code runs on your own device – nothing you run is sent to a server.
          </p>
        </div>
      </section>
    </>
  );
}
