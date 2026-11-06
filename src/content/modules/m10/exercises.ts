import type { Exercise } from "../../types";

export const module10Exercises: Exercise[] = [
  {
    id: "m10-quality-check",
    title: "A data-quality check of the patient data",
    difficulty: "medium",
    module: 10,
    lesson: "planning-a-data-analysis",
    concepts: ["data-quality"],
    datasets: ["patients"],
    prompt: `Before analysing \`patients.csv\`, run the quality checklist and store each answer in a variable:

1. \`n_rows\` – the number of rows.
2. \`missing\` – the number of missing values in **every** column (a named vector).
3. \`cols_with_missing\` – the **names** of the columns that have at least one missing value.
4. \`n_duplicates\` – the number of duplicated rows.
5. \`sex_values\` – the different values that occur in \`sex\`, sorted alphabetically.
6. \`bmi_range\` – the smallest and largest BMI, ignoring missing values.`,
    starterCode: `patients <- read.csv("data/patients.csv")

# 1. n_rows

# 2. missing: number of NAs in every column

# 3. cols_with_missing: names of the columns with at least one NA

# 4. n_duplicates

# 5. sex_values: the different values of sex, sorted

# 6. bmi_range: smallest and largest bmi, ignoring NAs

`,
    expected: "150 rows; missing values only in `bmi` (5) and `cholesterol` (6); no duplicated rows; `sex` has the values `\"Female\"` and `\"Male\"`; BMI ranges from 17 to 37.",
    hints: [
      "`nrow()` counts rows and `colSums(is.na(patients))` counts the missing values per column.",
      "Keep the names where the count is above zero: `names(missing[missing > 0])`. Duplicates: `sum(duplicated(patients))`.",
      "`sort(unique(patients$sex))` and `range(patients$bmi, na.rm = TRUE)`.",
    ],
    solution: `patients <- read.csv("data/patients.csv")

n_rows <- nrow(patients)
missing <- colSums(is.na(patients))
cols_with_missing <- names(missing[missing > 0])
n_duplicates <- sum(duplicated(patients))
sex_values <- sort(unique(patients$sex))
bmi_range <- range(patients$bmi, na.rm = TRUE)

missing
cols_with_missing
bmi_range`,
    explanation: `* \`nrow(patients)\` gives the size: 150 patients.
* \`is.na(patients)\` marks every missing cell; \`colSums()\` counts them column by column, keeping the column names.
* \`missing > 0\` is \`TRUE\` for columns with gaps; using it inside \`[ ]\` keeps those elements, and \`names()\` returns their names: \`bmi\` and \`cholesterol\`.
* \`duplicated()\` flags rows that repeat an earlier row – none here.
* \`unique()\` lists each spelling once; if you saw \`"female"\` or \`"F"\` here, you would need to clean the column first.
* \`range(..., na.rm = TRUE)\` checks for impossible values: a BMI between 17 and 37 is plausible for adults.`,
    tests: [
      {
        name: "`n_rows` is correct",
        check: `isTRUE(all.equal(as.numeric(n_rows), 150))`,
        failMessage: "`n_rows` should be `nrow(patients)`, which is 150.",
      },
      {
        name: "`missing` counts the NAs of every column",
        check: `isTRUE(all.equal(as.vector(missing[names(read.csv("data/patients.csv"))]), as.vector(colSums(is.na(read.csv("data/patients.csv"))))))`,
        failMessage: "Use `colSums(is.na(patients))` – it returns one count per column, named after the columns.",
      },
      {
        name: "`cols_with_missing` names the columns with gaps",
        check: `identical(sort(as.character(cols_with_missing)), c("bmi", "cholesterol"))`,
        failMessage: "Keep only the names of the columns whose count is above 0: `names(missing[missing > 0])`.",
      },
      {
        name: "`n_duplicates` is correct",
        check: `isTRUE(all.equal(as.numeric(n_duplicates), 0))`,
        failMessage: "Count duplicated rows with `sum(duplicated(patients))`.",
      },
      {
        name: "`sex_values` and `bmi_range` are correct",
        check: `identical(as.character(sex_values), c("Female", "Male")) && isTRUE(all.equal(as.vector(bmi_range), c(17, 37)))`,
        failMessage: "Use `sort(unique(patients$sex))` and `range(patients$bmi, na.rm = TRUE)` – without `na.rm = TRUE` the range is `NA`.",
      },
    ],
  },
  {
    id: "m10-sales-pipeline",
    title: "A mini pipeline for the sales data",
    difficulty: "challenge",
    module: 10,
    lesson: "planning-a-data-analysis",
    concepts: ["data-pipeline", "reproducible-script", "documenting-decisions"],
    datasets: ["sales"],
    prompt: `Write a short, reproducible pipeline for \`sales.csv\` that answers: **How much did total revenue grow from 2022 to 2024, and which region earned the most in 2024?**

1. **Import** the file into \`sales_raw\` and leave it unchanged.
2. **Clean**: create \`sales\` as a copy of \`sales_raw\`, convert its \`month\` column to dates and add a column \`year\` (e.g. with \`format(sales$month, "%Y")\`). Add a \`stopifnot()\` check that \`sales\` still has as many rows as \`sales_raw\`.
3. **Explore**: \`yearly\` – a data frame of the **total revenue per year** made with \`aggregate()\` (columns \`year\` and \`revenue\`).
4. **Communicate**: \`growth_pct\` – the percentage growth of total revenue from 2022 to 2024, rounded to 1 decimal; \`best_region_2024\` – the name of the region with the highest total revenue in 2024.

Use comments to label the pipeline stages.`,
    starterCode: `# Question: How much did revenue grow from 2022 to 2024,
# and which region earned the most in 2024?

# 1. Import


# 2. Clean


# 3. Explore


# 4. Communicate

`,
    expected: "`yearly` has three rows (2022, 2023, 2024), `growth_pct` is `24.9` and `best_region_2024` is `\"North\"`.",
    hints: [
      "Import with `sales_raw <- read.csv(\"data/sales.csv\")`, then `sales <- sales_raw`, `sales$month <- as.Date(sales$month)` and `sales$year <- format(sales$month, \"%Y\")`.",
      "`yearly <- aggregate(revenue ~ year, data = sales, FUN = sum)`. Growth is `100 * (revenue in 2024 / revenue in 2022 - 1)`, e.g. with `yearly$revenue[yearly$year == \"2024\"]`.",
      "For the best region, total the 2024 rows per region: `totals <- tapply(sales$revenue[sales$year == \"2024\"], sales$region[sales$year == \"2024\"], sum)` and take `names(which.max(totals))`.",
    ],
    solution: `# Question: How much did revenue grow from 2022 to 2024,
# and which region earned the most in 2024?

# 1. Import
sales_raw <- read.csv("data/sales.csv")

# 2. Clean: real dates and a year column; the raw data stays untouched
sales <- sales_raw
sales$month <- as.Date(sales$month)
sales$year <- format(sales$month, "%Y")
stopifnot(nrow(sales) == nrow(sales_raw))

# 3. Explore: total revenue per year
yearly <- aggregate(revenue ~ year, data = sales, FUN = sum)
yearly

# 4. Communicate
first <- yearly$revenue[yearly$year == "2022"]
last <- yearly$revenue[yearly$year == "2024"]
growth_pct <- round(100 * (last / first - 1), 1)

sales_2024 <- sales[sales$year == "2024", ]
totals_2024 <- tapply(sales_2024$revenue, sales_2024$region, sum)
best_region_2024 <- names(which.max(totals_2024))

growth_pct
best_region_2024`,
    explanation: `* **Import:** the raw file goes into \`sales_raw\`, which is never modified – you can always compare with it.
* **Clean:** a copy gets real dates, so \`format(sales$month, "%Y")\` can extract the year. \`stopifnot()\` documents and checks the assumption that cleaning keeps every row.
* **Explore:** \`aggregate(revenue ~ year, ..., FUN = sum)\` returns one row per year with the total revenue.
* **Communicate:** the growth compares the 2024 total with the 2022 total: \`100 * (last / first - 1)\` ≈ 24.9 %. Filtering to 2024 and totalling per region with \`tapply()\` shows North in front; \`names(which.max())\` returns its name.
* Because every step is in code, rerunning the script on an updated file would update every answer.`,
    tests: [
      {
        name: "`sales_raw` is the unchanged raw data",
        check: `is.data.frame(sales_raw) && nrow(sales_raw) == 144 && is.character(sales_raw$month)`,
        failMessage: "Keep `sales_raw <- read.csv(\"data/sales.csv\")` unchanged and do the cleaning on a copy called `sales`.",
      },
      {
        name: "`sales` has real dates and a year column",
        check: `inherits(sales$month, "Date") && "year" %in% names(sales) && nrow(sales) == 144`,
        failMessage: "Convert `sales$month` with `as.Date()` and add `sales$year <- format(sales$month, \"%Y\")`.",
      },
      {
        name: "The script checks the number of rows with stopifnot()",
        check: String.raw`grepl("stopifnot(", gsub("#[^\n]*", "", .code), fixed = TRUE)`,
        failMessage: "Add a check such as `stopifnot(nrow(sales) == nrow(sales_raw))` after cleaning.",
      },
      {
        name: "`yearly` holds the total revenue per year",
        check: `is.data.frame(yearly) && nrow(yearly) == 3 && isTRUE(all.equal(sum(yearly$revenue), sum(read.csv("data/sales.csv")$revenue)))`,
        failMessage: "Use `aggregate(revenue ~ year, data = sales, FUN = sum)` – three rows, one per year.",
      },
      {
        name: "`growth_pct` and `best_region_2024` are correct",
        check: `isTRUE(all.equal(as.numeric(growth_pct), 24.9)) && identical(unname(best_region_2024), "North")`,
        failMessage: "Growth: `round(100 * (revenue_2024 / revenue_2022 - 1), 1)`. Best region: total only the 2024 rows per region and take `names(which.max(...))`.",
      },
    ],
  },
  {
    id: "m10-class-summary",
    title: "A report-ready summary table",
    difficulty: "medium",
    module: 10,
    lesson: "writing-an-eda-report",
    concepts: ["summary-tables"],
    datasets: ["students"],
    packages: ["dplyr"],
    prompt: `Create a summary table of math scores **by class** for an EDA report on \`students.csv\`.

Store it in \`class_summary\`, a data frame with one row per class and these columns:

* \`class\`
* \`n\` – the number of students,
* \`mean_math\` – the mean math score, rounded to 1 decimal,
* \`sd_math\` – the standard deviation of the math scores, rounded to 1 decimal.

Sort the rows from the **highest** to the **lowest** \`mean_math\`. You may use dplyr (\`group_by()\`, \`summarise()\`, \`arrange()\`) or base R.`,
    starterCode: `library(dplyr)

students <- read.csv("data/students.csv")

# class_summary: one row per class with n, mean_math and sd_math (rounded),
# sorted by mean_math from highest to lowest

`,
    expected: "Three rows in the order C (n = 20, 76.2), A (n = 18, 74.9), B (n = 22, 73.0), with standard deviations 9.0, 11.2 and 13.7.",
    hints: [
      "Start with `students |> group_by(class) |> summarise(...)`.",
      "Inside `summarise()`: `n = n()`, `mean_math = round(mean(math), 1)` and `sd_math = round(sd(math), 1)`.",
      "Finish with `arrange(desc(mean_math))` and, optionally, `as.data.frame()`.",
    ],
    solution: `library(dplyr)

students <- read.csv("data/students.csv")

class_summary <- students |>
  group_by(class) |>
  summarise(
    n = n(),
    mean_math = round(mean(math), 1),
    sd_math = round(sd(math), 1)
  ) |>
  arrange(desc(mean_math)) |>
  as.data.frame()

class_summary`,
    explanation: `* \`group_by(class)\` splits the students into the three classes; \`summarise()\` computes one row per class.
* \`n = n()\` adds the group size – essential for judging how reliable each mean is.
* \`round(..., 1)\` keeps the table readable; scores do not need more precision.
* \`arrange(desc(mean_math))\` puts the best class first, so the ranking is visible at a glance.
* The table shows that the differences between the class means are small (about 3 points) compared with the standard deviations (9–14 points) – worth saying in the report.`,
    tests: [
      {
        name: "`class_summary` is a data frame with the right columns",
        check: `is.data.frame(class_summary) && all(c("class", "n", "mean_math", "sd_math") %in% names(class_summary)) && nrow(class_summary) == 3`,
        failMessage: "`class_summary` needs exactly three rows and the columns `class`, `n`, `mean_math` and `sd_math`.",
      },
      {
        name: "Group sizes are correct",
        check: `isTRUE(all.equal(as.numeric(class_summary$n[match(c("A", "B", "C"), class_summary$class)]), c(18, 22, 20)))`,
        failMessage: "Count the students per class with `n = n()` (or `table(students$class)`).",
      },
      {
        name: "Means and standard deviations are rounded correctly",
        check: `local({ i <- match(c("A", "B", "C"), class_summary$class); isTRUE(all.equal(as.numeric(class_summary$mean_math[i]), c(74.9, 73, 76.2))) && isTRUE(all.equal(as.numeric(class_summary$sd_math[i]), c(11.2, 13.7, 9))) })`,
        failMessage: "Use `round(mean(math), 1)` and `round(sd(math), 1)` for each class.",
      },
      {
        name: "Rows are sorted from the highest to the lowest mean",
        check: `identical(as.character(class_summary$class), c("C", "A", "B"))`,
        failMessage: "Sort with `arrange(desc(mean_math))` so that class C (the highest mean) comes first.",
      },
    ],
  },
  {
    id: "m10-correlation-finding",
    title: "From correlations to an honest finding",
    difficulty: "challenge",
    module: 10,
    lesson: "writing-an-eda-report",
    concepts: ["describing-findings", "correlation-vs-causation"],
    datasets: ["patients"],
    prompt: `Which variable is most strongly associated with **systolic blood pressure** in \`patients.csv\`?

1. \`cors\`: a **named** numeric vector with the correlation between \`systolic_bp\` and each of \`age\`, \`bmi\`, \`cholesterol\` and \`exercise_days\`, rounded to 2 decimals. Some values are missing, so use \`cor(..., use = "complete.obs")\`.
2. \`strongest\`: the **name** of the variable with the highest correlation.
3. \`finding\`: the sentence below, built with \`sprintf()\` from \`strongest\` and \`cors\` (do not type the name or the number yourself):

    \`Systolic blood pressure is most strongly associated with age (r = 0.66).\``,
    starterCode: `patients <- read.csv("data/patients.csv")
predictors <- patients[, c("age", "bmi", "cholesterol", "exercise_days")]

# 1. cors: correlation of systolic_bp with each predictor (complete.obs), rounded to 2


# 2. strongest: the name of the predictor with the highest correlation


# 3. finding: build the sentence from strongest and cors

`,
    expected: "`cors` is `age 0.66, bmi 0.20, cholesterol 0.26, exercise_days 0.03`, `strongest` is `\"age\"` and `finding` is the sentence shown.",
    hints: [
      "Use `sapply(predictors, function(x) cor(patients$systolic_bp, x, use = \"complete.obs\"))` and wrap it in `round(..., 2)`.",
      "`names(which.max(cors))` returns the name of the largest value.",
      "`sprintf(\"Systolic blood pressure is most strongly associated with %s (r = %.2f).\", strongest, cors[[strongest]])`",
    ],
    solution: `patients <- read.csv("data/patients.csv")
predictors <- patients[, c("age", "bmi", "cholesterol", "exercise_days")]

cors <- round(sapply(predictors, function(x) cor(patients$systolic_bp, x, use = "complete.obs")), 2)
strongest <- names(which.max(cors))
finding <- sprintf(
  "Systolic blood pressure is most strongly associated with %s (r = %.2f).",
  strongest, cors[[strongest]]
)

cors
finding`,
    explanation: `* \`sapply()\` visits each predictor column and computes its correlation with \`systolic_bp\`. \`use = "complete.obs"\` ignores the patients with a missing BMI or cholesterol value; without it, those correlations would be \`NA\`.
* \`which.max(cors)\` finds the largest correlation and \`names()\` returns the variable name, \`"age"\`.
* \`%s\` inserts the name and \`%.2f\` the correlation with two decimals, so the sentence always matches the data.
* The wording "is associated with" is deliberate: the data is observational, so the correlation does not show that age *causes* higher blood pressure (even if that is medically plausible). The weak correlation with \`exercise_days\` (0.03) is a finding worth reporting too.`,
    tests: [
      {
        name: "`cors` holds the four rounded correlations",
        check: `isTRUE(all.equal(as.vector(cors[c("age", "bmi", "cholesterol", "exercise_days")]), c(0.66, 0.2, 0.26, 0.03)))`,
        failMessage: "Compute `cor(patients$systolic_bp, x, use = \"complete.obs\")` for every predictor (e.g. with `sapply()`), keep the names and round to 2 decimals.",
      },
      {
        name: "`strongest` is the right variable name",
        check: `identical(unname(strongest), "age")`,
        failMessage: "Use `names(which.max(cors))` to get the name of the largest correlation.",
      },
      {
        name: "`finding` is the expected sentence",
        check: `identical(finding, "Systolic blood pressure is most strongly associated with age (r = 0.66).")`,
        failMessage: "Build it with `sprintf(\"Systolic blood pressure is most strongly associated with %s (r = %.2f).\", strongest, cors[[strongest]])`.",
      },
      {
        name: "The sentence is built with sprintf()",
        check: String.raw`grepl("sprintf(", gsub("#[^\n]*", "", .code), fixed = TRUE)`,
        failMessage: "Please create `finding` with `sprintf()` so the text always matches the computed values.",
      },
    ],
  },
];
