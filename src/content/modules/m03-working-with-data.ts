import type { Module } from "../types";
import { vectorsLesson } from "./m03/vectors";
import { listsMatricesFactorsLesson } from "./m03/lists-matrices-factors";
import { dataFramesLesson } from "./m03/data-frames";
import { missingValuesLesson } from "./m03/missing-values";
import { m03Exercises } from "./m03/exercises";

export const module03: Module = {
  number: 3,
  id: "working-with-data",
  stage: 1,
  title: "Working with Data",
  description: "Organise data in vectors, lists, matrices, factors and data frames, access and change values, handle NA and inspect data.",
  topics: [
    "Vectors",
    "Lists",
    "Matrices",
    "Factors",
    "Data frames",
    "Accessing and modifying data",
    "Missing values (NA)",
    "Basic data inspection",
  ],
  lessons: [vectorsLesson, listsMatricesFactorsLesson, dataFramesLesson, missingValuesLesson],
  exercises: m03Exercises,
  checkpoint: [
    {
      id: "m3-cp-q1",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- c(5, 10, 15, 20)
x[x > 8]`,
      options: ["[1] 10 15 20", "[1] FALSE  TRUE  TRUE  TRUE", "[1] 2 3 4", "[1] 5"],
      answer: 0,
      explanation: "`x > 8` is `FALSE TRUE TRUE TRUE`; inside the square brackets it keeps the values where the condition is TRUE.",
      optionFeedback: [
        "Correct!",
        "That is the condition on its own. Used inside `x[ ]`, it selects values.",
        "Those are the **positions** of the values (what `which(x > 8)` would give), not the values themselves.",
        "5 is the only value that is **not** greater than 8.",
      ],
      concept: "logical-indexing",
    },
    {
      id: "m3-cp-q2",
      type: "multiple-choice",
      prompt: "You want to store one student's name (text), age (a number) and all of her test scores (a vector of five numbers) in a single object. Which structure fits best?",
      options: ["A vector made with c()", "A matrix", "A list", "A factor"],
      answer: 2,
      explanation: "Only a list can hold elements of different types and lengths side by side.",
      optionFeedback: [
        "A vector holds one type only – the numbers would be turned into text.",
        "A matrix is a grid of a single type, so it cannot mix text and numbers either.",
        "Correct!",
        "A factor stores categories, such as sizes or answers, not a mixed record.",
      ],
      concept: "lists",
    },
    {
      id: "m3-cp-q3",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `f <- factor(c("b", "a", "b", "c", "b"))
levels(f)`,
      options: ["[1] \"a\" \"b\" \"c\"", "[1] \"b\" \"a\" \"b\" \"c\" \"b\"", "[1] \"b\" \"a\" \"c\"", "[1] 3"],
      answer: 0,
      explanation: "`levels()` lists each category once. Unless you give your own order, the levels are sorted alphabetically.",
      optionFeedback: [
        "Correct!",
        "Those are all the values; each level appears only once.",
        "Levels are sorted alphabetically, not in the order they first appear.",
        "That would be `nlevels(f)`.",
      ],
      concept: "factor-levels",
    },
    {
      id: "m3-cp-q4",
      type: "fill-blank",
      prompt: "Complete the code so that it counts the missing values in the `Ozone` column of the built-in `airquality` dataset.",
      code: `n_missing <- sum(___(airquality$Ozone))
n_missing`,
      accept: ["is.na"],
      hint: "Which function answers \"is this value missing?\" with TRUE or FALSE?",
      explanation: "`is.na()` returns TRUE for each missing value and `sum()` counts the TRUEs – 37 for `Ozone`.",
      concept: "counting-missing",
    },
    {
      id: "m3-cp-q5",
      type: "find-error",
      prompt: "`seats` is a grid with 3 rows and 4 columns. This code should show the value in **row 1, column 4**. Click the line with the mistake.",
      code: `seats <- matrix(1:12, nrow = 3)
seats[4, 1]`,
      errorLine: 2,
      errorKind: "error",
      fix: `seats <- matrix(1:12, nrow = 3)
seats[1, 4]`,
      explanation: "Inside `[ , ]` the row comes first. `seats[4, 1]` asks for row 4, which does not exist, so R stops with *subscript out of bounds*. The same `[row, column]` rule applies to data frames.",
      concept: "matrix-indexing",
    },
  ],
};
