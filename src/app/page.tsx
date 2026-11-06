import Link from "next/link";
import { ArrowRight, BookOpen, Bug, Code2, Dumbbell, FolderKanban, Lightbulb, MessageCircleQuestion, PencilLine, Play, Search, ShieldCheck, Shuffle, Sparkles, Sprout, Target, Zap, CalendarCheck, CheckCircle2, Wand2 } from "lucide-react";
import { modules } from "@/content/curriculum";
import { projects } from "@/content/projects";
import { rFunctions } from "@/content/functions";
import { HomeCta } from "@/components/home/home-cta";
import { ErrorDemo } from "@/components/home/error-demo";
import { CodeRunner } from "@/components/code/code-runner";
import { StaticCode } from "@/components/code/static-code";
import { Hexy, HexyAvatar } from "@/components/brand/mascot";
import { TopicArt } from "@/components/brand/topic-art";
import { FloatingHexes, SectionTitle } from "@/components/brand/decor";
import { Reveal } from "@/components/brand/reveal";
import { HexBadge } from "@/components/game/hex-badge";
import { Button } from "@/components/ui/button";
import { worlds } from "@/lib/game/worlds";
import { badges } from "@/lib/game/badges";
import { XP } from "@/lib/game/xp";

const DEMO = `# This is real R, running in your browser.
# Press Run (or Ctrl + Enter), then change the numbers!
scores <- c(80, 90, 100)
mean(scores)

barplot(scores, names.arg = c("Ana", "Ben", "Cai"),
        col = "orchid", main = "Quiz scores")
`;

const STEPS = [
  { icon: BookOpen, color: "primary", title: "Learn", text: "A short, friendly explanation of one idea – every new term explained the first time." },
  { icon: Play, color: "sky", title: "Watch it work", text: "Run a real example, compare with the expected output and read it line by line." },
  { icon: PencilLine, color: "grape", title: "Try it yourself", text: "Edit the code in your own playground. Break it, fix it, predict the output." },
  { icon: Target, color: "tangerine", title: "Complete a challenge", text: "Write code that solves a task. Automated R tests check the result – any correct solution passes." },
  { icon: MessageCircleQuestion, color: "teal", title: "Get feedback", text: "Instant feedback on every answer, with hints, explanations and a nudge to retry." },
  { icon: Zap, color: "sun", title: "Earn XP", text: "Collect XP, level up, keep your streak and unlock badges as the map lights up." },
];

const TUTOR_ACTIONS = [
  { icon: Code2, label: "Explain This Code", color: "sky" },
  { icon: Sprout, label: "Make It Simpler", color: "mint" },
  { icon: Lightbulb, label: "Give Me a Hint", color: "sun" },
  { icon: Bug, label: "Find My Mistake", color: "coral" },
  { icon: Shuffle, label: "Give Me Another Example", color: "grape" },
  { icon: MessageCircleQuestion, label: "Quiz Me", color: "pink" },
];

const TOOLS = [
  { href: "/playground", art: "console", color: "sky", title: "R Playground", text: "A mini RStudio in your browser: editor, console, plots, data viewer, sample datasets and CSV upload." },
  { href: "/exercises", art: "test", color: "grape", title: "Practice arena", text: "Easy, medium and challenge problems with automated tests, progressive hints and full solutions." },
  { href: "/challenge", art: "calendar", color: "sun", title: "Daily challenge", text: "A fresh challenge every day for bonus XP – keep your streak alive." },
  { href: "/projects", art: "report", color: "pink", title: "Real projects", text: "Clean messy data, explore surveys, analyse health data and write a complete EDA report." },
  { href: "/reference", art: "package", color: "teal", title: "Reference & cheat sheets", text: "A searchable function reference, printable cheat sheets and a plain-English glossary." },
  { href: "/dashboard", art: "trophy", color: "tangerine", title: "Your dashboard", text: "XP, levels, streaks, badges and the topics worth reviewing – all in one place." },
] as const;

const SHOWCASE = ["first-run", "first-lesson", "debugger", "streak-7", "checkpoint", "level-5"];

