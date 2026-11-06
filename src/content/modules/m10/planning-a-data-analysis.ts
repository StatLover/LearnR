import type { Lesson } from "../../types";

export const planningAnalysisLesson: Lesson = {
  id: "planning-a-data-analysis",
  module: 10,
  title: "Planning a Data Analysis",
  summary:
    "Turn a vague idea into a clear question, follow the data pipeline from import to communication, check data quality and write a reproducible, well-documented script.",
  minutes: 40,
  objectives: [
    "Turn a vague topic into a clear question that your data can answer.",
    "Describe the five stages of the data pipeline: import, clean, explore, model and communicate.",
    "Run a systematic data-quality check: size, types, missing values, duplicates, impossible values and inconsistent categories.",
    "Organise an analysis as a reproducible script that runs from top to bottom on the raw data.",
    "Document cleaning decisions with clear comments and simple checks.",
    "Carry out a small end-to-end analysis of a real dataset.",
  ],
  intro: `You now know a lot of separate skills: importing data, cleaning it with dplyr, drawing charts with ggplot2, calculating statistics and writing functions. A real data project combines all of them – and the hard part is usually not the code. Analyses go wrong because **the question was vague**, because **nobody checked the data** before trusting it, or because **nobody can repeat** what was done.

This lesson gives you a simple plan that professional analysts use for every project. You will learn to ask a precise question, to move through the stages of the *data pipeline*, to check data quality systematically, and to write a script that anyone can run again and understand.

At the end you will do a complete mini analysis of \`students.csv\` – and you will be ready for the guided projects of this module.`,
  sections: [
    {
      id: "clear-question",
      title: "Start with a clear question",
      blocks: [
        {
          kind: "text",
          md: `"Analyse this data" is not a question – it gives you no way to decide what to calculate or when you are finished. A **good analysis question** is:

* **specific** – it names the variables and the groups to compare,
* **answerable with the data you have** – the needed columns exist,
* **focused on one main result** – something you could state in one or two sentences at the end.`,
        },
        {
          kind: "table",
          caption: "From vague to clear questions (with R Academy datasets)",
          headers: ["Vague", "Clear", "Data"],
          rows: [
            ["\"Look at the students data.\"", "Do students who study more hours per week score higher in math?", "`students.csv`: `study_hours`, `math`"],
            ["\"How are sales doing?\"", "Did total revenue grow from 2022 to 2024, and which region earned the most?", "`sales.csv`: `month`, `region`, `revenue`"],
            ["\"Are the patients healthy?\"", "Is the average systolic blood pressure higher for smokers than for non-smokers?", "`patients.csv`: `systolic_bp`, `smoker`"],
            ["\"What do users think of the app?\"", "What share of respondents would recommend the app, and does it differ by age group?", "`survey.csv`: `recommend`, `age_group`"],
          ],
        },
        {
          kind: "steps",
          title: "Four questions to ask before writing any code",
          items: [
            "**What is one row?** One student, one month of one region, one patient… This is the *unit of observation*.",
            "**Which columns answer the question?** Write them down. If a needed column does not exist, change the question.",
            "**What will you compute or compare?** A mean per group, a correlation, a trend over time, a share in percent.",
            "**What would the answer look like?** E.g. \"Students who study 11+ hours average X points more in math than students who study 0–5 hours.\"",
          ],
        },
        {
          kind: "question",
          question: {
            id: "m10-plan-q1",
            type: "multiple-choice",
            prompt: "Which of these is the clearest analysis question for `housing.csv` (house sales with neighborhood, size, rooms, age and price)?",
            options: [
              "How much higher is the median sale price of houses with a garage than without one?",
              "What can the housing data tell us?",
              "Are houses good?",
              "Analyse all variables in the housing data.",
            ],
            answer: 0,
            optionFeedback: [
              "Correct – it names the variables (price, garage), the summary (median) and the comparison.",
              "Too open: there is no way to know what to calculate or when you are done.",
              "\"Good\" is not measured by any column in the data.",
              "This is a task list, not a question – it has no single result to report.",
            ],
            explanation: "A clear question names the variables (`price`, `garage`), the summary (median) and the comparison (with vs. without a garage). You can answer it with one grouped summary and a box plot.",
            concept: "analysis-question",
          },
        },
      ],
    },
    {
      id: "pipeline",
      title: "The data pipeline",
      blocks: [
        {
          kind: "text",
          md: "Almost every analysis passes through the same five stages. Thinking in stages keeps your work organised and tells you what to do next.",
        },
        { kind: "diagram", name: "data-pipeline", caption: "Import → clean → explore → model → communicate." },
        {
          kind: "table",
          caption: "The five stages and the R tools you already know",
          headers: ["Stage", "Goal", "Typical R tools"],
          rows: [
            ["**Import**", "Get the raw data into R and see its structure", "`read.csv()`, `dim()`, `str()`, `head()`"],
            ["**Clean**", "Fix types, missing values, duplicates and inconsistent text", "`as.numeric()`, `as.Date()`, `is.na()`, `duplicated()`, `trimws()`, `tolower()`, `ifelse()`, `mutate()`"],
            ["**Explore**", "Summarise and visualise to understand patterns", "`summary()`, `table()`, `aggregate()`, `group_by()` + `summarise()`, ggplot2"],
            ["**Model**", "Measure relationships and test ideas", "`cor()`, `t.test()`, `chisq.test()`, `lm()`"],
            ["**Communicate**", "Tell others what you found, honestly", "Summary tables, clear charts, sentences built with `sprintf()`, a written report"],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "The pipeline is a loop",
          md: "In practice you go back and forth. A chart in the *explore* stage may reveal an impossible value, which sends you back to *clean*. That is normal – just make sure every change ends up in your script.",
        },
      ],
    },
    {
      id: "first-look",
      title: "Import and take a first look",
      blocks: [
        {
          kind: "text",
          md: "Before any analysis, find out what you actually have: how many rows and columns, what the columns are called, and what type R gave each column.",
        },
        {
          kind: "code",
          example: {
            id: "first-look",
            title: "Size, names and first rows",
            code: `students <- read.csv("data/students.csv")

dim(students)
names(students)
head(students, 3)`,
            explanation: [
              { code: `dim(students)`, text: "Number of rows and columns: 60 students, 10 variables." },
              { code: `names(students)`, text: "The exact column names – copy them from here to avoid typos later." },
              { code: `head(students, 3)`, text: "The first three rows show what one row (one student) looks like." },
            ],
            output: String.raw`[1] 60 10
 [1] "student_id"  "name"        "gender"      "age"         "class"
 [6] "study_hours" "attendance"  "math"        "reading"     "science"
  student_id  name gender age class study_hours attendance math reading science
1       S001 Amara Female  16     C           6         82   86      82      83
2       S002   Ben   Male  17     A           1         93   54      53      46
3       S003 Chloe Female  19     B          12         93   99      99     100`,
          },
        },
        {
          kind: "code",
          example: {
            id: "str-summary",
            title: "Types and a quick numeric summary",
            code: `students <- read.csv("data/students.csv")

str(students)
summary(students[, c("study_hours", "math", "science")])`,
            explanation: [
              { code: `str(students)`, text: "Shows every column's type: `chr` (text), `int` (whole numbers) or `num` (decimals). Numbers stored as `chr` are a warning sign." },
              { code: `summary(students[, c("study_hours", "math", "science")])`, text: "Minimum, quartiles, mean and maximum of three numeric columns, plus the number of `NA`s." },
            ],
            output: String.raw`'data.frame':	60 obs. of  10 variables:
 $ student_id : chr  "S001" "S002" "S003" "S004" ...
 $ name       : chr  "Amara" "Ben" "Chloe" "Daniel" ...
 $ gender     : chr  "Female" "Male" "Female" "Male" ...
 $ age        : int  16 17 19 19 17 16 19 18 18 16 ...
 $ class      : chr  "C" "A" "B" "B" ...
 $ study_hours: int  6 1 12 10 13 11 5 2 13 10 ...
 $ attendance : int  82 93 93 86 79 83 78 78 84 86 ...
 $ math       : int  86 54 99 68 90 78 77 81 70 74 ...
 $ reading    : int  82 53 99 62 86 85 70 76 78 90 ...
 $ science    : int  83 46 100 63 84 88 NA 63 84 77 ...
  study_hours         math          science
 Min.   : 1.00   Min.   :53.00   Min.   : 46.0
 1st Qu.: 6.00   1st Qu.:67.00   1st Qu.: 66.0
 Median :10.00   Median :74.00   Median : 74.0
 Mean   : 8.95   Mean   :74.65   Mean   : 74.3
 3rd Qu.:11.25   3rd Qu.:82.25   3rd Qu.: 83.0
 Max.   :20.00   Max.   :99.00   Max.   :100.0
                                 NAs    :3`,
            outputNote: "Everything looks plausible: scores lie between 0 and 100, study hours between 1 and 20. The summary also reveals that `science` has 3 missing values – something to plan for.",
          },
        },
      ],
    },
    {
      id: "data-quality",
      title: "Checking data quality",
      blocks: [
        {
          kind: "text",
          md: "Never trust a dataset you have not checked. Work through the same checklist every time – it takes two minutes and saves hours of wrong conclusions.",
        },
        {
          kind: "table",
          caption: "A data-quality checklist",
          headers: ["Check", "Question", "R code"],
          rows: [
            ["Size", "Do I have the number of rows and columns I expect?", "`dim(df)`"],
            ["Types", "Are numbers numeric and dates dates?", "`str(df)`"],
            ["Missing values", "How many `NA`s per column? Are there hidden ones such as `\"\"` or `\"N/A\"`?", "`colSums(is.na(df))`, `table(df$col)`"],
            ["Duplicates", "Is any row in the data twice?", "`sum(duplicated(df))`"],
            ["Impossible values", "Ages below 0, percentages above 100?", "`range()`, `summary()`"],
            ["Inconsistent categories", "Is `\"Male\"` also written `\"male\"` or `\"M\"`?", "`table(df$col)`, `unique(df$col)`"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "quality-students",
            title: "Quality check of the students data",
            code: `students <- read.csv("data/students.csv")

colSums(is.na(students))
sum(duplicated(students))
range(students$attendance)
table(students$class)`,
            explanation: [
              { code: `colSums(is.na(students))`, text: "`is.na()` marks every missing cell with `TRUE`; `colSums()` counts them per column." },
              { code: `sum(duplicated(students))`, text: "`duplicated()` is `TRUE` for each row that repeats an earlier row; the sum counts them." },
              { code: `range(students$attendance)`, text: "Attendance is a percentage, so it must be between 0 and 100." },
              { code: `table(students$class)`, text: "Counting a category column shows every spelling that occurs." },
            ],
            output: String.raw` student_id        name      gender         age       class study_hours
          0           0           0           0           0           0
 attendance        math     reading     science
          0           0           0           3
[1] 0
[1]  63 100

 A  B  C
18 22 20`,
            outputNote: "A clean dataset: only the 3 missing science scores, no duplicates, sensible attendance values and exactly three classes.",
          },
        },
        {
          kind: "text",
          md: "Real exports are rarely that tidy. The same checks on the deliberately messy `customers_messy.csv` reveal several problems at once:",
        },
        {
          kind: "code",
          example: {
            id: "quality-messy",
            title: "Quality check of a messy dataset",
            code: `customers <- read.csv("data/customers_messy.csv")

str(customers)
sum(duplicated(customers))
table(customers$gender)`,
            explanation: [
              { code: `str(customers)`, text: "`age` and `total_spent` are stored as text (`chr`), and the dates come in two layouts." },
              { code: `sum(duplicated(customers))`, text: "Some customers appear twice." },
              { code: `table(customers$gender)`, text: "Eight different spellings for what should be two categories." },
            ],
            output: String.raw`'data.frame':	60 obs. of  7 variables:
 $ customer_id: chr  "C001" "C002" "C003" "C004" ...
 $ name       : chr  "Hugo Smith" "Olivia Garcia" "Vera Garcia" "Carlos Smith" ...
 $ age        : chr  "67" "47" "60" "61" ...
 $ gender     : chr  "M" "Female" "female" "male" ...
 $ city       : chr  " New York " "Boston" "chicago" " Boston " ...
 $ signup_date: chr  "2023-05-15" "2022-03-18" "2023-07-09" "01/16/2023" ...
 $ total_spent: chr  "339.39" "463.51" "368.13" "539.64" ...
[1] 4

     f      F Female      M  MALE    Male female   male
     5      8     11      6      4     13      6      7`,
            outputNote: "Four duplicated rows and eight spellings of gender – every count or average based on the raw data would be wrong. Cleaning this file step by step is the goal of the [Cleaning messy customer data project](/projects/clean-messy-customers).",
          },
        },
        {
          kind: "code",
          example: {
            id: "hidden-missing",
            title: "Finding hidden missing values",
            code: `customers <- read.csv("data/customers_messy.csv")
sum(is.na(customers$age))

customers <- read.csv(
  "data/customers_messy.csv",
  na.strings = c("", "NA", "N/A", "unknown")
)
colSums(is.na(customers))`,
            explanation: [
              { code: `sum(is.na(customers$age))`, text: "R reports no missing ages – because the gaps are written as `\"\"`, `\"N/A\"` or `\"unknown\"`, which are just text to R." },
              { code: `  na.strings = c("", "NA", "N/A", "unknown")`, text: "`na.strings` tells `read.csv()` which texts mean \"missing\". They are turned into real `NA`s while reading." },
              { code: `colSums(is.na(customers))`, text: "Now the true number of missing values per column is visible." },
            ],
            output: String.raw`[1] 0
customer_id        name         age      gender        city signup_date
          0           0           3           0           0           0
total_spent
          3`,
          },
        },
        {
          kind: "text",
          md: "Because you run these checks in every project, they are worth turning into a **function** (Module 8). This one returns a small data frame describing every column:",
        },
        {
          kind: "code",
          example: {
            id: "quality-function",
            title: "A reusable quality report",
            code: `check_quality <- function(df) {
  data.frame(
    column = names(df),
    type = sapply(df, class),
    missing = colSums(is.na(df)),
    unique_values = sapply(df, function(x) length(unique(x))),
    row.names = NULL
  )
}

patients <- read.csv("data/patients.csv")
check_quality(patients)`,
            explanation: [
              { code: `    type = sapply(df, class),`, text: "`sapply()` visits every column and records its class." },
              { code: `    missing = colSums(is.na(df)),`, text: "The number of missing values per column." },
              { code: `    unique_values = sapply(df, function(x) length(unique(x))),`, text: "How many different values each column has. A category column such as `sex` should have very few; an ID column should have one per row." },
              { code: `    row.names = NULL`, text: "Uses plain row numbers instead of repeating the column names as row names." },
            ],
            output: String.raw`         column      type missing unique_values
1    patient_id character       0           150
2           age   integer       0            53
3           sex character       0             2
4           bmi   numeric       5            95
5   systolic_bp   integer       0            57
6   cholesterol   integer       6            86
7        smoker character       0             2
8 exercise_days   integer       0             8
9      diabetes character       0             2`,
            outputNote: "One line per column. The patients data has missing values in `bmi` (5) and `cholesterol` (6), and `patient_id` has 150 unique values for 150 rows, so there are no repeated IDs.",
            tryIt: "Run `check_quality()` on `read.csv(\"data/survey.csv\")` or on the messy customer data.",
          },
        },
      ],
    },
    {
      id: "reproducible-scripts",
      title: "Writing a reproducible script",
      blocks: [
        {
          kind: "definition",
          term: "Reproducible analysis",
          md: "An analysis that anyone – including you in six months – can run again from the raw data, from top to bottom, and get exactly the same results.",
        },
        {
          kind: "steps",
          title: "Habits that make a script reproducible",
          items: [
            "Start with a **header comment**: the question, the data source and what one row means.",
            "Load all **packages at the top** with `library()`.",
            "Read the **raw data** with a relative path such as `\"data/students.csv\"`, never a personal path like `C:/Users/anna/...`.",
            "**Never edit the raw file by hand** (for example in a spreadsheet). Every fix happens in code, so it is visible and repeatable.",
            "Keep the raw data in its own object (`students_raw`) and **create new objects** for cleaned data.",
            "Use `set.seed()` before anything random.",
            "Organise the script in **sections** that follow the pipeline, and check that it runs from a clean start, top to bottom.",
          ],
        },
        {
          kind: "code",
          example: {
            id: "script-template",
            title: "A script organised by pipeline stage",
            code: String.raw`# ------------------------------------------------------------
# Question: Do students who study more score higher in math?
# Data:     data/students.csv – one row per student (60 rows)
# ------------------------------------------------------------

# 1. Import ---------------------------------------------------
students_raw <- read.csv("data/students.csv")

# 2. Clean ----------------------------------------------------
students <- students_raw
students$class <- factor(students$class)

# 3. Explore --------------------------------------------------
summary(students$study_hours)
round(tapply(students$math, students$class, mean), 1)

# 4. Model ----------------------------------------------------
r <- cor(students$study_hours, students$math)

# 5. Communicate ----------------------------------------------
cat("Correlation between study hours and math:", round(r, 2), "\n")`,
            explanation: [
              { code: `# Question: Do students who study more score higher in math?`, text: "The header states the question and the data, so a reader knows immediately what the script is for." },
              { code: `students_raw <- read.csv("data/students.csv")`, text: "The raw data is read with a relative path and kept unchanged." },
              { code: `students <- students_raw`, text: "Cleaning works on a copy, so you can always compare with the original." },
              { code: `# 3. Explore --------------------------------------------------`, text: "Section comments mirror the pipeline. In RStudio, comments ending in dashes even appear as an outline you can jump through." },
              { code: String.raw`cat("Correlation between study hours and math:", round(r, 2), "\n")`, text: "The result is printed as a sentence – the start of communicating it." },
            ],
            output: String.raw`   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
   1.00    6.00   10.00    8.95   11.25   20.00
   A    B    C
74.9 73.0 76.2
Correlation between study hours and math: 0.59`,
          },
        },
        {
          kind: "code",
          example: {
            id: "set-seed",
            title: "Random, but repeatable",
            code: `set.seed(42)
sample(1:60, 5)

set.seed(42)
sample(1:60, 5)`,
            explanation: [
              { code: `set.seed(42)`, text: "Fixes the starting point of R's random number generator. Any number works; what matters is that it is written in the script." },
              { code: `sample(1:60, 5)`, text: "Picks 5 random student numbers, e.g. to check those rows by hand." },
            ],
            output: String.raw`[1] 49 37  1 25 10
[1] 49 37  1 25 10`,
            outputNote: "Both draws are identical because the seed was reset to 42. Without `set.seed()`, every run would pick different students and your results could not be reproduced.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Things that break reproducibility",
          md: "Personal file paths and `setwd()` to your own folders, fixing values by hand in the CSV file, running lines out of order, relying on variables that are still in your workspace from earlier experiments, and random numbers without `set.seed()`. Test your script by clearing the workspace and running it from the first line to the last.",
        },
      ],
    },
    {
      id: "documenting-decisions",
      title: "Documenting your decisions",
      blocks: [
        {
          kind: "text",
          md: `Cleaning is full of **decisions**: Do you delete rows with missing values or keep them? What counts as an impossible age? Which spelling of a category is the "right" one? Different decisions can change your results, so a reader must be able to see them.

Write a comment that explains **why**, not just *what*, and check how many rows each decision affects.`,
        },
        {
          kind: "code",
          example: {
            id: "documented-cleaning",
            title: "Comments that explain decisions",
            code: `students_raw <- read.csv("data/students.csv")
students <- students_raw

# Decision: keep all 60 students. Only science has missing values (3),
# so NAs are removed only when science itself is analysed.
colSums(is.na(students))[c("math", "reading", "science")]

# Decision: attendance below 75% counts as "low attendance",
# following the school's warning threshold.
students$low_attendance <- students$attendance < 75
sum(students$low_attendance)

# Check: cleaning must not drop any rows.
stopifnot(nrow(students) == nrow(students_raw))`,
            explanation: [
              { code: `# Decision: keep all 60 students. Only science has missing values (3),`, text: "States the decision *and the reason* in plain words." },
              { code: `colSums(is.na(students))[c("math", "reading", "science")]`, text: "Shows the evidence behind the decision right next to it." },
              { code: `students$low_attendance <- students$attendance < 75`, text: "Creates a `TRUE`/`FALSE` column. The threshold 75 is a choice, so the comment says where it comes from." },
              { code: `sum(students$low_attendance)`, text: "Reports how many students the decision affects." },
              { code: `stopifnot(nrow(students) == nrow(students_raw))`, text: "A check that turns an assumption into code: if a later edit accidentally drops rows, the script stops here." },
            ],
            output: String.raw`   math reading science
      0       0       3
[1] 6`,
          },
        },
        {
          kind: "table",
          caption: "Weak and helpful comments",
          headers: ["Weak comment", "Helpful comment"],
          rows: [
            ["`# remove NAs`", "`# Remove 3 students without a science score: science is the outcome of this analysis`"],
            ["`# fix gender`", "`# Merge \"F\", \"f\", \"female\" into \"Female\" (and the same for Male); 8 spellings -> 2 categories`"],
            ["`# filter`", "`# Exclude ages outside 18-100: the shop only serves adults, so these are typing errors`"],
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Keep a short decision log",
          md: "Besides comments, many analysts add a bullet list of decisions at the top of the script or in the report (\"Removed 4 duplicated customers\", \"Converted MM/DD/YYYY dates\"). It makes your work easy to review and to explain.",
        },
      ],
    },
    {
      id: "mini-analysis",
      title: "A mini end-to-end analysis",
      blocks: [
        {
          kind: "text",
          md: "Let's run the whole pipeline on one question: **Do students who study more hours per week score higher in math?** Each step is short because you know the tools already.",
        },
        {
          kind: "code",
          example: {
            id: "mini-explore",
            title: "Import, check and explore",
            code: `students <- read.csv("data/students.csv")

# Check: the two columns we need are complete
stopifnot(!anyNA(students$study_hours), !anyNA(students$math))

# Explore: mean math score for three study-time groups
students$study_group <- cut(
  students$study_hours,
  breaks = c(0, 5, 10, 20),
  labels = c("0-5 h", "6-10 h", "11-20 h")
)
table(students$study_group)
aggregate(math ~ study_group, data = students, FUN = mean)`,
            explanation: [
              { code: `stopifnot(!anyNA(students$study_hours), !anyNA(students$math))`, text: "Quality check for exactly the columns this question needs." },
              { code: `students$study_group <- cut(`, text: "Groups the students by study time so that groups can be compared." },
              { code: `table(students$study_group)`, text: "Always report group sizes – a mean of 3 students is much less reliable than a mean of 30." },
              { code: `aggregate(math ~ study_group, data = students, FUN = mean)`, text: "The average math score per group." },
            ],
            output: String.raw`  0-5 h  6-10 h 11-20 h
     13      22      25
  study_group     math
1       0-5 h 64.92308
2      6-10 h 72.04545
3     11-20 h 82.00000`,
            outputNote: "The mean math score rises from group to group – a first sign of a positive relationship. All three groups have a reasonable number of students.",
          },
        },
        {
          kind: "code",
          example: {
            id: "mini-plot",
            title: "Visualise the relationship",
            code: `students <- read.csv("data/students.csv")

plot(students$study_hours, students$math,
     pch = 19, col = "steelblue",
     xlab = "Study hours per week", ylab = "Math score",
     main = "Study time and math scores (60 students)")
abline(lm(math ~ study_hours, data = students), col = "firebrick", lwd = 2)`,
            explanation: [
              { code: `plot(students$study_hours, students$math,`, text: "A scatter plot: one point per student." },
              { code: `abline(lm(math ~ study_hours, data = students), col = "firebrick", lwd = 2)`, text: "Adds the fitted regression line (Module 9) to show the overall trend." },
            ],
            plot: true,
          },
        },
        {
          kind: "code",
          example: {
            id: "mini-communicate",
            title: "Model and communicate",
            code: String.raw`students <- read.csv("data/students.csv")

r <- cor(students$study_hours, students$math)
model <- lm(math ~ study_hours, data = students)
slope <- coef(model)[["study_hours"]]

cat(sprintf("Correlation between study hours and math: r = %.2f\n", r))
cat(sprintf("Each extra hour of study goes with %.1f more math points on average.\n", slope))
cat(sprintf("Based on %d students; this shows an association, not proof of cause.\n", nrow(students)))`,
            explanation: [
              { code: `r <- cor(students$study_hours, students$math)`, text: "The correlation measures how strongly the two variables move together (from −1 to 1)." },
              { code: `slope <- coef(model)[["study_hours"]]`, text: "The slope of the regression line: the average change in math score per extra study hour." },
              { code: String.raw`cat(sprintf("Correlation between study hours and math: r = %.2f\n", r))`, text: "Building sentences from the computed values means the text can never disagree with the numbers." },
              { code: String.raw`cat(sprintf("Based on %d students; this shows an association, not proof of cause.\n", nrow(students)))`, text: "Honest communication includes the sample size and what the result does *not* show." },
            ],
            output: String.raw`Correlation between study hours and math: r = 0.59
Each extra hour of study goes with 1.6 more math points on average.
Based on 60 students; this shows an association, not proof of cause.`,
            outputNote: "A moderate positive correlation of about 0.6. In the next lesson you will learn how to turn results like these into a short, honest report.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Your turn: the guided projects",
          md: `Each project walks you through the whole pipeline with checkpoints that test your code:

* [Cleaning messy customer data](/projects/clean-messy-customers) – fix types, spellings, dates and duplicates in \`customers_messy.csv\`.
* [Exploring survey data](/projects/explore-survey) – satisfaction and recommendations in \`survey.csv\`.
* [Analyzing student performance](/projects/student-performance) – what goes with high scores in \`students.csv\`.
* [Visualizing sales trends](/projects/sales-trends) – revenue over time and by region in \`sales.csv\`.
* [Analyzing patient health data](/projects/patient-health) – blood pressure, smoking and exercise in \`patients.csv\`.
* [Capstone: a complete EDA report](/projects/housing-eda-capstone) – a full exploratory report on \`housing.csv\` (best after the next lesson).`,
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Reading data from a personal file path",
      wrong: `students <- read.csv("C:/Users/anna/Downloads/students.csv")`,
      error: "cannot open",
      why: "That folder exists only on Anna's computer. Anyone else – and this website – gets an error. Use a path relative to the project, such as `\"data/students.csv\"`.",
      right: `students <- read.csv("data/students.csv")
nrow(students)`,
    },
    {
      title: "Trusting is.na() when missing values are written as text",
      wrong: `customers <- read.csv("data/customers_messy.csv")
sum(is.na(customers$age))`,
      why: "The result is 0, but the column contains `\"\"`, `\"N/A\"` and `\"unknown\"`. They are text, so `is.na()` does not see them. Look at `table()` or `unique()` of the column and use `na.strings` when reading.",
      right: `customers <- read.csv("data/customers_messy.csv", na.strings = c("", "NA", "N/A", "unknown"))
sum(is.na(customers$age))`,
    },
    {
      title: "Overwriting the raw data while cleaning",
      wrong: `students <- read.csv("data/students.csv")
students <- students[!is.na(students$science), ]
mean(students$math)`,
      why: "Removing the rows without a science score also removes those students' math scores. The math average is now based on 57 instead of 60 students, and the original data is gone from your workspace. Keep the raw data and create a separate object for each purpose.",
      right: `students_raw <- read.csv("data/students.csv")
science_data <- students_raw[!is.na(students_raw$science), ]
mean(students_raw$math)
nrow(science_data)`,
    },
    {
      title: "Counting rows without checking for duplicates",
      wrong: `customers <- read.csv("data/customers_messy.csv")
nrow(customers)`,
      why: "The file has 60 rows, but 4 of them are exact copies of earlier rows. Reporting \"60 customers\" would be wrong. Check `sum(duplicated(customers))` and remove copies with `unique()` (and document it).",
      right: `customers <- read.csv("data/customers_messy.csv")
sum(duplicated(customers))
nrow(unique(customers))`,
    },
  ],
  exerciseIds: ["m10-quality-check", "m10-sales-pipeline"],
  quiz: [
    {
      id: "m10-plan-q2",
      type: "multiple-choice",
      prompt: "In which order do the stages of the data pipeline usually happen?",
      options: [
        "Import → clean → explore → model → communicate",
        "Explore → import → model → clean → communicate",
        "Model → clean → import → communicate → explore",
        "Communicate → import → clean → explore → model",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – and remember you may loop back, e.g. from explore to clean.",
        "You cannot explore data that has not been imported yet.",
        "A model built on uncleaned data can be badly wrong.",
        "You can only communicate results once you have them.",
      ],
      explanation: "You import the raw data, clean it, explore it with summaries and charts, model relationships, and finally communicate the results. Exploring often reveals more cleaning to do, so the pipeline is a loop rather than a straight line.",
      concept: "data-pipeline",
    },
    {
      id: "m10-plan-q3",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `ids <- c("a", "b", "a", "c", "b")
sum(duplicated(ids))`,
      options: ["[1] 2", "[1] 4", "[1] 3", "[1] 5"],
      answer: 0,
      optionFeedback: [
        "Correct – the second `\"a\"` and the second `\"b\"` are repeats.",
        "`duplicated()` marks only the *repeats*, not the first occurrence of each value.",
        "There are 3 different values, but the question counts duplicated entries.",
        "That is the total number of entries.",
      ],
      explanation: "`duplicated(ids)` is `FALSE FALSE TRUE FALSE TRUE`: only the repeated entries are `TRUE`. Their sum is 2.",
      concept: "data-quality",
    },
    {
      id: "m10-plan-q4",
      type: "fill-blank",
      prompt: "Complete the code so that it counts the missing values in every column of `students`.",
      code: `students <- read.csv("data/students.csv")
colSums(___(students))`,
      accept: ["is.na"],
      hint: "Which function returns `TRUE` for a missing value?",
      explanation: "`is.na(students)` returns a table of `TRUE`/`FALSE` values with `TRUE` for every missing cell; `colSums()` adds up the `TRUE`s column by column.",
      concept: "data-quality",
    },
    {
      id: "m10-plan-q5",
      type: "true-false",
      prompt: "In a reproducible analysis it is fine to correct a few typos directly in the CSV file with a spreadsheet program, as long as you remember what you changed.",
      answer: false,
      explanation: "Manual edits are invisible to anyone who runs your script – and easy to forget. Keep the raw file untouched and make every correction in code, with a comment explaining why.",
      concept: "reproducible-script",
    },
    {
      id: "m10-plan-q6",
      type: "find-error",
      prompt: "This script was written in a hurry and the lines are out of order. Click the line where R stops.",
      code: `students <- read.csv("data/students.csv")
mean_math <- mean(complete$math)
complete <- students[!is.na(students$science), ]
mean_math`,
      errorLine: 2,
      errorKind: "error",
      fix: `students <- read.csv("data/students.csv")
complete <- students[!is.na(students$science), ]
mean_math <- mean(complete$math)
mean_math`,
      explanation: "Line 2 uses `complete` before line 3 creates it, so R stops with \"object 'complete' not found\". It may have worked in your session because you ran line 3 earlier – which is exactly why a script must run from top to bottom in a fresh session.",
      concept: "reproducible-script",
    },
    {
      id: "m10-plan-q7",
      type: "multiple-choice",
      prompt: "Which comment best documents a cleaning decision?",
      options: [
        "`# Remove ages above 100 (2 rows): the shop's customers are adults, so these are typing errors`",
        "`# remove rows`",
        "`# filter`",
        "`# this line is important`",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – it says what, how many and why.",
        "Which rows, how many and why? A reader cannot tell.",
        "Says only what the code already shows.",
        "Does not explain anything about the decision.",
      ],
      explanation: "A helpful comment states the decision, how many rows it affects and the reason, so a reader can judge whether it was sensible.",
      concept: "documenting-decisions",
    },
  ],
  keyPoints: [
    "Start every analysis with a specific question that names the variables and the comparison, and that your data can answer.",
    "Work through the data pipeline: import, clean, explore, model, communicate – and loop back when you find problems.",
    "Check data quality before trusting results: size, types, missing values (including hidden ones), duplicates, impossible values and inconsistent categories.",
    "A reproducible script runs from top to bottom on the raw data, uses relative paths, never relies on manual edits and uses `set.seed()` for randomness.",
    "Keep the raw data unchanged and create new objects for cleaned versions.",
    "Comment the *why* of every decision, report how many rows it affects and use `stopifnot()` to guard your assumptions.",
  ],
  concepts: ["analysis-question", "data-pipeline", "data-quality", "reproducible-script", "documenting-decisions"],
  glossary: ["dataset", "observation", "script", "comment", "data-cleaning", "missing-data", "na", "eda", "file-path", "outlier"],
  playground: `# Quality check of any dataset – try survey, patients or customers_messy
df <- read.csv("data/survey.csv")

dim(df)
str(df)
colSums(is.na(df))
sum(duplicated(df))
table(df$region)
`,
  datasets: ["students", "customers_messy", "patients"],
};
