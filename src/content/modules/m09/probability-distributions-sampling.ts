import type { Lesson } from "../../types";

export const probabilityDistributionsSamplingLesson: Lesson = {
  id: "probability-distributions-sampling",
  module: 9,
  title: "Probability, Distributions and Sampling",
  summary: "Understand probability, work with the normal, binomial and uniform distributions, and see how random samples vary.",
  minutes: 40,
  objectives: [
    "Explain probability as a long-run proportion and simulate random events with sample() and set.seed()",
    "Use dnorm(), pnorm(), qnorm() and rnorm() to answer questions about a normal distribution",
    "Compute binomial probabilities with dbinom() and pbinom(), and uniform ones with punif() and runif()",
    "Tell a population from a sample and draw random samples in R",
    "Describe sampling variability: why sample means differ, and why bigger samples vary less",
  ],
  intro: `Module 7 described the data you **have**. Statistical analysis goes one step further: it uses a **sample** (the people you measured) to learn about a **population** (everybody you care about). Because a sample is chosen by chance, its results contain some luck – and to judge how much, we need the language of **probability**.

In this lesson you will learn what probability means, meet three famous **probability distributions** (the normal "bell curve", the binomial and the uniform), and use R's \`d\`, \`p\`, \`q\` and \`r\` functions to calculate with them. Then you will draw random samples yourself and watch something important happen: every sample gives a slightly different answer. Understanding that **sampling variability** is the foundation for everything else in this module – confidence intervals, hypothesis tests and regression.`,
  sections: [
    {
      id: "probability-basics",
      title: "Probability: how often in the long run?",
      blocks: [
        {
          kind: "definition",
          term: "Probability",
          md: "A number between **0** (impossible) and **1** (certain) that says how likely an event is. A probability of 0.25 means: if you repeated the situation many, many times, the event would happen in about 25% of the repetitions.",
        },
        {
          kind: "text",
          md: `A fair coin lands heads with probability 1/2 = 0.5. A fair die shows a six with probability 1/6 ≈ 0.167. That does not mean that exactly one roll in six is a six – in 6 rolls you might get no six at all, or three. It means that over **thousands** of rolls the proportion of sixes settles close to 1/6.

R can **simulate** random events, which lets you check this "long-run" idea in a second. \`sample(1:6, size = 600, replace = TRUE)\` rolls a die 600 times: it picks from the values 1 to 6, 600 times, and \`replace = TRUE\` puts each value back so it can be picked again.`,
        },
        {
          kind: "code",
          example: {
            id: "dice-simulation",
            title: "Rolling a die 600 times",
            code: `set.seed(42)
rolls <- sample(1:6, size = 600, replace = TRUE)

table(rolls)
mean(rolls == 6)
1 / 6`,
            explanation: [
              { code: "set.seed(42)", text: "Fixes the starting point of R's random-number generator, so you get exactly the same \"random\" rolls every time you run this code (see the callout below)." },
              { code: "rolls <- sample(1:6, size = 600, replace = TRUE)", text: "600 simulated rolls of a fair die." },
              { code: "table(rolls)", text: "How often each face came up." },
              { code: "mean(rolls == 6)", text: "`rolls == 6` is TRUE for every six; the mean of TRUE/FALSE values is the proportion of sixes." },
              { code: "1 / 6", text: "The theoretical probability, for comparison." },
            ],
            output: `rolls
  1   2   3   4   5   6
100 117  91  92 101  99
[1] 0.165
[1] 0.1666667`,
            outputNote: "Each face appeared roughly 100 times (600 / 6), but not exactly – that is randomness. The proportion of sixes, 0.165, is very close to the true probability 0.167.",
            tryIt: "Change `size = 600` to `size = 60` and then to `size = 60000`. How close does the proportion of sixes get to 1/6 each time?",
          },
        },
        {
          kind: "callout",
          tone: "info",
          title: "What set.seed() does",
          md: "Computers cannot really be random. They produce *pseudo-random* numbers with a recipe that starts from a number called the **seed**. The same seed always produces the same sequence. `set.seed(42)` therefore makes your random code **reproducible**: you, your teacher and R Academy's checker all get identical results. Any whole number works as a seed; just call `set.seed()` once, before the random code.",
        },
        {
          kind: "code",
          example: {
            id: "seed-demo",
            title: "Same seed, same random numbers",
            code: `set.seed(42)
sample(1:6, size = 5, replace = TRUE)
sample(1:6, size = 5, replace = TRUE)

set.seed(42)
sample(1:6, size = 5, replace = TRUE)`,
            explanation: [
              { code: "set.seed(42)", text: "Start the generator at seed 42." },
              { code: "sample(1:6, size = 5, replace = TRUE)", text: "The second call continues the sequence, so it gives different rolls." },
            ],
            output: `[1] 1 5 1 1 2
[1] 4 2 2 1 4
[1] 1 5 1 1 2`,
            outputNote: "After resetting the seed to 42, the first five rolls are repeated exactly (`1 5 1 1 2`).",
          },
        },
      ],
    },
    {
      id: "distributions",
      title: "Probability distributions and R's d-p-q-r functions",
      blocks: [
        {
          kind: "definition",
          term: "Probability distribution",
          md: "A description of **all possible values** of a random quantity and **how likely** each one is. For a fair die: the values 1–6, each with probability 1/6. A *discrete* distribution has separate values you can count (number of heads); a *continuous* one can take any value in a range (a person's height).",
        },
        {
          kind: "text",
          md: `R has the same four functions for every distribution. Their names are a **letter** plus the distribution's **short name** (\`norm\` = normal, \`binom\` = binomial, \`unif\` = uniform):`,
        },
        {
          kind: "table",
          caption: "The d-p-q-r naming system (shown for the normal distribution)",
          headers: ["Letter", "Function", "Question it answers", "Example"],
          rows: [
            ["d", "`dnorm()`", "How high is the curve at x? (for counts: the probability of exactly x)", "`dbinom(5, 10, 0.5)` – P(exactly 5 heads in 10 flips)"],
            ["p", "`pnorm()`", "What is the probability of a value **less than or equal to** x?", "`pnorm(180, 170, 10)` – P(height ≤ 180)"],
            ["q", "`qnorm()`", "Which value has this probability below it? (the inverse of p)", "`qnorm(0.9, 170, 10)` – the 90th percentile"],
            ["r", "`rnorm()`", "Give me random values from this distribution", "`rnorm(5, 170, 10)` – five random heights"],
          ],
        },
      ],
    },
    {
      id: "normal-distribution",
      title: "The normal distribution: the bell curve",
      blocks: [
        {
          kind: "text",
          md: `Many measurements – heights, blood pressure, measurement errors, test scores – pile up around an average and become rarer the further you go from it, in a symmetric **bell shape**. This shape is the **normal distribution**. It is completely described by two numbers: its **mean** (where the peak is) and its **standard deviation** (how wide the bell is).

The normal distribution has a famous rule of thumb, the **68–95–99.7 rule**:

* about **68%** of values lie within **1 SD** of the mean,
* about **95%** within **2 SDs**,
* about **99.7%** within **3 SDs**.

If adult heights in a city are normal with mean 170 cm and SD 10 cm, then about 68% of adults are between 160 and 180 cm, and about 95% between 150 and 190 cm.`,
        },
        {
          kind: "diagram",
          name: "normal-curve",
          caption: "The normal curve: symmetric around the mean, with about 68%, 95% and 99.7% of the values within 1, 2 and 3 standard deviations.",
        },
        {
          kind: "text",
          md: `### Probabilities are areas

For a continuous variable, a probability is an **area under the curve**. The total area is 1 (100%). \`pnorm(x, mean, sd)\` returns the area to the **left** of x – the probability of a value **at most** x. For "more than x", subtract from 1; for "between a and b", subtract two \`pnorm()\` values.`,
        },
        {
          kind: "code",
          example: {
            id: "pnorm-heights",
            title: "pnorm(): probabilities from the bell curve",
            code: `pnorm(180, mean = 170, sd = 10)
1 - pnorm(190, mean = 170, sd = 10)
pnorm(180, mean = 170, sd = 10) - pnorm(160, mean = 170, sd = 10)`,
            explanation: [
              { code: "pnorm(180, mean = 170, sd = 10)", text: "P(height ≤ 180 cm): the area to the left of 180." },
              { code: "1 - pnorm(190, mean = 170, sd = 10)", text: "P(height > 190 cm): everything (1) minus the area to the left of 190." },
              { code: "pnorm(180, mean = 170, sd = 10) - pnorm(160, mean = 170, sd = 10)", text: "P(160 < height ≤ 180): the area left of 180 minus the area left of 160." },
            ],
            output: `[1] 0.8413447
[1] 0.02275013
[1] 0.6826895`,
            outputNote: "About **84%** of adults are at most 180 cm tall, only about **2.3%** are taller than 190 cm, and **68.3%** are between 160 and 180 cm – exactly the \"68\" of the 68–95–99.7 rule, since 160 and 180 are one SD either side of the mean.",
            tryIt: "What proportion of adults is shorter than 155 cm? Taller than 175 cm?",
          },
        },
        {
          kind: "code",
          example: {
            id: "qnorm-percentiles",
            title: "qnorm(): from a probability back to a value",
            code: `qnorm(0.9, mean = 170, sd = 10)
qnorm(0.5, mean = 170, sd = 10)
qnorm(0.975)`,
            explanation: [
              { code: "qnorm(0.9, mean = 170, sd = 10)", text: "Which height has 90% of adults below it? (the 90th percentile)" },
              { code: "qnorm(0.5, mean = 170, sd = 10)", text: "The 50th percentile is the median – for a symmetric bell curve it equals the mean." },
              { code: "qnorm(0.975)", text: "Without `mean` and `sd`, R uses the *standard* normal distribution (mean 0, SD 1)." },
            ],
            output: `[1] 182.8155
[1] 170
[1] 1.959964`,
            outputNote: "90% of adults are shorter than about **182.8 cm**. The last number, **1.96**, is famous: 95% of a normal distribution lies within 1.96 SDs of the mean (2.5% in each tail). You will meet it again in confidence intervals.",
          },
        },
        {
          kind: "code",
          example: {
            id: "dnorm-density",
            title: "dnorm(): the height of the curve",
            code: `dnorm(170, mean = 170, sd = 10)
dnorm(190, mean = 170, sd = 10)
curve(dnorm(x, mean = 170, sd = 10), from = 130, to = 210,
      xlab = "Height (cm)", ylab = "Density")`,
            explanation: [
              { code: "dnorm(170, mean = 170, sd = 10)", text: "The height of the curve at the mean – its peak." },
              { code: "dnorm(190, mean = 170, sd = 10)", text: "Much lower in the tail, two SDs away." },
              { code: "curve(dnorm(x, mean = 170, sd = 10), from = 130, to = 210,", text: "`curve()` draws a function of `x` over a range – here the whole bell curve." },
            ],
            output: `[1] 0.03989423
[1] 0.005399097`,
            plot: true,
            outputNote: "For a continuous variable these numbers are **densities**, not probabilities: the probability of being *exactly* 170.000… cm is zero. Densities are only useful for comparing how likely different regions are (values near 170 are about 7 times as common as values near 190) and for drawing the curve. For probabilities, use `pnorm()`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "rnorm-simulation",
            title: "rnorm(): random values from a normal distribution",
            code: `set.seed(1)
heights <- rnorm(1000, mean = 170, sd = 10)

mean(heights)
sd(heights)
mean(abs(heights - 170) <= 10)
hist(heights, breaks = 30, main = "1,000 simulated heights", xlab = "Height (cm)")`,
            explanation: [
              { code: "heights <- rnorm(1000, mean = 170, sd = 10)", text: "1,000 random heights from the normal distribution." },
              { code: "mean(heights)", text: "Close to 170, but not exactly – it is a random sample." },
              { code: "mean(abs(heights - 170) <= 10)", text: "The proportion of simulated heights within 10 cm (1 SD) of 170." },
              { code: "hist(heights, breaks = 30, ...)", text: "A histogram shows the bell shape appearing from the random values." },
            ],
            output: `[1] 169.8835
[1] 10.34916
[1] 0.674`,
            plot: true,
            outputNote: "The simulated data has mean 169.9 and SD 10.3, close to the true 170 and 10, and **67.4%** of the values are within one SD of the mean – the 68% rule in action.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m9-prob-q1",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `pnorm(0)`,
            options: ["[1] 0", "[1] 0.5", "[1] 0.3989423", "[1] 1"],
            answer: 1,
            explanation: "Without `mean` and `sd`, `pnorm()` uses the standard normal distribution (mean 0, SD 1). The curve is symmetric around 0, so exactly half of the area lies to the left of 0.",
            optionFeedback: [
              "`pnorm()` returns an area to the left of x – and half the bell lies left of its center.",
              "Correct.",
              "0.3989 is `dnorm(0)`, the height of the curve at 0, not an area.",
              "1 is the total area; only half of it lies left of the mean.",
            ],
            concept: "normal-distribution",
          },
        },
      ],
    },
    {
      id: "binomial-distribution",
      title: "The binomial distribution: counting successes",
      blocks: [
        {
          kind: "text",
          md: `The **binomial distribution** answers questions like *"If I flip a coin 10 times, how likely are exactly 5 heads?"* It applies whenever:

1. there is a fixed number of **trials** (\`size\`, e.g. 10 flips),
2. each trial has two outcomes, "success" or "failure" (heads or tails),
3. the probability of success (\`prob\`) is the same every time, and the trials do not influence each other.

You can work out a tiny case by hand. Flip a fair coin twice. The four equally likely outcomes are HH, HT, TH and TT, so P(0 heads) = 1/4, P(1 head) = 2/4 and P(2 heads) = 1/4. \`dbinom(1, size = 2, prob = 0.5)\` gives that 0.5.`,
        },
        {
          kind: "code",
          example: {
            id: "binomial-probabilities",
            title: "dbinom() and pbinom()",
            code: `dbinom(5, size = 10, prob = 0.5)
pbinom(2, size = 10, prob = 0.5)
1 - pbinom(7, size = 10, prob = 0.7)
round(dbinom(0:10, size = 10, prob = 0.5), 3)`,
            explanation: [
              { code: "dbinom(5, size = 10, prob = 0.5)", text: "P(exactly 5 heads in 10 fair flips). For counts, `d` really is a probability." },
              { code: "pbinom(2, size = 10, prob = 0.5)", text: "P(2 heads **or fewer**): `p` adds up the probabilities of 0, 1 and 2." },
              { code: "1 - pbinom(7, size = 10, prob = 0.7)", text: "A basketball player makes 70% of free throws. P(at least 8 of 10) = 1 − P(7 or fewer)." },
              { code: "round(dbinom(0:10, size = 10, prob = 0.5), 3)", text: "`0:10` asks for every possible number of heads at once – the whole distribution." },
            ],
            output: `[1] 0.2460938
[1] 0.0546875
[1] 0.3827828
 [1] 0.001 0.010 0.044 0.117 0.205 0.246 0.205 0.117 0.044 0.010 0.001`,
            outputNote: "Even the *most likely* result, exactly 5 heads, only happens about **25%** of the time. Two heads or fewer happens about 5.5% of the time. The player makes at least 8 of 10 free throws with probability **0.38**. The last line is the full distribution: symmetric around 5 (the first value is 0 heads, the last is 10 heads), and its values add up to 1.",
            tryIt: "How likely is it to get 8 or more heads in 10 flips of a fair coin? (Hint: `1 - pbinom(7, ...)`.)",
          },
        },
        {
          kind: "code",
          example: {
            id: "binomial-barplot",
            title: "Drawing the binomial distribution",
            code: `probs <- dbinom(0:10, size = 10, prob = 0.5)
barplot(probs, names.arg = 0:10,
        xlab = "Number of heads in 10 flips", ylab = "Probability")`,
            explanation: [
              { code: "probs <- dbinom(0:10, size = 10, prob = 0.5)", text: "The probability of every possible count, 0 to 10." },
              { code: "barplot(probs, names.arg = 0:10,", text: "A bar chart, one bar per possible count, labelled 0 to 10 (a discrete distribution is drawn with bars)." },
            ],
            plot: true,
            tryIt: "Change `prob = 0.5` to `prob = 0.8`. Where is the peak now?",
          },
        },
      ],
    },
    {
      id: "uniform-distribution",
      title: "The uniform distribution: everything equally likely",
      blocks: [
        {
          kind: "text",
          md: `In a **uniform distribution** every value in a range is equally likely – its "curve" is a flat line. Example: a bus comes every 10 minutes and you arrive at a random moment, so your waiting time is uniform between 0 and 10 minutes. The chance of waiting at most 3 minutes is simply 3/10 = 0.3.`,
        },
        {
          kind: "code",
          example: {
            id: "uniform-functions",
            title: "punif(), dunif() and runif()",
            code: `punif(3, min = 0, max = 10)
dunif(4, min = 0, max = 10)

set.seed(3)
round(runif(5, min = 0, max = 10), 2)`,
            explanation: [
              { code: "punif(3, min = 0, max = 10)", text: "P(wait ≤ 3 minutes): 3 out of the 10-minute range." },
              { code: "dunif(4, min = 0, max = 10)", text: "The height of the flat line: 1 / (10 − 0) everywhere between 0 and 10." },
              { code: "round(runif(5, min = 0, max = 10), 2)", text: "Five random waiting times, rounded to 2 decimals. (`runif()` is read \"r-unif\", not \"run if\"!)" },
            ],
            output: `[1] 0.3
[1] 0.1
[1] 1.68 8.08 3.85 3.28 6.02`,
            outputNote: "There is a **30%** chance of waiting 3 minutes or less. The random waiting times are spread evenly over 0–10 minutes – no value is more typical than another, unlike the bell curve.",
          },
        },
      ],
    },
    {
      id: "sampling",
      title: "Populations, samples and sampling variability",
      blocks: [
        {
          kind: "definition",
          term: "Population and sample",
          md: "The **population** is the whole group you want to know about (all adults in a country, all customers of an app). A **sample** is the part of it you actually measure. In a **random sample** every member of the population has the same chance of being chosen, which makes the sample fair – not biased towards some kind of member.",
        },
        {
          kind: "text",
          md: `\`sample(x, size)\` picks \`size\` random elements of \`x\` **without replacement** (nobody is picked twice) – exactly how you would draw names from a hat. You can use it to choose random rows of a data frame, too: \`sample(nrow(df), 3)\` gives three random row numbers.`,
        },
        {
          kind: "code",
          example: {
            id: "sample-basics",
            title: "Drawing random samples",
            code: `set.seed(2026)
sample(1:10, size = 3)
sample(c("Ana", "Ben", "Cleo", "Dev", "Eli"), size = 2)

students <- read.csv("data/students.csv")
set.seed(5)
students[sample(nrow(students), 3), c("name", "class", "math")]`,
            explanation: [
              { code: "sample(1:10, size = 3)", text: "Three different numbers from 1 to 10." },
              { code: `sample(c("Ana", "Ben", "Cleo", "Dev", "Eli"), size = 2)`, text: "Two random names – like drawing two winners of a raffle." },
              { code: "sample(nrow(students), 3)", text: "Three random row numbers between 1 and 60." },
              { code: `students[sample(nrow(students), 3), c("name", "class", "math")]`, text: "Use them to select those rows (and three columns) of the data frame." },
            ],
            output: `[1] 9 1 6
[1] "Eli"  "Cleo"
    name class math
2    Ben     A   54
43  Ravi     B   59
57 Felix     C   74`,
            outputNote: "Three random students from the class of 60. The row names (2, 43, 57) tell you which rows were picked.",
          },
        },
        {
          kind: "text",
          md: `### Every sample tells a slightly different story

Pretend our 60 students are the whole population. Their true mean math score is 74.65. If we could only test **10** students, picked at random, what would we find?`,
        },
        {
          kind: "code",
          example: {
            id: "sampling-variability",
            title: "Three samples, three different means",
            code: `students <- read.csv("data/students.csv")
mean(students$math)

set.seed(10)
mean(sample(students$math, size = 10))
mean(sample(students$math, size = 10))
mean(sample(students$math, size = 10))`,
            explanation: [
              { code: "mean(students$math)", text: "The population mean (all 60 students)." },
              { code: "mean(sample(students$math, size = 10))", text: "Draw 10 random students and average their scores. Each call draws a new sample." },
            ],
            output: `[1] 74.65
[1] 71
[1] 70.6
[1] 78.4`,
            outputNote: "The three sample means are 71, 70.6 and 78.4 – all different from the true 74.65 and from each other. Nobody made a mistake: this is **sampling variability**, the natural variation of results from one random sample to the next.",
          },
        },
        {
          kind: "text",
          md: `To see the pattern behind the variability, repeat the sampling **many** times. \`replicate(n, expression)\` runs an expression \`n\` times and collects the results. Below we simulate a big population of 100,000 heights (mean 170, SD 10) and draw 1,000 samples of 10 people and 1,000 samples of 40 people. The collection of all those sample means is called the **sampling distribution** of the mean.`,
        },
        {
          kind: "code",
          example: {
            id: "sampling-distribution",
            title: "Bigger samples vary less",
            code: `set.seed(123)
population <- rnorm(100000, mean = 170, sd = 10)

means_10 <- replicate(1000, mean(sample(population, size = 10)))
means_40 <- replicate(1000, mean(sample(population, size = 40)))

mean(means_10)
sd(means_10)
sd(means_40)
hist(means_10, breaks = 30, main = "1,000 sample means (n = 10)",
     xlab = "Sample mean height (cm)")`,
            explanation: [
              { code: "population <- rnorm(100000, mean = 170, sd = 10)", text: "An imaginary population of 100,000 adults." },
              { code: "means_10 <- replicate(1000, mean(sample(population, size = 10)))", text: "1,000 times: draw 10 people, compute their mean height. The result is a vector of 1,000 sample means." },
              { code: "means_40 <- replicate(1000, mean(sample(population, size = 40)))", text: "The same with samples of 40 people." },
              { code: "mean(means_10)", text: "On average, the sample means hit the true mean." },
              { code: "sd(means_10)", text: "How much the sample means vary from sample to sample." },
            ],
            output: `[1] 170.083
[1] 3.263781
[1] 1.549503`,
            plot: true,
            outputNote: "Two key facts: (1) the sample means are centred on the true mean (170.08 ≈ 170) – random samples are not biased; (2) samples of 10 miss by about **3.3 cm** typically, samples of 40 by only about **1.5 cm**. Quadrupling the sample size halved the variability. This spread of sample means has a name – the **standard error** – and the formula SD / √n predicts it: 10 / √10 ≈ 3.16 and 10 / √40 ≈ 1.58. The histogram is bell-shaped too: sample means tend to follow a normal distribution.",
            tryIt: "Add a third line with `size = 160`. Predict its standard deviation with 10 / sqrt(160) before you run it.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m9-prob-q2",
            type: "multiple-choice",
            prompt: "Two researchers each survey 50 randomly chosen customers of the same shop and get different average satisfaction scores. What is the most likely reason?",
            options: [
              "Sampling variability – different random samples contain different people",
              "One of them must have made a calculation error",
              "The population changed between the two surveys",
              "Samples of 50 are always useless",
            ],
            answer: 0,
            explanation: "Random samples from the same population almost never give identical results. Statistics does not remove this variability – it measures it, so we can say how much our result might differ from the truth.",
            optionFeedback: [
              "Correct.",
              "Different results are expected even when everyone calculates correctly.",
              "That is possible, but differences appear even when the population stays exactly the same.",
              "A sample of 50 can be very informative; we just need to account for its variability.",
            ],
            concept: "sampling",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Forgetting set.seed() before random code",
      wrong: `rolls <- sample(1:6, size = 5, replace = TRUE)
rolls`,
      why: "The code works, but every run gives different numbers, so nobody (including you tomorrow) can reproduce your results. Call `set.seed()` with any number before the random code.",
      right: `set.seed(1)
rolls <- sample(1:6, size = 5, replace = TRUE)
rolls`,
    },
    {
      title: "Sampling more values than exist without replace = TRUE",
      wrong: `sample(1:6, size = 10)`,
      error: "cannot take a sample larger than the population",
      why: "By default `sample()` draws **without** replacement, like names from a hat – after 6 draws the hat is empty. For dice rolls or coin flips, where values can repeat, add `replace = TRUE`.",
      right: `set.seed(1)
sample(1:6, size = 10, replace = TRUE)`,
    },
    {
      title: "Using dnorm() when you want a probability",
      wrong: `dnorm(180, mean = 170, sd = 10)`,
      why: "This runs, but `dnorm()` returns the **height** of the curve (0.024), not the probability of a height of at most 180. For \"less than or equal to\" probabilities use `pnorm()`.",
      right: `pnorm(180, mean = 170, sd = 10)`,
    },
    {
      title: "Giving the variance instead of the standard deviation",
      wrong: `# heights have mean 170 and variance 100
pnorm(180, mean = 170, sd = 100)`,
      why: "The normal functions expect the **standard deviation** in `sd`. A variance of 100 means an SD of √100 = 10. Using 100 makes the curve ten times too wide and the answer wrong (0.54 instead of 0.84).",
      right: `# heights have mean 170 and variance 100
pnorm(180, mean = 170, sd = sqrt(100))`,
    },
  ],
  exerciseIds: ["m9-normal-probabilities", "m9-sampling-variability"],
  quiz: [
    {
      id: "m9-prob-q3",
      type: "multiple-choice",
      prompt: "Exam scores are normally distributed with mean 60 and SD 8. Which code gives the score that only the top 10% of students exceed?",
      options: [
        "qnorm(0.9, mean = 60, sd = 8)",
        "pnorm(0.9, mean = 60, sd = 8)",
        "dnorm(0.9, mean = 60, sd = 8)",
        "rnorm(0.9, mean = 60, sd = 8)",
      ],
      answer: 0,
      explanation: "You know a probability (90% of students are below the score) and want the value: that is a quantile, `qnorm(0.9, 60, 8)` ≈ 70.3.",
      optionFeedback: [
        "Correct – `q` goes from a probability to a value.",
        "`pnorm()` goes the other way: from a value to a probability.",
        "`dnorm()` gives the height of the curve.",
        "`rnorm()` generates random numbers.",
      ],
      concept: "normal-distribution",
    },
    {
      id: "m9-prob-q4",
      type: "predict-output",
      prompt: "What does this code print? (Think of the outcomes of two coin flips.)",
      code: `dbinom(0, size = 2, prob = 0.5)`,
      options: ["[1] 0", "[1] 0.25", "[1] 0.5", "[1] 0.75"],
      answer: 1,
      explanation: "With two fair flips the outcomes HH, HT, TH and TT are equally likely. Zero heads happens only with TT: 1 of 4 outcomes, so 0.25.",
      optionFeedback: [
        "Getting no heads is possible (TT).",
        "Correct.",
        "0.5 is the probability of exactly **one** head (HT or TH).",
        "0.75 is the probability of **at least one** head.",
      ],
      concept: "binomial-distribution",
    },
    {
      id: "m9-prob-q5",
      type: "fill-blank",
      prompt: "Complete the code to simulate 20 rolls of a die (values can repeat).",
      code: `set.seed(1)
rolls <- sample(1:6, size = 20, replace = ___)`,
      accept: ["TRUE", "T"],
      hint: "Without this, `sample()` refuses to draw more than 6 values.",
      explanation: "`replace = TRUE` puts every value back after it is drawn, so the same face can appear many times – just like a real die.",
      concept: "sampling",
    },
    {
      id: "m9-prob-q6",
      type: "true-false",
      prompt: "In a normal distribution, about 95% of the values lie within 2 standard deviations of the mean.",
      answer: true,
      explanation: "True – that is the middle part of the 68–95–99.7 rule. In R: `pnorm(2) - pnorm(-2)` is 0.954.",
      concept: "normal-distribution",
    },
    {
      id: "m9-prob-q7",
      type: "find-error",
      prompt: "This code should simulate drawing 8 cards numbered 1–5, putting each card back after drawing it. Click the line that fails.",
      code: `set.seed(3)
cards <- 1:5
draws <- sample(cards, size = 8)
table(draws)`,
      errorLine: 3,
      errorKind: "error",
      fix: `set.seed(3)
cards <- 1:5
draws <- sample(cards, size = 8, replace = TRUE)
table(draws)`,
      explanation: "There are only 5 cards, and `sample()` draws without replacement by default, so it cannot draw 8. Putting cards back means `replace = TRUE`.",
      concept: "sampling",
    },
  ],
  keyPoints: [
    "A probability is a number from 0 to 1: the long-run proportion of times an event happens.",
    "Use `set.seed()` before random code so the results are reproducible.",
    "Every distribution has four functions: `d` (density/probability of exactly x), `p` (probability ≤ x), `q` (value for a probability) and `r` (random values).",
    "The normal distribution is a symmetric bell defined by its mean and SD; about 68%, 95% and 99.7% of values lie within 1, 2 and 3 SDs.",
    "The binomial distribution counts successes in a fixed number of yes/no trials (`dbinom()`, `pbinom()`); the uniform makes every value in a range equally likely (`punif()`, `runif()`).",
    "A sample is part of a population; `sample()` draws random samples (add `replace = TRUE` to allow repeats).",
    "Sample results vary from sample to sample; bigger samples vary less – the standard error SD / √n measures this.",
  ],
  concepts: ["probability", "normal-distribution", "binomial-distribution", "uniform-distribution", "sampling"],
  glossary: ["probability", "distribution", "normal-distribution", "population", "sample", "random-sample", "standard-error", "histogram"],
  playground: `# Probability and sampling – experiment here!
set.seed(1)

pnorm(185, mean = 170, sd = 10)
dbinom(3, size = 5, prob = 0.5)
sample(1:6, size = 10, replace = TRUE)
mean(rnorm(100, mean = 50, sd = 5))
`,
  datasets: ["students"],
};