export default function HomePage() {
  const lessonCount = modules.reduce((a, m) => a + m.lessons.length, 0);
  const exerciseCount = modules.reduce((a, m) => a + m.exercises.length, 0);
  const shown = SHOWCASE.map((id) => badges.find((b) => b.id === id)).filter((b): b is NonNullable<typeof b> => Boolean(b));
  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b-2 border-border" style={{ background: "linear-gradient(160deg, var(--primary-soft) 0%, var(--background) 55%, var(--mint-soft) 100%)" }}>
        <div className="blob -left-24 -top-24 size-80" style={{ background: "var(--primary)" }} />
        <div className="blob -right-16 bottom-0 size-72" style={{ background: "var(--mint)", opacity: 0.25 }} />
        <FloatingHexes count={10} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3">
              <Hexy mood="wave" size={74} animate className="shrink-0" />
              <p className="rounded-2xl rounded-bl-sm border-2 border-border bg-card px-4 py-2 font-display text-sm font-semibold shadow-[var(--shadow-card)]">
                Hi, I&apos;m Hexy! Let&apos;s learn R together.
              </p>
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Learn R. <br className="hidden sm:block" />
              Write Code. <br />
              <span className="text-gradient">Unlock Your Potential.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg font-semibold text-muted-foreground">
              A playful, hands-on adventure through R and data analysis – from your very first line of code to statistics and real projects. Real R runs right in your browser, with an AI tutor at your side.
            </p>
            <HomeCta className="mt-8" />
            <ul className="mt-7 flex flex-wrap gap-2">
              {[
                { n: lessonCount, label: "bite-sized lessons", c: "primary" },
                { n: exerciseCount, label: "tested challenges", c: "grape" },
                { n: projects.length, label: "real projects", c: "pink" },
                { n: rFunctions.length, label: "functions explained", c: "teal" },
              ].map((s) => (
                <li key={s.label} className="flex items-center gap-1.5 rounded-full border-2 border-border bg-card px-3 py-1 text-sm font-bold">
                  <span className="font-display" style={{ color: `var(--${s.c})` }}>
                    {s.n}
                  </span>
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-w-0 animate-fade-up [animation-delay:150ms]">
            <div className="pointer-events-none absolute -right-4 -top-[88px] z-10 hidden sm:block">
              <Hexy mood="point" size={84} className="-scale-x-100" />
            </div>
            <div>
              <CodeRunner initialCode={DEMO} workspace="home-demo" variant="compact" title="Try R right now" showSave={false} editorMinHeight={170} downloadName="first-r-code.R" />
            </div>
            <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">Real R (webR) – the first run takes a few seconds while R starts in your browser.</p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Worlds */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20" aria-labelledby="worlds-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Your path</p>
            <h2 id="worlds-title" className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Seven worlds to explore
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] font-semibold text-muted-foreground">Start as an R Explorer and finish as an R Pro. Each world is a chain of short lessons, challenges and a checkpoint – no experience needed.</p>
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
              <Reveal as="li" key={w.id} delay={i * 60} className={i === 0 ? "lg:col-span-2 lg:row-span-1" : undefined}>
                <Link href={`/learn#world-${w.id}`} className="lift group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
                  <div className="relative" style={{ background: w.color.soft }}>
                    <TopicArt kind={w.art} bg="transparent" className="h-36 w-full transition-transform duration-300 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full px-3 py-0.5 font-display text-xs font-semibold uppercase tracking-wider text-white" style={{ background: w.color.main }}>
                      World {w.number}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-xl font-bold">{w.name}</h3>
                    <p className="font-display text-sm font-semibold" style={{ color: w.color.main }}>
                      {w.tagline}
                    </p>
                    <p className="mt-2 flex-1 text-sm font-semibold text-muted-foreground">{w.description}</p>
                    <p className="mt-3 flex items-center gap-1 text-xs font-bold text-muted-foreground">
                      <BookOpen className="size-3.5" /> {lessons} lessons · {mods.reduce((a, m) => a + m.exercises.length, 0)} challenges
                      <ArrowRight className="ml-auto size-4 transition-transform group-hover:translate-x-1" style={{ color: w.color.main }} />
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* ---------------------------------------------------------- How it works */}
      <section className="relative overflow-hidden border-y-2 border-border bg-surface" aria-labelledby="how-title">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <SectionTitle eyebrow="How it works" title="Every lesson is a tiny adventure" description="Six quick steps, one idea at a time. You always see real R output, and you always know what to do next." align="center" />
          <h2 id="how-title" className="sr-only">
            How it works
          </h2>
          <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            <span className="absolute left-[8%] right-[8%] top-9 hidden h-1 rounded-full bg-gradient-to-r from-primary via-grape to-sun opacity-40 lg:block" aria-hidden />
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80} className="relative text-center">
                <span
                  className="relative mx-auto grid size-[72px] place-items-center rounded-3xl text-white shadow-[0_5px_0_var(--press-shadow)] [&_svg]:size-8"
                  style={{ background: `var(--${s.color})`, ["--press-shadow" as string]: `var(--${s.color}-shadow)` }}
                >
                  <s.icon />
                  <span className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full border-2 border-border bg-card font-display text-sm font-bold text-foreground">{i + 1}</span>
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">{s.text}</p>
              </Reveal>
            ))}
          </ol>
          <div className="mt-12 flex justify-center">
            <Button asChild size="lg">
              <Link href="/learn">
                <Play className="fill-current" /> See it in a lesson
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- AI tutor + Error detective */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20" aria-labelledby="helpers-title">
        <SectionTitle eyebrow="Never stuck for long" title="Two helpers on every page" description="Hexy, your AI tutor, explains things your way. The Error Detective turns scary red messages into clear, tested fixes." align="center" />
        <h2 id="helpers-title" className="sr-only">
          AI tutor and Error Detective
        </h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Tutor preview */}
          <Reveal className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-grape text-white shadow-[0_4px_0_var(--grape-shadow)]">
                <Sparkles className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-2xl font-bold">AI Tutor</h3>
                <p className="text-sm font-semibold text-muted-foreground">Answers at your level – and runs code in real R before it tells you what it prints.</p>
              </div>
            </div>
            <div className="mt-5 flex-1 overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 border-b-2 border-border bg-surface-2/60 px-4 py-2.5">
                <HexyAvatar size={28} />
                <span className="font-display font-semibold">Ask Hexy</span>
                <span className="ml-auto rounded-full bg-sun-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-warning">Example conversation</span>
              </div>
              <div className="space-y-4 p-4">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm font-semibold text-white">
                  Why does this say <code className="rounded bg-white/20 px-1">object &apos;score&apos; not found</code>?
                  <StaticCode code={"scores <- c(80, 90, 100)\nmean(score)"} className="mt-2 rounded-xl bg-white/95 py-2 text-[13px] text-[#1c1f3a]" />
                </div>
                <div className="flex max-w-[92%] gap-2">
                  <HexyAvatar size={32} mood="think" className="mt-1 shrink-0" />
                  <div className="rounded-2xl rounded-bl-sm border-2 border-border bg-surface-2/50 px-4 py-3 text-sm font-semibold">
                    <p>
                      Good question! You created a variable called <code className="rounded bg-code px-1">scores</code> (with an <strong>s</strong>), but then asked for <code className="rounded bg-code px-1">score</code>. R names must match exactly, so R can&apos;t find it.
                    </p>
                    <p className="mt-2">
                      Fix: <code className="rounded bg-code px-1">mean(scores)</code> – which gives <code className="rounded bg-code px-1">[1] 90</code>.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t-2 border-border p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">One-tap help</p>
                <ul className="flex flex-wrap gap-2">
                  {TUTOR_ACTIONS.map((a) => (
                    <li key={a.label}>
                      <span className="flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold" style={{ borderColor: `var(--${a.color})`, background: `var(--${a.color}-soft)` }}>
                        <a.icon className="size-3.5" style={{ color: `var(--${a.color})` }} /> {a.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Button asChild variant="grape" size="lg" className="mt-5 self-start">
              <Link href="/tutor">
                <Sparkles /> Chat with Hexy
              </Link>
            </Button>
          </Reveal>

          {/* Error detective */}
          <Reveal className="flex flex-col" delay={120}>
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-coral text-white shadow-[0_4px_0_var(--coral-shadow)]">
                <Search className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-2xl font-bold">R Error Detective</h3>
                <p className="text-sm font-semibold text-muted-foreground">Finds the line, explains the message, and only shows fixes that real R has tested.</p>
              </div>
            </div>
            <div className="mt-5 flex-1">
              <ErrorDemo />
            </div>
            <ul className="mt-4 grid gap-2 text-sm font-semibold sm:grid-cols-2">
              {["The actual error, in plain English", "Where it happened (when R says so)", "Why it happened and how to fix it", "Corrected code you can apply and re-run"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- Game */}
      <section className="relative overflow-hidden border-y-2 border-border" style={{ background: "linear-gradient(135deg, var(--sun-soft), var(--background) 60%, var(--grape-soft))" }} aria-labelledby="game-title">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2">
          <Reveal>
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-warning">Level up</p>
            <h2 id="game-title" className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Learning that feels like a game
            </h2>
            <p className="mt-3 max-w-xl text-[15px] font-semibold text-muted-foreground">Every lesson, challenge and correct answer earns XP. Keep a daily streak, take on the daily challenge and collect badges – while you build real, serious R skills.</p>
            <ul className="mt-6 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Lesson", xp: XP.lesson, icon: BookOpen, c: "primary" },
                { label: "Challenge", xp: `${XP.exercise.easy}–${XP.exercise.challenge}`, icon: Target, c: "grape" },
                { label: "Daily challenge", xp: XP.daily, icon: CalendarCheck, c: "sun" },
                { label: "Correct answer", xp: XP.question, icon: CheckCircle2, c: "mint" },
                { label: "Checkpoint", xp: XP.checkpoint, icon: Dumbbell, c: "teal" },
                { label: "Project", xp: XP.projectComplete, icon: FolderKanban, c: "pink" },
              ].map((r) => (
                <li key={r.label} className="rounded-2xl border-2 border-border bg-card p-3">
                  <r.icon className="size-5" style={{ color: `var(--${r.c})` }} />
                  <p className="mt-1 flex items-center gap-1 font-display text-lg font-bold">
                    <Zap className="size-4 fill-sun text-sun" />
                    {r.xp} XP
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">{r.label}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="sun" size="lg">
                <Link href="/challenge">
                  <CalendarCheck /> Today&apos;s challenge
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">
                  <Wand2 /> My progress
                </Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120} className="relative">
            <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <p className="font-display text-lg font-semibold">Badges to collect</p>
              <ul className="mt-4 grid grid-cols-3 gap-4">
                {shown.map((b, i) => (
                  <li key={b.id} className="text-center">
                    <HexBadge icon={b.icon} color={b.color} size={64} className={i % 2 ? "animate-float" : undefined} />
                    <p className="mt-2 font-display text-sm font-semibold leading-tight">{b.title}</p>
                    <p className="text-[11px] font-semibold text-muted-foreground">{b.description}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-center text-xs font-bold text-muted-foreground">
                {badges.length} badges in total – see them all on your <Link href="/dashboard" className="text-primary underline">dashboard</Link>.
              </p>
            </div>
            <div className="pointer-events-none absolute -right-3 -top-14 hidden sm:block">
              <Hexy mood="celebrate" size={88} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- Tools */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20" aria-labelledby="tools-title">
        <SectionTitle eyebrow="Your toolbox" title="Everything you need to practise" />
        <h2 id="tools-title" className="sr-only">
          Tools
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t, i) => (
            <Reveal as="li" key={t.href} delay={i * 60}>
              <Link href={t.href} className="lift group flex h-full items-center gap-4 rounded-3xl border-2 border-border bg-card p-4 shadow-[var(--shadow-card)]">
                <span className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl" style={{ background: `var(--${t.color}-soft)` }}>
                  <TopicArt kind={t.art} bg="transparent" className="h-full w-full" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 font-display text-lg font-semibold">
                    {t.title} <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-muted-foreground">{t.text}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------- Final CTA */}
      <section className="relative overflow-hidden border-t-2 border-border" style={{ background: "linear-gradient(180deg, var(--background), var(--primary-soft))" }}>
        <FloatingHexes count={8} />
        <div className="relative mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
          <Hexy mood="happy" size={120} animate className="mx-auto" />
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">Ready to write your first R program?</h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] font-semibold text-muted-foreground">Your progress is saved automatically in this browser. Create an optional account later to sync across devices.</p>
          <HomeCta className="mt-7" center />
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <ShieldCheck className="size-4" /> Your code runs on your own device – nothing you run is sent to our server.
          </p>
        </div>
      </section>
    </>
  );
}
