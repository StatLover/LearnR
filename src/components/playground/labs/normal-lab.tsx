"use client";

import { useState } from "react";
import { SeedControl, SimLab, Slider, Toggle, num } from "./sim-lab";

const DEFAULTS = { mu: 50, sigma: 10, n: 200, seed: 42, bands: true, fixed: true };
const SIZES = [10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

export function normalCode(p: typeof DEFAULTS) {
  return `# Normal Distribution Lab
set.seed(${p.seed})
mu    <- ${num(p.mu)}    # true mean
sigma <- ${num(p.sigma)}    # true standard deviation
n     <- ${p.n}   # sample size

# Draw n random values from the normal distribution
x <- rnorm(n, mean = mu, sd = sigma)

# Make room for the tallest bar and the peak of the curve
top <- max(hist(x, breaks = 30, plot = FALSE)$density, dnorm(mu, mean = mu, sd = sigma))

# Histogram on the density scale, with the true bell curve on top
hist(x, breaks = 30, freq = FALSE, col = "skyblue", border = "white",
     ylim = c(0, 1.1 * top),${p.fixed ? "\n     xlim = c(-50, 150)," : ""}
     main = paste0("n = ", n, " values from a normal distribution"),
     xlab = "x")
curve(dnorm(x, mean = mu, sd = sigma), add = TRUE, col = "tomato", lwd = 3)
${p.bands ? `
# Dashed lines at 1, 2 and 3 standard deviations from the mean
abline(v = mu + c(-3, -2, -1, 1, 2, 3) * sigma, lty = 2, col = "grey50")
abline(v = mu, lwd = 2, col = "grey40")
` : ""}
summary(x)
cat("Sample mean:", round(mean(x), 2), "  (true mean:", mu, ")\\n")
cat("Sample sd:  ", round(sd(x), 2), "  (true sd:", sigma, ")\\n")

# The 68-95-99.7 rule: % of values within 1, 2 and 3 sd of the mean
within <- c(mean(abs(x - mu) <= 1 * sigma),
            mean(abs(x - mu) <= 2 * sigma),
            mean(abs(x - mu) <= 3 * sigma))
names(within) <- c("within 1 sd", "within 2 sd", "within 3 sd")
round(100 * within, 1)
`;
}

/** Illustration of the 68–95–99.7 rule (drawn from the formula, not from R). */
function RuleDiagram() {
  const W = 300;
  const H = 120;
  const sx = (z: number) => W / 2 + z * 44;
  const sy = (z: number) => 96 - 78 * Math.exp(-(z * z) / 2);
  const path = (a: number, b: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const z = a + ((b - a) * i) / 40;
      pts.push(`${sx(z).toFixed(1)},${sy(z).toFixed(1)}`);
    }
    return `M${sx(a)},96 L${pts.join(" L")} L${sx(b)},96 Z`;
  };
  return (
    <figure className="rounded-2xl border-2 border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Illustration: a bell curve with the middle band (±1 sd) holding 68%, ±2 sd holding 95% and ±3 sd holding 99.7% of the values.">
        <path d={path(-3, 3)} fill="var(--teal-soft)" />
        <path d={path(-2, 2)} fill="var(--teal)" opacity="0.35" />
        <path d={path(-1, 1)} fill="var(--teal)" opacity="0.7" />
        <line x1="10" y1="96" x2={W - 10} y2="96" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" />
        {[-3, -2, -1, 0, 1, 2, 3].map((z) => (
          <text key={z} x={sx(z)} y="112" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--muted-foreground)">
            {z === 0 ? "μ" : `${z > 0 ? "+" : "−"}${Math.abs(z)}σ`}
          </text>
        ))}
        <text x={sx(0)} y="70" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff">68%</text>
        <text x={sx(-1.5)} y="88" textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--foreground)">95%</text>
        <text x={sx(1.5)} y="88" textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--foreground)">95%</text>
        <text x={sx(2.55)} y="80" textAnchor="middle" fontSize="9" fontWeight="800" fill="var(--muted-foreground)">99.7%</text>
      </svg>
      <figcaption className="mt-1 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Illustration – the rule for a perfect normal curve</figcaption>
    </figure>
  );
}

export function NormalLab() {
  const [p, setP] = useState(DEFAULTS);
  const set = <K extends keyof typeof DEFAULTS>(k: K) => (v: (typeof DEFAULTS)[K]) => setP((s) => ({ ...s, [k]: v }));
  const code = normalCode(p);

  return (
    <SimLab
      workspace="lab:normal"
      code={code}
      color="teal"
      onReset={() => setP(DEFAULTS)}
      caption={
        <code className="font-mono text-[13px]">
          x &lt;- rnorm({p.n}, mean = {num(p.mu)}, sd = {num(p.sigma)})
        </code>
      }
      plotAlt={`Histogram of ${p.n} random values from a normal distribution with mean ${p.mu} and standard deviation ${p.sigma}, on the density scale, with the true normal curve drawn on top${p.bands ? " and dashed lines at 1, 2 and 3 standard deviations" : ""}.`}
      controls={
        <>
          <Slider id="nl-mu" label="Mean (μ)" value={p.mu} onChange={set("mu")} min={0} max={100} color="teal" hint="Where the centre of the bell sits." />
          <Slider id="nl-sd" label="Standard deviation (σ)" value={p.sigma} onChange={set("sigma")} min={1} max={25} step={0.5} format={num} color="teal" hint="How spread out the values are." />
          <Slider id="nl-n" label="Sample size (n)" value={p.n} onChange={set("n")} values={SIZES} format={(v) => v.toLocaleString("en-US")} color="sky" />
          <SeedControl id="nl-seed" value={p.seed} onChange={set("seed")} color="grape" />
          <div className="grid gap-2">
            <Toggle id="nl-bands" label="Show ±1, 2, 3 sd lines" checked={p.bands} onChange={set("bands")} />
            <Toggle id="nl-fixed" label="Fixed x-axis (−50 to 150)" hint="Turn off to let R zoom in on the data." checked={p.fixed} onChange={set("fixed")} />
          </div>
        </>
      }
      explore={[
        <>Move the <strong>standard deviation</strong> from 5 to 20. The bell gets wider – and lower. Why must the peak drop? (Hint: the total area under the curve is always 1.)</>,
        <>Set <strong>n = 10</strong>, then <strong>n = 10,000</strong>. When does the histogram match the red curve? How close are the sample mean and sd to the true values?</>,
        <>Check the last line of the console. Are the percentages close to <strong>68, 95 and 99.7</strong>? Change μ and σ – do the percentages change?</>,
        <>Keep n = 25 and press the dice a few times. How much does the sample mean jump around? Try the same with n = 1,000.</>,
        <>Move the mean while the axis is fixed. Does the shape change at all, or only its position?</>,
      ]}
      concept={{
        title: "The 68–95–99.7 rule",
        body: (
          <>
            <RuleDiagram />
            <p>
              In a normal distribution, about <strong>68%</strong> of values lie within 1 standard deviation of the mean, about <strong>95%</strong> within 2, and about <strong>99.7%</strong> within 3.
              This is true for <em>every</em> mean and standard deviation.
            </p>
            <p>
              <code className="font-mono text-foreground">rnorm(n, mean, sd)</code> draws random values, and <code className="font-mono text-foreground">dnorm()</code> gives the height of the true curve. With{" "}
              <code className="font-mono text-foreground">freq = FALSE</code> the histogram shows densities, so both use the same scale.
            </p>
          </>
        ),
      }}
    />
  );
}
