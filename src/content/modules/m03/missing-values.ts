import type { Lesson } from "../../types";

export const missingValuesLesson: Lesson = {
  id: "missing-values-and-inspection",
  module: 3,
  title: "Missing Values and Inspecting Data",
  summary: "Understand NA, find and count missing values, calculate around them, and get to know a new dataset with head(), str() and summary().",
  minutes: 35,
  objectives: [
    "Explain what NA means and why mean() of a vector with NA returns NA",
    "Find and count missing values with is.na() and sum(is.na())",
    "Calculate while ignoring missing values with na.rm = TRUE",
    "Inspect a dataset with head(), tail(), str() and summary()",
    "Describe a dataset's size and columns with nrow(), ncol(), dim() and names()",
  ],
  intro:
    "Real data always has gaps. A student was ill on test day, a sensor broke for an afternoon, a survey question was skipped. R marks every such gap with the special value **`NA`**, short for *Not Available*.\n\n" +
    "`NA` is not zero and not empty text – it means \"there should be a value here, but we don't know it\". Because R cannot know the missing value, any calculation that depends on it is unknown too. In this lesson you learn how to find missing values, count them and calculate around them.\n\n" +
    "You also learn the first thing every data analyst does with a new dataset: **look at it**. A handful of functions – `head()`, `str()`, `summary()` and friends – tell you in seconds how big a dataset is, what its columns contain and where the problems are.",
  sections: [
    {
      id: "what-is-na",
      title: "NA: R's word for \"missing\"",
      blocks: [
        {
          kind: "definition",
          term: "NA",
          md: "R's marker for a **missing value**: a value that should exist but is unknown. It is written in capitals and **without quotes**, and it can appear in any type of vector.",
        },
        {
          kind: "code",
          example: {
            id: "na-basic",
            title: "A vector with a gap",
            code: `heights <- c(160, 172, NA, 181, 168)
heights
length(heights)
class(heights)`,
            explanation: [
              { code: "heights <- c(160, 172, NA, 181, 168)", text: "Five people were measured, but the third measurement was lost. We write `NA` in its place, so the other values keep their positions." },
              { code: "length(heights)", text: "`NA` still takes up a position, so the length is 5." },
              { code: "class(heights)", text: "The vector is still numeric – `NA` fits into any type." },
            ],
            output: `[1] 160 172  NA 181 168
[1] 5
[1] "numeric"`,
          },
        },
        {
          kind: "text",
          md: "Now watch what happens when we calculate with this vector:",
        },
        {
          kind: "code",
          example: {
            id: "na-mean",
            title: "Why mean() returns NA",
            code: `heights <- c(160, 172, NA, 181, 168)
mean(heights)
sum(heights)
max(heights)
NA + 1
NA > 5`,
            explanation: [
              { code: "mean(heights)", text: "The average depends on all five heights. One of them is unknown, so the average is unknown too." },
              { code: "sum(heights)", text: "The same for the total…" },
              { code: "max(heights)", text: "…and for the maximum: the missing person could be the tallest!" },
              { code: "NA + 1", text: "\"Something unknown, plus one\" is still unknown." },
              { code: "NA > 5", text: "Is an unknown value bigger than 5? R cannot say, so the answer is `NA` – not TRUE and not FALSE." },
            ],
            output: `[1] NA
[1] NA
[1] NA
[1] NA
[1] NA`,
            outputNote: "This is R being honest rather than difficult. If it quietly skipped the gap, you might never notice that data was missing. R makes you decide what to do – which you will learn next.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "NA is not \"NA\"",
          md: "`NA` without quotes is a missing value. `\"NA\"` with quotes is just two letters of text – and putting it in a numeric vector turns the whole vector into text. Also, `NA` is different from `NULL`: `NULL` means \"nothing at all\" (no position), while `NA` is a position whose value is unknown.",
        },
      ],
    },
    {
      id: "finding-na",
      title: "Finding missing values with is.na()",
      blocks: [
        {
          kind: "text",
          md: "`is.na()` asks \"is this value missing?\" for every value and answers with a logical vector. Combine it with the tools you know: `sum()` counts the missing values, `which()` tells you their positions, and `!` (which means **not**) flips TRUE and FALSE so you can keep the values that are *not* missing.",
        },
        {
          kind: "code",
          example: {
            id: "is-na",
            title: "Finding, counting and skipping gaps",
            code: `heights <- c(160, 172, NA, 181, 168)

is.na(heights)
sum(is.na(heights))
which(is.na(heights))
heights[!is.na(heights)]`,
            explanation: [
              { code: "is.na(heights)", text: "TRUE where a value is missing, FALSE elsewhere." },
              { code: "sum(is.na(heights))", text: "TRUE counts as 1, so the sum is the **number** of missing values. This line is one of the most used in data analysis." },
              { code: "which(is.na(heights))", text: "`which()` returns the **positions** of the TRUE values: the gap is at position 3." },
              { code: "heights[!is.na(heights)]", text: "`!` turns TRUE into FALSE and back, so `!is.na(heights)` is TRUE for values that are present. Logical indexing keeps only those." },
            ],
            output: `[1] FALSE FALSE  TRUE FALSE FALSE
[1] 1
[1] 3
[1] 160 172 181 168`,
            tryIt: "Add another `NA` to the vector and run the code again. Which numbers change?",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Never test with == NA",
          md: "It is tempting to write `heights == NA`, but that compares every value with something unknown – so every answer is `NA`: `[1] NA NA NA NA NA`. Always use `is.na()`.",
        },
        {
          kind: "question",
          question: {
            id: "m3-na-q1",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `answers <- c(3, NA, 5, NA, 4)
sum(is.na(answers))`,
            options: ["[1] 2", "[1] NA", "[1] 12", "[1] 3"],
            answer: 0,
            explanation: "`is.na(answers)` is `FALSE TRUE FALSE TRUE FALSE`. `sum()` counts the two TRUE values.",
            optionFeedback: [
              "Correct!",
              "`is.na()` never returns NA – it always answers TRUE or FALSE, so the sum is a normal number.",
              "12 is the sum of the known answers (3 + 5 + 4). Here we sum TRUE/FALSE values instead.",
              "3 is the number of values that are **not** missing.",
            ],
            concept: "counting-missing",
          },
        },
      ],
    },
    {
      id: "na-rm",
      title: "Calculating around gaps with na.rm = TRUE",
      blocks: [
        {
          kind: "text",
          md: "Most summary functions – `mean()`, `sum()`, `min()`, `max()`, `median()` – have an argument called `na.rm` (short for **NA remove**). It is `FALSE` by default. Set `na.rm = TRUE` to tell R: \"skip the missing values and use the rest\".",
        },
        {
          kind: "code",
          example: {
            id: "na-rm-example",
            title: "Ignoring missing values",
            code: `heights <- c(160, 172, NA, 181, 168)

mean(heights, na.rm = TRUE)
sum(heights, na.rm = TRUE)
max(heights, na.rm = TRUE)`,
            explanation: [
              { code: "mean(heights, na.rm = TRUE)", text: "The average of the four known heights: (160 + 172 + 181 + 168) / 4 = 170.25." },
              { code: "sum(heights, na.rm = TRUE)", text: "The total of the known heights." },
              { code: "max(heights, na.rm = TRUE)", text: "The tallest **known** height." },
            ],
            output: `[1] 170.25
[1] 681
[1] 181`,
            outputNote: "Note that the mean divides by 4, not 5: the missing person is left out completely, not counted as 0.",
          },
        },
        {
          kind: "text",
          md: "Sometimes you know what a missing value should be (or you decide on a sensible replacement). Logical indexing with `is.na()` on the left of `<-` fills every gap at once.",
        },
        {
          kind: "code",
          example: {
            id: "replace-na",
            title: "Filling in missing values",
            code: `visits <- c(12, NA, 8, NA, 15)
visits[is.na(visits)] <- 0
visits
mean(visits)`,
            explanation: [
              { code: "visits <- c(12, NA, 8, NA, 15)", text: "Website visits per day; on two days the counter was off. Suppose we know the site was offline then, so 0 visits is correct." },
              { code: "visits[is.na(visits)] <- 0", text: "Find the positions where the value is missing and put 0 there." },
              { code: "mean(visits)", text: "No gaps any more, so `mean()` works without `na.rm`." },
            ],
            output: `[1] 12  0  8  0 15
[1] 7`,
          },
        },
        {
          kind: "callout",
          tone: "info",
          title: "Removing or replacing is a decision",
          md: "`na.rm = TRUE` and filling in values both change your results. Replacing missing scores with 0 would make a class look worse than it is! Before you choose, ask *why* the data is missing. You will learn more careful ways of handling missing data in Module 5.",
        },
      ],
    },
    {
      id: "na-in-data",
      title: "Missing values in real datasets",
      blocks: [
        {
          kind: "text",
          md: "In a data frame, each column is a vector, so the same tools work on columns. The students dataset has a few missing science scores – let's find them.",
        },
        {
          kind: "code",
          example: {
            id: "students-na",
            title: "Missing science scores",
            code: `students <- read.csv("data/students.csv")

sum(is.na(students$science))
mean(students$science)
mean(students$science, na.rm = TRUE)
students[is.na(students$science), c("name", "class", "science")]`,
            explanation: [
              { code: `students <- read.csv("data/students.csv")`, text: "Load the dataset. Empty or `NA` cells in a CSV file become `NA` in R." },
              { code: "sum(is.na(students$science))", text: "Three science scores are missing." },
              { code: "mean(students$science)", text: "So the plain mean is `NA`…" },
              { code: "mean(students$science, na.rm = TRUE)", text: "…and with `na.rm = TRUE` we get the average of the 57 known scores." },
              { code: `students[is.na(students$science), c("name", "class", "science")]`, text: "Filter the rows where science is missing, to see **who** is affected." },
            ],
            output: `[1] 3
[1] NA
[1] 74.29825
    name class science
7  Grace     B      NA
23   Wei     A      NA
41 Oscar     B      NA`,
          },
        },
        {
          kind: "text",
          md: "To check **every** column at once, use `colSums(is.na(data))`. `is.na()` on a whole data frame marks every cell, and `colSums()` adds up each column – giving the number of missing values per column.",
        },
        {
          kind: "code",
          example: {
            id: "colsums-na",
            title: "Missing values in every column",
            code: `students <- read.csv("data/students.csv")
colSums(is.na(students))

colSums(is.na(airquality))`,
            explanation: [
              { code: "colSums(is.na(students))", text: "Only `science` has gaps in the students data." },
              { code: "colSums(is.na(airquality))", text: "`airquality` is a dataset built into R: daily air measurements in New York in 1973. It has many more gaps." },
            ],
            output: ` student_id        name      gender         age       class study_hours
          0           0           0           0           0           0
 attendance        math     reading     science
          0           0           0           3
  Ozone Solar.R    Wind    Temp   Month     Day
     37       7       0       0       0       0`,
            outputNote: "The result is a vector with a **name** above each number. When the names do not fit on one line, R continues on the next. `Ozone` has 37 missing days – almost a quarter of the 153 days.",
          },
        },
      ],
    },
    {
      id: "inspecting-data",
      title: "Getting to know a dataset",
      blocks: [
        {
          kind: "text",
          md: "Before analysing anything, look at your data. A dataset with 60 rows is too big to read in full, so R gives you tools to look at it in pieces and in summary.",
        },
        {
          kind: "code",
          example: {
            id: "head-tail",
            title: "The first and last rows: head() and tail()",
            code: `students <- read.csv("data/students.csv")
head(students)
tail(students, 3)`,
            explanation: [
              { code: "head(students)", text: "`head()` shows the first 6 rows – a quick look at what the data looks like." },
              { code: "tail(students, 3)", text: "`tail()` shows the last rows. The second argument sets how many (here 3)." },
            ],
            output: `  student_id   name gender age class study_hours attendance math reading
1       S001  Amara Female  16     C           6         82   86      82
2       S002    Ben   Male  17     A           1         93   54      53
3       S003  Chloe Female  19     B          12         93   99      99
4       S004 Daniel   Male  19     B          10         86   68      62
5       S005  Elena Female  17     C          13         79   90      86
6       S006  Farid   Male  16     A          11         83   78      85
  science
1      83
2      46
3     100
4      63
5      84
6      88
   student_id   name gender age class study_hours attendance math reading
58       S058   Gina Female  18     A          11         87   83      87
59       S059 Hassan   Male  17     B           2         89   59      51
60       S060   Ines Female  19     B          10         78   59      60
   science
58      87
59      55
60      57`,
            outputNote: "The table is wider than the console (80 characters), so R prints the last column, `science`, in a second block underneath, repeating the row numbers. The row numbers of `tail()` (58–60) show that the dataset has 60 rows.",
          },
        },
        {
          kind: "code",
          example: {
            id: "size-and-names",
            title: "Size and column names",
            code: `students <- read.csv("data/students.csv")
nrow(students)
ncol(students)
dim(students)
names(students)`,
            explanation: [
              { code: "nrow(students)", text: "Number of rows (observations)." },
              { code: "ncol(students)", text: "Number of columns (variables)." },
              { code: "dim(students)", text: "Both at once: rows, then columns." },
              { code: "names(students)", text: "All column names – check the exact spelling here before you use `$`." },
            ],
            output: `[1] 60
[1] 10
[1] 60 10
 [1] "student_id"  "name"        "gender"      "age"         "class"
 [6] "study_hours" "attendance"  "math"        "reading"     "science"`,
          },
        },
        {
          kind: "code",
          example: {
            id: "str-students",
            title: "The structure: str()",
            code: `students <- read.csv("data/students.csv")
str(students)`,
            explanation: [
              { code: "str(students)", text: "`str()` (short for **structure**) shows the type of object, its size, and one line per column with the column's type and first values." },
            ],
            output: `'data.frame':	60 obs. of  10 variables:
 $ student_id : chr  "S001" "S002" "S003" "S004" ...
 $ name       : chr  "Amara" "Ben" "Chloe" "Daniel" ...
 $ gender     : chr  "Female" "Male" "Female" "Male" ...
 $ age        : int  16 17 19 19 17 16 19 18 18 16 ...
 $ class      : chr  "C" "A" "B" "B" ...
 $ study_hours: int  6 1 12 10 13 11 5 2 13 10 ...
 $ attendance : int  82 93 93 86 79 83 78 78 84 86 ...
 $ math       : int  86 54 99 68 90 78 77 81 70 74 ...
 $ reading    : int  82 53 99 62 86 85 70 76 78 90 ...
 $ science    : int  83 46 100 63 84 88 NA 63 84 77 ...`,
            outputNote: "60 obs. (rows) of 10 variables (columns). `chr` columns hold text and `int` columns hold whole numbers (*integers*). The `...` means \"and more values\". You can already spot an `NA` in the science column!",
          },
        },
        {
          kind: "text",
          md: "`summary()` describes the **values** of numeric columns in six numbers: the smallest (*Min.*), the largest (*Max.*), the *Mean* (average), the *Median* (the middle value when sorted), and the *1st Qu.* and *3rd Qu.* (quartiles: a quarter of the values lie below the 1st quartile and a quarter above the 3rd). If there are missing values, it counts them too.",
        },
        {
          kind: "code",
          example: {
            id: "summary-students",
            title: "Summaries of numeric columns",
            code: `students <- read.csv("data/students.csv")
summary(students$math)
summary(students[, c("math", "reading", "science")])`,
            explanation: [
              { code: "summary(students$math)", text: "Summary of one column (a vector)." },
              { code: `summary(students[, c("math", "reading", "science")])`, text: "Summary of three columns at once: one block per column." },
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
            outputNote: "Math scores run from 53 to 99, with a typical (median) score of 74. The science block has an extra line, `NAs :3` – `summary()` reports missing values automatically, and it calculates the other numbers from the known values only.",
            tryIt: "Try `summary(students)` to summarise every column. What does it show for text columns such as `name`?",
          },
        },
        {
          kind: "text",
          md: "The same functions work on R's built-in datasets. `mtcars` describes 32 cars from 1974; its row names are the car models.",
        },
        {
          kind: "code",
          example: {
            id: "inspect-mtcars",
            title: "Inspecting a built-in dataset",
            code: `head(mtcars, 3)
dim(mtcars)
summary(airquality$Ozone)`,
            explanation: [
              { code: "head(mtcars, 3)", text: "The first 3 cars. `mpg` is miles per gallon, `cyl` the number of cylinders, `hp` the horsepower." },
              { code: "dim(mtcars)", text: "32 cars, 11 columns." },
              { code: "summary(airquality$Ozone)", text: "The ozone column of `airquality` – with its 37 missing values reported as `NAs`." },
            ],
            output: `               mpg cyl disp  hp drat    wt  qsec vs am gear carb
Mazda RX4     21.0   6  160 110 3.90 2.620 16.46  0  1    4    4
Mazda RX4 Wag 21.0   6  160 110 3.90 2.875 17.02  0  1    4    4
Datsun 710    22.8   4  108  93 3.85 2.320 18.61  1  1    4    1
[1] 32 11
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.     NAs
   1.00   18.00   31.50   42.13   63.25  168.00      37`,
          },
        },
        {
          kind: "steps",
          title: "Your checklist for every new dataset",
          items: [
            "`head(data)` – what does a row look like?",
            "`dim(data)` (or `nrow()` and `ncol()`) – how big is it?",
            "`str(data)` – what are the columns called and what type is each one?",
            "`summary(data)` – what range of values does each column have? Anything impossible?",
            "`colSums(is.na(data))` – where are the missing values, and how many are there?",
          ],
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Testing for missing values with == NA",
      wrong: `ages <- c(23, NA, 31)
ages == NA`,
      why: "Comparing anything with an unknown value gives an unknown answer, so you get `NA NA NA` instead of TRUE/FALSE. This runs without an error, which makes it easy to miss.",
      right: `ages <- c(23, NA, 31)
is.na(ages)`,
    },
    {
      title: "Forgetting na.rm = TRUE",
      wrong: `temps <- c(21, 25, NA, 19)
mean(temps)`,
      why: "One missing value makes the whole mean `NA`. If you want the average of the known values, you have to say so with `na.rm = TRUE`.",
      right: `temps <- c(21, 25, NA, 19)
mean(temps, na.rm = TRUE)`,
    },
    {
      title: "Writing \"NA\" in quotes",
      wrong: `scores <- c(70, "NA", 85)
mean(scores, na.rm = TRUE)`,
      error: "argument is not numeric or logical",
      why: "`\"NA\"` in quotes is text, not a missing value. One piece of text turns the whole vector into a character vector, so even with `na.rm = TRUE` R cannot calculate a mean. Write `NA` without quotes.",
      right: `scores <- c(70, NA, 85)
mean(scores, na.rm = TRUE)`,
    },
    {
      title: "Using na.rm with a function that does not have it",
      wrong: `x <- c(4, NA, 6)
length(x, na.rm = TRUE)`,
      error: "2 arguments passed to 'length' which requires 1",
      why: "Only some functions have an `na.rm` argument. `length()` always counts every position, including `NA`. To count the values that are **not** missing, count the FALSEs of `is.na()`.",
      right: `x <- c(4, NA, 6)
sum(!is.na(x))`,
    },
  ],
  exerciseIds: ["m3-students-checkup"],
  quiz: [
    {
      id: "m3-na-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- c(4, NA, 6)
mean(x)`,
      options: ["[1] 5", "[1] NA", "[1] 3.333333", "Error: missing value"],
      answer: 1,
      explanation: "Without `na.rm = TRUE`, one unknown value makes the mean unknown, so R returns `NA` (no error).",
      optionFeedback: [
        "That would be `mean(x, na.rm = TRUE)`.",
        "Correct!",
        "R does not treat `NA` as 0 – (4 + 0 + 6) / 3 would be 3.333333.",
        "R does not stop; it returns `NA` as the result.",
      ],
      concept: "missing-values",
    },
    {
      id: "m3-na-q3",
      type: "fill-blank",
      prompt: "Complete the code so that the mean ignores the missing value.",
      code: `x <- c(10, NA, 20)
mean(x, ___)`,
      accept: ["na.rm = TRUE", "na.rm=TRUE", "na.rm = T", "na.rm=T"],
      hint: "The argument name is short for \"NA remove\".",
      explanation: "`na.rm = TRUE` skips missing values, so the result is (10 + 20) / 2 = 15.",
      concept: "na-rm",
    },
    {
      id: "m3-na-q4",
      type: "multiple-choice",
      prompt: "Which function shows, for every column of a data frame, its name, its type and its first few values?",
      options: ["head()", "str()", "names()", "dim()"],
      answer: 1,
      explanation: "`str()` shows the structure: one line per column with type and first values.",
      optionFeedback: [
        "`head()` shows the first rows, but not the column types.",
        "Correct!",
        "`names()` shows only the column names.",
        "`dim()` shows only the number of rows and columns.",
      ],
      concept: "data-inspection",
    },
    {
      id: "m3-na-q5",
      type: "true-false",
      prompt: "`x == NA` is a good way to find the missing values in `x`.",
      answer: false,
      explanation: "Any comparison with `NA` gives `NA`, so `x == NA` is `NA` everywhere. Use `is.na(x)`.",
      concept: "is-na",
    },
    {
      id: "m3-na-q6",
      type: "find-error",
      prompt: "This code should count the missing ages, but `n_missing` ends up as `NA`. Click the faulty line.",
      code: `ages <- c(23, NA, 31, 40)
average <- mean(ages, na.rm = TRUE)
n_missing <- sum(ages == NA)
n_missing`,
      errorLine: 3,
      errorKind: "logic",
      fix: `ages <- c(23, NA, 31, 40)
average <- mean(ages, na.rm = TRUE)
n_missing <- sum(is.na(ages))
n_missing`,
      explanation: "`ages == NA` is `NA NA NA NA`, and the sum of NAs is `NA`. `is.na(ages)` gives proper TRUE/FALSE values, so `sum(is.na(ages))` returns 1.",
      concept: "counting-missing",
    },
    {
      id: "m3-na-q7",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `df <- data.frame(a = 1:5, b = c(2, 4, 6, 8, 10))
dim(df)`,
      options: ["[1] 5 2", "[1] 2 5", "[1] 10", "[1] 5"],
      answer: 0,
      explanation: "`dim()` gives the number of rows (5) first, then the number of columns (2).",
      optionFeedback: [
        "Correct!",
        "Rows come first, then columns.",
        "`dim()` does not count cells; it gives two numbers.",
        "That is just the number of rows – `nrow(df)`.",
      ],
      concept: "data-dimensions",
    },
  ],
  keyPoints: [
    "`NA` marks a missing value; it takes up a position but its value is unknown.",
    "Any calculation that involves `NA` gives `NA` – that is why `mean()` returns `NA`.",
    "`is.na(x)` finds missing values; `sum(is.na(x))` counts them. Never use `x == NA`.",
    "`na.rm = TRUE` tells `mean()`, `sum()`, `min()`, `max()` and `median()` to skip missing values.",
    "`head()`, `tail()`, `str()` and `summary()` show what a dataset looks like; `nrow()`, `ncol()`, `dim()` and `names()` describe its size and columns.",
    "`colSums(is.na(data))` counts the missing values in every column of a data frame.",
  ],
  concepts: [
    "missing-values",
    "is-na",
    "counting-missing",
    "na-rm",
    "replacing-missing",
    "data-inspection",
    "data-dimensions",
  ],
  glossary: ["na", "missing-data", "median", "quantile"],
  prerequisites: ["data-frames"],
  datasets: ["students", "airquality", "mtcars"],
  playground: `# Inspect a dataset with missing values
head(airquality)
str(airquality)
colSums(is.na(airquality))
mean(airquality$Ozone, na.rm = TRUE)
`,
};
