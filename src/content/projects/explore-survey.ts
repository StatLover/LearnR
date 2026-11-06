import type { Project } from "../types";

export const exploreSurveyProject: Project = {
  id: "explore-survey",
  title: "Exploring Customer Survey Data",
  level: "beginner",
  summary:
    "Summarise 200 survey answers with frequency tables, percentages and group averages, handle missing answers, draw a bar chart and turn the numbers into clear findings.",
  intro: `You work in the product team of a (fictional) online shopping app. Last month the team asked 200 users to fill in a short survey: their age group, gender and region, how satisfied they are with the app (from 1 = very unhappy to 5 = very happy), whether they would recommend it to a friend, how many hours a day they spend online, and which feature they like best.

Your manager has a meeting with the whole company next week and asks you for a few solid facts:

- How satisfied are users, and how many would recommend the app?
- Which feature do people like most?
- Are some groups of users happier than others?
- Do satisfied users actually recommend the app?
- How much time do users spend online – and what do we do with the people who did not answer that question?

Survey data is mostly *categorical* (answers that fall into groups, like "Yes"/"No" or "North"/"South"), so the main tools are **frequency tables** (how many answers fall in each group), **percentages** and **group averages**. You will finish with a bar chart and a short list of findings written with R, ready to paste into a slide.`,
  datasets: ["survey"],
  skills: [
    "Importing and checking survey data",
    "Frequency tables with table() and sort()",
    "Percentages with prop.table()",
    "Group averages with tapply()",
    "Two-way tables and row percentages",
    "Handling missing answers with na.rm = TRUE",
    "Bar charts with barplot()",
    "Writing findings with paste0()",
  ],
  minutes: 50,
  steps: [
    {
      id: "import",
      title: "Import the survey and check it",
      instructions: `Start by loading the answers and checking that they look as expected.

1. Read \`data/survey.csv\` into a data frame called \`survey\`.
2. Look at its structure with \`str()\` and at the first rows with \`head()\`.
3. Store the number of respondents (people who answered – one per row) in \`n_respondents\`.
4. Count the missing values in every column with \`colSums(is.na(survey))\`. \`is.na()\` gives \`TRUE\` for each missing value and \`colSums()\` adds up the \`TRUE\`s column by column.`,
      starterCode: `# Step 1: import the survey and check it

# Read the CSV file into a data frame called survey
survey <- read.csv("data/survey.csv")

# Look at the structure and the first rows


# How many people answered? (one row per respondent)
n_respondents <- 0

# Missing values per column

`,
      hints: [
        "`str(survey)` shows the column types; `head(survey)` shows the first 6 rows.",
        "The number of respondents is the number of rows: `nrow(survey)`.",
        "`n_respondents <- nrow(survey)` and `colSums(is.na(survey))`.",
      ],
      solution: `survey <- read.csv("data/survey.csv")

str(survey)
head(survey)

n_respondents <- nrow(survey)
n_respondents

colSums(is.na(survey))
`,
      explanation: `- \`read.csv()\` loads the file into the data frame \`survey\`.
- \`str(survey)\` shows **200 obs. of 8 variables**. \`satisfaction\` is \`int\` (whole numbers 1–5), \`hours_online\` is \`num\` (numbers with decimals) and the other answers – \`age_group\`, \`gender\`, \`region\`, \`recommend\`, \`favorite_feature\` – are \`chr\` (text categories).
- \`head(survey)\` prints the first 6 respondents, for example respondent 1: age group 18-24, Female, South, satisfaction 3, would recommend, 3.6 hours online, favourite feature Recommendations.
- \`n_respondents\` is **200**.
- \`colSums(is.na(survey))\` returns one count per column. Every column is complete except **hours_online, with 8 missing answers**. You will deal with those in Step 6 – for now it is enough to know they exist.

Checking for missing values right at the start is a habit worth keeping: it tells you which calculations will need \`na.rm = TRUE\`.`,
      tests: [
        {
          name: "`survey` has 200 rows and 8 columns",
          check: `is.data.frame(survey) && nrow(survey) == 200 && ncol(survey) == 8`,
          failMessage: "Read the file with `survey <- read.csv(\"data/survey.csv\")`.",
        },
        {
          name: "`n_respondents` is 200",
          check: `isTRUE(n_respondents == 200)`,
          failMessage: "Each row is one respondent – use `nrow(survey)`.",
        },
      ],
    },
    {
      id: "frequency-tables",
      title: "Count the answers with frequency tables",
      instructions: `A *frequency table* counts how many times each answer appears. \`table()\` builds one from a column.

1. Store the frequency table of \`satisfaction\` in \`satisfaction_counts\` and print it.
2. Store the frequency table of \`favorite_feature\`, sorted from most to least popular, in \`feature_counts\`. \`sort(..., decreasing = TRUE)\` puts the biggest count first.
3. Store the name of the most popular feature in \`top_feature\`. \`names()\` returns the labels of a table, and \`[1]\` takes the first one.
4. Also print a table of \`age_group\`, to see who answered.`,
      starterCode: `# Step 2: frequency tables

# How many people gave each satisfaction score?
satisfaction_counts <- table(survey$satisfaction)
satisfaction_counts

# Favourite features, most popular first
# feature_counts <- sort(...)


# The name of the most popular feature
top_feature <- ""

# Who answered? Count the age groups

`,
      hints: [
        "Build the table first: `table(survey$favorite_feature)`. Then wrap it in `sort(..., decreasing = TRUE)`.",
        "After sorting, the most popular feature is the first label: `names(feature_counts)[1]`.",
        "`feature_counts <- sort(table(survey$favorite_feature), decreasing = TRUE)`, `top_feature <- names(feature_counts)[1]`, `table(survey$age_group)`.",
      ],
      solution: `satisfaction_counts <- table(survey$satisfaction)
satisfaction_counts

feature_counts <- sort(table(survey$favorite_feature), decreasing = TRUE)
feature_counts

top_feature <- names(feature_counts)[1]
top_feature

table(survey$age_group)
`,
      explanation: `- \`table(survey$satisfaction)\` counts each score: **1 → 11, 2 → 42, 3 → 69, 4 → 56, 5 → 22**. The top row of the printout holds the labels (the scores), the bottom row the counts. The most common answer is 3, a neutral "it's OK".
- \`table(survey$favorite_feature)\` counts the features alphabetically; \`sort(..., decreasing = TRUE)\` reorders them: **Price 60, Search 55, Recommendations 43, Support 42**.
- \`names(feature_counts)\` returns the labels in that order, so \`[1]\` picks \`"Price"\`. Storing it in \`top_feature\` (instead of typing "Price" by hand) means the code still gives the right answer if next month's survey changes.
- \`table(survey$age_group)\` shows the sample is spread over all ages: **18-24: 42, 25-34: 40, 35-44: 45, 45-54: 41, 55+: 32**. No group is tiny, so comparing age groups later is reasonable.

Frequency tables are the first thing to compute for any categorical variable: they show the most common answers and reveal typos (a stray "Pirce" label would show up immediately).`,
      tests: [
        {
          name: "`satisfaction_counts` counts the scores 1–5 (11, 42, 69, 56, 22)",
          check: `isTRUE(all(as.vector(satisfaction_counts) == c(11, 42, 69, 56, 22)))`,
          failMessage: "Use `satisfaction_counts <- table(survey$satisfaction)`.",
        },
        {
          name: "`feature_counts` is sorted from most to least popular",
          check: `length(feature_counts) == 4 && !is.unsorted(rev(as.vector(feature_counts))) && feature_counts[["Price"]] == 60`,
          failMessage: "Sort the table of `favorite_feature` with `sort(..., decreasing = TRUE)`.",
        },
        {
          name: "`top_feature` is \"Price\"",
          check: `identical(as.character(top_feature), "Price")`,
          failMessage: "Take the first label of the sorted table: `names(feature_counts)[1]`.",
        },
      ],
    },
    {
      id: "proportions",
      title: "Turn counts into percentages",
      instructions: `Counts depend on how many people answered; percentages are easier to compare and to communicate ("7 out of 10 users…"). \`prop.table()\` turns a table of counts into proportions (shares between 0 and 1) – multiply by 100 for percentages.

1. Store the percentage of each \`recommend\` answer, rounded to 1 decimal, in \`recommend_pct\`.
2. Store the percentage of each satisfaction score, rounded to 1 decimal, in \`satisfaction_pct\` (you can reuse \`satisfaction_counts\` from Step 2).
3. Store the percentage of respondents who are *satisfied* – a score of 4 or 5 – in \`pct_satisfied\`. Tip: \`survey$satisfaction >= 4\` gives \`TRUE\`/\`FALSE\` for each person, and the \`mean()\` of a logical vector is the proportion of \`TRUE\`s.`,
      starterCode: `# Step 3: percentages

# Percentage of "No" and "Yes" for recommend
recommend_pct <- round(prop.table(table(survey$recommend)) * 100, 1)
recommend_pct

# Percentage for each satisfaction score
# satisfaction_pct <- ...


# Percentage of satisfied users (score 4 or 5)
pct_satisfied <- 0

`,
      hints: [
        "`prop.table(satisfaction_counts)` divides every count by the total (200).",
        "`mean(survey$satisfaction >= 4)` is the proportion of people with a score of 4 or 5. Multiply it by 100.",
        "`satisfaction_pct <- round(prop.table(satisfaction_counts) * 100, 1)` and `pct_satisfied <- mean(survey$satisfaction >= 4) * 100`.",
      ],
      solution: `recommend_pct <- round(prop.table(table(survey$recommend)) * 100, 1)
recommend_pct

satisfaction_pct <- round(prop.table(satisfaction_counts) * 100, 1)
satisfaction_pct

pct_satisfied <- mean(survey$satisfaction >= 4) * 100
pct_satisfied
`,
      explanation: `- \`table(survey$recommend)\` counts 59 "No" and 141 "Yes". \`prop.table()\` divides each count by the total, giving 0.295 and 0.705. \`* 100\` makes percentages and \`round(..., 1)\` keeps one decimal: **No 29.5, Yes 70.5**. So about 7 in 10 users would recommend the app.
- \`satisfaction_pct\` shows **1: 5.5%, 2: 21.0%, 3: 34.5%, 4: 28.0%, 5: 11.0%**. The percentages add up to 100.
- \`survey$satisfaction >= 4\` is a logical vector with 200 values. R counts \`TRUE\` as 1 and \`FALSE\` as 0, so its \`mean()\` is the share of \`TRUE\`s: 78 of 200 = 0.39. Times 100: \`pct_satisfied\` is **39**. (Check: 28.0% + 11.0% = 39%.)

Notice the interesting contrast for the meeting: **70.5% would recommend the app, but only 39% call themselves satisfied** (4 or 5). Many people who would recommend it are only lukewarm about it – you will look at that relationship in Step 5.`,
      tests: [
        {
          name: "`recommend_pct` shows 70.5% Yes",
          check: `isTRUE(all.equal(as.numeric(recommend_pct[["Yes"]]), 70.5, tolerance = 1e-3))`,
          failMessage: "Use `round(prop.table(table(survey$recommend)) * 100, 1)` – don't forget `* 100`.",
        },
        {
          name: "`satisfaction_pct` has 5 percentages that add up to 100",
          check: `length(satisfaction_pct) == 5 && abs(sum(satisfaction_pct) - 100) < 0.5 && isTRUE(all.equal(as.numeric(satisfaction_pct[["3"]]), 34.5, tolerance = 1e-3))`,
          failMessage: "Use `round(prop.table(satisfaction_counts) * 100, 1)`.",
        },
        {
          name: "`pct_satisfied` is 39 (percent)",
          check: `isTRUE(all.equal(as.numeric(pct_satisfied), 39)) || isTRUE(all.equal(as.numeric(pct_satisfied), 0.39))`,
          failMessage: "Use `mean(survey$satisfaction >= 4) * 100` – `>= 4` includes both 4 and 5.",
        },
      ],
    },
    {
      id: "satisfaction-by-group",
      title: "Compare satisfaction between groups",
      instructions: `Is everyone equally happy? \`tapply(values, groups, FUN)\` splits the values into groups and applies a function to each group – here \`mean\`.

1. Store the mean satisfaction per \`region\` in \`sat_by_region\` and print it rounded to 2 decimals.
2. Store the mean satisfaction per \`age_group\` in \`sat_by_age\` and print it rounded.
3. Print the mean satisfaction per \`gender\`, together with \`table(survey$gender)\` – how many people are in each group?
4. Print the name of the region with the highest mean, using \`which.max()\` (it returns the position, and the name, of the largest value).`,
      starterCode: `# Step 4: satisfaction by group

# Mean satisfaction per region
sat_by_region <- tapply(survey$satisfaction, survey$region, mean)
round(sat_by_region, 2)

# Mean satisfaction per age group
# sat_by_age <- ...


# Mean satisfaction per gender, and the size of each gender group


# Which region is the happiest?

`,
      hints: [
        "Copy the region line and replace `survey$region` with `survey$age_group`.",
        "For gender: `round(tapply(survey$satisfaction, survey$gender, mean), 2)` and `table(survey$gender)`.",
        "`names(which.max(sat_by_region))` gives the name of the region with the highest mean.",
      ],
      solution: `sat_by_region <- tapply(survey$satisfaction, survey$region, mean)
round(sat_by_region, 2)

sat_by_age <- tapply(survey$satisfaction, survey$age_group, mean)
round(sat_by_age, 2)

round(tapply(survey$satisfaction, survey$gender, mean), 2)
table(survey$gender)

names(which.max(sat_by_region))
`,
      explanation: `- \`tapply(survey$satisfaction, survey$region, mean)\` splits the 200 scores into four groups by region and averages each: **East 3.32, North 3.00, South 2.94, West 3.45**.
- By age group: **18-24: 3.36, 25-34: 3.05, 35-44: 3.20, 45-54: 3.00, 55+: 3.31**. There is no clear pattern of "older = happier" or the reverse.
- By gender: **Female 3.29, Male 3.04, Non-binary 3.33** – but \`table()\` shows the groups are 104, 90 and only **6** people. An average of 6 answers can change a lot if just one person answers differently, so do not draw conclusions about that group from this survey.
- \`which.max(sat_by_region)\` returns the position of the largest mean, named \`West\`; \`names()\` extracts the name: **"West"**.

How big are these differences? On a 1–5 scale, the gap between the West (3.45) and the South (2.94) is about half a point – worth mentioning and investigating, but with about 50 people per region it could partly be chance. In Module 9 you learned tests (such as ANOVA) to check whether such differences are statistically significant.`,
      tests: [
        {
          name: "`sat_by_region` has the mean for each of the 4 regions (South ≈ 2.94)",
          check: `length(sat_by_region) == 4 && isTRUE(all.equal(as.numeric(sat_by_region[["South"]]), 2.943396, tolerance = 1e-4))`,
          failMessage: "Use `tapply(survey$satisfaction, survey$region, mean)` and store it in `sat_by_region` (unrounded is fine).",
        },
        {
          name: "`sat_by_age` has the mean for each of the 5 age groups (18-24 ≈ 3.36)",
          check: `length(sat_by_age) == 5 && isTRUE(all.equal(as.numeric(sat_by_age[["18-24"]]), 3.357143, tolerance = 1e-3))`,
          failMessage: "Use `tapply(survey$satisfaction, survey$age_group, mean)` and store it in `sat_by_age`.",
        },
        {
          name: "The happiest region is West",
          check: `names(which.max(sat_by_region)) == "West"`,
          failMessage: "`sat_by_region` should contain the mean satisfaction per region.",
        },
      ],
    },
    {
      id: "recommend-vs-satisfaction",
      title: "Do satisfied users recommend the app?",
      instructions: `To study the relationship between two categorical answers, build a *two-way table* (also called a cross table): one variable in the rows, the other in the columns, and the count of people for every combination in the cells.

1. Store \`table(survey$satisfaction, survey$recommend)\` in \`sat_recommend\` – satisfaction in the **rows**, recommend in the **columns** – and print it.
2. Store the *row percentages* in \`rec_by_sat\`: \`prop.table(sat_recommend, margin = 1)\` divides each row by its own total, so every row adds up to 100%. Multiply by 100 and round to 1 decimal.
3. Print the mean satisfaction of people who answered "No" and of people who answered "Yes" to recommending, with \`tapply()\`.`,
      starterCode: `# Step 5: recommend vs satisfaction

# Two-way table: satisfaction in the rows, recommend in the columns
sat_recommend <- table(survey$satisfaction, survey$recommend)
sat_recommend

# Row percentages: within each satisfaction score, what % say No / Yes?
# rec_by_sat <- ...


# Mean satisfaction of people who would / would not recommend

`,
      hints: [
        "`prop.table(sat_recommend, margin = 1)` gives proportions *within each row*. `margin = 2` would use columns instead.",
        "Multiply by 100 and round: `round(prop.table(sat_recommend, margin = 1) * 100, 1)`.",
        "For the averages: `round(tapply(survey$satisfaction, survey$recommend, mean), 2)`.",
      ],
      solution: `sat_recommend <- table(survey$satisfaction, survey$recommend)
sat_recommend

rec_by_sat <- round(prop.table(sat_recommend, margin = 1) * 100, 1)
rec_by_sat

round(tapply(survey$satisfaction, survey$recommend, mean), 2)
`,
      explanation: `- \`sat_recommend\` has 5 rows (scores 1–5) and 2 columns (No, Yes). For example, of the 22 people who gave a 5, **0 said No and 22 said Yes**; of the 11 who gave a 1, 8 said No and 3 said Yes.
- Counts are hard to compare because the rows have different sizes (11 people gave a 1, 69 gave a 3). \`prop.table(..., margin = 1)\` fixes that by turning each row into percentages. The "Yes" column of \`rec_by_sat\` climbs steadily: **27.3% → 45.2% → 71.0% → 85.7% → 100%** for scores 1 to 5.
- \`tapply()\` gives the same message from the other direction: people who would recommend the app rate it **3.48** on average, people who would not rate it **2.47**.

So yes – satisfaction and recommending go together very strongly. It also explains the puzzle from Step 3: many people with a neutral score of 3 (71.0% of them) would still recommend the app. Real survey data is never perfectly logical: 3 people gave the lowest score but would recommend the app anyway.`,
      tests: [
        {
          name: "`sat_recommend` has 5 rows (scores) and 2 columns (No, Yes)",
          check: `identical(dim(sat_recommend), c(5L, 2L)) && sat_recommend["5", "Yes"] == 22 && sat_recommend["1", "No"] == 8`,
          failMessage: "Put satisfaction first and recommend second: `table(survey$satisfaction, survey$recommend)`.",
        },
        {
          name: "`rec_by_sat` contains row percentages (score 1: 27.3% Yes, score 5: 100% Yes)",
          check: `isTRUE(all.equal(as.numeric(rec_by_sat["1", "Yes"]), 27.3, tolerance = 0.01)) && isTRUE(all.equal(as.numeric(rec_by_sat["5", "Yes"]), 100))`,
          failMessage: "Use `round(prop.table(sat_recommend, margin = 1) * 100, 1)` – `margin = 1` means each row adds up to 100.",
        },
      ],
    },
    {
      id: "missing-hours",
      title: "Handle the missing hours_online answers",
      instructions: `Eight people skipped the question about hours online. Missing answers must be handled on purpose, not by accident.

1. Store the number of missing \`hours_online\` values in \`n_missing_hours\`.
2. Try \`mean(survey$hours_online)\` and look at the result.
3. Store the mean of the answers that *are* available in \`avg_hours\`, using \`na.rm = TRUE\` (*NA remove*: skip missing values).
4. Store the mean hours online per age group in \`hours_by_age\` – \`tapply()\` passes extra arguments such as \`na.rm = TRUE\` on to \`mean()\`.
5. Print the rows of the people who did not answer (only the columns \`respondent_id\`, \`age_group\` and \`satisfaction\`).`,
      starterCode: `# Step 6: missing values in hours_online

# How many answers are missing?
n_missing_hours <- 0

# What happens if you just take the mean?
mean(survey$hours_online)

# Mean of the available answers
# avg_hours <- ...


# Mean hours online per age group (ignoring missing answers)
# hours_by_age <- tapply(...)


# Who did not answer?

`,
      hints: [
        "`is.na(survey$hours_online)` is TRUE for each missing answer; `sum()` counts them.",
        "`mean(survey$hours_online, na.rm = TRUE)` and `tapply(survey$hours_online, survey$age_group, mean, na.rm = TRUE)`.",
        "To print the non-answers: `survey[is.na(survey$hours_online), c(\"respondent_id\", \"age_group\", \"satisfaction\")]`.",
      ],
      solution: `n_missing_hours <- sum(is.na(survey$hours_online))
n_missing_hours

mean(survey$hours_online)

avg_hours <- mean(survey$hours_online, na.rm = TRUE)
round(avg_hours, 2)

hours_by_age <- tapply(survey$hours_online, survey$age_group, mean, na.rm = TRUE)
round(hours_by_age, 2)

survey[is.na(survey$hours_online), c("respondent_id", "age_group", "satisfaction")]
`,
      explanation: `- \`sum(is.na(survey$hours_online))\` counts **8** missing answers – 4% of the 200 respondents.
- \`mean(survey$hours_online)\` returns \`NA\`. That is R being honest: if some values are unknown, the true mean is unknown too.
- With \`na.rm = TRUE\`, \`mean()\` averages the 192 available answers: **3.41 hours** per day.
- \`hours_by_age\` shows a clear pattern: **18-24: 4.42, 25-34: 3.94, 35-44: 3.13, 45-54: 2.64, 55+: 2.79** hours. Younger users spend much more time online.
- The last line uses \`is.na()\` as a row condition and a vector of column names to show the 8 people who skipped the question: respondents 23, 46, 69, 92, 115, 138, 161 and 184 – four aged 25-34, three aged 45-54 and one aged 18-24.

What *not* to do: replacing the missing answers with 0 would claim that these people are never online and pull every average down. Deleting the 8 people from the whole dataset would throw away their perfectly good satisfaction answers. Skipping them only in calculations that need \`hours_online\` (with \`na.rm = TRUE\`) is the honest choice here – and with only 4% missing, the results are unlikely to change much.`,
      tests: [
        {
          name: "`n_missing_hours` is 8",
          check: `isTRUE(n_missing_hours == 8)`,
          failMessage: "Count the missing values with `sum(is.na(survey$hours_online))`.",
        },
        {
          name: "`avg_hours` is about 3.41",
          check: `isTRUE(all.equal(as.numeric(avg_hours), 3.405729, tolerance = 1e-4))`,
          failMessage: "Use `mean(survey$hours_online, na.rm = TRUE)` – without `na.rm = TRUE` you get NA.",
        },
        {
          name: "`hours_by_age` has a mean for each age group without NA (18-24 ≈ 4.42)",
          check: `length(hours_by_age) == 5 && !anyNA(hours_by_age) && isTRUE(all.equal(as.numeric(hours_by_age[["18-24"]]), 4.42, tolerance = 1e-2))`,
          failMessage: "Add `na.rm = TRUE` at the end: `tapply(survey$hours_online, survey$age_group, mean, na.rm = TRUE)`.",
        },
      ],
    },
    {
      id: "bar-chart",
      title: "Draw a bar chart of satisfaction",
      instructions: `A chart communicates a frequency table at a glance. A *bar chart* draws one bar per category, with the bar height showing the count. Base R's \`barplot()\` takes a table directly.

1. Draw a bar chart of \`satisfaction_counts\` (from Step 2).
2. Give it a title with \`main\`, axis labels with \`xlab\` and \`ylab\`, and a colour with \`col\` (for example \`"steelblue"\`).
3. *Optional:* draw a second bar chart showing the percentage of people who would recommend the app for each satisfaction score – the "Yes" column of \`rec_by_sat\` from Step 5 (\`rec_by_sat[, "Yes"]\`).`,
      starterCode: `# Step 7: bar chart

# Draw a bar chart of satisfaction_counts with barplot().
# Inside the brackets, after satisfaction_counts, add (separated by commas):
#   main = "a title", xlab = "x-axis label", ylab = "y-axis label",
#   col = "steelblue"


# Optional: a second bar chart of rec_by_sat[, "Yes"]

`,
      hints: [
        "Arguments are separated by commas inside the brackets: `barplot(satisfaction_counts, main = \"...\")`.",
        "A good title says what the chart shows, e.g. `main = \"How satisfied are our users?\"`. Axis labels: `xlab = \"Satisfaction score\"`, `ylab = \"Number of respondents\"`.",
        "For the optional chart: `barplot(rec_by_sat[, \"Yes\"], main = \"% who would recommend, by satisfaction\", xlab = \"Satisfaction score\", ylab = \"% Yes\")`.",
      ],
      solution: `barplot(satisfaction_counts,
        main = "How satisfied are our users?",
        xlab = "Satisfaction (1 = very unhappy, 5 = very happy)",
        ylab = "Number of respondents",
        col = "steelblue")

# Optional: share of each score that would recommend the app
barplot(rec_by_sat[, "Yes"],
        main = "Would recommend the app, by satisfaction score",
        xlab = "Satisfaction score",
        ylab = "% who would recommend",
        col = "darkorange")
`,
      explanation: `- \`barplot(satisfaction_counts, ...)\` draws one bar per score. Because \`satisfaction_counts\` is a table, the score labels 1–5 appear under the bars automatically and the heights are the counts 11, 42, 69, 56 and 22.
- \`main\` sets the title, \`xlab\` and \`ylab\` label the axes, and \`col\` colours the bars. A long call can be split over several lines – R keeps reading until the closing bracket.
- The chart shows a hump in the middle: most people chose 3 or 4, few chose the extremes. That is typical for rating questions.
- The optional chart uses \`rec_by_sat[, "Yes"]\`: the "Yes" column of the row-percentage table (27.3, 45.2, 71.0, 85.7, 100). Its steadily rising bars show the satisfaction–recommendation link from Step 5 far more convincingly than the table of numbers.

Why a bar chart and not a histogram? Satisfaction has only five possible values, each a separate category, so separate bars are the clearest choice. Histograms are for continuous numbers such as \`hours_online\` – try \`hist(survey$hours_online)\` to compare.`,
      tests: [
        {
          name: "A chart is drawn",
          check: `.plots >= 1`,
          failMessage: "Call `barplot(satisfaction_counts, ...)` to draw the chart.",
        },
      ],
    },
    {
      id: "findings",
      title: "Write the key findings",
      instructions: `Numbers only help if people understand them. Turn your results into short sentences, built with R so they always match the data.

\`paste0()\` glues text and values together without spaces, e.g. \`paste0(70.5, "% would recommend")\` gives \`"70.5% would recommend"\`.

1. Store the mean satisfaction of the people who would recommend the app in \`mean_yes\`, and of those who would not in \`mean_no\`.
2. Create a character vector \`findings\` with **at least three** sentences, built with \`paste0()\` from the variables you created (\`recommend_pct\`, \`n_respondents\`, \`pct_satisfied\`, \`sat_by_region\`, \`mean_yes\`, \`mean_no\`, …). One sentence must report the percentage who would recommend the app.
3. Print them with \`writeLines(findings)\`, which prints each sentence on its own line without quotes.`,
      starterCode: `# Step 8: key findings

# Mean satisfaction of people who would / would not recommend
mean_yes <- mean(survey$satisfaction[survey$recommend == "Yes"])
# mean_no <- ...

# One sentence per finding, built from your results
findings <- c(
  paste0(recommend_pct[["Yes"]], "% of the ", n_respondents, " respondents would recommend the app.")
  # add more sentences here, separated by commas
)

writeLines(findings)
`,
      hints: [
        "`mean_no` works like `mean_yes`, with `== \"No\"`.",
        "`names(which.max(sat_by_region))` and `names(which.min(sat_by_region))` give the happiest and least happy regions for a sentence.",
        "Example: `paste0(pct_satisfied, \"% rated their satisfaction 4 or 5 out of 5.\")`. Separate the sentences inside `c()` with commas.",
      ],
      solution: `mean_yes <- mean(survey$satisfaction[survey$recommend == "Yes"])
mean_no <- mean(survey$satisfaction[survey$recommend == "No"])

findings <- c(
  paste0(recommend_pct[["Yes"]], "% of the ", n_respondents, " respondents would recommend the app."),
  paste0("Only ", pct_satisfied, "% rated their satisfaction 4 or 5 out of 5; the most common score was 3."),
  paste0("Satisfaction is highest in the ", names(which.max(sat_by_region)),
         " region and lowest in the ", names(which.min(sat_by_region)), "."),
  paste0("People who would recommend the app rate it ", round(mean_yes, 2),
         " on average, versus ", round(mean_no, 2), " for the others."),
  paste0("Price is the favourite feature; younger users spend the most time online (",
         round(hours_by_age[["18-24"]], 1), " hours a day for 18-24).")
)

writeLines(findings)
`,
      explanation: `- \`survey$satisfaction[survey$recommend == "Yes"]\` keeps only the scores of people who answered "Yes"; \`mean()\` gives about **3.48** (\`mean_no\` is about **2.47**).
- Each \`paste0()\` call produces one sentence. Values such as \`recommend_pct[["Yes"]]\` (70.5) or \`names(which.max(sat_by_region))\` ("West") are inserted where they appear. \`round(mean_yes, 2)\` keeps the numbers readable.
- \`c(...)\` collects the sentences into one character vector, \`findings\`. A long \`paste0()\` call may continue on the next line after a comma.
- \`writeLines(findings)\` prints:

  - 70.5% of the 200 respondents would recommend the app.
  - Only 39% rated their satisfaction 4 or 5 out of 5; the most common score was 3.
  - Satisfaction is highest in the West region and lowest in the South.
  - People who would recommend the app rate it 3.48 on average, versus 2.47 for the others.
  - Price is the favourite feature; younger users spend the most time online (4.4 hours a day for 18-24).

Building sentences from variables instead of typing the numbers means there are no copy-paste mistakes, and when next month's survey arrives you just rerun the code to get updated findings.`,
      tests: [
        {
          name: "`findings` is a character vector with at least 3 sentences",
          check: `is.character(findings) && length(findings) >= 3`,
          failMessage: "Create `findings <- c(paste0(...), paste0(...), paste0(...))` – three or more sentences separated by commas.",
        },
        {
          name: "One finding reports that 70.5% would recommend the app",
          check: `any(grepl("70.5", findings, fixed = TRUE))`,
          failMessage: "Include `recommend_pct[[\"Yes\"]]` (70.5) in one of the sentences.",
        },
        {
          name: "`mean_no` is about 2.47",
          check: `isTRUE(all.equal(as.numeric(mean_no), 2.474576, tolerance = 1e-4))`,
          failMessage: "`mean_no <- mean(survey$satisfaction[survey$recommend == \"No\"])`.",
        },
      ],
    },
  ],
  wrapUp: `You turned 200 raw survey answers into facts your manager can use:

- **70.5%** would recommend the app, but only **39%** are clearly satisfied (4 or 5) – the most common score is a neutral 3.
- **Price** is the favourite feature (60 people), ahead of Search (55).
- Satisfaction differs by about half a point between regions (West 3.45, South 2.94); the Non-binary group (6 people) is too small to compare.
- Satisfaction and recommending go hand in hand: from 27.3% "Yes" at score 1 up to 100% at score 5.
- Younger users spend far more time online (4.4 hours a day for 18-24 vs 2.6 for 45-54); 8 missing answers were skipped with \`na.rm = TRUE\` rather than replaced or deleted.

The toolkit you used – \`table()\`, \`prop.table()\`, \`tapply()\`, two-way tables, \`barplot()\` and \`paste0()\` – covers most everyday survey questions.

**Ideas to go further**

- Test whether the regional differences could be chance with an ANOVA: \`summary(aov(satisfaction ~ region, data = survey))\`.
- Test the satisfaction–recommend link with \`chisq.test(sat_recommend)\` (look at the warning about small expected counts and think about why it appears).
- Which feature do the *happiest* users prefer? Try \`table(survey$favorite_feature[survey$satisfaction >= 4])\`.
- Redraw the charts with ggplot2 (\`geom_bar()\`) and compare the code with \`barplot()\`.`,
};
