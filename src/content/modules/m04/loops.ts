import type { Lesson } from "../../types";

export const loopsLesson: Lesson = {
  id: "for-and-while-loops",
  module: 4,
  title: "Repeating Work: for and while Loops",
  summary: "Let R repeat code for you: loop over the values of a vector with for, build up results step by step, and repeat until a goal is reached with while.",
  minutes: 40,
  objectives: [
    "Write a for loop that runs code once for each value of a vector",
    "Loop over positions safely with seq_along()",
    "Build up a result (a total, a count or a new vector) inside a loop",
    "Write a while loop that repeats until a condition becomes FALSE",
    "Recognise and avoid infinite loops",
  ],
  intro:
    "Computers are brilliant at doing the same thing many times without getting bored. A **loop** is a piece of code that repeats a block of instructions – once for every item in a list, or again and again until a goal is reached.\n\n" +
    "R has two main loops. A **for loop** says \"for each value in this vector, do this\" – you know in advance how many times it runs. A **while loop** says \"while this condition is TRUE, keep doing this\" – it runs until something changes, such as savings reaching a target.\n\n" +
    "You already know that many R operations are vectorized and do not need a loop (`scores * 2`). Loops are for the jobs where each step depends on the one before, or where you need to do several things per item.",
  sections: [
    {
      id: "for-loops",
      title: "The for loop",
      blocks: [
        {
          kind: "definition",
          term: "Loop",
          md: "Code that runs a block of instructions **repeatedly**. Each single run of the block is called an **iteration**.",
        },
        { kind: "diagram", name: "for-loop-flow", caption: "A for loop takes the next value, runs the body, and repeats until there are no values left." },
        {
          kind: "code",
          example: {
            id: "for-basic",
            title: "Your first loop",
            code: `for (i in 1:3) {
  print(i)
}`,
            explanation: [
              { code: "for (i in 1:3) {", text: "`for` starts the loop. `i` is the **loop variable**; `in 1:3` lists the values it takes, one per iteration: first 1, then 2, then 3. `{` opens the body." },
              { code: "  print(i)", text: "The **body**: the code that is repeated. Each time, `i` holds the current value." },
              { code: "}", text: "The end of the body. R jumps back to the top and takes the next value – until the values run out." },
            ],
            output: `[1] 1
[1] 2
[1] 3`,
            outputNote: "The body ran three times, once for each value of `1:3`. Inside a loop you must use `print()` to see a value – loops do not print automatically.",
            tryIt: "Change `1:3` to `10:15`. Then try `c(2, 4, 8)`.",
          },
        },
        {
          kind: "text",
          md: "The loop variable can take the values of **any** vector, including text. Choose a name that describes one item: `fruit` for a vector of fruits, `score` for a vector of scores.",
        },
        {
          kind: "code",
          example: {
            id: "for-vector",
            title: "Looping over text",
            code: `fruits <- c("apple", "banana", "cherry")

for (fruit in fruits) {
  print(paste("I like", fruit))
}`,
            explanation: [
              { code: "for (fruit in fruits) {", text: "In the first iteration `fruit` is \"apple\", then \"banana\", then \"cherry\"." },
              { code: `  print(paste("I like", fruit))`, text: "`paste()` glues pieces of text together with a space in between; `print()` shows the result." },
            ],
            output: `[1] "I like apple"
[1] "I like banana"
[1] "I like cherry"`,
          },
        },
        {
          kind: "text",
          md: "A loop becomes really useful when it **builds up** a result. The pattern always has three parts: create a starting value **before** the loop, update it **inside** the loop, and use it **after** the loop.",
        },
        {
          kind: "code",
          example: {
            id: "for-sum",
            title: "Adding up a shopping bill",
            code: `prices <- c(4, 10, 6)
total <- 0

for (price in prices) {
  total <- total + price
}
total`,
            explanation: [
              { code: "total <- 0", text: "**Before** the loop: start the total at 0." },
              { code: "for (price in prices) {", text: "Visit each price in turn." },
              { code: "  total <- total + price", text: "**Inside** the loop: the new total is the old total plus the current price." },
              { code: "total", text: "**After** the loop: print the finished total." },
            ],
            output: `[1] 20`,
          },
        },
        {
          kind: "table",
          caption: "What happens in each iteration of the shopping-bill loop",
          headers: ["Iteration", "price", "total before", "total after"],
          rows: [
            ["1", "4", "0", "4"],
            ["2", "10", "4", "14"],
            ["3", "6", "14", "20"],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Did we need a loop?",
          md: "For this simple job, `sum(prices)` gives the same answer in one step – vectorized functions are usually shorter and faster. But the *start – update – use* pattern is the foundation of many tasks that have no ready-made function, so it is well worth learning.",
        },
      ],
    },
    {
      id: "seq-along",
      title: "Looping over positions with seq_along()",
      blocks: [
        {
          kind: "text",
          md: "Sometimes you need the **position** of each value, not just the value – for example to use the same position in two vectors. `seq_along(x)` gives the positions of `x`: `1, 2, 3, …` up to its length.",
        },
        {
          kind: "code",
          example: {
            id: "seq-along-example",
            title: "Two vectors, one loop",
            code: `players <- c("Ana", "Ben", "Chloe")
scores <- c(88, 72, 95)

seq_along(players)

for (i in seq_along(players)) {
  print(paste(players[i], "scored", scores[i]))
}`,
            explanation: [
              { code: "seq_along(players)", text: "The positions of `players`: 1, 2, 3." },
              { code: "for (i in seq_along(players)) {", text: "`i` takes the positions one at a time." },
              { code: `  print(paste(players[i], "scored", scores[i]))`, text: "Use the same position in both vectors, so each name is matched with its own score." },
            ],
            output: `[1] 1 2 3
[1] "Ana scored 88"
[1] "Ben scored 72"
[1] "Chloe scored 95"`,
          },
        },
        {
          kind: "text",
          md: "You might be tempted to write `1:length(x)` instead. It works – until `x` is empty. Then `length(x)` is 0, and `1:0` counts **down** from 1 to 0, so the loop runs twice when it should not run at all. `seq_along()` correctly gives nothing:",
        },
        {
          kind: "code",
          example: {
            id: "seq-along-empty",
            title: "Why seq_along() is safer",
            code: `empty <- c()

1:length(empty)
seq_along(empty)`,
            explanation: [
              { code: "empty <- c()", text: "A vector with nothing in it (this can easily happen, for example after filtering)." },
              { code: "1:length(empty)", text: "`length(empty)` is 0, so this is `1:0` – the values 1 and 0. Wrong!" },
              { code: "seq_along(empty)", text: "No positions at all, so a loop would correctly run zero times." },
            ],
            output: `[1] 1 0
integer(0)`,
            outputNote: "`integer(0)` means \"an integer vector with no values\".",
          },
        },
        {
          kind: "question",
          question: {
            id: "m4-loop-q1",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `total <- 0
for (x in c(2, 4, 6)) {
  total <- total + x
}
total`,
            options: ["[1] 12", "[1] 6", "[1] 2 6 12", "[1] 0"],
            answer: 0,
            explanation: "The total grows from 0 to 2, then 6, then 12. Only the final value is printed, after the loop.",
            optionFeedback: [
              "Correct!",
              "6 is the last value of `x`, but `total` keeps a running sum.",
              "Those are the in-between totals, but nothing is printed inside the loop – only `total` at the end.",
              "`total` is updated inside the loop, so it does not stay 0.",
            ],
            concept: "accumulating-results",
          },
        },
      ],
    },
    {
      id: "building-results",
      title: "Building results inside a loop",
      blocks: [
        {
          kind: "text",
          md: "To create a **new vector** with a loop, first make an empty \"container\" of the right length, then fill one position per iteration. `numeric(n)` creates a numeric vector of `n` zeros, ready to be filled.",
        },
        {
          kind: "code",
          example: {
            id: "build-vector",
            title: "Filling a vector position by position",
            code: `numbers <- c(3, 7, 2, 9)
squares <- numeric(length(numbers))
squares

for (i in seq_along(numbers)) {
  squares[i] <- numbers[i]^2
}
squares`,
            explanation: [
              { code: "squares <- numeric(length(numbers))", text: "An empty container: 4 zeros, one for each number." },
              { code: "for (i in seq_along(numbers)) {", text: "Loop over the positions 1 to 4." },
              { code: "  squares[i] <- numbers[i]^2", text: "Put the square of the number at position `i` into position `i` of `squares`." },
            ],
            output: `[1] 0 0 0 0
[1]  9 49  4 81`,
            outputNote: "Of course `numbers^2` does the same in one step. The fill-a-container pattern matters when each step is more complicated, as in the next example.",
          },
        },
        {
          kind: "text",
          md: "Loops and `if` statements work well together: the loop visits every value, and the `if` decides what to do with it.",
        },
        {
          kind: "code",
          example: {
            id: "loop-with-if",
            title: "Counting hot days",
            code: `temps <- c(12, 25, 31, 18, 28)
hot_days <- 0

for (t in temps) {
  if (t > 24) {
    hot_days <- hot_days + 1
  }
}
hot_days`,
            explanation: [
              { code: "hot_days <- 0", text: "A counter that starts at 0." },
              { code: "  if (t > 24) {", text: "For each temperature, check whether it is hot." },
              { code: "    hot_days <- hot_days + 1", text: "If it is, add 1 to the counter. Otherwise nothing happens." },
            ],
            output: `[1] 3`,
            tryIt: "Also count the cold days (below 15) with a second counter and an `else if`.",
          },
        },
        {
          kind: "text",
          md: "If you do not know in advance how many values you will keep, start with an empty vector `c()` and add to it with `c(old, new)`.",
        },
        {
          kind: "code",
          example: {
            id: "grow-vector",
            title: "Collecting values",
            code: `scores <- c(45, 78, 92, 50, 33)
passed <- c()

for (s in scores) {
  if (s >= 50) {
    passed <- c(passed, s)
  }
}
passed`,
            explanation: [
              { code: "passed <- c()", text: "Start with an empty vector." },
              { code: "    passed <- c(passed, s)", text: "Add the current score to the end of `passed`, but only if it passes." },
            ],
            output: `[1] 78 92 50`,
          },
        },
        {
          kind: "text",
          md: "Two keywords give you extra control inside a loop: `next` skips the rest of the current iteration and moves on to the next value, and `break` stops the loop completely. The example uses `%%`, the remainder after division: `n %% 2 == 0` is TRUE for even numbers.",
        },
        {
          kind: "code",
          example: {
            id: "break-next",
            title: "Skipping and stopping",
            code: `for (n in 1:10) {
  if (n %% 2 == 0) {
    next
  }
  if (n > 7) {
    break
  }
  print(n)
}`,
            explanation: [
              { code: "  if (n %% 2 == 0) {", text: "Is `n` even (no remainder when divided by 2)?" },
              { code: "    next", text: "Then skip the rest of the body and go straight to the next value." },
              { code: "    break", text: "Once `n` is above 7, leave the loop for good – 9 is never printed." },
            ],
            output: `[1] 1
[1] 3
[1] 5
[1] 7`,
          },
        },
      ],
    },
    {
      id: "while-loops",
      title: "The while loop",
      blocks: [
        {
          kind: "text",
          md: "A **while loop** repeats its body **as long as** a condition is TRUE. R checks the condition before every iteration; as soon as it is FALSE, the loop ends. Use `while` when you do not know how many repetitions you need – \"keep saving until I have 200\", \"keep rolling until I get a six\".",
        },
        { kind: "diagram", name: "while-loop-flow", caption: "A while loop checks its condition first; if TRUE it runs the body and checks again, if FALSE it stops." },
        {
          kind: "code",
          example: {
            id: "while-basic",
            title: "Counting with while",
            code: `count <- 1

while (count <= 3) {
  print(paste("Count is", count))
  count <- count + 1
}
print("Done!")`,
            explanation: [
              { code: "count <- 1", text: "Set up the **counter** before the loop." },
              { code: "while (count <= 3) {", text: "Keep going while the counter is at most 3." },
              { code: `  print(paste("Count is", count))`, text: "Do the work for this iteration." },
              { code: "  count <- count + 1", text: "**Update** the counter. Without this line, `count` would stay 1 forever." },
              { code: `print("Done!")`, text: "After the 3rd iteration `count` is 4, the condition is FALSE, and R continues here." },
            ],
            output: `[1] "Count is 1"
[1] "Count is 2"
[1] "Count is 3"
[1] "Done!"`,
          },
        },
        {
          kind: "code",
          example: {
            id: "while-savings",
            title: "How long until the savings double?",
            code: `savings <- 100
months <- 0

while (savings < 200) {
  savings <- savings * 1.1
  months <- months + 1
}
months
round(savings, 2)`,
            explanation: [
              { code: "savings <- 100", text: "Start with 100." },
              { code: "while (savings < 200) {", text: "Repeat while we still have less than 200." },
              { code: "  savings <- savings * 1.1", text: "Each month the savings grow by 10%." },
              { code: "  months <- months + 1", text: "Count the months." },
              { code: "round(savings, 2)", text: "The balance after the last month, rounded to cents." },
            ],
            output: `[1] 8
[1] 214.36`,
            outputNote: "After 7 months the savings are about 194.87 – still below 200 – so the loop runs once more. After 8 months they are 214.36 and the condition `savings < 200` becomes FALSE.",
            tryIt: "Change the growth to 5% (`* 1.05`). How many months does it take now?",
          },
        },
      ],
    },
    {
      id: "infinite-loops",
      title: "Avoiding infinite loops",
      blocks: [
        {
          kind: "text",
          md: "If the condition of a `while` loop **never** becomes FALSE, the loop never ends. This is an **infinite loop**, and it is the classic while-loop bug. For example, this loop forgets to update `count`, so `count <= 3` stays TRUE forever:\n\n" +
            "```r\ncount <- 1\nwhile (count <= 3) {\n  print(count)\n}\n```\n\n" +
            "If it happens to you, don't panic: press the **Stop** button in the console (in RStudio, press **Esc**). Nothing is broken – fix the loop and run it again.",
        },
        {
          kind: "steps",
          title: "Checklist for every while loop",
          items: [
            "Set up the variable in the condition **before** the loop (e.g. `count <- 1`).",
            "Make sure the body **changes** that variable (e.g. `count <- count + 1`).",
            "Check that the change moves **towards** ending the loop (adding 1 when the condition is `count <= 3`, not subtracting).",
            "If you are unsure the goal can be reached, add a safety limit with `&&`.",
          ],
        },
        {
          kind: "code",
          example: {
            id: "safety-limit",
            title: "A loop with a safety limit",
            code: `number <- 1
tries <- 0

while (number^2 < 50 && tries < 100) {
  number <- number + 1
  tries <- tries + 1
}
number
tries`,
            explanation: [
              { code: "while (number^2 < 50 && tries < 100) {", text: "Find the first whole number whose square is at least 50 – but never try more than 100 times. `&&` is fine here because both sides are single values." },
              { code: "  tries <- tries + 1", text: "Count every attempt, so the safety limit can kick in." },
            ],
            output: `[1] 8
[1] 7`,
            outputNote: "8 × 8 = 64 is the first square of at least 50, found after 7 tries. The limit was not needed this time, but it guarantees the loop will end.",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Resetting the total inside the loop",
      wrong: `prices <- c(4, 10, 6)
for (price in prices) {
  total <- 0
  total <- total + price
}
total`,
      why: "`total <- 0` is inside the body, so it runs in **every** iteration and throws away the running sum. The result is just the last price, 6. Put the starting value **before** the loop.",
      right: `prices <- c(4, 10, 6)
total <- 0
for (price in prices) {
  total <- total + price
}
total`,
    },
    {
      title: "Expecting a loop to print by itself",
      wrong: `for (i in 1:3) {
  i * 10
}`,
      why: "Outside a loop, R prints the value of each line automatically. Inside a loop body it does not – this code calculates 10, 20 and 30 but shows nothing. Use `print()`.",
      right: `for (i in 1:3) {
  print(i * 10)
}`,
    },
    {
      title: "Using 1:length(x) on a vector that may be empty",
      wrong: `scores <- c()
for (i in 1:length(scores)) {
  print(scores[i] * 2)
}`,
      why: "`length(scores)` is 0, so `1:length(scores)` is `1 0` and the loop runs twice on values that do not exist, printing `numeric(0)` twice. `seq_along(scores)` is empty, so the loop correctly does nothing.",
      right: `scores <- c()
for (i in seq_along(scores)) {
  print(scores[i] * 2)
}`,
    },
    {
      title: "Forgetting the round brackets",
      wrong: `for i in 1:3 {
  print(i)
}`,
      error: "unexpected symbol",
      why: "The part after `for` must be wrapped in round brackets: `for (i in 1:3)`. Without them R does not understand where the loop setup starts and ends.",
      right: `for (i in 1:3) {
  print(i)
}`,
    },
  ],
  exerciseIds: ["m4-loop-total", "m4-savings-goal"],
  quiz: [
    {
      id: "m4-loop-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `n <- 1
while (n < 20) {
  n <- n * 3
}
n`,
      options: ["[1] 27", "[1] 9", "[1] 20", "[1] 81"],
      answer: 0,
      explanation: "`n` goes 1 → 3 → 9 → 27. After reaching 27 the condition `n < 20` is FALSE, so the loop stops and 27 is printed.",
      optionFeedback: [
        "Correct!",
        "9 is still less than 20, so the loop runs once more.",
        "The loop does not stop exactly at 20; it stops at the first value that is **not** less than 20.",
        "Once `n` is 27 the condition is checked and is FALSE, so there is no further multiplication.",
      ],
      concept: "while-loops",
    },
    {
      id: "m4-loop-q3",
      type: "multiple-choice",
      prompt: "What does `seq_along(c(\"a\", \"b\", \"c\"))` return?",
      options: ["\"a\" \"b\" \"c\"", "1 2 3", "3", "TRUE TRUE TRUE"],
      answer: 1,
      explanation: "`seq_along()` returns the **positions** of a vector: 1, 2, 3.",
      optionFeedback: [
        "Those are the values; `seq_along()` returns their positions.",
        "Correct!",
        "That is the length. `seq_along()` lists every position from 1 up to the length.",
        "`seq_along()` returns numbers, not TRUE/FALSE values.",
      ],
      concept: "seq-along",
    },
    {
      id: "m4-loop-q4",
      type: "fill-blank",
      prompt: "Complete the loop so that `i` takes the positions of `fruits` (1, 2, 3).",
      code: `fruits <- c("apple", "banana", "cherry")
for (i in ___(fruits)) {
  print(paste(i, fruits[i]))
}`,
      accept: ["seq_along"],
      hint: "The safe function for \"all positions of a vector\".",
      explanation: "`seq_along(fruits)` is `1 2 3`, so the loop prints \"1 apple\", \"2 banana\" and \"3 cherry\".",
      concept: "seq-along",
    },
    {
      id: "m4-loop-q5",
      type: "true-false",
      prompt: "The body of a while loop always runs at least once.",
      answer: false,
      explanation: "R checks the condition **before** each iteration. If it is FALSE right at the start, the body never runs.",
      concept: "while-loops",
    },
    {
      id: "m4-loop-q6",
      type: "find-error",
      prompt: "This loop should print 1, 2, 3, 4, 5 – but it never stops. Click the faulty line.",
      code: `count <- 1
while (count <= 5) {
  print(count)
  count <- count - 1
}`,
      errorLine: 4,
      errorKind: "logic",
      fix: `count <- 1
while (count <= 5) {
  print(count)
  count <- count + 1
}`,
      explanation: "The counter moves the wrong way: 1, 0, -1, … is always `<= 5`, so the condition never becomes FALSE – an infinite loop. Adding 1 makes `count` reach 6 and the loop ends.",
      concept: "infinite-loops",
    },
  ],
  keyPoints: [
    "A loop repeats a block of code; each run is an iteration.",
    "`for (x in values) { ... }` runs the body once for each value, with `x` holding the current value.",
    "Use `seq_along(x)` to loop over positions – it is safe even when `x` is empty.",
    "To build a result: set it up before the loop, update it inside, use it after.",
    "Loops do not print automatically – use `print()` inside the body.",
    "`while (condition) { ... }` repeats as long as the condition is TRUE; the body must change something so the loop can end.",
    "`next` skips to the next iteration and `break` leaves the loop.",
  ],
  concepts: [
    "for-loops",
    "seq-along",
    "accumulating-results",
    "break-next",
    "while-loops",
    "infinite-loops",
  ],
  glossary: ["loop", "for-loop", "while-loop", "iteration"],
  prerequisites: ["conditions-and-logic"],
  playground: `# Loops to experiment with
for (day in c("Mon", "Tue", "Wed")) {
  print(paste("Today is", day))
}

balance <- 50
weeks <- 0
while (balance < 100) {
  balance <- balance + 15
  weeks <- weeks + 1
}
weeks
`,
};
