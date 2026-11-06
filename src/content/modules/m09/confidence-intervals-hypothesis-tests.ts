import type { Lesson } from "../../types";

export const confidenceIntervalsHypothesisTestsLesson: Lesson = {
  id: "confidence-intervals-hypothesis-tests",
  module: 9,
  title: "Confidence Intervals, Hypothesis Tests and p-values",
  summary: "Measure the uncertainty of an estimate with a confidence interval, and use hypothesis tests and p-values to judge evidence – correctly.",
  minutes: 45,
  objectives: [
    "Compute a standard error and explain what it measures",
    "Build a 95% confidence interval by hand (mean ± t × SE) and with t.test()",
    "Explain what \"95% confidence\" does and does not mean",
    "Describe the steps of a hypothesis test: null and alternative hypothesis, test statistic, p-value, significance level, decision",
    "Interpret a p-value correctly and avoid the most common misinterpretations",
  ],
  intro: `In the last lesson you saw that every random sample gives a slightly different answer. So when a survey of 150 patients finds an average blood pressure of 138.1, the honest question is: **how close is that to the truth for all patients?**

Statistics answers in two complementary ways. A **confidence interval** gives a range of plausible values for the unknown population number, such as "between 135.9 and 140.4". A **hypothesis test** asks a yes/no question – *is this coin fair? do these two groups differ?* – and measures how surprising the data would be if the boring answer ("no effect") were true. That measure of surprise is the famous, and often misunderstood, **p-value**.

This lesson builds both ideas from scratch with small examples you can follow by hand, then shows how R computes them.`,
  sections: [
    {
      id: "standard-error",
      title: "Estimates and their standard error",
      blocks: [
        {
          kind: "text",
          md: `A number computed from a sample to guess a population value is called an **estimate**. The sample mean estimates the population mean; a sample proportion estimates the population proportion.

An estimate on its own is not enough – we also need to know **how far off it might be**. You saw last lesson that sample means vary less when samples are bigger, and that this variation follows the formula SD / √n. That number has a name.`,
        },
        {
          kind: "definition",
          term: "Standard error (SE)",
          md: "The typical distance between an estimate and the true population value – the standard deviation of the estimate across many imaginary repeated samples. For a mean: **SE = s / √n**, where s is the sample standard deviation and n the sample size. Do not confuse it with the SD: the **SD** describes how much individual *values* vary; the **SE** describes how much the *mean* would vary from sample to sample.",
        },
        {
          kind: "code",
          example: {
            id: "standard-error",
            title: "The standard error of a mean",
            code: `battery_hours <- c(9.8, 10.4, 9.5, 10.9, 10.1, 9.7, 10.6, 10.0)

n <- length(battery_hours)
avg <- mean(battery_hours)
se <- sd(battery_hours) / sqrt(n)
avg
se`,
            explanation: [
              { code: "battery_hours <- c(9.8, 10.4, 9.5, 10.9, 10.1, 9.7, 10.6, 10.0)", text: "A company tests 8 phone batteries from a new production line: hours until empty." },
              { code: "n <- length(battery_hours)", text: "The sample size, 8." },
              { code: "se <- sd(battery_hours) / sqrt(n)", text: "The standard error: the SD of the values divided by the square root of n." },
            ],
            output: `[1] 10.125
[1] 0.1687665`,
            outputNote: "The batteries in the sample lasted **10.125 hours** on average. The standard error of about **0.17 hours** says that a mean computed from 8 batteries is typically about 0.17 hours away from the true mean of the whole production line.",
          },
        },
      ],
    },
    {
      id: "confidence-intervals",
      title: "Confidence intervals: a range of plausible values",
      blocks: [
        {
          kind: "text",
          md: `A **confidence interval** (CI) puts a margin around the estimate:

> **estimate ± critical value × SE**

For a 95% CI of a mean with a large sample, the critical value is about **1.96** (you met \`qnorm(0.975)\` last lesson: 95% of a normal distribution lies within 1.96 SDs of its center). With small samples we also have to *estimate* the SD, which adds extra uncertainty. To account for it we use a slightly wider bell curve, the **t-distribution**, with **n − 1 degrees of freedom**. Its critical value comes from \`qt(0.975, df = n - 1)\`.`,
        },
        {
          kind: "code",
          example: {
            id: "t-critical-values",
            title: "t critical values approach 1.96 as samples grow",
            code: `qt(0.975, df = c(4, 9, 29, 99, 999))
qnorm(0.975)`,
            explanation: [
              { code: "qt(0.975, df = c(4, 9, 29, 99, 999))", text: "The 97.5% point of t-distributions for samples of 5, 10, 30, 100 and 1000 values (df = n − 1). We use 0.975 because a 95% interval leaves 2.5% in each tail." },
              { code: "qnorm(0.975)", text: "The same point of the normal distribution, for comparison." },
            ],
            output: `[1] 2.776445 2.262157 2.045230 1.984217 1.962341
[1] 1.959964`,
            outputNote: "With only 5 observations the multiplier is 2.78 – the interval must be wider to stay honest about the extra uncertainty. From about 100 observations on, t and normal are practically the same (1.98 vs 1.96).",
          },
        },
        {
          kind: "code",
          example: {
            id: "ci-by-hand",
            title: "A 95% confidence interval by hand",
            code: `battery_hours <- c(9.8, 10.4, 9.5, 10.9, 10.1, 9.7, 10.6, 10.0)
n <- length(battery_hours)
avg <- mean(battery_hours)
se <- sd(battery_hours) / sqrt(n)

t_star <- qt(0.975, df = n - 1)
t_star
avg - t_star * se
avg + t_star * se`,
            explanation: [
              { code: "t_star <- qt(0.975, df = n - 1)", text: "The critical value for a 95% interval with 8 − 1 = 7 degrees of freedom." },
              { code: "avg - t_star * se", text: "The lower end: estimate minus margin." },
              { code: "avg + t_star * se", text: "The upper end: estimate plus margin." },
            ],
            output: `[1] 2.364624
[1] 9.725931
[1] 10.52407`,
            outputNote: "The margin is 2.36 × 0.169 ≈ 0.40 hours, so the 95% CI runs from **9.73 to 10.52 hours**. In words: *\"Based on these 8 batteries, we are 95% confident that the average battery life of the whole production line is between 9.7 and 10.5 hours.\"*",
          },
        },
        {
          kind: "code",
          example: {
            id: "ci-from-t-test",
            title: "Let t.test() do the work",
            code: `battery_hours <- c(9.8, 10.4, 9.5, 10.9, 10.1, 9.7, 10.6, 10.0)

result <- t.test(battery_hours)
result$conf.int`,
            explanation: [
              { code: "result <- t.test(battery_hours)", text: "`t.test()` computes a confidence interval (and a test, next lesson). We store the full result in `result`." },
              { code: "result$conf.int", text: "The result is a list; `$conf.int` extracts the confidence interval." },
            ],
            output: `[1]  9.725931 10.524069
attr(,"conf.level")
[1] 0.95`,
            outputNote: "Exactly our hand-made interval. The extra lines `attr(,\"conf.level\")` and `[1] 0.95` are an *attribute* – a label attached to the numbers saying that this is a 95% interval.",
            tryIt: "Run `t.test(battery_hours, conf.level = 0.90)$conf.int`. Is the 90% interval wider or narrower than the 95% one?",
          },
        },
        {
          kind: "code",
          example: {
            id: "ci-patients",
            title: "More data, narrower interval",
            code: `patients <- read.csv("data/patients.csv")
bp <- patients$systolic_bp

mean(bp)
sd(bp) / sqrt(length(bp))
t.test(bp)$conf.int
t.test(bp, conf.level = 0.99)$conf.int`,
            explanation: [
              { code: "sd(bp) / sqrt(length(bp))", text: "The standard error with n = 150 patients." },
              { code: "t.test(bp)$conf.int", text: "The 95% CI for the mean blood pressure of all patients like these." },
              { code: "t.test(bp, conf.level = 0.99)$conf.int", text: "`conf.level` changes the confidence level. Being more confident requires a wider interval." },
            ],
            output: `[1] 138.12
[1] 1.130418
[1] 135.8863 140.3537
attr(,"conf.level")
[1] 0.95
[1] 135.1705 141.0695
attr(,"conf.level")
[1] 0.99`,
            outputNote: "We are 95% confident that the mean systolic blood pressure of the clinic's patient population is between **135.9 and 140.4 mmHg**; the 99% interval (135.2 to 141.1) is wider. Two levers control the width: the confidence level (higher = wider) and the sample size (bigger = narrower, because SE = s / √n shrinks).",
          },
        },
      ],
    },
    {
      id: "ci-meaning",
      title: "What \"95% confident\" really means",
      blocks: [
        {
          kind: "text",
          md: `The 95% describes the **method**, not one particular interval. If you took many random samples and built a 95% interval from each, about **95% of those intervals would contain the true value** and about 5% would miss it. For your one interval you do not know which case you are in – hence "confident", not "certain".

We can check this with a simulation, because in a simulation we know the truth.`,
        },
        {
          kind: "code",
          example: {
            id: "ci-coverage",
            title: "How often does a 95% CI catch the true mean?",
            code: `set.seed(2024)
covers <- replicate(1000, {
  s <- rnorm(20, mean = 170, sd = 10)
  ci <- t.test(s)$conf.int
  ci[1] <= 170 & 170 <= ci[2]
})
mean(covers)`,
            explanation: [
              { code: "covers <- replicate(1000, {", text: "Repeat the code inside the braces 1,000 times and collect the results." },
              { code: "  s <- rnorm(20, mean = 170, sd = 10)", text: "Draw a sample of 20 heights from a population whose true mean we know: 170." },
              { code: "  ci <- t.test(s)$conf.int", text: "Build the 95% CI from that sample." },
              { code: "  ci[1] <= 170 & 170 <= ci[2]", text: "TRUE if the interval contains the true mean, FALSE if it misses." },
              { code: "mean(covers)", text: "The proportion of the 1,000 intervals that caught the true mean." },
            ],
            output: `[1] 0.956`,
            outputNote: "956 of the 1,000 intervals (95.6%) contained the true mean of 170, and 44 missed – just what \"95% confidence\" promises (up to simulation noise).",
          },
        },
        {
          kind: "table",
          caption: "Interpreting the battery interval 9.73 to 10.52 hours",
          headers: ["Statement", "Correct?"],
          rows: [
            ["We are 95% confident that the mean battery life of the production line is between 9.73 and 10.52 hours.", "Yes – this is the standard wording."],
            ["The method we used captures the true mean in 95% of samples.", "Yes – this is what the 95% means."],
            ["95% of the batteries last between 9.73 and 10.52 hours.", "No – the CI is about the **mean**, not individual batteries (individual values vary much more)."],
            ["The sample mean is between 9.73 and 10.52 hours with 95% probability.", "No – the sample mean (10.125) is known exactly; it is always in the middle of the interval."],
            ["If we repeated the study, 95% of new sample means would fall in this interval.", "No – that is a different (and false) claim about future samples."],
          ],
        },
        {
          kind: "question",
          question: {
            id: "m9-ci-q1",
            type: "multiple-choice",
            prompt: "A 95% confidence interval for the mean commute time in a city is 24 to 31 minutes. Which interpretation is correct?",
            options: [
              "We are 95% confident that the mean commute time of all commuters in the city is between 24 and 31 minutes",
              "95% of commuters travel between 24 and 31 minutes",
              "The sample mean has a 95% chance of being between 24 and 31 minutes",
              "There is a 5% chance that the data is wrong",
            ],
            answer: 0,
            explanation: "A CI is a range of plausible values for the **population mean**. The 95% refers to how often the method captures the true value across repeated samples.",
            optionFeedback: [
              "Correct.",
              "Individual commutes vary much more than the mean does; the CI is about the mean.",
              "The sample mean is the known center of the interval (27.5) – nothing random about it any more.",
              "The 5% is the long-run miss rate of the method, not a probability that the data is wrong.",
            ],
            concept: "confidence-intervals",
          },
        },
      ],
    },
    {
      id: "hypothesis-testing",
      title: "Hypothesis testing: the logic of a courtroom",
      blocks: [
        {
          kind: "text",
          md: `A hypothesis test works like a criminal trial. The defendant is assumed **innocent** until the evidence makes that assumption hard to believe. The court never proves innocence – it either finds enough evidence for "guilty" or it does not.

In statistics the "innocent" assumption is the **null hypothesis**: nothing special is going on (the coin is fair, the drug has no effect, the groups do not differ). We collect data and ask: *if the null hypothesis were true, how surprising would data like ours be?* If very surprising, we **reject** the null hypothesis in favour of the alternative.`,
        },
        {
          kind: "definition",
          term: "Null hypothesis (H₀) and alternative hypothesis (H₁)",
          md: "**H₀** is the \"no effect / no difference\" claim that the test tries to find evidence against, e.g. *the coin is fair: P(heads) = 0.5*. **H₁** (also written Hₐ) is what you conclude if the evidence against H₀ is strong, e.g. *the coin is not fair: P(heads) ≠ 0.5*.",
        },
        {
          kind: "diagram",
          name: "hypothesis-test",
          caption: "Every hypothesis test follows the same path: assume H₀, compute a test statistic from the data, turn it into a p-value, and compare the p-value with the significance level to decide.",
        },
        {
          kind: "steps",
          title: "The five steps of every hypothesis test",
          items: [
            "**State the hypotheses.** H₀: the coin is fair (P(heads) = 0.5). H₁: it is not (P(heads) ≠ 0.5).",
            "**Choose a significance level α** *before* looking at the data – usually α = 0.05 (5%).",
            "**Compute a test statistic** from the data – a number that measures how far the data is from what H₀ predicts (here simply the number of heads).",
            "**Find the p-value:** the probability, if H₀ were true, of a result at least as extreme as the one observed.",
            "**Decide:** if p ≤ α, reject H₀ (the result is *statistically significant*); if p > α, fail to reject H₀.",
          ],
        },
        {
          kind: "definition",
          term: "Significance level (α)",
          md: "The threshold for \"surprising enough\", chosen before the test (commonly 0.05). It is also the risk you accept of rejecting H₀ when H₀ is actually true: with α = 0.05, about 1 in 20 tests of a true null hypothesis will still come out \"significant\" by chance.",
        },
      ],
    },
    {
      id: "p-values",
      title: "Understanding p-values",
      blocks: [
        {
          kind: "text",
          md: `Your friend's coin landed heads **16 times in 20 flips**. Is the coin unfair? If the coin is fair (H₀), we expect about 10 heads. But fair coins do sometimes give 16 – how often? Let R flip a fair coin 20 times, ten thousand times over, and look.`,
        },
        {
          kind: "code",
          example: {
            id: "coin-simulation",
            title: "What a fair coin does",
            code: `set.seed(8)
heads <- rbinom(10000, size = 20, prob = 0.5)

hist(heads, breaks = seq(-0.5, 20.5, by = 1),
     main = "Heads in 20 flips of a fair coin", xlab = "Number of heads")
abline(v = 16, col = "red", lwd = 2)
mean(heads >= 16 | heads <= 4)`,
            explanation: [
              { code: "heads <- rbinom(10000, size = 20, prob = 0.5)", text: "10,000 experiments, each counting the heads in 20 flips of a **fair** coin – a world where H₀ is true." },
              { code: "hist(heads, breaks = seq(-0.5, 20.5, by = 1),", text: "One bar per possible number of heads (the breaks sit halfway between whole numbers)." },
              { code: "abline(v = 16, col = \"red\", lwd = 2)", text: "A red line at our friend's result." },
              { code: "mean(heads >= 16 | heads <= 4)", text: "The proportion of fair-coin experiments at least as extreme as 16 heads, in **either** direction (16 or more, or 4 or fewer). `|` means \"or\"." },
            ],
            output: `[1] 0.0119`,
            plot: true,
            outputNote: "Fair coins usually give 7 to 13 heads; a result as extreme as 16 happened in only **about 1.2%** of the simulated experiments. That proportion is (a simulation of) the **p-value**. We count both tails because H₁ says \"not fair\" in either direction – a *two-sided* test.",
          },
        },
        {
          kind: "definition",
          term: "p-value",
          md: "The probability of getting a result **at least as extreme as the one observed, assuming the null hypothesis is true**. A small p-value means the data would be surprising if H₀ were true – evidence against H₀.",
        },
        {
          kind: "text",
          md: `The binomial distribution from the last lesson gives the exact p-value without simulation, and R's \`binom.test()\` does the whole test in one call. Its printed output has the same layout as all of R's tests, so it is worth reading line by line.`,
        },
        {
          kind: "code",
          example: {
            id: "binom-test",
            title: "The exact test with binom.test()",
            code: `2 * (1 - pbinom(15, size = 20, prob = 0.5))

binom.test(16, 20, p = 0.5)`,
            explanation: [
              { code: "2 * (1 - pbinom(15, size = 20, prob = 0.5))", text: "P(16 or more heads) = 1 − P(15 or fewer). Doubling adds the equally likely other tail (4 or fewer)." },
              { code: "binom.test(16, 20, p = 0.5)", text: "The exact binomial test: 16 successes in 20 trials, H₀: probability = 0.5." },
            ],
            output: `[1] 0.01181793

\tExact binomial test

data:  16 and 20
number of successes = 16, number of trials = 20, p-value = 0.01182
alternative hypothesis: true probability of success is not equal to 0.5
95 percent confidence interval:
 0.563386 0.942666
sample estimates:
probability of success
                   0.8`,
            outputNote: `Line by line:

* **Exact binomial test** – the name of the test.
* **data: 16 and 20** – what was tested.
* **number of successes = 16, number of trials = 20, p-value = 0.01182** – the test statistic and the p-value (the same 0.0118 we computed; the simulation gave 0.0119).
* **alternative hypothesis: … not equal to 0.5** – H₁, two-sided.
* **95 percent confidence interval: 0.563 0.943** – plausible values for the coin's true probability of heads. 0.5 is **not** inside, which agrees with the test.
* **sample estimates: 0.8** – the observed proportion of heads, 16 / 20.

**Decision:** p = 0.012 ≤ 0.05, so we reject H₀. *"Getting 16 or more heads (or 4 or fewer) would happen only about 1.2% of the time with a fair coin, so the data gives evidence that the coin is not fair."*`,
          },
        },
        {
          kind: "code",
          example: {
            id: "p-value-compare",
            title: "Less extreme data, bigger p-value",
            code: `binom.test(12, 20, p = 0.5)$p.value
binom.test(16, 20, p = 0.5)$p.value`,
            explanation: [
              { code: "binom.test(12, 20, p = 0.5)$p.value", text: "Like any R test result, it is a list: `$p.value` extracts just the p-value." },
            ],
            output: `[1] 0.5034447
[1] 0.01181793`,
            outputNote: "12 heads in 20 flips is very ordinary for a fair coin (p = 0.50): no evidence against H₀. 16 heads is much more surprising (p = 0.012). The further the data is from what H₀ predicts, the smaller the p-value.",
            tryIt: "Try 14, 15 and 17 heads. Where does the p-value cross 0.05?",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "What a p-value is NOT",
          md: `* It is **not** the probability that H₀ is true. A p-value of 0.012 does *not* mean "a 1.2% chance the coin is fair". It is computed by *assuming* H₀ is true.
* It is **not** the probability that the result happened "by chance alone" in the everyday sense, and 1 − p is not the probability that H₁ is true.
* It does **not** measure the size or importance of an effect. A tiny, unimportant difference can have a tiny p-value if the sample is huge.
* p = 0.049 and p = 0.051 are practically the same evidence. The 0.05 line is a convention, not a law of nature.`,
        },
      ],
    },
    {
      id: "decisions-and-errors",
      title: "Decisions, errors and practical importance",
      blocks: [
        {
          kind: "text",
          md: `### "Fail to reject" is not "accept"

When p > α we say we **fail to reject H₀** – never that we "accept" or "prove" it. Back in the courtroom, "not guilty" means "not enough evidence", not "proven innocent". A large p-value can simply mean the sample was too small to detect a real effect. With our battery data, for example, a test could easily fail to detect a 5-minute difference in battery life, even if it exists.

### Two kinds of wrong decision

Because data is random, every decision can be wrong:`,
        },
        {
          kind: "table",
          caption: "The four possible outcomes of a test",
          headers: ["", "H₀ is actually true", "H₀ is actually false"],
          rows: [
            ["**Reject H₀** (p ≤ α)", "**Type I error** – a false alarm (probability α)", "Correct – a real effect detected"],
            ["**Fail to reject H₀** (p > α)", "Correct – no false alarm", "**Type II error** – a missed effect (more likely with small samples)"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "false-alarms",
            title: "When H₀ is true, about 5% of tests are still \"significant\"",
            code: `set.seed(11)
p_values <- replicate(1000, t.test(rnorm(30, mean = 0, sd = 1), mu = 0)$p.value)
mean(p_values < 0.05)`,
            explanation: [
              { code: "t.test(rnorm(30, mean = 0, sd = 1), mu = 0)$p.value", text: "Draw 30 values from a population whose mean really is 0, then test H₀: mean = 0 (a t-test – details in the next lesson). H₀ is **true** every time." },
              { code: "mean(p_values < 0.05)", text: "The proportion of the 1,000 tests that (wrongly) came out significant." },
            ],
            output: `[1] 0.056`,
            outputNote: "About 5% of the tests (here 5.6%) produced a false alarm, exactly as α = 0.05 allows. This is why running many tests and reporting only the significant ones is misleading: by chance alone, 1 in 20 will look \"significant\".",
          },
        },
        {
          kind: "code",
          example: {
            id: "practical-significance",
            title: "Statistically significant is not the same as important",
            code: `set.seed(4)
group_a <- rnorm(20000, mean = 100, sd = 15)
group_b <- rnorm(20000, mean = 100.5, sd = 15)

mean(group_b) - mean(group_a)
t.test(group_a, group_b)$p.value`,
            explanation: [
              { code: "group_a <- rnorm(20000, mean = 100, sd = 15)", text: "Two huge simulated groups of 20,000 people each, with a tiny true difference of 0.5 points on a test with SD 15." },
              { code: "mean(group_b) - mean(group_a)", text: "The observed difference in means." },
              { code: "t.test(group_a, group_b)$p.value", text: "The p-value of a test comparing the two groups." },
            ],
            output: `[1] 0.7110867
[1] 1.946175e-06`,
            outputNote: "The p-value is 0.0000019 (`e-06` means × 10⁻⁶) – extremely \"significant\" – yet the difference is less than 1 point on a scale where people typically differ by 15. With enough data, even trivial differences become significant. Always report the **size** of the effect (with a confidence interval), not just the p-value.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m9-ci-q2",
            type: "true-false",
            prompt: "A test gives p = 0.30. This shows that the null hypothesis is true.",
            answer: false,
            explanation: "False. A large p-value only means the data is **not surprising** under H₀, so there is not enough evidence to reject it. H₀ could still be false – for example, the sample may be too small to detect the effect. We \"fail to reject\" H₀; we never prove it.",
            concept: "p-values",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Using the SD instead of the SE in a confidence interval",
      wrong: `battery_hours <- c(9.8, 10.4, 9.5, 10.9, 10.1, 9.7, 10.6, 10.0)
t_star <- qt(0.975, df = 7)
mean(battery_hours) + c(-1, 1) * t_star * sd(battery_hours)`,
      why: "The margin of a CI for a mean uses the **standard error** s / √n, not the standard deviation s. With the SD the interval is √8 ≈ 2.8 times too wide – it describes where individual batteries fall, not where the mean is.",
      right: `battery_hours <- c(9.8, 10.4, 9.5, 10.9, 10.1, 9.7, 10.6, 10.0)
t_star <- qt(0.975, df = 7)
se <- sd(battery_hours) / sqrt(length(battery_hours))
mean(battery_hours) + c(-1, 1) * t_star * se`,
    },
    {
      title: "Using 0.95 instead of 0.975 for a 95% interval",
      wrong: `qt(0.95, df = 7)`,
      why: "A two-sided 95% interval leaves 2.5% in **each** tail, so the critical value is the 97.5% point: `qt(0.975, df)`. Using 0.95 gives a 90% interval.",
      right: `qt(0.975, df = 7)`,
    },
    {
      title: "Misspelling a part of a test result",
      wrong: `result <- t.test(c(9.8, 10.4, 9.5, 10.9))
result$confint`,
      why: "A test result is a list with fixed names (`p.value`, `conf.int`, `estimate`, `statistic` …). A wrong name such as `confint` or `pvalue` does not cause an error – R silently returns `NULL`. Use `names(result)` to see the correct names.",
      right: `result <- t.test(c(9.8, 10.4, 9.5, 10.9))
names(result)
result$conf.int`,
    },
    {
      title: "Concluding that H₀ is true",
      wrong: `p_value <- binom.test(12, 20, p = 0.5)$p.value
if (p_value > 0.05) print("The coin is fair")`,
      why: "A large p-value means **not enough evidence** against H₀ – it does not prove H₀. 12 heads in 20 flips is also quite likely for a coin with P(heads) = 0.6.",
      right: `p_value <- binom.test(12, 20, p = 0.5)$p.value
if (p_value > 0.05) print("No evidence that the coin is unfair (fail to reject H0)")`,
    },
  ],
  exerciseIds: ["m9-confidence-interval", "m9-fair-die-test"],
  quiz: [
    {
      id: "m9-ci-q3",
      type: "multiple-choice",
      prompt: "Which statement correctly describes a p-value of 0.03?",
      options: [
        "If H₀ were true, a result at least as extreme as ours would happen about 3% of the time",
        "There is a 3% probability that H₀ is true",
        "There is a 97% probability that H₁ is true",
        "The effect is small, because 0.03 is a small number",
      ],
      answer: 0,
      explanation: "A p-value is computed **assuming H₀ is true**: it is the probability of data at least as extreme as what we observed. It is not the probability of any hypothesis, and it says nothing direct about the size of the effect.",
      optionFeedback: [
        "Correct.",
        "This is the most common misinterpretation. The p-value assumes H₀ is true; it cannot also be the probability that H₀ is true.",
        "1 − p is not the probability that H₁ is true.",
        "The p-value does not measure the size of an effect – look at the estimate and its confidence interval for that.",
      ],
      concept: "p-values",
    },
    {
      id: "m9-ci-q4",
      type: "fill-blank",
      prompt: "Complete the code to get the critical t-value for a 95% confidence interval from a sample of 10 values.",
      code: `qt(___, df = 9)`,
      accept: ["0.975", ".975"],
      hint: "A 95% interval leaves 2.5% in each tail.",
      explanation: "The critical value is the 97.5% point of the t-distribution with n − 1 = 9 degrees of freedom: `qt(0.975, df = 9)`, about 2.26.",
      concept: "confidence-intervals",
    },
    {
      id: "m9-ci-q5",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `round(qt(0.975, df = 1000), 2)`,
      options: ["[1] 1.96", "[1] 2.26", "[1] 0.98", "[1] 1.64"],
      answer: 0,
      explanation: "With many degrees of freedom the t-distribution is practically the normal distribution, whose 97.5% point is 1.96.",
      optionFeedback: [
        "Correct.",
        "2.26 is the critical value for df = 9 – small samples need a bigger multiplier.",
        "0.98 is not a critical value; remember that 95% of a normal distribution lies within about 2 SDs.",
        "1.64 is the 95% point (`qnorm(0.95)`), used for 90% two-sided intervals.",
      ],
      concept: "confidence-intervals",
    },
    {
      id: "m9-ci-q6",
      type: "multiple-choice",
      prompt: "A test with α = 0.05 rejects H₀, but in reality H₀ is true. What has happened?",
      options: ["A Type I error (false alarm)", "A Type II error (missed effect)", "A correct decision", "A calculation mistake"],
      answer: 0,
      explanation: "Rejecting a true null hypothesis is a Type I error. When H₀ is true it happens with probability α – about 5% of the time with α = 0.05 – even if every calculation is correct.",
      optionFeedback: [
        "Correct.",
        "A Type II error is the opposite: failing to reject H₀ when it is false.",
        "Rejecting a **true** H₀ is an error, even though nobody can see that at the time.",
        "No calculation needs to be wrong: random samples occasionally look extreme.",
      ],
      concept: "hypothesis-testing",
    },
    {
      id: "m9-ci-q7",
      type: "true-false",
      prompt: "If you collect more data, a 95% confidence interval for a mean usually becomes narrower.",
      answer: true,
      explanation: "True. The margin is t × s / √n. As n grows, √n grows, so the standard error – and with it the interval – shrinks. More data means a more precise estimate.",
      concept: "confidence-intervals",
    },
  ],
  keyPoints: [
    "An estimate (like a sample mean) comes with a standard error, SE = s / √n: its typical distance from the true value.",
    "A 95% confidence interval for a mean is mean ± t × SE with t = `qt(0.975, df = n - 1)`; `t.test(x)$conf.int` computes it.",
    "\"95% confidence\" describes the method: about 95% of intervals built this way contain the true value.",
    "A hypothesis test assumes H₀ (no effect), computes a test statistic, turns it into a p-value and compares it with α (usually 0.05).",
    "The p-value is the probability of data at least as extreme as ours if H₀ were true – not the probability that H₀ is true.",
    "If p > α we fail to reject H₀; we never prove it. Rejecting a true H₀ is a Type I error, missing a real effect a Type II error.",
    "Statistical significance is not practical importance: always report the size of the effect with its confidence interval.",
  ],
  concepts: ["standard-error", "confidence-intervals", "hypothesis-testing", "p-values"],
  glossary: ["confidence-interval", "standard-error", "hypothesis", "null-hypothesis", "alternative-hypothesis", "p-value", "significance-level", "degrees-of-freedom", "sample", "population"],
  playground: `# Confidence intervals and tests – experiment here!
scores <- c(72, 85, 78, 90, 66, 81, 77, 88)

t.test(scores)$conf.int
binom.test(14, 20, p = 0.5)$p.value
`,
  prerequisites: ["probability-distributions-sampling"],
  datasets: ["patients"],
};
