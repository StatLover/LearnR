import type { Lesson } from "../../types";

export const applyFamilyLesson: Lesson = {
  id: "apply-family-and-data-transformations",
  module: 8,
  title: "The Apply Family and Data Transformations",
  summary:
    "Apply a function to every element, column, row or group with lapply(), sapply(), vapply(), apply(), tapply() and mapply(), then reshape and enrich data with cut(), ifelse(), merge() and aggregate().",
  minutes: 50,
  objectives: [
    "Use `sapply()` and `lapply()` to apply a function to every element of a vector, list or data frame, instead of writing a `for` loop.",
    "Choose between `lapply()`, `sapply()` and `vapply()` depending on the result you want.",
    "Summarise the rows or columns of a matrix with `apply()` and groups of values with `tapply()`.",
    "Use `mapply()` to walk through two vectors at the same time.",
    "Create new categories with `ifelse()`, `cut()` and dplyr's `case_when()`.",
    "Combine tables with `merge()`, summarise groups with `aggregate()` and add columns with `transform()`.",
    "Recall when to reshape data between wide and long formats.",
  ],
  intro: `Data analysis is full of "do the same thing to every …" tasks: compute the mean of **every column**, the total of **every row**, the average score of **every class**. In Stage 1 you solved such tasks with a \`for\` loop. That works, but R has a shorter and less error-prone way: the **apply family** of functions.

Each member of the family takes some data and a function, applies the function to every piece of the data, and collects the results for you. You only describe *what* to do with one piece – R handles the repetition.

In the second half of the lesson you will use these ideas, together with a few classic base-R helpers, to **transform data**: turn numbers into categories, join two tables, summarise groups and reshape tables.`,
  sections: [
    {
      id: "loop-vs-apply",
      title: "From for loops to the apply family",
      blocks: [
        {
          kind: "text",
          md: "Imagine you want the average of each test score column in `students.csv`. Here is the `for` loop way you already know:",
        },
        {
          kind: "code",
          example: {
            id: "loop-column-means",
            title: "Column means with a for loop",
            code: `students <- read.csv("data/students.csv")
scores <- students[, c("math", "reading", "science")]

averages <- c()
for (col in names(scores)) {
  averages[col] <- mean(scores[[col]], na.rm = TRUE)
}
averages`,
            explanation: [
              { code: `scores <- students[, c("math", "reading", "science")]`, text: "Keeps only the three score columns." },
              { code: `averages <- c()`, text: "Creates an empty vector to collect the results – with a loop you must prepare the container yourself." },
              { code: `for (col in names(scores)) {`, text: "Goes through the column names one at a time: `\"math\"`, then `\"reading\"`, then `\"science\"`." },
              { code: `  averages[col] <- mean(scores[[col]], na.rm = TRUE)`, text: "`scores[[col]]` pulls out one column as a vector. Its mean is stored in `averages` under the column's name. `na.rm = TRUE` skips the missing science scores." },
            ],
            output: String.raw`    math  reading  science
74.65000 77.95000 74.29825`,
          },
        },
        {
          kind: "text",
          md: "Now the same task with `sapply()`, one member of the apply family:",
        },
        {
          kind: "code",
          example: {
            id: "sapply-column-means",
            title: "The same result in one line",
            code: `students <- read.csv("data/students.csv")
scores <- students[, c("math", "reading", "science")]

sapply(scores, mean, na.rm = TRUE)`,
            explanation: [
              { code: `sapply(scores, mean, na.rm = TRUE)`, text: "Read it as: \"for each column of `scores`, apply `mean`\". A data frame is a list of columns, so `sapply()` visits one column at a time. Extra arguments (`na.rm = TRUE`) are passed on to `mean()` through `...` – exactly as you learned in the previous lesson." },
            ],
            output: String.raw`    math  reading  science
74.65000 77.95000 74.29825`,
            outputNote: "Identical to the loop: a *named* vector with one average per column. `sapply()` created the result and the names automatically.",
            tryIt: "Replace `mean` with `max`, or with `\\(x) sum(is.na(x))` to count the missing values in each column.",
          },
        },
        { kind: "diagram", name: "apply-family", caption: "The apply family: take each piece of the data, apply the same function, collect the results." },
        {
          kind: "definition",
          term: "Apply family",
          md: "A group of base-R functions – `lapply()`, `sapply()`, `vapply()`, `apply()`, `tapply()` and `mapply()` – that apply a function to every element, row, column or group of some data and collect the results.",
        },
        {
          kind: "table",
          caption: "for loop or apply function?",
          headers: ["", "for loop", "apply family"],
          rows: [
            ["Result container", "You create it and fill it yourself", "Created automatically"],
            ["Length of code", "Several lines", "Usually one line"],
            ["Best for", "Steps that depend on the previous step (e.g. running totals), printing progress", "Doing the same independent calculation on every piece"],
            ["Typical bugs", "Forgetting to create the container, off-by-one indexes", "Choosing the wrong output shape (lists vs vectors)"],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Is apply faster than a loop?",
          md: "Usually not by much – the main benefit is *clearer* code. For simple arithmetic on whole vectors, plain vectorised code such as `prices * 1.2` is faster and simpler than both.",
        },
      ],
    },
    {
      id: "lapply-sapply",
      title: "lapply() and sapply()",
      blocks: [
        {
          kind: "text",
          md: `* \`lapply(x, f)\` applies \`f\` to each element of \`x\` and **always returns a list** (the "l" stands for *list*).
* \`sapply(x, f)\` does the same, then tries to **simplify** the result – to a vector when every answer is a single value, or to a matrix when every answer has the same length.`,
        },
        {
          kind: "code",
          example: {
            id: "lapply-list",
            title: "lapply() always gives back a list",
            code: `temps <- list(
  monday = c(18, 21, 19),
  tuesday = c(22, 25),
  wednesday = c(17, 16, 20, 18)
)

lapply(temps, mean)`,
            explanation: [
              { code: `temps <- list(`, text: "A list of three numeric vectors of *different* lengths – a typical situation where a data frame would not fit." },
              { code: `lapply(temps, mean)`, text: "Calls `mean(temps$monday)`, `mean(temps$tuesday)` and `mean(temps$wednesday)`, and returns the three answers in a list with the same names." },
            ],
            output: String.raw`$monday
[1] 19.33333

$tuesday
[1] 23.5

$wednesday
[1] 17.75`,
          },
        },
        {
          kind: "code",
          example: {
            id: "sapply-simplify",
            title: "sapply() simplifies when it can",
            code: String.raw`temps <- list(
  monday = c(18, 21, 19),
  tuesday = c(22, 25),
  wednesday = c(17, 16, 20, 18)
)

sapply(temps, mean)
sapply(temps, length)
sapply(temps, \(x) max(x) - min(x))
sapply(temps, range)`,
            explanation: [
              { code: `sapply(temps, mean)`, text: "Each mean is one number, so the result is simplified to a named numeric vector." },
              { code: `sapply(temps, length)`, text: "Any function works – here the number of readings per day." },
              { code: String.raw`sapply(temps, \(x) max(x) - min(x))`, text: "An anonymous function computes the temperature spread of each day." },
              { code: `sapply(temps, range)`, text: "`range()` returns two numbers (min and max), so `sapply()` arranges the answers as a matrix: one **column** per day, one row per returned value." },
            ],
            output: String.raw`   monday   tuesday wednesday
 19.33333  23.50000  17.75000
   monday   tuesday wednesday
        3         2         4
   monday   tuesday wednesday
        3         3         4
     monday tuesday wednesday
[1,]     18      22        16
[2,]     21      25        20`,
            outputNote: "The last result is a 2-row matrix: row `[1,]` holds each day's minimum and row `[2,]` its maximum.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m8-apply-q1",
            type: "predict-output",
            prompt: "What does this print?",
            code: `sapply(list(a = 1:3, b = 4:6), sum)`,
            options: [" a  b \n 6 15 ", "$a\n[1] 6\n\n$b\n[1] 15", "[1] 21", " a  b \n 3  3 "],
            answer: 0,
            optionFeedback: [
              "Correct – one sum per element, simplified to a named vector.",
              "That is what `lapply()` would print. `sapply()` simplifies single values into a vector.",
              "`sapply()` works element by element; it does not add everything together.",
              "That would be `length`, not `sum`.",
            ],
            explanation: "`sapply()` computes `sum(1:3)` = 6 and `sum(4:6)` = 15, keeps the names `a` and `b`, and simplifies the two single numbers into a named vector.",
            concept: "lapply-sapply",
          },
        },
      ],
    },
    {
      id: "vapply-mapply",
      title: "vapply() for safety and mapply() for two inputs",
      blocks: [
        {
          kind: "text",
          md: `\`sapply()\` is convenient, but its result shape depends on the data: sometimes a vector, sometimes a matrix, sometimes a list. In code that must be reliable, use \`vapply()\`. You tell it **what each answer must look like** with \`FUN.VALUE\`, for example \`numeric(1)\` = "one number". If any answer does not match, \`vapply()\` stops with an error instead of quietly returning something unexpected.`,
        },
        {
          kind: "code",
          example: {
            id: "vapply-check",
            title: "vapply() checks every answer",
            code: `temps <- list(monday = c(18, 21, 19), tuesday = c(22, 25))

vapply(temps, mean, FUN.VALUE = numeric(1))
vapply(temps, range, FUN.VALUE = numeric(1))`,
            explanation: [
              { code: `vapply(temps, mean, FUN.VALUE = numeric(1))`, text: "Each mean is one number, matching `numeric(1)`, so we get a named numeric vector – the same as `sapply()`." },
              { code: `vapply(temps, range, FUN.VALUE = numeric(1))`, text: "`range()` returns *two* numbers, which breaks the promise \"one number per element\". `vapply()` stops and explains why." },
            ],
            output: String.raw`  monday  tuesday
19.33333 23.50000
Error in vapply(temps, range, FUN.VALUE = numeric(1)) : values must be length 1,
 but FUN(X[[1]]) result is length 2`,
            expectError: true,
            outputNote: "The error says each value must have length 1, but the result for the first element (`FUN(X[[1]])`) has length 2. Use `FUN.VALUE = numeric(2)` if two numbers are what you really want.",
          },
        },
        {
          kind: "text",
          md: "`mapply()` (*multivariate* apply) walks through **two or more vectors in parallel**: the first elements together, then the second elements, and so on.",
        },
        {
          kind: "code",
          example: {
            id: "mapply-basic",
            title: "mapply() works through several vectors together",
            code: `prices <- c(2.5, 4, 10)
quantities <- c(4, 3, 2)

mapply(function(price, qty) price * qty, prices, quantities)
mapply(rep, c("a", "b", "c"), 3:1)`,
            explanation: [
              { code: `mapply(function(price, qty) price * qty, prices, quantities)`, text: "Calls the function three times: with (2.5, 4), then (4, 3), then (10, 2)." },
              { code: `mapply(rep, c("a", "b", "c"), 3:1)`, text: "Calls `rep(\"a\", 3)`, `rep(\"b\", 2)` and `rep(\"c\", 1)`. The answers have different lengths, so the result is a list (named after the first vector)." },
            ],
            output: String.raw`[1] 10 12 20
$a
[1] "a" "a" "a"

$b
[1] "b" "b"

$c
[1] "c"`,
            outputNote: "For simple arithmetic like the first line, the vectorised `prices * quantities` gives the same `10 12 20` more simply. `mapply()` is useful when the function itself does not work on whole vectors, as with `rep()` here.",
          },
        },
      ],
    },
    {
      id: "apply-tapply",
      title: "apply() for rows and columns, tapply() for groups",
      blocks: [
        {
          kind: "text",
          md: "`apply(m, MARGIN, f)` works on a **matrix** (or a data frame with only numbers). `MARGIN = 1` means \"apply `f` to each **row**\", `MARGIN = 2` means \"to each **column**\". A memory aid: rows come first in `m[row, column]`, so rows are 1 and columns are 2.",
        },
        { kind: "diagram", name: "matrix", caption: "A matrix is a grid addressed as [row, column]. MARGIN = 1 works along rows, MARGIN = 2 along columns." },
        {
          kind: "code",
          example: {
            id: "apply-matrix",
            title: "Row and column summaries",
            code: `sales <- matrix(
  c(12, 15, 9, 20, 18, 11),
  nrow = 2,
  byrow = TRUE,
  dimnames = list(c("shop_a", "shop_b"), c("jan", "feb", "mar"))
)

sales
apply(sales, 1, sum)
apply(sales, 2, mean)`,
            explanation: [
              { code: `sales <- matrix(`, text: "Builds a 2 × 3 matrix: two shops (rows) and three months (columns). `byrow = TRUE` fills the numbers row by row; `dimnames` names the rows and columns." },
              { code: `apply(sales, 1, sum)`, text: "`MARGIN = 1`: sums each row, i.e. the total sales of each shop." },
              { code: `apply(sales, 2, mean)`, text: "`MARGIN = 2`: averages each column, i.e. the mean sales per month across both shops." },
            ],
            output: String.raw`       jan feb mar
shop_a  12  15   9
shop_b  20  18  11
shop_a shop_b
    36     49
 jan  feb  mar
16.0 16.5 10.0`,
            outputNote: "Shop A sold 12 + 15 + 9 = 36 units and shop B 49. The column means are the averages of each month's two values. For sums and means, the shortcuts `rowSums()`, `colSums()`, `rowMeans()` and `colMeans()` give the same results.",
          },
        },
        {
          kind: "text",
          md: "`tapply(values, groups, f)` splits `values` into **groups** and applies `f` to each group. It answers questions like \"what is the average math score *in each class*?\"",
        },
        {
          kind: "code",
          example: {
            id: "tapply-groups",
            title: "Group summaries with tapply()",
            code: `students <- read.csv("data/students.csv")

tapply(students$math, students$class, mean)
round(tapply(students$math, students$gender, mean), 1)
tapply(students$math, list(students$class, students$gender), max)`,
            explanation: [
              { code: `tapply(students$math, students$class, mean)`, text: "Splits the math scores by class (A, B, C) and computes the mean of each group." },
              { code: `round(tapply(students$math, students$gender, mean), 1)`, text: "The same idea grouped by gender, rounded to one decimal place." },
              { code: `tapply(students$math, list(students$class, students$gender), max)`, text: "With a `list()` of two grouping variables you get a table: one row per class, one column per gender, holding the best math score of each combination." },
            ],
            output: String.raw`       A        B        C
74.94444 72.95455 76.25000
Female   Male
  76.6   72.6
  Female Male
A     93   94
B     99   98
C     90   93`,
            tryIt: "Change `mean` to `length` to count how many students are in each group.",
          },
        },
        {
          kind: "table",
          caption: "Which apply function?",
          headers: ["Function", "Works on", "Returns", "Example"],
          rows: [
            ["`lapply()`", "each element of a vector or list (or each column of a data frame)", "always a list", "`lapply(temps, mean)`"],
            ["`sapply()`", "same as `lapply()`", "a vector or matrix if possible", "`sapply(scores, mean)`"],
            ["`vapply()`", "same as `lapply()`", "exactly the type you promise in `FUN.VALUE`", "`vapply(temps, mean, numeric(1))`"],
            ["`apply()`", "rows (1) or columns (2) of a matrix", "a vector or matrix", "`apply(sales, 1, sum)`"],
            ["`tapply()`", "groups of a vector", "one result per group", "`tapply(math, class, mean)`"],
            ["`mapply()`", "several vectors in parallel", "a vector or list", "`mapply(rep, x, times)`"],
          ],
        },
      ],
    },
    {
      id: "categorise",
      title: "Creating categories with ifelse(), cut() and case_when()",
      blocks: [
        {
          kind: "text",
          md: "A common transformation is turning a number into a **category**: pass/fail, age groups, low/medium/high. Categories make tables and charts easier to read.",
        },
        {
          kind: "code",
          example: {
            id: "ifelse-two-groups",
            title: "Two categories with ifelse()",
            code: `students <- read.csv("data/students.csv")

students$result <- ifelse(students$math >= 60, "pass", "fail")
head(students[, c("name", "math", "result")], 4)
table(students$result)`,
            explanation: [
              { code: `students$result <- ifelse(students$math >= 60, "pass", "fail")`, text: "`ifelse(test, yes, no)` works on the whole column at once: where the test is `TRUE` it gives `\"pass\"`, otherwise `\"fail\"`. The answers are stored in a new column, `result`." },
              { code: `head(students[, c("name", "math", "result")], 4)`, text: "Shows the first four students to check the new column." },
              { code: `table(students$result)`, text: "Counts how many students are in each category." },
            ],
            output: String.raw`    name math result
1  Amara   86   pass
2    Ben   54   fail
3  Chloe   99   pass
4 Daniel   68   pass

fail pass
   8   52`,
          },
        },
        {
          kind: "text",
          md: "For **more than two categories based on number ranges**, use `cut()`. You give it the `breaks` (the boundaries) and optional `labels`. By default each interval includes its right end but not its left end: `(59, 69]` means \"more than 59, up to and including 69\".",
        },
        {
          kind: "code",
          example: {
            id: "cut-grades",
            title: "Number ranges to categories with cut()",
            code: `students <- read.csv("data/students.csv")

students$grade <- cut(
  students$math,
  breaks = c(0, 59, 69, 79, 89, 100),
  labels = c("F", "D", "C", "B", "A")
)

head(students[, c("name", "math", "grade")], 4)
table(students$grade)`,
            explanation: [
              { code: `  breaks = c(0, 59, 69, 79, 89, 100),`, text: "Six boundaries create five intervals: (0, 59], (59, 69], (69, 79], (79, 89] and (89, 100]." },
              { code: `  labels = c("F", "D", "C", "B", "A")`, text: "One label per interval, in order from lowest to highest." },
              { code: `table(students$grade)`, text: "`cut()` returns a *factor*, so `table()` lists the categories in their natural order F, D, C, B, A – even categories with zero students would appear." },
            ],
            output: String.raw`    name math grade
1  Amara   86     B
2    Ben   54     F
3  Chloe   99     A
4 Daniel   68     D

 F  D  C  B  A
 8 13 19 13  7`,
            tryIt: "Change the breaks to `c(0, 69, 84, 100)` with labels `c(\"low\", \"medium\", \"high\")`.",
          },
        },
        {
          kind: "text",
          md: "If you prefer dplyr (Module 5), `case_when()` inside `mutate()` reads like a list of rules. The rules are checked from top to bottom, and the first one that is `TRUE` wins; `TRUE ~ ...` at the end catches everything else.",
        },
        {
          kind: "code",
          example: {
            id: "case-when-levels",
            title: "Several rules with case_when()",
            code: `library(dplyr)

students <- read.csv("data/students.csv")

students <- students |>
  mutate(level = case_when(
    math >= 85 ~ "high",
    math >= 65 ~ "medium",
    TRUE ~ "low"
  ))

table(students$level)`,
            packages: ["dplyr"],
            explanation: [
              { code: `  mutate(level = case_when(`, text: "`mutate()` adds a column called `level`; `case_when()` decides its value for each row." },
              { code: `    math >= 85 ~ "high",`, text: "Read `~` as \"then\": if math is at least 85, then `\"high\"`." },
              { code: `    math >= 65 ~ "medium",`, text: "Only checked for rows that were not already `\"high\"`, so this means 65–84." },
              { code: `    TRUE ~ "low"`, text: "Everything that is left becomes `\"low\"`." },
            ],
            output: String.raw`  high    low medium
    12     12     36`,
          },
        },
      ],
    },
    {
      id: "merge-aggregate",
      title: "Joining, summarising and adding columns",
      blocks: [
        {
          kind: "text",
          md: "`merge(x, y, by = \"key\")` joins two data frames by matching the values of a shared **key** column – like dplyr's joins. Here a small table of class teachers is added to every student.",
        },
        {
          kind: "code",
          example: {
            id: "merge-teachers",
            title: "Joining two tables with merge()",
            code: `students <- read.csv("data/students.csv")
teachers <- data.frame(
  class = c("A", "B", "C"),
  teacher = c("Ms Novak", "Mr Osei", "Ms Park")
)

combined <- merge(students, teachers, by = "class")
nrow(combined)
head(combined[, c("name", "class", "teacher")], 4)`,
            explanation: [
              { code: `teachers <- data.frame(`, text: "A lookup table with one row per class." },
              { code: `combined <- merge(students, teachers, by = "class")`, text: "For every student, R finds the row of `teachers` with the same `class` and adds its columns. The result is sorted by the key." },
              { code: `nrow(combined)`, text: "Still 60 rows: every student matched exactly one class." },
            ],
            output: String.raw`[1] 60
   name class  teacher
1 Mateo     A Ms Novak
2  Dina     A Ms Novak
3   Ben     A Ms Novak
4  Liam     A Ms Novak`,
            outputNote: "The rows now start with class A, because `merge()` sorts by the key column. Add `all.x = TRUE` to keep students whose class is missing from the lookup table (a *left join*).",
          },
        },
        {
          kind: "code",
          example: {
            id: "aggregate-groups",
            title: "Group summaries as a data frame with aggregate()",
            code: `students <- read.csv("data/students.csv")

aggregate(math ~ class, data = students, FUN = mean)
aggregate(cbind(math, reading) ~ gender, data = students, FUN = median)`,
            explanation: [
              { code: `aggregate(math ~ class, data = students, FUN = mean)`, text: "The formula `math ~ class` reads \"math, grouped by class\". The result is a **data frame** with one row per class – handy for further work or plotting." },
              { code: `aggregate(cbind(math, reading) ~ gender, data = students, FUN = median)`, text: "`cbind(math, reading)` summarises two columns at once; here the median of each, by gender." },
            ],
            output: String.raw`  class     math
1     A 74.94444
2     B 72.95455
3     C 76.25000
  gender math reading
1 Female   79      83
2   Male   71      75`,
            outputNote: "Compare with `tapply()`: the numbers are the same, but `aggregate()` returns a tidy data frame instead of a named vector. Note that the formula version drops rows with missing values in the columns used.",
          },
        },
        {
          kind: "code",
          example: {
            id: "transform-columns",
            title: "Adding columns with transform()",
            code: `students <- read.csv("data/students.csv")

students <- transform(
  students,
  average = round((math + reading) / 2, 1),
  attendance_share = attendance / 100
)

head(students[, c("name", "math", "reading", "average", "attendance_share")], 3)`,
            explanation: [
              { code: `students <- transform(`, text: "`transform()` returns a copy of the data frame with new (or changed) columns. Inside it, you can use column names directly, without `students$`." },
              { code: `  average = round((math + reading) / 2, 1),`, text: "A new column: the mean of math and reading, rounded to one decimal." },
              { code: `  attendance_share = attendance / 100`, text: "A second new column: attendance as a proportion between 0 and 1." },
            ],
            output: String.raw`   name math reading average attendance_share
1 Amara   86      82    84.0             0.82
2   Ben   54      53    53.5             0.93
3 Chloe   99      99    99.0             0.93`,
            tryIt: "Add a third column, `total = math + reading`, in the same `transform()` call.",
          },
        },
        {
          kind: "table",
          caption: "Base R and dplyr do the same jobs",
          headers: ["Task", "Base R", "dplyr"],
          rows: [
            ["Add or change columns", "`transform()`, `within()`, `df$new <- ...`", "`mutate()`"],
            ["Categories from rules", "`ifelse()`, `cut()`", "`if_else()`, `case_when()`"],
            ["Join two tables", "`merge(x, y, by = )`", "`left_join()`, `inner_join()`"],
            ["Summaries per group", "`aggregate()`, `tapply()`", "`group_by()` + `summarise()`"],
          ],
        },
      ],
    },
    {
      id: "reshaping",
      title: "Reshaping recap: wide and long",
      blocks: [
        {
          kind: "text",
          md: "In Module 5 you met two shapes of the same data. **Wide** data has one column per measurement (math, reading, science). **Long** data has one row per measurement, with a column saying which measurement it is. Long data is what `aggregate()`, dplyr's `group_by()` and ggplot2 work with most easily.",
        },
        { kind: "diagram", name: "pivot", caption: "pivot_longer() turns columns into rows; pivot_wider() turns them back." },
        {
          kind: "code",
          example: {
            id: "pivot-longer-scores",
            title: "From wide to long with tidyr",
            code: `library(tidyr)

students <- read.csv("data/students.csv")
wide <- head(students[, c("name", "math", "reading", "science")], 2)
wide

long <- pivot_longer(
  wide,
  cols = c(math, reading, science),
  names_to = "subject",
  values_to = "score"
)
as.data.frame(long)`,
            packages: ["tidyr"],
            explanation: [
              { code: `wide <- head(students[, c("name", "math", "reading", "science")], 2)`, text: "Two students in wide format: one column per subject." },
              { code: `  cols = c(math, reading, science),`, text: "The columns to turn into rows." },
              { code: `  names_to = "subject",`, text: "The old column names go into a new column called `subject`." },
              { code: `  values_to = "score"`, text: "The values go into a new column called `score`." },
              { code: `as.data.frame(long)`, text: "`pivot_longer()` returns a tibble; converting it to a plain data frame prints it the familiar way." },
            ],
            output: String.raw`   name math reading science
1 Amara   86      82      83
2   Ben   54      53      46
   name subject score
1 Amara    math    86
2 Amara reading    82
3 Amara science    83
4   Ben    math    54
5   Ben reading    53
6   Ben science    46`,
            outputNote: "Two students × three subjects = six rows. Each row is now one observation: one student's score in one subject.",
          },
        },
        {
          kind: "code",
          example: {
            id: "long-then-aggregate",
            title: "Why long data is useful",
            code: `library(tidyr)

students <- read.csv("data/students.csv")
long <- pivot_longer(
  students,
  cols = c(math, reading, science),
  names_to = "subject",
  values_to = "score"
)

aggregate(score ~ subject, data = long, FUN = mean)`,
            packages: ["tidyr"],
            explanation: [
              { code: `long <- pivot_longer(`, text: "Reshapes all 60 students into 180 rows (60 × 3 subjects)." },
              { code: `aggregate(score ~ subject, data = long, FUN = mean)`, text: "With a single `score` column and a `subject` column, one grouped summary covers every subject." },
            ],
            output: String.raw`  subject    score
1    math 74.65000
2 reading 77.95000
3 science 74.29825`,
            outputNote: "The science average uses only the 57 known science scores, because the formula version of `aggregate()` drops rows where `score` is `NA`.",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Applying a numeric function to every column, including text columns",
      wrong: `students <- read.csv("data/students.csv")
sapply(students, mean)`,
      error: "argument is not numeric or logical: returning NA",
      why: "`sapply()` visits *every* column, including `name`, `gender` and `class`, which are text. `mean()` cannot average text, so it warns and returns `NA` for those columns.",
      right: `students <- read.csv("data/students.csv")
sapply(students[, c("math", "reading", "science")], mean, na.rm = TRUE)`,
    },
    {
      title: "Mixing up rows and columns in apply()",
      wrong: `sales <- matrix(c(12, 15, 9, 20, 18, 11), nrow = 2, byrow = TRUE)
# goal: the total of each of the 3 months (columns)
apply(sales, 1, sum)`,
      why: "`MARGIN = 1` means rows, so this gives the 2 shop totals instead of the 3 month totals. No error appears – check that the number of results matches what you expect.",
      right: `sales <- matrix(c(12, 15, 9, 20, 18, 11), nrow = 2, byrow = TRUE)
# goal: the total of each of the 3 months (columns)
apply(sales, 2, sum)`,
    },
    {
      title: "Values on the lowest break become NA in cut()",
      wrong: `scores <- c(0, 45, 100)
cut(scores, breaks = c(0, 50, 100), labels = c("low", "high"))`,
      why: "Intervals are `(0, 50]` and `(50, 100]`: the left end is *not* included, so a score of exactly 0 belongs to no interval and becomes `NA`. Use `include.lowest = TRUE` (or start the breaks below the smallest value).",
      right: `scores <- c(0, 45, 100)
cut(scores, breaks = c(0, 50, 100), labels = c("low", "high"), include.lowest = TRUE)`,
    },
    {
      title: "Joining on a column name that does not exist",
      wrong: `students <- read.csv("data/students.csv")
teachers <- data.frame(class = c("A", "B", "C"), teacher = c("Novak", "Osei", "Park"))
merge(students, teachers, by = "Class")`,
      error: "'by' must specify a uniquely valid column",
      why: "Column names are case-sensitive: the key is `class`, not `Class`. `merge()` cannot find a column called `Class` in the tables.",
      right: `students <- read.csv("data/students.csv")
teachers <- data.frame(class = c("A", "B", "C"), teacher = c("Novak", "Osei", "Park"))
nrow(merge(students, teachers, by = "class"))`,
    },
  ],
  exerciseIds: ["m8-sapply-columns", "m8-grade-bands"],
  quiz: [
    {
      id: "m8-apply-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `m <- matrix(1:6, nrow = 2)
apply(m, 2, sum)`,
      options: ["[1]  3  7 11", "[1]  9 12", "[1] 21", "[1] 1 2 3 4 5 6"],
      answer: 0,
      optionFeedback: [
        "Correct! The matrix is filled column by column: (1, 2), (3, 4), (5, 6), and each column is summed.",
        "Those are the row sums (`MARGIN = 1`): 1 + 3 + 5 and 2 + 4 + 6.",
        "`apply()` gives one result per column, not one grand total.",
        "`sum` is applied to each column, so you get three totals, not the original values.",
      ],
      explanation: "`matrix(1:6, nrow = 2)` fills the numbers down the columns, giving columns (1, 2), (3, 4) and (5, 6). `MARGIN = 2` applies `sum` to each column: 3, 7 and 11.",
      concept: "apply-matrix",
    },
    {
      id: "m8-apply-q3",
      type: "multiple-choice",
      prompt: "What is the main difference between `lapply()` and `sapply()`?",
      options: [
        "`lapply()` always returns a list; `sapply()` tries to simplify the result to a vector or matrix.",
        "`lapply()` works on lists and `sapply()` only works on data frames.",
        "`sapply()` is a for loop and `lapply()` is not.",
        "`lapply()` applies the function to rows and `sapply()` to columns.",
      ],
      answer: 0,
      optionFeedback: [
        "Correct!",
        "Both work on vectors, lists and data frames (a data frame is a list of columns).",
        "Neither is written as a for loop by you; both repeat the function for you.",
        "Rows and columns are chosen with `apply()`'s `MARGIN`; `lapply()` and `sapply()` both work element by element.",
      ],
      explanation: "Both apply a function to every element. `lapply()` always returns a list; `sapply()` simplifies when every answer has the same length – to a vector for single values or a matrix for equal-length answers.",
      concept: "lapply-sapply",
    },
    {
      id: "m8-apply-q4",
      type: "fill-blank",
      prompt: "Complete the code so that it prints the mean math score of each class.",
      code: `students <- read.csv("data/students.csv")
tapply(students$math, students$___, mean)`,
      accept: ["class"],
      hint: "The second argument of `tapply()` is the grouping column.",
      explanation: "`tapply(values, groups, f)` splits `students$math` by `students$class` and applies `mean` to each group, giving one average for each of the classes A, B and C.",
      concept: "tapply",
    },
    {
      id: "m8-apply-q5",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `ifelse(c(45, 70, 90) >= 60, "pass", "fail")`,
      options: ["[1] \"fail\" \"pass\" \"pass\"", "[1] \"pass\" \"fail\" \"fail\"", "[1] \"fail\"", "[1] FALSE  TRUE  TRUE"],
      answer: 0,
      optionFeedback: [
        "Correct – `ifelse()` gives one answer per value.",
        "45 is below 60, so it gets the `no` value, \"fail\".",
        "`ifelse()` is vectorised: three values in, three answers out.",
        "That would be the comparison alone. `ifelse()` replaces each `TRUE`/`FALSE` with the `yes`/`no` value.",
      ],
      explanation: "The test `c(45, 70, 90) >= 60` is `FALSE TRUE TRUE`. `ifelse()` swaps each `TRUE` for \"pass\" and each `FALSE` for \"fail\".",
      concept: "cut-ifelse",
    },
    {
      id: "m8-apply-q6",
      type: "find-error",
      prompt: "This code stops with an error. Click the line where R stops.",
      code: `temps <- list(mon = c(18, 21), tue = c(22, 25, 24))
means <- vapply(temps, mean, FUN.VALUE = numeric(1))
ranges <- vapply(temps, range, FUN.VALUE = numeric(1))
means`,
      errorLine: 3,
      errorKind: "error",
      fix: `temps <- list(mon = c(18, 21), tue = c(22, 25, 24))
means <- vapply(temps, mean, FUN.VALUE = numeric(1))
ranges <- vapply(temps, range, FUN.VALUE = numeric(2))
means`,
      explanation: "`range()` returns two numbers, but `FUN.VALUE = numeric(1)` promises one. `vapply()` stops on line 3. Promise `numeric(2)` instead (or use a function that returns one number).",
      concept: "vapply",
    },
    {
      id: "m8-apply-q7",
      type: "true-false",
      prompt: "`cut(c(0, 50, 100), breaks = c(0, 50, 100))` puts the value 0 into the first interval.",
      answer: false,
      explanation: "By default `cut()` intervals are open on the left, `(0, 50]`, so 0 is not included and becomes `NA`. Add `include.lowest = TRUE` to include it.",
      concept: "cut-ifelse",
    },
  ],
  keyPoints: [
    "The apply family applies one function to every piece of your data and collects the results – a shorter alternative to many `for` loops.",
    "`lapply()` always returns a list; `sapply()` simplifies to a vector or matrix when it can; `vapply()` guarantees the shape you promise in `FUN.VALUE`.",
    "`apply(m, 1, f)` works on rows and `apply(m, 2, f)` on columns of a matrix.",
    "`tapply(values, groups, f)` gives one result per group; `mapply()` walks through several vectors in parallel.",
    "`ifelse()` makes two categories; `cut()` turns number ranges into an ordered factor; `case_when()` applies several rules in order.",
    "`merge()` joins tables by a key column, `aggregate()` returns group summaries as a data frame and `transform()` adds columns.",
    "Long data (one row per measurement) is easiest to summarise and plot by group.",
  ],
  concepts: [
    "apply-family",
    "lapply-sapply",
    "vapply",
    "mapply",
    "apply-matrix",
    "tapply",
    "cut-ifelse",
    "merge",
    "aggregate",
    "transform-columns",
    "reshaping",
  ],
  glossary: ["apply-family", "iteration", "for-loop", "anonymous-function", "list", "matrix", "factor", "vectorization", "categorical-variable", "long-format", "wide-format"],
  playground: `students <- read.csv("data/students.csv")

# One summary per column
sapply(students[, c("math", "reading", "science")], mean, na.rm = TRUE)

# One summary per group
tapply(students$study_hours, students$class, mean)

# Numbers to categories
table(cut(students$attendance, breaks = c(0, 79, 89, 100), labels = c("low", "ok", "high")))
`,
  prerequisites: ["advanced-functions-and-scope"],
  datasets: ["students"],
};
