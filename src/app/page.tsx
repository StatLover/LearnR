import Link from "next/link";
import { BookOpen, Bug, Code2, FolderKanban, GraduationCap, Sparkles, MonitorSmartphone, ShieldCheck, LineChart, CheckCircle2, ArrowRight, Trophy, Dumbbell } from "lucide-react";
import { modules, stages } from "@/content/curriculum";
import { projects } from "@/content/projects";
import { rFunctions } from "@/content/functions";
import { getOutline } from "@/content/outline";
import { HomeCta } from "@/components/home/home-cta";
import { CodeRunner } from "@/components/code/code-runner";
import { Badge } from "@/components/ui/badge";

const DEMO = `# This is real R, running in your browser.
# Press Run (or Ctrl + Enter) – then change the numbers!

scores <- c(80, 90, 100)

mean(scores)
max(scores)
min(scores)
`;

const BENEFITS = [
  { icon: GraduationCap, title: "Starts from zero", text: "No programming or statistics background needed. Every term is explained the first time it appears." },
  { icon: MonitorSmartphone, title: "Nothing to install", text: "Real R runs inside your browser on any computer, tablet or phone – no setup, no accounts required." },
  { icon: Code2, title: "Learn by doing", text: "Every example is runnable. Change it, break it, and see what happens. Exercises check your code automatically." },
  { icon: Bug, title: "Friendly error help", text: "The Error Checker finds the line that failed and explains the message in plain English – with a working fix." },
  { icon: Sparkles, title: "A personal AI tutor", text: "Ask questions, get hints without spoilers, or have code explained line by line, at your own level." },
  { icon: LineChart, title: "Real data skills", text: "Go from vectors to dplyr, ggplot2, statistical tests, regression and complete data analysis projects." },
];

export default function HomePage() {
  const outline = getOutline();
  const lessonCount = modules.reduce((a, m) => a + m.lessons.length, 0);
  const exerciseCount = modules.reduce((a, m) => a + m.exercises.length, 0);
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-soft/60 via-background to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="animate-fade-up">
            <Badge variant="primary">Free, interactive, beginner-friendly</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              R Academy <span className="block text-primary">Learn R from Zero</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              An interactive R textbook, a coding classroom, a beginner-friendly RStudio and a personal AI tutor – in one place. Write your first line of R code in the next minute, and progress all the way to statistical analysis and real data projects.
            </p>
            <div className="mt-7">
              <HomeCta outline={outline} />
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> {lessonCount} lessons</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> {exerciseCount} tested exercises</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> {projects.length} guided projects</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> {rFunctions.length} functions explained</li>
            </ul>
          </div>
          <div className="min-w-0 animate-fade-up">
            <CodeRunner initialCode={DEMO} workspace="home-demo" variant="compact" title="Try R right now" showSave={false} editorMinHeight={190} downloadName="first-r-code.R" />
            <p className="mt-2 text-center text-xs text-muted-foreground">The first run takes a few seconds while R starts in your browser.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16" aria-labelledby="benefits">
        <h2 id="benefits" className="text-center text-3xl font-bold tracking-tight">Why learn with R Academy?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">R is the language of statistics and data analysis, used in universities, hospitals, governments and companies worldwide. We make it approachable.</p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <li key={b.title} className="rounded-xl border border-border bg-card p-6">
              <b.icon className="size-7 text-primary" />
              <h3 className="mt-3 font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-surface" aria-labelledby="course">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 id="course" className="text-3xl font-bold tracking-tight">The course</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Three stages, ten modules. Each lesson has clear objectives, simple explanations, runnable examples with line-by-line notes, common mistakes, exercises, a quiz and a summary.</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {stages.map((st) => (
              <div key={st.number} className="rounded-xl border border-border bg-card p-6">
                <Badge variant="primary">{st.subtitle}</Badge>
                <h3 className="mt-3 text-xl font-semibold">{st.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{st.description}</p>
                <ol className="mt-4 space-y-2">
                  {modules.filter((m) => m.stage === st.number).map((m) => (
                    <li key={m.number}>
                      <Link href={`/learn/module/${m.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-2">
                        <span className="grid size-8 place-items-center rounded-md bg-primary-soft text-sm font-bold text-primary">{m.number}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">{m.title}</span>
                          <span className="block text-xs text-muted-foreground">{m.lessons.length} lessons · {m.exercises.length} exercises</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16" aria-labelledby="tools">
        <h2 id="tools" className="text-3xl font-bold tracking-tight">Everything you need to practise</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            { href: "/playground", icon: Code2, title: "R Code Playground", text: "A mini RStudio in your browser: console, plots, data viewer, environment, sample datasets and CSV upload." },
            { href: "/error-checker", icon: Bug, title: "R Code Error Checker", text: "Paste code, run it, and see the error type, the exact line, why it happened and verified corrected code." },
            { href: "/tutor", icon: Sparkles, title: "AI Tutor", text: "Six modes – beginner, step-by-step, debugging, practice, quiz and statistics. It runs code before telling you what it prints." },
            { href: "/exercises", icon: Dumbbell, title: "Exercises & challenges", text: "Easy, medium and challenge problems with automated tests, progressive hints and full solutions." },
            { href: "/projects", icon: FolderKanban, title: "Guided projects", text: "Clean messy data, explore surveys, analyse health data, and finish with a complete EDA report." },
            { href: "/reference", icon: BookOpen, title: "Reference & cheat sheets", text: "A searchable function reference, cheat sheets and a plain-English glossary." },
          ].map((t) => (
            <Link key={t.href} href={t.href} className="group flex gap-4 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md">
              <t.icon className="size-7 shrink-0 text-primary" />
              <span>
                <span className="flex items-center gap-1 font-semibold">{t.title} <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" /></span>
                <span className="mt-1 block text-sm text-muted-foreground">{t.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-gradient-to-b from-background to-primary-soft/50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <Trophy className="mx-auto size-10 text-primary" />
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Ready to write your first R program?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Your progress is saved automatically in this browser. Create an optional account later to sync across devices.</p>
          <div className="mt-6 flex justify-center"><HomeCta outline={outline} /></div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="size-4" /> Your code runs on your own device. Nothing you run is sent to our server.</p>
        </div>
      </section>
    </>
  );
}
