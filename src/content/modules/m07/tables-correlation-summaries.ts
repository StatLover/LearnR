import type { Lesson } from "../../types";

export const tablesCorrelationSummariesLesson: Lesson = {
  id: "tables-correlation-summaries",
  module: 7,
  title: "Frequency Tables, Correlation and Dataset Summaries",
  summary: "Count categories with frequency tables, measure relationships with correlation, summarise whole datasets by group and explain the results in plain English.",
  minutes: 40,
  objectives: [
    "Build one-way and two-way frequency tables with table(), and turn counts into proportions with prop.table() and round()",
    "Explain what a correlation coefficient measures and compute it with cor()",
    "Tell the difference between Pearson and Spearman correlation – and between correlation and causation",
    "Summarise a dataset and compare groups with summary(), tapply(), aggregate() and dplyr's group_by() + summarise()",
    "Write a clear, honest plain-English interpretation of descriptive statistics",
  ],
  intro: `So far you have summarised **one numeric column** at a time. Real questions are usually bigger: *Which feature do customers like most? Do customers in some regions recommend the app more often? Do students who study more score higher? How do the three classes compare?*

This lesson gives you the tools for those questions. **Frequency tables** count how often each category appears – on its own or crossed with another category. **Correlation** is a single number that measures how strongly two numeric variables move together. **Group summaries** compute means, medians and spreads for each group in one go. Finally, you will practise the most important skill of all: turning the numbers into a few clear, honest sentences.`,
  sections: [
    {
      id: "frequency-tables",
      title: "Frequency tables: counting categories",
      blocks: [
        {
          kind: "definition",
          term: "Frequency table",
          md: "A table that lists each distinct value of a variable and **how many times** it occurs (its *frequency*). It is the main summary for a **categorical variable** – a variable whose values are groups or labels, such as a region or a favourite feature.",
        },
        {
          kind: "text",
          md: `By hand you would make a tally: go through the answers one by one and add a mark next to each category. For five pets – cat, dog, cat, bird, cat – the tally is bird 1, cat 3, dog 1. In R, \`table()\` does the tallying for you, whatever the size of the data.`,
        },
        {
          kind: "code",
          example: {
            id: "table-counts",
            title: "Counting with table() and sorting the counts",
            code: `survey <- read.csv("data/survey.csv")

feature_counts <- table(survey$favorite_feature)
feature_counts
sort(feature_counts, decreasing = TRUE)`,
            explanation: [
              { code: "feature_counts <- table(survey$favorite_feature)", text: "Counts how many of the 200 respondents chose each favourite feature, and stores the table." },
              { code: "feature_counts", text: "Prints the table. Categories are listed alphabetically." },
              { code: "sort(feature_counts, decreasing = TRUE)", text: "`sort()` reorders the table from the largest count to the smallest – easier to read." },
            ],
            output: `
          Price Recommendations          Search         Support
             60              43              55              42

          Price          Search Recommendations         Support
             60              55              43              42`,
            outputNote: "Each name is a category, and the number under it is its count: 60 people chose Price, 55 Search, 43 Recommendations and 42 Support. The counts add up to 200 – every respondent appears exactly once.",
          },
        },
        {
          kind: "text",
          md: `### From counts to proportions

"60 people" means more when you know it is 60 **out of 200**. A **proportion** is a count divided by the total (60 / 200 = 0.30), and a **percentage** is a proportion times 100 (30%). \`prop.table()\` divides every count by the total for you; \`round()\` keeps the result readable.`,
        },
        {
          kind: "code",
          example: {
            id: "prop-table",
            title: "prop.table() and round()",
            code: `survey <- read.csv("data/survey.csv")
feature_counts <- table(survey$favorite_feature)

prop.table(feature_counts)
round(prop.table(feature_counts), 2)
round(100 * prop.table(feature_counts), 1)`,
            explanation: [
              { code: "prop.table(feature_counts)", text: "Divides each count by the total (200). The results add up to 1." },
              { code: "round(prop.table(feature_counts), 2)", text: "`round(x, 2)` keeps two decimal places." },
              { code: "round(100 * prop.table(feature_counts), 1)", text: "Multiplying by 100 turns proportions into percentages; we keep one decimal place." },
            ],
            output: `
          Price Recommendations          Search         Support
          0.300           0.215           0.275           0.210

          Price Recommendations          Search         Support
           0.30            0.22            0.28            0.21

          Price Recommendations          Search         Support
           30.0            21.5            27.5            21.0`,
            outputNote: "The percentages are the easiest to communicate: **30% of respondents named Price** as their favourite feature, 27.5% Search, 21.5% Recommendations and 21% Support. Notice that rounding to two decimals turned 0.215 into 0.22 – rounding always loses a little detail, so round only when you present results.",
            tryIt: "Make a frequency table and a percentage table of `survey$age_group`. Which age group answered the survey most often?",
          },
        },
        {
          kind: "diagram",
          name: "histogram-vs-bar",
          caption: "A frequency table of a categorical variable is drawn as a bar chart: one bar per category, its height the count.",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Counting missing values too",
          md: "`table()` silently leaves out `NA` values. Add `useNA = \"ifany\"` to include a count of missing values: `table(x, useNA = \"ifany\")`. Knowing how many answers are missing is part of describing your data honestly.",
        },
      ],
    },
    {
      id: "two-way-tables",
      title: "Two-way tables: crossing two categories",
      blocks: [
        {
          kind: "text",
          md: `A **two-way table** (also called a *contingency table* or *cross-tabulation*) counts combinations of **two** categorical variables. Give \`table()\` two columns: the first becomes the rows, the second the columns. Each cell counts the respondents with that particular combination, for example "from the East **and** answered No".`,
        },
        {
          kind: "code",
          example: {
            id: "two-way-table",
            title: "Region × recommend",
            code: `survey <- read.csv("data/survey.csv")

region_rec <- table(Region = survey$region, Recommend = survey$recommend)
region_rec
addmargins(region_rec)`,
            explanation: [
              { code: "region_rec <- table(Region = survey$region, Recommend = survey$recommend)", text: "Two variables give a two-way table. Naming them (`Region = …`) prints those names as table headers." },
              { code: "region_rec", text: "Rows are regions, columns are the answers No/Yes." },
              { code: "addmargins(region_rec)", text: "`addmargins()` adds a `Sum` row and a `Sum` column with the totals." },
            ],
            output: `       Recommend
Region  No Yes
  East  16  31
  North 12  35
  South 19  34
  West  12  41
       Recommend
Region   No Yes Sum
  East   16  31  47
  North  12  35  47
  South  19  34  53
  West   12  41  53
  Sum    59 141 200`,
            outputNote: "Read a cell as \"row **and** column\": 16 respondents are from the East and would **not** recommend the app. The margins show the totals: 47 respondents from the East, and 141 of all 200 respondents would recommend the app.",
          },
        },
        {
          kind: "text",
          md: `### Row proportions make fair comparisons

Is the West really happier than the North? The counts are hard to compare because the regions have different sizes (47 vs 53 people). The fair comparison is the **share of Yes within each region**. With \`prop.table(table, margin = 1)\` every **row** is divided by its own row total, so each row adds up to 1. (\`margin = 2\` would divide by column totals instead.)`,
        },
        {
          kind: "code",
          example: {
            id: "row-proportions",
            title: "Proportions within each region",
            code: `survey <- read.csv("data/survey.csv")
region_rec <- table(Region = survey$region, Recommend = survey$recommend)

round(prop.table(region_rec, margin = 1), 2)`,
            explanation: [
              { code: "prop.table(region_rec, margin = 1)", text: "`margin = 1` means \"per row\": each count is divided by its region's total." },
              { code: "round(prop.table(region_rec, margin = 1), 2)", text: "Rounded to two decimals for reading." },
            ],
            output: `       Recommend
Region    No  Yes
  East  0.34 0.66
  North 0.26 0.74
  South 0.36 0.64
  West  0.23 0.77`,
            outputNote: "Each row now adds up to 1. **77% of West respondents** would recommend the app, compared with **64% in the South**. Whether a difference of this size could just be chance is a question for the chi-square test in Module 9 – descriptive statistics only describe what we see.",
            tryIt: "Cross `survey$gender` with `survey$recommend`. Which gender recommends the app most often (as a proportion)?",
          },
        },
        {
          kind: "question",
          question: {
            id: "m7-tables-q1",
            type: "multiple-choice",
            prompt: "In `prop.table(tab, margin = 1)`, what does `margin = 1` do?",
            options: [
              "Divides each count by its row total, so every row adds up to 1",
              "Divides each count by its column total, so every column adds up to 1",
              "Divides each count by the grand total",
              "Rounds the table to 1 decimal place",
            ],
            answer: 0,
            explanation: "In R, margin 1 means rows and margin 2 means columns. Row proportions answer questions like \"within each region, what share said Yes?\".",
            optionFeedback: [
              "Correct.",
              "That is `margin = 2`.",
              "That is what `prop.table(tab)` does with no margin.",
              "Rounding is done by `round()`, not by `prop.table()`.",
            ],
            concept: "frequency-tables",
          },
        },
      ],
    },
    {
      id: "correlation",
      title: "Correlation: do two variables move together?",
      blocks: [
        {
          kind: "text",
          md: `Do students who study more get better math scores? Before computing anything, **look**: in a scatter plot each student is one point, with study hours on the x-axis and the math score on the y-axis.`,
        },
        {
          kind: "code",
          example: {
            id: "scatter-intuition",
            title: "Look first: a scatter plot",
            code: `students <- read.csv("data/students.csv")

plot(students$study_hours, students$math,
     xlab = "Study hours per week", ylab = "Math score",
     main = "Study time and math scores")`,
            explanation: [
              { code: "plot(students$study_hours, students$math,", text: "With two numeric vectors, base R's `plot()` draws a scatter plot: the first vector goes on the x-axis, the second on the y-axis." },
              { code: `     xlab = "Study hours per week", ylab = "Math score",`, text: "Axis labels, so the reader knows what each axis shows." },
            ],
            plot: true,
            tryIt: "Plot `students$attendance` against `students$math`. Does the cloud of points slope upwards as clearly?",
          },
        },
        {
          kind: "text",
          md: `The points drift **upwards** from left to right: students who study more *tend* to score higher – but with plenty of scatter. Correlation turns that picture into a number.

The **correlation coefficient** (written *r*) is always between **−1 and +1**:

* **Direction** – the sign. Positive (r > 0): when one variable is high, the other tends to be high too. Negative (r < 0): when one is high, the other tends to be low.
* **Strength** – the size. Close to +1 or −1: the points lie close to a straight line. Close to 0: no straight-line pattern.`,
        },
        {
          kind: "table",
          caption: "A rough guide to correlation strength (fields differ; always look at the plot too)",
          headers: ["Value of r", "Description", "Picture"],
          rows: [
            ["+1", "Perfect positive", "All points exactly on a rising line"],
            ["about +0.7 to +0.99", "Strong positive", "Tight cloud rising to the right"],
            ["about +0.3 to +0.7", "Moderate positive", "Rising cloud with clear scatter"],
            ["about −0.3 to +0.3", "Weak or none", "Shapeless cloud (no straight-line trend)"],
            ["about −0.7 to −0.3", "Moderate negative", "Falling cloud with clear scatter"],
            ["about −0.99 to −0.7", "Strong negative", "Tight cloud falling to the right"],
            ["−1", "Perfect negative", "All points exactly on a falling line"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "cor-small",
            title: "cor() with tiny data",
            code: `hours <- c(1, 2, 3, 4, 5)
score <- c(52, 60, 61, 70, 75)

cor(hours, score)
cor(hours, rev(score))
cor(hours, c(60, 52, 75, 61, 70))`,
            explanation: [
              { code: "cor(hours, score)", text: "Scores rise almost perfectly with hours: a strong positive correlation." },
              { code: "cor(hours, rev(score))", text: "`rev()` reverses the scores, so now they *fall* as hours rise: the same strength with a negative sign." },
              { code: "cor(hours, c(60, 52, 75, 61, 70))", text: "The same five scores in a jumbled order: only a moderate upward tendency is left." },
            ],
            output: `[1] 0.9820029
[1] -0.9820029
[1] 0.5085372`,
            outputNote: "0.98 is a very strong positive relationship, −0.98 is an equally strong **negative** one, and 0.51 is moderate. Correlation has **no unit**: it would be the same if you measured time in minutes instead of hours.",
          },
        },
        {
          kind: "code",
          example: {
            id: "cor-real",
            title: "Correlations in real data",
            code: `students <- read.csv("data/students.csv")

cor(students$study_hours, students$math)
cor(students$attendance, students$math)
cor(mtcars$wt, mtcars$mpg)`,
            explanation: [
              { code: "cor(students$study_hours, students$math)", text: "Study time vs math score – the relationship from the scatter plot." },
              { code: "cor(students$attendance, students$math)", text: "Attendance vs math score." },
              { code: "cor(mtcars$wt, mtcars$mpg)", text: "Car weight vs fuel efficiency (miles per gallon) in the built-in `mtcars` data." },
            ],
            output: `[1] 0.5898696
[1] 0.2550493
[1] -0.8676594`,
            outputNote: "Study hours and math scores have a **moderate positive** correlation (r ≈ 0.59). Attendance is only **weakly** related to math scores here (r ≈ 0.26). Heavier cars travel fewer miles per gallon: a **strong negative** correlation (r ≈ −0.87).",
          },
        },
        {
          kind: "code",
          example: {
            id: "cor-matrix",
            title: "Many correlations at once",
            code: `round(cor(mtcars[, c("mpg", "wt", "hp", "qsec")]), 2)`,
            explanation: [
              { code: `mtcars[, c("mpg", "wt", "hp", "qsec")]`, text: "Selects four numeric columns: fuel efficiency, weight, horsepower and quarter-mile time." },
              { code: "cor(...)", text: "Given a data frame, `cor()` computes the correlation of every pair of columns: a *correlation matrix*." },
              { code: "round(..., 2)", text: "Two decimals are plenty for correlations." },
            ],
            output: `       mpg    wt    hp  qsec
mpg   1.00 -0.87 -0.78  0.42
wt   -0.87  1.00  0.66 -0.17
hp   -0.78  0.66  1.00 -0.71
qsec  0.42 -0.17 -0.71  1.00`,
            outputNote: "Find a pair by its row and column: `mpg` and `hp` correlate at −0.78 (more powerful cars use more fuel). The diagonal is always 1 (every variable correlates perfectly with itself), and the matrix is symmetric: the correlation of wt with hp equals that of hp with wt.",
          },
        },
        {
          kind: "code",
          example: {
            id: "cor-missing",
            title: "Correlation with missing values",
            code: `students <- read.csv("data/students.csv")

cor(students$math, students$science)
cor(students$math, students$science, use = "complete.obs")`,
            explanation: [
              { code: "cor(students$math, students$science)", text: "Science has 3 missing values, so the result is `NA`." },
              { code: `use = "complete.obs"`, text: "`cor()` does not use `na.rm`. Instead, `use = \"complete.obs\"` keeps only the students who have **both** values." },
            ],
            output: `[1] NA
[1] 0.7539694`,
            outputNote: "Among the 57 students with both scores, math and science are **strongly** correlated (r ≈ 0.75): students who do well in one subject tend to do well in the other.",
          },
        },
      ],
    },
    {
      id: "pearson-spearman",
      title: "Pearson vs Spearman – and correlation is not causation",
      blocks: [
        {
          kind: "text",
          md: `By default \`cor()\` computes the **Pearson** correlation, which measures how close the points are to a **straight line**. Two situations fool it:

* a relationship that always rises but **curves**, and
* a few **outliers**, which can pull r up or down a lot.

The **Spearman** correlation (\`method = "spearman"\`) first replaces each value by its **rank** (1st smallest, 2nd smallest …) and then correlates the ranks. It asks a simpler question – *does y tend to go up whenever x goes up?* – so it handles curves and outliers better.`,
        },
        {
          kind: "code",
          example: {
            id: "pearson-vs-spearman",
            title: "A curved relationship and an outlier",
            code: `x <- 1:10
y <- x^3
cor(x, y)
cor(x, y, method = "spearman")

a <- c(1, 2, 3, 4, 5, 6, 7, 8)
b <- c(3, 5, 4, 6, 7, 6, 8, 40)
cor(a, b)
cor(a, b, method = "spearman")`,
            explanation: [
              { code: "y <- x^3", text: "y always increases with x, but along a curve, not a line." },
              { code: "cor(x, y)", text: "Pearson is below 1, because the points are not on a straight line." },
              { code: `cor(x, y, method = "spearman")`, text: "The ranks match perfectly (the biggest x has the biggest y, and so on), so Spearman is exactly 1." },
              { code: "b <- c(3, 5, 4, 6, 7, 6, 8, 40)", text: "A steady upward pattern … with one outlier (40) at the end." },
              { code: "cor(a, b)", text: "Pearson is pulled around by the single extreme value." },
            ],
            output: `[1] 0.9283912
[1] 1
[1] 0.6674999
[1] 0.9341485`,
            outputNote: "For the curve, Pearson says 0.93 but Spearman says a perfect 1 – the relationship is perfectly *monotonic* (always rising). In the second example the outlier drags Pearson down to 0.67, while Spearman (0.93) still sees the clear upward pattern. Use Pearson for straight-line relationships without outliers, and Spearman for curved patterns, outliers, or ranked data such as ratings.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Correlation is not causation",
          md: `A correlation shows that two variables **move together**. It does **not** show that one *causes* the other. Ice-cream sales and sunburns are positively correlated – not because ice cream burns skin, but because a third variable, sunny weather, drives both. Such a hidden third variable is called a **confounder**.

So write *"students who study more tend to score higher"*, not *"studying more raises your score by …"*. To show cause and effect you need a controlled experiment, not just a correlation.`,
        },
        {
          kind: "question",
          question: {
            id: "m7-tables-q2",
            type: "true-false",
            prompt: "In a city, the number of fire fighters sent to a fire is strongly positively correlated with the damage the fire causes. This shows that sending fire fighters causes damage.",
            answer: false,
            explanation: "False. Correlation is not causation. A confounder – the **size of the fire** – causes both more fire fighters and more damage.",
            concept: "correlation",
          },
        },
      ],
    },
    {
      id: "summarizing-datasets",
      title: "Summarising a whole dataset and comparing groups",
      blocks: [
        {
          kind: "text",
          md: `\`summary()\` is the fastest way to get an overview of numeric data: it prints the five-number summary plus the mean, and counts missing values.`,
        },
        {
          kind: "code",
          example: {
            id: "summary-function",
            title: "summary() for one column and for several",
            code: `students <- read.csv("data/students.csv")

summary(students$math)
summary(students[, c("math", "reading", "science")])`,
            explanation: [
              { code: "summary(students$math)", text: "Six numbers for one column: minimum, Q1, median, mean, Q3 and maximum." },
              { code: `summary(students[, c("math", "reading", "science")])`, text: "For a data frame, `summary()` summarises every column side by side." },
            ],
            output: `   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
  53.00   67.00   74.00   74.65   82.25   99.00
      math          reading          science
 Min.   :53.00   Min.   : 51.00   Min.   : 46.0
 1st Qu.:67.00   1st Qu.: 68.75   1st Qu.: 66.0
 Median :74.00   Median : 79.00   Median : 74.0
 Mean   :74.65   Mean   : 77.95   Mean   : 74.3
 3rd Qu.:82.25   3rd Qu.: 86.00   3rd Qu.: 83.0
 Max.   :99.00   Max.   :100.00   Max.   :100.0
                                  NAs    :3`,
            outputNote: "Everything from the last two lessons in one view. Reading has the highest median (79). For every subject the mean and median are close, so no subject is strongly skewed. The `NAs :3` line warns you that 3 science scores are missing. Note that `summary()` rounds to about four significant digits (science's mean 74.29825 is shown as 74.3).",
          },
        },
        {
          kind: "text",
          md: `### Statistics per group

To **compare groups** – for example the three classes A, B and C – you want the same statistic computed separately for each group. Base R offers two tools, and dplyr a third:

* \`tapply(values, groups, function)\` – splits \`values\` by \`groups\` and applies \`function\` to each piece.
* \`aggregate(value ~ group, data = ..., FUN = ...)\` – the same idea with a *formula* (\`~\` reads "by") and a data frame as the result.
* \`group_by()\` + \`summarise()\` from dplyr – several statistics per group at once.`,
        },
        {
          kind: "code",
          example: {
            id: "tapply-groups",
            title: "tapply(): one statistic per group",
            code: `students <- read.csv("data/students.csv")

tapply(students$math, students$class, mean)
tapply(students$math, students$gender, median)`,
            explanation: [
              { code: "tapply(students$math, students$class, mean)", text: "Split the math scores by class, then take the mean of each class's scores." },
              { code: "tapply(students$math, students$gender, median)", text: "Any summary function works – here the median per gender." },
            ],
            output: `       A        B        C
74.94444 72.95455 76.25000
Female   Male
    79     71`,
            outputNote: "The result is a named vector: class C has the highest mean math score (76.25), class B the lowest (72.95). The median math score is 79 for female and 71 for male students.",
          },
        },
        {
          kind: "code",
          example: {
            id: "aggregate-groups",
            title: "aggregate(): a data frame of group statistics",
            code: `students <- read.csv("data/students.csv")

aggregate(math ~ class, data = students, FUN = mean)
aggregate(cbind(math, reading) ~ gender, data = students, FUN = mean)`,
            explanation: [
              { code: "aggregate(math ~ class, data = students, FUN = mean)", text: "Read the formula `math ~ class` as \"math, by class\". `FUN` is the function to apply to each group." },
              { code: "cbind(math, reading) ~ gender", text: "`cbind()` on the left summarises several columns at once." },
            ],
            output: `  class     math
1     A 74.94444
2     B 72.95455
3     C 76.25000
  gender     math  reading
1 Female 76.58065 79.83871
2   Male 72.58621 75.93103`,
            outputNote: "The same class means as with `tapply()`, but as a data frame – handy for further work. Female students have higher mean scores than male students in both math (76.6 vs 72.6) and reading (79.8 vs 75.9) in this class of 60.",
          },
        },
        {
          kind: "code",
          example: {
            id: "dplyr-group-summary",
            title: "group_by() + summarise(): several statistics per group",
            code: `library(dplyr)

students <- read.csv("data/students.csv")

students |>
  group_by(class) |>
  summarise(
    n = n(),
    mean_math = mean(math),
    sd_math = sd(math),
    median_math = median(math)
  ) |>
  as.data.frame()`,
            packages: ["dplyr"],
            explanation: [
              { code: "group_by(class) |>", text: "Splits the data into one group per class." },
              { code: "    n = n(),", text: "`n()` counts the students in each group – always report group sizes." },
              { code: "    sd_math = sd(math),", text: "Spread inside each class, next to the center." },
              { code: "  as.data.frame()", text: "`summarise()` returns a tibble; converting it to a plain data frame gives the familiar printout." },
            ],
            output: `  class  n mean_math   sd_math median_math
1     A 18  74.94444 11.232685        72.0
2     B 22  72.95455 13.716439        73.0
3     C 20  76.25000  8.961174        76.5`,
            outputNote: "One row per class with its size, mean, SD and median. Class C has the highest mean (76.3) **and** the smallest spread (SD 9.0). Class B has the most spread (SD 13.7).",
            tryIt: "Add `max_math = max(math)` and `cor_study = cor(study_hours, math)` inside `summarise()`.",
          },
        },
      ],
    },
    {
      id: "interpreting-results",
      title: "Understanding and explaining statistical results",
      blocks: [
        {
          kind: "text",
          md: `Numbers only become useful when someone understands them. A good interpretation is short, specific and honest. Compare:

* **Unhelpful:** *"mean_math = 76.25, sd = 8.96"*
* **Helpful:** *"Class C has the highest average math score (76 points). Its scores are also the most consistent: most students are within about 9 points of that average."*

The second version names the variable, gives rounded numbers **with units**, says what the spread means and compares the groups.`,
        },
        {
          kind: "steps",
          title: "A checklist for interpreting descriptive statistics",
          items: [
            "**What and who**: say which variable you describe and how many observations (and missing values) there are.",
            "**Center**: give the mean or median (with its unit) – the median when the data is skewed or has outliers.",
            "**Spread**: give the SD or IQR and explain it (\"most values within about … of …\").",
            "**Comparison**: compare groups using proportions or group statistics, not raw counts of unequal groups.",
            "**Relationships**: describe a correlation's direction and strength – and never claim it shows cause and effect.",
            "**Caveats**: mention outliers, skew, small groups or missing data that could change the picture.",
          ],
        },
        {
          kind: "code",
          example: {
            id: "interpret-housing",
            title: "Describing house prices by neighbourhood",
            code: `housing <- read.csv("data/housing.csv")

table(housing$neighborhood)
aggregate(price ~ neighborhood, data = housing, FUN = median)
tapply(housing$price, housing$neighborhood, IQR)
cor(housing$size_sqft, housing$price)`,
            explanation: [
              { code: "table(housing$neighborhood)", text: "How many sales per neighbourhood – the group sizes." },
              { code: "aggregate(price ~ neighborhood, data = housing, FUN = median)", text: "Median price per neighbourhood (prices are often skewed, so the median is a safe center)." },
              { code: "tapply(housing$price, housing$neighborhood, IQR)", text: "The IQR per neighbourhood: the spread that goes with the median." },
              { code: "cor(housing$size_sqft, housing$price)", text: "How strongly size and price move together across all 200 houses." },
            ],
            output: `
 Downtown Hillcrest   Oakwood Riverside
       47        60        45        48
  neighborhood  price
1     Downtown 377500
2    Hillcrest 365000
3      Oakwood 294500
4    Riverside 334500
 Downtown Hillcrest   Oakwood Riverside
   117500     84750    107000    124875
[1] 0.8493674`,
            outputNote: `A plain-English interpretation:

> *"We looked at 200 house sales (45–60 per neighbourhood). Downtown is the most expensive area, with a median price of $377,500, and Oakwood the cheapest ($294,500). Prices vary a lot within every neighbourhood: the IQR (the width of the middle half of prices) is between about $85,000 (Hillcrest) and $125,000 (Riverside). Bigger houses tend to sell for more (r = 0.85, a strong positive correlation) – so part of the difference between neighbourhoods may simply be that their houses differ in size."*

The last sentence is an honest caveat: the neighbourhood comparison does not take house size into account. In Module 9 you will learn regression, which can.`,
          },
        },
        {
          kind: "callout",
          tone: "note",
          title: "Describing is not proving",
          md: "Descriptive statistics describe the data **you have**. If class C's mean is 3 points higher than class B's, that is a fact about these 60 students. Whether such a difference would also appear in other classes, or is just luck in who ended up where, is a question of **inferential statistics** – confidence intervals and hypothesis tests, the topic of Module 9.",
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Using prop.table() on raw data instead of on a table",
      wrong: `survey <- read.csv("data/survey.csv")
prop.table(survey$region)`,
      error: "invalid 'type' (character) of argument",
      why: "`prop.table()` divides numbers by their total, so it needs **counts**. `survey$region` is a column of text. Count first with `table()`, then convert the counts to proportions.",
      right: `survey <- read.csv("data/survey.csv")
prop.table(table(survey$region))`,
    },
    {
      title: "Correlating a text column",
      wrong: `students <- read.csv("data/students.csv")
cor(students$math, students$class)`,
      error: "'y' must be numeric",
      why: "Correlation measures how two **numeric** variables move together. `class` holds the labels A, B and C. To relate a number to a category, compare group statistics instead (`tapply()`, `aggregate()`).",
      right: `students <- read.csv("data/students.csv")
tapply(students$math, students$class, mean)`,
    },
    {
      title: "Using na.rm with cor()",
      wrong: `students <- read.csv("data/students.csv")
cor(students$math, students$science, na.rm = TRUE)`,
      error: "unused argument (na.rm = TRUE)",
      why: "`cor()` has no `na.rm` argument. It handles missing values with `use = \"complete.obs\"`.",
      right: `students <- read.csv("data/students.csv")
cor(students$math, students$science, use = "complete.obs")`,
    },
    {
      title: "Comparing raw counts of groups with different sizes",
      wrong: `survey <- read.csv("data/survey.csv")
table(survey$region, survey$recommend)`,
      why: "This code runs, but concluding \"the South has more unhappy users because 19 > 16\" ignores that regions have different numbers of respondents. Compare **proportions within each group** instead.",
      right: `survey <- read.csv("data/survey.csv")
round(prop.table(table(survey$region, survey$recommend), margin = 1), 2)`,
    },
  ],
  exerciseIds: ["m7-frequency-table", "m7-correlation", "m7-patient-report"],
  quiz: [
    {
      id: "m7-tables-q3",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- c("cat", "dog", "cat", "bird", "cat")
prop.table(table(x))`,
      options: [
        `x
bird  cat  dog
   1    3    1`,
        `x
bird  cat  dog
 0.2  0.6  0.2`,
        `x
 cat  dog bird
 0.6  0.2  0.2`,
        `[1] 0.6`,
      ],
      answer: 1,
      explanation: "`table(x)` counts bird 1, cat 3, dog 1 (in alphabetical order), and `prop.table()` divides by the total of 5: 0.2, 0.6, 0.2.",
      optionFeedback: [
        "These are the counts from `table(x)`. `prop.table()` then divides them by the total.",
        "Correct.",
        "`table()` sorts categories alphabetically, so bird comes first.",
        "`prop.table()` keeps one value per category.",
      ],
      concept: "frequency-tables",
    },
    {
      id: "m7-tables-q4",
      type: "multiple-choice",
      prompt: "The correlation between hours of TV watched per day and exam score is r = −0.45. What is the best description?",
      options: [
        "A moderate negative relationship: students who watch more TV tend to have lower scores",
        "A strong positive relationship",
        "Watching TV causes lower scores",
        "45% of students who watch TV fail the exam",
      ],
      answer: 0,
      explanation: "The negative sign means that high values of one variable go with low values of the other; a size of 0.45 is moderate. Correlation alone does not show cause and effect, and r is not a percentage of students.",
      optionFeedback: [
        "Correct.",
        "The minus sign makes it a **negative** relationship, and 0.45 is moderate rather than strong.",
        "Correlation is not causation – for example, students with less free time might both watch less TV and study more.",
        "r is not a percentage of anything; it describes how closely the points follow a straight line.",
      ],
      concept: "correlation",
    },
    {
      id: "m7-tables-q5",
      type: "fill-blank",
      prompt: "Complete the code to compute the median math score for each class.",
      code: `students <- read.csv("data/students.csv")
tapply(students$math, students$class, ___)`,
      accept: ["median"],
      hint: "The third argument of `tapply()` is the function to apply to each group.",
      explanation: "`tapply(values, groups, median)` splits the math scores by class and returns the median of each group.",
      concept: "summarizing-data",
    },
    {
      id: "m7-tables-q6",
      type: "find-error",
      prompt: "This code should compute the correlation between math and science scores (science has missing values). Click the line that fails.",
      code: `students <- read.csv("data/students.csv")
math <- students$math
science <- students$science
cor(math, science, na.rm = TRUE)`,
      errorLine: 4,
      errorKind: "error",
      fix: `students <- read.csv("data/students.csv")
math <- students$math
science <- students$science
cor(math, science, use = "complete.obs")`,
      explanation: "`cor()` has no `na.rm` argument, so R stops with \"unused argument\". Use `use = \"complete.obs\"` to drop observations with missing values.",
      concept: "correlation",
    },
    {
      id: "m7-tables-q7",
      type: "true-false",
      prompt: "A Spearman correlation of 1 means that y always increases when x increases, even if the points do not lie on a straight line.",
      answer: true,
      explanation: "True. Spearman correlates the **ranks**, so it equals 1 for any always-increasing (monotonic) relationship – such as y = x³ – even when Pearson is below 1.",
      concept: "correlation",
    },
  ],
  keyPoints: [
    "`table(x)` counts each category; `prop.table()` turns counts into proportions, and `round()` makes them readable.",
    "`table(x, y)` builds a two-way table; use `prop.table(tab, margin = 1)` to compare groups of different sizes fairly.",
    "The correlation coefficient r (from `cor()`) lies between −1 and +1: its sign gives the direction and its size the strength of a straight-line relationship.",
    "Pearson measures straight-line relationships; Spearman (`method = \"spearman\"`) uses ranks and copes better with curves and outliers.",
    "Correlation is not causation – a confounding variable can make two variables move together.",
    "`summary()` gives a quick overview; `tapply()`, `aggregate()` and `group_by()` + `summarise()` compute statistics for each group.",
    "A good interpretation names the variable, gives center and spread with units, compares groups fairly and mentions caveats.",
  ],
  concepts: ["frequency-tables", "correlation", "summarizing-data", "interpreting-results"],
  glossary: ["frequency-table", "categorical-variable", "correlation", "scatter-plot", "bar-chart", "outlier"],
  playground: `# Tables, correlation and summaries – experiment here!
survey <- read.csv("data/survey.csv")
students <- read.csv("data/students.csv")

table(survey$age_group)
round(prop.table(table(survey$gender, survey$recommend), margin = 1), 2)
cor(students$reading, students$math)
tapply(students$reading, students$class, mean)
`,
  prerequisites: ["measures-of-spread"],
  datasets: ["survey", "students", "housing", "mtcars"],
};
