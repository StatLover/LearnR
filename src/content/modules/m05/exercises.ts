import type { Exercise } from "../../types";

export const m05Exercises: Exercise[] = [
  {
    id: "m5-import-explore",
    title: "Import and explore the survey",
    difficulty: "easy",
    module: 5,
    lesson: "importing-and-exploring-csv",
    concepts: ["read-csv", "checking-imports", "exploring-data"],
    datasets: ["survey"],
    prompt: `The file \`data/survey.csv\` holds answers from users of a shopping app.

1. Import it into a data frame called \`survey\`.
2. Store the number of rows in \`n_rows\` and the number of columns in \`n_cols\`.
3. Count how many people chose each \`favorite_feature\`, store the frequency table in \`feature_counts\` and print it.`,
    starterCode: `# 1. Import the survey file into a variable called survey


# 2. Store the number of rows in n_rows and the number of columns in n_cols


# 3. Count each favorite_feature, store the table in feature_counts and print it
`,
    expected: "`n_rows` is 200, `n_cols` is 8, and printing `feature_counts` shows four features with their counts.",
    hints: [
      "Start with `survey <- read.csv(\"data/survey.csv\")` – remember the quotes and the `data/` folder.",
      "`nrow()` counts rows and `ncol()` counts columns: `n_rows <- nrow(survey)`.",
      "`feature_counts <- table(survey$favorite_feature)` and then type `feature_counts` on its own line to print it.",
    ],
    solution: `survey <- read.csv("data/survey.csv")

n_rows <- nrow(survey)
n_cols <- ncol(survey)

feature_counts <- table(survey$favorite_feature)
feature_counts`,
    explanation: `- \`read.csv("data/survey.csv")\` reads the file and \`<-\` stores the data frame in \`survey\`.
- \`nrow(survey)\` returns 200 (one row per respondent) and \`ncol(survey)\` returns 8 (one per question).
- \`table(survey$favorite_feature)\` counts how often each feature appears. Typing the variable name on its own prints it: Price, Recommendations, Search and Support with their counts, which add up to 200.`,
    tests: [
      {
        name: "`survey` is a data frame with 200 rows",
        check: `is.data.frame(survey) && nrow(survey) == 200`,
        failMessage: "Import the file with `survey <- read.csv(\"data/survey.csv\")`.",
      },
      {
        name: "`n_rows` is 200",
        check: `isTRUE(n_rows == 200)`,
        failMessage: "`n_rows` should hold the number of rows – use `nrow(survey)`.",
      },
      {
        name: "`n_cols` is 8",
        check: `isTRUE(n_cols == 8)`,
        failMessage: "`n_cols` should hold the number of columns – use `ncol(survey)`.",
      },
      {
        name: "`feature_counts` counts each favorite_feature",
        check: `{ ref <- table(read.csv("data/survey.csv")$favorite_feature); identical(as.vector(feature_counts), as.vector(ref)) && identical(names(feature_counts), names(ref)) }`,
        failMessage: "Use `table()` on the `favorite_feature` column: `table(survey$favorite_feature)`.",
      },
      {
        name: "The table is printed",
        check: `grepl("Recommendations", .out, fixed = TRUE)`,
        failMessage: "Print the table by writing `feature_counts` on its own line at the end.",
      },
    ],
  },
  {
    id: "m5-filter-select",
    title: "Patients with diabetes",
    difficulty: "easy",
    module: 5,
    lesson: "filtering-sorting-selecting",
    concepts: ["logical-indexing", "selecting-columns", "subset-function"],
    datasets: ["patients"],
    prompt: `A doctor wants a short list of the patients who have diabetes.

1. Import \`data/patients.csv\` into \`patients\`.
2. Create a data frame \`diabetic\` that contains only the patients whose \`diabetes\` column is \`"Yes"\`, and only the columns \`patient_id\`, \`age\` and \`bmi\` (in that order).
3. Store the number of patients in that list in \`n_diabetic\` and print it.`,
    starterCode: `patients <- read.csv("data/patients.csv")

# Keep the rows where diabetes is "Yes" and the columns patient_id, age, bmi
diabetic <- patients

# Count the rows
`,
    expected: "`diabetic` has 3 columns and one row per patient with diabetes; `n_diabetic` is printed as `[1] 36`.",
    hints: [
      "A condition for the rows is `patients$diabetes == \"Yes\"` (two equals signs, and \"Yes\" with a capital Y).",
      "Put the condition before the comma and the column names after it: `patients[condition, c(\"patient_id\", \"age\", \"bmi\")]`. `subset()` works too.",
      "`diabetic <- subset(patients, diabetes == \"Yes\", select = c(patient_id, age, bmi))`, then `n_diabetic <- nrow(diabetic)` and `n_diabetic`.",
    ],
    solution: `patients <- read.csv("data/patients.csv")

diabetic <- subset(patients, diabetes == "Yes", select = c(patient_id, age, bmi))

n_diabetic <- nrow(diabetic)
n_diabetic`,
    explanation: `- \`subset(patients, diabetes == "Yes", ...)\` keeps only the rows where the \`diabetes\` column equals \`"Yes"\`.
- \`select = c(patient_id, age, bmi)\` keeps three columns in that order.
- \`nrow(diabetic)\` counts the rows: 36 patients have diabetes.

The bracket version gives the same result: \`patients[patients$diabetes == "Yes", c("patient_id", "age", "bmi")]\`.`,
    tests: [
      {
        name: "`diabetic` has the columns patient_id, age and bmi",
        check: `is.data.frame(diabetic) && identical(names(diabetic), c("patient_id", "age", "bmi"))`,
        failMessage: "Select exactly three columns, in this order: `c(\"patient_id\", \"age\", \"bmi\")`.",
      },
      {
        name: "`diabetic` contains only (and all) patients with diabetes",
        check: `{ p <- read.csv("data/patients.csv"); identical(sort(diabetic$patient_id), sort(p$patient_id[p$diabetes == "Yes"])) }`,
        failMessage: "Keep the rows where `diabetes == \"Yes\"` – check the spelling and the capital Y.",
      },
      {
        name: "`n_diabetic` is the number of rows in `diabetic`",
        check: `isTRUE(n_diabetic == 36)`,
        failMessage: "Use `n_diabetic <- nrow(diabetic)`.",
      },
    ],
  },
  {
    id: "m5-sort-and-filter",
    title: "Class B's hardest workers",
    difficulty: "medium",
    module: 5,
    lesson: "filtering-sorting-selecting",
    concepts: ["logical-indexing", "sorting", "selecting-columns"],
    datasets: ["students"],
    prompt: `The teacher of class B wants to see how her hardest-working students do in math.

1. Import \`data/students.csv\` into \`students\`.
2. Create \`class_b\`: the students in class \`"B"\` who study **at least 10 hours** per week, with only the columns \`name\`, \`study_hours\` and \`math\`, **sorted by math score from highest to lowest**.
3. Store the name of the best student in that table (the first row) in \`best_b\`, and print \`class_b\`.`,
    starterCode: `students <- read.csv("data/students.csv")

# 1. Filter: class B and at least 10 study hours


# 2. Sort by math (highest first) and keep name, study_hours, math


# 3. The name in the first row
`,
    expected: "`class_b` has 3 columns, every student studies 10+ hours, and the math scores go down from the first row to the last. `best_b` is `\"Chloe\"`.",
    hints: [
      "First filter: `b <- subset(students, class == \"B\" & study_hours >= 10)`. *At least 10* means `>= 10`.",
      "Then sort the filtered rows: `b[order(b$math, decreasing = TRUE), c(\"name\", \"study_hours\", \"math\")]`.",
      "The first name is `class_b$name[1]`.",
    ],
    solution: `students <- read.csv("data/students.csv")

b <- subset(students, class == "B" & study_hours >= 10)

class_b <- b[order(b$math, decreasing = TRUE), c("name", "study_hours", "math")]

best_b <- class_b$name[1]
class_b`,
    explanation: `- \`subset(students, class == "B" & study_hours >= 10)\` keeps class B students who study at least 10 hours (\`>=\` includes exactly 10).
- \`order(b$math, decreasing = TRUE)\` gives the row positions from the highest math score to the lowest. Putting it **before the comma** moves whole rows, so names stay with their scores.
- \`c("name", "study_hours", "math")\` after the comma selects the three columns.
- \`class_b$name[1]\` takes the first value of the \`name\` column: \`"Chloe"\`, who scored 99.`,
    tests: [
      {
        name: "`class_b` has the columns name, study_hours and math",
        check: `is.data.frame(class_b) && identical(names(class_b), c("name", "study_hours", "math"))`,
        failMessage: "After the comma, select `c(\"name\", \"study_hours\", \"math\")`.",
      },
      {
        name: "Only class B students with at least 10 study hours",
        check: `{ s <- read.csv("data/students.csv"); identical(sort(class_b$name), sort(s$name[s$class == "B" & s$study_hours >= 10])) }`,
        failMessage: "Use `class == \"B\" & study_hours >= 10` – `>=` so that students with exactly 10 hours are included.",
      },
      {
        name: "Sorted by math, highest first",
        check: `!is.unsorted(rev(class_b$math)) && class_b$math[1] == max(class_b$math)`,
        failMessage: "Sort with `order(..., decreasing = TRUE)` and put it before the comma.",
      },
      {
        name: "`best_b` is the name in the first row",
        check: `identical(best_b, "Chloe")`,
        failMessage: "`best_b` should be `class_b$name[1]` after sorting.",
      },
    ],
  },
  {
    id: "m5-missing-patients",
    title: "Missing cholesterol values",
    difficulty: "easy",
    module: 5,
    lesson: "missing-data-and-cleaning",
    concepts: ["missing-values"],
    datasets: ["patients"],
    prompt: `Some patients in \`data/patients.csv\` have no cholesterol measurement.

1. Import the file into \`patients\`.
2. Store the number of missing cholesterol values in \`n_missing\`.
3. Store the average cholesterol of the patients who *do* have a value in \`avg_chol\`.
4. Create \`patients_complete\`: the patients data without any incomplete rows.
5. Print \`n_missing\` and \`avg_chol\`.`,
    starterCode: `patients <- read.csv("data/patients.csv")

# 2. Count the missing cholesterol values
n_missing <- 0

# 3. Average cholesterol, ignoring missing values


# 4. Only complete rows


# 5. Print n_missing and avg_chol
`,
    expected: "`n_missing` is 6, `avg_chol` is about 212.49 and `patients_complete` has 139 rows.",
    hints: [
      "`is.na(patients$cholesterol)` gives TRUE for each missing value – and `sum()` counts the TRUEs.",
      "`mean()` needs `na.rm = TRUE` to skip the missing values. For complete rows, use `na.omit()` or `complete.cases()`.",
      "`n_missing <- sum(is.na(patients$cholesterol))`, `avg_chol <- mean(patients$cholesterol, na.rm = TRUE)`, `patients_complete <- na.omit(patients)`.",
    ],
    solution: `patients <- read.csv("data/patients.csv")

n_missing <- sum(is.na(patients$cholesterol))

avg_chol <- mean(patients$cholesterol, na.rm = TRUE)

patients_complete <- na.omit(patients)

n_missing
avg_chol`,
    explanation: `- \`is.na(patients$cholesterol)\` is TRUE for the 6 missing values; \`sum()\` counts them because TRUE counts as 1.
- \`mean(..., na.rm = TRUE)\` ignores the gaps and averages the 144 known values: about 212.49 mg/dL. Without \`na.rm = TRUE\` the answer would be \`NA\`.
- \`na.omit(patients)\` drops every row that has an NA in *any* column – the 6 without cholesterol and the 5 without BMI – leaving 139 rows. \`patients[complete.cases(patients), ]\` is an equivalent solution.`,
    tests: [
      {
        name: "`n_missing` is 6",
        check: `isTRUE(n_missing == 6)`,
        failMessage: "Count the TRUEs of `is.na(patients$cholesterol)` with `sum()`.",
      },
      {
        name: "`avg_chol` is the mean of the known values",
        check: `isTRUE(all.equal(avg_chol, 212.48611, tolerance = 1e-6))`,
        failMessage: "Use `mean(patients$cholesterol, na.rm = TRUE)` – without `na.rm = TRUE` the result is NA.",
      },
      {
        name: "`patients_complete` has only complete rows",
        check: `is.data.frame(patients_complete) && nrow(patients_complete) == 139 && !anyNA(patients_complete)`,
        failMessage: "Use `na.omit(patients)` (or `patients[complete.cases(patients), ]`) to remove every row with a missing value.",
      },
    ],
  },
  {
    id: "m5-clean-customers",
    title: "Clean the customer list",
    difficulty: "challenge",
    module: 5,
    lesson: "missing-data-and-cleaning",
    concepts: ["text-cleaning", "type-fixing", "duplicates", "missing-values"],
    datasets: ["customers_messy"],
    prompt: `The marketing team wants to know **how much customers in Boston have spent in total**. The file \`data/customers_messy.csv\` is messy, so clean it first:

1. Import it into \`customers\` and remove the duplicated rows.
2. Clean \`city\`: remove surrounding spaces and make it lower case (so every Boston customer has the city \`"boston"\`).
3. Turn \`total_spent\` into a **numeric** column: remove the \`$\` signs and the thousands commas, then convert. Values like \`"N/A"\` or empty cells should become \`NA\`.
4. Store the total amount spent by Boston customers in \`boston_total\` (ignore missing amounts) and print it.`,
    starterCode: `customers <- read.csv("data/customers_messy.csv")

# 1. Remove duplicated rows


# 2. Clean the city column


# 3. Make total_spent numeric (remove "$" and "," first)


# 4. Total spent in Boston
`,
    expected: "`customers` has 56 rows, `city` has five clean values, `total_spent` is numeric and `boston_total` is printed as `[1] 5997.16`. A warning *NAs introduced by coercion* is expected.",
    hints: [
      "Duplicates: `customers <- customers[!duplicated(customers), ]`. City: `customers$city <- tolower(trimws(customers$city))`.",
      "Use `gsub(\"$\", \"\", x, fixed = TRUE)` and then `gsub(\",\", \"\", x, fixed = TRUE)` on the `total_spent` column, and finally `as.numeric()`. Store the result back into `customers$total_spent`.",
      "`boston_total <- sum(customers$total_spent[customers$city == \"boston\"], na.rm = TRUE)`.",
    ],
    solution: `customers <- read.csv("data/customers_messy.csv")

customers <- customers[!duplicated(customers), ]

customers$city <- tolower(trimws(customers$city))

spent <- gsub("$", "", customers$total_spent, fixed = TRUE)
spent <- gsub(",", "", spent, fixed = TRUE)
customers$total_spent <- as.numeric(spent)

boston_total <- sum(customers$total_spent[customers$city == "boston"], na.rm = TRUE)
boston_total`,
    explanation: `- \`customers[!duplicated(customers), ]\` keeps the first copy of every row: 60 rows become 56. Removing duplicates first matters – otherwise a repeated Boston customer would be counted twice.
- \`tolower(trimws(...))\` turns \`" Boston "\`, \`"BOSTON"\` and \`"boston"\` into \`"boston"\`.
- The two \`gsub()\` calls remove \`$\` and \`,\` (with \`fixed = TRUE\`, so the characters are matched literally). \`as.numeric()\` then converts the text; \`"N/A"\` and empty cells cannot be converted and become NA – that is what the warning reports.
- \`customers$total_spent[customers$city == "boston"]\` picks the amounts of Boston customers, and \`sum(..., na.rm = TRUE)\` adds them up while skipping missing amounts: 5997.16 dollars.`,
    tests: [
      {
        name: "Duplicated rows are removed",
        check: `is.data.frame(customers) && nrow(customers) == 56 && !any(duplicated(customers$customer_id))`,
        failMessage: "Keep only the non-duplicated rows: `customers[!duplicated(customers), ]` (56 rows remain).",
      },
      {
        name: "`city` is trimmed and lower case",
        check: `setequal(unique(customers$city), c("new york", "boston", "chicago", "houston", "seattle"))`,
        failMessage: "Clean the city with `tolower(trimws(customers$city))` and store it back in `customers$city`.",
      },
      {
        name: "`total_spent` is numeric",
        check: `is.numeric(customers$total_spent) && sum(is.na(customers$total_spent)) == 3`,
        failMessage: "Remove `$` and `,` with `gsub(..., fixed = TRUE)` before `as.numeric()`, and store the result in `customers$total_spent`.",
      },
      {
        name: "`boston_total` is 5997.16",
        check: `isTRUE(all.equal(boston_total, 5997.16))`,
        failMessage: "Sum the cleaned amounts of the rows where `city == \"boston\"`, with `na.rm = TRUE`. Did you remove the duplicates first?",
      },
    ],
  },
  {
    id: "m5-dplyr-pipeline",
    title: "A dplyr pipeline for top attenders",
    difficulty: "medium",
    module: 5,
    lesson: "dplyr-and-tidyr-intro",
    concepts: ["dplyr-verbs", "pipe"],
    datasets: ["students"],
    packages: ["dplyr"],
    prompt: `The school wants to reward students who attend almost every class. Write **one pipeline** with \`|>\` that creates \`top_attenders\`:

1. Start from \`students\` (imported from \`data/students.csv\`).
2. Keep the students whose \`attendance\` is **90 or more**.
3. Add a column \`total\` = \`math + reading\`.
4. Sort by \`total\`, highest first.
5. Keep only the columns \`name\`, \`attendance\` and \`total\`.

Then print the first rows with \`head(top_attenders)\`.`,
    starterCode: `library(dplyr)
students <- read.csv("data/students.csv")

top_attenders <- students |>
  filter(attendance >= 90)

# Add the remaining steps to the pipeline above, then print head(top_attenders)
`,
    expected: "`top_attenders` has 20 rows and the columns `name`, `attendance`, `total`; the first row is Chloe with a total of 198.",
    hints: [
      "Each step is one verb: `filter()`, then `mutate()`, then `arrange()`, then `select()`. End every line except the last with `|>`.",
      "`mutate(total = math + reading)` creates the column; `arrange(desc(total))` sorts it from highest to lowest.",
      "The full pipeline: `students |> filter(attendance >= 90) |> mutate(total = math + reading) |> arrange(desc(total)) |> select(name, attendance, total)`.",
    ],
    solution: `library(dplyr)
students <- read.csv("data/students.csv")

top_attenders <- students |>
  filter(attendance >= 90) |>
  mutate(total = math + reading) |>
  arrange(desc(total)) |>
  select(name, attendance, total)

head(top_attenders)`,
    explanation: `Read the pipeline from top to bottom, saying "and then" at every \`|>\`:

- \`filter(attendance >= 90)\` keeps the 20 students with at least 90% attendance.
- \`mutate(total = math + reading)\` adds a new column with the sum of the two scores.
- \`arrange(desc(total))\` sorts by that total, highest first.
- \`select(name, attendance, total)\` keeps three columns.

The order matters a little: \`select()\` comes last because \`mutate()\` still needs \`math\` and \`reading\`. Chloe (attendance 93, total 198) is at the top.`,
    tests: [
      {
        name: "`top_attenders` has the columns name, attendance and total",
        check: `is.data.frame(top_attenders) && identical(names(top_attenders), c("name", "attendance", "total"))`,
        failMessage: "End the pipeline with `select(name, attendance, total)`.",
      },
      {
        name: "Only students with attendance of 90 or more",
        check: `nrow(top_attenders) == 20 && all(top_attenders$attendance >= 90)`,
        failMessage: "Filter with `attendance >= 90` – 20 students should remain.",
      },
      {
        name: "`total` is math + reading, sorted from highest to lowest",
        check: `{ s <- read.csv("data/students.csv"); s <- s[s$attendance >= 90, ]; isTRUE(all.equal(top_attenders$total, sort(s$math + s$reading, decreasing = TRUE))) }`,
        failMessage: "Create `total = math + reading` with `mutate()` and sort with `arrange(desc(total))`.",
      },
    ],
  },
  {
    id: "m5-sales-summary",
    title: "Regional sales report for 2024",
    difficulty: "challenge",
    module: 5,
    lesson: "dplyr-and-tidyr-intro",
    concepts: ["group-summaries", "dplyr-verbs", "pipe"],
    datasets: ["sales"],
    packages: ["dplyr"],
    prompt: `Build a small sales report from \`data/sales.csv\` for the year **2024 only**. Create a data frame \`region_2024\` with one row per region and these columns:

- \`region\`
- \`total_revenue\` – the sum of \`revenue\`
- \`months\` – the number of rows (months) for that region
- \`avg_units\` – the average of \`units\`

Sort it from the highest \`total_revenue\` to the lowest, make it a plain data frame and print it.

*Tip:* the \`month\` column holds dates as text like \`"2024-03-01"\`. Because the format is year-month-day, text comparison works: \`month >= "2024-01-01"\` is TRUE for every 2024 month.`,
    starterCode: `library(dplyr)
sales <- read.csv("data/sales.csv")

# Filter 2024, group by region, summarise, sort, as.data.frame()
region_2024 <- sales
`,
    expected: "Four rows (North, South, East, West in that order), each with `months` = 12; North's `total_revenue` is about 182969.8.",
    hints: [
      "Start with `sales |> filter(month >= \"2024-01-01\")`, then `group_by(region)`.",
      "In `summarise()` create three columns: `total_revenue = sum(revenue)`, `months = n()`, `avg_units = mean(units)`.",
      "Finish with `arrange(desc(total_revenue)) |> as.data.frame()` and store everything in `region_2024`.",
    ],
    solution: `library(dplyr)
sales <- read.csv("data/sales.csv")

region_2024 <- sales |>
  filter(month >= "2024-01-01") |>
  group_by(region) |>
  summarise(total_revenue = sum(revenue),
            months = n(),
            avg_units = mean(units)) |>
  arrange(desc(total_revenue)) |>
  as.data.frame()

region_2024`,
    explanation: `- \`filter(month >= "2024-01-01")\` keeps the 48 rows from 2024 (12 months × 4 regions). This works because dates written as YYYY-MM-DD sort correctly as text. \`substr(month, 1, 4) == "2024"\` would work too.
- \`group_by(region)\` makes the next step run once per region.
- \`summarise()\` creates the three summary columns; \`n()\` counts the rows in each group, which confirms that every region has 12 months of data.
- \`arrange(desc(total_revenue))\` sorts the regions, and \`as.data.frame()\` turns the tibble into a plain data frame.

North and South are close (about $183k and $177k); East and West are well behind.`,
    tests: [
      {
        name: "`region_2024` is a data frame with the four columns",
        check: `is.data.frame(region_2024) && all(c("region", "total_revenue", "months", "avg_units") %in% names(region_2024)) && nrow(region_2024) == 4`,
        failMessage: "`summarise()` should create `total_revenue`, `months` and `avg_units`, with one row per region.",
      },
      {
        name: "Only 2024 is included (12 months per region)",
        check: `all(region_2024$months == 12)`,
        failMessage: "Filter the 2024 rows first: `filter(month >= \"2024-01-01\")`, and count them with `months = n()`.",
      },
      {
        name: "Totals and averages are correct",
        check: `{ s <- read.csv("data/sales.csv"); s <- s[substr(s$month, 1, 4) == "2024", ]; tot <- tapply(s$revenue, s$region, sum); avg <- tapply(s$units, s$region, mean); isTRUE(all.equal(as.vector(tot[region_2024$region]), region_2024$total_revenue)) && isTRUE(all.equal(as.vector(avg[region_2024$region]), region_2024$avg_units)) }`,
        failMessage: "Use `sum(revenue)` and `mean(units)` inside `summarise()`, after `group_by(region)`.",
      },
      {
        name: "Sorted from the highest total revenue",
        check: `!is.unsorted(rev(region_2024$total_revenue))`,
        failMessage: "Sort with `arrange(desc(total_revenue))`.",
      },
      {
        name: "A plain data frame (not a tibble)",
        check: `identical(class(region_2024), "data.frame")`,
        failMessage: "Add `as.data.frame()` at the end of the pipeline.",
      },
    ],
  },
  {
    id: "m5-tidy-scores",
    title: "Tidy the test scores",
    difficulty: "medium",
    module: 5,
    lesson: "dplyr-and-tidyr-intro",
    concepts: ["pivoting", "tidy-data", "tidyr-helpers", "group-summaries"],
    datasets: ["students"],
    packages: ["dplyr", "tidyr"],
    prompt: `The students data is **wide**: one column per subject. Make it tidy and summarise it.

1. Create \`scores_long\` from \`students\`: keep the columns \`name\`, \`math\`, \`reading\` and \`science\`, pivot the three subject columns into a column \`subject\` and a column \`score\`, and drop the rows where \`score\` is missing.
2. Create \`subject_summary\`: one row per subject with \`best\` = the highest score and \`average\` = the mean score, as a plain data frame. Print it.`,
    starterCode: `library(dplyr)
library(tidyr)
students <- read.csv("data/students.csv")

# 1. Long format without missing scores
scores_long <- students |>
  select(name, math, reading, science)

# 2. One row per subject with best and average
`,
    expected: "`scores_long` has 177 rows (180 minus 3 missing science scores) and the columns `name`, `subject`, `score`. `subject_summary` has three rows; reading has the highest average (77.95).",
    hints: [
      "Add `pivot_longer(cols = c(math, reading, science), names_to = \"subject\", values_to = \"score\")` to the pipeline, then `drop_na(score)`.",
      "For the summary: `scores_long |> group_by(subject) |> summarise(best = max(score), average = mean(score))`.",
      "Do not forget `|> as.data.frame()` at the end of the summary, and print `subject_summary`.",
    ],
    solution: `library(dplyr)
library(tidyr)
students <- read.csv("data/students.csv")

scores_long <- students |>
  select(name, math, reading, science) |>
  pivot_longer(cols = c(math, reading, science),
               names_to = "subject", values_to = "score") |>
  drop_na(score)

subject_summary <- scores_long |>
  group_by(subject) |>
  summarise(best = max(score), average = mean(score)) |>
  as.data.frame()

subject_summary`,
    explanation: `- \`select()\` keeps the name and the three score columns.
- \`pivot_longer()\` turns the 3 subject columns into rows: 60 × 3 = 180 rows with the columns \`name\`, \`subject\` and \`score\`.
- \`drop_na(score)\` removes the 3 rows whose science score is missing, leaving 177.
- In tidy form, \`subject\` is a normal column, so \`group_by(subject)\` + \`summarise()\` give the best and average score of every subject in one go. Because the NAs were already dropped, no \`na.rm = TRUE\` is needed.`,
    tests: [
      {
        name: "`scores_long` has the columns name, subject and score",
        check: `all(c("name", "subject", "score") %in% names(scores_long)) && ncol(scores_long) == 3`,
        failMessage: "Use `pivot_longer()` with `names_to = \"subject\"` and `values_to = \"score\"` after selecting the four columns.",
      },
      {
        name: "No missing scores (177 rows)",
        check: `nrow(scores_long) == 177 && !anyNA(scores_long$score)`,
        failMessage: "Pivot all three subjects, then remove missing scores with `drop_na(score)`.",
      },
      {
        name: "`subject_summary` has the correct best and average per subject",
        check: `{ ss <- subject_summary[order(subject_summary$subject), ]; is.data.frame(subject_summary) && identical(ss$subject, c("math", "reading", "science")) && isTRUE(all.equal(ss$best, c(99, 100, 100))) && isTRUE(all.equal(ss$average, c(74.65, 77.95, 74.298246), tolerance = 1e-6)) }`,
        failMessage: "Group by `subject` and summarise with `best = max(score)` and `average = mean(score)`.",
      },
    ],
  },
];
