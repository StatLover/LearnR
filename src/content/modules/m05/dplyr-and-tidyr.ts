import type { Lesson } from "../../types";

export const dplyrAndTidyrLesson: Lesson = {
  id: "dplyr-and-tidyr-intro",
  module: 5,
  title: "Introduction to dplyr and tidyr",
  summary: "Filter, select, sort, create and summarise columns with dplyr's verbs, chain them with the pipe |>, and reshape data with tidyr.",
  minutes: 50,
  objectives: [
    "Load a package with `library()` and explain what dplyr and tidyr are for",
    "Use the dplyr verbs `filter()`, `select()`, `arrange()`, `desc()`, `mutate()` and `summarise()`",
    "Chain several steps with the pipe `|>` (and recognise `%>%`, which means the same)",
    "Calculate summaries per group with `group_by()`, `summarise()` and `n()`",
    "Explain what tidy data is and reshape tables with `pivot_longer()` and `pivot_wider()`",
    "Handle missing values and combined columns with `drop_na()`, `replace_na()` and `separate()`",
  ],
  intro: `In the previous lessons you filtered, sorted and cleaned data with base R. It works, but the code can get hard to read: \`students[order(students$math, decreasing = TRUE), c("name", "math")]\` packs a lot into one line.

**dplyr** is a package that gives each of these jobs a short, plain-English **verb**: \`filter()\` rows, \`select()\` columns, \`arrange()\` rows, \`mutate()\` new columns and \`summarise()\` many values into one. Together with the **pipe** \`|>\`, you can write an analysis as a list of steps that reads almost like a sentence: *take the students, then keep class B, then sort by math*.

**tidyr** is its partner package for changing the *shape* of a table – for example turning one column per subject into one row per subject – and for tidying up missing values. Both belong to the **tidyverse**, a family of packages designed to work together.`,
  sections: [
    {
      id: "packages",
      title: "Packages: loading dplyr and tidyr",
      blocks: [
        {
          kind: "definition",
          term: "Package",
          md: "A **package** is a bundle of extra functions (and sometimes data) that someone wrote and shared, so you do not have to write them yourself. R comes with a few packages built in; thousands more can be installed. `library(dplyr)` *loads* the dplyr package, which makes its functions available in your session.",
        },
        {
          kind: "text",
          md: "Using a package takes two steps:\n\n1. **Install** it once on your computer: `install.packages(\"dplyr\")`. This downloads it from CRAN, R's official package library.\n2. **Load** it in every session (every script) that uses it: `library(dplyr)`.\n\nOn R Academy you can skip step 1: the first time you run `library(dplyr)`, the site installs the package for you automatically (this can take a few seconds). In RStudio on your own computer, you run `install.packages()` yourself, once.",
        },
        {
          kind: "callout",
          tone: "info",
          title: "Start-up messages are normal",
          md: "When dplyr loads, R may print a note such as *Attaching package: 'dplyr' – The following objects are masked from 'package:stats': filter, lag*. It means dplyr has its own `filter()` that now takes priority over a different `filter()` built into R. It is not an error.",
        },
        {
          kind: "table",
          caption: "The verbs you will learn in this lesson",
          headers: ["Package", "Function", "What it does", "Base R idea it replaces"],
          rows: [
            ["dplyr", "`filter()`", "keep rows that meet conditions", "`df[condition, ]`, `subset()`"],
            ["dplyr", "`select()`", "keep (or drop) columns", "`df[, c(\"a\", \"b\")]`"],
            ["dplyr", "`arrange()`", "sort rows (`desc()` for largest first)", "`df[order(df$x), ]`"],
            ["dplyr", "`mutate()`", "add or change columns", "`df$new <- ...`"],
            ["dplyr", "`summarise()`", "reduce many rows to summary values", "`mean()`, `max()` …"],
            ["dplyr", "`group_by()`", "do the next step separately for each group", "–"],
            ["tidyr", "`pivot_longer()` / `pivot_wider()`", "reshape between wide and long", "–"],
            ["tidyr", "`drop_na()` / `replace_na()`", "remove or fill missing values", "`na.omit()`, `x[is.na(x)] <- v`"],
            ["tidyr", "`separate()`", "split one text column into several", "–"],
          ],
        },
      ],
    },
    {
      id: "filter-select",
      title: "filter() rows and select() columns",
      blocks: [
        {
          kind: "text",
          md: "Every dplyr verb works the same way: the **first argument is the data frame**, the next arguments say what to do, and the result is a **new data frame**. Inside the verb you write column names directly, without `students$` – just like in `subset()`.",
        },
        {
          kind: "code",
          example: {
            id: "dplyr-filter-select",
            title: "Students above 90 in math",
            code: `library(dplyr)
students <- read.csv("data/students.csv")

top <- filter(students, math > 90)
select(top, name, class, math)`,
            explanation: [
              { code: "library(dplyr)", text: "Loads dplyr so that `filter()` and `select()` are available." },
              { code: "filter(students, math > 90)", text: "Keeps the rows where `math > 90` is TRUE. Rows where the condition is NA are dropped automatically." },
              { code: "select(top, name, class, math)", text: "Keeps three columns of `top`, in this order. Column names are written without quotes." },
            ],
            output: `    name class math
1  Chloe     B   99
2   Noah     B   98
3   Umar     C   93
4 Bianca     B   95
5   Yara     A   93
6   Zane     A   94`,
            outputNote: "The same six students you found with square brackets in the filtering lesson. One difference: dplyr numbers the rows of the result 1 to 6 instead of keeping the original row numbers.",
            tryIt: "Change `math > 90` to `reading >= 95`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "dplyr-filter-many",
            title: "Several conditions and handy ways to select",
            code: `library(dplyr)
students <- read.csv("data/students.csv")

nrow(filter(students, class == "B", study_hours > 12))
nrow(filter(students, class == "B" | study_hours > 12))

names(select(students, name, math:science))
names(select(students, -student_id, -age))`,
            explanation: [
              { code: `filter(students, class == "B", study_hours > 12)`, text: "Conditions separated by commas must **all** be TRUE – a comma means *and* (the same as `&`)." },
              { code: `filter(students, class == "B" | study_hours > 12)`, text: "For *or*, use `|` as before." },
              { code: "select(students, name, math:science)", text: "`math:science` means *all columns from `math` to `science`*: math, reading and science." },
              { code: "select(students, -student_id, -age)", text: "A minus sign drops a column and keeps the rest." },
            ],
            output: `[1] 5
[1] 28
[1] "name"    "math"    "reading" "science"
[1] "name"        "gender"      "class"       "study_hours" "attendance"
[6] "math"        "reading"     "science"    `,
            outputNote: "Five class B students study more than 12 hours; 28 students are in class B *or* study more than 12 hours.",
          },
        },
      ],
    },
    {
      id: "arrange-mutate",
      title: "arrange() rows and mutate() new columns",
      blocks: [
        {
          kind: "code",
          example: {
            id: "dplyr-arrange",
            title: "Sort with arrange() and desc()",
            code: `library(dplyr)
students <- read.csv("data/students.csv")

ranked <- arrange(students, desc(math))
head(select(ranked, name, math), 3)

by_class <- arrange(students, class, desc(reading))
head(select(by_class, name, class, reading), 3)`,
            explanation: [
              { code: "arrange(students, desc(math))", text: "Sorts the rows by `math`. `desc()` (*descending*) puts the largest first; without it, `arrange()` sorts from smallest to largest." },
              { code: "head(select(ranked, name, math), 3)", text: "Selects two columns and shows the first three rows. Functions inside functions run from the inside out." },
              { code: "arrange(students, class, desc(reading))", text: "Sort by `class` first; within each class, by reading score from highest to lowest." },
            ],
            output: `    name math
1  Chloe   99
2   Noah   98
3 Bianca   95
    name class reading
1   Yara     A      98
2   Zane     A      96
3 Fatima     A      90`,
            outputNote: "The same ranking as with `order()`, in much more readable code. `desc()` also works for text columns.",
          },
        },
        {
          kind: "code",
          example: {
            id: "dplyr-mutate",
            title: "Create new columns with mutate()",
            code: `library(dplyr)
students <- read.csv("data/students.csv")

students <- mutate(students,
                   average = (math + reading) / 2,
                   passed = average >= 70)
head(select(students, name, math, reading, average, passed), 4)`,
            explanation: [
              { code: "mutate(students, average = (math + reading) / 2, ...)", text: "`mutate()` adds a new column. On the left of `=` is the new column's name, on the right how to calculate it, row by row." },
              { code: "passed = average >= 70", text: "A second new column in the same call. It can already use `average`, created just before it. The result is TRUE/FALSE." },
              { code: "students <- mutate(...)", text: "dplyr never changes your data in place: to keep the new columns, store the result – here back into `students`." },
            ],
            output: `    name math reading average passed
1  Amara   86      82    84.0   TRUE
2    Ben   54      53    53.5  FALSE
3  Chloe   99      99    99.0   TRUE
4 Daniel   68      62    65.0  FALSE`,
            outputNote: "Amara's average is (86 + 82) / 2 = 84, so she passed. If you give `mutate()` the name of an existing column, it replaces that column instead – useful for cleaning, e.g. `mutate(df, city = tolower(city))`.",
            tryIt: "Add a third column `grade = ifelse(average >= 85, \"A\", \"other\")`.",
          },
        },
      ],
    },
    {
      id: "pipe",
      title: "The pipe |>: one step after another",
      blocks: [
        {
          kind: "text",
          md: "Real questions need several steps. You could save every step in a variable, or nest the functions inside each other – but nested code must be read from the inside out:\n\n`arrange(select(filter(students, class == \"B\", study_hours > 12), name, study_hours, math), desc(math))`\n\nThe **pipe** `|>` solves this. It takes the result on its left and passes it as the **first argument** to the function on its right. So `students |> filter(class == \"B\")` means exactly `filter(students, class == \"B\")`. Read `|>` aloud as **\"and then\"**.",
        },
        {
          kind: "diagram",
          name: "pipe",
          caption: "data |> step1() |> step2(): each step receives the result of the previous one.",
        },
        {
          kind: "code",
          example: {
            id: "pipe-chain",
            title: "A three-step pipeline",
            code: `library(dplyr)
students <- read.csv("data/students.csv")

students |>
  filter(class == "B", study_hours > 12) |>
  select(name, study_hours, math) |>
  arrange(desc(math))`,
            explanation: [
              { code: "students |>", text: "Start with the students data, *and then*…" },
              { code: `filter(class == "B", study_hours > 12) |>`, text: "…keep class B students who study more than 12 hours. The data frame is passed in automatically, so you no longer write it as the first argument. *And then*…" },
              { code: "select(name, study_hours, math) |>", text: "…keep three columns, *and then*…" },
              { code: "arrange(desc(math))", text: "…sort by math, highest first. The final result is printed because it is not stored." },
            ],
            output: `    name study_hours math
1   Noah          20   98
2 Bianca          13   95
3  Aiden          14   85
4 Ximena          15   81
5  Quinn          13   72`,
            outputNote: "The same result as the nested version, but each line is one step you can read from top to bottom. Put `|>` at the **end** of a line, so R knows the code continues on the next line.",
            tryIt: "Add one more step at the end: `|> head(3)`. Remember to put the `|>` at the end of the `arrange()` line.",
          },
        },
        {
          kind: "code",
          example: {
            id: "magrittr-pipe",
            title: "%>% means the same",
            code: `library(dplyr)
students <- read.csv("data/students.csv")

students %>%
  filter(math > 95) %>%
  select(name, math)`,
            explanation: [
              { code: "%>%", text: "The older pipe from the *magrittr* package (loaded with dplyr). For everyday use, `%>%` and `|>` do the same thing." },
            ],
            output: `   name math
1 Chloe   99
2  Noah   98`,
            outputNote: "You will meet `%>%` in many books, blog posts and answers online. `|>` is built into R itself (since version 4.1), so it works even without loading a package. This course uses `|>`.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m5-dplyr-q-inline1",
            type: "multiple-choice",
            prompt: "Which line means exactly the same as `arrange(students, age)`?",
            options: [
              "`students |> arrange(age)`",
              "`age |> arrange(students)`",
              "`arrange |> students(age)`",
              "`students |> arrange(students, age)`",
            ],
            answer: 0,
            optionFeedback: [
              "Correct – the pipe puts `students` into the first argument of `arrange()`.",
              "The pipe passes the *left* side as the first argument, so this would sort `age` by `students`.",
              "The left side of a pipe must be a value, and the right side a function call.",
              "This passes `students` twice: `arrange(students, students, age)`.",
            ],
            explanation: "`x |> f(y)` is the same as `f(x, y)`. With the pipe, you leave out the data frame inside the function call.",
            concept: "pipe",
          },
        },
      ],
    },
    {
      id: "summarise-group-by",
      title: "summarise(), group_by() and n()",
      blocks: [
        {
          kind: "text",
          md: "`summarise()` (also spelled `summarize()`) turns many rows into **one row of summary values**. On its own it summarises the whole table. Combined with `group_by()`, it calculates the summary **separately for each group** – the average per class, the total per region. `n()` is a small helper that counts the rows (in each group).",
        },
        {
          kind: "code",
          example: {
            id: "summarise-all",
            title: "One summary for the whole table",
            code: `library(dplyr)
students <- read.csv("data/students.csv")

students |>
  summarise(n_students = n(), avg_math = mean(math), best_math = max(math))`,
            explanation: [
              { code: "summarise(n_students = n(), ...)", text: "Each argument creates one summary column: a name, `=`, and a calculation. `n()` counts the rows." },
              { code: "avg_math = mean(math), best_math = max(math)", text: "Any function that turns a column into one number works: `mean()`, `median()`, `max()`, `min()`, `sum()`, `sd()` …" },
            ],
            output: `  n_students avg_math best_math
1         60    74.65        99`,
            outputNote: "A one-row data frame: 60 students, an average math score of 74.65 and a best score of 99.",
          },
        },
        {
          kind: "code",
          example: {
            id: "group-by-class",
            title: "Summaries per group",
            code: `library(dplyr)
students <- read.csv("data/students.csv")

students |>
  group_by(class) |>
  summarise(n_students = n(), avg_math = mean(math)) |>
  as.data.frame()`,
            explanation: [
              { code: "group_by(class)", text: "Splits the data into groups, one per class. Nothing visible changes yet – the next verb will work group by group." },
              { code: "summarise(n_students = n(), avg_math = mean(math))", text: "Calculates the count and the average **for each class**. The result has one row per group." },
              { code: "as.data.frame()", text: "Turns the result back into a plain data frame so it prints the familiar way (see the note below)." },
            ],
            output: `  class n_students avg_math
1     A         18 74.94444
2     B         22 72.95455
3     C         20 76.25000`,
            outputNote: "Class C has the highest average math score (76.25), class B the lowest (72.95). The counts 18 + 22 + 20 add up to 60.",
            tryIt: "Group by `gender` instead of `class`, or by both: `group_by(class, gender)`.",
          },
        },
        {
          kind: "callout",
          tone: "note",
          title: "Why as.data.frame()?",
          md: "`group_by()` turns your data into a **tibble** – the tidyverse's modern version of a data frame – and `summarise()` returns a tibble too. A tibble prints slightly differently: a header line like `# A tibble: 3 × 3`, the type of each column (`<chr>`, `<dbl>`) and rounded numbers. It works exactly like a data frame. In this course we add `as.data.frame()` at the end so the output looks like the data frames you know.",
        },
        {
          kind: "code",
          example: {
            id: "group-by-sales",
            title: "Total revenue per region, sorted",
            code: `library(dplyr)
sales <- read.csv("data/sales.csv")

sales |>
  group_by(region) |>
  summarise(total_revenue = sum(revenue), avg_units = mean(units)) |>
  arrange(desc(total_revenue)) |>
  as.data.frame()`,
            explanation: [
              { code: "group_by(region)", text: "One group per sales region." },
              { code: "summarise(total_revenue = sum(revenue), avg_units = mean(units))", text: "Adds up the revenue of all 36 months and averages the monthly units, for each region." },
              { code: "arrange(desc(total_revenue))", text: "You can keep piping after `summarise()`: here the regions are sorted from the highest total to the lowest." },
            ],
            output: `  region total_revenue avg_units
1  North      473708.7  536.4167
2  South      445650.1  536.6389
3   West      361711.2  457.8056
4   East      342037.8  364.3333`,
            outputNote: "North earned the most over the three years (about $473,709), East the least.",
          },
        },
        {
          kind: "code",
          example: {
            id: "group-by-na",
            title: "Remember na.rm = TRUE inside summarise()",
            code: `library(dplyr)
survey <- read.csv("data/survey.csv")

survey |>
  group_by(region) |>
  summarise(people = n(),
            avg_hours = mean(hours_online, na.rm = TRUE),
            avg_satisfaction = mean(satisfaction)) |>
  as.data.frame()`,
            explanation: [
              { code: "mean(hours_online, na.rm = TRUE)", text: "`hours_online` has 8 missing values. Without `na.rm = TRUE`, every region containing one would get NA." },
              { code: "avg_satisfaction = mean(satisfaction)", text: "`satisfaction` has no missing values, so no `na.rm` is needed." },
            ],
            output: `  region people avg_hours avg_satisfaction
1   East     47  3.366667         3.319149
2  North     47  3.441304         3.000000
3  South     53  3.255769         2.943396
4   West     53  3.555769         3.452830`,
            outputNote: "Users in the West spend the most time online and are the most satisfied. For counting alone there is a shortcut: `survey |> count(region)` gives the number of rows per region.",
          },
        },
      ],
    },
    {
      id: "tidy-data-and-pivoting",
      title: "Tidy data and reshaping with tidyr",
      blocks: [
        {
          kind: "definition",
          term: "Tidy data",
          md: "Data is **tidy** when **each variable is a column**, **each observation is a row** and **each value has its own cell**. Most R tools – dplyr and ggplot2 included – work best with tidy data.",
        },
        {
          kind: "diagram",
          name: "tidy-data",
          caption: "Tidy data: every column is one variable, every row is one observation.",
        },
        {
          kind: "text",
          md: "The same information can be stored in two shapes:\n\n- **Wide format**: one row per student, one column per subject (`math`, `reading`, `science`). Easy for people to read.\n- **Long format**: one row per student *and subject*, with a column `subject` and a column `score`. Easy for R to group and plot.\n\nIf your question is *\"what is the average score per subject?\"*, the subject is a **variable** – so in tidy form it should be one column. `pivot_longer()` turns wide into long; `pivot_wider()` does the reverse.",
        },
        {
          kind: "diagram",
          name: "pivot",
          caption: "pivot_longer() turns columns into rows; pivot_wider() turns rows into columns.",
        },
        {
          kind: "code",
          example: {
            id: "pivot-longer",
            title: "Wide to long with pivot_longer()",
            code: `library(tidyr)

scores <- data.frame(
  name = c("Amara", "Ben", "Chloe"),
  math = c(86, 54, 99),
  reading = c(82, 53, 99)
)

long <- pivot_longer(scores, cols = c(math, reading),
                     names_to = "subject", values_to = "score")
as.data.frame(long)`,
            explanation: [
              { code: "library(tidyr)", text: "Loads tidyr." },
              { code: "cols = c(math, reading)", text: "The columns to turn into rows." },
              { code: `names_to = "subject"`, text: "The old column **names** (`math`, `reading`) go into a new column called `subject`." },
              { code: `values_to = "score"`, text: "The **values** from those columns go into a new column called `score`." },
              { code: "as.data.frame(long)", text: "`pivot_longer()` returns a tibble; we print it as a plain data frame." },
            ],
            output: `   name subject score
1 Amara    math    86
2 Amara reading    82
3   Ben    math    54
4   Ben reading    53
5 Chloe    math    99
6 Chloe reading    99`,
            outputNote: "3 students × 2 subjects = 6 rows. Each row is now one observation: one student's score in one subject. The `name` column was not listed in `cols`, so it is repeated for each subject.",
          },
        },
        {
          kind: "code",
          example: {
            id: "pivot-wider",
            title: "Long to wide with pivot_wider()",
            code: `library(dplyr)
library(tidyr)
sales <- read.csv("data/sales.csv")

sales |>
  filter(month == "2024-12-01") |>
  select(region, units) |>
  pivot_wider(names_from = region, values_from = units) |>
  as.data.frame()`,
            explanation: [
              { code: `filter(month == "2024-12-01") |> select(region, units)`, text: "The sales file is long: one row per month and region. We keep December 2024 and two columns – four rows." },
              { code: "pivot_wider(names_from = region, values_from = units)", text: "Each value of `region` becomes a new **column name**, and the `units` values fill those columns." },
            ],
            output: `  North South East West
1   629   637  402  402`,
            outputNote: "Four rows became one row with four columns – a compact layout for a report. Use `pivot_wider()` for presenting results, `pivot_longer()` for analysing them.",
          },
        },
        {
          kind: "code",
          example: {
            id: "pivot-then-summarise",
            title: "Long data makes group summaries easy",
            code: `library(dplyr)
library(tidyr)
students <- read.csv("data/students.csv")

students |>
  pivot_longer(cols = c(math, reading, science),
               names_to = "subject", values_to = "score") |>
  group_by(subject) |>
  summarise(avg = mean(score, na.rm = TRUE)) |>
  as.data.frame()`,
            explanation: [
              { code: "pivot_longer(cols = c(math, reading, science), ...)", text: "60 students × 3 subjects = 180 rows with the columns `subject` and `score`." },
              { code: "group_by(subject) |> summarise(avg = mean(score, na.rm = TRUE))", text: "Because subject is now a column, one `group_by()` gives the average for every subject." },
            ],
            output: `  subject      avg
1    math 74.65000
2 reading 77.95000
3 science 74.29825`,
            outputNote: "Students do best in reading on average. With wide data you would need a separate `mean()` for each subject column.",
          },
        },
      ],
    },
    {
      id: "tidyr-helpers",
      title: "drop_na(), replace_na() and separate()",
      blocks: [
        {
          kind: "text",
          md: "tidyr also has pipe-friendly tools for the cleaning jobs from the previous lesson.",
        },
        {
          kind: "code",
          example: {
            id: "drop-na",
            title: "drop_na(): remove rows with missing values",
            code: `library(tidyr)
patients <- read.csv("data/patients.csv")

nrow(drop_na(patients))
nrow(drop_na(patients, cholesterol))`,
            explanation: [
              { code: "drop_na(patients)", text: "Without column names it works like `na.omit()`: rows with an NA anywhere are removed." },
              { code: "drop_na(patients, cholesterol)", text: "With column names, only rows missing **those** columns are removed – usually what you want." },
            ],
            output: `[1] 139
[1] 144`,
            outputNote: "Removing only the 6 rows without cholesterol keeps 144 patients, instead of 139 when every column counts.",
          },
        },
        {
          kind: "code",
          example: {
            id: "replace-na",
            title: "replace_na(): fill in missing values",
            code: `library(tidyr)

df <- data.frame(name = c("Ana", "Ben", "Cy"),
                 score = c(90, NA, 75),
                 group = c("A", NA, "B"))

replace_na(df, list(score = 0, group = "unknown"))`,
            explanation: [
              { code: `list(score = 0, group = "unknown")`, text: "A `list` says which value to use in which column: 0 for missing scores, `\"unknown\"` for missing groups." },
              { code: "replace_na(df, ...)", text: "Returns a copy of `df` with the gaps filled in." },
            ],
            output: `  name score   group
1  Ana    90       A
2  Ben     0 unknown
3   Cy    75       B`,
            outputNote: "Ben's two missing values were filled in. Inside `mutate()` you can also use it on one column: `mutate(df, score = replace_na(score, 0))`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "separate",
            title: "separate(): split one column into several",
            code: `library(dplyr)
library(tidyr)
sales <- read.csv("data/sales.csv")

sales |>
  separate(month, into = c("year", "mon", "day"), sep = "-") |>
  group_by(year) |>
  summarise(revenue = sum(revenue)) |>
  as.data.frame()`,
            explanation: [
              { code: `separate(month, into = c("year", "mon", "day"), sep = "-")`, text: "Splits text like `\"2022-01-01\"` at each `-` into three new columns named `year`, `mon` and `day`. The original `month` column is replaced." },
              { code: "group_by(year) |> summarise(revenue = sum(revenue))", text: "Now we can total the revenue per year." },
            ],
            output: `  year  revenue
1 2022 482892.8
2 2023 537241.8
3 2024 602973.3`,
            outputNote: "Revenue grew every year. The new columns contain text; add `convert = TRUE` to `separate()` if you want them turned into numbers. (Newer tidyr versions also offer `separate_wider_delim()`, which does the same job.)",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Forgetting library(dplyr)",
      wrong: `students <- read.csv("data/students.csv")
filter(students, math > 90)`,
      error: "object 'math' not found",
      why: "Base R has its own, completely different `filter()` (for time series). Without `library(dplyr)`, that one runs and does not know that `math` is a column. Load the package at the top of every script that uses it.",
      right: `library(dplyr)
students <- read.csv("data/students.csv")
filter(students, math > 90)`,
    },
    {
      title: "Using = instead of == in filter()",
      wrong: `library(dplyr)
students <- read.csv("data/students.csv")
filter(students, class = "A")`,
      error: "used `=` instead of `==`",
      why: "`=` names an argument; `==` compares. dplyr notices this common slip and even suggests the fix in its error message.",
      right: `library(dplyr)
students <- read.csv("data/students.csv")
filter(students, class == "A")`,
    },
    {
      title: "Starting a line with the pipe",
      wrong: `library(dplyr)
students <- read.csv("data/students.csv")
students
  |> filter(math > 90)`,
      error: "unexpected '|>'",
      why: "R runs `students` as a complete line, then finds a line that starts with `|>` – which makes no sense on its own. Put the pipe at the **end** of the line so R knows more is coming.",
      right: `library(dplyr)
students <- read.csv("data/students.csv")
students |>
  filter(math > 90)`,
    },
    {
      title: "Forgetting na.rm = TRUE in summarise()",
      wrong: `library(dplyr)
students <- read.csv("data/students.csv")
students |> summarise(avg_science = mean(science))`,
      why: "Three science scores are missing, so `mean()` returns NA. The code runs without an error, so check your summaries for NA.",
      right: `library(dplyr)
students <- read.csv("data/students.csv")
students |> summarise(avg_science = mean(science, na.rm = TRUE))`,
    },
    {
      title: "Expecting dplyr to change the data in place",
      wrong: `library(dplyr)
students <- read.csv("data/students.csv")
students |> filter(math > 95)
nrow(students)`,
      why: "dplyr verbs return a **new** data frame and leave the original alone. The filtered result was printed and then forgotten, so `students` still has 60 rows. Store the result with `<-` if you need it later.",
      right: `library(dplyr)
students <- read.csv("data/students.csv")
best <- students |> filter(math > 95)
nrow(best)`,
    },
  ],
  exerciseIds: ["m5-dplyr-pipeline", "m5-sales-summary", "m5-tidy-scores"],
  quiz: [
    {
      id: "m5-dplyr-q1",
      type: "multiple-choice",
      prompt: "Which dplyr verb keeps only the **rows** that meet a condition?",
      options: ["`select()`", "`filter()`", "`arrange()`", "`mutate()`"],
      answer: 1,
      optionFeedback: [
        "`select()` chooses columns.",
        "Correct.",
        "`arrange()` sorts rows but keeps all of them.",
        "`mutate()` adds or changes columns.",
      ],
      explanation: "`filter()` keeps rows, `select()` keeps columns, `arrange()` sorts and `mutate()` creates columns.",
      concept: "dplyr-verbs",
    },
    {
      id: "m5-dplyr-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `library(dplyr)
df <- data.frame(name = c("A", "B", "C"), score = c(70, 95, 82))
df |> filter(score > 75) |> nrow()`,
      options: ["[1] 1", "[1] 2", "[1] 3", "[1] 75"],
      answer: 1,
      optionFeedback: [
        "Count again: which scores are above 75?",
        "Correct – 95 and 82 are above 75.",
        "70 is not above 75.",
        "`nrow()` counts rows.",
      ],
      explanation: "The pipe passes `df` to `filter()`, which keeps B and C, and the result goes into `nrow()`, which counts 2 rows.",
      concept: "pipe",
    },
    {
      id: "m5-dplyr-q3",
      type: "fill-blank",
      prompt: "Complete the pipeline so it calculates the average math score **per class**.",
      code: `library(dplyr)
students <- read.csv("data/students.csv")
students |>
  group_by(class) |>
  ___(avg_math = mean(math))`,
      accept: ["summarise", "summarize"],
      hint: "Which verb turns many rows into one summary row (per group)?",
      explanation: "`summarise()` (or `summarize()`) reduces each group to one row; `group_by(class)` makes it happen separately for each class.",
      concept: "group-summaries",
    },
    {
      id: "m5-dplyr-q4",
      type: "find-error",
      prompt: "This pipeline stops with an error. Which line contains the mistake?",
      code: `library(dplyr)
students <- read.csv("data/students.csv")
students |>
  filter(gender = "Female") |>
  select(name, reading)`,
      errorLine: 4,
      errorKind: "error",
      fix: `library(dplyr)
students <- read.csv("data/students.csv")
students |>
  filter(gender == "Female") |>
  select(name, reading)`,
      explanation: "Inside `filter()` you compare with `==`. A single `=` looks like naming an argument, so dplyr stops and suggests `gender == \"Female\"`.",
      concept: "dplyr-verbs",
    },
    {
      id: "m5-dplyr-q5",
      type: "true-false",
      prompt: "`students %>% filter(math > 90)` and `students |> filter(math > 90)` give the same result.",
      answer: true,
      explanation: "Both pipes pass `students` as the first argument of `filter()`. `%>%` comes from the magrittr package (loaded with dplyr); `|>` is built into R.",
      concept: "pipe",
    },
    {
      id: "m5-dplyr-q6",
      type: "predict-output",
      prompt: "How many rows does `long` have?",
      code: `library(tidyr)
df <- data.frame(id = 1:2, a = c(5, 6), b = c(7, 8))
long <- pivot_longer(df, cols = c(a, b), names_to = "key", values_to = "value")
nrow(long)`,
      options: ["[1] 2", "[1] 3", "[1] 4", "[1] 6"],
      answer: 2,
      optionFeedback: [
        "That is the number of rows *before* pivoting.",
        "Each id gets one row per pivoted column.",
        "Correct – 2 ids × 2 columns (a and b) = 4 rows.",
        "Only the columns `a` and `b` are pivoted; `id` stays a column.",
      ],
      explanation: "`pivot_longer()` creates one row for every combination of an original row and a pivoted column: 2 × 2 = 4 rows, with the columns `id`, `key` and `value`.",
      concept: "pivoting",
    },
  ],
  keyPoints: [
    "Install a package once with `install.packages()` (automatic on R Academy) and load it in every script with `library()`.",
    "dplyr verbs take a data frame first and return a new one: `filter()` rows, `select()` columns, `arrange()` (with `desc()`) to sort, `mutate()` to add columns.",
    "The pipe `|>` passes the result on its left into the first argument of the function on its right – read it as \"and then\". `%>%` does the same.",
    "`group_by()` + `summarise()` calculate summaries per group; `n()` counts rows; remember `na.rm = TRUE`.",
    "Tidy data has one variable per column and one observation per row; `pivot_longer()` makes wide data long and `pivot_wider()` makes long data wide.",
    "`drop_na()`, `replace_na()` and `separate()` handle missing values and split combined columns in a pipeline.",
  ],
  concepts: ["dplyr-verbs", "pipe", "group-summaries", "tidy-data", "pivoting", "tidyr-helpers"],
  glossary: ["package", "library", "tidyverse", "dplyr", "tidyr", "pipe", "tibble", "tidy-data", "long-format", "wide-format"],
  datasets: ["students", "sales", "survey", "patients"],
  packages: ["dplyr", "tidyr"],
  prerequisites: ["missing-data-and-cleaning"],
  playground: `library(dplyr)

students <- read.csv("data/students.csv")

students |>
  filter(attendance >= 90) |>
  group_by(class) |>
  summarise(n = n(), avg_math = mean(math)) |>
  as.data.frame()`,
};
