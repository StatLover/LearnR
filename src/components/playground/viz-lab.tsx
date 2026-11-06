"use client";

import { useMemo, useRef, useState } from "react";
import { Wand2 } from "lucide-react";
import { CodeRunner, type CodeRunnerHandle } from "@/components/code/code-runner";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";

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
const CHARTS: { id: Chart; label: string; needs: string }[] = [
  { id: "histogram", label: "Histogram", needs: "one numeric column" },
  { id: "bar", label: "Bar chart", needs: "one categorical column" },
  { id: "scatter", label: "Scatter plot", needs: "two numeric columns" },
  { id: "box", label: "Box plot", needs: "numeric by category" },
  { id: "line", label: "Line chart", needs: "values over time" },
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

export function VizLab() {
  const runner = useRef<CodeRunnerHandle>(null);
  const [dsId, setDsId] = useState("students");
  const ds = DATASETS.find((d) => d.id === dsId)!;
  const [chart, setChart] = useState<Chart>("scatter");
  const [engine, setEngine] = useState<"base" | "ggplot2">("ggplot2");
  const [x, setX] = useState(ds.num[3] ?? ds.num[0]);
  const [y, setY] = useState(ds.num[0]);
  const [group, setGroup] = useState(ds.cat[0] ?? "");
  const [title, setTitle] = useState("Study hours and math scores");
  const [color, setColor] = useState("steelblue");
  const available = CHARTS.filter((c) => (c.id === "line" ? Boolean(ds.time) : c.id === "bar" || c.id === "box" ? ds.cat.length > 0 : true));
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
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <form
        className="space-y-3 rounded-xl border border-border bg-card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          apply();
          setTimeout(() => void runner.current?.run(), 50);
        }}
      >
        <p className="font-semibold">Build a chart</p>
        <div className="space-y-1">
          <Label htmlFor="vz-ds">Dataset</Label>
          <Select id="vz-ds" className="w-full" value={dsId} onChange={(e) => changeDs(e.target.value)}>
            {DATASETS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="vz-chart">Chart type</Label>
          <Select id="vz-chart" className="w-full" value={chart} onChange={(e) => setChart(e.target.value as Chart)}>
            {available.map((c) => <option key={c.id} value={c.id}>{c.label} – {c.needs}</option>)}
          </Select>
        </div>
        <fieldset className="space-y-1">
          <legend className="text-sm font-medium">Draw with</legend>
          <div className="flex gap-2">
            {(["ggplot2", "base"] as const).map((e) => (
              <label key={e} className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary-soft">
                <input type="radio" name="engine" value={e} checked={engine === e} onChange={() => setEngine(e)} className="accent-[var(--primary)]" /> {e === "base" ? "Base R" : "ggplot2"}
              </label>
            ))}
          </div>
        </fieldset>
        {(chart === "histogram" || chart === "scatter") && (
          <div className="space-y-1">
            <Label htmlFor="vz-x">{chart === "histogram" ? "Column" : "X axis"}</Label>
            <Select id="vz-x" className="w-full" value={x} onChange={(e) => setX(e.target.value)}>
              {ds.num.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
        )}
        {(chart === "scatter" || chart === "box" || chart === "line") && (
          <div className="space-y-1">
            <Label htmlFor="vz-y">Y axis</Label>
            <Select id="vz-y" className="w-full" value={y} onChange={(e) => setY(e.target.value)}>
              {ds.num.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
        )}
        {(chart === "bar" || chart === "box" || ((chart === "scatter" || chart === "line") && engine === "ggplot2")) && ds.cat.length > 0 && (
          <div className="space-y-1">
            <Label htmlFor="vz-g">{chart === "scatter" || chart === "line" ? "Colour by (optional)" : "Category"}</Label>
            <Select id="vz-g" className="w-full" value={group} onChange={(e) => setGroup(e.target.value)}>
              {(chart === "scatter" || chart === "line") && <option value="">(none)</option>}
              {ds.cat.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="vz-title">Title</Label>
          <Input id="vz-title" value={title} onChange={(e) => setTitle(e.target.value.replace(/"/g, "'"))} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="vz-col">Colour</Label>
          <Select id="vz-col" className="w-full" value={color} onChange={(e) => setColor(e.target.value)}>
            {["steelblue", "darkgreen", "tomato", "purple", "orange", "grey40"].map((c) => <option key={c}>{c}</option>)}
          </Select>
        </div>
        <Button type="submit" className="w-full">
          <Wand2 /> Generate code &amp; draw
        </Button>
        <p className="text-xs text-muted-foreground">The chart is drawn from real R code that you can edit. Change it, press Run, then download the PNG from the Plots tab or the code with the download button.</p>
      </form>
      <div className="min-w-0">
        <CodeRunner ref={runner} workspace="viz" initialCode={initial} title="Visualization code" downloadName="my-chart.R" editorMinHeight={220} outputMaxHeight={720} />
      </div>
    </div>
  );
}
