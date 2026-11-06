import type { Lesson } from "../../types";

export const vectorsLesson: Lesson = {
  id: "vectors",
  module: 3,
  title: "Vectors: Many Values in One Variable",
  summary: "Store a whole row of values in one variable, do maths on all of them at once, and pick out exactly the values you need.",
  minutes: 35,
  objectives: [
    "Create vectors with c(), the colon operator :, seq() and rep()",
    "Count how many values a vector holds with length()",
    "Do arithmetic on every value of a vector at once (vectorization)",
    "Pick values by position, skip values with negative indices and filter values with a condition",
    "Change, add and remove values in a vector",
  ],
  intro:
    "Until now, each variable you created held just one value, like `age <- 16`. Real data is almost never one value: a class has many test scores, a week has seven temperatures, a shop has hundreds of prices.\n\n" +
    "A **vector** is R's way of keeping many values together in one variable, in a fixed order. Picture a row of numbered boxes: box 1 holds the first value, box 2 the second, and so on. You can do maths on the whole row in one go, or reach into a single box by its number.\n\n" +
    "Vectors are the most important building block in R. In fact, even a single number such as `5` is a vector with one value – that is why R prints `[1]` in front of every result.",
  sections: [
    {
      id: "creating-vectors",
      title: "Creating a vector with c()",
      blocks: [
        {
          kind: "definition",
          term: "Vector",
          md: "An ordered collection of values that all have the **same basic type** (all numbers, all text, or all TRUE/FALSE). Each value sits at a numbered position, starting at 1.",
        },
        {
          kind: "text",
          md: "The usual way to make a vector is the function `c()`. The *c* stands for **combine**: it takes the values you give it, separated by commas, and joins them into one vector.",
        },
        {
          kind: "code",
          example: {
            id: "scores-basic",
            title: "Your first vector",
            code: `scores <- c(80, 90, 100)
scores`,
            explanation: [
              { code: "scores", text: "`scores` is the **variable name** – the label on the box where the vector is stored." },
              { code: "<-", text: "`<-` is the **assignment arrow**: it stores the value on its right in the variable on its left." },
              { code: "c(80, 90, 100)", text: "`c()` **combines** the values inside the brackets into one vector. The commas separate the values." },
              { code: "80, 90, 100", text: "`80`, `90` and `100` are **numeric** values (numbers). Because they are all numbers, the vector is a numeric vector." },
              { code: "scores", text: "Typing the variable name on its own line prints the whole vector." },
            ],
            output: `[1]  80  90 100`,
            outputNote:
              "All three values come back in the order you typed them. `[1]` means \"the first value on this line is at position 1\". R adds a few spaces so that the numbers line up neatly on the right.",
          },
        },
        { kind: "diagram", name: "vector", caption: "A vector is a row of boxes. Each box has a position number, starting at [1]." },
        {
          kind: "text",
          md: "Once your values are in a vector, the functions you already know work on all of them together. You no longer need one variable per score.",
        },
        {
          kind: "code",
          example: {
            id: "scores-summary",
            title: "Summarising a vector",
            code: `scores <- c(80, 90, 100)

mean(scores)
max(scores)
min(scores)
sum(scores)`,
            explanation: [
              { code: "scores <- c(80, 90, 100)", text: "Create the vector of three scores (the blank line after it is just for readability)." },
              { code: "mean(scores)", text: "`mean()` adds up all the values and divides by how many there are: (80 + 90 + 100) / 3 = 90." },
              { code: "max(scores)", text: "`max()` returns the largest value." },
              { code: "min(scores)", text: "`min()` returns the smallest value." },
              { code: "sum(scores)", text: "`sum()` adds all the values together." },
            ],
            output: `[1] 90
[1] 100
[1] 80
[1] 270`,
            outputNote: "Each function looks at the **whole** vector and gives back a single number, so each result is printed on its own `[1]` line.",
            tryIt: "Add a fourth score: change the first line to `scores <- c(80, 90, 100, 70)`. Which results change, and why?",
          },
        },
        {
          kind: "text",
          md: "Vectors are not only for numbers. You can make a vector of text (a **character** vector) or a vector of `TRUE`/`FALSE` values (a **logical** vector).",
        },
        {
          kind: "code",
          example: {
            id: "vector-types",
            title: "Character and logical vectors",
            code: `friends <- c("Ana", "Ben", "Chloe")
passed <- c(TRUE, FALSE, TRUE)

friends
passed
class(friends)
class(passed)`,
            explanation: [
              { code: `friends <- c("Ana", "Ben", "Chloe")`, text: "A character vector: each value is text, so each one is wrapped in quotes." },
              { code: "passed <- c(TRUE, FALSE, TRUE)", text: "A logical vector: `TRUE` and `FALSE` are written in capitals and **without** quotes." },
              { code: "class(friends)", text: "`class()` tells you what type of values a vector holds." },
            ],
            output: `[1] "Ana"   "Ben"   "Chloe"
[1]  TRUE FALSE  TRUE
[1] "character"
[1] "logical"`,
            outputNote: "Text is printed with quotes, logical values without. R pads the values with spaces so they line up in columns.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "One vector, one type",
          md: "A vector can only hold **one** type. If you mix types, R quietly converts everything to the most flexible type – this is called **coercion**. Text is the most flexible, so `c(1, \"two\", TRUE)` turns every value into text. A number mixed with `TRUE`/`FALSE` turns the logical values into numbers (`TRUE` becomes 1, `FALSE` becomes 0).",
        },
        {
          kind: "code",
          example: {
            id: "mixed-types",
            title: "What happens when you mix types",
            code: `mixed <- c(1, "two", TRUE)
mixed
class(mixed)

c(1, TRUE, FALSE)`,
            explanation: [
              { code: `mixed <- c(1, "two", TRUE)`, text: "We combine a number, some text and a logical value." },
              { code: "mixed", text: "Every value now has quotes: R turned them all into text." },
              { code: "c(1, TRUE, FALSE)", text: "Numbers and logical values: the logical values become numbers." },
            ],
            output: `[1] "1"    "two"  "TRUE"
[1] "character"
[1] 1 1 0`,
            outputNote: "`\"1\"` in quotes is text, not a number any more – you could not calculate with it. When a vector unexpectedly shows quotes around numbers, a stray piece of text is usually the cause.",
          },
        },
      ],
    },
    {
      id: "sequences",
      title: "Shortcuts for making vectors: :, seq() and rep()",
      blocks: [
        {
          kind: "text",
          md: "Typing `c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)` is slow. R has three shortcuts for vectors that follow a pattern.\n\n" +
            "- `from:to` – the **colon operator** counts in steps of 1.\n" +
            "- `seq()` – makes a **sequence** with any step size.\n" +
            "- `rep()` – **repeats** values.",
        },
        {
          kind: "code",
          example: {
            id: "colon-operator",
            title: "Counting with :",
            code: `1:10
5:1
1:30`,
            explanation: [
              { code: "1:10", text: "Every whole number from 1 up to 10." },
              { code: "5:1", text: "If the first number is bigger, R counts down." },
              { code: "1:30", text: "A longer vector, so R needs two lines to print it." },
            ],
            output: ` [1]  1  2  3  4  5  6  7  8  9 10
[1] 5 4 3 2 1
 [1]  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25
[26] 26 27 28 29 30`,
            outputNote:
              "Look at the last two lines: when a vector is too long for one line, R starts a new line and tells you the position of its first value. `[26]` means \"this line starts with the 26th value\". Now you know what the `[1]` you have been seeing all along really means!",
          },
        },
        {
          kind: "code",
          example: {
            id: "seq-examples",
            title: "Sequences with seq()",
            code: `seq(from = 0, to = 100, by = 25)
seq(1, 10, by = 2)
seq(0, 1, length.out = 5)`,
            explanation: [
              { code: "seq(from = 0, to = 100, by = 25)", text: "Start at 0, stop at 100, and go up in steps of 25." },
              { code: "seq(1, 10, by = 2)", text: "The first two arguments are `from` and `to`, so you can leave out their names. Counting by 2 from 1 gives the odd numbers; 11 would pass 10, so R stops at 9." },
              { code: "seq(0, 1, length.out = 5)", text: "`length.out` asks for exactly 5 evenly spaced values between 0 and 1. R works out the step size for you." },
            ],
            output: `[1]   0  25  50  75 100
[1] 1 3 5 7 9
[1] 0.00 0.25 0.50 0.75 1.00`,
            tryIt: "Make the sequence 10, 20, 30, …, 100 with `seq()`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "rep-examples",
            title: "Repeating values with rep()",
            code: `rep(0, times = 5)
rep(c("A", "B"), times = 3)
rep(c("A", "B"), each = 3)`,
            explanation: [
              { code: "rep(0, times = 5)", text: "Repeat the value 0 five times – handy for starting a vector of zeros." },
              { code: `rep(c("A", "B"), times = 3)`, text: "`times` repeats the **whole** vector: A B, A B, A B." },
              { code: `rep(c("A", "B"), each = 3)`, text: "`each` repeats **each value** before moving on: A A A, then B B B." },
            ],
            output: `[1] 0 0 0 0 0
[1] "A" "B" "A" "B" "A" "B"
[1] "A" "A" "A" "B" "B" "B"`,
          },
        },
        {
          kind: "text",
          md: "To find out how many values a vector holds, use `length()`. You will use it constantly – for example to count how many students, days or answers you have.",
        },
        {
          kind: "code",
          example: {
            id: "length-example",
            title: "Counting values with length()",
            code: `temperatures <- c(21.5, 23.0, 19.8, 25.1, 22.4)
length(temperatures)
length(1:100)`,
            explanation: [
              { code: "temperatures <- c(21.5, 23.0, 19.8, 25.1, 22.4)", text: "Five temperatures (decimal numbers are fine in a numeric vector)." },
              { code: "length(temperatures)", text: "`length()` counts the values: 5." },
              { code: "length(1:100)", text: "`1:100` creates 100 numbers, so its length is 100." },
            ],
            output: `[1] 5
[1] 100`,
          },
        },
        {
          kind: "question",
          question: {
            id: "m3-vec-q1",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `seq(2, 10, by = 4)`,
            options: ["[1]  2  6 10", "[1] 2 4 6 8 10", "[1] 2 10 4", "[1]  2  6"],
            answer: 0,
            explanation: "`seq()` starts at 2 and adds 4 each step: 2, 6, 10. The next value, 14, would be past 10, so the sequence stops.",
            optionFeedback: [
              "Correct!",
              "That would be `seq(2, 10, by = 2)`. Here the step (`by`) is 4.",
              "`seq()` does not just list its arguments – it builds a sequence from them.",
              "10 is exactly reachable (2 + 4 + 4), so it is included.",
            ],
            concept: "sequences",
          },
        },
      ],
    },
    {
      id: "vectorized-arithmetic",
      title: "Doing maths on a whole vector at once",
      blocks: [
        {
          kind: "definition",
          term: "Vectorization",
          md: "Applying an operation to **every value** of a vector at once, without writing a step for each value yourself. Most R operators and functions are vectorized.",
        },
        {
          kind: "code",
          example: {
            id: "vector-math",
            title: "One operation, every value",
            code: `prices <- c(10, 20, 30)

prices * 2
prices + 5
prices / 10`,
            explanation: [
              { code: "prices <- c(10, 20, 30)", text: "A vector of three prices." },
              { code: "prices * 2", text: "Each price is multiplied by 2: 10×2, 20×2, 30×2." },
              { code: "prices + 5", text: "Add 5 to each price." },
              { code: "prices / 10", text: "Divide each price by 10." },
            ],
            output: `[1] 20 40 60
[1] 15 25 35
[1] 1 2 3`,
            outputNote: "Every result is a new vector with the same length as `prices`. The original `prices` vector is **not** changed – to keep a result, assign it, e.g. `doubled <- prices * 2`.",
            tryIt: "A shop has a 10% discount. Calculate the new prices with `prices * 0.9`.",
          },
        },
        {
          kind: "text",
          md: "When you combine **two** vectors of the same length, R works **position by position**: the first value with the first value, the second with the second, and so on.",
        },
        {
          kind: "code",
          example: {
            id: "two-vectors",
            title: "Adding two vectors",
            code: `math <- c(70, 85, 90)
reading <- c(80, 75, 95)

total <- math + reading
total
total / 2`,
            explanation: [
              { code: "math <- c(70, 85, 90)", text: "Math scores of three students." },
              { code: "reading <- c(80, 75, 95)", text: "Reading scores of the same three students, in the same order." },
              { code: "total <- math + reading", text: "70 + 80, 85 + 75 and 90 + 95, stored in `total`." },
              { code: "total / 2", text: "Each student's average of the two tests." },
            ],
            output: `[1] 150 160 185
[1] 75.0 80.0 92.5`,
            outputNote: "In the second line R shows every number with one decimal place, because one of them (92.5) needs it. 75.0 is just 75.",
          },
        },
        {
          kind: "code",
          example: {
            id: "steps-functions",
            title: "Useful functions for numeric vectors",
            code: `steps <- c(4200, 8100, 6500, 10200, 7300)

sum(steps)
mean(steps)
sort(steps)
sort(steps, decreasing = TRUE)`,
            explanation: [
              { code: "steps <- c(4200, 8100, 6500, 10200, 7300)", text: "Steps walked on five days." },
              { code: "sum(steps)", text: "Total steps over all five days." },
              { code: "mean(steps)", text: "The average number of steps per day." },
              { code: "sort(steps)", text: "`sort()` returns the values from smallest to largest." },
              { code: "sort(steps, decreasing = TRUE)", text: "With `decreasing = TRUE` the order is reversed: largest first." },
            ],
            output: `[1] 36300
[1] 7260
[1]  4200  6500  7300  8100 10200
[1] 10200  8100  7300  6500  4200`,
          },
        },
        {
          kind: "callout",
          tone: "note",
          title: "Recycling: when the lengths differ",
          md: "If two vectors have different lengths, R **recycles** (reuses) the shorter one from the start. `c(1, 2, 3, 4) * c(1, 10)` gives `1 20 3 40`, because `c(1, 10)` is reused as `1, 10, 1, 10`. That is also why `prices * 2` works: the single value 2 is reused for every price. If the longer length is not a multiple of the shorter one, R warns you: *longer object length is not a multiple of shorter object length*. That warning almost always means a mistake.",
        },
      ],
    },
    {
      id: "indexing",
      title: "Picking values by position",
      blocks: [
        {
          kind: "definition",
          term: "Index",
          md: "The position number of a value inside a vector. In R the **first** value has index **1** (not 0, as in some other languages). You write the index in square brackets: `x[2]` means \"the value at position 2 of `x`\".",
        },
        { kind: "diagram", name: "indexing", caption: "Square brackets select values: by position, by several positions, by leaving positions out, or by a condition." },
        {
          kind: "text",
          md: "Put one position inside the square brackets to get one value. To pick **several** values, put a **vector** of positions inside the brackets – made with `c()` or with `:`.",
        },
        {
          kind: "code",
          example: {
            id: "index-positions",
            title: "Picking values by position",
            code: `fruits <- c("apple", "banana", "cherry", "date")

fruits[1]
fruits[length(fruits)]
fruits[c(1, 3)]
fruits[2:4]`,
            explanation: [
              { code: `fruits <- c("apple", "banana", "cherry", "date")`, text: "A character vector with four values." },
              { code: "fruits[1]", text: "The value at position 1." },
              { code: "fruits[length(fruits)]", text: "`length(fruits)` is 4, so this is `fruits[4]` – the **last** value. This trick works whatever the length of the vector." },
              { code: "fruits[c(1, 3)]", text: "Positions 1 and 3. Note the `c()` – the positions must themselves be a vector." },
              { code: "fruits[2:4]", text: "`2:4` is the vector 2, 3, 4, so we get the values at positions 2 to 4." },
            ],
            output: `[1] "apple"
[1] "date"
[1] "apple"  "cherry"
[1] "banana" "cherry" "date"`,
            tryIt: "Try `fruits[c(4, 1)]` – you choose the order! What do you get with `fruits[5]`? (There is no fifth fruit, so R answers `NA`, which means \"missing\".)",
          },
        },
        {
          kind: "text",
          md: "A **negative** index means \"everything **except** this position\". It is the quickest way to drop values.",
        },
        {
          kind: "code",
          example: {
            id: "negative-index",
            title: "Leaving values out with negative indices",
            code: `fruits <- c("apple", "banana", "cherry", "date")

fruits[-1]
fruits[-c(1, 2)]
fruits[-length(fruits)]`,
            explanation: [
              { code: "fruits[-1]", text: "Everything except position 1." },
              { code: "fruits[-c(1, 2)]", text: "Everything except positions 1 and 2. The minus goes in front of the whole `c()`." },
              { code: "fruits[-length(fruits)]", text: "Everything except the last value." },
            ],
            output: `[1] "banana" "cherry" "date"
[1] "cherry" "date"
[1] "apple"  "banana" "cherry"`,
            outputNote: "`fruits` itself still has all four values – indexing shows you a selection without changing the original.",
          },
        },
      ],
    },
    {
      id: "logical-indexing",
      title: "Picking values with a condition",
      blocks: [
        {
          kind: "text",
          md: "Often you do not know the positions you want – you know a **rule**, such as \"scores above 80\". A comparison like `scores > 80` checks every value and gives back a logical vector: `TRUE` where the rule holds, `FALSE` where it does not.\n\n" +
            "Now the clever part: put that logical vector inside square brackets and R keeps only the values where it is `TRUE`. This is called **logical indexing** (or filtering).",
        },
        {
          kind: "code",
          example: {
            id: "logical-index",
            title: "Filtering a vector",
            code: `scores <- c(72, 95, 88, 60, 79)

scores > 80
scores[scores > 80]
scores[scores < 75]
sum(scores > 80)`,
            explanation: [
              { code: "scores <- c(72, 95, 88, 60, 79)", text: "Five test scores." },
              { code: "scores > 80", text: "Is each score greater than 80? R answers once per value: only the 2nd (95) and 3rd (88) are `TRUE`." },
              { code: "scores[scores > 80]", text: "Read it as \"scores, where scores are greater than 80\". Only the values at the `TRUE` positions, 95 and 88, survive." },
              { code: "scores[scores < 75]", text: "The scores below 75." },
              { code: "sum(scores > 80)", text: "`TRUE` counts as 1 and `FALSE` as 0, so `sum()` of a logical vector **counts** how many values meet the rule." },
            ],
            output: `[1] FALSE  TRUE  TRUE FALSE FALSE
[1] 95 88
[1] 72 60
[1] 2`,
            tryIt: "Find the scores that are 79 or more with `scores[scores >= 79]`.",
          },
        },
        {
          kind: "table",
          caption: "Comparison operators (you will meet them again in Module 4)",
          headers: ["Operator", "Meaning", "Example", "Result"],
          rows: [
            ["`==`", "equal to", "`5 == 5`", "`TRUE`"],
            ["`!=`", "not equal to", "`5 != 3`", "`TRUE`"],
            ["`>`", "greater than", "`5 > 8`", "`FALSE`"],
            ["`<`", "less than", "`5 < 8`", "`TRUE`"],
            ["`>=`", "greater than or equal to", "`5 >= 5`", "`TRUE`"],
            ["`<=`", "less than or equal to", "`4 <= 3`", "`FALSE`"],
          ],
        },
        {
          kind: "text",
          md: "You can use a condition on one vector to pick values from **another** vector of the same length. This works because position 1 of each vector belongs to the same person, position 2 to the next, and so on.",
        },
        {
          kind: "code",
          example: {
            id: "filter-other-vector",
            title: "Who scored above 80?",
            code: `students <- c("Ana", "Ben", "Chloe", "Dev", "Eva")
scores <- c(72, 95, 88, 60, 79)

students[scores > 80]
students[scores == max(scores)]`,
            explanation: [
              { code: `students <- c("Ana", "Ben", "Chloe", "Dev", "Eva")`, text: "Names, in the same order as the scores." },
              { code: "students[scores > 80]", text: "`scores > 80` is `FALSE TRUE TRUE FALSE FALSE`; used on `students` it keeps Ben and Chloe." },
              { code: "students[scores == max(scores)]", text: "`==` means \"is equal to\". This finds the student with the top score." },
            ],
            output: `[1] "Ben"   "Chloe"
[1] "Ben"`,
          },
        },
        {
          kind: "question",
          question: {
            id: "m3-vec-q2",
            type: "multiple-choice",
            prompt: "`ages <- c(12, 25, 17, 40)`. Which code returns only the ages of 18 and over (`25 40`)?",
            options: ["ages[ages >= 18]", "ages >= 18", "ages[2, 4]", "ages[-18]"],
            answer: 0,
            explanation: "`ages >= 18` builds the logical vector `FALSE TRUE FALSE TRUE`; putting it inside `ages[ ]` keeps only the `TRUE` positions.",
            optionFeedback: [
              "Correct!",
              "This gives the TRUE/FALSE answers (`FALSE TRUE FALSE TRUE`), not the ages themselves. Put it inside `ages[ ]`.",
              "A vector has only one dimension, so `[2, 4]` causes an error. Positions 2 and 4 would be `ages[c(2, 4)]`.",
              "A negative index removes a **position**. There is no position 18, so this does not filter by age.",
            ],
            concept: "logical-indexing",
          },
        },
      ],
    },
    {
      id: "modifying",
      title: "Changing, adding and removing values",
      blocks: [
        {
          kind: "text",
          md: "Square brackets also work on the **left** of `<-`. Then they mean \"put a new value in this position\".",
        },
        {
          kind: "code",
          example: {
            id: "modify-one",
            title: "Changing one value",
            code: `scores <- c(80, 90, 100)
scores[2] <- 95
scores`,
            explanation: [
              { code: "scores[2] <- 95", text: "Replace the value at position 2 (90) with 95. The other values stay as they were." },
              { code: "scores", text: "Print the updated vector." },
            ],
            output: `[1]  80  95 100`,
          },
        },
        {
          kind: "code",
          example: {
            id: "modify-condition",
            title: "Changing every value that meets a rule",
            code: `scores <- c(72, 95, 105, 60, 110)
scores[scores > 100] <- 100
scores`,
            explanation: [
              { code: "scores <- c(72, 95, 105, 60, 110)", text: "Two scores are impossible – the test only goes up to 100." },
              { code: "scores[scores > 100] <- 100", text: "Find the positions where the score is above 100 and put 100 there. This is how you fix data in one line." },
            ],
            output: `[1]  72  95 100  60 100`,
            tryIt: "Change the rule so that every score below 65 becomes 65.",
          },
        },
        {
          kind: "code",
          example: {
            id: "add-elements",
            title: "Adding values",
            code: `scores <- c(80, 90, 100)
scores <- c(scores, 75)
scores

scores[6] <- 85
scores
length(scores)`,
            explanation: [
              { code: "scores <- c(scores, 75)", text: "Combine the old vector with a new value and store the result back in `scores`. This adds 75 at the end." },
              { code: "scores[6] <- 85", text: "Assign to position 6, which does not exist yet. R makes the vector longer to reach it." },
              { code: "length(scores)", text: "The vector now has 6 positions." },
            ],
            output: `[1]  80  90 100  75
[1]  80  90 100  75  NA  85
[1] 6`,
            outputNote: "Position 5 was never given a value, so R fills it with `NA` (R's code for a missing value – you will learn all about it later in this module). Adding with `c()` avoids such gaps.",
          },
        },
        {
          kind: "code",
          example: {
            id: "remove-elements",
            title: "Removing values",
            code: `scores <- c(80, 90, 100, 75)
scores <- scores[-2]
scores`,
            explanation: [
              { code: "scores <- scores[-2]", text: "`scores[-2]` is everything except position 2. Assigning it back to `scores` makes the removal permanent." },
            ],
            output: `[1]  80 100  75`,
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Showing is not changing",
          md: "`scores[-2]` on its own only **shows** the vector without position 2. The variable changes only when you assign: `scores <- scores[-2]`. The same goes for `sort(scores)` or `scores * 2`.",
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Forgetting c()",
      wrong: `scores <- 80, 90, 100`,
      error: "unexpected ','",
      why: "Without `c()`, R does not know the three numbers belong together. It reads `scores <- 80` and then finds a comma it cannot make sense of.",
      right: `scores <- c(80, 90, 100)`,
    },
    {
      title: "Picking several positions without c()",
      wrong: `fruits <- c("apple", "banana", "cherry")
fruits[1, 3]`,
      error: "incorrect number of dimensions",
      why: "Inside square brackets a comma separates **dimensions** (rows and columns, which you will meet with matrices and data frames). A vector has only one dimension, so `[1, 3]` makes no sense to R. Wrap the positions in `c()`.",
      right: `fruits <- c("apple", "banana", "cherry")
fruits[c(1, 3)]`,
    },
    {
      title: "Counting positions from 0",
      wrong: `fruits <- c("apple", "banana", "cherry")
fruits[0]`,
      why: "In R the first value is at position **1**. `fruits[0]` does not cause an error – it quietly returns an empty vector, `character(0)`. If you see `character(0)` or `numeric(0)`, check your index.",
      right: `fruits <- c("apple", "banana", "cherry")
fruits[1]`,
    },
    {
      title: "A number typed as text",
      wrong: `ages <- c(25, "30", 41)
mean(ages)`,
      error: "argument is not numeric or logical",
      why: "The quotes around `\"30\"` make it text. One text value turns the whole vector into a character vector (coercion), and `mean()` cannot average text, so it returns `NA` with a warning.",
      right: `ages <- c(25, 30, 41)
mean(ages)`,
    },
  ],
  exerciseIds: ["m3-vector-basics", "m3-vector-indexing"],
  quiz: [
    {
      id: "m3-vec-q3",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- c(4, 8, 15, 16)
length(x)`,
      options: ["[1] 16", "[1] 4", "[1] 43", "[1] 1"],
      answer: 1,
      explanation: "`length()` counts how many values the vector holds – four – not how big they are.",
      optionFeedback: [
        "16 is the largest value; that would be `max(x)`.",
        "Correct!",
        "43 is the total; that would be `sum(x)`.",
        "The vector has four values, not one.",
      ],
      concept: "vector-length",
    },
    {
      id: "m3-vec-q4",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- c(10, 20, 30, 40)
x[-2]`,
      options: ["[1] 20", "[1] 10 30 40", "[1] 30 40", "[1] 10 20 30"],
      answer: 1,
      explanation: "A negative index means \"everything except\" that position. Position 2 holds 20, so you get the other three values.",
      optionFeedback: [
        "`x[2]` would give 20. The minus sign removes position 2 instead.",
        "Correct!",
        "`-2` removes only one position (the second), not the first two.",
        "That would remove the last value (`x[-4]`).",
      ],
      concept: "negative-indexing",
    },
    {
      id: "m3-vec-q5",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `prices <- c(2, 4, 6)
prices * 10`,
      options: ["[1] 20 40 60", "[1] 120", "[1] 2 4 6 10", "[1] 20"],
      answer: 0,
      explanation: "Arithmetic is vectorized: every value is multiplied by 10.",
      optionFeedback: [
        "Correct!",
        "R does not add the values up first – it multiplies each one.",
        "`*` multiplies; it does not add 10 to the end of the vector.",
        "The result has one value per price, not just the first.",
      ],
      concept: "vectorized-arithmetic",
    },
    {
      id: "m3-vec-q6",
      type: "fill-blank",
      prompt: "Complete the code so that it keeps only the values greater than 50.",
      code: `values <- c(12, 67, 45, 89)
big <- values[___]
big`,
      accept: ["values > 50", "values>50", "50 < values"],
      hint: "Inside the square brackets, write a comparison that is TRUE for the values you want.",
      explanation: "`values > 50` gives `FALSE TRUE FALSE TRUE`; inside `values[ ]` it keeps 67 and 89.",
      concept: "logical-indexing",
    },
    {
      id: "m3-vec-q7",
      type: "find-error",
      prompt: "This code should show the first two temperatures. Click the line with the mistake.",
      code: `temps <- c(18, 21, 25)
temps[1, 2]`,
      errorLine: 2,
      errorKind: "error",
      fix: `temps <- c(18, 21, 25)
temps[c(1, 2)]`,
      explanation: "A vector has one dimension, so `[1, 2]` gives *incorrect number of dimensions*. Several positions must be combined into a vector first: `temps[c(1, 2)]` (or `temps[1:2]`).",
      concept: "indexing",
    },
    {
      id: "m3-vec-q8",
      type: "true-false",
      prompt: "In R, the first value of a vector is at position 0.",
      answer: false,
      explanation: "R counts from **1**: `x[1]` is the first value. `x[0]` returns an empty vector.",
      concept: "indexing",
    },
  ],
  keyPoints: [
    "A vector stores many values of the same type, in order; `c()` combines values into a vector.",
    "`:`, `seq()` and `rep()` build vectors that follow a pattern; `length()` counts the values.",
    "Arithmetic and functions such as `sum()` and `mean()` work on a whole vector at once (vectorization).",
    "`x[2]` picks by position (starting at 1), `x[c(1, 3)]` picks several, and `x[-1]` leaves a position out.",
    "`x[x > 80]` keeps only the values that meet a condition (logical indexing), and `sum(x > 80)` counts them.",
    "Square brackets on the left of `<-` change values: `x[2] <- 95` or `x[x > 100] <- 100`.",
  ],
  concepts: [
    "vectors",
    "creating-vectors",
    "sequences",
    "vector-length",
    "vectorized-arithmetic",
    "indexing",
    "negative-indexing",
    "logical-indexing",
    "modifying-vectors",
  ],
  glossary: ["vector", "index", "vectorization", "recycling", "coercion", "subsetting"],
  playground: `# Play with vectors!
scores <- c(80, 90, 100, 65, 72)

mean(scores)
scores[2]
scores[scores > 75]
scores * 1.1
`,
};
