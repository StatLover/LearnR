import type { Lesson } from "../../types";

export const advancedFunctionsLesson: Lesson = {
  id: "advanced-functions-and-scope",
  module: 8,
  title: "Advanced Functions and Scope",
  summary:
    "Write flexible functions with default and named arguments, `...`, several return values and function arguments, check their inputs, and understand where R looks for variables.",
  minutes: 45,
  objectives: [
    "Write functions with default arguments and call them with named arguments.",
    "Pass any number of extra arguments through `...`.",
    "Return several results at once by packing them into a named list.",
    "Pass a function as an argument and write anonymous functions with `function(x)` and the `\\(x)` shorthand.",
    "Stop a function early with a clear message using `stop()` and `stopifnot()`.",
    "Explain the difference between local and global variables and the order in which R looks up a name.",
    "Explain why a function cannot change a variable outside it, and why `<<-` is best avoided.",
  ],
  intro: `In Stage 1 you wrote your first functions: you gave a recipe a name, listed its ingredients (the *arguments*) and R handed back a result. In this lesson you will make your functions **more flexible and more reliable** – the way the functions that come with R are written.

You will learn how to give arguments sensible *default values*, how to accept any number of extra values with \`...\`, how to hand back several results at once, and how to pass one function into another. You will also learn to make a function **refuse bad input** with a helpful message instead of producing nonsense.

Finally you will look behind the curtain: when a function uses a name such as \`x\`, *where* does R find it? Understanding this idea – called **scope** – explains why a function never secretly changes the variables in your workspace.`,
  sections: [
    {
      id: "defaults-and-names",
      title: "Default and named arguments",
      blocks: [
        {
          kind: "text",
          md: `A quick reminder of the vocabulary. In \`function(name, greeting)\`, the names inside the brackets are **parameters** – the labelled slots the function expects. The values you put into those slots when you call the function are **arguments**. People often use both words for the same thing, and that is fine.`,
        },
        { kind: "diagram", name: "function-anatomy", caption: "A function: name, arguments, body and the value it returns." },
        {
          kind: "definition",
          term: "Default argument",
          md: "A value written in the function definition with `=` (for example `greeting = \"Hello\"`). If the caller does not supply that argument, R uses the default automatically.",
        },
        {
          kind: "code",
          example: {
            id: "greet-defaults",
            title: "A function with a default argument",
            code: `greet <- function(name, greeting = "Hello") {
  paste0(greeting, ", ", name, "!")
}

greet("Ada")
greet("Ada", "Welcome")
greet(greeting = "Good morning", name = "Grace")`,
            explanation: [
              { code: `greet <- function(name, greeting = "Hello") {`, text: "Creates a function called `greet` with two parameters. `name` has no default, so the caller must always supply it. `greeting = \"Hello\"` gives the second parameter a default value." },
              { code: `  paste0(greeting, ", ", name, "!")`, text: "Glues the pieces together with no spaces in between. Because this is the last line of the body, its value is what the function returns." },
              { code: `greet("Ada")`, text: "Only one argument is given, so it goes into the first slot (`name`) and `greeting` uses its default, `\"Hello\"`." },
              { code: `greet("Ada", "Welcome")`, text: "Two unnamed arguments are matched **by position**: the first to `name`, the second to `greeting`, replacing the default." },
              { code: `greet(greeting = "Good morning", name = "Grace")`, text: "**Named** arguments are matched by name, so their order does not matter." },
            ],
            output: String.raw`[1] "Hello, Ada!"
[1] "Welcome, Ada!"
[1] "Good morning, Grace!"`,
            outputNote: "Each call prints one character string. The third call works even though the arguments are in a different order than in the definition, because each one is named.",
            tryIt: "Change the default to `greeting = \"Hi\"` and run `greet(\"Ada\")` again. Then try calling `greet()` with no arguments at all – what does R complain about?",
          },
        },
        {
          kind: "text",
          md: `R matches arguments in two ways:

* **By position** – unnamed arguments fill the parameters from left to right.
* **By name** – an argument written as \`name = value\` goes straight into that parameter, wherever it appears in the call.

You have used named arguments many times already, for example \`round(x, digits = 1)\` or \`mean(x, na.rm = TRUE)\`. A good habit is to give the first one or two "obvious" arguments by position and **name all the others**: your code becomes easier to read and does not break if you mix up the order.`,
        },
        {
          kind: "code",
          example: {
            id: "named-builtin",
            title: "Named arguments in functions you already know",
            code: `temps <- c(21.456, 19.872, 23.019)

round(temps, digits = 1)
seq(from = 0, to = 100, by = 25)
seq(by = 25, to = 100, from = 0)`,
            explanation: [
              { code: `round(temps, digits = 1)`, text: "The data goes first by position; `digits = 1` is named so a reader instantly sees what the `1` means." },
              { code: `seq(from = 0, to = 100, by = 25)`, text: "`seq()` has several numeric arguments. Naming them avoids confusing which number is which." },
              { code: `seq(by = 25, to = 100, from = 0)`, text: "The same call with the arguments shuffled. Because they are named, the result is identical." },
            ],
            output: String.raw`[1] 21.5 19.9 23.0
[1]   0  25  50  75 100
[1]   0  25  50  75 100`,
            outputNote: "Both `seq()` calls give the same sequence. With unnamed arguments, `seq(25, 100, 0)` would mean something completely different (and fail), so names protect you.",
          },
        },
        {
          kind: "code",
          example: {
            id: "default-uses-other-arg",
            title: "A default can use another argument",
            code: `rectangle_area <- function(width, height = width) {
  width * height
}

rectangle_area(4, 3)
rectangle_area(5)`,
            explanation: [
              { code: `rectangle_area <- function(width, height = width) {`, text: "The default of `height` is *the value of `width`*. Defaults are worked out when the function runs, so they may refer to other arguments." },
              { code: `rectangle_area(4, 3)`, text: "Both arguments given: a 4 × 3 rectangle." },
              { code: `rectangle_area(5)`, text: "`height` is missing, so it becomes `width` (5): the area of a 5 × 5 square." },
            ],
            output: String.raw`[1] 12
[1] 25`,
            tryIt: "Add a third argument `units = \"cm\"` and return `paste(width * height, units)` instead.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m8-fn-q1",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `power <- function(x, exponent = 2) {
  x ^ exponent
}

power(3)
power(2, 3)`,
            options: ["[1] 9\n[1] 8", "[1] 6\n[1] 8", "[1] 9\n[1] 9", "[1] 3\n[1] 8"],
            answer: 0,
            optionFeedback: [
              "Correct! `power(3)` uses the default exponent 2, and `power(2, 3)` is 2 to the power 3.",
              "`^` means \"to the power of\", not multiplication: 3 ^ 2 is 9, not 6.",
              "In `power(2, 3)` the second argument replaces the default, so the exponent is 3.",
              "When `exponent` is not given it is 2, not 1, so `power(3)` is 9.",
            ],
            explanation: "`power(3)` uses the default `exponent = 2`, giving 3² = 9. In `power(2, 3)` the arguments are matched by position, so `x = 2` and `exponent = 3`, giving 2³ = 8.",
            concept: "default-arguments",
          },
        },
      ],
    },
    {
      id: "dots",
      title: "Passing extra arguments with ...",
      blocks: [
        {
          kind: "text",
          md: `Some functions accept *any number* of arguments. \`c()\` is one: \`c(1, 2)\` and \`c(1, 2, 3, 4, 5)\` both work. The secret is a special parameter written as three dots, \`...\` (pronounced "dots").

\`...\` collects every extra argument that does not match another parameter. You can use it in two ways:

1. **Pass the extras along** to another function inside yours.
2. **Collect any number of values** and work with them, for example with \`c(...)\` or \`list(...)\`.`,
        },
        {
          kind: "code",
          example: {
            id: "dots-pass-along",
            title: "Passing extra arguments on to mean()",
            code: `mean_rounded <- function(x, digits = 1, ...) {
  round(mean(x, ...), digits)
}

temps <- c(21.4, NA, 19.8, 23.1)

mean_rounded(temps)
mean_rounded(temps, na.rm = TRUE)`,
            explanation: [
              { code: `mean_rounded <- function(x, digits = 1, ...) {`, text: "`x` and `digits` are ordinary parameters. `...` will catch anything else the caller passes." },
              { code: `  round(mean(x, ...), digits)`, text: "Whatever was caught by `...` is handed on to `mean()` unchanged. Our function does not need to know which options `mean()` has." },
              { code: `mean_rounded(temps)`, text: "No extras: `mean()` meets the `NA` and returns `NA`." },
              { code: `mean_rounded(temps, na.rm = TRUE)`, text: "`na.rm = TRUE` does not match `x` or `digits`, so it lands in `...` and travels on to `mean()`, which then skips the missing value." },
            ],
            output: String.raw`[1] NA
[1] 21.4`,
            outputNote: "The first result is `NA` because one temperature is missing. With `na.rm = TRUE` passed through the dots, the mean of the three known values (21.43…) is rounded to one decimal place.",
          },
        },
        {
          kind: "code",
          example: {
            id: "dots-collect",
            title: "Accepting any number of values",
            code: String.raw`make_sentence <- function(...) {
  words <- c(...)
  cat("Number of words:", length(words), "\n")
  paste(words, collapse = " ")
}

make_sentence("R", "is", "fun")
make_sentence("Functions", "can", "take", "many", "words")`,
            explanation: [
              { code: `make_sentence <- function(...) {`, text: "The only parameter is `...`, so the function accepts as many arguments as you like." },
              { code: `  words <- c(...)`, text: "`c(...)` combines everything that was passed into one character vector." },
              { code: String.raw`  cat("Number of words:", length(words), "\n")`, text: "Prints how many values arrived (`\"\\n\"` starts a new line)." },
              { code: `  paste(words, collapse = " ")`, text: "Joins the words into one string with a space between each pair – this is the returned value." },
            ],
            output: String.raw`Number of words: 3
[1] "R is fun"
Number of words: 5
[1] "Functions can take many words"`,
            tryIt: "Call `make_sentence()` with your own words. What happens if you call it with no words at all?",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Typos disappear into the dots",
          md: "Because `...` accepts *any* name, a misspelled argument is silently swallowed instead of causing an error. `mean_rounded(temps, na_rm = TRUE)` (underscore instead of dot) still returns `NA`, with no complaint. If a result looks wrong, double-check the spelling of every named argument.",
        },
      ],
    },
    {
      id: "returning-lists",
      title: "Returning several values in a list",
      blocks: [
        {
          kind: "text",
          md: `A function always returns **exactly one object**: the value of the last line that runs, or whatever you give to \`return()\`. So how do you hand back several results – say, a count, a mean and a range?

You **pack them into a named list**. A list (from Stage 1) is one container that can hold things of different types and lengths. The caller can then pick out each piece with \`$\`.`,
        },
        {
          kind: "code",
          example: {
            id: "return-list",
            title: "One function, several results",
            code: `describe <- function(x) {
  list(
    n = length(x),
    mean = mean(x),
    range = range(x)
  )
}

result <- describe(c(12, 7, 3, 9, 14))
result$mean
result$range
result`,
            explanation: [
              { code: `  list(`, text: "The last expression of the body is a list, so the whole list is returned." },
              { code: `    n = length(x),`, text: "Each element gets a name (`n`, `mean`, `range`) so it is easy to pick out later." },
              { code: `    range = range(x)`, text: "Elements of a list can have different lengths: `range()` returns two numbers (the smallest and the largest)." },
              { code: `result <- describe(c(12, 7, 3, 9, 14))`, text: "The returned list is stored in `result`." },
              { code: `result$mean`, text: "`$` extracts one element of the list by name." },
              { code: `result`, text: "Printing the whole list shows each element under its `$name` heading." },
            ],
            output: String.raw`[1] 9
[1]  3 14
$n
[1] 5

$mean
[1] 9

$range
[1]  3 14`,
            outputNote: "`result$mean` is 9 and `result$range` holds two numbers, 3 and 14. When the whole list is printed, R shows each element under a `$n`, `$mean` and `$range` heading followed by its value.",
            tryIt: "Add `median = median(x)` to the list and print `result$median`.",
          },
        },
        {
          kind: "text",
          md: "`return()` is useful when you want to **leave a function early**. As soon as R reaches `return(value)`, the function stops and hands back `value`; the remaining lines are skipped.",
        },
        {
          kind: "code",
          example: {
            id: "early-return",
            title: "Leaving a function early with return()",
            code: `letter_grade <- function(score) {
  if (score >= 90) {
    return("A")
  }
  if (score >= 75) {
    return("B")
  }
  "C"
}

letter_grade(95)
letter_grade(80)
letter_grade(60)`,
            explanation: [
              { code: `  if (score >= 90) {\n    return("A")\n  }`, text: "For a score of 90 or more, the function returns `\"A\"` immediately and nothing below runs." },
              { code: `  if (score >= 75) {\n    return("B")\n  }`, text: "Reached only when the score is below 90." },
              { code: `  "C"`, text: "If neither `return()` ran, the last value of the body, `\"C\"`, is returned." },
            ],
            output: String.raw`[1] "A"
[1] "B"
[1] "C"`,
          },
        },
      ],
    },
    {
      id: "functions-as-arguments",
      title: "Functions as arguments and anonymous functions",
      blocks: [
        {
          kind: "text",
          md: `In R a function is an object, just like a number or a vector. You can store it in a variable, and you can **pass it into another function as an argument**. This sounds abstract, but it is extremely practical: it lets one general function do many different jobs.

Notice that when you pass a function you write its name **without brackets** – \`mean\`, not \`mean()\`. Brackets would *run* the function instead of handing it over.`,
        },
        {
          kind: "code",
          example: {
            id: "function-as-argument",
            title: "Passing a function into a function",
            code: `summarise_with <- function(x, f) {
  f(x)
}

scores <- c(72, 85, 90, 64, 88)

summarise_with(scores, mean)
summarise_with(scores, max)
summarise_with(scores, length)`,
            explanation: [
              { code: `summarise_with <- function(x, f) {`, text: "The second parameter, `f`, is expected to be a *function*." },
              { code: `  f(x)`, text: "Inside the body, `f` is called like any function, with `x` as its argument." },
              { code: `summarise_with(scores, mean)`, text: "Passes the `mean` function itself (no brackets). Inside, `f(x)` therefore means `mean(scores)`." },
              { code: `summarise_with(scores, length)`, text: "The same general function now counts the values, because a different function was passed in." },
            ],
            output: String.raw`[1] 79.8
[1] 90
[1] 5`,
            outputNote: "The mean of the five scores is 79.8, the maximum is 90 and there are 5 scores – three different answers from one general function.",
          },
        },
        {
          kind: "definition",
          term: "Anonymous function",
          md: "A function written directly where it is needed, without giving it a name, e.g. `function(x) max(x) - min(x)`. Since R 4.1 you can write `function(x)` more briefly as `\\(x)` – the backslash is shorthand for the word `function`.",
        },
        {
          kind: "code",
          example: {
            id: "anonymous-functions",
            title: "Anonymous functions and the \\(x) shorthand",
            code: String.raw`summarise_with <- function(x, f) {
  f(x)
}

scores <- c(72, 85, 90, 64, 88)

summarise_with(scores, function(x) max(x) - min(x))
summarise_with(scores, \(x) sum(x > 80))
Filter(\(x) x >= 85, scores)`,
            explanation: [
              { code: `summarise_with(scores, function(x) max(x) - min(x))`, text: "A throw-away function that computes the spread between the highest and lowest score. It has no name – it only exists for this one call." },
              { code: String.raw`summarise_with(scores, \(x) sum(x > 80))`, text: "`\\(x)` is exactly the same as `function(x)`. `x > 80` gives `TRUE`/`FALSE` for each score and `sum()` counts the `TRUE`s." },
              { code: String.raw`Filter(\(x) x >= 85, scores)`, text: "Base R's `Filter()` also takes a function: it keeps only the elements for which the function returns `TRUE`." },
            ],
            output: String.raw`[1] 26
[1] 3
[1] 85 90 88`,
            outputNote: "The spread is 90 − 64 = 26, three scores are above 80, and `Filter()` returns the scores 85, 90 and 88.",
            tryIt: "Use `summarise_with()` with an anonymous function that returns the average of the two highest scores. Hint: `sort(x, decreasing = TRUE)[1:2]`.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Where you will use this",
          md: "Functions that take other functions are everywhere in R: `sapply()`, `lapply()` and `tapply()` (next lesson), `aggregate(..., FUN = mean)`, and dplyr's `across()`. Anonymous functions are the usual way to give them a small custom calculation.",
        },
      ],
    },
    {
      id: "checking-inputs",
      title: "Checking inputs with stop() and stopifnot()",
      blocks: [
        {
          kind: "text",
          md: `A function that silently produces nonsense for bad input is dangerous – you may not notice the wrong answer. It is much kinder to **stop with a clear message** that tells the user what went wrong. R gives you two tools:

* \`stop("message")\` – stops the function immediately and shows your message as an error.
* \`stopifnot(condition1, condition2, ...)\` – a quick check: if any condition is not \`TRUE\`, R stops with an error naming the failed condition.

These checks normally go at the very top of a function, before any real work. Programmers call them *guard clauses*.`,
        },
        {
          kind: "code",
          example: {
            id: "stop-message",
            title: "stop() with your own message",
            code: `percent <- function(part, total) {
  if (!is.numeric(part) || !is.numeric(total)) {
    stop("part and total must be numbers")
  }
  if (total == 0) {
    stop("total cannot be zero")
  }
  round(100 * part / total, 1)
}

percent(45, 60)
percent("45", 60)`,
            explanation: [
              { code: `  if (!is.numeric(part) || !is.numeric(total)) {`, text: "`is.numeric()` checks the type; `!` flips it, and `||` means \"or\". The condition is `TRUE` if either input is not a number." },
              { code: `    stop("part and total must be numbers")`, text: "Stops the function right here and reports the message as an error." },
              { code: `  if (total == 0) {`, text: "A second guard: dividing by zero would give `Inf`, which is not a sensible percentage." },
              { code: `percent(45, 60)`, text: "Good input: 45 out of 60 is 75 %." },
              { code: `percent("45", 60)`, text: "`\"45\"` is text, so the first guard stops the function with our message." },
            ],
            output: String.raw`[1] 75
Error in percent("45", 60) : part and total must be numbers`,
            expectError: true,
            outputNote: "The error line starts with `Error in percent(\"45\", 60)` – the call that failed – followed by your own message, which tells the user exactly what to fix.",
          },
        },
        {
          kind: "code",
          example: {
            id: "stopifnot-basic",
            title: "Quick checks with stopifnot()",
            code: `average_score <- function(scores) {
  stopifnot(is.numeric(scores), length(scores) > 0)
  mean(scores)
}

average_score(c(70, 80, 90))
average_score(c("70", "80"))`,
            explanation: [
              { code: `  stopifnot(is.numeric(scores), length(scores) > 0)`, text: "Two conditions that must both be `TRUE`: the input is numeric, and it is not empty." },
              { code: `average_score(c(70, 80, 90))`, text: "Both conditions hold, so the mean is returned." },
              { code: `average_score(c("70", "80"))`, text: "The scores are text, so `is.numeric(scores)` is `FALSE` and `stopifnot()` stops with an error that names the failed check." },
            ],
            output: String.raw`[1] 80
Error in average_score(c("70", "80")) : is.numeric(scores) is not TRUE`,
            expectError: true,
          },
        },
        {
          kind: "code",
          example: {
            id: "stopifnot-named",
            title: "stopifnot() with friendly messages",
            code: `average_score <- function(scores) {
  stopifnot(
    "scores must be numeric" = is.numeric(scores),
    "scores must not be empty" = length(scores) > 0
  )
  mean(scores)
}

average_score(numeric(0))`,
            explanation: [
              { code: `    "scores must be numeric" = is.numeric(scores),`, text: "Giving each condition a name turns that name into the error message, which is friendlier than `is.numeric(scores) is not TRUE`." },
              { code: `average_score(numeric(0))`, text: "`numeric(0)` is an empty numeric vector: the first check passes, the second fails." },
            ],
            output: String.raw`Error in average_score(numeric(0)) : scores must not be empty`,
            expectError: true,
            tryIt: "Call `average_score(\"high\")` and see which message appears.",
          },
        },
      ],
    },
    {
      id: "scope",
      title: "Scope: where R looks for variables",
      blocks: [
        {
          kind: "text",
          md: "When a function uses a name such as `x` or `tax_rate`, R has to find the value that belongs to that name. The rules R follows are called **scope**.",
        },
        {
          kind: "definition",
          term: "Environment",
          md: "A collection of names and their values – think of it as a labelled shelf of boxes. Your workspace is the **global environment**. Every time a function runs, R creates a fresh, temporary environment just for that run.",
        },
        {
          kind: "definition",
          term: "Local and global variables",
          md: "A **local variable** is created inside a function (including its arguments); it lives in the function's temporary environment and disappears when the function finishes. A **global variable** lives in your workspace (the global environment).",
        },
        { kind: "diagram", name: "scope", caption: "R looks for a name inside the function first, then in the environment where the function was created (usually the global environment), then in the loaded packages." },
        {
          kind: "code",
          example: {
            id: "local-vs-global",
            title: "A local x and a global x",
            code: `x <- 10

show_x <- function() {
  x <- 99
  x
}

show_x()
x`,
            explanation: [
              { code: `x <- 10`, text: "Creates a *global* variable `x` in your workspace." },
              { code: `  x <- 99`, text: "Creates a *local* variable that is also called `x`, inside the function's own environment. It is a different box with the same label." },
              { code: `show_x()`, text: "Inside the function, R finds the local `x` first, so it returns 99." },
              { code: `x`, text: "Back outside, the global `x` was never touched: it is still 10." },
            ],
            output: String.raw`[1] 99
[1] 10`,
          },
        },
        {
          kind: "steps",
          title: "How R looks up a name used inside a function",
          items: [
            "Look in the function's own environment: its arguments and any local variables.",
            "If not found, look in the environment where the function was **created** – for functions you write, that is usually the global environment (your workspace).",
            "If still not found, look through the loaded packages (base R, stats, and any package attached with `library()`).",
            "If the name is nowhere, stop with `Error: object '...' not found`.",
          ],
        },
        {
          kind: "code",
          example: {
            id: "lookup-global",
            title: "A function that reaches out to a global variable",
            code: `add_tax <- function(price) {
  price * (1 + tax_rate)
}

tax_rate <- 0.2
add_tax(50)

tax_rate <- 0.5
add_tax(50)`,
            explanation: [
              { code: `  price * (1 + tax_rate)`, text: "`price` is an argument (local). `tax_rate` is not defined inside the function, so R goes up to the global environment to find it." },
              { code: `tax_rate <- 0.2\nadd_tax(50)`, text: "With a global `tax_rate` of 0.2, the result is 50 × 1.2." },
              { code: `tax_rate <- 0.5\nadd_tax(50)`, text: "The *same call* now gives a different answer, because the global variable changed." },
            ],
            output: String.raw`[1] 60
[1] 75`,
            outputNote: "The same call, `add_tax(50)`, returned 60 and then 75. That surprise is the reason to avoid relying on global variables: the function's result depends on something that is not in its argument list.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Pass values in as arguments",
          md: "A safer version is `add_tax <- function(price, tax_rate = 0.2) price * (1 + tax_rate)`. Now everything the function needs is visible in its arguments, and the default keeps calls short.",
        },
        {
          kind: "code",
          example: {
            id: "local-disappears",
            title: "Local variables disappear when the function ends",
            code: `make_total <- function(a, b) {
  total <- a + b
  total
}

make_total(2, 3)
exists("total")`,
            explanation: [
              { code: `  total <- a + b`, text: "`total` is a local variable in the function's temporary environment." },
              { code: `make_total(2, 3)`, text: "The *value* of `total` (5) is returned and printed." },
              { code: `exists("total")`, text: "`exists()` asks whether a variable with this name can be found from your workspace. The answer is `FALSE`: the local `total` vanished when the function finished." },
            ],
            output: String.raw`[1] 5
[1] FALSE`,
            outputNote: "To keep a result, assign the returned value: `my_total <- make_total(2, 3)`.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m8-fn-q2",
            type: "multiple-choice",
            prompt: "Inside a function you use the name `rate`, but the function has no argument or local variable called `rate`. What does R do?",
            options: [
              "It looks for `rate` in the environment where the function was created (usually your workspace), then in the loaded packages.",
              "It immediately stops with an error, because functions can only see their own arguments.",
              "It uses 0 as the value of `rate`.",
              "It asks you to type a value for `rate`.",
            ],
            answer: 0,
            optionFeedback: [
              "Correct – R searches outward: function environment, then the environment where the function was created, then packages.",
              "Functions *can* see variables outside them; R only gives an error if the name is not found anywhere.",
              "R never invents a value. If `rate` cannot be found anywhere you get \"object 'rate' not found\".",
              "R does not stop to ask for input; it searches its environments.",
            ],
            explanation: "This is R's lookup order (lexical scoping): first the function's own environment, then the environment it was defined in, then the loaded packages. Only if the name is nowhere does R report `object 'rate' not found`.",
            concept: "function-scope",
          },
        },
      ],
    },
    {
      id: "changing-outside",
      title: "Why functions do not change outside variables",
      blocks: [
        {
          kind: "text",
          md: `Here is something that surprises many beginners: a function **cannot change your variables** by modifying its arguments. When you pass \`scores\` into a function, the function works on its *own copy*. Changing that copy changes nothing outside.

This is a feature, not a bug. It means you can call any function without worrying that it secretly altered your data. If you want to keep the function's result, **assign it** yourself.`,
        },
        {
          kind: "code",
          example: {
            id: "copy-not-change",
            title: "The original stays the same until you reassign",
            code: `add_bonus <- function(scores) {
  scores <- scores + 5
  scores
}

scores <- c(70, 80, 90)
add_bonus(scores)
scores

scores <- add_bonus(scores)
scores`,
            explanation: [
              { code: `  scores <- scores + 5`, text: "Inside the function this changes the *local* `scores` – the function's private copy." },
              { code: `add_bonus(scores)`, text: "The function returns the boosted scores, which are printed…" },
              { code: `scores`, text: "…but the global `scores` is unchanged." },
              { code: `scores <- add_bonus(scores)`, text: "To update your variable, assign the returned value back to it. Now the change is visible and intentional." },
            ],
            output: String.raw`[1] 75 85 95
[1] 70 80 90
[1] 75 85 95`,
          },
        },
        {
          kind: "text",
          md: "R does have an operator that reaches outside a function: the **super-assignment** operator `<<-`. Instead of creating a local variable, it changes a variable in an enclosing environment (usually your workspace).",
        },
        {
          kind: "code",
          example: {
            id: "super-assignment",
            title: "<<- changes a variable outside the function",
            code: `counter <- 0

increase <- function() {
  counter <<- counter + 1
}

increase()
increase()
counter`,
            explanation: [
              { code: `  counter <<- counter + 1`, text: "`<<-` skips the function's own environment and assigns to the `counter` found outside it – the global one." },
              { code: `increase()\nincrease()`, text: "Each call silently adds 1 to the global `counter`. Nothing is printed, because the value of an assignment is invisible." },
              { code: `counter`, text: "After two calls, the global `counter` is 2." },
            ],
            output: String.raw`[1] 2`,
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Why you should avoid <<-",
          md: `* **Hidden side effects:** reading \`increase()\` you cannot tell that it changes something else in your workspace.
* **Results depend on history:** running the same line twice gives a different state, so scripts become hard to rerun and check.
* **Hard to debug:** when a value is wrong, you have to hunt for every function that might have changed it.

In everyday data analysis you almost never need \`<<-\`. Return a value and assign it instead, as in the next example.`,
        },
        {
          kind: "code",
          example: {
            id: "return-instead",
            title: "The clear alternative: return and reassign",
            code: `increase <- function(count) {
  count + 1
}

counter <- 0
counter <- increase(counter)
counter <- increase(counter)
counter`,
            explanation: [
              { code: `increase <- function(count) {\n  count + 1\n}`, text: "The function receives everything it needs as an argument and returns a new value. It touches nothing else." },
              { code: `counter <- increase(counter)`, text: "Each line clearly shows that `counter` is being updated." },
            ],
            output: String.raw`[1] 2`,
            outputNote: "Same result as with `<<-` (2), but anyone reading the code can see exactly where `counter` changes.",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Calling a function without a required argument",
      wrong: `greet <- function(name, greeting = "Hello") {
  paste0(greeting, ", ", name, "!")
}

greet()`,
      error: `argument "name" is missing, with no default`,
      why: "`greeting` has a default, but `name` does not, so R cannot run the function without it. The message even tells you which argument is missing.",
      right: `greet <- function(name, greeting = "Hello") {
  paste0(greeting, ", ", name, "!")
}

greet("Sam")`,
    },
    {
      title: "Expecting a function to change your variable",
      wrong: `add_bonus <- function(scores) {
  scores <- scores + 5
  scores
}

scores <- c(70, 80, 90)
add_bonus(scores)
mean(scores)`,
      why: "The function only changes its own local copy. `scores` outside is still `c(70, 80, 90)`, so the mean is 80, not 85. There is no error – the result is just not what you intended.",
      right: `add_bonus <- function(scores) {
  scores <- scores + 5
  scores
}

scores <- c(70, 80, 90)
scores <- add_bonus(scores)
mean(scores)`,
    },
    {
      title: "Using a local variable outside its function",
      wrong: `make_total <- function(a, b) {
  total <- a + b
  total
}

make_total(2, 3)
total * 2`,
      error: "object 'total' not found",
      why: "`total` only existed inside the function while it was running. Outside, there is no variable with that name.",
      right: `make_total <- function(a, b) {
  total <- a + b
  total
}

total <- make_total(2, 3)
total * 2`,
    },
    {
      title: "Adding brackets when passing a function",
      wrong: `summarise_with <- function(x, f) {
  f(x)
}

summarise_with(c(4, 8, 6), mean())`,
      error: `argument "x" is missing, with no default`,
      why: "`mean()` with brackets *calls* `mean` immediately, with no data, instead of handing the function itself to `summarise_with()`.",
      right: `summarise_with <- function(x, f) {
  f(x)
}

summarise_with(c(4, 8, 6), mean)`,
    },
    {
      title: "Misspelling an argument that ends up in ...",
      wrong: `mean_rounded <- function(x, digits = 1, ...) {
  round(mean(x, ...), digits)
}

mean_rounded(c(3, NA, 5), na_rm = TRUE)`,
      why: "`na_rm` (underscore) is not the real argument `na.rm`, but `...` swallows it without complaint, so the missing value is not removed and the result is `NA`.",
      right: `mean_rounded <- function(x, digits = 1, ...) {
  round(mean(x, ...), digits)
}

mean_rounded(c(3, NA, 5), na.rm = TRUE)`,
    },
  ],
  exerciseIds: ["m8-price-with-tax", "m8-describe-scores"],
  quiz: [
    {
      id: "m8-fn-q3",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `fee <- function(amount, rate = 0.1) {
  amount * rate
}

fee(200)
fee(rate = 0.5, amount = 10)`,
      options: ["[1] 20\n[1] 5", "[1] 20\n[1] 0.5", "[1] 2000\n[1] 5", "[1] 20\n[1] 1"],
      answer: 0,
      optionFeedback: [
        "Correct!",
        "In the second call the arguments are named, so `amount = 10` and `rate = 0.5`: 10 × 0.5 = 5.",
        "The default `rate` is 0.1, so 200 × 0.1 = 20.",
        "The second call overrides the default rate with 0.5; it does not use 0.1.",
      ],
      explanation: "`fee(200)` uses the default rate: 200 × 0.1 = 20. In `fee(rate = 0.5, amount = 10)` both arguments are matched by name, so the order does not matter: 10 × 0.5 = 5.",
      concept: "named-arguments",
    },
    {
      id: "m8-fn-q4",
      type: "multiple-choice",
      prompt: "You want `stats_of(x)` to give back both the mean and the standard deviation of `x`. Which body does that correctly?",
      options: [
        "`list(mean = mean(x), sd = sd(x))`",
        "`return(mean(x), sd(x))`",
        "`mean(x)` on one line and `sd(x)` on the next line",
        "`print(mean(x)); print(sd(x))`",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – one named list holds both results, and the caller can use `$mean` and `$sd`.",
        "`return()` accepts only one value. R stops with \"multi-argument returns are not permitted\".",
        "Only the value of the *last* line is returned, so you would get just the standard deviation.",
        "`print()` shows the numbers on screen, but the function only returns the last one – you cannot store both in a variable.",
      ],
      explanation: "A function returns exactly one object. To return several results, put them in a named list; the caller then extracts each one with `$`.",
      concept: "return-list",
    },
    {
      id: "m8-fn-q5",
      type: "fill-blank",
      prompt: "Complete the code with the short way of writing an anonymous function, so that it keeps only the values above 50.",
      code: "Filter(___(x) x > 50, c(20, 60, 80))",
      accept: ["\\", "function"],
      hint: "Since R 4.1 a single character can replace the word `function`.",
      explanation: "`\\(x) x > 50` is shorthand for `function(x) x > 50`. `Filter()` calls it for each value and keeps 60 and 80.",
      concept: "anonymous-functions",
    },
    {
      id: "m8-fn-q6",
      type: "true-false",
      prompt: "A variable created with `<-` inside a function is still available in your workspace after the function has finished.",
      answer: false,
      explanation: "Variables created inside a function are *local*: they live in the function's temporary environment and disappear when it ends. Only the returned value comes back – assign it if you want to keep it.",
      concept: "function-scope",
    },
    {
      id: "m8-fn-q7",
      type: "find-error",
      prompt: "This code stops with an error. Click the line where R stops.",
      code: `make_greeting <- function(name) {
  message_text <- paste("Hi", name)
  message_text
}
make_greeting("Sam")
print(message_text)`,
      errorLine: 6,
      errorKind: "error",
      fix: `make_greeting <- function(name) {
  message_text <- paste("Hi", name)
  message_text
}
greeting <- make_greeting("Sam")
print(greeting)`,
      explanation: "`message_text` is a local variable that only existed while `make_greeting()` was running, so line 6 fails with \"object 'message_text' not found\". Store the returned value in a variable of your own and print that instead.",
      concept: "function-scope",
    },
    {
      id: "m8-fn-q8",
      type: "multiple-choice",
      prompt: "Why do experienced R programmers avoid `<<-` in everyday code?",
      options: [
        "It changes variables outside the function behind the scenes, which makes code hard to read, rerun and debug.",
        "It is slower than `<-`.",
        "It only works on numbers.",
        "It was removed from recent versions of R.",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – the problem is hidden side effects.",
        "Speed is not the issue; clarity is.",
        "`<<-` works with any type of value.",
        "`<<-` still exists; it is just rarely the right tool.",
      ],
      explanation: "`<<-` makes a function modify something outside itself. Nothing in the call shows this, so results start to depend on which functions ran before. Returning a value and assigning it keeps every change visible.",
      concept: "global-assignment",
    },
  ],
  keyPoints: [
    "A default argument (`greeting = \"Hello\"`) is used whenever the caller leaves that argument out.",
    "Arguments are matched by position or by name; named arguments can be given in any order and make calls easier to read.",
    "`...` collects extra arguments – pass them on to another function or gather them with `c(...)` or `list(...)`.",
    "A function returns one object; return several results by packing them into a named list.",
    "Functions are objects: pass them without brackets, and write small anonymous functions with `function(x)` or `\\(x)`.",
    "Use `stop()` and `stopifnot()` at the top of a function to reject bad input with a clear message.",
    "R looks up a name in the function first, then where the function was created, then in packages; local variables vanish when the function ends.",
    "Functions work on copies of their arguments; assign the result to keep it, and avoid `<<-`.",
  ],
  concepts: [
    "default-arguments",
    "named-arguments",
    "dots",
    "return-list",
    "functions-as-arguments",
    "anonymous-functions",
    "input-validation",
    "function-scope",
    "global-assignment",
  ],
  glossary: ["function", "argument", "parameter", "default-argument", "return-value", "anonymous-function", "environment", "scope", "list", "error"],
  playground: `# A flexible summary function – change the defaults and the data
describe <- function(x, digits = 1, ...) {
  list(
    mean = round(mean(x, ...), digits),
    sd = round(sd(x, ...), digits),
    n = length(x)
  )
}

describe(c(4, 8, 15, 16, 23, 42))
describe(c(4, NA, 15), na.rm = TRUE)
`,
};
