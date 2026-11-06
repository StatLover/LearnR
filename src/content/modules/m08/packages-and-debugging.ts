import type { Lesson } from "../../types";

export const packagesDebuggingLesson: Lesson = {
  id: "packages-and-debugging",
  module: 8,
  title: "Packages and Debugging",
  summary:
    "Understand what packages are and how to load them, then learn a calm, systematic way to find and fix bugs: read the error, inspect your data, check assumptions and handle failures with tryCatch().",
  minutes: 45,
  objectives: [
    "Explain what a package is, what CRAN is, and the difference between installing and loading a package.",
    "Use functions from a package with `library()` or with the `package::function()` notation.",
    "Read an R error message and find the line and the function where it happened.",
    "Inspect values with `print()`, `cat()`, `str()` and `class()` to locate a bug.",
    "Check assumptions with `stopifnot()` and raise your own warnings with `warning()`.",
    "Handle expected failures gracefully with `tryCatch()`.",
    "Follow a step-by-step checklist when your code does not work.",
  ],
  intro: `R on its own already contains thousands of functions, but its real power comes from **packages** – free add-ons written by the R community. You have used some already: dplyr, tidyr and ggplot2. In the first part of this lesson you will understand what a package really is and the two ways to use one.

The second part is about something every programmer does every day: **debugging** – finding and fixing the mistakes (*bugs*) in code. Errors are not a sign that you are bad at programming; they are R's way of telling you exactly what confused it. You will learn to read those messages, to look inside your data and functions, to make your code check its own assumptions, and to keep going when you *expect* something might fail.`,
  sections: [
    {
      id: "what-is-a-package",
      title: "What is a package?",
      blocks: [
        {
          kind: "definition",
          term: "Package",
          md: "A bundle of R functions (and often data and documentation) that someone has shared so that others can use it. Installing a package is like adding a new book to your bookshelf; loading it with `library()` is like taking that book off the shelf and opening it.",
        },
        {
          kind: "definition",
          term: "CRAN",
          md: "The *Comprehensive R Archive Network*, the official online store (free!) of R packages. It holds over 20,000 checked packages – dplyr, ggplot2, stringr and lubridate all come from there.",
        },
        {
          kind: "text",
          md: `Some packages come **with R itself** and are loaded automatically every time R starts: \`base\` (the core language), \`stats\` (statistics such as \`sd()\` and \`t.test()\`), \`utils\` (\`read.csv()\`, \`head()\`), \`graphics\` (\`plot()\`) and a few more. That is why you could use \`mean()\` from your very first lesson without loading anything.`,
        },
        {
          kind: "code",
          example: {
            id: "which-package",
            title: "Which package does a function come from?",
            code: `environmentName(environment(mean))
environmentName(environment(sd))
environmentName(environment(read.csv))`,
            explanation: [
              { code: `environmentName(environment(mean))`, text: "`environment(mean)` is the environment in which `mean()` was defined; `environmentName()` gives its name – the package." },
              { code: `environmentName(environment(sd))`, text: "`sd()` belongs to the `stats` package." },
              { code: `environmentName(environment(read.csv))`, text: "`read.csv()` belongs to `utils`." },
            ],
            output: String.raw`[1] "base"
[1] "stats"
[1] "utils"`,
            outputNote: "All three packages are part of standard R and loaded automatically. In RStudio, the help page of any function (`?sd`) also shows its package in the top-left corner, e.g. `sd {stats}`.",
          },
        },
        {
          kind: "steps",
          title: "Installing versus loading",
          items: [
            "**Install once** (per computer): in RStudio you type `install.packages(\"dplyr\")` in the console. R downloads the package from CRAN and stores it in your *library* (a folder of installed packages).",
            "**Load every session**: `library(dplyr)` makes the package's functions available until you close R. Put `library()` calls at the top of your scripts.",
            "**On this website** you never need `install.packages()`: the first time you run `library(dplyr)`, the package is installed automatically for you (this can take a few seconds).",
            "**Not everything runs in the browser**: R Academy runs R inside your web browser (webR). Most popular packages work, but some packages that need extra system software or internet access are not available here. You will see a message if a package cannot be installed; such packages still work in RStudio on your own computer.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Do not put install.packages() in shared scripts",
          md: "Installing is a one-time setup step. If a script calls `install.packages()` every time it runs, it re-downloads packages for everyone who runs it. Keep only `library()` calls in scripts and mention in a comment which packages must be installed.",
        },
      ],
    },
    {
      id: "library-vs-colons",
      title: "library() versus ::",
      blocks: [
        {
          kind: "code",
          example: {
            id: "library-stringr",
            title: "Loading a package with library()",
            code: `library(stringr)

str_to_upper("packages add new functions")
str_count("banana", "a")`,
            packages: ["stringr"],
            explanation: [
              { code: `library(stringr)`, text: "Loads (attaches) stringr. From now on, every stringr function can be used by its short name." },
              { code: `str_to_upper("packages add new functions")`, text: "A stringr function – the same job as base R's `toupper()`." },
              { code: `str_count("banana", "a")`, text: "Counts how often a pattern occurs." },
            ],
            output: String.raw`[1] "PACKAGES ADD NEW FUNCTIONS"
[1] 3`,
          },
        },
        {
          kind: "text",
          md: "The second way to use a package function is the **double colon**: `package::function()`. It uses one function from the package *without* attaching the whole package, and it makes it crystal clear where the function comes from.",
        },
        {
          kind: "code",
          example: {
            id: "double-colon",
            title: "Using one function with ::",
            code: `stringr::str_to_title("no library call needed")
stringr::str_pad("7", width = 3, pad = "0")`,
            packages: ["stringr"],
            explanation: [
              { code: `stringr::str_to_title("no library call needed")`, text: "Read `::` as \"from the package\": *stringr's* `str_to_title()`. No `library()` call is necessary (the package must still be installed)." },
              { code: `stringr::str_pad("7", width = 3, pad = "0")`, text: "Pads text to a fixed width – handy for codes like `007`." },
            ],
            output: String.raw`[1] "No Library Call Needed"
[1] "007"`,
          },
        },
        {
          kind: "text",
          md: "**Masking.** Two packages may contain functions with the same name. dplyr has a `filter()` for data frames, and the built-in `stats` package has a different `filter()` for time series. When you call `library(dplyr)`, R reports that dplyr's `filter()` *masks* the one from stats: the most recently loaded package wins. Writing `dplyr::filter()` or `stats::filter()` removes any doubt about which one you mean.",
        },
        {
          kind: "code",
          example: {
            id: "masking",
            title: "Being explicit avoids masking surprises",
            code: `library(dplyr)

efficient <- dplyr::filter(mtcars, mpg > 30)
efficient[, c("mpg", "cyl", "hp")]`,
            packages: ["dplyr"],
            explanation: [
              { code: `library(dplyr)`, text: "Loading dplyr prints notes about masked functions (they are shown dimmed in the console and are not errors)." },
              { code: `efficient <- dplyr::filter(mtcars, mpg > 30)`, text: "Explicitly uses dplyr's `filter()` to keep cars that do more than 30 miles per gallon." },
            ],
            output: String.raw`                mpg cyl  hp
Fiat 128       32.4   4  66
Honda Civic    30.4   4  52
Toyota Corolla 33.9   4  65
Lotus Europa   30.4   4 113`,
          },
        },
        {
          kind: "table",
          caption: "Two ways to use a package",
          headers: ["", "`library(pkg)` then `fun()`", "`pkg::fun()`"],
          rows: [
            ["What it does", "Attaches the whole package for the session", "Uses a single function, nothing attached"],
            ["Typing", "Short names afterwards", "Longer, but self-explaining"],
            ["Good for", "Packages you use a lot in a script", "One-off uses; avoiding name clashes; making the source obvious"],
          ],
        },
        {
          kind: "question",
          question: {
            id: "m8-debug-q1",
            type: "multiple-choice",
            prompt: "In RStudio on your own computer, what is the difference between `install.packages(\"lubridate\")` and `library(lubridate)`?",
            options: [
              "`install.packages()` downloads the package once; `library()` loads it into the current session and is needed every time you start R.",
              "They do the same thing; `library()` is just the newer name.",
              "`library()` downloads the package and `install.packages()` loads it.",
              "`install.packages()` must be run before every script, `library()` only once.",
            ],
            answer: 0,
            optionFeedback: [
              "Correct – install once, load every session.",
              "They are different steps: getting the package onto your computer versus opening it for use.",
              "It is the other way round.",
              "It is the other way round: install once, load each session.",
            ],
            explanation: "Installing puts the package into your library folder (once per computer). Loading with `library()` makes its functions available in the current R session, so it goes at the top of every script that uses the package.",
            concept: "packages",
          },
        },
      ],
    },
    {
      id: "reading-errors",
      title: "Reading error messages",
      blocks: [
        {
          kind: "text",
          md: `R talks to you in three ways when something is unusual:

* An **error** stops the code. Nothing after it runs.
* A **warning** lets the code finish but tells you something looks suspicious – the result may be wrong.
* A **message** is just information (for example, a package's start-up notes).

An error message has a fixed structure. Learn to read it from left to right:`,
        },
        { kind: "diagram", name: "error-anatomy", caption: "\"Error in\" + the call that failed + a colon + what went wrong." },
        {
          kind: "code",
          example: {
            id: "error-anatomy-example",
            title: "Taking an error apart",
            code: `scores <- c(80, 95, "70")
total <- sum(scores)`,
            explanation: [
              { code: `scores <- c(80, 95, "70")`, text: "The bug is here: one value is text, so `c()` turns the *whole* vector into text (`\"80\"`, `\"95\"`, `\"70\"`)." },
              { code: `total <- sum(scores)`, text: "R stops on this line. The console marks the line, and the message names the call `sum(scores)`." },
            ],
            output: String.raw`Error in sum(scores) : invalid 'type' (character) of argument`,
            expectError: true,
            outputNote: "Read it in parts: `Error in sum(scores)` – the call that failed; `invalid 'type' (character) of argument` – what went wrong: `sum()` received text. Notice that the line where R stops is not always the line with the mistake. Here the cause is one line earlier.",
          },
        },
        {
          kind: "table",
          caption: "Common error messages and what they usually mean",
          headers: ["Message", "Usual cause", "What to check"],
          rows: [
            ["`object 'x' not found`", "A typo in a name, or the line that creates `x` has not been run", "Spelling and capitals; run the script from the top"],
            ["`could not find function \"f\"`", "A typo in a function name, or the package is not loaded", "Spelling; add `library(pkg)` or use `pkg::f()`"],
            ["`non-numeric argument to binary operator`", "Maths (`+`, `-`, `*`, `/`) on text", "`class()` of each value; convert with `as.numeric()`"],
            ["`unexpected symbol` / `unexpected ')'`", "A syntax slip: missing comma, bracket or quote", "The line and column shown in the message"],
            ["`argument \"x\" is missing, with no default`", "A required argument was not supplied", "The function call's arguments"],
            ["`$ operator is invalid for atomic vectors`", "Using `$` on a vector instead of a list or data frame", "`str()` of the object"],
            ["`subscript out of bounds`", "Asking for an element or column that does not exist", "`length()`, `dim()` or `names()`"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "warning-example",
            title: "A warning: the code runs, but look closer",
            code: `values <- c("12", "7", "seven")
numbers <- as.numeric(values)
numbers
mean(numbers, na.rm = TRUE)`,
            explanation: [
              { code: `numbers <- as.numeric(values)`, text: "`\"seven\"` cannot be turned into a number, so it becomes `NA` and R warns you." },
              { code: `numbers`, text: "The third value is now `NA` – information has been lost." },
              { code: `mean(numbers, na.rm = TRUE)`, text: "The code keeps running, but the mean is based on only two of the three values." },
            ],
            output: String.raw`Warning message:
NAs introduced by coercion
[1] 12  7 NA
[1] 9.5`,
            outputNote: "The warning is printed right after the line that caused it. Never ignore a warning: here it tells you that some of your data was not understood.",
          },
        },
      ],
    },
    {
      id: "inspect",
      title: "Look inside: print(), cat(), str() and class()",
      blocks: [
        {
          kind: "text",
          md: "Most bugs come from a value not being what you *think* it is. The fastest way to find them is to **look**. Inside a function, add temporary `cat()` or `print()` lines that show the intermediate values – often called *print debugging*.",
        },
        {
          kind: "code",
          example: {
            id: "print-debugging",
            title: "Print debugging inside a function",
            code: String.raw`average_of_top <- function(scores, n) {
  sorted <- sort(scores, decreasing = TRUE)
  top <- sorted[1:n]
  cat("top values:", top, "\n")
  mean(top)
}

average_of_top(c(70, 95, 88, 60), 2)
average_of_top(c(70, 95), 3)`,
            explanation: [
              { code: `  top <- sorted[1:n]`, text: "Takes the first `n` values of the sorted scores." },
              { code: String.raw`  cat("top values:", top, "\n")`, text: "A temporary debugging line: it shows what `top` really contains each time the function runs." },
              { code: `average_of_top(c(70, 95, 88, 60), 2)`, text: "Works as expected: the two best scores are 95 and 88." },
              { code: `average_of_top(c(70, 95), 3)`, text: "Returns `NA`. The debug line reveals why: asking for 3 values from a vector of 2 adds an `NA`." },
            ],
            output: String.raw`top values: 95 88
[1] 91.5
top values: 95 70 NA
[1] NA`,
            outputNote: "Without the `cat()` line you would only see `NA` and have to guess. Once you understand the bug, fix it (for example with `stopifnot(n <= length(scores))`) and delete the debugging line.",
          },
        },
        {
          kind: "code",
          example: {
            id: "check-types",
            title: "Checking types with class() and str()",
            code: `prices <- data.frame(
  item = c("pen", "book", "bag"),
  price = c("1.50", "12", "n/a")
)

class(prices$price)
str(prices)
as.numeric(prices$price)`,
            explanation: [
              { code: `  price = c("1.50", "12", "n/a")`, text: "Prices typed as text – this happens a lot when data comes from spreadsheets with entries like `n/a`." },
              { code: `class(prices$price)`, text: "`class()` tells you the type of one object: `\"character\"`, not `\"numeric\"`." },
              { code: `str(prices)`, text: "`str()` (*structure*) shows every column with its type (`chr`, `num`, `int`) and first values – the single most useful debugging function for data frames." },
              { code: `as.numeric(prices$price)`, text: "Converting reveals the problem value: `\"n/a\"` becomes `NA`, with a warning." },
            ],
            output: String.raw`[1] "character"
'data.frame':	3 obs. of  2 variables:
 $ item : chr  "pen" "book" "bag"
 $ price: chr  "1.50" "12" "n/a"
[1]  1.5 12.0   NA
Warning message:
NAs introduced by coercion`,
          },
        },
      ],
    },
    {
      id: "defensive",
      title: "Catching problems early: stopifnot() and warning()",
      blocks: [
        {
          kind: "text",
          md: "In the first lesson of this module you used `stopifnot()` to check a function's inputs. It is just as useful in an analysis script: after loading or cleaning data, **state what you expect** to be true. If the data ever changes, the script stops at the exact spot where an assumption is broken, instead of quietly producing wrong results.",
        },
        {
          kind: "code",
          example: {
            id: "stopifnot-data",
            title: "Checking assumptions about your data",
            code: `students <- read.csv("data/students.csv")

stopifnot(nrow(students) == 60)
stopifnot(all(students$math >= 0 & students$math <= 100))
stopifnot(!anyNA(students$science))`,
            explanation: [
              { code: `stopifnot(nrow(students) == 60)`, text: "We expect 60 students. True, so nothing happens and the script carries on." },
              { code: `stopifnot(all(students$math >= 0 & students$math <= 100))`, text: "Every math score must be between 0 and 100. Also true." },
              { code: `stopifnot(!anyNA(students$science))`, text: "We assumed there are no missing science scores – but there are, so R stops here and shows the broken assumption." },
            ],
            output: String.raw`Error: !anyNA(students$science) is not TRUE`,
            expectError: true,
            outputNote: "Silent checks pass; the failing one names exactly which assumption is wrong. Now you know you must handle the missing science scores (for example with `na.rm = TRUE`).",
          },
        },
        {
          kind: "text",
          md: "Your own functions can also **warn** instead of stopping. Use `warning(\"...\")` when the function can still produce a result, but the user should know about something.",
        },
        {
          kind: "code",
          example: {
            id: "own-warning",
            title: "Raising your own warning",
            code: `mean_without_na <- function(x) {
  if (anyNA(x)) {
    warning("x contains missing values; they were ignored")
  }
  mean(x, na.rm = TRUE)
}

mean_without_na(c(4, 8, 6))
mean_without_na(c(4, NA, 8))`,
            explanation: [
              { code: `  if (anyNA(x)) {`, text: "`anyNA()` is `TRUE` if at least one value is missing." },
              { code: `    warning("x contains missing values; they were ignored")`, text: "Raises a warning with your message. Unlike `stop()`, the function keeps going." },
              { code: `mean_without_na(c(4, NA, 8))`, text: "The result (6) is returned *and* the warning is shown, naming the call it came from." },
            ],
            output: String.raw`[1] 6
[1] 6
Warning message:
In mean_without_na(c(4, NA, 8)) : x contains missing values; they were ignored`,
          },
        },
      ],
    },
    {
      id: "trycatch",
      title: "Handling errors gracefully with tryCatch()",
      blocks: [
        {
          kind: "text",
          md: `Sometimes you **expect** that a step might fail – one bad value among hundreds, a file that may be missing – and you want your code to handle it and carry on rather than stop. \`tryCatch()\` runs some code and lets you say what to do *if* an error (or warning) happens:

\`\`\`r
tryCatch(
  code_that_might_fail,
  error = function(e) what_to_do_instead
)
\`\`\`

The *handler* \`function(e)\` receives the error object \`e\`; \`conditionMessage(e)\` gives you its message text. Whatever the handler returns becomes the result of \`tryCatch()\`.`,
        },
        {
          kind: "code",
          example: {
            id: "trycatch-basic",
            title: "Catching an error",
            code: `result <- tryCatch(
  log("ten"),
  error = function(e) {
    message("Could not compute the log: ", conditionMessage(e))
    NA
  }
)

result`,
            explanation: [
              { code: `  log("ten"),`, text: "The code to try. `log()` of text is an error." },
              { code: `  error = function(e) {`, text: "Instead of stopping, R calls this handler with the error object `e`." },
              { code: `    message("Could not compute the log: ", conditionMessage(e))`, text: "Reports what happened, including R's original message." },
              { code: `    NA`, text: "The handler's last value, `NA`, becomes the result of `tryCatch()`." },
              { code: `result`, text: "The script carried on: `result` is `NA` and the next lines can run." },
            ],
            output: String.raw`Could not compute the log: non-numeric argument to mathematical function
[1] NA`,
          },
        },
        {
          kind: "code",
          example: {
            id: "trycatch-many",
            title: "Keep going through many values",
            code: `inputs <- list(100, "abc", -1, 1000)

safe_log10 <- function(x) {
  tryCatch(
    log10(x),
    error = function(e) NA,
    warning = function(w) NA
  )
}

sapply(inputs, safe_log10)`,
            explanation: [
              { code: `inputs <- list(100, "abc", -1, 1000)`, text: "A mix of good and bad inputs: text causes an *error*, a negative number causes a *warning* (`NaNs produced`)." },
              { code: `    error = function(e) NA,`, text: "If an error happens, return `NA`." },
              { code: `    warning = function(w) NA`, text: "If a warning happens, also return `NA`, so that suspicious results are not used." },
              { code: `sapply(inputs, safe_log10)`, text: "Every input is processed; the bad ones become `NA` instead of stopping the whole job." },
            ],
            output: String.raw`[1]  2 NA NA  3`,
            tryIt: "Change the error handler to `function(e) -999` and see how the result changes.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Do not hide bugs",
          md: "`tryCatch()` is for failures you *expect* and can handle sensibly. Wrapping everything in `tryCatch(..., error = function(e) NULL)` just hides your bugs – the code \"works\" but you no longer know when something is wrong. At the very least, report the problem with `message()`. (`tryCatch()` also has a `finally = { ... }` part that always runs at the end, error or not – useful for clean-up steps.)",
        },
      ],
    },
    {
      id: "checklist",
      title: "A systematic debugging checklist",
      blocks: [
        {
          kind: "text",
          md: "When code does not work, resist the urge to change things at random. Work through the problem step by step. In nested functions, also look at the **call stack** – the chain of function calls that led to the error.",
        },
        {
          kind: "code",
          example: {
            id: "nested-error",
            title: "An error deep inside nested functions",
            code: `convert <- function(x) {
  log(x)
}

summarise_values <- function(values) {
  converted <- convert(values)
  mean(converted)
}

summarise_values(c("1", "10", "100"))`,
            explanation: [
              { code: `summarise_values(c("1", "10", "100"))`, text: "You call `summarise_values()` with text by mistake…" },
              { code: `  converted <- convert(values)`, text: "…which calls `convert()`…" },
              { code: `  log(x)`, text: "…which calls `log()` – and *that* is where R gives up." },
            ],
            output: String.raw`Error in log(x) : non-numeric argument to mathematical function`,
            expectError: true,
            outputNote: "The message names only the innermost call, `log(x)`. The call stack is `summarise_values(...)` → `convert(values)` → `log(x)`. Reading it from the outside in tells you where the bad value came from: the text passed in the very first call.",
          },
        },
        {
          kind: "steps",
          title: "Debugging checklist",
          items: [
            "**Read the whole message.** Which function failed (after `Error in`) and what went wrong (after the colon)?",
            "**Find the line.** The console marks the line where R stopped. Remember the real mistake may be on an earlier line.",
            "**Check spelling and capitals** of every name on that line – `Math` is not `math`.",
            "**Run from the top.** Restart (clear the workspace) and run the script in order, so every variable is created before it is used.",
            "**Inspect the inputs** with `print()`, `str()`, `class()`, `length()` and `head()`. Is each value the type and size you expect?",
            "**Shrink the problem.** Run the failing line on its own, or with a tiny example vector, until you see exactly which part misbehaves.",
            "**Check your assumptions** with `stopifnot()` so that the script stops at the first broken one.",
            "**Fix one thing at a time** and run again. If you are stuck, copy the exact error message into a search engine or ask the AI tutor.",
          ],
        },
        {
          kind: "callout",
          tone: "info",
          title: "traceback(), browser() and the Error Detective",
          md: "In RStudio you can type `traceback()` right after an error to print the call stack, and put `browser()` inside a function to pause it and explore its variables line by line. Those interactive tools need a desktop R session. On R Academy, paste your code into the [Error Detective](/error-checker) page instead: it runs the code, highlights the line where the error happened, explains the message in plain English and shows the call stack.",
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Using a package function without loading the package",
      wrong: `str_to_upper("hello")`,
      error: `could not find function "str_to_upper"`,
      why: "`str_to_upper()` lives in the stringr package. Until the package is loaded, R does not know the name.",
      right: `library(stringr)
str_to_upper("hello")`,
    },
    {
      title: "A capital letter in the wrong place",
      wrong: `total_score <- 42
Total_score * 2`,
      error: "object 'Total_score' not found",
      why: "R is case-sensitive: `Total_score` and `total_score` are two different names, and only the second one exists.",
      right: `total_score <- 42
total_score * 2`,
    },
    {
      title: "Ignoring a warning",
      wrong: `ages <- as.numeric(c("34", "29", "forty"))
mean(ages, na.rm = TRUE)`,
      error: "NAs introduced by coercion",
      why: "The code runs, so it is tempting to ignore the warning. But `\"forty\"` became `NA`, so the mean silently uses only two of the three people. Fix the data instead.",
      right: `ages <- as.numeric(c("34", "29", "40"))
mean(ages)`,
    },
    {
      title: "Silencing errors instead of fixing them",
      wrong: `result <- tryCatch(sum(c("1", "2")), error = function(e) NULL)
result`,
      why: "The handler throws the error away and returns `NULL`, so you never learn that `sum()` received text. Handle errors only when you know what the right fallback is, and report them.",
      right: `result <- sum(as.numeric(c("1", "2")))
result`,
    },
  ],
  exerciseIds: ["m8-fix-the-bugs", "m8-safe-convert"],
  quiz: [
    {
      id: "m8-debug-q2",
      type: "fill-blank",
      prompt: "Complete the code so that it uses `str_detect()` from the stringr package without calling `library()`.",
      code: `stringr___str_detect("apple", "pp")`,
      accept: ["::"],
      hint: "Two identical characters connect a package name and a function name.",
      explanation: "`stringr::str_detect()` means \"the `str_detect()` function from the stringr package\". It works without `library(stringr)`, as long as the package is installed.",
      concept: "library-vs-colons",
    },
    {
      id: "m8-debug-q3",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `tryCatch(
  stop("boom"),
  error = function(e) "caught it"
)`,
      options: ["[1] \"caught it\"", "Error: boom", "[1] \"boom\"", "Error in tryCatch() : caught it"],
      answer: 0,
      optionFeedback: [
        "Correct – the error is caught and the handler's value is returned.",
        "The error never reaches the console, because `tryCatch()` caught it.",
        "The handler returns \"caught it\"; it does not return the error message (that would need `conditionMessage(e)`).",
        "No error is printed at all.",
      ],
      explanation: "`stop(\"boom\")` raises an error, `tryCatch()` intercepts it and calls the error handler, and the handler's return value, `\"caught it\"`, becomes the printed result.",
      concept: "trycatch",
    },
    {
      id: "m8-debug-q4",
      type: "true-false",
      prompt: "A warning stops your code in the same way as an error.",
      answer: false,
      explanation: "An error stops the code. A warning lets the code finish but tells you that something may be wrong – for example that some text could not be converted to numbers. Always read warnings carefully.",
      concept: "warnings",
    },
    {
      id: "m8-debug-q5",
      type: "find-error",
      prompt: "This code stops with an error. Click the line where R stops.",
      code: `library(stringr)
words <- c("data", "science")
str_to_uper(words)`,
      errorLine: 3,
      errorKind: "error",
      fix: `library(stringr)
words <- c("data", "science")
str_to_upper(words)`,
      explanation: "`str_to_uper` is missing a `p`. R reports `could not find function \"str_to_uper\"` – a classic sign of a typo (or of a package that has not been loaded).",
      concept: "reading-errors",
    },
    {
      id: "m8-debug-q6",
      type: "multiple-choice",
      prompt: "You see `Error in sum(scores) : invalid 'type' (character) of argument`. What is the most useful first step?",
      options: [
        "Check the type of `scores`, e.g. with `class(scores)` or `str(scores)`.",
        "Reinstall R.",
        "Wrap the line in `tryCatch()` so the error disappears.",
        "Replace `sum()` with `mean()`.",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – the message says `sum()` received character data, so look at what `scores` really is.",
        "Nothing is wrong with R; the problem is the data passed to `sum()`.",
        "That hides the bug instead of fixing it.",
        "`mean()` would also fail on text; the type of `scores` is the problem.",
      ],
      explanation: "The message says the argument has type *character*. `class(scores)` will confirm it; then find where the text came from (often a stray quoted value or an unconverted column) and convert it with `as.numeric()`.",
      concept: "checking-types",
    },
  ],
  keyPoints: [
    "A package is a shareable bundle of functions; CRAN is the official archive of R packages.",
    "Install a package once (`install.packages()` in RStudio – automatic on this site), and load it in every session with `library()`.",
    "`pkg::fun()` uses one function without attaching the package and avoids confusion when packages mask each other's functions.",
    "Errors stop the code, warnings let it continue but signal a possible problem; read both carefully.",
    "An error message names the failed call and what went wrong; the true mistake may be on an earlier line.",
    "`print()`, `cat()`, `str()` and `class()` show what your values really are – most bugs are values that are not what you expected.",
    "`stopifnot()` checks assumptions, `warning()` raises your own warnings, and `tryCatch()` handles expected failures without stopping.",
    "Debug systematically: read, locate, inspect, shrink, check assumptions, change one thing at a time.",
  ],
  concepts: [
    "packages",
    "library-vs-colons",
    "reading-errors",
    "warnings",
    "print-debugging",
    "checking-types",
    "trycatch",
    "debugging-checklist",
  ],
  glossary: ["package", "library", "tidyverse", "error", "warning", "bug", "debugging", "case-sensitive", "data-type", "coercion"],
  playground: `# A buggy function – use cat() and str() to find the problem
percent_change <- function(old, new) {
  change <- (new - old) / old * 100
  round(change, 1)
}

percent_change(50, 60)

prices_2023 <- c("10", "20", "40")
prices_2024 <- c(12, 18, 50)
str(prices_2023)
# percent_change(prices_2023, prices_2024)  # remove the # to see the error
`,
  prerequisites: ["dates-strings-and-regex"],
};
