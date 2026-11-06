import type { Lesson } from "../../types";

export const edaReportLesson: Lesson = {
  id: "writing-an-eda-report",
  module: 10,
  title: "Writing an EDA Report",
  summary:
    "Structure an exploratory data analysis report: describe the data, build summary tables, choose fitting charts, describe findings honestly, separate correlation from causation and state limitations.",
  minutes: 45,
  objectives: [
    "Describe the typical structure of an exploratory data analysis (EDA) report.",
    "Build clear summary tables for numeric and categorical variables, overall and by group.",
    "Choose a chart that fits the question and the types of the variables.",
    "Describe findings honestly, with numbers, group sizes and careful wording.",
    "Explain why correlation does not prove causation and recognise possible confounders.",
    "Write a short limitations section based on evidence from the data.",
  ],
  intro: `An **exploratory data analysis** (EDA) is how you get to know a dataset: you look at each variable, compare groups and search for relationships, mostly with summary tables and charts. The analysis is only half of the job, though. The other half is **explaining what you found** to someone who has not seen your code – a teacher, a manager, a client.

An EDA report does exactly that. It answers a question, shows the evidence in a few well-chosen tables and charts, and is honest about what the data can and cannot tell you.

In this lesson you will learn a simple report structure, how to build tables and choose charts that make results easy to read, and how to word findings so that they are accurate – in particular, why a correlation is not proof that one thing causes another.`,
  sections: [
    {
      id: "report-structure",
      title: "The structure of an EDA report",
      blocks: [
        {
          kind: "definition",
          term: "Exploratory data analysis (EDA)",
          md: "Investigating a dataset with summaries and charts to understand its variables, spot problems and discover patterns – before (or instead of) formal statistical testing.",
        },
        {
          kind: "table",
          caption: "A simple structure that works for most EDA reports",
          headers: ["Section", "What it contains", "Example for sales.csv"],
          rows: [
            ["1. Question and key findings", "The question and the answer in 2–3 sentences", "\"Revenue grew by about 25 % from 2022 to 2024; North earned the most.\""],
            ["2. The data", "Source, number of rows and columns, what one row is, time period", "144 rows: one per region and month, Jan 2022 – Dec 2024"],
            ["3. Data quality and cleaning", "Missing values, duplicates, odd values and what you did about them", "No missing values; `month` converted to a date"],
            ["4. Single variables", "Distribution of the important variables", "Histogram of monthly revenue"],
            ["5. Relationships and groups", "Comparisons between groups, trends, correlations", "Revenue per region; revenue over time"],
            ["6. Findings", "What the tables and charts show, with numbers", "\"East had the lowest total revenue, about $342k.\""],
            ["7. Limitations and next steps", "What the data cannot show; ideas for further work", "Only 3 years and 4 regions; no price data"],
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Put the answer first",
          md: "Many readers only read the first paragraph. State your key findings at the top and use the rest of the report as the evidence. Each table or chart should support one sentence of your findings – if it does not, leave it out.",
        },
      ],
    },
    {
      id: "summary-tables",
      title: "Summary tables",
      blocks: [
        {
          kind: "text",
          md: "A good summary table answers a question at a glance: it shows the right statistics, the number of observations, sensible rounding and clear names. Start with an **overview of the numeric variables**:",
        },
        {
          kind: "code",
          example: {
            id: "overview-table",
            title: "An overview table of numeric variables",
            code: `students <- read.csv("data/students.csv")
scores <- students[, c("math", "reading", "science")]

overview <- data.frame(
  n = colSums(!is.na(scores)),
  mean = sapply(scores, mean, na.rm = TRUE),
  sd = sapply(scores, sd, na.rm = TRUE),
  min = sapply(scores, min, na.rm = TRUE),
  max = sapply(scores, max, na.rm = TRUE)
)
round(overview, 1)`,
            explanation: [
              { code: `  n = colSums(!is.na(scores)),`, text: "The number of *non-missing* values per column. `!` flips `is.na()`, so `TRUE` means \"present\"." },
              { code: `  mean = sapply(scores, mean, na.rm = TRUE),`, text: "Each statistic is one column of the table, computed for every variable with `sapply()`." },
              { code: `  sd = sapply(scores, sd, na.rm = TRUE),`, text: "The standard deviation shows how spread out each score is." },
              { code: `round(overview, 1)`, text: "One decimal place is plenty for test scores – more digits only make the table harder to read." },
            ],
            output: String.raw`         n mean   sd min max
math    60 74.7 11.5  53  99
reading 60 78.0 12.3  51 100
science 57 74.3 12.9  46 100`,
            outputNote: "One row per variable, one column per statistic. Showing `n` makes it obvious that science has only 57 values.",
          },
        },
        {
          kind: "text",
          md: "For a **categorical variable**, show counts and percentages. Percentages make groups of different sizes comparable.",
        },
        {
          kind: "code",
          example: {
            id: "categorical-table",
            title: "Counts and percentages",
            code: `survey <- read.csv("data/survey.csv")

counts <- table(survey$favorite_feature)
counts
round(100 * prop.table(counts), 1)
round(100 * prop.table(table(survey$age_group, survey$recommend), margin = 1), 1)`,
            explanation: [
              { code: `counts <- table(survey$favorite_feature)`, text: "How many respondents chose each favourite feature." },
              { code: `round(100 * prop.table(counts), 1)`, text: "`prop.table()` turns counts into proportions (they add up to 1); × 100 gives percentages." },
              { code: `round(100 * prop.table(table(survey$age_group, survey$recommend), margin = 1), 1)`, text: "A two-way table with `margin = 1` gives percentages **within each row**: of each age group, what share would recommend the app?" },
            ],
            output: String.raw`          Price Recommendations          Search         Support
             60              43              55              42

          Price Recommendations          Search         Support
           30.0            21.5            27.5            21.0

          No  Yes
  18-24 16.7 83.3
  25-34 30.0 70.0
  35-44 35.6 64.4
  45-54 34.1 65.9
  55+   31.2 68.8`,
            outputNote: "Each row of the last table adds up to 100 %. The youngest group (18–24) is the most likely to recommend the app (83.3 %). This is the kind of analysis you will do in the [Exploring survey data project](/projects/explore-survey).",
          },
        },
        {
          kind: "code",
          example: {
            id: "grouped-table",
            title: "A grouped summary with dplyr",
            code: `library(dplyr)

sales <- read.csv("data/sales.csv")

sales |>
  group_by(region) |>
  summarise(
    months = n(),
    total_revenue = round(sum(revenue)),
    avg_units = round(mean(units), 1)
  ) |>
  arrange(desc(total_revenue)) |>
  as.data.frame()`,
            packages: ["dplyr"],
            explanation: [
              { code: `  group_by(region) |>`, text: "One group per region." },
              { code: `    months = n(),`, text: "`n()` counts the rows in each group – always include the group size." },
              { code: `    total_revenue = round(sum(revenue)),`, text: "Clear column names with units in mind: this is total revenue in dollars, rounded to whole dollars." },
              { code: `  arrange(desc(total_revenue)) |>`, text: "Sorting by the main statistic lets the reader see the ranking immediately." },
              { code: `  as.data.frame()`, text: "Converts the tibble to a data frame so it prints as a plain table." },
            ],
            output: String.raw`  region months total_revenue avg_units
1  North     36        473709     536.4
2  South     36        445650     536.6
3   West     36        361711     457.8
4   East     36        342038     364.3`,
          },
        },
        {
          kind: "steps",
          title: "Checklist for a readable table",
          items: [
            "Include the number of observations (`n`) for every row or group.",
            "Round to a sensible number of digits (usually 0–2).",
            "Use clear column names, ideally with units (`revenue_usd`, `hours_per_week`).",
            "Sort rows in a meaningful order (largest first, or natural order such as months).",
            "Keep it small: a table with 5 rows and 4 columns is read; one with 50 rows is skipped.",
          ],
        },
      ],
    },
    {
      id: "choosing-charts",
      title: "Choosing the right chart",
      blocks: [
        {
          kind: "text",
          md: "The right chart depends on **what you want to show** and on the **types of the variables** involved. This table covers most situations in an EDA report:",
        },
        {
          kind: "table",
          caption: "Which chart for which question?",
          headers: ["You want to show…", "Variables", "Chart", "ggplot2"],
          rows: [
            ["the distribution of one number", "1 numeric", "histogram (or box plot)", "`geom_histogram()`"],
            ["how often each category occurs", "1 categorical", "bar chart", "`geom_bar()` / `geom_col()`"],
            ["the relationship between two numbers", "2 numeric", "scatter plot", "`geom_point()`"],
            ["a number compared across groups", "numeric + categorical", "box plot (or bar chart of means)", "`geom_boxplot()`"],
            ["change over time", "date + numeric", "line chart", "`geom_line()`"],
          ],
        },
        { kind: "diagram", name: "histogram-vs-bar", caption: "Histograms show the distribution of a numeric variable (touching bars); bar charts count categories (separate bars)." },
        {
          kind: "code",
          example: {
            id: "chart-distribution",
            title: "One numeric variable: a histogram",
            code: `library(ggplot2)

housing <- read.csv("data/housing.csv")

ggplot(housing, aes(x = price / 1000)) +
  geom_histogram(binwidth = 25, fill = "steelblue", colour = "white") +
  labs(
    title = "About three in four houses sold for $250k-$450k",
    x = "Sale price (thousand dollars)",
    y = "Number of houses"
  )`,
            packages: ["ggplot2"],
            explanation: [
              { code: `ggplot(housing, aes(x = price / 1000)) +`, text: "Prices in thousands make the axis labels shorter and easier to read." },
              { code: `  geom_histogram(binwidth = 25, fill = "steelblue", colour = "white") +`, text: "Each bar covers $25k. White outlines separate the bars." },
              { code: `    title = "About three in four houses sold for $250k-$450k",`, text: "A good report title states the *finding*, not just the variable name." },
            ],
            plot: true,
            tryIt: "Change `binwidth` to 10 and to 100. Which value shows the shape of the distribution best?",
          },
        },
        {
          kind: "code",
          example: {
            id: "chart-relationship",
            title: "Two numeric variables: a scatter plot",
            code: `library(ggplot2)

housing <- read.csv("data/housing.csv")

ggplot(housing, aes(x = size_sqft, y = price / 1000)) +
  geom_point(alpha = 0.6) +
  geom_smooth(method = "lm", formula = y ~ x, se = FALSE, colour = "firebrick") +
  labs(
    title = "Larger houses sell for more",
    x = "Living area (square feet)",
    y = "Sale price (thousand dollars)"
  )`,
            packages: ["ggplot2"],
            explanation: [
              { code: `  geom_point(alpha = 0.6) +`, text: "One point per house; `alpha` makes overlapping points visible." },
              { code: `  geom_smooth(method = "lm", formula = y ~ x, se = FALSE, colour = "firebrick") +`, text: "Adds a straight trend line. Writing `formula = y ~ x` avoids an extra console message." },
            ],
            plot: true,
          },
        },
        {
          kind: "code",
          example: {
            id: "chart-groups",
            title: "A number across groups: box plots",
            code: `library(ggplot2)

housing <- read.csv("data/housing.csv")

ggplot(housing, aes(x = neighborhood, y = price / 1000)) +
  geom_boxplot(fill = "lightblue") +
  labs(
    title = "Sale prices by neighborhood",
    x = NULL,
    y = "Sale price (thousand dollars)"
  )`,
            packages: ["ggplot2"],
            explanation: [
              { code: `  geom_boxplot(fill = "lightblue") +`, text: "Each box shows the median, the middle 50 % and possible outliers of one neighborhood – a fair comparison even if group sizes differ." },
              { code: `    x = NULL,`, text: "The neighborhood names explain themselves, so the x-axis title is removed." },
            ],
            plot: true,
          },
        },
        {
          kind: "code",
          example: {
            id: "chart-time",
            title: "Change over time: a line chart",
            code: `library(ggplot2)

sales <- read.csv("data/sales.csv")
sales$month <- as.Date(sales$month)

ggplot(sales, aes(x = month, y = revenue / 1000, colour = region)) +
  geom_line(linewidth = 0.8) +
  labs(
    title = "Monthly revenue by region, 2022-2024",
    x = NULL,
    y = "Revenue (thousand dollars)",
    colour = "Region"
  )`,
            packages: ["ggplot2"],
            explanation: [
              { code: `sales$month <- as.Date(sales$month)`, text: "Converting to a real date makes ggplot2 space and label the x-axis by time." },
              { code: `ggplot(sales, aes(x = month, y = revenue / 1000, colour = region)) +`, text: "One coloured line per region." },
            ],
            plot: true,
            tryIt: "Add `facet_wrap(~ region)` to give each region its own small panel. More charts like this await you in the [Visualizing sales trends project](/projects/sales-trends).",
          },
        },
        {
          kind: "callout",
          tone: "note",
          title: "Make every chart readable on its own",
          md: "A reader should understand a chart without reading your code: a title that states the message, axis labels with units, readable category names, and no 3-D effects or unnecessary colours.",
        },
      ],
    },
    {
      id: "describing-findings",
      title: "Describing findings honestly",
      blocks: [
        {
          kind: "text",
          md: `Your findings are sentences that someone may act on, so they must be **accurate**. Good findings:

* give **numbers** (and the size of differences, not just "higher"),
* mention **how many** observations they are based on,
* compare like with like,
* use careful words such as *in this sample*, *on average*, *is associated with*,
* include results that **do not** support what you expected.`,
        },
        {
          kind: "table",
          caption: "Overclaiming versus honest wording",
          headers: ["Overclaiming", "Honest"],
          rows: [
            ["\"Girls are better at math.\"", "\"In this sample of 60 students, female students averaged 76.6 points in math and male students 72.6.\""],
            ["\"Studying causes higher grades.\"", "\"Students who study more tend to score higher (r = 0.59); this does not show that studying is the cause.\""],
            ["\"Customers love the app.\"", "\"70.5 % of the 200 respondents would recommend the app.\""],
            ["\"A garage makes a house much more valuable.\"", "\"Houses with a garage sold for a median of $347,750, those without for $331,500 (130 and 70 houses).\""],
          ],
        },
        {
          kind: "code",
          example: {
            id: "findings-from-numbers",
            title: "Let R write the numbers into your sentences",
            code: String.raw`students <- read.csv("data/students.csv")

means <- round(tapply(students$math, students$gender, mean), 1)
sizes <- table(students$gender)
means
sizes

cat(sprintf(
  "In this sample, female students averaged %.1f points in math (n = %d) and male students %.1f (n = %d).\n",
  means[["Female"]], sizes[["Female"]], means[["Male"]], sizes[["Male"]]
))`,
            explanation: [
              { code: `means <- round(tapply(students$math, students$gender, mean), 1)`, text: "Group means, rounded as they will appear in the text." },
              { code: `sizes <- table(students$gender)`, text: "Group sizes, so the reader knows how much data each mean is based on." },
              { code: `  means[["Female"]], sizes[["Female"]], means[["Male"]], sizes[["Male"]]`, text: "`[[\"name\"]]` picks one value by name. The sentence is filled from the computed values, so if the data changes, the text updates too." },
            ],
            output: String.raw`Female   Male
  76.6   72.6

Female   Male
    31     29
In this sample, female students averaged 76.6 points in math (n = 31) and male students 72.6 (n = 29).`,
            outputNote: "A 4-point difference between two groups of about 30 students may well be due to chance – a t-test (Module 9) would tell you more. An honest report says so instead of declaring a winner.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Do not cherry-pick",
          md: "If you look at twenty comparisons, a few will look impressive just by chance. Report what you looked at, not only the comparisons that support your story.",
        },
      ],
    },
    {
      id: "correlation-causation",
      title: "Correlation is not causation",
      blocks: [
        {
          kind: "text",
          md: "A *correlation* (Module 7) measures how strongly two numeric variables move together, from −1 (perfectly opposite) through 0 (no straight-line relationship) to +1 (perfectly together).",
        },
        {
          kind: "code",
          example: {
            id: "students-correlation",
            title: "Two correlations in the students data",
            code: `students <- read.csv("data/students.csv")

round(cor(students$study_hours, students$math), 2)
round(cor(students$attendance, students$math), 2)`,
            explanation: [
              { code: `round(cor(students$study_hours, students$math), 2)`, text: "A moderate positive correlation: more study hours go together with higher math scores." },
              { code: `round(cor(students$attendance, students$math), 2)`, text: "A weak positive correlation between attendance and math." },
            ],
            output: String.raw`[1] 0.59
[1] 0.26`,
          },
        },
        {
          kind: "text",
          md: `It is tempting to conclude "studying more *causes* higher scores". Maybe it does – but a correlation alone cannot show that. There are always several possible explanations:

1. **Causation** – studying improves scores.
2. **Reverse causation** – students who are already good at math enjoy it and therefore study more.
3. **A confounder** – a third variable, such as motivation or support at home, increases both study time and scores.
4. **Chance** – with small samples, patterns can appear by luck.`,
        },
        {
          kind: "definition",
          term: "Confounder",
          md: "A third variable that influences both variables you are comparing, creating a correlation between them even if neither affects the other.",
        },
        {
          kind: "code",
          example: {
            id: "confounder-simulation",
            title: "A confounder in action (simulated data)",
            code: `set.seed(1)
temperature <- runif(200, min = 10, max = 35)
ice_cream <- 20 + 3 * temperature + rnorm(200, sd = 8)
sunburn <- 2 + 0.5 * temperature + rnorm(200, sd = 2)

round(cor(ice_cream, sunburn), 2)

similar_days <- temperature >= 25 & temperature <= 27
round(cor(ice_cream[similar_days], sunburn[similar_days]), 2)`,
            explanation: [
              { code: `temperature <- runif(200, min = 10, max = 35)`, text: "200 simulated days with temperatures between 10 and 35 °C." },
              { code: `ice_cream <- 20 + 3 * temperature + rnorm(200, sd = 8)`, text: "Ice-cream sales rise with temperature (plus random noise)." },
              { code: `sunburn <- 2 + 0.5 * temperature + rnorm(200, sd = 2)`, text: "Sunburn cases also rise with temperature. Note: ice cream does not appear in this formula at all." },
              { code: `round(cor(ice_cream, sunburn), 2)`, text: "Still, ice cream and sunburn are strongly correlated – because temperature drives both." },
              { code: `similar_days <- temperature >= 25 & temperature <= 27`, text: "Now keep only days with almost the same temperature, i.e. hold the confounder (nearly) constant." },
              { code: `round(cor(ice_cream[similar_days], sunburn[similar_days]), 2)`, text: "Among days with similar temperatures, the correlation almost disappears." },
            ],
            output: String.raw`[1] 0.78
[1] 0.07`,
            outputNote: "We built this data so that ice cream has **no** effect on sunburn – yet the overall correlation is strong. Once the confounder is held nearly constant, the relationship vanishes. With real data you rarely know all confounders, which is why careful reports say \"is associated with\" rather than \"causes\".",
          },
        },
        {
          kind: "callout",
          tone: "info",
          title: "When can you talk about causes?",
          md: "Mainly in a **randomised experiment**, where chance decides who gets a treatment, so groups differ only in the treatment. Datasets like those in this course are *observational* – the values were recorded, not assigned – so describe associations, and name possible confounders as a limitation.",
        },
        {
          kind: "question",
          question: {
            id: "m10-eda-q1",
            type: "true-false",
            prompt: "In `housing.csv`, houses with a garage sell for more on average. This proves that building a garage increases a house's price.",
            answer: false,
            explanation: "The data only shows an association. Houses with garages may also be larger, newer or in more expensive neighborhoods – all possible confounders. To claim a causal effect you would need an experiment or a much more careful analysis.",
            concept: "correlation-vs-causation",
          },
        },
      ],
    },
    {
      id: "limitations",
      title: "Limitations and next steps",
      blocks: [
        {
          kind: "text",
          md: `Every dataset has limits. Stating them is not a weakness – it shows the reader how much weight your findings can carry. Typical limitations are:

* **Sample size and coverage** – few observations, or only certain people, places or years.
* **Missing data** – how much is missing, and could the missing values differ from the rest?
* **Measurement** – self-reported values, rounded values, possible typing errors.
* **Observational data** – associations, not causes; possible confounders.
* **Synthetic or simplified data** – the R Academy datasets are realistic but generated for learning.`,
        },
        {
          kind: "code",
          example: {
            id: "limitations-evidence",
            title: "Collecting evidence for the limitations section",
            code: `patients <- read.csv("data/patients.csv")

nrow(patients)
colSums(is.na(patients[, c("bmi", "cholesterol")]))
table(patients$smoker)
range(patients$age)`,
            explanation: [
              { code: `nrow(patients)`, text: "The sample size: 150 patients from one (fictional) clinic." },
              { code: `colSums(is.na(patients[, c("bmi", "cholesterol")]))`, text: "How much data is missing in the columns used." },
              { code: `table(patients$smoker)`, text: "Group sizes: only 31 smokers, so smoker averages are less precise than non-smoker averages." },
              { code: `range(patients$age)`, text: "The ages covered: results say nothing about patients younger than 25." },
            ],
            output: String.raw`[1] 150
        bmi cholesterol
          5           6

 No Yes
119  31
[1] 25 80`,
          },
        },
        {
          kind: "text",
          md: `From these numbers you can write a concrete limitations paragraph, for example:

> *The data covers 150 adult patients (aged 25–80) of a single fictional clinic, so the results may not apply to other populations. BMI is missing for 5 and cholesterol for 6 patients; these were excluded from the analyses of those variables. Only 31 patients smoke, so comparisons between smokers and non-smokers are uncertain. The data is observational: differences between groups may be explained by other factors such as age.*

You will write a full analysis like this in the [Analyzing patient health data project](/projects/patient-health).`,
        },
      ],
    },
    {
      id: "mini-report",
      title: "Putting it together: a mini report",
      blocks: [
        {
          kind: "text",
          md: "Here is a compact report for `sales.csv` generated entirely by code. Real reports usually add a chart or two (like the line chart above) and are written in a document, but the structure is the same: data, quality, findings with numbers, limitations.",
        },
        {
          kind: "code",
          example: {
            id: "sales-mini-report",
            title: "A mini EDA report from code",
            code: String.raw`sales <- read.csv("data/sales.csv")
sales$month <- as.Date(sales$month)
sales$year <- format(sales$month, "%Y")

yearly <- aggregate(revenue ~ year, data = sales, FUN = sum)
by_region <- aggregate(revenue ~ region, data = sales, FUN = sum)
best <- by_region[which.max(by_region$revenue), ]
growth <- 100 * (yearly$revenue[3] / yearly$revenue[1] - 1)

cat("SALES REPORT 2022-2024\n\n")
cat(sprintf("Data: %d rows (one per region and month), %d regions, %s to %s.\n",
            nrow(sales), length(unique(sales$region)),
            format(min(sales$month), "%b %Y"), format(max(sales$month), "%b %Y")))
cat(sprintf("Quality: %d missing values, %d duplicated rows.\n\n",
            sum(is.na(sales)), sum(duplicated(sales))))
cat(sprintf("Finding 1: total revenue grew by %.1f%% from 2022 to 2024.\n", growth))
cat(sprintf("Finding 2: %s had the highest total revenue ($%s).\n",
            best$region, format(round(best$revenue), big.mark = ",")))
cat("Limitation: only 3 years and 4 regions; no data on prices or marketing,\n")
cat("so the reasons for the growth cannot be identified.\n")`,
            explanation: [
              { code: `sales$year <- format(sales$month, "%Y")`, text: "A year column for yearly totals (Module 8 date skills)." },
              { code: `growth <- 100 * (yearly$revenue[3] / yearly$revenue[1] - 1)`, text: "Percentage growth from the first year (2022) to the third (2024)." },
              { code: `cat(sprintf("Quality: %d missing values, %d duplicated rows.\n\n",`, text: "The quality section reports the checks you ran, even when they found nothing." },
              { code: `cat(sprintf("Finding 1: total revenue grew by %.1f%% from 2022 to 2024.\n", growth))`, text: "`%%` prints a literal percent sign inside `sprintf()`." },
              { code: `            best$region, format(round(best$revenue), big.mark = ",")))`, text: "`big.mark = \",\"` adds thousands separators so large numbers are easy to read." },
            ],
            output: String.raw`SALES REPORT 2022-2024

Data: 144 rows (one per region and month), 4 regions, Jan 2022 to Dec 2024.
Quality: 0 missing values, 0 duplicated rows.

Finding 1: total revenue grew by 24.9% from 2022 to 2024.
Finding 2: North had the highest total revenue ($473,709).
Limitation: only 3 years and 4 regions; no data on prices or marketing,
so the reasons for the growth cannot be identified.`,
            outputNote: "Every number in this text comes straight from the data, so the report is reproducible: if next year's file has more rows, rerunning the script updates the report.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Ready for the capstone",
          md: `You now have everything you need for the [Capstone: a complete EDA report](/projects/housing-eda-capstone), where you write a full report on \`housing.csv\` – from the question and the quality checks to charts, findings and limitations.

The other guided projects practise parts of the process: [Cleaning messy customer data](/projects/clean-messy-customers), [Exploring survey data](/projects/explore-survey), [Analyzing student performance](/projects/student-performance), [Visualizing sales trends](/projects/sales-trends) and [Analyzing patient health data](/projects/patient-health).`,
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Reporting averages without group sizes",
      wrong: `patients <- read.csv("data/patients.csv")
round(tapply(patients$systolic_bp, patients$smoker, mean), 1)`,
      why: "The two averages look equally trustworthy, but one is based on 119 patients and the other on only 31. Always show `n` next to group statistics.",
      right: `patients <- read.csv("data/patients.csv")
data.frame(
  n = as.vector(table(patients$smoker)),
  mean_bp = as.vector(round(tapply(patients$systolic_bp, patients$smoker, mean), 1)),
  row.names = c("No", "Yes")
)`,
    },
    {
      title: "Forgetting missing values in a summary table",
      wrong: `students <- read.csv("data/students.csv")
sapply(students[, c("math", "science")], mean)`,
      why: "The science mean is `NA` because 3 values are missing. Use `na.rm = TRUE` – and report how many values were missing, so the reader knows the mean is based on 57 students.",
      right: `students <- read.csv("data/students.csv")
sapply(students[, c("math", "science")], mean, na.rm = TRUE)
colSums(is.na(students[, c("math", "science")]))`,
    },
    {
      title: "Too many digits",
      wrong: `students <- read.csv("data/students.csv")
tapply(students$math, students$class, mean)`,
      why: "Values like `74.94444` suggest a precision the data does not have and make tables hard to read. Round to one decimal place for scores, whole numbers for money in large amounts.",
      right: `students <- read.csv("data/students.csv")
round(tapply(students$math, students$class, mean), 1)`,
    },
    {
      title: "Showing only a bar of means when the spread matters",
      wrong: `housing <- read.csv("data/housing.csv")
barplot(tapply(housing$price, housing$neighborhood, mean))`,
      why: "A bar of means hides how much prices vary inside each neighborhood and how many houses each bar is based on. A box plot shows the median, the spread and outliers of every group.",
      right: `housing <- read.csv("data/housing.csv")
boxplot(price ~ neighborhood, data = housing)`,
    },
  ],
  exerciseIds: ["m10-class-summary", "m10-correlation-finding"],
  quiz: [
    {
      id: "m10-eda-q2",
      type: "multiple-choice",
      prompt: "You want to show how monthly revenue changed from 2022 to 2024. Which chart fits best?",
      options: ["A line chart with the month on the x-axis", "A pie chart of revenue per year", "A histogram of revenue", "A box plot of revenue"],
      answer: 0,
      optionFeedback: [
        "Correct – line charts are made for change over time.",
        "Pie charts compare parts of a whole and hide the order of time.",
        "A histogram shows how revenue values are distributed, not when they occurred.",
        "A box plot summarises the distribution but loses the time order.",
      ],
      explanation: "Change over time = a date on the x-axis and a line connecting the values in time order (`geom_line()`).",
      concept: "choosing-charts",
    },
    {
      id: "m10-eda-q3",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `answers <- c("Yes", "No", "Yes", "Yes")
round(100 * prop.table(table(answers)), 1)`,
      options: ["answers\n No Yes \n 25  75 ", "answers\n No Yes \n  1   3 ", "[1] 75", "answers\n  No  Yes \n0.25 0.75 "],
      answer: 0,
      optionFeedback: [
        "Correct – 1 of 4 is 25 % and 3 of 4 is 75 %.",
        "Those are the counts; `prop.table()` turns them into proportions.",
        "The table has one value per category, not a single number.",
        "These are proportions, but the code multiplies them by 100.",
      ],
      explanation: "`table()` counts 1 \"No\" and 3 \"Yes\"; `prop.table()` divides by the total (4), and × 100 turns the proportions into percentages: 25 and 75.",
      concept: "summary-tables",
    },
    {
      id: "m10-eda-q4",
      type: "multiple-choice",
      prompt: "Which sentence describes the result `cor(study_hours, math) = 0.59` (60 students) most honestly?",
      options: [
        "Students who study more tend to have higher math scores (r = 0.59, n = 60); this does not prove that studying causes the higher scores.",
        "Studying more causes higher math scores.",
        "Math scores are 59 % determined by study hours.",
        "There is no relationship between study hours and math.",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – it states the direction, the size, the sample and the limits.",
        "A correlation alone cannot show cause; confounders or reverse causation are possible.",
        "A correlation of 0.59 is not a percentage of anything.",
        "0.59 is a clear, moderate positive correlation.",
      ],
      explanation: "An honest finding gives the direction (positive), the strength (r = 0.59), the sample size and avoids causal words, because the data is observational.",
      concept: "describing-findings",
    },
    {
      id: "m10-eda-q5",
      type: "fill-blank",
      prompt: "Complete the code so that the table shows the percentage of each age group that would recommend the app (each **row** adds up to 100).",
      code: `survey <- read.csv("data/survey.csv")
round(100 * prop.table(table(survey$age_group, survey$recommend), margin = ___), 1)`,
      accept: ["1"],
      hint: "Rows are the first dimension of a table, columns the second.",
      explanation: "`margin = 1` divides each count by its **row** total, so the percentages within each age group add up to 100. `margin = 2` would use column totals instead.",
      concept: "summary-tables",
    },
    {
      id: "m10-eda-q6",
      type: "multiple-choice",
      prompt: "Which of these belongs in the *limitations* section of an EDA report on `patients.csv`?",
      options: [
        "Only 31 of the 150 patients smoke, so comparisons between smokers and non-smokers are uncertain.",
        "Smokers had a higher average blood pressure (143.0 vs 136.8).",
        "The data was imported with `read.csv()`.",
        "Box plots are a good way to compare groups.",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – it explains how far the findings can be trusted.",
        "That is a finding, not a limitation.",
        "Technical details of the import are not a limitation of the data.",
        "That is general advice, not a limitation of this analysis.",
      ],
      explanation: "Limitations describe what weakens or restricts the conclusions: small groups, missing data, measurement problems, observational data or limited coverage.",
      concept: "limitations",
    },
  ],
  keyPoints: [
    "An EDA report answers a question: key findings first, then the data, quality checks, single variables, relationships, findings and limitations.",
    "Good summary tables show `n`, round sensibly, use clear names and a meaningful order; use percentages for categories.",
    "Choose charts by question and variable type: histogram for one number, bar chart for categories, scatter plot for two numbers, box plot for groups, line chart for time.",
    "Describe findings with numbers, group sizes and careful wording – and report results that do not fit your expectations too.",
    "Correlation does not prove causation: reverse causation, confounders and chance are always possible explanations.",
    "A limitations section, based on evidence such as sample sizes and missing values, tells the reader how much weight the findings can carry.",
  ],
  concepts: [
    "eda-report-structure",
    "summary-tables",
    "choosing-charts",
    "describing-findings",
    "correlation-vs-causation",
    "limitations",
  ],
  glossary: ["eda", "frequency-table", "histogram", "bar-chart", "scatter-plot", "box-plot", "correlation", "sample", "population", "outlier", "missing-data"],
  playground: `# Start your own mini EDA of housing.csv
housing <- read.csv("data/housing.csv")

str(housing)
summary(housing$price)
round(tapply(housing$price, housing$neighborhood, median))
table(housing$garage)
round(cor(housing$size_sqft, housing$price), 2)
`,
  prerequisites: ["planning-a-data-analysis"],
  datasets: ["students", "survey", "sales", "housing", "patients"],
};
