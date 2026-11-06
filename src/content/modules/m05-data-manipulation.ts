import type { Module } from "../types";
import { importingAndExploringLesson } from "./m05/importing-and-exploring";
import { filteringSortingSelectingLesson } from "./m05/filtering-sorting-selecting";
import { missingDataAndCleaningLesson } from "./m05/missing-data-and-cleaning";
import { dplyrAndTidyrLesson } from "./m05/dplyr-and-tidyr";
import { m05Exercises } from "./m05/exercises";

export const module05: Module = {
  number: 5,
  id: "data-manipulation",
  stage: 2,
  title: "Data Manipulation",
  description: "Import CSV files, explore, filter, sort, select and clean datasets, and use dplyr and tidyr.",
  topics: [
    "Importing CSV files",
    "Exploring datasets",
    "Filtering and sorting",
    "Selecting columns",
    "Handling missing data",
    "Cleaning datasets",
    "Introduction to dplyr",
    "Introduction to tidyr",
  ],
  lessons: [importingAndExploringLesson, filteringSortingSelectingLesson, missingDataAndCleaningLesson, dplyrAndTidyrLesson],
  exercises: m05Exercises,
  checkpoint: [
    {
      id: "m5-cp-q1",
      type: "predict-output",
      prompt: "`patients.csv` holds 150 patients and 9 columns. What does this code print?",
      code: `patients <- read.csv("data/patients.csv")
dim(patients)`,
      options: ["[1] 150   9", "[1]   9 150", "[1] 150", "[1] 1350"],
      answer: 0,
      optionFeedback: [
        "Correct – rows first, then columns.",
        "`dim()` always gives rows first, then columns.",
        "That is what `nrow()` prints.",
        "`dim()` does not multiply the two numbers.",
      ],
      explanation: "`dim()` returns the dimensions of a data frame: the number of rows (150) and then the number of columns (9).",
      concept: "checking-imports",
    },
    {
      id: "m5-cp-q2",
      type: "multiple-choice",
      prompt: "Which code gives the class C students sorted by reading score, highest first?",
      options: [
        "`c_students <- subset(students, class == \"C\")` and then `c_students[order(c_students$reading, decreasing = TRUE), ]`",
        "`sort(subset(students, class == \"C\")$reading)`",
        "`students[order(students$reading), students$class == \"C\"]`",
        "`subset(students, class = \"C\")`",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – filter first, then reorder whole rows with `order()` before the comma.",
        "This sorts only the reading scores (lowest first) and loses the rest of each row.",
        "The class condition is after the comma, where R expects columns.",
        "A single `=` does not compare – and there is no sorting.",
      ],
      explanation: "Filtering keeps the right rows; `order(..., decreasing = TRUE)` placed **before the comma** rearranges entire rows so each student keeps their own data.",
      concept: "sorting",
    },
    {
      id: "m5-cp-q3",
      type: "fill-blank",
      prompt: "Five BMI values are missing. Complete the code so the average BMI is calculated from the known values.",
      code: `patients <- read.csv("data/patients.csv")
mean(patients$bmi, ___ = TRUE)`,
      accept: ["na.rm"],
      hint: "The argument's name means \"NA remove\".",
      explanation: "`na.rm = TRUE` tells `mean()` to ignore missing values. Without it the result is `NA`.",
      concept: "missing-values",
    },
    {
      id: "m5-cp-q4",
      type: "find-error",
      prompt: "After this code, the table still shows city names with extra spaces. Which line is the problem?",
      code: `customers <- read.csv("data/customers_messy.csv")
trimws(customers$city)
customers$city <- tolower(customers$city)
table(customers$city)`,
      errorLine: 2,
      errorKind: "logic",
      fix: `customers <- read.csv("data/customers_messy.csv")
customers$city <- trimws(customers$city)
customers$city <- tolower(customers$city)
table(customers$city)`,
      explanation: "Line 2 only *prints* the trimmed cities – the result is never stored. Assign it back with `customers$city <- trimws(customers$city)`, as line 3 does for `tolower()`.",
      concept: "text-cleaning",
    },
    {
      id: "m5-cp-q5",
      type: "predict-output",
      prompt: "What does this pipeline print?",
      code: `library(dplyr)
df <- data.frame(team = c("x", "y", "x", "y", "x"),
                 points = c(3, 1, 2, 5, 4))
df |>
  group_by(team) |>
  summarise(total = sum(points)) |>
  as.data.frame()`,
      options: [
        `  team total
1    x     9
2    y     6`,
        `  total
1    15`,
        `  team total
1    x     3
2    y     1`,
        `  team points
1    x     9
2    y     6`,
      ],
      answer: 0,
      optionFeedback: [
        "Correct – x has 3 + 2 + 4 = 9 points and y has 1 + 5 = 6.",
        "That would be the result without `group_by()`.",
        "`sum()` adds all the points of each team, not just the first one.",
        "The new column is called `total`, the name given in `summarise()`.",
      ],
      explanation: "`group_by(team)` splits the rows into team x and team y, and `summarise(total = sum(points))` adds up the points within each team, giving one row per team.",
      concept: "group-summaries",
    },
  ],
};
