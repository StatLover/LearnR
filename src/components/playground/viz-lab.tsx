"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChartCandlestick, ChartColumn, ChartColumnBig, ChartLine, ChartScatter, ExternalLink, Lightbulb, Palette, Wand2 } from "lucide-react";
import { CodeRunner, type CodeRunnerHandle } from "@/components/code/code-runner";
import { openInPlayground } from "@/components/code/code-block";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Choice, ExploreList, Panel } from "./labs/sim-lab";

interface DS {
  id: string;
  label: string;
  load: string;
  num: string[];
  cat: string[];
  time?: string;
}
const DATASETS: DS[] = [
  { id: "students", label: "Student performance", load: 'students <- read.csv("data/students.csv")', num: ["math", "reading", "science", "study_hours", "attendance", "age"], cat: ["class", "gender"] },
  { id: "patients", label: "Patient health", load: 'patients <- read.csv("data/patients.csv")', num: ["systolic_bp", "age", "bmi", "cholesterol", "exercise_days"], cat: ["diabetes", "smoker", "sex"] },
  { id: "housing", label: "House prices", load: 'housing <- read.csv("data/housing.csv")', num: ["price", "size_sqft", "bedrooms", "bathrooms", "year_built"], cat: ["neighborhood", "garage"] },
  { id: "survey", label: "Customer survey", load: 'survey <- read.csv("data/survey.csv")', num: ["satisfaction", "hours_online"], cat: ["region", "age_group", "favorite_feature", "recommend", "gender"] },
  { id: "sales", label: "Monthly sales", load: 'sales <- read.csv("data/sales.csv")\nsales$month <- as.Date(sales$month)', num: ["revenue", "units"], cat: ["region"], time: "month" },
  { id: "weather", label: "Daily weather", load: 'weather <- read.csv("data/weather.csv")\nweather$date <- as.Date(weather$date)', num: ["temp_max", "temp_min", "rain_mm"], cat: [], time: "date" },
  { id: "mtcars", label: "mtcars (built-in)", load: "mtcars$cyl <- factor(mtcars$cyl)", num: ["mpg", "hp", "wt", "qsec"], cat: ["cyl"] },
  { id: "iris", label: "iris (built-in)", load: "", num: ["Sepal.Length", "Sepal.Width", "Petal.Length", "Petal.Width"], cat: ["Species"] },
];
type Chart = "histogram" | "bar" | "scatter" | "box" | "line";
const CHARTS: { id: Chart; label: string; needs: string; icon: ReactNode }[] = [
  { id: "histogram", label: "Histogram", needs: "one numeric column", icon: <ChartColumnBig /> },
  { id: "bar", label: "Bar chart", needs: "one categorical column", icon: <ChartColumn /> },
  { id: "scatter", label: "Scatter plot", needs: "two numeric columns", icon: <ChartScatter /> },
  { id: "box", label: "Box plot", needs: "numeric by category", icon: <ChartCandlestick /> },
  { id: "line", label: "Line chart", needs: "values over time", icon: <ChartLine /> },
];
/** R colour names offered in the builder (shown as swatches of that colour). */
const COLOURS: { name: string; swatch: string }[] = [
  { name: "steelblue", swatch: "#4682b4" },
  { name: "darkgreen", swatch: "#006400" },
  { name: "tomato", swatch: "#ff6347" },
  { name: "purple", swatch: "#a020f0" },
  { name: "orange", swatch: "#ffa500" },
  { name: "grey40", swatch: "#666666" },
];

