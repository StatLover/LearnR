import type { Lesson } from "../../types";

export const conditionsLesson: Lesson = {
  id: "conditions-and-logic",
  module: 4,
  title: "Making Decisions: Comparisons, Logic and if/else",
  summary: "Ask yes/no questions with comparison and logical operators, and let your code choose what to do with if, else if, else and ifelse().",
  minutes: 40,
  objectives: [
    "Compare values with ==, !=, <, >, <= and >=",
    "Combine conditions with &, |, ! and check membership with %in%",
    "Explain the difference between & and && (and between | and ||)",
    "Write if, else and else if statements that run different code in different situations",
    "Avoid the else-on-a-new-line error",
    "Use ifelse() to make a decision for every value of a vector",
  ],
  intro:
    "So far your code has run every line, top to bottom, every time. Real programs need to **make decisions**: *if* the score is at least 50, say \"pass\"; *otherwise*, say \"fail\". *If* it is raining, take an umbrella.\n\n" +
    "Every decision starts with a **yes/no question**, such as \"is the score at least 50?\". In R, the answer to such a question is a logical value: `TRUE` or `FALSE`. You ask the questions with **comparison operators** (like `>=`) and combine them with **logical operators** (like *and* / *or*).\n\n" +
    "Then an **if statement** uses the answer to choose which code to run. By the end of this lesson your code will be able to react to its data.",
  sections: [
    {
      id: "comparison-operators",
      title: "Comparison operators: asking yes/no questions",
      blocks: [
        {
          kind: "definition",
          term: "Comparison operator",
          md: "A symbol that compares two values and answers with `TRUE` or `FALSE`. For example `age >= 18` asks \"is age greater than or equal to 18?\".",
        },
        {
          kind: "table",
          caption: "The six comparison operators",
          headers: ["Operator", "Question it asks", "Example", "Result"],
          rows: [
            ["`==`", "Are they equal?", "`3 == 3`", "`TRUE`"],
            ["`!=`", "Are they different?", "`3 != 4`", "`TRUE`"],
            ["`<`", "Is the left one smaller?", "`5 < 2`", "`FALSE`"],
            ["`>`", "Is the left one bigger?", "`5 > 2`", "`TRUE`"],
            ["`<=`", "Smaller or equal?", "`2 <= 2`", "`TRUE`"],
            ["`>=`", "Bigger or equal?", "`1 >= 2`", "`FALSE`"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "compare-numbers",
            title: "Comparing numbers",
            code: `age <- 17

age >= 18
age == 17
age != 20`,
            explanation: [
              { code: "age <- 17", text: "Store an age to ask questions about." },
              { code: "age >= 18", text: "Is 17 greater than or equal to 18? No." },
              { code: "age == 17", text: "`==` (two equals signs) asks \"is it equal to?\". Yes, it is 17." },
              { code: "age != 20", text: "`!=` asks \"is it different from?\". 17 is not 20, so TRUE." },
            ],
            output: `[1] FALSE
[1] TRUE
[1] TRUE`,
            tryIt: "Change `age` to 18 and predict each answer before you run it.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "= is not ==",
          md: "One equals sign **stores** a value (`x = 5` works like `x <- 5`). Two equals signs **ask a question** (`x == 5`: is x equal to 5?). Mixing them up is one of the most common beginner mistakes in every programming language.",
        },
        {
          kind: "code",
          example: {
            id: "compare-text",
            title: "Comparing text",
            code: `colour <- "blue"

colour == "blue"
colour == "Blue"
"apple" < "banana"`,
            explanation: [
              { code: `colour == "blue"`, text: "Text is equal only if it matches exactly." },
              { code: `colour == "Blue"`, text: "Comparisons are **case-sensitive**: a capital B makes it a different piece of text." },
              { code: `"apple" < "banana"`, text: "For text, `<` and `>` compare alphabetical order: \"apple\" comes before \"banana\"." },
            ],
            output: `[1] TRUE
[1] FALSE
[1] TRUE`,
          },
        },
        {
          kind: "code",
          example: {
            id: "compare-vector",
            title: "Comparisons are vectorized",
            code: `temps <- c(12, 25, 31, 18)
temps > 20`,
            explanation: [
              { code: "temps > 20", text: "Like arithmetic, a comparison checks **every** value of a vector and returns one TRUE/FALSE per value." },
            ],
            output: `[1] FALSE  TRUE  TRUE FALSE`,
          },
        },
      ],
    },
    {
      id: "logical-operators",
      title: "Combining conditions: &, |, ! and %in%",
      blocks: [
        {
          kind: "definition",
          term: "Logical operator",
          md: "A symbol that combines or flips `TRUE`/`FALSE` values. `&` means **and**, `|` means **or**, and `!` means **not**.",
        },
        {
          kind: "table",
          caption: "What & (and) and | (or) give",
          headers: ["a", "b", "a & b (both?)", "a | b (at least one?)"],
          rows: [
            ["`TRUE`", "`TRUE`", "`TRUE`", "`TRUE`"],
            ["`TRUE`", "`FALSE`", "`FALSE`", "`TRUE`"],
            ["`FALSE`", "`TRUE`", "`FALSE`", "`TRUE`"],
            ["`FALSE`", "`FALSE`", "`FALSE`", "`FALSE`"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "and-or-not",
            title: "and, or, not",
            code: `age <- 25
has_ticket <- TRUE

age >= 18 & has_ticket
age < 18 | has_ticket
!has_ticket`,
            explanation: [
              { code: "age >= 18 & has_ticket", text: "**Both** must be TRUE: the person is an adult **and** has a ticket. TRUE." },
              { code: "age < 18 | has_ticket", text: "At least **one** must be TRUE. The person is not under 18, but they do have a ticket, so TRUE." },
              { code: "!has_ticket", text: "`!` flips the value: not TRUE is FALSE." },
            ],
            output: `[1] TRUE
[1] TRUE
[1] FALSE`,
            tryIt: "Set `has_ticket <- FALSE` and run it again. Which answers change?",
          },
        },
        {
          kind: "code",
          example: {
            id: "vector-and",
            title: "Combining conditions on a vector",
            code: `temps <- c(12, 25, 31, 18)

temps > 15 & temps < 30
temps[temps > 15 & temps < 30]`,
            explanation: [
              { code: "temps > 15 & temps < 30", text: "`&` works **value by value**: each temperature must be above 15 **and** below 30." },
              { code: "temps[temps > 15 & temps < 30]", text: "Used for logical indexing, it keeps the pleasant temperatures." },
            ],
            output: `[1] FALSE  TRUE FALSE  TRUE
[1] 25 18`,
          },
        },
        {
          kind: "text",
          md: "R also has **double** versions: `&&` and `||`. They work on exactly **one** TRUE/FALSE value on each side, and they stop early when the first part already decides the answer (if the left side of `&&` is FALSE, R does not even look at the right side). Use the double versions inside `if ( )`, where you need a single answer, and the single versions `&` and `|` for vectors.",
        },
        {
          kind: "code",
          example: {
            id: "double-and",
            title: "& versus &&",
            code: `x <- 5
x > 0 && x < 10

values <- c(1, 5, 12)
values > 0 & values < 10`,
            explanation: [
              { code: "x > 0 && x < 10", text: "Both sides are single values, so `&&` is the right choice: one answer." },
              { code: "values > 0 & values < 10", text: "For a vector, use `&`: one answer per value. `&&` here would cause an error." },
            ],
            output: `[1] TRUE
[1]  TRUE  TRUE FALSE`,
          },
        },
        {
          kind: "text",
          md: "Finally, `%in%` asks \"is this value **one of** these values?\". It saves you from writing long chains like `x == \"a\" | x == \"b\" | x == \"c\"`.",
        },
        {
          kind: "code",
          example: {
            id: "in-operator",
            title: "Membership with %in%",
            code: `fruit <- "kiwi"
fruit %in% c("apple", "kiwi", "mango")

basket <- c("apple", "plum", "kiwi")
basket %in% c("apple", "kiwi", "mango")`,
            explanation: [
              { code: `fruit %in% c("apple", "kiwi", "mango")`, text: "Is \"kiwi\" in the list of allowed fruits? Yes." },
              { code: `basket %in% c("apple", "kiwi", "mango")`, text: "With a vector on the left, R checks each value: apple yes, plum no, kiwi yes." },
            ],
            output: `[1] TRUE
[1]  TRUE FALSE  TRUE`,
          },
        },
        {
          kind: "question",
          question: {
            id: "m4-cond-q1",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `x <- 7
x > 5 & x < 6`,
            options: ["[1] FALSE", "[1] TRUE", "[1] TRUE FALSE", "[1] 7"],
            answer: 0,
            explanation: "`x > 5` is TRUE but `x < 6` is FALSE. With `&` both must be TRUE, so the answer is FALSE.",
            optionFeedback: [
              "Correct!",
              "`&` needs **both** sides to be TRUE. 7 is not less than 6.",
              "`&` combines the two answers into one value.",
              "A comparison returns TRUE or FALSE, not the value of `x`.",
            ],
            concept: "logical-operators",
          },
        },
      ],
    },
    {
      id: "if-statements",
      title: "if, else and else if",
      blocks: [
        {
          kind: "definition",
          term: "if statement",
          md: "Code that runs a block of instructions **only if** a condition is `TRUE`. With `else` you can add a second block that runs when the condition is `FALSE`.",
        },
        { kind: "diagram", name: "if-else-flow", caption: "R checks the condition; TRUE follows one path, FALSE the other. Then the program carries on." },
        {
          kind: "code",
          example: {
            id: "if-basic",
            title: "A simple if",
            code: `temperature <- 30

if (temperature > 25) {
  print("It's a hot day - drink plenty of water!")
}
print("Weather check finished.")`,
            explanation: [
              { code: "if (temperature > 25) {", text: "`if` is followed by a **condition** in round brackets. The curly bracket `{` opens the block of code that belongs to the `if`." },
              { code: `  print("It's a hot day - drink plenty of water!")`, text: "This line runs **only** when the condition is TRUE. It is indented (moved right by two spaces) so you can see it belongs to the `if`." },
              { code: "}", text: "The closing curly bracket ends the block." },
              { code: `print("Weather check finished.")`, text: "This line is outside the block, so it always runs." },
            ],
            output: `[1] "It's a hot day - drink plenty of water!"
[1] "Weather check finished."`,
            tryIt: "Change `temperature` to 18. The first message disappears, but the second still prints.",
          },
        },
        {
          kind: "code",
          example: {
            id: "if-else",
            title: "Two paths: if and else",
            code: `score <- 45

if (score >= 50) {
  print("You passed!")
} else {
  print("Not this time - keep practising!")
}`,
            explanation: [
              { code: "if (score >= 50) {", text: "Is the score at least 50? For 45 the answer is FALSE…" },
              { code: `  print("You passed!")`, text: "…so this line is skipped." },
              { code: "} else {", text: "`else` means \"otherwise\". Its block runs when the condition is FALSE. Note that `else` sits on the **same line** as the closing `}`." },
              { code: `  print("Not this time - keep practising!")`, text: "This is the line that runs for a score of 45." },
            ],
            output: `[1] "Not this time - keep practising!"`,
          },
        },
        {
          kind: "text",
          md: "For more than two possibilities, chain conditions with `else if`. R checks them **from top to bottom** and runs the **first** block whose condition is TRUE; all the others are skipped. The final `else` catches everything that is left.",
        },
        {
          kind: "code",
          example: {
            id: "else-if",
            title: "Many paths: else if",
            code: `score <- 72

if (score >= 90) {
  grade <- "A"
} else if (score >= 75) {
  grade <- "B"
} else if (score >= 50) {
  grade <- "C"
} else {
  grade <- "F"
}
grade`,
            explanation: [
              { code: "if (score >= 90) {", text: "First question: at least 90? No (72), so move on." },
              { code: "} else if (score >= 75) {", text: "Second question: at least 75? No, move on." },
              { code: "} else if (score >= 50) {", text: "Third question: at least 50? Yes! This block runs and R skips the rest of the chain." },
              { code: `  grade <- "C"`, text: "The block stores a value in `grade` instead of printing it." },
              { code: "} else {", text: "The fallback for any score below 50. It is not needed this time." },
              { code: "grade", text: "Print the result after the chain." },
            ],
            output: `[1] "C"`,
            outputNote: "Because R stops at the first TRUE condition, the order matters. If you checked `score >= 50` first, a score of 95 would get a C!",
            tryIt: "Try the scores 90, 75, 49 and 100. Do the boundaries behave as you expect?",
          },
        },
        {
          kind: "code",
          example: {
            id: "if-combined",
            title: "Combining conditions inside if",
            code: `age <- 15
with_adult <- TRUE

if (age >= 18 || with_adult) {
  print("You may enter.")
} else {
  print("Sorry, no entry.")
}`,
            explanation: [
              { code: "if (age >= 18 || with_adult) {", text: "Enter if you are an adult **or** you come with an adult. Both sides are single values, so we use `||`." },
            ],
            output: `[1] "You may enter."`,
          },
        },
      ],
    },
    {
      id: "else-placement",
      title: "The else-on-a-new-line trap",
      blocks: [
        {
          kind: "text",
          md: "R reads your code one complete statement at a time. When it reaches the `}` that closes an `if` block, and the line ends there, R thinks: \"that `if` is finished\". If `else` then starts the **next** line, R finds an `else` that belongs to nothing – and stops with an error.",
        },
        {
          kind: "code",
          example: {
            id: "else-new-line",
            title: "The error",
            code: `x <- 5
if (x > 3) {
  print("big")
}
else {
  print("small")
}`,
            explanation: [
              { code: "}", text: "The `if` statement seems complete here, because nothing follows on this line." },
              { code: "else {", text: "An `else` at the start of a line has no `if` to belong to." },
            ],
            output: `Error: unexpected 'else' (line 5, column 1)
4: }
5: else
   ^`,
            outputNote: "R's error message points at the exact spot: line 5, column 1, marked by the `^`. Because this is a syntax error, R refuses to run **any** of the code – not even line 1.",
            expectError: true,
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "The fix: } else {",
          md: "Always write the closing bracket, `else` and the opening bracket together on one line: `} else {`. The same applies to `} else if (...) {`. Then R can see that the statement continues.",
        },
      ],
    },
    {
      id: "ifelse-function",
      title: "ifelse(): one decision for every value",
      blocks: [
        {
          kind: "text",
          md: "`if` needs **one** TRUE or FALSE. If you give it a whole vector of answers, R does not know which one to use and stops with an error:",
        },
        {
          kind: "code",
          example: {
            id: "if-vector-error",
            title: "if cannot handle a vector",
            code: `scores <- c(45, 78, 92)
if (scores >= 50) {
  print("pass")
}`,
            explanation: [
              { code: "if (scores >= 50) {", text: "`scores >= 50` is `FALSE TRUE TRUE` – three answers, but `if` needs exactly one." },
            ],
            output: `Error in if (scores >= 50) { : the condition has length > 1`,
            outputNote: "*The condition has length > 1* means \"you gave me more than one TRUE/FALSE\".",
            expectError: true,
          },
        },
        {
          kind: "text",
          md: "For vectors, use the function `ifelse(test, yes, no)`. It checks the test for **every** value and picks the `yes` value where the test is TRUE and the `no` value where it is FALSE. The result is a vector of the same length.",
        },
        {
          kind: "code",
          example: {
            id: "ifelse-basic",
            title: "ifelse() on a vector",
            code: `scores <- c(45, 78, 92, 50, 33)
results <- ifelse(scores >= 50, "pass", "fail")
results
table(results)`,
            explanation: [
              { code: "ifelse(scores >= 50,", text: "The test, checked for every score." },
              { code: `"pass", "fail")`, text: "The value to use where the test is TRUE, then the value where it is FALSE." },
              { code: "table(results)", text: "Count the passes and fails." },
            ],
            output: `[1] "fail" "pass" "pass" "pass" "fail"
results
fail pass
   2    3`,
          },
        },
        {
          kind: "text",
          md: "`ifelse()` is perfect for creating a new column in a data frame:",
        },
        {
          kind: "code",
          example: {
            id: "ifelse-df",
            title: "A pass/fail column for 60 students",
            code: `students <- read.csv("data/students.csv")
students$result <- ifelse(students$math >= 70, "pass", "fail")
head(students[, c("name", "math", "result")])
table(students$result)`,
            explanation: [
              { code: `students$result <- ifelse(students$math >= 70, "pass", "fail")`, text: "Decide for each of the 60 students and store the answers as a new column." },
              { code: `head(students[, c("name", "math", "result")])`, text: "Look at the first rows of three columns to check the result." },
              { code: "table(students$result)", text: "How many students passed?" },
            ],
            output: `    name math result
1  Amara   86   pass
2    Ben   54   fail
3  Chloe   99   pass
4 Daniel   68   fail
5  Elena   90   pass
6  Farid   78   pass

fail pass
  21   39`,
            tryIt: "Put one `ifelse()` inside another to make three groups: `ifelse(students$math >= 90, \"top\", ifelse(students$math >= 70, \"pass\", \"fail\"))`.",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Putting else on a new line",
      wrong: `x <- 2
if (x > 3) {
  print("big")
}
else {
  print("small")
}`,
      error: "unexpected 'else'",
      why: "When a line ends with the `}` of an `if`, R treats the `if` as finished. An `else` on the next line then has nothing to belong to.",
      right: `x <- 2
if (x > 3) {
  print("big")
} else {
  print("small")
}`,
    },
    {
      title: "Using = instead of == in a condition",
      wrong: `x <- 5
if (x = 5) {
  print("five")
}`,
      error: "unexpected '='",
      why: "A single `=` stores a value; it does not ask a question. Inside `if ( )` you need the comparison `==`.",
      right: `x <- 5
if (x == 5) {
  print("five")
}`,
    },
    {
      title: "Giving if a whole vector",
      wrong: `scores <- c(45, 78, 92)
if (scores >= 50) {
  print("pass")
}`,
      error: "the condition has length > 1",
      why: "`if` makes one decision and needs one TRUE/FALSE, but `scores >= 50` gives three. Use `ifelse()` to decide for every value.",
      right: `scores <- c(45, 78, 92)
ifelse(scores >= 50, "pass", "fail")`,
    },
    {
      title: "A missing value in the condition",
      wrong: `score <- NA
if (score > 50) {
  print("pass")
}`,
      error: "missing value where TRUE/FALSE needed",
      why: "`NA > 50` is `NA` – not TRUE and not FALSE – so `if` cannot decide. Check for missing values first with `is.na()`.",
      right: `score <- NA
if (is.na(score)) {
  print("No score recorded")
} else if (score > 50) {
  print("pass")
}`,
    },
    {
      title: "Using && on a vector",
      wrong: `values <- c(1, 5, 12)
values > 0 && values < 10`,
      error: "'length = 3' in coercion to 'logical(1)'",
      why: "`&&` only works with a single TRUE/FALSE on each side. For vectors, use `&` (and `|` instead of `||`).",
      right: `values <- c(1, 5, 12)
values > 0 & values < 10`,
    },
  ],
  exerciseIds: ["m4-ticket-price", "m4-weather-labels"],
  quiz: [
    {
      id: "m4-cond-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- 10
if (x > 5) {
  print("big")
} else {
  print("small")
}`,
      options: ["[1] \"big\"", "[1] \"small\"", "[1] \"big\"\n[1] \"small\"", "[1] TRUE"],
      answer: 0,
      explanation: "10 > 5 is TRUE, so the `if` block runs and the `else` block is skipped.",
      optionFeedback: [
        "Correct!",
        "The `else` block only runs when the condition is FALSE.",
        "Only one of the two blocks ever runs.",
        "The condition is not printed; it only decides which block runs.",
      ],
      concept: "if-statements",
    },
    {
      id: "m4-cond-q3",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `points <- 80
if (points >= 90) {
  level <- "gold"
} else if (points >= 60) {
  level <- "silver"
} else {
  level <- "bronze"
}
level`,
      options: ["[1] \"silver\"", "[1] \"gold\"", "[1] \"bronze\"", "[1] \"silver\" \"bronze\""],
      answer: 0,
      explanation: "80 is not at least 90, but it is at least 60, so the second block runs. R then skips the rest of the chain.",
      optionFeedback: [
        "Correct!",
        "80 is below 90, so the first condition is FALSE.",
        "`else` only runs when every condition above it is FALSE.",
        "Only the first block with a TRUE condition runs.",
      ],
      concept: "else-if",
    },
    {
      id: "m4-cond-q4",
      type: "fill-blank",
      prompt: "Complete the code so that it checks whether `\"kiwi\"` is one of the fruits in the vector.",
      code: `"kiwi" ___ c("apple", "kiwi", "mango")`,
      accept: ["%in%"],
      hint: "The operator starts and ends with a percent sign.",
      explanation: "`%in%` asks whether the value on the left appears among the values on the right. Here the answer is TRUE.",
      concept: "in-operator",
    },
    {
      id: "m4-cond-q5",
      type: "find-error",
      prompt: "This code does not run. Click the line that causes the error.",
      code: `age <- 20
if (age >= 18) {
  print("adult")
}
else {
  print("minor")
}`,
      errorLine: 5,
      errorKind: "error",
      fix: `age <- 20
if (age >= 18) {
  print("adult")
} else {
  print("minor")
}`,
      explanation: "`else` must be on the same line as the closing `}` of the `if` block: `} else {`. Otherwise R thinks the `if` was already finished and reports *unexpected 'else'*.",
      concept: "else-placement",
    },
    {
      id: "m4-cond-q6",
      type: "true-false",
      prompt: "`(5 > 3) & (2 > 4)` is TRUE.",
      answer: false,
      explanation: "`5 > 3` is TRUE but `2 > 4` is FALSE, and `&` needs both sides to be TRUE. (With `|` it would be TRUE.)",
      concept: "logical-operators",
    },
    {
      id: "m4-cond-q7",
      type: "multiple-choice",
      prompt: "You have a vector `ages` and want a vector saying \"adult\" or \"child\" for every age. Which code works?",
      options: [
        "if (ages >= 18) \"adult\" else \"child\"",
        "ifelse(ages >= 18, \"adult\", \"child\")",
        "ages >= 18 && \"adult\"",
        "ifelse(\"adult\", \"child\", ages >= 18)",
      ],
      answer: 1,
      explanation: "`ifelse()` makes one decision per value: test first, then the value for TRUE, then the value for FALSE.",
      optionFeedback: [
        "`if` needs a single TRUE/FALSE, so a vector of ages causes *the condition has length > 1*.",
        "Correct!",
        "`&&` combines TRUE/FALSE values; it cannot produce text labels.",
        "The arguments are in the wrong order: the test comes first.",
      ],
      concept: "ifelse-function",
    },
  ],
  keyPoints: [
    "Comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`) answer yes/no questions with TRUE or FALSE; `==` asks, `=` stores.",
    "`&` (and) needs both sides TRUE, `|` (or) needs at least one, and `!` (not) flips TRUE and FALSE.",
    "`&` and `|` work value by value on vectors; `&&` and `||` take single values and belong inside `if ( )`.",
    "`x %in% c(...)` checks whether a value is one of a set of values.",
    "`if (condition) { ... } else if (...) { ... } else { ... }` runs the first block whose condition is TRUE.",
    "Always write `} else {` on one line – an `else` at the start of a line is a syntax error.",
    "`ifelse(test, yes, no)` makes a decision for every value of a vector.",
  ],
  concepts: [
    "comparison-operators",
    "logical-operators",
    "in-operator",
    "if-statements",
    "else-if",
    "else-placement",
    "ifelse-function",
  ],
  glossary: ["comparison-operator", "logical-operator", "operator", "boolean", "condition", "if-statement", "case-sensitive"],
  datasets: ["students"],
  playground: `# Make some decisions
temperature <- 22

if (temperature > 25) {
  print("Hot")
} else if (temperature > 15) {
  print("Mild")
} else {
  print("Cold")
}

week <- c(12, 18, 27, 31, 16)
ifelse(week > 25, "hot", "not hot")
`,
};
