import type { Exercise } from "../../types";

export const m07Exercises: Exercise[] = [
  {
    id: "m7-mean-median",
    title: "Bakery sales: mean vs median",
    difficulty: "easy",
    module: 7,
    lesson: "mean-median-mode",
    concepts: ["mean", "median", "outliers"],
    prompt: `A small bakery recorded how many loaves of bread it sold on seven days. The last day was a town festival, so sales were unusually high.

1. Store the **mean** number of loaves in \`avg_loaves\`.
2. Store the **median** number of loaves in \`mid_loaves\`.
3. Print both and think about which one better describes a *normal* day.`,
    starterCode: `loaves <- c(42, 38, 51, 45, 40, 47, 120)

# 1. Store the mean number of loaves in avg_loaves

# 2. Store the median number of loaves in mid_loaves

# 3. Print both
`,
    expected: "`avg_loaves` is about 54.7 and `mid_loaves` is 45. The festival day pulls the mean up, so the median describes a normal day better.",
    hints: [
      "R has a function for each: one is called `mean()`, the other `median()`.",
      "Give the whole vector to the function: `mean(loaves)`. Store the result with `<-`.",
      "`avg_loaves <- mean(loaves)` and `mid_loaves <- median(loaves)`, then type each name on its own line to print it.",
    ],
    solution: `loaves <- c(42, 38, 51, 45, 40, 47, 120)

avg_loaves <- mean(loaves)
mid_loaves <- median(loaves)

avg_loaves
mid_loaves`,
    explanation: `* \`mean(loaves)\` adds the seven values (383) and divides by 7, giving about **54.7** loaves.
* \`median(loaves)\` sorts the values (38, 40, 42, **45**, 47, 51, 120) and takes the middle one: **45** loaves.
* The festival day (120) is an outlier. It drags the mean above what the bakery sold on six of the seven days, while the median is not affected by how extreme the 120 is. To plan a normal day's baking, the median (45 loaves) is the better guide.`,
    tests: [
      {
        name: "`avg_loaves` is the mean of `loaves`",
        check: `.defined("avg_loaves") && isTRUE(all.equal(as.numeric(avg_loaves), 383 / 7, tolerance = 1e-6))`,
        failMessage: "`avg_loaves` should be `mean(loaves)` – about 54.71.",
      },
      {
        name: "`mid_loaves` is the median of `loaves`",
        check: `.defined("mid_loaves") && isTRUE(all.equal(as.numeric(mid_loaves), 45))`,
        failMessage: "`mid_loaves` should be `median(loaves)`, which is 45.",
      },
    ],
  },
  {
    id: "m7-find-the-mode",
    title: "Write your own mode function",
    difficulty: "medium",
    module: 7,
    lesson: "mean-median-mode",
    concepts: ["mode", "frequency-tables"],
    prompt: `R has no built-in function for the statistical mode (and \`mode()\` does something else!).

1. Write a function \`get_mode(x)\` that returns the **most common value** of \`x\` (as text is fine).
2. Use it to store the most common age group in the survey in \`top_age_group\`.
3. Store **how many** respondents are in that age group in \`top_count\` (a number).`,
    starterCode: `survey <- read.csv("data/survey.csv")

# 1. Write get_mode() here
get_mode <- function(x) {
  # count the values, then return the name of the biggest count

}

# 2. The most common age group
top_age_group <- NULL

# 3. How many respondents are in that group?
top_count <- NULL
`,
    expected: "`get_mode(c(\"a\", \"b\", \"b\"))` returns `\"b\"`, `top_age_group` is `\"35-44\"` and `top_count` is 45.",
    hints: [
      "Inside the function, count the values with `table(x)` and store the result in a variable such as `counts`.",
      "`which.max(counts)` gives the position of the biggest count; `names()` turns it into the value itself.",
      "The body can be `counts <- table(x)` followed by `names(counts)[which.max(counts)]`. For the count, use `max(table(survey$age_group))`.",
    ],
    solution: `survey <- read.csv("data/survey.csv")

get_mode <- function(x) {
  counts <- table(x)
  names(counts)[which.max(counts)]
}

top_age_group <- get_mode(survey$age_group)
top_count <- max(table(survey$age_group))

top_age_group
top_count`,
    explanation: `* \`table(x)\` counts how often each distinct value occurs.
* \`which.max(counts)\` finds the position of the largest count, and \`names(counts)[...]\` picks the matching label. Because it is the last line of the function, it is the function's return value.
* \`get_mode(survey$age_group)\` returns \`"35-44"\`: 45 of the 200 respondents are in that group, so \`max(table(survey$age_group))\` is 45.
* Note: if several values tie for the top count, \`which.max()\` returns only the first one. To see all modes you could use \`names(counts)[counts == max(counts)]\`.`,
    tests: [
      {
        name: "`get_mode()` finds the most common value",
        check: `is.function(get_mode) && identical(as.character(get_mode(c("a", "b", "b", "c"))), "b") && identical(as.character(get_mode(c(3, 7, 7, 7, 1))), "7")`,
        failMessage: "`get_mode(c(\"a\", \"b\", \"b\", \"c\"))` should return `\"b\"`. Count with `table(x)` and return `names(counts)[which.max(counts)]`.",
      },
      {
        name: "`top_age_group` is the most common age group",
        check: `identical(as.character(top_age_group), "35-44")`,
        failMessage: "`top_age_group` should be the most frequent value of `survey$age_group` – try `get_mode(survey$age_group)`.",
      },
      {
        name: "`top_count` is the size of that group",
        check: `length(top_count) == 1 && isTRUE(all.equal(as.numeric(top_count), 45))`,
        failMessage: "`top_count` should be the biggest count in `table(survey$age_group)` – use `max()` on the table.",
      },
    ],
    datasets: ["survey"],
  },
  {
    id: "m7-spread-measures",
    title: "How much does blood pressure vary?",
    difficulty: "easy",
    module: 7,
    lesson: "measures-of-spread",
    concepts: ["range", "iqr", "standard-deviation"],
    prompt: `Describe the spread of the patients' systolic blood pressure (\`patients$systolic_bp\`).

1. \`bp_range\`: the range as **one number** (largest minus smallest value).
2. \`bp_iqr\`: the interquartile range.
3. \`bp_sd\`: the standard deviation.`,
    starterCode: `patients <- read.csv("data/patients.csv")
bp <- patients$systolic_bp

# 1. The range as a single number
bp_range <- NULL

# 2. The interquartile range
bp_iqr <- NULL

# 3. The standard deviation
bp_sd <- NULL
`,
    expected: "`bp_range` is 74, `bp_iqr` is 15.75 and `bp_sd` is about 13.84 (mmHg).",
    hints: [
      "Each measure has its own function: one for the range, `IQR()` and `sd()`.",
      "Remember that `range(bp)` returns two numbers. Wrap it in `diff()` to get the difference.",
      "`bp_range <- diff(range(bp))`, `bp_iqr <- IQR(bp)`, `bp_sd <- sd(bp)`.",
    ],
    solution: `patients <- read.csv("data/patients.csv")
bp <- patients$systolic_bp

bp_range <- diff(range(bp))
bp_iqr <- IQR(bp)
bp_sd <- sd(bp)

bp_range
bp_iqr
bp_sd`,
    explanation: `* \`range(bp)\` returns the lowest (97) and highest (171) values; \`diff()\` subtracts them, giving a range of **74 mmHg**. \`max(bp) - min(bp)\` works just as well.
* \`IQR(bp)\` is Q3 − Q1: the middle half of the patients lie within a band **15.75 mmHg** wide.
* \`sd(bp)\` is about **13.8 mmHg**: a typical patient's blood pressure is roughly 14 mmHg away from the average of 138.
* The range is much bigger than the IQR because it depends on the two most extreme patients only.`,
    tests: [
      {
        name: "`bp_range` is a single number: max minus min",
        check: `length(bp_range) == 1 && isTRUE(all.equal(as.numeric(bp_range), 74))`,
        failMessage: "`bp_range` should be one number (74). `range()` gives two numbers – use `diff(range(bp))` or `max(bp) - min(bp)`.",
      },
      {
        name: "`bp_iqr` is the interquartile range",
        check: `isTRUE(all.equal(as.numeric(bp_iqr), 15.75))`,
        failMessage: "Use `IQR(bp)` (capital letters) for the interquartile range.",
      },
      {
        name: "`bp_sd` is the standard deviation",
        check: `isTRUE(all.equal(as.numeric(bp_sd), sd(read.csv("data/patients.csv")$systolic_bp), tolerance = 1e-6))`,
        failMessage: "Use `sd(bp)` for the standard deviation (about 13.84).",
      },
    ],
    datasets: ["patients"],
  },
  {
    id: "m7-variance-by-hand",
    title: "Variance and standard deviation by hand",
    difficulty: "medium",
    module: 7,
    lesson: "measures-of-spread",
    concepts: ["variance", "standard-deviation"],
    prompt: `Compute the variance and standard deviation of five weights (kg) **step by step**, following the recipe from the lesson:

1. \`deviations\`: each weight minus the mean weight.
2. \`my_var\`: the sum of the squared deviations divided by n − 1.
3. \`my_sd\`: the square root of \`my_var\`.

Finally, compare your answers with \`var(weights)\` and \`sd(weights)\`.`,
    starterCode: `weights <- c(61, 72, 58, 80, 69)

# 1. Deviations from the mean
deviations <- NULL

# 2. Variance: sum of squared deviations / (n - 1)
my_var <- NULL

# 3. Standard deviation
my_sd <- NULL

# Compare with R's own functions
`,
    expected: "`deviations` is -7, 4, -10, 12, 1; `my_var` is 77.5 and `my_sd` is about 8.80 – the same as `var(weights)` and `sd(weights)`.",
    hints: [
      "Subtracting a single number from a vector subtracts it from every element: `weights - mean(weights)`.",
      "Square with `^2`, add up with `sum()`, and count with `length()`. Put `length(weights) - 1` in parentheses!",
      "`my_var <- sum(deviations^2) / (length(weights) - 1)` and `my_sd <- sqrt(my_var)`.",
    ],
    solution: `weights <- c(61, 72, 58, 80, 69)

deviations <- weights - mean(weights)
my_var <- sum(deviations^2) / (length(weights) - 1)
my_sd <- sqrt(my_var)

deviations
my_var
my_sd
var(weights)
sd(weights)`,
    explanation: `* The mean weight is 340 / 5 = 68 kg, so the deviations are 61 − 68 = −7, 4, −10, 12 and 1. They add up to 0, as deviations always do.
* Squaring gives 49, 16, 100, 144 and 1, which sum to 310. Dividing by n − 1 = 4 gives a variance of **77.5 kg²**.
* The square root brings us back to kilograms: the standard deviation is about **8.8 kg** – a typical weight is roughly 9 kg away from the mean.
* \`var()\` and \`sd()\` give exactly the same results, because they also divide by n − 1.`,
    tests: [
      {
        name: "`deviations` are the weights minus their mean",
        check: `isTRUE(all.equal(as.numeric(deviations), c(-7, 4, -10, 12, 1)))`,
        failMessage: "`deviations` should be `weights - mean(weights)`: -7, 4, -10, 12, 1.",
      },
      {
        name: "`my_var` is the sample variance (divided by n - 1)",
        check: `isTRUE(all.equal(as.numeric(my_var), 77.5))`,
        failMessage: "`my_var` should be 310 / 4 = 77.5. If you got 62, you divided by n instead of n - 1 (or forgot the parentheses around `length(weights) - 1`).",
      },
      {
        name: "`my_sd` is the square root of the variance",
        check: `isTRUE(all.equal(as.numeric(my_sd), sqrt(77.5), tolerance = 1e-6))`,
        failMessage: "`my_sd` should be `sqrt(my_var)`, about 8.80.",
      },
    ],
  },
  {
    id: "m7-frequency-table",
    title: "How satisfied are the app users?",
    difficulty: "easy",
    module: 7,
    lesson: "tables-correlation-summaries",
    concepts: ["frequency-tables"],
    prompt: `The survey asked 200 users to rate their satisfaction from 1 (very unhappy) to 5 (very happy).

1. \`sat_counts\`: a frequency table of \`survey$satisfaction\`.
2. \`sat_pct\`: the same table as **percentages**, rounded to 1 decimal place.
3. \`happy_pct\`: the percentage of respondents who answered **4 or 5** (one number).`,
    starterCode: `survey <- read.csv("data/survey.csv")

# 1. Frequency table of satisfaction
sat_counts <- NULL

# 2. Percentages, rounded to 1 decimal
sat_pct <- NULL

# 3. Percentage who answered 4 or 5
happy_pct <- NULL
`,
    expected: "`sat_counts` shows 11, 42, 69, 56, 22; `sat_pct` shows 5.5, 21, 34.5, 28, 11; `happy_pct` is 39.",
    hints: [
      "`table()` counts; `prop.table()` turns counts into proportions; multiply by 100 for percentages.",
      "`sat_pct <- round(100 * prop.table(sat_counts), 1)`. For the happy share, add up the percentages for the ratings 4 and 5.",
      "`happy_pct <- sum(sat_pct[c(\"4\", \"5\")])` works, and so does `100 * mean(survey$satisfaction >= 4)`.",
    ],
    solution: `survey <- read.csv("data/survey.csv")

sat_counts <- table(survey$satisfaction)
sat_pct <- round(100 * prop.table(sat_counts), 1)
happy_pct <- 100 * mean(survey$satisfaction >= 4)

sat_counts
sat_pct
happy_pct`,
    explanation: `* \`table(survey$satisfaction)\` counts each rating: 11 ones, 42 twos, 69 threes, 56 fours and 22 fives.
* \`prop.table()\` divides by the total (200) and \`100 *\` turns proportions into percentages; \`round(…, 1)\` keeps one decimal.
* \`survey$satisfaction >= 4\` is TRUE for every happy respondent. The mean of TRUE/FALSE values is the proportion of TRUEs (0.39), so \`100 * mean(...)\` is **39%**. Adding \`sat_pct[c("4", "5")]\` (28 + 11) gives the same answer.
* In words: *"39% of users are happy with the app (rating 4 or 5), while about a quarter (26.5%) are unhappy (rating 1 or 2)."*`,
    tests: [
      {
        name: "`sat_counts` holds the counts of each rating",
        check: `isTRUE(all.equal(as.vector(sat_counts), c(11, 42, 69, 56, 22)))`,
        failMessage: "`sat_counts` should be `table(survey$satisfaction)`.",
      },
      {
        name: "`sat_pct` holds rounded percentages",
        check: `isTRUE(all.equal(as.vector(sat_pct), c(5.5, 21, 34.5, 28, 11)))`,
        failMessage: "`sat_pct` should be percentages (they add up to 100): `round(100 * prop.table(sat_counts), 1)`.",
      },
      {
        name: "`happy_pct` is the percentage answering 4 or 5",
        check: `length(happy_pct) == 1 && isTRUE(all.equal(as.numeric(happy_pct), 39))`,
        failMessage: "`happy_pct` should be one number: the percentages for ratings 4 and 5 added together (28 + 11).",
      },
    ],
    datasets: ["survey"],
  },
  {
    id: "m7-correlation",
    title: "What goes with a good math score?",
    difficulty: "medium",
    module: 7,
    lesson: "tables-correlation-summaries",
    concepts: ["correlation"],
    prompt: `Which variable is most strongly related to the students' math scores?

1. Compute the correlation of \`math\` with \`study_hours\`, \`attendance\` and \`reading\`, and store them in \`r_study\`, \`r_attendance\` and \`r_reading\`.
2. Store the **name** of the variable with the strongest correlation (as text, e.g. \`"attendance"\`) in \`strongest\`.
3. Bonus: draw a scatter plot of that variable against \`math\`.`,
    starterCode: `students <- read.csv("data/students.csv")

# 1. Three correlations with math
r_study <- NULL
r_attendance <- NULL
r_reading <- NULL

# 2. Which variable has the strongest correlation?
strongest <- NULL

# 3. Bonus: scatter plot
`,
    expected: "`r_study` ≈ 0.59, `r_attendance` ≈ 0.26, `r_reading` ≈ 0.80, so `strongest` is `\"reading\"`.",
    hints: [
      "`cor(x, y)` computes the Pearson correlation of two numeric vectors, e.g. `cor(students$math, students$study_hours)`.",
      "Print the three correlations and compare their sizes. All three are positive, so the strongest one is simply the biggest.",
      "`strongest <- \"reading\"` – or compute it: `c(study_hours = r_study, attendance = r_attendance, reading = r_reading)` and take `names(which.max(...))`.",
    ],
    solution: `students <- read.csv("data/students.csv")

r_study <- cor(students$math, students$study_hours)
r_attendance <- cor(students$math, students$attendance)
r_reading <- cor(students$math, students$reading)

all_r <- c(study_hours = r_study, attendance = r_attendance, reading = r_reading)
round(all_r, 2)
strongest <- names(which.max(abs(all_r)))
strongest

plot(students$reading, students$math, xlab = "Reading score", ylab = "Math score")`,
    explanation: `* Each \`cor()\` call returns a number between −1 and 1.
* Study hours (0.59) are moderately related to math scores, attendance (0.26) only weakly, and the **reading score (0.80)** strongly: students who read well tend to do well in math.
* Strength is the **size** of r, so the solution compares \`abs()\` values – that would also work if one correlation were negative. \`which.max()\` finds the largest and \`names()\` returns its label.
* Remember: this does not mean reading *causes* good math scores. A common factor (for example general school motivation) could drive both.`,
    tests: [
      {
        name: "`r_study` is the correlation of math and study hours",
        check: `isTRUE(all.equal(as.numeric(r_study), 0.5898696, tolerance = 1e-6))`,
        failMessage: "`r_study` should be `cor(students$math, students$study_hours)` (about 0.59).",
      },
      {
        name: "`r_attendance` is the correlation of math and attendance",
        check: `isTRUE(all.equal(as.numeric(r_attendance), 0.2550493, tolerance = 1e-6))`,
        failMessage: "`r_attendance` should be `cor(students$math, students$attendance)` (about 0.26).",
      },
      {
        name: "`r_reading` is the correlation of math and reading",
        check: `isTRUE(all.equal(as.numeric(r_reading), 0.7979465, tolerance = 1e-6))`,
        failMessage: "`r_reading` should be `cor(students$math, students$reading)` (about 0.80).",
      },
      {
        name: "`strongest` names the strongest relationship",
        check: `identical(tolower(as.character(strongest)), "reading")`,
        failMessage: "Compare the sizes of the three correlations. The biggest one belongs to `\"reading\"`.",
      },
    ],
    datasets: ["students"],
  },
  {
    id: "m7-patient-report",
    title: "Challenge: a short patient health report",
    difficulty: "challenge",
    module: 7,
    lesson: "tables-correlation-summaries",
    concepts: ["summarizing-data", "frequency-tables", "correlation", "interpreting-results"],
    prompt: `The clinic manager wants three facts about the patients in \`data/patients.csv\`:

1. \`bp_gap\`: how much higher the **mean** systolic blood pressure of smokers is than that of non-smokers (smokers' mean minus non-smokers' mean, one number).
2. \`diabetes_pct\`: the **percentage of smokers** who have diabetes (one number; rounding to 1 decimal is fine).
3. \`r_age_bp\`: the correlation between age and systolic blood pressure.

Use any approach you like (\`tapply()\`, \`aggregate()\`, \`table()\`, dplyr …). Then write a comment with a one- or two-sentence interpretation.`,
    starterCode: `patients <- read.csv("data/patients.csv")

# 1. Mean blood pressure: smokers minus non-smokers
bp_gap <- NULL

# 2. Percentage of smokers with diabetes
diabetes_pct <- NULL

# 3. Correlation between age and blood pressure
r_age_bp <- NULL

# Interpretation:
`,
    expected: "`bp_gap` ≈ 6.15 mmHg, `diabetes_pct` ≈ 22.6 and `r_age_bp` ≈ 0.66.",
    hints: [
      "`tapply(patients$systolic_bp, patients$smoker, mean)` gives a named vector with the means for \"No\" and \"Yes\". You can pick elements by name: `means[\"Yes\"]`.",
      "For the percentage, build `table(patients$smoker, patients$diabetes)` and use `prop.table(..., margin = 1)` – then look at the row for smokers and the column for diabetes. Alternatively: `100 * mean(patients$diabetes[patients$smoker == \"Yes\"] == \"Yes\")`.",
      "`bp_means <- tapply(patients$systolic_bp, patients$smoker, mean)`; `bp_gap <- bp_means[\"Yes\"] - bp_means[\"No\"]`; `r_age_bp <- cor(patients$age, patients$systolic_bp)`.",
    ],
    solution: `patients <- read.csv("data/patients.csv")

bp_means <- tapply(patients$systolic_bp, patients$smoker, mean)
bp_gap <- as.numeric(bp_means["Yes"] - bp_means["No"])

smoke_diab <- prop.table(table(patients$smoker, patients$diabetes), margin = 1)
diabetes_pct <- round(100 * smoke_diab["Yes", "Yes"], 1)

r_age_bp <- cor(patients$age, patients$systolic_bp)

bp_gap
diabetes_pct
r_age_bp

# Interpretation: smokers' blood pressure is on average about 6 mmHg higher than
# non-smokers'. About 23% of smokers have diabetes (similar to non-smokers, 24%).
# Older patients tend to have higher blood pressure (r = 0.66, fairly strong).`,
    explanation: `* \`tapply()\` computes the mean blood pressure per smoking group (136.8 for non-smokers, 143.0 for smokers). Indexing by name and subtracting gives a gap of about **6.2 mmHg**. \`as.numeric()\` simply drops the leftover name.
* \`prop.table(..., margin = 1)\` turns the smoker × diabetes table into **row proportions**, so each row (non-smokers, smokers) adds up to 1. The cell \`["Yes", "Yes"]\` is the share of smokers with diabetes: 7 of 31, about **22.6%**.
* \`cor()\` shows a fairly strong positive correlation (**0.66**) between age and blood pressure.
* An honest report also mentions limits: there are only 31 smokers, the groups may differ in age, and these are descriptions of this clinic's patients – not proof that smoking raises blood pressure.`,
    tests: [
      {
        name: "`bp_gap` is the difference in mean blood pressure",
        check: `length(bp_gap) == 1 && isTRUE(all.equal(as.numeric(bp_gap), with(read.csv("data/patients.csv"), mean(systolic_bp[smoker == "Yes"]) - mean(systolic_bp[smoker == "No"])), tolerance = 1e-6))`,
        failMessage: "`bp_gap` should be one number: the smokers' mean blood pressure minus the non-smokers' mean (about 6.15). Check the order of the subtraction.",
      },
      {
        name: "`diabetes_pct` is the percentage of smokers with diabetes",
        check: `length(diabetes_pct) == 1 && abs(as.numeric(diabetes_pct) - 100 * 7 / 31) < 0.06`,
        failMessage: "`diabetes_pct` should be about 22.6: among the 31 smokers, 7 have diabetes. Did you use row proportions (`margin = 1`) and multiply by 100?",
      },
      {
        name: "`r_age_bp` is the correlation of age and blood pressure",
        check: `isTRUE(all.equal(as.numeric(r_age_bp), 0.6626534, tolerance = 1e-6))`,
        failMessage: "`r_age_bp` should be `cor(patients$age, patients$systolic_bp)` (about 0.66).",
      },
    ],
    datasets: ["patients"],
  },
];
