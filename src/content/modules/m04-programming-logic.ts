import type { Module } from "../types";
import { conditionsLesson } from "./m04/conditions";
import { loopsLesson } from "./m04/loops";
import { functionsLesson } from "./m04/functions";
import { m04Exercises } from "./m04/exercises";

export const module04: Module = {
  number: 4,
  id: "programming-logic",
  stage: 1,
  title: "Programming Logic",
  description: "Make decisions with if/else, repeat work with loops, and write your own reusable functions.",
  topics: [
    "Conditional statements (if, else, else if)",
    "Comparison and logical operators",
    "for loops",
    "while loops",
    "Writing basic functions",
    "Function arguments and return values",
  ],
  lessons: [conditionsLesson, loopsLesson, functionsLesson],
  exercises: m04Exercises,
  checkpoint: [
    {
      id: "m4-cp-q1",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- c(3, 8, 12)
x > 5 & x < 10`,
      options: ["[1] FALSE  TRUE FALSE", "[1] 8", "[1] TRUE", "[1]  TRUE  TRUE FALSE"],
      answer: 0,
      explanation: "`&` works value by value: only 8 is both greater than 5 **and** less than 10.",
      optionFeedback: [
        "Correct!",
        "A condition returns TRUE/FALSE values. `x[x > 5 & x < 10]` would return 8.",
        "With a vector, `&` gives one answer per value, not a single answer.",
        "3 is not greater than 5, so the first answer is FALSE.",
      ],
      concept: "logical-operators",
    },
    {
      id: "m4-cp-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `shipping <- function(total, member = FALSE) {
  if (member || total >= 50) {
    0
  } else {
    4.99
  }
}
shipping(30)
shipping(30, member = TRUE)`,
      options: ["[1] 4.99\n[1] 0", "[1] 0\n[1] 0", "[1] 4.99\n[1] 4.99", "[1] 0\n[1] 4.99"],
      answer: 0,
      explanation: "In the first call `member` uses its default `FALSE` and 30 is below 50, so the `else` block returns 4.99. In the second call `member` is TRUE, so `||` is TRUE and the function returns 0.",
      optionFeedback: [
        "Correct!",
        "In the first call, neither condition is TRUE: `member` defaults to FALSE and 30 < 50.",
        "In the second call `member = TRUE`, and `||` needs only one TRUE side.",
        "The two results are the other way round.",
      ],
      concept: "default-arguments",
    },
    {
      id: "m4-cp-q3",
      type: "multiple-choice",
      prompt: "You want to keep rolling a die until you get a six, but you can't know in advance how many rolls that takes. Which tool fits best?",
      options: ["A for loop over 1:6", "A while loop", "ifelse()", "seq_along()"],
      answer: 1,
      explanation: "A `while` loop repeats as long as a condition is TRUE (\"not a six yet\"), however many repetitions that takes.",
      optionFeedback: [
        "A `for` loop runs a fixed number of times, known in advance.",
        "Correct!",
        "`ifelse()` makes one decision per value of a vector; it does not repeat anything.",
        "`seq_along()` lists the positions of a vector you already have.",
      ],
      concept: "while-loops",
    },
    {
      id: "m4-cp-q4",
      type: "fill-blank",
      prompt: "Complete the function so that it gives back `\"negative\"` and stops immediately when `x` is below 0.",
      code: `check_sign <- function(x) {
  if (x < 0) {
    ___("negative")
  }
  "not negative"
}
check_sign(-4)`,
      accept: ["return"],
      hint: "Which function hands a value back and ends the function early?",
      explanation: "`return(\"negative\")` hands the value back and stops the function, so the last line is never reached for negative numbers.",
      concept: "return-values",
    },
    {
      id: "m4-cp-q5",
      type: "find-error",
      prompt: "This code should add up the numbers 1 to 4 (the answer should be 10), but it prints 4. Click the faulty line.",
      code: `total <- 0
for (n in 1:4) {
  total <- n
}
total`,
      errorLine: 3,
      errorKind: "logic",
      fix: `total <- 0
for (n in 1:4) {
  total <- total + n
}
total`,
      explanation: "`total <- n` replaces the total in every iteration instead of adding to it, so only the last value survives. The update must build on the old value: `total <- total + n`.",
      concept: "accumulating-results",
    },
  ],
};
