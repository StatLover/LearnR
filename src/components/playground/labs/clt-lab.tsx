"use client";

import { useState } from "react";
import { Choice, SeedControl, SimLab, Slider, Toggle } from "./sim-lab";

type Pop = "exp" | "unif" | "dice" | "income";

const POPS: Record<Pop, { label: string; hint: string; comment: string; draw: string; mean: string; sd: string; alt: string }> = {
  exp: {
    label: "Waiting times",
    hint: "rexp() – right-skewed",
    comment: "exponential with rate = 1 (strongly right-skewed)",
    draw: "rexp(k, rate = 1)",
    mean: "1",
    sd: "1",
    alt: "a right-skewed exponential population",
  },
  unif: {
    label: "Flat (uniform)",
    hint: "runif() – every value equally likely",
    comment: "uniform between 0 and 10 (flat, no peak at all)",
    draw: "runif(k, min = 0, max = 10)",
    mean: "5",
    sd: "10 / sqrt(12)",
    alt: "a flat uniform population between 0 and 10",
  },
  dice: {
    label: "Dice rolls",
    hint: "sample(1:6) – only 6 values",
    comment: "rolls of a fair six-sided die",
    draw: "sample(1:6, k, replace = TRUE)",
    mean: "3.5",
    sd: "sqrt(35 / 12)",
    alt: "a population of fair die rolls, 1 to 6",
  },
  income: {
    label: "Incomes",
    hint: "rlnorm() – very skewed",
    comment: "log-normal, like incomes (very right-skewed)",
    draw: "rlnorm(k, meanlog = 0, sdlog = 1)",
    mean: "exp(0.5)",
    sd: "sqrt((exp(1) - 1) * exp(1))",
    alt: "a very right-skewed log-normal population, like incomes",
  },
};

const DEFAULTS = { pop: "exp" as Pop, n: 5, reps: 1000, seed: 1, curve: true, sameAxis: true };
const NS = [1, 2, 3, 5, 10, 20, 30, 50, 100];
const REPS = [100, 250, 500, 1000, 2000, 5000];

export function cltCode(p: typeof DEFAULTS) {
  const pop = POPS[p.pop];
  return `# Sampling & the Central Limit Theorem
set.seed(${p.seed})
n    <- ${p.n}      # size of each sample
reps <- ${p.reps}   # how many samples we take

# The population: ${pop.comment}
draw     <- function(k) ${pop.draw}
pop_mean <- ${pop.mean}
pop_sd   <- ${pop.sd}

# Take many samples and keep the mean of each one
means <- replicate(reps, mean(draw(n)))

pop <- draw(10000)   # a big batch to show the population's shape
se  <- pop_sd / sqrt(n)
top <- max(hist(means, breaks = 30, plot = FALSE)$density${p.curve ? ", dnorm(0, sd = se)" : ""})

par(mfrow = c(1, 2))
hist(pop, breaks = 40, freq = FALSE, col = "orange", border = "white",
     main = "The population", xlab = "value")
hist(means, breaks = 30, freq = FALSE, col = "mediumpurple", border = "white",
     ylim = c(0, 1.1 * top),${p.sameAxis ? " xlim = range(pop)," : ""}
     main = paste(reps, "sample means, n =", n), xlab = "sample mean")
${p.curve ? `curve(dnorm(x, mean = pop_mean, sd = se), add = TRUE, col = "tomato", lwd = 3)\n` : ""}
cat("Mean of the sample means:", round(mean(means), 3), "  population mean:", round(pop_mean, 3), "\\n")
cat("SD of the sample means:  ", round(sd(means), 3), "\\n")
cat("Theory: sigma / sqrt(n) =", round(se, 3), "\\n")
`;
}

export function CltLab() {
  const [p, setP] = useState(DEFAULTS);
  const set = <K extends keyof typeof DEFAULTS>(k: K) => (v: (typeof DEFAULTS)[K]) => setP((s) => ({ ...s, [k]: v }));
  const code = cltCode(p);

  return (
    <SimLab
      workspace="lab:clt"
      code={code}
      color="grape"
      onReset={() => setP(DEFAULTS)}
      caption={
        <code className="font-mono text-[13px]">
          means &lt;- replicate({p.reps}, mean(draw({p.n})))
        </code>
      }
      plotAlt={`Two histograms. Left: ${POPS[p.pop].alt}. Right: the means of ${p.reps} random samples of size ${p.n} from it${p.curve ? ", with the normal curve predicted by the Central Limit Theorem drawn on top" : ""}.`}
      controls={
        <>
          <Choice
            label="Population"
            value={p.pop}
            onChange={set("pop")}
            color="tangerine"
            options={(Object.keys(POPS) as Pop[]).map((k) => ({ value: k, label: POPS[k].label, hint: POPS[k].hint }))}
          />
          <Slider id="clt-n" label="Sample size (n)" value={p.n} onChange={set("n")} values={NS} color="grape" hint="How many values go into each mean." />
          <Slider id="clt-reps" label="Number of samples" value={p.reps} onChange={set("reps")} values={REPS} format={(v) => v.toLocaleString("en-US")} color="sky" />
          <SeedControl id="clt-seed" value={p.seed} onChange={set("seed")} color="pink" />
          <div className="grid gap-2">
            <Toggle id="clt-curve" label="Show the predicted normal curve" checked={p.curve} onChange={set("curve")} />
            <Toggle id="clt-axis" label="Use the population's x-axis" hint="Shows how much narrower the means are." checked={p.sameAxis} onChange={set("sameAxis")} />
          </div>
        </>
      }
      explore={[
        <>Set <strong>n = 1</strong>. Why does the right plot look exactly like the population?</>,
        <>Now try n = 5, 10 and 30. When does the histogram of means start to look like a <strong>bell</strong>, even though the population is skewed?</>,
        <>Compare <strong>“SD of the sample means”</strong> with <strong>σ / √n</strong> in the console. What happens to it when you go from n = 5 to n = 20 (four times as many)?</>,
        <>Switch to the very skewed <strong>Incomes</strong> population. Do you need a bigger n before the bell appears?</>,
        <>Change the <strong>number of samples</strong>. Does it change the spread of the means – or only how smooth the histogram looks?</>,
      ]}
      concept={{
        title: "The Central Limit Theorem",
        body: (
          <>
            <p>
              Whatever shape the population has, the <strong>means of random samples</strong> of size n are approximately <strong>normally distributed</strong> once n is large enough.
            </p>
            <ul className="space-y-1.5 rounded-2xl border-2 border-border bg-surface p-3">
              <li>
                Centre: the population mean <strong>μ</strong>
              </li>
              <li>
                Spread: <strong>σ / √n</strong> – the <em>standard error</em>
              </li>
              <li>Shape: closer to a bell as n grows</li>
            </ul>
            <p>
              This is why confidence intervals and t-tests work for averages even when the raw data are skewed – and why bigger samples give more precise estimates: to halve the standard error you need <strong>four times</strong> as much data.
            </p>
          </>
        ),
      }}
    />
  );
}
