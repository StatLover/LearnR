import type { Project } from "../types";

export const studentPerformanceProject: Project = {
  id: "student-performance",
  title: "Analyzing Student Performance",
  level: "intermediate",
  summary:
    "Work out each student's average score, decide who passed, compare classes and genders, and measure – with a correlation, a scatter plot and a linear model – how much studying pays off.",
  intro: `Ms. Lindqvist, the head of year at a (fictional) high school, has the end-of-term results of 60 students in three classes (A, B and C): their math, reading and science scores, how many hours a week they say they study, and their attendance. Before the parents' evening she wants clear answers:

- What is each student's overall average, and who did not reach the pass mark of 60?
- Is one class doing better than the others? Are there differences between girls and boys?
- Does studying more really go together with better math scores – and by how much?

You will answer these questions with the tools of a working analyst: **dplyr** to compute group summaries (\`group_by()\` + \`summarise()\`), **ggplot2** for a box plot and a scatter plot, **\`cor()\`** to measure how strongly two numbers move together, and **\`lm()\`** to fit a simple *linear regression* (a straight line that predicts one variable from another).

Along the way you will meet a classic analysis decision – what to do when a student has a missing score – and practise the most important habit of all: describing results honestly, including how big (or small) a difference really is.`,
  datasets: ["students"],
  skills: [
    "Checking a dataset for missing values",
    "Row averages with rowMeans(na.rm = TRUE)",
    "Creating categories with ifelse()",
    "Group summaries with dplyr's group_by() and summarise()",
    "Box plots and scatter plots with ggplot2",
    "Measuring relationships with cor()",
    "Fitting and interpreting a simple linear model with lm()",
    "Making predictions with predict()",
  ],
  minutes: 60,
  packages: ["dplyr", "ggplot2"],
  steps: [
    {
      id: "import-check",
      title: "Load the packages and check the data",
      instructions: `Load the two packages you need, import the results and check them before calculating anything.

1. Load **dplyr** and **ggplot2** with \`library()\`.
2. Read \`data/students.csv\` into \`students\` and look at it with \`str()\`.
3. Print a \`summary()\` of the numeric columns \`study_hours\`, \`attendance\`, \`math\`, \`reading\` and \`science\` – the minimum, quartiles, mean and maximum of each.
4. Count the missing values per column with \`colSums(is.na(students))\` and store the number of missing science scores in \`n_missing_science\`.`,
      starterCode: `# Step 1: load packages and check the data
library(dplyr)
library(ggplot2)

students <- read.csv("data/students.csv")
str(students)

# Summary of the numeric columns
summary(students[, c("study_hours", "attendance", "math", "reading", "science")])

# Missing values per column


# Number of missing science scores
n_missing_science <- 0
`,
      hints: [
        "`colSums(is.na(students))` shows one count of missing values per column.",
        "For a single column: `sum(is.na(students$science))`.",
        "`n_missing_science <- sum(is.na(students$science))`.",
      ],
      solution: `library(dplyr)
library(ggplot2)

students <- read.csv("data/students.csv")
str(students)

summary(students[, c("study_hours", "attendance", "math", "reading", "science")])

colSums(is.na(students))
n_missing_science <- sum(is.na(students$science))
n_missing_science
`,
      explanation: `- \`library(dplyr)\` and \`library(ggplot2)\` make the packages' functions available for the rest of the project. dplyr prints a note that some of its functions (\`filter\`, \`lag\`, …) "mask" functions with the same name – that is expected.
- \`str(students)\` shows **60 obs. of 10 variables**: ids, names, gender and class as text, and age, study hours, attendance and the three scores as whole numbers (\`int\`).
- The summary gives a feel for each column. Study hours range from **1 to 20** per week (median 10). Attendance runs from **63% to 100%** (mean 85.07). Mean scores: **math 74.65, reading 77.95, science 74.3**. All scores lie between 46 and 100, so there are no impossible values such as 150.
- \`colSums(is.na(students))\` is 0 for every column except **science, with 3 missing scores**; \`n_missing_science\` is \`3\`.

Three missing scores out of 180 is not much, but it affects the very next step: what is the average of a student who has only two scores?`,
      tests: [
        {
          name: "`students` has 60 rows and 10 columns",
          check: `is.data.frame(students) && nrow(students) == 60 && ncol(students) == 10`,
          failMessage: "Read the file with `students <- read.csv(\"data/students.csv\")`.",
        },
        {
          name: "`n_missing_science` is 3",
          check: `isTRUE(n_missing_science == 3)`,
          failMessage: "Count the missing science scores with `sum(is.na(students$science))`.",
        },
        {
          name: "dplyr and ggplot2 are loaded",
          check: `all(c("package:dplyr", "package:ggplot2") %in% search())`,
          failMessage: "Run `library(dplyr)` and `library(ggplot2)`.",
        },
      ],
    },
    {
      id: "average-score",
      title: "Compute each student's average score",
      instructions: `Each student needs one overall score: the average of math, reading and science.

The obvious formula \`(math + reading + science) / 3\` gives \`NA\` for the three students with a missing science score – any calculation with \`NA\` is \`NA\`. Instead, use \`rowMeans()\`, which averages across the columns of each row, with \`na.rm = TRUE\` so that a student with a missing score gets the average of the scores they do have.

1. Create a new column \`students$average\` with \`rowMeans(students[, c("math", "reading", "science")], na.rm = TRUE)\`.
2. Print the name, the three scores and the average of the students whose science score is missing.
3. Print \`summary(students$average)\`.`,
      starterCode: `# Step 2: one average score per student

# The simple formula gives NA for students with a missing science score:
students$average <- (students$math + students$reading + students$science) / 3
sum(is.na(students$average))

# Replace it with rowMeans() on the three score columns, using na.rm = TRUE
# students$average <- rowMeans(students[, c(...)], na.rm = TRUE)


# Look at the students with a missing science score
# students[is.na(students$science), c(...)]


# Summary of the averages

`,
      hints: [
        "`rowMeans()` needs the three score columns – `students[, c(\"math\", \"reading\", \"science\")]` – and `na.rm = TRUE` to skip the missing science scores.",
        "`is.na(students$science)` is TRUE for the three students without a science score – use it as the row condition, and `c(\"name\", \"math\", \"reading\", \"science\", \"average\")` as the columns.",
        "`students$average <- rowMeans(students[, c(\"math\", \"reading\", \"science\")], na.rm = TRUE)`, then `students[is.na(students$science), c(\"name\", \"math\", \"reading\", \"science\", \"average\")]` and `summary(students$average)`.",
      ],
      solution: `students$average <- rowMeans(students[, c("math", "reading", "science")], na.rm = TRUE)

students[is.na(students$science), c("name", "math", "reading", "science", "average")]

summary(students$average)
`,
      explanation: `- \`students[, c("math", "reading", "science")]\` selects the three score columns (all rows). \`rowMeans()\` averages each row, and \`na.rm = TRUE\` skips missing values. The result – one number per student – is stored in a new column, \`average\`.
- The three students without a science score now have the average of their two other scores: **Grace (77, 70) → 73.5, Wei (68, 62) → 65.0, Oscar (67, 81) → 74.0**. With \`(math + reading + science) / 3\` they would have \`NA\` and would silently drop out of every later calculation.
- \`summary(students$average)\`: **Min. 51.00, 1st Qu. 67.83, Median 74.00, Mean 75.58, 3rd Qu. 83.75, Max. 99.33**. Half of the students average between about 68 and 84.

This is a *decision*, and a good analyst says so: we assume a student's missing science score would have been similar to their other scores. The alternative – leaving their average as \`NA\` – would be more cautious but would remove three students from the analysis. With only three cases either choice is reasonable; write down which one you made.`,
      tests: [
        {
          name: "`students$average` exists and has no missing values",
          check: `"average" %in% names(students) && is.numeric(students$average) && !anyNA(students$average)`,
          failMessage: "Use `rowMeans(..., na.rm = TRUE)` so the students with a missing science score still get an average.",
        },
        {
          name: "The mean of all averages is 75.575",
          check: `isTRUE(all.equal(mean(students$average), 75.575, tolerance = 1e-6))`,
          failMessage: "Average the three columns math, reading and science for each student.",
        },
        {
          name: "Grace (no science score) has an average of 73.5",
          check: `isTRUE(all.equal(students$average[students$name == "Grace"], 73.5))`,
          failMessage: "Grace's average should be the mean of her math (77) and reading (70) scores – check `na.rm = TRUE`.",
        },
      ],
    },
    {
      id: "pass-fail",
      title: "Decide who passed",
      instructions: `The school's pass mark is an average of **60**. Turn the numeric average into a category.

1. Create a column \`students$result\` that is \`"Pass"\` when \`average\` is 60 or more and \`"Fail"\` otherwise. \`ifelse(condition, value_if_true, value_if_false)\` does this for every row at once.
2. Count the results with \`table()\`.
3. Store the percentage of students who passed in \`pass_rate\`.
4. Print the name, class, study hours and average of the students who failed.`,
      starterCode: `# Step 3: pass or fail?

# "Pass" if the average is at least 60, otherwise "Fail"
# students$result <- ifelse(...)


# How many passed and failed?


# Percentage of students who passed
pass_rate <- 0

# Who failed?

`,
      hints: [
        "The condition is `students$average >= 60`.",
        "`mean(students$result == \"Pass\")` is the proportion who passed – multiply by 100 for a percentage.",
        "`students$result <- ifelse(students$average >= 60, \"Pass\", \"Fail\")`, then `students[students$result == \"Fail\", c(\"name\", \"class\", \"study_hours\", \"average\")]`.",
      ],
      solution: `students$result <- ifelse(students$average >= 60, "Pass", "Fail")
table(students$result)

pass_rate <- mean(students$result == "Pass") * 100
pass_rate

students[students$result == "Fail", c("name", "class", "study_hours", "average")]
`,
      explanation: `- \`students$average >= 60\` is \`TRUE\`/\`FALSE\` for each student. \`ifelse()\` turns every \`TRUE\` into \`"Pass"\` and every \`FALSE\` into \`"Fail"\`, giving a new column \`result\`.
- \`table(students$result)\`: **Fail 6, Pass 54**.
- \`students$result == "Pass"\` is a logical vector; its mean is the share of passes, 0.9, so \`pass_rate\` is **90** percent.
- The six students who failed are **Ben (class A, 1 hour of study a week, average 51.0), Sofia (A, 3 h, 58.3), Victor (B, 3 h, 57.7), Wendy (C, 8 h, 59.3), Hassan (B, 2 h, 55.0) and Ines (B, 10 h, 58.7)**.

Look at the study hours of the students who failed: four of the six study 3 hours a week or less, while the typical (median) student studies 10 hours. That is a first hint about the study–score relationship you will measure properly in Steps 6–8. Notice too that Wendy (59.3) and Ines (58.7) missed the pass mark by less than 1.5 points – a strict cut-off turns small differences into a big label.`,
      tests: [
        {
          name: "`students$result` contains only \"Pass\" and \"Fail\"",
          check: `"result" %in% names(students) && all(students$result %in% c("Pass", "Fail"))`,
          failMessage: "Create the column with `ifelse(students$average >= 60, \"Pass\", \"Fail\")`.",
        },
        {
          name: "6 students failed",
          check: `sum(students$result == "Fail") == 6`,
          failMessage: "A student passes with an average of **60 or more** – use `>= 60`.",
        },
        {
          name: "`pass_rate` is 90 (percent)",
          check: `isTRUE(all.equal(as.numeric(pass_rate), 90)) || isTRUE(all.equal(as.numeric(pass_rate), 0.9))`,
          failMessage: "`pass_rate <- mean(students$result == \"Pass\") * 100`.",
        },
      ],
    },
    {
      id: "compare-classes",
      title: "Compare the three classes",
      instructions: `Is one class doing better? Use dplyr to compute one summary row per class, then draw a box plot to see the spread of scores, not just the averages.

1. Create \`class_summary\` from \`students\` with \`group_by(class)\` and \`summarise()\`, containing the columns:
   - \`n\` – the number of students (\`n()\`),
   - \`avg_score\` – the mean of \`average\`,
   - \`pass_rate\` – the percentage of students with \`result == "Pass"\`.
   End the pipe with \`as.data.frame()\` so the result prints as a plain data frame.
2. Create \`class_plot\`: a ggplot box plot with \`class\` on the x-axis and \`average\` on the y-axis (\`geom_boxplot()\`), with a title and axis labels. Print it.`,
      starterCode: `# Step 4: compare the classes

class_summary <- students |>
  group_by(class) |>
  summarise(
    n = n()
    # add avg_score and pass_rate here (separate them with commas)
  ) |>
  as.data.frame()
class_summary

# Box plot of the average score per class
# class_plot <- ggplot(students, aes(x = class, y = average)) + ...

`,
      hints: [
        "Inside `summarise()`: `avg_score = mean(average)` and `pass_rate = mean(result == \"Pass\") * 100`, separated by commas.",
        "A box plot is `geom_boxplot()`. Add a title and labels with `labs(title = \"...\", x = \"...\", y = \"...\")`.",
        "`class_plot <- ggplot(students, aes(x = class, y = average)) + geom_boxplot(fill = \"lightblue\") + labs(title = \"Average score by class\", x = \"Class\", y = \"Average score\")`, then `class_plot` on its own line.",
      ],
      solution: `class_summary <- students |>
  group_by(class) |>
  summarise(
    n = n(),
    avg_score = mean(average),
    pass_rate = mean(result == "Pass") * 100
  ) |>
  as.data.frame()
class_summary

class_plot <- ggplot(students, aes(x = class, y = average)) +
  geom_boxplot(fill = "lightblue") +
  labs(title = "Average score by class", x = "Class", y = "Average score")
class_plot
`,
      explanation: `- \`group_by(class)\` splits the students into the three classes; \`summarise()\` then computes one row per class. \`n()\` counts the rows in each group, \`mean(average)\` averages the scores, and \`mean(result == "Pass") * 100\` gives the percentage of passes. \`as.data.frame()\` turns dplyr's result (a *tibble*) into a plain data frame so all decimals are printed.
- The result:

| class | n | avg_score | pass_rate |
|---|---|---|---|
| A | 18 | 75.30 | 88.9 |
| B | 22 | 74.75 | 86.4 |
| C | 20 | 76.73 | 95.0 |

- Class C has the highest average and pass rate, but the gap between the best and the worst class is **less than 2 points** on a 0–100 scale.
- The box plot shows why that gap means little: the boxes (the middle 50% of each class) overlap almost completely, and within each class scores range from the 50s to the 90s. The differences *within* a class are far larger than the differences *between* classes.

An honest summary for Ms. Lindqvist: *the three classes perform about the same.* (An ANOVA – \`summary(aov(average ~ class, data = students))\` – confirms it: p ≈ 0.85, no evidence of a real difference.)`,
      tests: [
        {
          name: "`class_summary` has one row per class",
          check: `nrow(class_summary) == 3 && all(c("class", "n", "avg_score", "pass_rate") %in% names(class_summary))`,
          failMessage: "Group by `class` and create the columns `n`, `avg_score` and `pass_rate` inside `summarise()`.",
        },
        {
          name: "Class C: average score ≈ 76.73 and pass rate 95%",
          check: `isTRUE(all.equal(class_summary$avg_score[class_summary$class == "C"], 76.73333, tolerance = 1e-5)) && (isTRUE(all.equal(class_summary$pass_rate[class_summary$class == "C"], 95)) || isTRUE(all.equal(class_summary$pass_rate[class_summary$class == "C"], 0.95)))`,
          failMessage: "Use `avg_score = mean(average)` and `pass_rate = mean(result == \"Pass\") * 100` inside `summarise()`.",
        },
        {
          name: "`class_plot` is a box plot",
          check: `.has_geom(class_plot, "GeomBoxplot")`,
          failMessage: "Build `class_plot` with `ggplot(students, aes(x = class, y = average)) + geom_boxplot()`.",
        },
        {
          name: "The box plot is drawn",
          check: `.plots >= 1`,
          failMessage: "Print the plot by writing `class_plot` on its own line.",
        },
      ],
    },
    {
      id: "compare-genders",
      title: "Compare girls and boys",
      instructions: `Now compare the two gender groups, subject by subject.

Create \`gender_summary\` with \`group_by(gender)\` and \`summarise()\`, containing:
- \`n\` – the number of students,
- \`math\`, \`reading\` and \`science\` – the mean score in each subject (science has missing values, so use \`na.rm = TRUE\` there),
- \`avg_score\` – the mean of \`average\`.

End with \`as.data.frame()\` and print it. Then also compare the mean \`study_hours\` of the two groups.`,
      starterCode: `# Step 5: compare the genders

gender_summary <- students |>
  group_by(gender) |>
  summarise(
    n = n(),
    math = mean(math)
    # add reading, science (with na.rm = TRUE) and avg_score
  ) |>
  as.data.frame()
gender_summary

# Mean study hours per gender

`,
      hints: [
        "Inside `summarise()`, a new column can have the same name as the original one: `reading = mean(reading)`.",
        "Science needs `science = mean(science, na.rm = TRUE)`, otherwise the result is NA for both groups.",
        "Add `avg_score = mean(average)`. For study hours: `tapply(students$study_hours, students$gender, mean)`.",
      ],
      solution: `gender_summary <- students |>
  group_by(gender) |>
  summarise(
    n = n(),
    math = mean(math),
    reading = mean(reading),
    science = mean(science, na.rm = TRUE),
    avg_score = mean(average)
  ) |>
  as.data.frame()
gender_summary

tapply(students$study_hours, students$gender, mean)
`,
      explanation: `- The pipe groups the students by gender and summarises each group. Inside \`summarise()\`, \`math = mean(math)\` creates a column called \`math\` holding the group's mean math score.
- \`science = mean(science, na.rm = TRUE)\` is needed because 3 science scores are missing; without it both groups would get \`NA\`.
- The result:

| gender | n | math | reading | science | avg_score |
|---|---|---|---|---|---|
| Female | 31 | 76.58 | 79.84 | 75.73 | 77.36 |
| Male | 29 | 72.59 | 75.93 | 72.70 | 73.67 |

- The girls score higher in **all three subjects**, by about 3–4 points, and their overall average is **3.7 points** higher.
- \`tapply()\` adds context: the girls also report studying more – **9.7 hours** a week against **8.1** for the boys. So part of the gap might be explained by study time rather than by gender itself.

Is a 3.7-point gap "real"? Each group has only about 30 students and individual averages vary by more than 11 points (the standard deviation of \`average\` is 11.3). A t-test (\`t.test(average ~ gender, data = students)\`) gives p ≈ 0.21, so this sample does **not** provide strong evidence of a true difference. Report it as "slightly higher, but within what chance could produce".`,
      tests: [
        {
          name: "`gender_summary` has 2 rows with n, math, reading, science and avg_score",
          check: `nrow(gender_summary) == 2 && all(c("gender", "n", "math", "reading", "science", "avg_score") %in% names(gender_summary))`,
          failMessage: "Group by `gender` and create the columns `n`, `math`, `reading`, `science` and `avg_score`.",
        },
        {
          name: "Science means are not NA (female ≈ 75.73)",
          check: `!anyNA(gender_summary$science) && isTRUE(all.equal(gender_summary$science[gender_summary$gender == "Female"], 75.73333, tolerance = 1e-5))`,
          failMessage: "Use `science = mean(science, na.rm = TRUE)`.",
        },
        {
          name: "Male average score ≈ 73.67",
          check: `isTRUE(all.equal(gender_summary$avg_score[gender_summary$gender == "Male"], 73.66667, tolerance = 1e-5))`,
          failMessage: "Add `avg_score = mean(average)` to `summarise()`.",
        },
      ],
    },
    {
      id: "study-correlation",
      title: "Measure how studying relates to math scores",
      instructions: `A *correlation* measures how strongly two numeric variables move together, on a scale from -1 to 1: close to 1 means "when one is high, the other tends to be high too", close to 0 means "no straight-line relationship", and negative values mean one goes down as the other goes up.

1. Store the correlation between \`study_hours\` and \`math\` in \`study_math_cor\`.
2. Store the correlation between \`attendance\` and \`math\` in \`attendance_math_cor\`.
3. Print both, rounded to 2 decimals.
4. Print the full correlation matrix of \`study_hours\`, \`attendance\`, \`math\`, \`reading\` and \`average\` (rounded) – \`cor()\` of a data frame correlates every pair of columns.`,
      starterCode: `# Step 6: correlations

# Study hours vs math score
study_math_cor <- cor(students$study_hours, students$math)

# Attendance vs math score
# attendance_math_cor <- ...


# Print both, rounded to 2 decimals


# Correlation matrix of several columns
# round(cor(students[, c(...)]), 2)

`,
      hints: [
        "`cor(x, y)` takes two numeric vectors of the same length.",
        "`attendance_math_cor <- cor(students$attendance, students$math)`, then `round(study_math_cor, 2)`.",
        "`round(cor(students[, c(\"study_hours\", \"attendance\", \"math\", \"reading\", \"average\")]), 2)`.",
      ],
      solution: `study_math_cor <- cor(students$study_hours, students$math)
attendance_math_cor <- cor(students$attendance, students$math)

round(study_math_cor, 2)
round(attendance_math_cor, 2)

round(cor(students[, c("study_hours", "attendance", "math", "reading", "average")]), 2)
`,
      explanation: `- \`cor(students$study_hours, students$math)\` is **0.59** – a moderate to strong positive relationship: students who study more tend to have higher math scores.
- \`cor(students$attendance, students$math)\` is only **0.26** – a weak positive relationship. Being in class helps a little, but attendance tells you much less about a student's math score than study time does.
- The correlation matrix shows every pair at once (each value appears twice, mirrored around the diagonal of 1s). Some useful entries:
  - study hours vs **average** score: **0.64** – the strongest link of study time;
  - **math vs reading: 0.80** – students good at one subject tend to be good at the other;
  - **study hours vs attendance: 0.09** – almost unrelated: students who attend a lot do not necessarily study more at home.

Two warnings. A correlation only measures *straight-line* relationships, so always look at a scatter plot too (next step). And correlation is not causation: studying more probably helps, but motivated students might both study more *and* score higher for other reasons. These data cannot separate the two.`,
      tests: [
        {
          name: "`study_math_cor` ≈ 0.59",
          check: `isTRUE(all.equal(as.numeric(study_math_cor), 0.5898696, tolerance = 1e-4))`,
          failMessage: "Use `cor(students$study_hours, students$math)` (unrounded is fine).",
        },
        {
          name: "`attendance_math_cor` ≈ 0.26",
          check: `isTRUE(all.equal(as.numeric(attendance_math_cor), 0.2550493, tolerance = 1e-4))`,
          failMessage: "Use `cor(students$attendance, students$math)`.",
        },
      ],
    },
    {
      id: "scatter-plot",
      title: "Draw a scatter plot with a trend line",
      instructions: `A *scatter plot* shows one point per student, with one variable on each axis – the best way to see a relationship between two numbers.

Create \`study_plot\` with ggplot2:
1. \`study_hours\` on the x-axis and \`math\` on the y-axis.
2. Points with \`geom_point()\`.
3. A straight trend line with \`geom_smooth(method = "lm", se = FALSE)\` – \`method = "lm"\` draws the best-fitting straight line, and \`se = FALSE\` hides the grey uncertainty band.
4. A title that states the finding, and clear axis labels, with \`labs()\`.

Print the plot.`,
      starterCode: `# Step 7: scatter plot of study hours vs math score

study_plot <- ggplot(students, aes(x = study_hours, y = math)) +
  geom_point()
  # add + geom_smooth(...) and + labs(...)

study_plot
`,
      hints: [
        "Each layer is added with `+` at the end of the previous line.",
        "`geom_smooth(method = \"lm\", se = FALSE)` adds the straight line.",
        "`labs(title = \"Students who study more score higher in math\", x = \"Study hours per week\", y = \"Math score\")`.",
      ],
      solution: `study_plot <- ggplot(students, aes(x = study_hours, y = math)) +
  geom_point(colour = "steelblue", size = 2) +
  geom_smooth(method = "lm", se = FALSE, colour = "darkred") +
  labs(title = "Students who study more score higher in math",
       x = "Study hours per week", y = "Math score")
study_plot
`,
      explanation: `- \`ggplot(students, aes(x = study_hours, y = math))\` sets the data and the *aesthetic mapping* – which column goes on which axis. Every layer added with \`+\` uses this mapping.
- \`geom_point()\` draws one dot per student (60 dots); \`colour\` and \`size\` change their look.
- \`geom_smooth(method = "lm", se = FALSE)\` fits and draws the best straight line through the points. R prints the message "\`geom_smooth()\` using formula = 'y ~ x'" – just information, not an error.
- \`labs()\` sets the title and axis labels. A title that states the finding ("…study more score higher…") tells the reader what to look for.

What the plot shows: the cloud of points rises from left to right, matching the correlation of 0.59. But the points are widely scattered around the line – students who study 9–11 hours a week score anywhere from 59 to 94 in math. Study time matters, but it is far from the whole story. There are no extreme outliers that would distort the line; the student who studies most (Noah, 20 hours) also has one of the top scores (98).`,
      tests: [
        {
          name: "`study_plot` has points and a smooth trend line",
          check: `.has_geom(study_plot, "GeomPoint") && .has_geom(study_plot, "GeomSmooth")`,
          failMessage: "Add both `geom_point()` and `geom_smooth(method = \"lm\", se = FALSE)` to `study_plot`.",
        },
        {
          name: "Study hours are on the x-axis and math scores on the y-axis",
          check: `any(vapply(1:5, function(i) tryCatch({ d <- ggplot2::layer_data(study_plot, i); isTRUE(all.equal(sort(as.numeric(d$x)), sort(as.numeric(students$study_hours)))) && isTRUE(all.equal(sort(as.numeric(d$y)), sort(as.numeric(students$math)))) }, error = function(e) FALSE), logical(1)))`,
          failMessage: "Map the columns with `aes(x = study_hours, y = math)`.",
        },
        {
          name: "The plot has a title",
          check: `!is.null(.gg_label(study_plot, "title"))`,
          failMessage: "Add a title with `labs(title = \"...\")`.",
        },
        {
          name: "The plot is drawn",
          check: `.plots >= 1`,
          failMessage: "Print the plot by writing `study_plot` on its own line.",
        },
      ],
    },
    {
      id: "linear-model",
      title: "Fit a linear model: how much is an hour of study worth?",
      instructions: `A correlation says *how strongly* two variables are related; a *linear regression* also says *by how much*. \`lm(y ~ x, data = ...)\` (linear model) finds the straight line \`y = intercept + slope × x\` that fits the data best – the same line you drew in Step 7.

1. Fit \`math_model <- lm(math ~ study_hours, data = students)\`. Read \`~\` as "is explained by".
2. Print \`summary(math_model)\` and \`coef(math_model)\` (the intercept and the slope).
3. Use \`predict()\` to store the predicted math score of a student who studies 10 hours a week in \`predicted_10\`. \`predict()\` needs the new value in a data frame with the same column name: \`data.frame(study_hours = 10)\`.`,
      starterCode: `# Step 8: linear model

# Math score explained by study hours
math_model <- lm(math ~ study_hours, data = students)

# Full summary and just the coefficients


# Predicted math score for 10 study hours per week
# predicted_10 <- predict(math_model, newdata = ...)

`,
      hints: [
        "`summary(math_model)` prints the full table; `coef(math_model)` returns just the intercept and slope.",
        "`newdata` must be a data frame with a column called `study_hours`: `data.frame(study_hours = 10)`.",
        "`predicted_10 <- predict(math_model, newdata = data.frame(study_hours = 10))`.",
      ],
      solution: `math_model <- lm(math ~ study_hours, data = students)

summary(math_model)
coef(math_model)

predicted_10 <- predict(math_model, newdata = data.frame(study_hours = 10))
predicted_10
`,
      explanation: `\`lm(math ~ study_hours, data = students)\` fits the line. The key parts of \`summary(math_model)\`:

- **Coefficients.** The intercept is **60.46** and the slope for \`study_hours\` is **1.586**. The line is: *predicted math = 60.46 + 1.586 × study hours*. So **each extra hour of study per week goes with about 1.6 more math points**. The intercept is the predicted score for 0 hours – a starting point for the line rather than something to interpret on its own (nobody in the data studies 0 hours; the minimum is 1).
- **Pr(>|t|)** for \`study_hours\` is **7.07e-07** (0.000000707): a slope this large would be extremely unlikely if study hours and math were unrelated, so the relationship is statistically significant.
- **Multiple R-squared: 0.3479** – study hours explain about **35%** of the variation in math scores. The other 65% comes from everything the model does not know: ability, sleep, teaching, luck on the test day… (R-squared is the correlation squared: 0.59² ≈ 0.35.)
- **Residual standard error: 9.327** – a typical student's real score is about 9 points above or below the line.

\`predict(math_model, newdata = data.frame(study_hours = 10))\` gives **76.31**: the model's expected math score for a student who studies 10 hours a week (60.46 + 1.586 × 10).

For the parents' evening: *students who study more tend to score higher – roughly 1.6 math points per extra weekly hour – but study time explains only about a third of the differences between students, and these data show an association, not proof that studying causes the higher scores.*`,
      tests: [
        {
          name: "`math_model` is a linear model of math on study_hours (slope ≈ 1.586)",
          check: `inherits(math_model, "lm") && isTRUE(all.equal(unname(coef(math_model)[["study_hours"]]), 1.58561, tolerance = 1e-4))`,
          failMessage: "Fit `lm(math ~ study_hours, data = students)` – math goes on the left of `~`.",
        },
        {
          name: "`predicted_10` ≈ 76.31",
          check: `isTRUE(all.equal(as.numeric(predicted_10), 76.31489, tolerance = 1e-3))`,
          failMessage: "Use `predict(math_model, newdata = data.frame(study_hours = 10))`.",
        },
      ],
    },
  ],
  wrapUp: `You produced a complete, honest picture of the term's results:

- Each student got one average score, with a clear, documented decision for the 3 missing science scores (\`rowMeans(na.rm = TRUE)\`).
- **54 of 60 students (90%) passed**; most of the six who failed study 3 hours a week or less.
- The classes perform about the same (averages 74.75–76.73) – the spread *within* each class dwarfs the gaps *between* them.
- Girls score about 3.7 points higher on average, but they also study more, and the gap is within what chance could produce (p ≈ 0.21).
- Study time has a moderate positive relationship with math (r = 0.59): about **+1.6 points per weekly study hour**, explaining roughly 35% of the variation.

Just as important as the numbers were the words around them: "about the same", "not strong evidence", "association, not causation". Clear, careful wording is what makes an analysis trustworthy.

**Ideas to go further**

- Add attendance to the model: \`lm(math ~ study_hours + attendance, data = students)\`. Does the study-hours slope change?
- Fit the same model for reading and science. Is studying equally "worth it" in every subject?
- Colour the scatter plot by class (\`aes(colour = class)\`) or split it with \`facet_wrap(~ class)\`.
- Use \`case_when()\` from dplyr to create grades (A ≥ 90, B ≥ 80, …) instead of just pass/fail, and count them per class.`,
};
