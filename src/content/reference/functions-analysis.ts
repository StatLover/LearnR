import type { RFunction } from "../types";

/**
 * Function reference – "Logic & control", "Apply family", "Statistics",
 * "Statistical tests", "Base plots" and "Packages & help".
 * Every `output` is the real console output of `example`.
 */
export const analysisFunctions: RFunction[] = [
  /* ---------------------------------------------------------------- */
  /* Logic & control                                                  */
  /* ---------------------------------------------------------------- */
  {
    name: "ifelse",
    package: "base",
    category: "Logic & control",
    purpose:
      "Chooses between two values for every element of a vector: where the test is `TRUE` it takes `yes`, otherwise `no`. The vectorised partner of `if`, perfect for creating a new column from a condition.",
    syntax: "ifelse(test, yes, no)",
    args: [
      { name: "test", description: "A condition that gives `TRUE`/`FALSE` for each element, e.g. `scores >= 60`." },
      { name: "yes", description: "Value to use where the test is `TRUE`." },
      { name: "no", description: "Value to use where the test is `FALSE`." },
    ],
    example: `scores <- c(45, 78, 62, 90)
ifelse(scores >= 60, "pass", "fail")
ifelse(c(5, NA, -2) > 0, "positive", "not positive")`,
    output: "[1] \"fail\" \"pass\" \"pass\" \"pass\"\n[1] \"positive\"     NA             \"not positive\"",
    mistakes: [
      "Using `if` on a whole vector: `if (scores >= 60)` fails with \"the condition has length > 1\". Use `ifelse()` for vectors.",
      "Forgetting that `NA` in the test gives `NA` in the result (second line of the example). Handle missing values first if needed.",
      "Nesting many `ifelse()` calls for several categories – it gets hard to read. `cut()` or `case_when()` are clearer.",
    ],
    related: ["case_when", "any", "all", "cut"],
  },
  {
    name: "any",
    package: "base",
    category: "Logic & control",
    purpose: "Answers \"is at least one value `TRUE`?\". Typical use: `any(is.na(x))` – are there any missing values?",
    syntax: "any(..., na.rm = FALSE)",
    args: [
      { name: "...", description: "One or more logical vectors (conditions)." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `scores <- c(55, 82, 47, 91)
any(scores > 90)
any(scores < 0)
any(is.na(c(1, NA, 3)))
any(c(FALSE, NA))`,
    output: "[1] TRUE\n[1] FALSE\n[1] TRUE\n[1] NA",
    mistakes: [
      "Being surprised by `NA`: if no value is `TRUE` but one is `NA`, the answer is `NA` (R cannot be sure). Add `na.rm = TRUE` to ignore them.",
      "Using `any()` when you need *which* values match – that is `which()`.",
    ],
    related: ["all", "which", "is.na", "ifelse"],
  },
  {
    name: "all",
    package: "base",
    category: "Logic & control",
    purpose: "Answers \"are all values `TRUE`?\". Handy for checks such as \"are all ages at least 18?\".",
    syntax: "all(..., na.rm = FALSE)",
    args: [
      { name: "...", description: "One or more logical vectors." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `ages <- c(19, 25, 31)
all(ages >= 18)
all(ages > 20)
all(c(TRUE, NA))
all(c(TRUE, NA), na.rm = TRUE)`,
    output: "[1] TRUE\n[1] FALSE\n[1] NA\n[1] TRUE",
    mistakes: [
      "Not expecting `NA`: one missing value makes the answer `NA` unless you set `na.rm = TRUE`.",
      "Forgetting that `all()` of an empty vector is `TRUE` – an empty filter result passes every `all()` check.",
    ],
    related: ["any", "isTRUE", "stopifnot"],
  },
  {
    name: "isTRUE",
    package: "base",
    category: "Logic & control",
    purpose:
      "Returns `TRUE` only if its argument is a single `TRUE`; anything else (`FALSE`, `NA`, several values) gives `FALSE`. A safe guard for `if` conditions that might be `NA`.",
    syntax: "isTRUE(x)",
    args: [{ name: "x", description: "The value to check." }],
    example: `isTRUE(TRUE)
isTRUE(NA)
isTRUE(c(TRUE, TRUE))
x <- NA
if (isTRUE(x > 5)) "big" else "not big"`,
    output: "[1] TRUE\n[1] FALSE\n[1] FALSE\n[1] \"not big\"",
    mistakes: [
      "Expecting `isTRUE(c(TRUE, TRUE))` to be `TRUE` – it needs exactly one value. Use `all()` for vectors.",
      "Writing `if (x > 5)` when `x` can be `NA` – R stops with \"missing value where TRUE/FALSE needed\". `isTRUE()` avoids that.",
    ],
    related: ["all", "identical", "ifelse"],
  },
  {
    name: "identical",
    package: "base",
    category: "Logic & control",
    purpose:
      "Checks whether two objects are exactly the same – values, type and names – and gives a single `TRUE`/`FALSE`. For decimal numbers, `all.equal()` allows tiny rounding differences.",
    syntax: "identical(x, y)",
    args: [{ name: "x, y", description: "The two objects to compare." }],
    example: `identical(c(1, 2, 3), c(1, 2, 3))
identical(c(a = 1), c(1))
identical(1L, 1)
0.1 + 0.2 == 0.3
isTRUE(all.equal(0.1 + 0.2, 0.3))`,
    output: "[1] TRUE\n[1] FALSE\n[1] FALSE\n[1] FALSE\n[1] TRUE",
    mistakes: [
      "Using `==` to compare whole vectors when you want one answer – `==` compares element by element. `identical()` gives one `TRUE`/`FALSE`.",
      "Comparing decimal results exactly: `0.1 + 0.2 == 0.3` is `FALSE` because of tiny rounding errors in computer arithmetic. Use `all.equal()`.",
    ],
    related: ["isTRUE", "all", "duplicated"],
  },
  {
    name: "switch",
    package: "base",
    category: "Logic & control",
    purpose:
      "Picks one of several results based on a text value – a tidy replacement for a long chain of `if … else if …`. An unnamed last value acts as the default.",
    syntax: "switch(EXPR, name1 = value1, name2 = value2, ..., default)",
    args: [
      { name: "EXPR", description: "A single text value to match against the names." },
      { name: "name = value", description: "The possible cases and what to return for each." },
      { name: "default", description: "An unnamed final value used when nothing matches." },
    ],
    example: `day_type <- function(day) {
  switch(day,
    "Sat" = "weekend",
    "Sun" = "weekend",
    "weekday"
  )
}
day_type("Sat")
day_type("Tue")`,
    output: "[1] \"weekend\"\n[1] \"weekday\"",
    mistakes: [
      "Passing a whole vector – `switch()` handles one value at a time. For vectors use `ifelse()`, `case_when()` or `sapply()`.",
      "Leaving out the default: when nothing matches, `switch()` returns `NULL` invisibly, which can cause confusing errors later.",
    ],
    related: ["ifelse", "case_when", "sapply"],
  },
  {
    name: "stop",
    package: "base",
    category: "Logic & control",
    purpose:
      "Stops the code with your own error message. Use it in functions to refuse bad input with a clear explanation. (The example catches the error with `tryCatch()` so you can see the message.)",
    syntax: "stop(..., call. = TRUE)",
    args: [
      { name: "...", description: "The error message (pieces are pasted together)." },
      { name: "call.", description: "`FALSE` to leave the function name out of the message." },
    ],
    example: `check_age <- function(age) {
  if (age < 0) {
    stop("age cannot be negative")
  }
  age
}
check_age(30)
result <- tryCatch(check_age(-5), error = function(e) conditionMessage(e))
result`,
    output: "[1] 30\n[1] \"age cannot be negative\"",
    mistakes: [
      "Writing vague messages such as \"error\". Say what was wrong and what is expected: \"age cannot be negative\".",
      "Using `stop()` for harmless information – that is what `message()` is for.",
    ],
    related: ["stopifnot", "tryCatch", "message"],
  },
  {
    name: "stopifnot",
    package: "base",
    category: "Logic & control",
    purpose: "Checks that conditions are `TRUE` and stops with an error if one is not. A quick way to protect your code against wrong input.",
    syntax: "stopifnot(...)",
    args: [{ name: "...", description: "Conditions that must all be `TRUE`." }],
    example: `x <- c(4, 8, 15)
stopifnot(is.numeric(x), length(x) == 3)
mean(x)`,
    output: "[1] 9",
    mistakes: [
      "Expecting a friendly message – the default error just repeats the failed condition (e.g. \"length(x) == 3 is not TRUE\"). Use `stop()` for custom wording.",
      "Not expecting `NA`: a condition such as `x > 0` with an `NA` in `x` also stops, because `NA` is not `TRUE`.",
    ],
    related: ["stop", "all", "isTRUE"],
  },
  {
    name: "tryCatch",
    package: "base",
    category: "Logic & control",
    purpose:
      "Runs code and, if an error (or warning) happens, runs your handler instead of stopping everything. Use it when one failure should not end the whole script.",
    syntax: "tryCatch(expr, error = function(e) ..., warning = function(w) ..., finally = ...)",
    args: [
      { name: "expr", description: "The code to try." },
      { name: "error", description: "A function that runs if an error occurs; `conditionMessage(e)` gives the error text." },
      { name: "warning", description: "Optional: a function that runs if a warning occurs." },
      { name: "finally", description: "Optional: code that always runs at the end." },
    ],
    example: `safe_log <- function(x) {
  tryCatch(
    log(x),
    error = function(e) {
      message("Could not compute: ", conditionMessage(e))
      NA
    }
  )
}
safe_log(100)
safe_log("abc")`,
    output: "[1] 4.60517\nCould not compute: non-numeric argument to mathematical function\n[1] NA",
    mistakes: [
      "Hiding errors you should fix. Use `tryCatch()` for problems you expect (bad files, odd values), not to silence bugs.",
      "Forgetting that the handler's last value is the result – return something sensible such as `NA`.",
    ],
    related: ["stop", "message", "stopifnot"],
  },

  /* ---------------------------------------------------------------- */
  /* Apply family                                                     */
  /* ---------------------------------------------------------------- */
  {
    name: "apply",
    package: "base",
    category: "Apply family",
    purpose:
      "Applies a function to every row (`MARGIN = 1`) or every column (`MARGIN = 2`) of a matrix or numeric data frame, without writing a loop.",
    syntax: "apply(X, MARGIN, FUN, ...)",
    args: [
      { name: "X", description: "A matrix or data frame (it is turned into a matrix, so keep it all numeric)." },
      { name: "MARGIN", description: "`1` = rows, `2` = columns." },
      { name: "FUN", description: "The function to apply, e.g. `sum`, `max`, `mean`." },
      { name: "...", description: "Extra arguments for `FUN`, e.g. `na.rm = TRUE`." },
    ],
    example: `m <- matrix(1:6, nrow = 2)
m
apply(m, 1, sum)
apply(m, 2, sum)
scores <- data.frame(math = c(80, 90), art = c(70, 95))
apply(scores, 1, max)`,
    output: "     [,1] [,2] [,3]\n[1,]    1    3    5\n[2,]    2    4    6\n[1]  9 12\n[1]  3  7 11\n[1] 80 95",
    mistakes: [
      "Mixing up the margins: `1` works along rows (one result per row), `2` along columns.",
      "Using it on a data frame with text columns – everything becomes text and maths fails. Select numeric columns first.",
    ],
    related: ["sapply", "lapply", "rowSums", "colMeans"],
  },
  {
    name: "sapply",
    package: "base",
    category: "Apply family",
    purpose:
      "Applies a function to each element of a vector or list (or each column of a data frame) and simplifies the results into a vector when it can. The \"s\" stands for *simplify*.",
    syntax: "sapply(X, FUN, ...)",
    args: [
      { name: "X", description: "A vector, list or data frame." },
      { name: "FUN", description: "The function to apply to each element; can be your own `function(x) …`." },
      { name: "...", description: "Extra arguments passed on to `FUN`." },
    ],
    example: `sapply(c(1, 4, 9), sqrt)
words <- c("apple", "kiwi", "banana")
sapply(words, nchar)
sapply(mtcars[, 1:3], mean)`,
    output: "[1] 1 2 3\n apple   kiwi banana\n     5      4      6\n      mpg       cyl      disp\n 20.09062   6.18750 230.72188",
    mistakes: [
      "Writing `sapply(x, sqrt())` with parentheses – pass the function itself: `sapply(x, sqrt)`.",
      "Relying on the output shape: if results have different lengths you get a list instead of a vector. `vapply()` makes the expected shape explicit.",
    ],
    related: ["lapply", "vapply", "apply", "tapply"],
  },
  {
    name: "lapply",
    package: "base",
    category: "Apply family",
    purpose: "Applies a function to each element of a list or vector and always returns a list (\"l\" for *list*), one result per element.",
    syntax: "lapply(X, FUN, ...)",
    args: [
      { name: "X", description: "A list or vector." },
      { name: "FUN", description: "The function to apply to each element." },
      { name: "...", description: "Extra arguments passed on to `FUN`." },
    ],
    example: `nums <- list(a = 1:3, b = 4:6)
lapply(nums, sum)
lapply(c(first = 2, second = 5), function(x) x * 10)`,
    output: "$a\n[1] 6\n\n$b\n[1] 15\n\n$first\n[1] 20\n\n$second\n[1] 50",
    mistakes: [
      "Expecting a vector – `lapply()` always returns a list. Use `sapply()` or `unlist(lapply(...))` for a vector.",
      "Forgetting that inside an anonymous function, `x` is one element at a time, not the whole list.",
    ],
    related: ["sapply", "vapply", "list", "mapply"],
  },
  {
    name: "vapply",
    package: "base",
    category: "Apply family",
    purpose:
      "Like `sapply()`, but you declare what each result must look like (`FUN.VALUE`). If a result does not match, R stops with an error – safer for code you reuse.",
    syntax: "vapply(X, FUN, FUN.VALUE, ...)",
    args: [
      { name: "X", description: "A vector or list." },
      { name: "FUN", description: "The function to apply." },
      { name: "FUN.VALUE", description: "A template for one result, e.g. `numeric(1)`, `integer(1)`, `character(1)`, `logical(1)`." },
    ],
    example: `words <- c("apple", "kiwi", "banana")
vapply(words, nchar, FUN.VALUE = integer(1))
vapply(list(1:3, 4:9), length, FUN.VALUE = integer(1))`,
    output: " apple   kiwi banana\n     5      4      6\n[1] 3 6",
    mistakes: [
      "Declaring the wrong type: `nchar()` returns integers, so `FUN.VALUE = character(1)` stops with \"values must be type 'character'\".",
      "Using it when results have different lengths – that is exactly what `vapply()` refuses. Use `lapply()` then.",
    ],
    related: ["sapply", "lapply"],
  },
  {
    name: "tapply",
    package: "base",
    category: "Apply family",
    purpose:
      "Splits a vector into groups and applies a function to each group – for example the average score per class. The \"t\" comes from *table*.",
    syntax: "tapply(X, INDEX, FUN, ...)",
    args: [
      { name: "X", description: "The values to summarise (e.g. a numeric column)." },
      { name: "INDEX", description: "The grouping (a column of the same length, e.g. `df$class`)." },
      { name: "FUN", description: "The summary function, e.g. `mean`." },
    ],
    example: `tapply(mtcars$mpg, mtcars$cyl, mean)
students <- read.csv("data/students.csv")
tapply(students$math, students$class, max)`,
    output: "       4        6        8\n26.66364 19.74286 15.10000\n A  B  C\n94 99 93",
    mistakes: [
      "Passing the data frame instead of a column: the first two arguments are vectors (`df$value`, `df$group`).",
      "Getting `NA` for a group because of missing values – add `na.rm = TRUE` at the end: `tapply(x, g, mean, na.rm = TRUE)`.",
    ],
    related: ["aggregate", "sapply", "group_by", "table"],
  },
  {
    name: "mapply",
    package: "base",
    category: "Apply family",
    purpose: "Applies a function to several vectors in parallel: the first elements together, then the second elements, and so on.",
    syntax: "mapply(FUN, ...)",
    args: [
      { name: "FUN", description: "A function with as many arguments as vectors you pass." },
      { name: "...", description: "The vectors to walk through together." },
    ],
    example: `mapply(function(x, y) x + y, 1:3, c(10, 20, 30))
mapply(function(name, n) paste(name, n), c("Ana", "Ben"), c(3, 5))`,
    output: "[1] 11 22 33\n    Ana     Ben\n\"Ana 3\" \"Ben 5\"",
    mistakes: [
      "Putting the function last – unlike the other apply functions, `FUN` comes *first* in `mapply()`.",
      "Using it where plain vectorised code works: `1:3 + c(10, 20, 30)` already adds element by element.",
    ],
    related: ["sapply", "lapply"],
  },

  /* ---------------------------------------------------------------- */
  /* Statistics                                                       */
  /* ---------------------------------------------------------------- */
  {
    name: "mean",
    package: "base",
    category: "Statistics",
    purpose: "Calculates the average: add all values and divide by how many there are. Missing values make the result `NA` unless you set `na.rm = TRUE`.",
    syntax: "mean(x, trim = 0, na.rm = FALSE)",
    args: [
      { name: "x", description: "A numeric (or logical) vector." },
      { name: "trim", description: "Fraction of values to cut from each end before averaging (e.g. `0.1`), which reduces the effect of outliers." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `scores <- c(80, 90, 100)
mean(scores)
mean(c(80, 90, NA))
mean(c(80, 90, NA), na.rm = TRUE)
mean(mtcars$mpg)`,
    output: "[1] 90\n[1] NA\n[1] 85\n[1] 20.09062",
    mistakes: [
      "Passing separate numbers: `mean(80, 90, 100)` returns 80 because only the first value is used as `x`. Combine them: `mean(c(80, 90, 100))`.",
      "Forgetting `na.rm = TRUE` when the data have missing values.",
      "Using the mean for very skewed data (incomes, house prices) – one huge value pulls it up. Report the median too.",
    ],
    related: ["median", "sd", "summary", "colMeans"],
  },
  {
    name: "median",
    package: "stats",
    category: "Statistics",
    purpose:
      "Finds the middle value when the data are sorted (the average of the two middle values for an even count). Unlike the mean, it is not pulled by extreme values.",
    syntax: "median(x, na.rm = FALSE)",
    args: [
      { name: "x", description: "A numeric vector." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `incomes <- c(30, 35, 40, 45, 500)
mean(incomes)
median(incomes)
median(c(1, 2, 3, 4))`,
    output: "[1] 130\n[1] 40\n[1] 2.5",
    mistakes: [
      "Forgetting `na.rm = TRUE` – any `NA` gives `NA`.",
      "Thinking the median must be one of the data values – with an even count it is halfway between the two middle ones (2.5 above).",
    ],
    related: ["mean", "quantile", "summary", "IQR"],
  },
  {
    name: "sd",
    package: "stats",
    category: "Statistics",
    purpose:
      "Calculates the standard deviation: roughly, how far values typically are from the mean. A small sd means values are close together; a large sd means they are spread out.",
    syntax: "sd(x, na.rm = FALSE)",
    args: [
      { name: "x", description: "A numeric vector." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `heights <- c(160, 165, 170, 175, 180)
sd(heights)
sd(c(5, 5, 5))
sd(mtcars$mpg)`,
    output: "[1] 7.905694\n[1] 0\n[1] 6.026948",
    mistakes: [
      "Forgetting `na.rm = TRUE` with missing values.",
      "Expecting the population formula: `sd()` divides by n − 1 (the *sample* standard deviation), which is what you want for data that are a sample.",
      "Calling it on a single value – the result is `NA` because spread needs at least two values.",
    ],
    related: ["var", "mean", "IQR", "scale"],
  },
  {
    name: "var",
    package: "stats",
    category: "Statistics",
    purpose: "Calculates the variance: the average squared distance from the mean (sample version, dividing by n − 1). Its square root is the standard deviation.",
    syntax: "var(x, na.rm = FALSE)",
    args: [
      { name: "x", description: "A numeric vector." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `heights <- c(160, 165, 170, 175, 180)
var(heights)
sqrt(var(heights))
var(c(2, 4, NA), na.rm = TRUE)`,
    output: "[1] 62.5\n[1] 7.905694\n[1] 2",
    mistakes: [
      "Reporting the variance in the original units – it is in *squared* units (cm²). The standard deviation is usually easier to interpret.",
      "Forgetting `na.rm = TRUE` – one `NA` makes the variance `NA`.",
    ],
    related: ["sd", "mean"],
  },
  {
    name: "quantile",
    package: "stats",
    category: "Statistics",
    purpose:
      "Finds the values below which a given fraction of the data falls. By default it returns the minimum, the three quartiles (25%, 50%, 75%) and the maximum; `probs` picks other percentiles.",
    syntax: "quantile(x, probs = seq(0, 1, 0.25), na.rm = FALSE)",
    args: [
      { name: "x", description: "A numeric vector." },
      { name: "probs", description: "The fractions you want, between 0 and 1 (e.g. `0.9` for the 90th percentile)." },
      { name: "na.rm", description: "`TRUE` to ignore missing values (otherwise an `NA` causes an error)." },
    ],
    example: `scores <- c(55, 61, 68, 72, 75, 80, 84, 90, 95)
quantile(scores)
quantile(scores, probs = 0.9)
quantile(scores, probs = c(0.1, 0.5))`,
    output: "  0%  25%  50%  75% 100%\n  55   68   75   84   95\n90%\n 91\n 10%  50%\n59.8 75.0",
    mistakes: [
      "Giving percentages instead of fractions: `probs = 90` stops with \"'probs' outside [0,1]\". Use `0.9`.",
      "Data with `NA` – `quantile()` stops with an error unless you set `na.rm = TRUE`.",
    ],
    related: ["IQR", "median", "summary", "boxplot"],
  },
  {
    name: "IQR",
    package: "stats",
    category: "Statistics",
    purpose:
      "Calculates the interquartile range: the 75th percentile minus the 25th. It is the width of the middle half of the data, and outliers barely affect it.",
    syntax: "IQR(x, na.rm = FALSE)",
    args: [
      { name: "x", description: "A numeric vector." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `scores <- c(55, 61, 68, 72, 75, 80, 84, 90, 95)
IQR(scores)
quantile(scores, 0.75) - quantile(scores, 0.25)`,
    output: "[1] 16\n75%\n 16",
    mistakes: [
      "Writing `iqr()` in lower case – the function name is `IQR` in capitals (\"could not find function \\\"iqr\\\"\").",
      "Forgetting `na.rm = TRUE` when values are missing.",
    ],
    related: ["quantile", "sd", "range", "boxplot"],
  },
  {
    name: "cor",
    package: "stats",
    category: "Statistics",
    purpose:
      "Measures how strongly two numeric variables move together, from −1 (perfect opposite) through 0 (no straight-line relationship) to +1 (perfect together). Given a data frame it returns a correlation matrix.",
    syntax: "cor(x, y = NULL, use = \"everything\", method = \"pearson\")",
    args: [
      { name: "x, y", description: "Two numeric vectors, or one numeric data frame/matrix." },
      { name: "use", description: "`\"complete.obs\"` to skip rows with missing values." },
      { name: "method", description: "`\"pearson\"` (default), `\"spearman\"` or `\"kendall\"`." },
    ],
    example: `cor(mtcars$wt, mtcars$mpg)
cor(mtcars$hp, mtcars$qsec)
round(cor(mtcars[, c("mpg", "wt", "hp")]), 2)`,
    output: "[1] -0.8676594\n[1] -0.7082234\n      mpg    wt    hp\nmpg  1.00 -0.87 -0.78\nwt  -0.87  1.00  0.66\nhp  -0.78  0.66  1.00",
    mistakes: [
      "Concluding cause and effect – a correlation only shows that two things move together.",
      "Missing values give `NA`. Add `use = \"complete.obs\"` (there is no `na.rm` here).",
      "Including text columns in a data frame – `cor()` stops with \"'x' must be numeric\".",
    ],
    related: ["cor.test", "plot", "lm"],
  },
  {
    name: "table",
    package: "base",
    category: "Statistics",
    purpose: "Counts how many times each value occurs (a frequency table). With two variables it makes a cross-table of counts.",
    syntax: "table(..., useNA = \"no\")",
    args: [
      { name: "...", description: "One or two vectors (usually categorical) to count." },
      { name: "useNA", description: "`\"ifany\"` to also count missing values." },
    ],
    example: `pets <- c("dog", "cat", "dog", "fish", "dog", "cat")
table(pets)
table(mtcars$cyl)
table(mtcars$am, mtcars$gear)`,
    output: "pets\n cat  dog fish\n   2    3    1\n\n 4  6  8\n11  7 14\n\n     3  4  5\n  0 15  4  0\n  1  0  8  5",
    mistakes: [
      "Expecting `NA` to be counted – it is left out unless you add `useNA = \"ifany\"`.",
      "Counting a numeric variable with many different values (like income) – every distinct value gets its own count. Group it first with `cut()`.",
    ],
    related: ["prop.table", "factor", "count", "barplot"],
  },
  {
    name: "prop.table",
    package: "base",
    category: "Statistics",
    purpose: "Turns a table of counts into proportions (shares that add up to 1). Multiply by 100 for percentages.",
    syntax: "prop.table(x, margin = NULL)",
    args: [
      { name: "x", description: "A table of counts, usually from `table()`." },
      { name: "margin", description: "For a two-way table: `1` gives proportions within each row, `2` within each column." },
    ],
    example: `pets <- c("dog", "cat", "dog", "fish", "dog", "cat")
counts <- table(pets)
prop.table(counts)
round(prop.table(counts) * 100, 1)`,
    output: "pets\n      cat       dog      fish\n0.3333333 0.5000000 0.1666667\npets\n cat  dog fish\n33.3 50.0 16.7",
    mistakes: [
      "Passing raw data instead of a table: `prop.table(pets)` fails. Count first with `table()`.",
      "Forgetting `margin` in a two-way table, which gives shares of the grand total instead of within each row or column.",
    ],
    related: ["table", "round", "count"],
  },
  {
    name: "cut",
    package: "base",
    category: "Statistics",
    purpose:
      "Turns a numeric variable into categories (bins) such as age groups. The result is a factor. A label like `(18,40]` means \"more than 18, up to and including 40\".",
    syntax: "cut(x, breaks, labels = NULL, right = TRUE)",
    args: [
      { name: "x", description: "A numeric vector." },
      { name: "breaks", description: "The cut points, e.g. `c(0, 18, 40, 65, 100)`." },
      { name: "labels", description: "Optional names for the groups (one fewer than the number of breaks)." },
      { name: "right", description: "`TRUE` (default) includes the right end of each interval." },
    ],
    example: `ages <- c(15, 22, 37, 45, 68)
cut(ages, breaks = c(0, 18, 40, 65, 100))
cut(ages, breaks = c(0, 18, 40, 65, 100),
    labels = c("child", "young adult", "adult", "senior"))`,
    output: "[1] (0,18]   (18,40]  (18,40]  (40,65]  (65,100]\nLevels: (0,18] (18,40] (40,65] (65,100]\n[1] child       young adult young adult adult       senior\nLevels: child young adult adult senior",
    mistakes: [
      "Values outside the breaks become `NA` – make sure the first and last break cover all data.",
      "Giving as many labels as breaks – you need one label fewer (4 groups need 5 break points).",
    ],
    related: ["factor", "table", "ifelse", "case_when"],
  },
  {
    name: "scale",
    package: "base",
    category: "Statistics",
    purpose:
      "Standardises values into z-scores: how many standard deviations each value is above or below the mean. Useful for comparing variables measured on different scales.",
    syntax: "scale(x, center = TRUE, scale = TRUE)",
    args: [
      { name: "x", description: "A numeric vector or matrix." },
      { name: "center", description: "Subtract the mean (default `TRUE`)." },
      { name: "scale", description: "Divide by the standard deviation (default `TRUE`)." },
    ],
    example: `heights <- c(150, 160, 170, 180, 190)
z <- scale(heights)
as.vector(z)
round((heights - mean(heights)) / sd(heights), 4)`,
    output: "[1] -1.2649111 -0.6324555  0.0000000  0.6324555  1.2649111\n[1] -1.2649 -0.6325  0.0000  0.6325  1.2649",
    mistakes: [
      "Being confused by the printed result – `scale()` returns a one-column matrix with extra attributes. Wrap it in `as.vector()` for a plain vector.",
      "Scaling a data frame with text columns – `scale(iris)` stops with \"'x' must be numeric\". Select the numeric columns first.",
    ],
    related: ["sd", "mean"],
  },
  {
    name: "set.seed",
    package: "base",
    category: "Statistics",
    purpose:
      "Fixes the starting point of R's random number generator, so \"random\" results are the same every time you run the code. Always use it in examples and reports.",
    syntax: "set.seed(seed)",
    args: [{ name: "seed", description: "Any whole number, e.g. `42` or `123`." }],
    example: `set.seed(42)
sample(1:10, 3)
set.seed(42)
sample(1:10, 3)`,
    output: "[1]  1  5 10\n[1]  1  5 10",
    mistakes: [
      "Calling `set.seed()` once and expecting every later random call to repeat – each call continues the sequence. Set the seed again to restart it.",
      "Thinking the seed number matters statistically – it does not; it just makes results reproducible.",
    ],
    related: ["sample", "rnorm"],
  },
  {
    name: "sample",
    package: "base",
    category: "Statistics",
    purpose:
      "Draws a random sample from a vector – like picking names from a hat. With `replace = TRUE` the same value can be picked more than once (like rolling a die).",
    syntax: "sample(x, size, replace = FALSE, prob = NULL)",
    args: [
      { name: "x", description: "The values to draw from." },
      { name: "size", description: "How many values to draw (default: all of them, in random order)." },
      { name: "replace", description: "`TRUE` to allow repeats." },
      { name: "prob", description: "Optional probabilities for each value." },
    ],
    example: `set.seed(1)
sample(1:6, 1)
sample(c("heads", "tails"), 5, replace = TRUE)
sample(1:5)`,
    output: "[1] 1\n[1] \"tails\" \"heads\" \"heads\" \"tails\" \"heads\"\n[1] 3 2 4 1 5",
    mistakes: [
      "Asking for more values than exist without `replace = TRUE` – R stops with \"cannot take a sample larger than the population when 'replace = FALSE'\".",
      "Forgetting `set.seed()` and getting different results every run.",
    ],
    related: ["set.seed", "rnorm"],
  },
  {
    name: "rnorm",
    package: "stats",
    category: "Statistics",
    purpose: "Generates random numbers from a normal distribution (the bell curve) with the mean and standard deviation you choose. Great for simulations and practice data.",
    syntax: "rnorm(n, mean = 0, sd = 1)",
    args: [
      { name: "n", description: "How many numbers to generate." },
      { name: "mean", description: "The centre of the distribution." },
      { name: "sd", description: "The standard deviation (spread)." },
    ],
    example: `set.seed(123)
round(rnorm(5), 2)
heights <- rnorm(1000, mean = 170, sd = 10)
round(mean(heights))`,
    output: "[1] -0.56 -0.23  1.56  0.07  0.13\n[1] 170",
    mistakes: [
      "Writing `rnorm(5, 170, 10)` and forgetting which number is which – name the arguments (`mean =`, `sd =`) for clarity.",
      "Giving the variance instead of the standard deviation to `sd`.",
    ],
    related: ["set.seed", "sample", "hist", "shapiro.test"],
  },

  /* ---------------------------------------------------------------- */
  /* Statistical tests                                                */
  /* ---------------------------------------------------------------- */
  {
    name: "t.test",
    package: "stats",
    category: "Statistical tests",
    purpose:
      "Tests whether a mean differs from a value, or whether two group means differ. The output gives the t statistic, degrees of freedom (df), the p-value, a 95% confidence interval and the means.",
    syntax: "t.test(x, y = NULL, mu = 0, paired = FALSE, var.equal = FALSE)\nt.test(value ~ group, data)",
    args: [
      { name: "x, y", description: "One sample (compared with `mu`) or two samples to compare." },
      { name: "value ~ group, data", description: "Formula version: a numeric column split by a two-level group column." },
      { name: "mu", description: "The value to compare a single mean with." },
      { name: "paired", description: "`TRUE` when the two measurements belong to the same subjects (before/after)." },
    ],
    example: `t.test(mpg ~ am, data = mtcars)`,
    output: "\tWelch Two Sample t-test\n\ndata:  mpg by am\nt = -3.7671, df = 18.332, p-value = 0.001374\nalternative hypothesis: true difference in means between group 0 and group 1 is not equal to 0\n95 percent confidence interval:\n -11.280194  -3.209684\nsample estimates:\nmean in group 0 mean in group 1\n       17.14737        24.39231",
    mistakes: [
      "Reading a large p-value as proof that the means are equal – it only means the data do not show a clear difference.",
      "Using a grouping variable with more than two groups – `t.test()` stops with \"grouping factor must have exactly 2 levels\". Use `aov()` for three or more groups.",
      "Forgetting `paired = TRUE` for before/after measurements on the same people.",
    ],
    related: ["aov", "shapiro.test", "chisq.test", "mean"],
  },
  {
    name: "chisq.test",
    package: "stats",
    category: "Statistical tests",
    purpose:
      "Tests whether two categorical variables are related (for example region and whether people would recommend an app), using a table of counts.",
    syntax: "chisq.test(x, y = NULL, correct = TRUE)",
    args: [
      { name: "x", description: "A two-way table of counts (from `table()`), or a categorical vector." },
      { name: "y", description: "A second categorical vector if `x` is a vector." },
      { name: "correct", description: "Apply a continuity correction for 2×2 tables (default `TRUE`)." },
    ],
    example: `survey <- read.csv("data/survey.csv")
counts <- table(survey$region, survey$recommend)
counts
chisq.test(counts)`,
    output: "        No Yes\n  East  16  31\n  North 12  35\n  South 19  34\n  West  12  41\n\n\tPearson's Chi-squared test\n\ndata:  counts\nX-squared = 3.0482, df = 3, p-value = 0.3843",
    mistakes: [
      "Passing percentages or means – the test needs raw *counts*.",
      "Ignoring the warning \"Chi-squared approximation may be incorrect\" – it means some expected counts are below 5, so the p-value is unreliable.",
    ],
    related: ["table", "prop.table", "t.test"],
  },
  {
    name: "cor.test",
    package: "stats",
    category: "Statistical tests",
    purpose: "Tests whether a correlation between two numeric variables is different from zero, and gives a confidence interval for it.",
    syntax: "cor.test(x, y, method = \"pearson\")",
    args: [
      { name: "x, y", description: "Two numeric vectors of the same length." },
      { name: "method", description: "`\"pearson\"` (default), `\"spearman\"` or `\"kendall\"`." },
    ],
    example: `cor.test(mtcars$wt, mtcars$mpg)`,
    output: "\tPearson's product-moment correlation\n\ndata:  mtcars$wt and mtcars$mpg\nt = -9.559, df = 30, p-value = 1.294e-10\nalternative hypothesis: true correlation is not equal to 0\n95 percent confidence interval:\n -0.9338264 -0.7440872\nsample estimates:\n       cor\n-0.8676594",
    mistakes: [
      "Treating a significant correlation as a strong one – with lots of data even a weak correlation can have a tiny p-value. Look at the size of `cor` as well.",
      "Using it for categories – both variables must be numeric. For two categorical variables use `chisq.test()`.",
    ],
    related: ["cor", "lm", "plot"],
  },
  {
    name: "shapiro.test",
    package: "stats",
    category: "Statistical tests",
    purpose:
      "Tests whether data look like they come from a normal distribution. A small p-value (below 0.05) suggests the data are *not* normal.",
    syntax: "shapiro.test(x)",
    args: [{ name: "x", description: "A numeric vector with 3 to 5000 values." }],
    example: `shapiro.test(mtcars$mpg)`,
    output: "\tShapiro-Wilk normality test\n\ndata:  mtcars$mpg\nW = 0.94756, p-value = 0.1229",
    mistakes: [
      "Relying on it alone – with large samples tiny deviations become \"significant\". Look at a histogram too.",
      "Reading a large p-value as proof of normality; it only means no clear departure was found.",
    ],
    related: ["hist", "t.test", "rnorm"],
  },
  {
    name: "aov",
    package: "stats",
    category: "Statistical tests",
    purpose:
      "Fits an analysis of variance (ANOVA), which tests whether the means of three or more groups differ. Use `summary()` on the result to see the F statistic and p-value.",
    syntax: "aov(formula, data)",
    args: [
      { name: "formula", description: "`value ~ group`, where `group` is categorical." },
      { name: "data", description: "The data frame." },
    ],
    example: `model <- aov(weight ~ group, data = PlantGrowth)
summary(model)`,
    output: "            Df Sum Sq Mean Sq F value Pr(>F)\ngroup        2  3.766  1.8832   4.846 0.0159 *\nResiduals   27 10.492  0.3886\n---\nSignif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1",
    mistakes: [
      "Looking at `model` instead of `summary(model)` – the p-value is only shown in the summary.",
      "Using a numeric group code (1, 2, 3) – R then treats it as a number. Convert it with `factor()` first.",
      "Stopping at a significant result: ANOVA says *some* means differ, not which ones. Follow up with `TukeyHSD()`.",
    ],
    related: ["TukeyHSD", "t.test", "lm", "boxplot"],
  },
  {
    name: "TukeyHSD",
    package: "stats",
    category: "Statistical tests",
    purpose:
      "After a significant ANOVA, compares every pair of groups and tells you which pairs differ, with adjusted p-values (`p adj`) and confidence intervals.",
    syntax: "TukeyHSD(x, conf.level = 0.95)",
    args: [
      { name: "x", description: "A model fitted with `aov()`." },
      { name: "conf.level", description: "Confidence level for the intervals." },
    ],
    example: `model <- aov(weight ~ group, data = PlantGrowth)
TukeyHSD(model)`,
    output: "  Tukey multiple comparisons of means\n    95% family-wise confidence level\n\nFit: aov(formula = weight ~ group, data = PlantGrowth)\n\n$group\n            diff        lwr       upr     p adj\ntrt1-ctrl -0.371 -1.0622161 0.3202161 0.3908711\ntrt2-ctrl  0.494 -0.1972161 1.1852161 0.1979960\ntrt2-trt1  0.865  0.1737839 1.5562161 0.0120064",
    mistakes: [
      "Passing an `lm()` model – `TukeyHSD()` needs the result of `aov()`.",
      "Misreading `diff`: it is the difference in group means for each pair, e.g. `trt2-ctrl` is mean(trt2) − mean(ctrl), not a ratio.",
    ],
    related: ["aov", "t.test"],
  },
  {
    name: "lm",
    package: "stats",
    category: "Statistical tests",
    purpose:
      "Fits a linear regression: the best straight line that predicts one numeric variable from one or more others. Printing the model shows the coefficients; `summary()` shows p-values and R².",
    syntax: "lm(formula, data)",
    args: [
      { name: "formula", description: "`outcome ~ predictor` (or `outcome ~ x1 + x2`). Read `~` as \"explained by\"." },
      { name: "data", description: "The data frame containing the columns." },
    ],
    example: `model <- lm(mpg ~ wt, data = mtcars)
model
round(summary(model)$r.squared, 3)`,
    output: "Call:\nlm(formula = mpg ~ wt, data = mtcars)\n\nCoefficients:\n(Intercept)           wt\n     37.285       -5.344\n\n[1] 0.753",
    mistakes: [
      "Swapping the variables: the outcome (what you predict) goes on the *left* of `~`.",
      "Writing `lm(mtcars$mpg ~ mtcars$wt)` – it works, but `predict()` with new data then fails. Use column names with `data =`.",
      "Reading the coefficients without context: `-5.344` for `wt` means mpg drops by about 5.3 for each extra 1000 lbs.",
    ],
    related: ["coef", "predict", "summary", "abline", "cor"],
  },
  {
    name: "coef",
    package: "stats",
    category: "Statistical tests",
    purpose: "Extracts the coefficients (intercept and slopes) from a fitted model as a named vector, so you can use them in calculations.",
    syntax: "coef(object)",
    args: [{ name: "object", description: "A fitted model, e.g. from `lm()`." }],
    example: `model <- lm(mpg ~ wt, data = mtcars)
coef(model)
coef(model)["wt"]`,
    output: "(Intercept)          wt\n  37.285126   -5.344472\n       wt\n-5.344472",
    mistakes: [
      "Forgetting the names: use `coef(model)[\"wt\"]` rather than a position number, which breaks if you add predictors.",
      "Expecting p-values – `coef()` gives only the estimates. Use `summary(model)$coefficients` for standard errors and p-values.",
    ],
    related: ["lm", "predict"],
  },
  {
    name: "predict",
    package: "stats",
    category: "Statistical tests",
    purpose: "Uses a fitted model to predict outcomes for new data.",
    syntax: "predict(object, newdata)",
    args: [
      { name: "object", description: "A fitted model, e.g. from `lm()`." },
      { name: "newdata", description: "A data frame with the same predictor column names as the model." },
    ],
    example: `model <- lm(mpg ~ wt, data = mtcars)
new_cars <- data.frame(wt = c(2.5, 3.5))
predict(model, newdata = new_cars)`,
    output: "       1        2\n23.92395 18.57948",
    mistakes: [
      "Giving `newdata` as a plain vector or with a different column name – it must be a data frame with exactly the predictor names (`wt` here).",
      "Predicting far outside the range of the data (e.g. a car weighing 10 000 lbs) – the straight line may not hold there.",
    ],
    related: ["lm", "coef"],
  },

  /* ---------------------------------------------------------------- */
  /* Base plots                                                       */
  /* ---------------------------------------------------------------- */
  {
    name: "plot",
    package: "graphics",
    category: "Base plots",
    purpose: "Draws a scatter plot of two numeric variables (and many other plots, depending on what you give it). The quickest way to see a relationship.",
    syntax: "plot(x, y, main, xlab, ylab, col, pch, type)",
    args: [
      { name: "x, y", description: "The values for the horizontal and vertical axis." },
      { name: "main, xlab, ylab", description: "Title and axis labels." },
      { name: "col, pch", description: "Point colour and point symbol (`pch = 19` is a filled circle)." },
      { name: "type", description: "`\"p\"` points, `\"l\"` lines, `\"b\"` both." },
    ],
    example: `plot(mtcars$wt, mtcars$mpg,
     main = "Heavier cars use more fuel",
     xlab = "Weight (1000 lbs)", ylab = "Miles per gallon",
     pch = 19, col = "steelblue")`,
    output: "",
    plot: true,
    mistakes: [
      "Giving `x` and `y` of different lengths – R stops with \"'x' and 'y' lengths differ\".",
      "Leaving default axis labels like `mtcars$wt`; always add readable `xlab` and `ylab`.",
    ],
    related: ["hist", "abline", "lines", "geom_point"],
  },
  {
    name: "hist",
    package: "graphics",
    category: "Base plots",
    purpose: "Draws a histogram: the range of a numeric variable is cut into bins and each bar shows how many values fall in that bin. It shows the shape of a distribution.",
    syntax: "hist(x, breaks, main, xlab, col)",
    args: [
      { name: "x", description: "A numeric vector." },
      { name: "breaks", description: "Roughly how many bins to use (or the exact break points)." },
      { name: "main, xlab", description: "Title and x-axis label." },
      { name: "col", description: "Fill colour of the bars." },
    ],
    example: `hist(mtcars$mpg, breaks = 8,
     main = "Fuel efficiency", xlab = "Miles per gallon",
     col = "lightblue")`,
    output: "",
    plot: true,
    mistakes: [
      "Using `hist()` for categories – histograms are for numbers. For counts of categories use `barplot(table(x))`.",
      "Judging the shape from one bin setting: too few or too many bins can hide the pattern. Try different `breaks`.",
    ],
    related: ["barplot", "boxplot", "geom_histogram", "quantile"],
  },
  {
    name: "barplot",
    package: "graphics",
    category: "Base plots",
    purpose: "Draws a bar chart, one bar per category. It expects the bar heights, so you usually give it a table of counts.",
    syntax: "barplot(height, names.arg, main, xlab, ylab, col)",
    args: [
      { name: "height", description: "Bar heights – often `table(x)`." },
      { name: "names.arg", description: "Labels under the bars (taken from the table names if omitted)." },
      { name: "main, xlab, ylab", description: "Title and axis labels." },
      { name: "col", description: "Bar colour(s)." },
    ],
    example: `counts <- table(mtcars$cyl)
barplot(counts,
        main = "Cars by number of cylinders",
        xlab = "Cylinders", ylab = "Number of cars",
        col = "orange")`,
    output: "",
    plot: true,
    mistakes: [
      "Passing raw categories: `barplot(mtcars$cyl)` draws one bar per *car*. Count first with `table()`.",
      "Expecting a particular bar order – bars follow the order of the table (alphabetical, or the factor levels). Reorder with `factor(..., levels = ...)` or `sort()`.",
    ],
    related: ["table", "hist", "geom_bar", "geom_col"],
  },
  {
    name: "boxplot",
    package: "graphics",
    category: "Base plots",
    purpose:
      "Draws a box plot: the box spans the middle 50% of the data (from the 1st to the 3rd quartile), the thick line is the median, whiskers show the typical range and dots mark outliers. With a formula it compares groups.",
    syntax: "boxplot(x)\nboxplot(value ~ group, data, main, xlab, ylab)",
    args: [
      { name: "x", description: "A numeric vector (one box)." },
      { name: "value ~ group, data", description: "One box per group." },
      { name: "main, xlab, ylab", description: "Title and axis labels." },
    ],
    example: `boxplot(mpg ~ cyl, data = mtcars,
        main = "Fuel efficiency by cylinders",
        xlab = "Cylinders", ylab = "Miles per gallon")`,
    output: "",
    plot: true,
    mistakes: [
      "Reading the thick line as the mean – it is the median.",
      "Swapping the formula: `cyl ~ mpg` would treat each mpg value as a group. The numeric value goes on the left.",
    ],
    related: ["hist", "quantile", "IQR", "geom_boxplot"],
  },
  {
    name: "abline",
    package: "graphics",
    category: "Base plots",
    purpose: "Adds a straight line to an existing plot: a regression line, or a horizontal (`h =`) or vertical (`v =`) reference line.",
    syntax: "abline(a, b, h, v, reg, col, lwd, lty)",
    args: [
      { name: "reg", description: "A fitted `lm()` model – draws its regression line." },
      { name: "h, v", description: "Positions of horizontal or vertical lines." },
      { name: "a, b", description: "Intercept and slope of a line." },
      { name: "col, lwd, lty", description: "Colour, line width and line type (`2` = dashed)." },
    ],
    example: `plot(mtcars$wt, mtcars$mpg, pch = 19)
model <- lm(mpg ~ wt, data = mtcars)
abline(model, col = "red", lwd = 2)
abline(h = mean(mtcars$mpg), lty = 2)`,
    output: "",
    plot: true,
    mistakes: [
      "Calling `abline()` before `plot()` – there is no plot to draw on yet (\"plot.new has not been called yet\").",
      "Fitting the model with the variables swapped (`lm(wt ~ mpg)`), so the line does not match the plot's axes.",
    ],
    related: ["plot", "lm", "lines"],
  },
  {
    name: "lines",
    package: "graphics",
    category: "Base plots",
    purpose: "Adds connected lines to an existing plot – for example a second series or a trend over time.",
    syntax: "lines(x, y, col, lwd, lty)",
    args: [
      { name: "x, y", description: "The points to connect, in order." },
      { name: "col, lwd, lty", description: "Colour, width and type of the line." },
    ],
    example: `month <- 1:6
sales <- c(120, 135, 128, 150, 162, 170)
target <- c(125, 130, 135, 140, 145, 150)
plot(month, sales, type = "b", pch = 19, main = "Sales vs target")
lines(month, target, col = "red", lty = 2)`,
    output: "",
    plot: true,
    mistakes: [
      "Adding a series outside the plot's y-range – it is cut off. Set `ylim = c(min, max)` in the first `plot()` call.",
      "Calling `lines()` with unsorted x values, which zig-zags back and forth. Sort the data first.",
    ],
    related: ["plot", "abline", "geom_line"],
  },

  /* ---------------------------------------------------------------- */
  /* Packages & help                                                  */
  /* ---------------------------------------------------------------- */
  {
    name: "library",
    package: "base",
    category: "Packages & help",
    purpose:
      "Loads an installed package so you can use its functions. Packages are installed once (on your own computer with `install.packages(\"dplyr\")`; on R Academy this happens automatically), but loaded with `library()` in every new session.",
    syntax: "library(package)",
    args: [{ name: "package", description: "The package name, with or without quotes." }],
    example: `library(dplyr)
cars <- data.frame(model = c("A", "B", "C"), mpg = c(21, 33, 30))
filter(cars, mpg > 25)`,
    output: "  model mpg\n1     B  33\n2     C  30",
    mistakes: [
      "Calling a package function before `library()` – R stops with \"could not find function\".",
      "Confusing installing and loading: `install.packages()` downloads a package once; `library()` switches it on each session.",
      "Misspelling the name (`library(dplr)`) – R stops with \"there is no package called ‘dplr’\".",
    ],
    related: ["require", "filter", "args"],
  },
  {
    name: "require",
    package: "base",
    category: "Packages & help",
    purpose:
      "Loads a package like `library()`, but returns `TRUE`/`FALSE` instead of stopping when the package is missing. Mostly used inside functions; in scripts prefer `library()`.",
    syntax: "require(package)",
    args: [{ name: "package", description: "The package name." }],
    example: `loaded <- require(tools)
loaded
toTitleCase("the art of data science")`,
    output: "[1] TRUE\n[1] \"The Art of Data Science\"",
    mistakes: [
      "Using `require()` at the top of a script – if the package is missing you only get a warning and the error appears later, far from the cause. `library()` fails immediately and clearly.",
      "Expecting it to print `TRUE` – `require()` returns its answer invisibly. Assign it or use it directly in `if (!require(pkg)) ...`.",
    ],
    related: ["library"],
  },
  {
    name: "args",
    package: "base",
    category: "Packages & help",
    purpose:
      "Shows the arguments of a function and their default values – a quick reminder of how to call it. (For the full help page use `?round` or `help(round)` in RStudio.)",
    syntax: "args(name)",
    args: [{ name: "name", description: "A function, without parentheses." }],
    example: `args(round)
args(paste)`,
    output: "function (x, digits = 0, ...)\nNULL\nfunction (..., sep = \" \", collapse = NULL, recycle0 = FALSE)\nNULL",
    mistakes: [
      "Writing `args(round())` – pass the function itself, without parentheses.",
      "Ignoring the defaults it shows: `digits = 0` explains why `round(3.7)` gives 4.",
    ],
    related: ["library", "round", "paste"],
  },
];
