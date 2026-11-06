"use client";

import { useState } from "react";
import { SeedControl, SimLab, Slider, Toggle, num } from "./sim-lab";

const DEFAULTS = { b0: 2, b1: 0.5, noise: 1, n: 50, seed: 3, truth: true, resid: false, full: false };
const SIZES = [5, 10, 20, 50, 100, 200, 500];

export function regressionCode(p: typeof DEFAULTS) {
  const where = p.b1 >= 0 ? "topleft" : "topright";
  return `# Regression Lab
set.seed(${p.seed})
b0    <- ${num(p.b0)}     # true intercept
b1    <- ${num(p.b1)}     # true slope
noise <- ${num(p.noise)}     # standard deviation of the random noise
n     <- ${p.n}     # number of points

# Simulate data: a straight line plus random noise
x <- runif(n, min = 0, max = 10)
y <- b0 + b1 * x + rnorm(n, sd = noise)

# Fit a linear model
model <- lm(y ~ x)

plot(x, y, pch = 19, cex = 1.3, col = adjustcolor("darkorange", alpha.f = 0.75),
     main = paste("n =", n, "  noise sd =", noise))
${p.resid ? `segments(x, y, x, fitted(model), col = "grey60")   # residuals\n` : ""}${p.truth ? `abline(a = b0, b = b1, col = "grey50", lwd = 2, lty = 2)   # true line\n` : ""}abline(model, col = "dodgerblue", lwd = 3)                   # fitted line
legend("${where}", legend = c(${p.truth ? '"true line", ' : ""}"fitted line"),
       col = c(${p.truth ? '"grey50", ' : ""}"dodgerblue"), lty = c(${p.truth ? "2, " : ""}1), lwd = c(${p.truth ? "2, " : ""}3), bty = "n")
${p.full ? `
summary(model)
` : `
round(coef(model), 3)
cat("R-squared:  ", round(summary(model)$r.squared, 3), "\\n")
cat("Residual sd:", round(sigma(model), 3), "  (true noise sd:", noise, ")\\n")
`}`;
}

export function RegressionLab() {
  const [p, setP] = useState(DEFAULTS);
  const set = <K extends keyof typeof DEFAULTS>(k: K) => (v: (typeof DEFAULTS)[K]) => setP((s) => ({ ...s, [k]: v }));
  const code = regressionCode(p);

  return (
    <SimLab
      workspace="lab:regression"
      code={code}
      color="tangerine"
      onReset={() => setP(DEFAULTS)}
      caption={
        <code className="font-mono text-[13px]">
          y = {num(p.b0)} {p.b1 < 0 ? "−" : "+"} {num(Math.abs(p.b1))} · x + noise (sd {num(p.noise)})
        </code>
      }
      plotAlt={`Scatter plot of ${p.n} simulated points from the line y = ${num(p.b0)} + ${num(p.b1)} x with noise standard deviation ${num(p.noise)}, with the fitted regression line${p.truth ? " and the true line (dashed)" : ""}${p.resid ? " and vertical residual lines" : ""}. The estimates and R-squared are printed in the console.`}
      controls={
        <>
          <Slider id="reg-b0" label="True intercept (b0)" value={p.b0} onChange={(v) => set("b0")(Number(v.toFixed(1)))} min={-5} max={5} step={0.5} format={num} color="tangerine" />
          <Slider id="reg-b1" label="True slope (b1)" value={p.b1} onChange={(v) => set("b1")(Number(v.toFixed(1)))} min={-2} max={2} step={0.1} format={num} color="tangerine" hint="How much y changes when x goes up by 1." />
          <Slider id="reg-noise" label="Noise (sd)" value={p.noise} onChange={(v) => set("noise")(Number(v.toFixed(1)))} min={0.1} max={8} step={0.1} format={num} color="coral" hint="How far points scatter around the true line." />
          <Slider id="reg-n" label="Number of points (n)" value={p.n} onChange={set("n")} values={SIZES} color="sky" />
          <SeedControl id="reg-seed" value={p.seed} onChange={set("seed")} color="pink" />
          <div className="grid gap-2">
            <Toggle id="reg-truth" label="Show the true line" checked={p.truth} onChange={set("truth")} />
            <Toggle id="reg-resid" label="Show residuals" hint="The vertical gaps the model could not explain." checked={p.resid} onChange={set("resid")} />
            <Toggle id="reg-full" label="Print the full summary(model)" checked={p.full} onChange={set("full")} />
          </div>
        </>
      }
      explore={[
        <>Set the noise to <strong>0.1</strong>. How close is the fitted line to the true line? What is R²?</>,
        <>Now raise the noise step by step. Watch <strong>R² fall</strong> – even though the true slope never changes!</>,
        <>Set the true slope to <strong>0</strong>. What slope does lm() estimate? What happens to R²?</>,
        <>With noise = 5, compare <strong>n = 10</strong> and <strong>n = 500</strong> and roll a few seeds. Which sample size gives estimates closer to the truth?</>,
        <>Turn on <strong>residuals</strong>. Small residuals compared with the spread of y mean a high R².</>,
      ]}
      concept={{
        title: "How noise changes R²",
        body: (
          <>
            <p>
              <code className="font-mono text-foreground">lm(y ~ x)</code> finds the line that makes the squared <strong>residuals</strong> as small as possible. Its slope estimates the true slope b1.
            </p>
            <p>
              <strong>R² = 1 − (residual variation / total variation)</strong>: the share of the variation in y that the line explains.
            </p>
            <ul className="space-y-1.5 rounded-2xl border-2 border-border bg-surface p-3">
              <li>More <strong>noise</strong> → bigger residuals → <strong>lower R²</strong>, but the slope is still right on average.</li>
              <li>More <strong>data</strong> → more precise estimates; R² does not simply grow with n.</li>
              <li>A steeper slope (relative to the noise) → <strong>higher R²</strong>.</li>
            </ul>
          </>
        ),
      }}
    />
  );
}
