import type { Exercise } from "../../types";

export const m09Exercises: Exercise[] = [
  {
    id: "m9-normal-probabilities",
    title: "Test scores on the bell curve",
    difficulty: "easy",
    module: 9,
    lesson: "probability-distributions-sampling",
    concepts: ["normal-distribution"],
    prompt: `Scores on a standardised test are normally distributed with **mean 100** and **standard deviation 15**.

1. \`p_below_85\`: the probability that a person scores **85 or less**.
2. \`p_above_130\`: the probability that a person scores **more than 130**.
3. \`top_5_cutoff\`: the score that only the **top 5%** of people exceed.`,
    starterCode: `# Scores: normal distribution, mean 100, sd 15

# 1. P(score <= 85)
p_below_85 <- NULL

# 2. P(score > 130)
p_above_130 <- NULL

# 3. The score that only the top 5% exceed
top_5_cutoff <- NULL
`,
    expected: "`p_below_85` ≈ 0.159, `p_above_130` ≈ 0.023 and `top_5_cutoff` ≈ 124.7.",
    hints: [
      "Probabilities of \"at most x\" come from `pnorm()`; a value for a given probability comes from `qnorm()`. Remember `mean = 100, sd = 15`.",
      "\"More than 130\" is everything minus \"at most 130\": `1 - pnorm(...)`. \"Only the top 5% exceed it\" means 95% are below it.",
      "`pnorm(85, mean = 100, sd = 15)`, `1 - pnorm(130, mean = 100, sd = 15)` and `qnorm(0.95, mean = 100, sd = 15)`.",
    ],
    solution: `p_below_85 <- pnorm(85, mean = 100, sd = 15)
p_above_130 <- 1 - pnorm(130, mean = 100, sd = 15)
top_5_cutoff <- qnorm(0.95, mean = 100, sd = 15)

p_below_85
p_above_130
top_5_cutoff`,
    explanation: `* 85 is exactly one SD below the mean. \`pnorm()\` gives the area to the left: **0.159** – about 16% of people score 85 or less (half of the 32% outside ±1 SD).
* 130 is two SDs above the mean. \`1 - pnorm(130, …)\` gives the area to the right: **0.023**, about 2.3% (half of the 5% outside ±2 SD).
* "Only the top 5% exceed it" means 95% score below it, so we need the 95th percentile: \`qnorm(0.95, …)\` = **124.7**.
* \`pnorm(130, mean = 100, sd = 15, lower.tail = FALSE)\` is another way to get the upper tail.`,
    tests: [
      {
        name: "`p_below_85` is P(score ≤ 85)",
        check: `isTRUE(all.equal(as.numeric(p_below_85), pnorm(85, 100, 15), tolerance = 1e-6))`,
        failMessage: "Use `pnorm(85, mean = 100, sd = 15)` – it gives the probability of a value at most 85.",
      },
      {
        name: "`p_above_130` is P(score > 130)",
        check: `isTRUE(all.equal(as.numeric(p_above_130), 1 - pnorm(130, 100, 15), tolerance = 1e-6))`,
        failMessage: "`pnorm()` gives the area to the **left**. For \"more than 130\" subtract it from 1.",
      },
      {
        name: "`top_5_cutoff` is the 95th percentile",
        check: `isTRUE(all.equal(as.numeric(top_5_cutoff), qnorm(0.95, 100, 15), tolerance = 1e-6))`,
        failMessage: "Use `qnorm()` with the probability **below** the cutoff: 0.95.",
      },
    ],
  },
  {
    id: "m9-sampling-variability",
    title: "How much do sample means vary?",
    difficulty: "medium",
    module: 9,
    lesson: "probability-distributions-sampling",
    concepts: ["sampling"],
    prompt: `Treat the 60 students in \`data/students.csv\` as a whole population.

1. Call \`set.seed()\` with any number, so your results are reproducible.
2. \`means_5\`: draw **1,000** random samples of **5** math scores and store the 1,000 sample means.
3. \`means_30\`: the same with samples of **30** math scores.
4. \`spread_5\` and \`spread_30\`: the standard deviations of \`means_5\` and \`means_30\`.

Which sample size gives more reliable sample means?`,
    starterCode: `students <- read.csv("data/students.csv")

# 1. Make the results reproducible

# 2. 1,000 sample means with samples of 5
means_5 <- NULL

# 3. 1,000 sample means with samples of 30
means_30 <- NULL

# 4. How much do the sample means vary?
spread_5 <- NULL
spread_30 <- NULL
`,
    expected: "Both sets of sample means are centred near the population mean of 74.65, but `spread_5` (about 5) is much larger than `spread_30` (about 1.5).",
    hints: [
      "`mean(sample(students$math, size = 5))` is the mean of one random sample of 5 students.",
      "`replicate(1000, expression)` repeats an expression 1,000 times and collects the results in a vector.",
      "`means_5 <- replicate(1000, mean(sample(students$math, size = 5)))`, then `spread_5 <- sd(means_5)`. Do the same with `size = 30`.",
    ],
    solution: `students <- read.csv("data/students.csv")

set.seed(1)
means_5 <- replicate(1000, mean(sample(students$math, size = 5)))
means_30 <- replicate(1000, mean(sample(students$math, size = 30)))

spread_5 <- sd(means_5)
spread_30 <- sd(means_30)

mean(means_5)
spread_5
spread_30`,
    explanation: `* \`set.seed(1)\` makes the random sampling reproducible.
* \`sample(students$math, size = 5)\` picks 5 different students at random; \`mean()\` averages their scores; \`replicate(1000, …)\` repeats this 1,000 times.
* The sample means are centred on the true population mean (about 74.7 vs 74.65): random samples are not biased.
* Means of 5 students typically miss the population mean by about **4.8 points**, means of 30 students by only about **1.5 points**. Bigger samples give much more reliable estimates – that is the standard error at work. (Because 30 is half of this small population, the spread is even a little smaller than the formula SD / √n predicts.)`,
    tests: [
      {
        name: "`set.seed()` is used",
        check: String.raw`any(grepl("set.seed(", sub("#.*$", "", strsplit(.code, "\n")[[1]]), fixed = TRUE))`,
        failMessage: "Call `set.seed()` with any number before the random code, so the results are reproducible.",
      },
      {
        name: "`means_5` holds 1,000 means of samples of 5",
        check: `is.numeric(means_5) && length(means_5) == 1000 && abs(mean(means_5) - 74.65) < 1.5 && sd(means_5) > 3 && sd(means_5) < 7`,
        failMessage: "`means_5` should be 1,000 numbers, each the mean of 5 randomly sampled math scores: `replicate(1000, mean(sample(students$math, size = 5)))`.",
      },
      {
        name: "`means_30` holds 1,000 means of samples of 30",
        check: `is.numeric(means_30) && length(means_30) == 1000 && abs(mean(means_30) - 74.65) < 1 && sd(means_30) > 0.8 && sd(means_30) < 2.5`,
        failMessage: "`means_30` should be 1,000 means of samples of 30 math scores.",
      },
      {
        name: "`spread_5` and `spread_30` are the SDs of the sample means",
        check: `isTRUE(all.equal(as.numeric(spread_5), sd(means_5))) && isTRUE(all.equal(as.numeric(spread_30), sd(means_30))) && spread_30 < spread_5`,
        failMessage: "Use `sd(means_5)` and `sd(means_30)`. The means of bigger samples should vary less.",
      },
    ],
    datasets: ["students"],
  },
  {
    id: "m9-confidence-interval",
    title: "A confidence interval by hand",
    difficulty: "medium",
    module: 9,
    lesson: "confidence-intervals-hypothesis-tests",
    concepts: ["standard-error", "confidence-intervals"],
    prompt: `Build a 95% confidence interval for the mean **reading** score of students like those in \`data/students.csv\`, step by step:

1. \`se\`: the standard error of the mean.
2. \`t_star\`: the critical t-value for a 95% interval.
3. \`ci_lower\` and \`ci_upper\`: the ends of the interval (mean ∓ t_star × se).

Then check your answer with \`t.test()\`.`,
    starterCode: `students <- read.csv("data/students.csv")
reading <- students$reading
n <- length(reading)

# 1. Standard error
se <- NULL

# 2. Critical t-value
t_star <- NULL

# 3. Lower and upper end of the 95% CI
ci_lower <- NULL
ci_upper <- NULL

# Check with t.test()
`,
    expected: "`se` ≈ 1.594, `t_star` ≈ 2.001 and the interval is about 74.76 to 81.14 – the same as `t.test(reading)$conf.int`.",
    hints: [
      "The standard error of a mean is the standard deviation divided by the square root of n.",
      "The critical value is `qt(0.975, df = n - 1)`: 2.5% in each tail, and n − 1 degrees of freedom.",
      "`ci_lower <- mean(reading) - t_star * se` and `ci_upper <- mean(reading) + t_star * se`.",
    ],
    solution: `students <- read.csv("data/students.csv")
reading <- students$reading
n <- length(reading)

se <- sd(reading) / sqrt(n)
t_star <- qt(0.975, df = n - 1)
ci_lower <- mean(reading) - t_star * se
ci_upper <- mean(reading) + t_star * se

c(ci_lower, ci_upper)
t.test(reading)$conf.int`,
    explanation: `* \`sd(reading) / sqrt(n)\` is the standard error: about **1.59 points** – how far a mean of 60 scores typically is from the true mean.
* \`qt(0.975, df = 59)\` is about **2.00**: with 59 degrees of freedom, the t-distribution is already close to the normal (1.96).
* The interval is 77.95 ± 2.00 × 1.59, i.e. **74.76 to 81.14**.
* \`t.test(reading)$conf.int\` gives exactly the same numbers. In words: *we are 95% confident that the mean reading score of the population these students come from is between about 74.8 and 81.1 points.*`,
    tests: [
      {
        name: "`se` is the standard error",
        check: `isTRUE(all.equal(as.numeric(se), sd(read.csv("data/students.csv")$reading) / sqrt(60), tolerance = 1e-6))`,
        failMessage: "`se` should be `sd(reading) / sqrt(n)` (about 1.594). Did you use `sqrt()`?",
      },
      {
        name: "`t_star` is the 95% critical value",
        check: `isTRUE(all.equal(as.numeric(t_star), qt(0.975, df = 59), tolerance = 1e-6))`,
        failMessage: "`t_star` should be `qt(0.975, df = n - 1)`. Use 0.975, not 0.95, because a 95% interval leaves 2.5% in each tail.",
      },
      {
        name: "`ci_lower` and `ci_upper` match t.test()",
        check: `isTRUE(all.equal(c(as.numeric(ci_lower), as.numeric(ci_upper)), as.numeric(t.test(read.csv("data/students.csv")$reading)$conf.int), tolerance = 1e-6))`,
        failMessage: "The interval is `mean(reading) - t_star * se` to `mean(reading) + t_star * se` (about 74.76 to 81.14).",
      },
    ],
    datasets: ["students"],
  },
  {
    id: "m9-fair-die-test",
    title: "Is this die fair?",
    difficulty: "easy",
    module: 9,
    lesson: "confidence-intervals-hypothesis-tests",
    concepts: ["hypothesis-testing", "p-values"],
    prompt: `A die was rolled **600** times and showed a six **120** times. A fair die should show a six with probability 1/6 (about 100 times in 600 rolls).

Test H₀: P(six) = 1/6 against H₁: P(six) ≠ 1/6 at the significance level α = 0.05.

1. \`result\`: the result of \`binom.test()\`.
2. \`p_value\`: the p-value, taken from \`result\`.
3. \`decision\`: the text \`"reject H0"\` or \`"fail to reject H0"\`.`,
    starterCode: `# 120 sixes in 600 rolls. H0: P(six) = 1/6

# 1. Run the test
result <- NULL

# 2. The p-value
p_value <- NULL

# 3. "reject H0" or "fail to reject H0"?
decision <- NULL
`,
    expected: "`p_value` ≈ 0.032, which is below 0.05, so `decision` is `\"reject H0\"`.",
    hints: [
      "`binom.test(successes, trials, p = ...)` runs an exact binomial test. Here the successes are the sixes.",
      "Extract the p-value with `result$p.value`.",
      "`decision <- if (p_value <= 0.05) \"reject H0\" else \"fail to reject H0\"`.",
    ],
    solution: `result <- binom.test(120, 600, p = 1/6)
p_value <- result$p.value
decision <- if (p_value <= 0.05) "reject H0" else "fail to reject H0"

result
decision`,
    explanation: `* \`binom.test(120, 600, p = 1/6)\` asks: if the die were fair, how surprising would 120 or more sixes (or equally extreme results in the other direction) be?
* The p-value is about **0.032**: a fair die would produce a result this extreme only about 3% of the time.
* Since 0.032 ≤ 0.05 we **reject H₀**: the data gives evidence that the die shows sixes more often than a fair die. The 95% confidence interval for P(six) in the output (about 0.17 to 0.23) agrees – it does not contain 1/6 ≈ 0.167.
* Careful wording: we have *evidence* the die is unfair, not proof – with α = 0.05 we accept a 5% risk of a false alarm.`,
    tests: [
      {
        name: "`result` is a binomial test result",
        check: `inherits(result, "htest")`,
        failMessage: "Store the output of `binom.test(120, 600, p = 1/6)` in `result`.",
      },
      {
        name: "`p_value` is the test's p-value",
        check: `isTRUE(all.equal(as.numeric(p_value), binom.test(120, 600, p = 1/6)$p.value, tolerance = 1e-6))`,
        failMessage: "`p_value` should be `result$p.value` from `binom.test(120, 600, p = 1/6)` (about 0.032). Check that `p` is 1/6.",
      },
      {
        name: "`decision` is correct",
        check: `identical(tolower(trimws(as.character(decision))), "reject h0")`,
        failMessage: "Compare the p-value with 0.05: it is smaller, so the decision is \"reject H0\".",
      },
    ],
  },
  {
    id: "m9-compare-two-groups",
    title: "Do patients with diabetes have a higher BMI?",
    difficulty: "medium",
    module: 9,
    lesson: "t-tests-chi-square-anova",
    concepts: ["t-tests"],
    prompt: `Compare the mean **BMI** of patients with and without diabetes in \`data/patients.csv\` with a Welch two-sample t-test (R's default).

1. \`result\`: the result of the t-test (\`bmi\` by \`diabetes\`).
2. \`p_value\`: its p-value.
3. \`bmi_diff\`: the mean BMI of patients **with** diabetes minus the mean BMI of patients **without** (one number; BMI has missing values!).
4. \`significant\`: \`TRUE\` if the difference is significant at α = 0.05, otherwise \`FALSE\`.`,
    starterCode: `patients <- read.csv("data/patients.csv")

# 1. Welch t-test of bmi by diabetes
result <- NULL

# 2. The p-value
p_value <- NULL

# 3. Mean BMI (diabetes) minus mean BMI (no diabetes)
bmi_diff <- NULL

# 4. Significant at 0.05?
significant <- NULL
`,
    expected: "`p_value` ≈ 0.0078, `bmi_diff` ≈ 2.31 and `significant` is `TRUE`.",
    hints: [
      "Use the formula interface: `t.test(bmi ~ diabetes, data = patients)`. It drops missing values for you.",
      "For the group means, `tapply(patients$bmi, patients$diabetes, mean, na.rm = TRUE)` works – or use `result$estimate`.",
      "`bmi_diff <- result$estimate[2] - result$estimate[1]` (the groups are in alphabetical order: No, Yes); `significant <- p_value < 0.05`.",
    ],
    solution: `patients <- read.csv("data/patients.csv")

result <- t.test(bmi ~ diabetes, data = patients)
p_value <- result$p.value

group_means <- tapply(patients$bmi, patients$diabetes, mean, na.rm = TRUE)
bmi_diff <- as.numeric(group_means["Yes"] - group_means["No"])

significant <- p_value < 0.05

result
bmi_diff
significant`,
    explanation: `* \`t.test(bmi ~ diabetes, data = patients)\` compares the two groups with Welch's test; patients with a missing BMI are left out automatically.
* The mean BMI is 28.0 with diabetes and 25.7 without, a difference of about **2.3 BMI points**. (In the printed result the CI is for *No − Yes*, so it is negative: −3.99 to −0.64.)
* p ≈ **0.0078 < 0.05**, so the difference is statistically significant: \`significant\` is \`TRUE\`.
* Plain English: *"Patients with diabetes had a higher mean BMI than patients without (28.0 vs 25.7; Welch t-test, p = 0.008)."* This is an association in observational data – it does not tell us whether a higher BMI leads to diabetes or the other way round.`,
    tests: [
      {
        name: "`result` is a t-test result",
        check: `inherits(result, "htest") && grepl("t-test", result$method, fixed = TRUE)`,
        failMessage: "Store the output of `t.test(bmi ~ diabetes, data = patients)` in `result`.",
      },
      {
        name: "`p_value` is the Welch test's p-value",
        check: `isTRUE(all.equal(as.numeric(p_value), t.test(bmi ~ diabetes, data = read.csv("data/patients.csv"))$p.value, tolerance = 1e-6))`,
        failMessage: "`p_value` should be `result$p.value` from the default (Welch) test, about 0.0078. Do not add `var.equal = TRUE`.",
      },
      {
        name: "`bmi_diff` is the difference in mean BMI (Yes minus No)",
        check: `length(bmi_diff) == 1 && isTRUE(all.equal(as.numeric(bmi_diff), 2.313672, tolerance = 1e-6))`,
        failMessage: "`bmi_diff` should be mean BMI with diabetes minus mean BMI without (about 2.31). Remember `na.rm = TRUE` and the order of the subtraction.",
      },
      {
        name: "`significant` is TRUE",
        check: `isTRUE(as.logical(significant))`,
        failMessage: "Compare the p-value with 0.05. Is it smaller?",
      },
    ],
    datasets: ["patients"],
  },
  {
    id: "m9-chi-square-test",
    title: "Are garages more common in some neighbourhoods?",
    difficulty: "medium",
    module: 9,
    lesson: "t-tests-chi-square-anova",
    concepts: ["chi-square-test"],
    prompt: `Is having a garage related to the neighbourhood of a house (\`data/housing.csv\`)?

1. \`garage_table\`: a two-way table of \`neighborhood\` and \`garage\`.
2. \`result\`: a chi-square test of independence on that table.
3. \`p_value\`: the p-value.
4. \`min_expected\`: the **smallest expected count** – is it at least 5, so that the test can be trusted?
5. \`decision\`: \`"reject H0"\` or \`"fail to reject H0"\` (α = 0.05).`,
    starterCode: `housing <- read.csv("data/housing.csv")

# 1. Two-way table
garage_table <- NULL

# 2. Chi-square test
result <- NULL

# 3. p-value
p_value <- NULL

# 4. Smallest expected count
min_expected <- NULL

# 5. Decision
decision <- NULL
`,
    expected: "`p_value` ≈ 0.70, `min_expected` is 15.75 (well above 5) and `decision` is `\"fail to reject H0\"`.",
    hints: [
      "`table(housing$neighborhood, housing$garage)` builds the table; `chisq.test()` tests it.",
      "The test result is a list: `result$p.value` and `result$expected` (a table of expected counts). `min()` finds the smallest one.",
      "`decision <- if (p_value <= 0.05) \"reject H0\" else \"fail to reject H0\"`.",
    ],
    solution: `housing <- read.csv("data/housing.csv")

garage_table <- table(housing$neighborhood, housing$garage)
result <- chisq.test(garage_table)
p_value <- result$p.value
min_expected <- min(result$expected)
decision <- if (p_value <= 0.05) "reject H0" else "fail to reject H0"

garage_table
result
min_expected
decision`,
    explanation: `* The table shows, for each neighbourhood, how many houses have a garage (Yes) or not (No).
* \`chisq.test()\` compares those counts with the counts expected if garages were equally common everywhere. Its p-value is about **0.70**: differences as large as these would be very common by chance.
* The smallest expected count is **15.75**, far above 5, so the chi-square approximation is reliable.
* Since p > 0.05 we **fail to reject H₀**: *the data gives no evidence that having a garage depends on the neighbourhood.* That is not proof that the shares are identical – only that any differences are too small to detect with 200 houses.`,
    tests: [
      {
        name: "`garage_table` is the neighbourhood × garage table",
        check: `isTRUE(all.equal(as.vector(garage_table), as.vector(table(read.csv("data/housing.csv")$neighborhood, read.csv("data/housing.csv")$garage))))`,
        failMessage: "`garage_table` should be `table(housing$neighborhood, housing$garage)`.",
      },
      {
        name: "`p_value` is the chi-square test's p-value",
        check: `isTRUE(all.equal(as.numeric(p_value), 0.6968514, tolerance = 1e-6))`,
        failMessage: "Run `chisq.test(garage_table)` and take `$p.value` (about 0.70).",
      },
      {
        name: "`min_expected` is the smallest expected count",
        check: `isTRUE(all.equal(as.numeric(min_expected), 15.75))`,
        failMessage: "The expected counts are in `result$expected`; use `min()` on them (it should be 15.75).",
      },
      {
        name: "`decision` is correct",
        check: `identical(tolower(trimws(as.character(decision))), "fail to reject h0")`,
        failMessage: "The p-value is larger than 0.05, so the decision is \"fail to reject H0\".",
      },
    ],
    datasets: ["housing"],
  },
  {
    id: "m9-house-price-model",
    title: "Challenge: model and explain house prices",
    difficulty: "challenge",
    module: 9,
    lesson: "linear-regression",
    concepts: ["linear-regression", "interpreting-models"],
    prompt: `Build a simple model of house prices in \`data/housing.csv\` and pull the key numbers out of it.

1. \`model\`: a linear regression of \`price\` on \`size_sqft\`.
2. \`slope\`: the estimated slope (dollars per square foot).
3. \`r_squared\`: the model's R-squared.
4. \`pred_1800\`: the predicted price of an 1,800 sq ft house (one number).
5. \`biggest_miss\`: the \`house_id\` of the house the model predicts **worst** (largest residual in absolute value).

Finally, look at that house's row. Can you guess why the model missed it?`,
    starterCode: `housing <- read.csv("data/housing.csv")

# 1. Fit the model
model <- NULL

# 2. The slope
slope <- NULL

# 3. R-squared
r_squared <- NULL

# 4. Predicted price for 1,800 sq ft
pred_1800 <- NULL

# 5. house_id of the worst-predicted house
biggest_miss <- NULL
`,
    expected: "`slope` ≈ 131.67, `r_squared` ≈ 0.721, `pred_1800` ≈ 325,495 and `biggest_miss` is 156.",
    hints: [
      "`lm(price ~ size_sqft, data = housing)` fits the model; `coef(model)` holds the intercept and the slope, and `summary(model)$r.squared` the R-squared.",
      "`predict()` needs a data frame: `predict(model, newdata = data.frame(size_sqft = 1800))`. For the worst prediction, look at `abs(residuals(model))`.",
      "`biggest_miss <- housing$house_id[which.max(abs(residuals(model)))]`. Use `as.numeric()` to drop names if you like.",
    ],
    solution: `housing <- read.csv("data/housing.csv")

model <- lm(price ~ size_sqft, data = housing)
slope <- as.numeric(coef(model)["size_sqft"])
r_squared <- summary(model)$r.squared
pred_1800 <- as.numeric(predict(model, newdata = data.frame(size_sqft = 1800)))
biggest_miss <- housing$house_id[which.max(abs(residuals(model)))]

slope
r_squared
pred_1800
biggest_miss
housing[housing$house_id == biggest_miss, ]`,
    explanation: `* \`lm(price ~ size_sqft, data = housing)\` fits price = intercept + slope × size. \`coef(model)["size_sqft"]\` is the slope: each extra square foot goes with about **$132** more on average.
* \`summary(model)$r.squared\` is **0.72**: size explains 72% of the variation in prices.
* \`predict()\` with a one-row data frame gives about **$325,500** for 1,800 sq ft (88,492 + 131.67 × 1,800).
* \`abs(residuals(model))\` measures each miss regardless of direction; \`which.max()\` finds the largest, and we look up that row's \`house_id\`: **156**.
* House 156 is a Downtown house of 1,820 sq ft that sold for $464,000 – about $136,000 more than the model predicted. Downtown is the most expensive neighbourhood, and the model knows nothing about location. Adding \`neighborhood\` as a second predictor (as in the lesson) shrinks misses like this one.`,
    tests: [
      {
        name: "`model` is a linear model of price on size",
        check: `inherits(model, "lm") && identical(all.vars(formula(model)), c("price", "size_sqft"))`,
        failMessage: "Fit `model <- lm(price ~ size_sqft, data = housing)` – price on the left of `~`.",
      },
      {
        name: "`slope` is the size coefficient",
        check: `length(slope) == 1 && isTRUE(all.equal(as.numeric(slope), 131.668, tolerance = 1e-5))`,
        failMessage: "`slope` should be the second coefficient: `coef(model)[\"size_sqft\"]` (about 131.67).",
      },
      {
        name: "`r_squared` is the model's R-squared",
        check: `isTRUE(all.equal(as.numeric(r_squared), 0.721425, tolerance = 1e-5))`,
        failMessage: "Use `summary(model)$r.squared` (about 0.721).",
      },
      {
        name: "`pred_1800` is the prediction for 1,800 sq ft",
        check: `length(pred_1800) == 1 && isTRUE(all.equal(as.numeric(pred_1800), 88492.13 + 131.668 * 1800, tolerance = 1e-5))`,
        failMessage: "Use `predict(model, newdata = data.frame(size_sqft = 1800))` – about 325,495.",
      },
      {
        name: "`biggest_miss` is the worst-predicted house",
        check: `length(biggest_miss) == 1 && as.numeric(biggest_miss) == 156`,
        failMessage: "Find the largest **absolute** residual with `which.max(abs(residuals(model)))`, then look up that row's `house_id`.",
      },
    ],
    datasets: ["housing"],
  },
];
