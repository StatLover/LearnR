import type { Module } from "../types";
import { variablesAndAssignmentLesson } from "./m02/variables-and-assignment";
import { valuesAndArithmeticLesson } from "./m02/values-and-arithmetic";
import { operatorsAndDataTypesLesson } from "./m02/operators-and-data-types";
import { functionsAndErrorsLesson } from "./m02/functions-and-errors";
import { module02Exercises } from "./m02/exercises";

export const module02: Module = {
  number: 2,
  id: "r-fundamentals",
  stage: 1,
  title: "R Fundamentals",
  description: "Store values in variables, do arithmetic, work with numbers, text and logical values, use built-in functions and read error messages.",
  topics: [
    "Variables and assignment",
    "Numbers, characters and logical values",
    "Basic arithmetic",
    "Operators",
    "Data types and type conversion",
    "Using built-in functions",
    "Understanding error messages",
  ],
  lessons: [variablesAndAssignmentLesson, valuesAndArithmeticLesson, operatorsAndDataTypesLesson, functionsAndErrorsLesson],
  exercises: module02Exercises,
  checkpoint: [
    {
      id: "m2-cp-q1",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `price <- 8
price <- price * 3
price - 4`,
      options: ["[1] 20", "[1] 4", "[1] 24", "[1] 8"],
      answer: 0,
      optionFeedback: [
        "Correct – `price` becomes 8 × 3 = 24, and 24 − 4 = 20.",
        "The second line overwrote `price` with 24 before the subtraction.",
        "24 is the value of `price`, but the last line subtracts 4 from it.",
        "The second line changed `price`, so it is no longer 8.",
      ],
      explanation: "Line 2 updates `price` using its current value (8 × 3 = 24). Line 3 calculates 24 − 4 = 20 and prints it (without changing `price`).",
      concept: "overwriting",
    },
    {
      id: "m2-cp-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `class(as.numeric("7"))`,
      options: [`[1] "numeric"`, `[1] "character"`, "[1] 7", `[1] "logical"`],
      answer: 0,
      optionFeedback: [
        "Correct – `as.numeric()` turned the text into a number, so its class is numeric.",
        "`\"7\"` starts as text, but `as.numeric()` converts it before `class()` looks at it.",
        "`class()` reports the type, not the value.",
        "Nothing here is TRUE or FALSE.",
      ],
      explanation: "R works from the inside out: `as.numeric(\"7\")` returns the number 7, and `class()` of a number is `\"numeric\"`.",
      concept: "type-conversion",
    },
    {
      id: "m2-cp-q3",
      type: "multiple-choice",
      prompt: "What does `17 %% 5` return?",
      options: ["2", "3", "3.4", "85"],
      answer: 0,
      optionFeedback: [
        "Correct – 5 fits into 17 three times (15), leaving 2.",
        "3 is `17 %/% 5`, the whole number of times. `%%` gives the remainder.",
        "3.4 is ordinary division, `17 / 5`.",
        "85 would be `17 * 5`.",
      ],
      explanation: "`%%` is the remainder operator. 17 = 5 × 3 + 2, so `17 %% 5` is 2.",
      concept: "integer-division-remainder",
    },
    {
      id: "m2-cp-q4",
      type: "find-error",
      prompt: "This program stops with an error. Click the line where R stops.",
      code: `first_name <- "Lin"
age <- 31
intro_text <- paste(first_name, "is", age)
Print(intro_text)`,
      errorLine: 4,
      errorKind: "error",
      fix: `first_name <- "Lin"
age <- 31
intro_text <- paste(first_name, "is", age)
print(intro_text)`,
      explanation: "R says `could not find function \"Print\"`. Function names are case-sensitive – the function is `print` in lower case.",
      concept: "error-messages",
    },
    {
      id: "m2-cp-q5",
      type: "fill-blank",
      prompt: "Complete the code so that it rounds the number to two decimal places and prints `[1] 2.72`.",
      code: `round(2.71828, ___ = 2)`,
      accept: ["digits"],
      hint: "It is the name of round()'s second argument.",
      explanation: "`round()` has an argument called `digits` that sets the number of decimal places. `round(2.71828, digits = 2)` gives 2.72.",
      concept: "function-arguments",
    },
  ],
};
