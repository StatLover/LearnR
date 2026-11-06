import type { Module } from "../types";
import { probabilityDistributionsSamplingLesson } from "./m09/probability-distributions-sampling";
import { confidenceIntervalsHypothesisTestsLesson } from "./m09/confidence-intervals-hypothesis-tests";
import { tTestsChiSquareAnovaLesson } from "./m09/t-tests-chi-square-anova";
import { linearRegressionLesson } from "./m09/linear-regression";
import { m09Exercises } from "./m09/exercises";

export const module09: Module = {
  number: 9,
  id: "statistical-analysis",
  stage: 3,
  title: "Statistical Analysis",
  description: "Use probability distributions, sampling, confidence intervals and hypothesis tests (t-test, chi-square, ANOVA) and fit linear regression models.",
  topics: [
    "Probability distributions",
    "Sampling",
    "Confidence intervals",
    "Hypothesis testing",
    "t-tests",
    "Chi-square tests",
    "ANOVA",
    "Linear regression",
    "Understanding p-values",
    "Interpreting model outputs",
  ],
  lessons: [
    probabilityDistributionsSamplingLesson,
    confidenceIntervalsHypothesisTestsLesson,
    tTestsChiSquareAnovaLesson,
    linearRegressionLesson,
  ],
  exercises: m09Exercises,
  checkpoint: [
    {
      id: "m9-cp-q1",
      type: "multiple-choice",
      prompt: "A study reports p = 0.004 for the difference between two treatments. Which statement is correct?",
      options: [
        "If the treatments really had the same effect, a difference at least this large would be very unlikely (about 0.4% of the time)",
        "There is a 0.4% chance that the treatments have the same effect",
        "There is a 99.6% chance that the new treatment is better",
        "The difference between the treatments is large and important",
      ],
      answer: 0,
      explanation: "A p-value is calculated assuming H₀ (no difference) is true. It measures how surprising the data would be in that case. It is not the probability of a hypothesis, and it does not measure the size or importance of the difference.",
      optionFeedback: [
        "Correct.",
        "This reverses the logic: the p-value assumes H₀ is true, so it cannot be the probability that H₀ is true.",
        "1 − p is not the probability that the alternative is true.",
        "A small p-value can come from a tiny difference measured on a large sample. Look at the estimate and its confidence interval.",
      ],
      concept: "p-values",
    },
    {
      id: "m9-cp-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `pnorm(1.96) - pnorm(-1.96)`,
      options: ["[1] 0.9500042", "[1] 0.6826895", "[1] 0.9750021", "[1] 1.96"],
      answer: 0,
      explanation: "The area of the standard normal curve between −1.96 and +1.96 is 95% – which is why 1.96 is the multiplier for large-sample 95% confidence intervals.",
      optionFeedback: [
        "Correct.",
        "0.68 is the area within ±1 standard deviation.",
        "0.975 is `pnorm(1.96)` alone: the area to the **left** of 1.96.",
        "`pnorm()` returns probabilities (areas), not z-values.",
      ],
      concept: "normal-distribution",
    },
    {
      id: "m9-cp-q3",
      type: "fill-blank",
      prompt: "Complete the code to extract only the p-value of the t-test.",
      code: `result <- t.test(len ~ supp, data = ToothGrowth)
result$___`,
      accept: ["p.value"],
      hint: "Test results are lists; the name of the element has a dot in it.",
      explanation: "`result$p.value` returns the p-value (about 0.061). Other useful elements are `result$conf.int`, `result$estimate` and `result$statistic`.",
      concept: "t-tests",
    },
    {
      id: "m9-cp-q4",
      type: "true-false",
      prompt: "A 95% confidence interval for the difference between two group means is 1.2 to 4.8. A two-sided test at α = 0.05 would therefore reject the hypothesis \"no difference\".",
      answer: true,
      explanation: "True. The interval does not contain 0, so \"no difference\" is not a plausible value, and the matching two-sided test gives p < 0.05. Confidence intervals and tests always agree in this way.",
      concept: "confidence-intervals",
    },
    {
      id: "m9-cp-q5",
      type: "multiple-choice",
      prompt: "`summary(lm(mpg ~ wt, data = mtcars))` gives a slope of −5.34 for `wt` (weight in 1,000 lbs) and Multiple R-squared 0.75. What is the best interpretation?",
      options: [
        "Each extra 1,000 lbs of weight goes with about 5.3 fewer miles per gallon on average, and weight explains 75% of the variation in mpg",
        "Heavier cars have 5.34% lower fuel efficiency, and 75% of cars are heavy",
        "Adding weight to a car will always reduce its mpg by exactly 5.34",
        "The model's predictions are correct 75% of the time",
      ],
      answer: 0,
      explanation: "The slope is the average change in the outcome (mpg) per one-unit increase in the predictor (1,000 lbs). R-squared is the share of the outcome's variation explained by the model.",
      optionFeedback: [
        "Correct.",
        "The slope is in mpg per 1,000 lbs, not a percentage, and R-squared is not a share of cars.",
        "Regression describes an average association in observational data, not an exact rule for every car.",
        "R-squared is about explained variation, not a hit rate.",
      ],
      concept: "linear-regression",
    },
  ],
};
