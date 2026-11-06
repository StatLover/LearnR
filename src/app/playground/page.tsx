import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Playground } from "@/components/playground/playground";
import { datasets } from "@/content/datasets";

export const metadata: Metadata = { title: "R Code Playground", description: "Write and run real R code in your browser – with plots, data tables, sample datasets and CSV upload." };

export default function PlaygroundPage() {
  return (
    <>
      <PageHeader
        icon={<Code2 />}
        title="R Code Playground"
        description="A full R environment in your browser – like a mini RStudio. Write code, run it, see the console, plots, data tables and your variables. Load a sample dataset or upload your own CSV. Packages such as dplyr and ggplot2 install automatically the first time you call library()."
      />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Playground datasets={datasets} />
        <div className="mt-6 rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">About running R in the browser</p>
          <p className="mt-1">
            R Academy uses <strong>webR</strong>, the official build of R for WebAssembly. Your code runs on your own device, never on our server. Base R, the built-in datasets and most popular packages (dplyr, tidyr, ggplot2, stringr, lubridate …) work. Packages that need system libraries or unported compiled code are not available – when that happens you will see a clear message. Code is stopped automatically after the time limit set in Settings, and you can always press Stop.
          </p>
        </div>
      </div>
    </>
  );
}
