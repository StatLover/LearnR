import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, PackageOpen, Timer } from "lucide-react";
import { Playground } from "@/components/playground/playground";
import { PlaygroundHero } from "@/components/playground/playground-hero";
import { Hexy } from "@/components/brand/mascot";
import { datasets } from "@/content/datasets";

export const metadata: Metadata = { title: "R Code Playground", description: "Write and run real R code in your browser – with plots, data tables, sample datasets, starter examples and CSV upload." };

const FACTS = [
  {
    icon: Cpu,
    color: "mint",
    title: "Runs on your device",
    text: (
      <>
        R Academy uses <strong className="text-foreground">webR</strong>, the official build of R for WebAssembly. Your code runs in your own browser, never on our server.
      </>
    ),
  },
  {
    icon: PackageOpen,
    color: "grape",
    title: "Packages on demand",
    text: (
      <>
        Base R, the built-in datasets and most popular packages (dplyr, tidyr, ggplot2, stringr, lubridate …) work – they install the first time you call <code className="font-mono text-foreground">library()</code>. Packages that need system libraries
        or unported compiled code are not available, and you will see a clear message when that happens.
      </>
    ),
  },
  {
    icon: Timer,
    color: "sun",
    title: "A safety time limit",
    text: (
      <>
        Code is stopped automatically after the time limit set in{" "}
        <Link href="/settings" className="font-bold text-primary underline-offset-4 hover:underline">
          Settings
        </Link>
        , and you can always press Stop.
      </>
    ),
  },
];

export default function PlaygroundPage() {
  return (
    <>
      <PlaygroundHero />
      <div className="mx-auto max-w-7xl px-5 py-6 sm:py-8">
        <Playground datasets={datasets} />

        <section aria-labelledby="about-webr" className="mt-10 rounded-3xl border-2 border-border bg-surface/70 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Hexy mood="think" size={52} />
            <h2 id="about-webr" className="font-display text-xl font-semibold">
              About running R in the browser
            </h2>
          </div>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {FACTS.map(({ icon: Icon, color, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl text-white" style={{ background: `var(--${color})`, color: color === "sun" ? "#3b2600" : undefined }} aria-hidden>
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-display font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm font-semibold text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
