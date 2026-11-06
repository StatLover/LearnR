import type { Module } from "../types";
import { advancedFunctionsLesson } from "./m08/advanced-functions-and-scope";
import { applyFamilyLesson } from "./m08/apply-family-and-transformations";
import { datesStringsLesson } from "./m08/dates-strings-and-regex";
import { packagesDebuggingLesson } from "./m08/packages-and-debugging";
import { module08Exercises } from "./m08/exercises";

export const module08: Module = {
  number: 8,
  id: "intermediate-r",
  stage: 3,
  title: "Intermediate R",
  description: "Write more powerful functions, understand scope, use the apply family, work with dates, strings and regular expressions, packages, and debug code.",
  topics: [
    "Advanced functions",
    "Function scope",
    "Apply-family functions",
    "Working with dates",
    "Strings and regular expressions",
    "Packages and libraries",
    "Data transformations",
    "Debugging techniques",
  ],
  lessons: [advancedFunctionsLesson, applyFamilyLesson, datesStringsLesson, packagesDebuggingLesson],
  exercises: module08Exercises,
  checkpoint: [
    {
      id: "m8-cp-q1",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- 5

change_x <- function() {
  x <- 100
  x * 2
}

change_x()
x`,
      options: ["[1] 200\n[1] 5", "[1] 200\n[1] 100", "[1] 10\n[1] 5", "[1] 200\n[1] 200"],
      answer: 0,
      optionFeedback: [
        "Correct – the function uses its own local `x`, and the global `x` is untouched.",
        "`x <- 100` inside the function creates a *local* variable; the global `x` stays 5.",
        "Inside the function, R finds the local `x` (100) before the global one.",
        "The function returns 200, but it does not change the global `x`.",
      ],
      explanation: "Inside `change_x()`, `x <- 100` creates a local variable, so the function returns 100 × 2 = 200. The global `x` is a different variable and is still 5 afterwards.",
      concept: "function-scope",
    },
    {
      id: "m8-cp-q2",
      type: "multiple-choice",
      prompt: "You want the mean of each numeric column of a data frame and you need the result to be **guaranteed** to be a numeric vector with one number per column. Which call fits best?",
      options: [
        "`vapply(df, mean, FUN.VALUE = numeric(1))`",
        "`lapply(df, mean)`",
        "`apply(df, 1, mean)`",
        "`tapply(df, mean)`",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – `vapply()` checks that every answer is exactly one number.",
        "`lapply()` always returns a list, not a vector.",
        "`MARGIN = 1` works on rows, so you would get one mean per row.",
        "`tapply()` needs a vector of values and a grouping variable.",
      ],
      explanation: "A data frame is a list of columns, so the element-wise apply functions visit one column at a time. `vapply()` additionally checks each result against `FUN.VALUE = numeric(1)`, guaranteeing a numeric vector.",
      concept: "vapply",
    },
    {
      id: "m8-cp-q3",
      type: "fill-blank",
      prompt: "Complete the format string so that this date is read correctly.",
      code: `as.Date("July 4, 2023", format = "%B %d, ___")`,
      accept: ["%Y"],
      hint: "The year has four digits.",
      explanation: "`%B` is the full month name, `%d` the day and `%Y` a 4-digit year. The comma and spaces in the format string match those in the text. The result is `\"2023-07-04\"`.",
      concept: "date-formats",
    },
    {
      id: "m8-cp-q4",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `grepl("^[0-9]+$", c("123", "12a", "007"))`,
      options: ["[1]  TRUE FALSE  TRUE", "[1] TRUE TRUE TRUE", "[1]  TRUE FALSE FALSE", "[1] FALSE  TRUE FALSE"],
      answer: 0,
      optionFeedback: [
        "Correct – only strings made entirely of digits match.",
        "`^` and `$` anchor the pattern, so `\"12a\"` (which ends with a letter) does not match.",
        "`\"007\"` consists only of digits, so it matches; leading zeros are still digits.",
        "This is the opposite of the right answer.",
      ],
      explanation: "`^[0-9]+$` means \"from start to end, one or more digits and nothing else\". `\"123\"` and `\"007\"` match; `\"12a\"` contains a letter.",
      concept: "regular-expressions",
    },
    {
      id: "m8-cp-q5",
      type: "multiple-choice",
      prompt: "Your script stops with `Error: object 'sales_data' not found`, although line 3 of the script creates `sales_data`. What is the most likely cause?",
      options: [
        "Line 3 has not been run in this session yet, or the name is spelled differently where it is used.",
        "The dplyr package is not installed.",
        "`sales_data` is too large for R.",
        "R cannot use underscores in variable names.",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – run the script from the top and compare the spelling (including capitals).",
        "A missing package gives `could not find function` or `there is no package called`, not `object not found`.",
        "Size problems give a memory error, not this message.",
        "Underscores are perfectly fine in names (snake_case is the recommended style).",
      ],
      explanation: "`object '...' not found` means R has no variable with that exact name *right now*. Usually the line that creates it has not been run, or there is a typo or capital-letter difference between where it is created and where it is used.",
      concept: "reading-errors",
    },
  ],
};