function generate(ds: DS, chart: Chart, engine: "base" | "ggplot2", x: string, y: string, group: string, title: string, color: string) {
  const d = ds.id;
  const t = title || "My chart";
  const lines: string[] = [];
  if (engine === "ggplot2") lines.push("library(ggplot2)");
  if (ds.load) lines.push(ds.load);
  lines.push("");
  if (engine === "base") {
    if (chart === "histogram") lines.push(`hist(${d}$${x}, main = "${t}", xlab = "${x}", col = "${color}", border = "white")`);
    if (chart === "bar") lines.push(`counts <- table(${d}$${group})`, `barplot(counts, main = "${t}", xlab = "${group}", ylab = "Count", col = "${color}")`);
    if (chart === "scatter") lines.push(`plot(${d}$${x}, ${d}$${y}, main = "${t}", xlab = "${x}", ylab = "${y}", pch = 19, col = "${color}")`, `abline(lm(${y} ~ ${x}, data = ${d}), lwd = 2)`);
    if (chart === "box") lines.push(`boxplot(${y} ~ ${group}, data = ${d}, main = "${t}", xlab = "${group}", ylab = "${y}", col = "${color}")`);
    if (chart === "line") {
      if (ds.cat.length && group) lines.push(`one <- ${d}[${d}$${group} == unique(${d}$${group})[1], ]`, `plot(one$${ds.time}, one$${y}, type = "l", lwd = 2, col = "${color}", main = "${t}", xlab = "${ds.time}", ylab = "${y}")`);
      else lines.push(`plot(${d}$${ds.time}, ${d}$${y}, type = "l", col = "${color}", main = "${t}", xlab = "${ds.time}", ylab = "${y}")`);
    }
  } else {
    if (chart === "histogram") lines.push(`ggplot(${d}, aes(x = ${x})) +`, `  geom_histogram(bins = 15, fill = "${color}", colour = "white") +`, `  labs(title = "${t}", x = "${x}", y = "Count") +`, "  theme_minimal()");
    if (chart === "bar") lines.push(`ggplot(${d}, aes(x = ${group})) +`, `  geom_bar(fill = "${color}") +`, `  labs(title = "${t}", x = "${group}", y = "Count") +`, "  theme_minimal()");
    if (chart === "scatter") lines.push(`ggplot(${d}, aes(x = ${x}, y = ${y}${group ? `, colour = ${group}` : ""})) +`, "  geom_point(size = 2.5, alpha = 0.8) +", `  geom_smooth(method = "lm", se = FALSE${group ? "" : `, colour = "black"`}) +`, `  labs(title = "${t}", x = "${x}", y = "${y}") +`, "  theme_minimal()");
    if (chart === "box") lines.push(`ggplot(${d}, aes(x = ${group}, y = ${y}, fill = ${group})) +`, "  geom_boxplot(show.legend = FALSE) +", `  labs(title = "${t}", x = "${group}", y = "${y}") +`, "  theme_minimal()");
    if (chart === "line") lines.push(`ggplot(${d}, aes(x = ${ds.time}, y = ${y}${ds.cat.length && group ? `, colour = ${group}` : ""})) +`, "  geom_line(linewidth = 1) +", `  labs(title = "${t}", x = "${ds.time}", y = "${y}") +`, "  theme_minimal()");
  }
  return lines.join("\n") + "\n";
}

