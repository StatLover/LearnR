"use client";

import { useState } from "react";
import { SeedControl, SimLab, Slider, Toggle, num } from "./sim-lab";

const DEFAULTS = { r: 0.6, n: 100, seed: 7, line: true, outlier: false };
const SIZES = [5, 10, 20, 50, 100, 200, 500, 1000];

function strength(r: number) {
  const a = Math.abs(r);
  const dir = r > 0 ? "positive" : r < 0 ? "negative" : "";
  if (a < 0.1) return "no correlation";
  if (a < 0.3) return `a weak ${dir} correlation`;
  if (a < 0.7) return `a moderate ${dir} correlation`;
  if (a < 1) return `a strong ${dir} correlation`;
  return `a perfect ${dir} correlation`;
}

export function correlationCode(p: typeof DEFAULTS) {
  return `# Correlation Lab
set.seed(${p.seed})
r <- ${num(p.r)}     # target correlation
n <- ${p.n}     # number of points

# Two variables with a true correlation of r
x <- rnorm(n)
y <- r * x + sqrt(1 - r^2) * rnorm(n)
${p.outlier ? `
# Add one unusual point (an outlier)
x <- c(x, 3)
y <- c(y, -3)
` : ""}
plot(x, y, pch = 19, cex = 1.3, col = adjustcolor("dodgerblue", alpha.f = 0.6),
     xlim = c(-4, 4), ylim = c(-4, 4),
     main = paste("Target r =", r, "  n =", n))
${p.outlier ? `points(3, -3, pch = 21, bg = "orange", cex = 2.2, lwd = 2)\n` : ""}${p.line ? `abline(lm(y ~ x), col = "tomato", lwd = 3)\n` : ""}
# The correlation R measured in this sample
cor(x, y)
cat("r squared:", round(cor(x, y)^2, 3), "\\n")
${p.outlier ? `
# Rank-based (Spearman) correlation is less sensitive to outliers
cor(x, y, method = "spearman")
` : ""}`;
}

export function CorrelationLab() {
  const [p, setP] = useState(DEFAULTS);
  const set = <K extends keyof typeof DEFAULTS>(k: K) => (v: (typeof DEFAULTS)[K]) => setP((s) => ({ ...s, [k]: v }));
  const code = correlationCode(p);

  return (
    <SimLab
      workspace="lab:correlation"
      code={code}
      color="sky"
      onReset={() => setP(DEFAULTS)}
      caption={
        <span>
          Target: <strong className="text-foreground">{strength(p.r)}</strong> <span className="font-mono">(r = {num(p.r)})</span>
        </span>
      }
      plotAlt={`Scatter plot of ${p.n} simulated points with a target correlation of ${num(p.r)}${p.line ? ", with the fitted regression line" : ""}${p.outlier ? ", plus one outlier at x = 3, y = −3" : ""}. The measured correlation is printed in the console.`}
      controls={
        <>
          <Slider id="cor-r" label="Target correlation (r)" value={p.r} onChange={(v) => set("r")(Number(v.toFixed(2)))} min={-1} max={1} step={0.05} format={(v) => num(v)} color="sky" hint="−1 = perfect negative, 0 = none, +1 = perfect positive." />
          <Slider id="cor-n" label="Number of points (n)" value={p.n} onChange={set("n")} values={SIZES} format={(v) => v.toLocaleString("en-US")} color="grape" />
          <SeedControl id="cor-seed" value={p.seed} onChange={set("seed")} color="pink" />
          <div className="grid gap-2">
            <Toggle id="cor-line" label="Show the fitted line" checked={p.line} onChange={set("line")} />
            <Toggle id="cor-out" label="Add an outlier at (3, −3)" hint="One unusual point – watch cor(x, y)." checked={p.outlier} onChange={set("outlier")} />
          </div>
        </>
      }
      explore={[
        <>Set r to <strong>0</strong>. What does “no correlation” look like? Is the fitted line perfectly flat?</>,
        <>Compare <strong>r = 0.3</strong> and <strong>r = 0.9</strong>. How tight does the cloud have to be before you would call it strong?</>,
        <>Make r <strong>negative</strong>. What changes in the plot, and in the sign of cor(x, y)?</>,
        <>With <strong>n = 10</strong>, roll a few new seeds. How far is the measured cor(x, y) from your target? Now try n = 1,000.</>,
        <>Set r = 0.8 and n = 20, then <strong>add the outlier</strong>. How much does one point change r? Compare with the Spearman correlation.</>,
      ]}
      concept={{
        title: "What r tells you",
        body: (
          <>
            <p>
              Pearson’s correlation <strong>r</strong> measures how closely points follow a <strong>straight line</strong>, from −1 to +1. Its square, <strong>r²</strong>, is the share of the variation in y that a straight line in x can explain.
            </p>
            <p>
              The recipe <code className="font-mono text-foreground">y &lt;- r * x + sqrt(1 - r^2) * rnorm(n)</code> mixes x with fresh noise so that the <em>true</em> correlation is exactly r. Each sample still varies – especially small ones.
            </p>
            <p>
              Remember: correlation describes a pattern, it does <strong>not</strong> prove that x causes y.
            </p>
          </>
        ),
      }}
    />
  );
}