/** Chart Builder: controls write real R plotting code that runs in the CodeRunner. */
export function VizLab() {
  const runner = useRef<CodeRunnerHandle>(null);
  const router = useRouter();
  const [dsId, setDsId] = useState("students");
  const ds = DATASETS.find((d) => d.id === dsId)!;
  const [chart, setChart] = useState<Chart>("scatter");
  const [engine, setEngine] = useState<"base" | "ggplot2">("ggplot2");
  const [x, setX] = useState(ds.num[3] ?? ds.num[0]);
  const [y, setY] = useState(ds.num[0]);
  const [group, setGroup] = useState(ds.cat[0] ?? "");
  const [title, setTitle] = useState("Study hours and math scores");
  const [color, setColor] = useState("steelblue");
  const available = (c: Chart) => (c === "line" ? Boolean(ds.time) : c === "bar" || c === "box" ? ds.cat.length > 0 : true);
  const initial = useMemo(() => generate(DATASETS[0], "scatter", "ggplot2", "study_hours", "math", "", "Study hours and math scores", "steelblue"), []);

  const changeDs = (id: string) => {
    const n = DATASETS.find((d) => d.id === id)!;
    setDsId(id);
    setX(n.num[0]);
    setY(n.num[1] ?? n.num[0]);
    setGroup(n.cat[0] ?? "");
    if ((chart === "line" && !n.time) || ((chart === "bar" || chart === "box") && !n.cat.length)) setChart("histogram");
  };
  const apply = () => runner.current?.setCode(generate(ds, chart, engine, x, y, chart === "scatter" && engine === "base" ? "" : group, title, color));

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
      <form
        className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-card)]"
        aria-labelledby="vz-heading"
        onSubmit={(e) => {
          e.preventDefault();
          apply();
          setTimeout(() => void runner.current?.run(), 50);
        }}
      >
        <div className="flex items-center gap-2 border-b-2 border-border bg-surface-2/60 px-4 py-2.5">
          <span className="grid size-8 place-items-center rounded-xl bg-pink text-white [&_svg]:size-4.5" aria-hidden>
            <Palette />
          </span>
          <h2 id="vz-heading" className="font-display text-base font-semibold">
            Build a chart
          </h2>
        </div>
        <div className="space-y-5 p-5">
          <div className="space-y-1.5">
            <Label htmlFor="vz-ds">Dataset</Label>
            <Select id="vz-ds" className="w-full" value={dsId} onChange={(e) => changeDs(e.target.value)}>
              {DATASETS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </Select>
          </div>

          <fieldset>
            <legend className="mb-1.5 text-sm font-bold">Chart type</legend>
            <div className="grid grid-cols-2 gap-2">
              {CHARTS.map((c) => {
                const on = chart === c.id;
                const ok = available(c.id);
                return (
                  <label
                    key={c.id}
                    title={ok ? `${c.label}: needs ${c.needs}` : `This dataset has no ${c.id === "line" ? "date column" : "categorical column"}`}
                    className={cn(
                      "press flex items-center gap-2 rounded-2xl border-2 px-3 py-2 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--ring)]",
                      on ? "border-pink bg-pink-soft [--press-shadow:var(--pink)]" : "border-border bg-surface [--press-shadow:var(--border)] hover:bg-surface-2",
                      ok ? "cursor-pointer" : "cursor-not-allowed opacity-45",
                    )}
                  >
                    <input type="radio" name="vz-chart" value={c.id} checked={on} disabled={!ok} onChange={() => setChart(c.id)} className="sr-only" />
                    <span className={cn("shrink-0 [&_svg]:size-5", on ? "text-pink" : "text-muted-foreground")} aria-hidden>
                      {c.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold leading-tight">{c.label}</span>
                      <span className="block text-[11px] font-semibold leading-tight text-muted-foreground">{c.needs}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <Choice
            label="Draw with"
            value={engine}
            onChange={setEngine}
            color="grape"
            options={[
              { value: "ggplot2", label: "ggplot2", hint: "Layered grammar" },
              { value: "base", label: "Base R", hint: "Built-in functions" },
            ]}
          />

          {(chart === "histogram" || chart === "scatter") && (
            <div className="space-y-1.5">
              <Label htmlFor="vz-x">{chart === "histogram" ? "Column" : "X axis"}</Label>
              <Select id="vz-x" className="w-full font-mono" value={x} onChange={(e) => setX(e.target.value)}>
                {ds.num.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </div>
          )}
          {(chart === "scatter" || chart === "box" || chart === "line") && (
            <div className="space-y-1.5">
              <Label htmlFor="vz-y">Y axis</Label>
              <Select id="vz-y" className="w-full font-mono" value={y} onChange={(e) => setY(e.target.value)}>
                {ds.num.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </div>
          )}
          {(chart === "bar" || chart === "box" || ((chart === "scatter" || chart === "line") && engine === "ggplot2")) && ds.cat.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="vz-g">{chart === "scatter" || chart === "line" ? "Colour by (optional)" : "Category"}</Label>
              <Select id="vz-g" className="w-full font-mono" value={group} onChange={(e) => setGroup(e.target.value)}>
                {(chart === "scatter" || chart === "line") && <option value="">(none)</option>}
                {ds.cat.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="vz-title">Title</Label>
            <Input id="vz-title" value={title} onChange={(e) => setTitle(e.target.value.replace(/"/g, "'"))} />
          </div>

          <fieldset>
            <legend className="mb-1.5 text-sm font-bold">
              Colour <span className="font-mono text-xs font-semibold text-muted-foreground">&quot;{color}&quot;</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {COLOURS.map((c) => {
                const on = color === c.name;
                return (
                  <label
                    key={c.name}
                    title={c.name}
                    className={cn(
                      "grid size-10 cursor-pointer place-items-center rounded-full border-2 transition-transform has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--ring)]",
                      on ? "scale-110 border-foreground" : "border-border hover:scale-105",
                    )}
                  >
                    <input type="radio" name="vz-colour" value={c.name} checked={on} onChange={() => setColor(c.name)} className="sr-only" aria-label={c.name} />
                    <span className="size-7 rounded-full" style={{ background: c.swatch }} aria-hidden />
                  </label>
                );
              })}
            </div>
          </fieldset>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            <Wand2 /> Generate code &amp; draw
          </Button>
          <p className="text-xs font-semibold text-muted-foreground">
            The chart is drawn from real R code that you can edit. Change it, press Run, then download the PNG from the Plots tab or the code with the download button.
          </p>
        </div>
      </form>
      <div className="min-w-0 space-y-6">
        <CodeRunner
          ref={runner}
          workspace="viz"
          initialCode={initial}
          title="Visualization code"
          downloadName="my-chart.R"
          editorMinHeight={220}
          outputMaxHeight={720}
          extraToolbar={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                openInPlayground(runner.current?.getCode() ?? initial);
                router.push("/playground");
              }}
              aria-label="Open this code in the playground"
            >
              <ExternalLink /> <span className="hidden md:inline">Playground</span>
            </Button>
          }
        />
        <Panel icon={<Lightbulb />} title="What to explore" color="sun">
          <ExploreList
            items={[
              <>Build the same chart with <strong>ggplot2</strong> and with <strong>Base R</strong>. Which code is easier to read? Which chart do you prefer?</>,
              <>In the code, change the colour to <code className="font-mono">&quot;darkorchid&quot;</code> and press Run. Any of R&apos;s 657 colour names works – try <code className="font-mono">colors()</code> in the playground.</>,
              <>Make a ggplot2 scatter plot of the students data, then type <code className="font-mono">+ facet_wrap(~ class)</code> right after <code className="font-mono">theme_minimal()</code> and press Run. What happens?</>,
              <>Which chart type answers “Do students who study more score higher?” best – and which one answers “How many students are in each class?”</>,
              <>Open the <strong>Plots</strong> tab and download your chart as a PNG.</>,
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
