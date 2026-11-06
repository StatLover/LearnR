import type { RFunction } from "../types";

/**
 * Function reference – "Basics & output", "Vectors" and "Math & rounding".
 * Every `output` is the real console output of `example` (checked by
 * `npm run verify:content -- --functions`).
 */
export const basicsFunctions: RFunction[] = [
  /* ---------------------------------------------------------------- */
  /* Basics & output                                                  */
  /* ---------------------------------------------------------------- */
  {
    name: "print",
    package: "base",
    category: "Basics & output",
    purpose:
      "Shows the value of an object in the console. At the top level R prints results automatically, but inside a loop or a function nothing is shown unless you call `print()` yourself.",
    syntax: "print(x, digits = NULL, ...)",
    args: [
      { name: "x", description: "The object to show: a number, text, vector, data frame, model, …" },
      { name: "digits", description: "Optional. How many significant digits to show for numbers (changes the display only, not the stored value)." },
    ],
    example: `scores <- c(80, 90, 100)
print(scores)
print(pi, digits = 3)
for (i in 1:2) {
  print(i * 10)
}`,
    output: "[1]  80  90 100\n[1] 3.14\n[1] 10\n[1] 20",
    mistakes: [
      "Expecting results to appear from inside a `for` loop or a function without `print()` – only top-level code is printed automatically.",
      "Trying to join text and numbers with `print(\"Total:\", 5)`. The second value is taken as the `digits` option, so only `\"Total:\"` is shown. Use `print(paste(\"Total:\", 5))` or `cat(\"Total:\", 5)`.",
      "Thinking `print(x, digits = 2)` rounds `x`. It only changes how the value is displayed; use `round()` to change the value itself.",
    ],
    related: ["cat", "message", "format", "sprintf"],
  },
  {
    name: "cat",
    package: "base",
    category: "Basics & output",
    purpose:
      "Writes text and values to the console without quotes and without the `[1]` index – ideal for friendly messages. It does not start a new line by itself, so you add `\"\\n\"` (newline) at the end.",
    syntax: "cat(..., sep = \" \")",
    args: [
      { name: "...", description: "The pieces to print: text, numbers or vectors. They are printed one after another." },
      { name: "sep", description: "What to put between the pieces. The default is a single space; use `sep = \"\"` for nothing." },
    ],
    example: String.raw`name <- "Ada"
score <- 95
cat("Student:", name, "\n")
cat("Score:", score, "out of 100\n")
cat("a", "b", "c", sep = "-")`,
    output: "Student: Ada\nScore: 95 out of 100\na-b-c",
    mistakes: [
      "Forgetting `\"\\n\"` at the end, so the next output is glued onto the same line.",
      "Using `cat()` on a data frame or list – it stops with \"argument 1 (type 'list') cannot be handled by 'cat'\". Use `print()` or `str()` for those.",
      "Storing the result: `x <- cat(\"hi\")` prints `hi` but `x` is `NULL`. To build text you can keep, use `paste()`.",
    ],
    related: ["print", "paste", "message", "sprintf"],
  },
  {
    name: "message",
    package: "base",
    category: "Basics & output",
    purpose:
      "Prints a short note for the person running the code, such as a progress update. Messages are used inside scripts and functions to say what is happening; they are not part of the result.",
    syntax: "message(..., appendLF = TRUE)",
    args: [
      { name: "...", description: "Pieces of text or values. They are pasted together with no space in between." },
      { name: "appendLF", description: "Add a newline at the end (default `TRUE`)." },
    ],
    example: `message("Loading data...")
students <- read.csv("data/students.csv")
message("Loaded ", nrow(students), " students")`,
    output: "Loading data...\nLoaded 60 students",
    mistakes: [
      "Expecting spaces between the pieces: `message(\"Total:\", 5)` prints `Total:5`. Put the space inside the text: `message(\"Total: \", 5)`.",
      "Using `message()` for a value you want to keep or calculate with – it returns nothing useful. Return the value and use `message()` only for notes.",
      "Using `message()` when something is really wrong. To stop the code, use `stop()` instead.",
    ],
    related: ["cat", "print", "stop"],
  },
  {
    name: "sprintf",
    package: "base",
    category: "Basics & output",
    purpose:
      "Builds text from a template with placeholders: `%s` for text, `%d` for whole numbers and `%.2f` for a number with 2 decimals. Perfect for neat, consistently formatted output.",
    syntax: "sprintf(fmt, ...)",
    args: [
      { name: "fmt", description: "The template text containing placeholders such as `%s`, `%d`, `%.1f`. Write `%%` for a literal percent sign." },
      { name: "...", description: "The values that fill the placeholders, in the same order." },
    ],
    example: `name <- "Ben"
average <- 87.456
sprintf("%s scored %.1f on average", name, average)
sprintf("Item %d of %d", 3, 10)
sprintf("%.2f%%", 45.678)`,
    output: "[1] \"Ben scored 87.5 on average\"\n[1] \"Item 3 of 10\"\n[1] \"45.68%\"",
    mistakes: [
      "Using `%d` for a number with decimals: `sprintf(\"%d\", 3.5)` stops with \"invalid format '%d'; use format %f, %e, %g or %a for numeric objects\". Use `%.1f` or `%f`.",
      "Writing a single `%` for a percent sign. Inside the template you need `%%`.",
      "Giving fewer values than placeholders – R stops with \"too few arguments\".",
    ],
    related: ["paste", "format", "round", "cat"],
  },
  {
    name: "format",
    package: "base",
    category: "Basics & output",
    purpose:
      "Turns numbers and dates into nicely formatted text: a fixed number of decimals, thousands separators, equal widths, or a date written your way.",
    syntax: "format(x, nsmall = 0, big.mark = \"\", width = 0, ...)",
    args: [
      { name: "x", description: "The number(s) or date(s) to format." },
      { name: "nsmall", description: "The minimum number of digits after the decimal point." },
      { name: "big.mark", description: "A thousands separator, e.g. `\",\"`." },
      { name: "format (for dates)", description: "A pattern such as `\"%d %B %Y\"` (day, month name, year)." },
    ],
    example: `format(1234567.891, big.mark = ",")
format(3.5, nsmall = 2)
format(c(1, 10, 100))
format(as.Date("2024-03-15"), "%d %B %Y")`,
    output: "[1] \"1,234,568\"\n[1] \"3.50\"\n[1] \"  1\" \" 10\" \"100\"\n[1] \"15 March 2024\"",
    mistakes: [
      "Calculating with the result: `format()` returns text, so `format(3.5, nsmall = 2) + 1` fails with \"non-numeric argument to binary operator\". Format only at the very end, for display.",
      "Expecting `nsmall` to round. It sets a *minimum* number of decimals; to fix exactly 2 decimals use `sprintf(\"%.2f\", x)` or `round()` first.",
      "Not noticing that big numbers are shown with 7 significant digits by default, so `1234567.891` appears as `1,234,568`.",
    ],
    related: ["sprintf", "round", "paste", "as.Date"],
  },
  {
    name: "class",
    package: "base",
    category: "Basics & output",
    purpose:
      "Tells you what kind of object something is – `\"numeric\"`, `\"character\"`, `\"logical\"`, `\"data.frame\"`, `\"factor\"`, … It is the first thing to check when a function complains about its input.",
    syntax: "class(x)",
    args: [{ name: "x", description: "Any R object." }],
    example: `class(42)
class("hello")
class(TRUE)
class(c(1L, 2L))
class(mtcars)
class(factor(c("a", "b")))`,
    output: "[1] \"numeric\"\n[1] \"character\"\n[1] \"logical\"\n[1] \"integer\"\n[1] \"data.frame\"\n[1] \"factor\"",
    mistakes: [
      "Mixing up `class()` and `typeof()`: a data frame has class `\"data.frame\"` but type `\"list\"`.",
      "Not checking the class of columns after importing: a column of numbers with one stray symbol (like `\"$12\"`) has class `\"character\"`, and maths on it fails.",
      "Testing with `class(x) == \"data.frame\"` – some objects have several classes (a tibble has three). Use `is.data.frame(x)` or `inherits(x, \"data.frame\")`.",
    ],
    related: ["typeof", "str", "is.numeric", "as.numeric"],
  },
  {
    name: "typeof",
    package: "base",
    category: "Basics & output",
    purpose:
      "Shows how R stores a value internally: `\"double\"` (decimal number), `\"integer\"`, `\"character\"`, `\"logical\"`, `\"list\"`, … More technical than `class()`.",
    syntax: "typeof(x)",
    args: [{ name: "x", description: "Any R object." }],
    example: `typeof(42)
typeof(42L)
typeof("42")
typeof(TRUE)
typeof(mtcars)
typeof(mean)`,
    output: "[1] \"double\"\n[1] \"integer\"\n[1] \"character\"\n[1] \"logical\"\n[1] \"list\"\n[1] \"closure\"",
    mistakes: [
      "Expecting `typeof(5)` to be `\"integer\"`. Plain numbers are stored as `\"double\"`; add an `L` (`5L`) to make an integer.",
      "Using `typeof()` to recognise data frames – it says `\"list\"`. Use `class()` or `is.data.frame()`.",
    ],
    related: ["class", "is.numeric", "as.integer", "str"],
  },
  {
    name: "is.numeric",
    package: "base",
    category: "Basics & output",
    purpose:
      "Asks \"is this a number?\" and answers `TRUE` or `FALSE`. It is `TRUE` for both whole numbers and decimals. Similar checks exist for other types: `is.character()`, `is.logical()`, `is.data.frame()`.",
    syntax: "is.numeric(x)",
    args: [{ name: "x", description: "The object to test." }],
    example: `is.numeric(3.14)
is.numeric(10L)
is.numeric("3.14")
ages <- c("25", "31", "47")
is.numeric(ages)
is.numeric(as.numeric(ages))`,
    output: "[1] TRUE\n[1] TRUE\n[1] FALSE\n[1] FALSE\n[1] TRUE",
    mistakes: [
      "Assuming text that looks like a number is numeric – `\"3.14\"` in quotes is text. Convert it with `as.numeric()`.",
      "Expecting a factor of numbers to be numeric: `is.numeric(factor(c(1, 2)))` is `FALSE`.",
      "Using `is.numeric()` to look for missing values. `NA` inside a numeric vector is still numeric – use `is.na()`.",
    ],
    related: ["class", "as.numeric", "is.na", "typeof"],
  },
  {
    name: "as.numeric",
    package: "base",
    category: "Basics & output",
    purpose:
      "Converts values to numbers – for example text read from a file. Values that cannot be read as numbers become `NA`, and R warns you with \"NAs introduced by coercion\".",
    syntax: "as.numeric(x)",
    args: [{ name: "x", description: "Text, logical values, factors or numbers to convert." }],
    example: `prices <- c("10.5", "20", "abc")
as.numeric(prices)
as.numeric(TRUE)
sum(as.numeric(c("1", "2", "3")))`,
    output: "[1] 10.5 20.0   NA\nWarning message:\nNAs introduced by coercion\n[1] 1\n[1] 6",
    mistakes: [
      "Converting a factor directly: `as.numeric(factor(c(\"10\", \"20\", \"5\")))` gives the level codes `1 2 3`, not the numbers. Use `as.numeric(as.character(f))`.",
      "Ignoring the \"NAs introduced by coercion\" warning. It means some values were not numbers (for example `\"$1,200\"` or `\"N/A\"`). Clean them first, e.g. with `gsub()`.",
      "Forgetting to save the result: `as.numeric(df$age)` alone changes nothing – write `df$age <- as.numeric(df$age)`.",
    ],
    related: ["as.integer", "as.character", "is.numeric", "gsub"],
  },
  {
    name: "as.character",
    package: "base",
    category: "Basics & output",
    purpose: "Converts values to text (character strings). Handy for building labels, IDs and file names, or for turning a factor back into plain text.",
    syntax: "as.character(x)",
    args: [{ name: "x", description: "Numbers, logical values, factors or dates to convert." }],
    example: `as.character(42)
as.character(c(1.5, 2, 3))
ids <- c(101, 102)
paste0("ID-", as.character(ids))
sizes <- factor(c("small", "large", "small"))
as.character(sizes)`,
    output: "[1] \"42\"\n[1] \"1.5\" \"2\"   \"3\"\n[1] \"ID-101\" \"ID-102\"\n[1] \"small\" \"large\" \"small\"",
    mistakes: [
      "Doing maths after converting: `as.character(5) + 1` fails with \"non-numeric argument to binary operator\".",
      "Sorting numbers stored as text: `sort(c(\"10\", \"9\", \"100\"))` sorts alphabetically (`\"10\" \"100\" \"9\"`). Keep numbers numeric.",
    ],
    related: ["as.numeric", "paste", "factor", "class"],
  },
  {
    name: "as.integer",
    package: "base",
    category: "Basics & output",
    purpose:
      "Converts values to whole numbers (integers). Any decimal part is simply cut off (truncated towards zero) – it does **not** round.",
    syntax: "as.integer(x)",
    args: [{ name: "x", description: "Numbers, text or logical values to convert." }],
    example: `as.integer(3.9)
as.integer(-3.9)
as.integer("42")
as.integer(TRUE)
as.integer(round(3.9))`,
    output: "[1] 3\n[1] -3\n[1] 42\n[1] 1\n[1] 4",
    mistakes: [
      "Expecting rounding: `as.integer(3.9)` is `3`. Use `round()` first if you want `4`.",
      "Converting text that contains letters – it becomes `NA` with the warning \"NAs introduced by coercion\".",
    ],
    related: ["as.numeric", "round", "floor", "typeof"],
  },
  {
    name: "as.logical",
    package: "base",
    category: "Basics & output",
    purpose:
      "Converts values to `TRUE`/`FALSE`. Text such as `\"TRUE\"`, `\"true\"`, `\"T\"` and `\"false\"` is understood; for numbers, `0` becomes `FALSE` and every other number `TRUE`.",
    syntax: "as.logical(x)",
    args: [{ name: "x", description: "Text or numbers to convert." }],
    example: `as.logical(c("TRUE", "false", "T", "yes"))
as.logical(c(0, 1, 5))
answers <- c("Yes", "No", "Yes")
answers == "Yes"`,
    output: "[1]  TRUE FALSE  TRUE    NA\n[1] FALSE  TRUE  TRUE\n[1]  TRUE FALSE  TRUE",
    mistakes: [
      "Expecting `\"Yes\"`/`\"No\"` to convert – they become `NA`. Compare instead: `answers == \"Yes\"`.",
      "Forgetting that any non-zero number is `TRUE`, including negative numbers such as `-1`.",
    ],
    related: ["ifelse", "is.na", "as.numeric", "any"],
  },
  {
    name: "ls",
    package: "base",
    category: "Basics & output",
    purpose: "Lists the names of the variables that exist in your workspace (the current environment), so you can see what you have created.",
    syntax: "ls()",
    args: [{ name: "(none needed)", description: "Call it with empty parentheses to list your own variables." }],
    example: `x <- 10
name <- "Ada"
scores <- c(1, 2, 3)
ls()`,
    output: "[1] \"name\"   \"scores\" \"x\"",
    mistakes: [
      "Typing `ls` without parentheses – that shows the code of the function instead of running it.",
      "Expecting `ls()` to list the columns of a data frame. Use `names(df)` for that.",
    ],
    related: ["rm", "names", "str"],
  },
  {
    name: "rm",
    package: "base",
    category: "Basics & output",
    purpose: "Removes (deletes) variables from your workspace. `rm(list = ls())` removes all of them, giving you a clean start.",
    syntax: "rm(..., list = character())",
    args: [
      { name: "...", description: "The variable names to remove, without quotes, e.g. `rm(x, y)`." },
      { name: "list", description: "A character vector of names to remove, e.g. `list = ls()` for everything." },
    ],
    example: `x <- 10
y <- 20
rm(x)
ls()
rm(list = ls())
ls()`,
    output: "[1] \"y\"\ncharacter(0)",
    mistakes: [
      "Expecting an undo. After `rm()` the value is gone; re-run the code that created it.",
      "Trying to delete a column with `rm(df$col)`. `rm()` removes whole variables only – to drop a column use `df$col <- NULL` or `select(df, -col)`.",
    ],
    related: ["ls", "select"],
  },

  /* ---------------------------------------------------------------- */
  /* Vectors                                                          */
  /* ---------------------------------------------------------------- */
  {
    name: "c",
    package: "base",
    category: "Vectors",
    purpose:
      "Combines values into a vector (an ordered row of values of the same type). The \"c\" stands for *combine*. It is probably the function you will use most.",
    syntax: "c(...)",
    args: [{ name: "...", description: "The values or vectors to combine, separated by commas." }],
    example: `scores <- c(80, 90, 100)
scores
more <- c(scores, 75)
more
c(1, "two", TRUE)`,
    output: "[1]  80  90 100\n[1]  80  90 100  75\n[1] \"1\"    \"two\"  \"TRUE\"",
    mistakes: [
      "Leaving out the `c`: `scores <- (80, 90, 100)` is a syntax error (\"unexpected ','\").",
      "Mixing types without noticing. A vector holds one type, so `c(1, \"two\", TRUE)` turns everything into text.",
      "Naming your own variable `c` (`c <- 5`). It works, but it makes code confusing to read – pick a descriptive name.",
    ],
    related: ["seq", "rep", "length", "list"],
  },
  {
    name: "seq",
    package: "base",
    category: "Vectors",
    purpose:
      "Creates a regular sequence of numbers – counting in steps (`by`) or splitting a range into a given number of points (`length.out`). `1:10` is a shortcut for steps of 1.",
    syntax: "seq(from, to, by, length.out)",
    args: [
      { name: "from, to", description: "The first and last value of the sequence." },
      { name: "by", description: "The step between values (can be a decimal)." },
      { name: "length.out", description: "Instead of `by`: how many values you want." },
    ],
    example: `seq(1, 10, by = 2)
seq(0, 1, by = 0.25)
seq(10, 100, length.out = 4)
seq(5, 1)`,
    output: "[1] 1 3 5 7 9\n[1] 0.00 0.25 0.50 0.75 1.00\n[1]  10  40  70 100\n[1] 5 4 3 2 1",
    mistakes: [
      "Using a step with the wrong sign: `seq(10, 1, by = 1)` stops with \"wrong sign in 'by' argument\". Use `by = -1`.",
      "Expecting `to` to always be included: `seq(1, 10, by = 4)` gives `1 5 9` because the next step (13) would pass 10.",
      "Using `seq(1, length(x))` or `1:length(x)` in loops – for an empty vector this counts `1 0`. Use `seq_along(x)`.",
    ],
    related: ["seq_len", "seq_along", "rep", "c"],
  },
  {
    name: "seq_len",
    package: "base",
    category: "Vectors",
    purpose: "Creates the sequence 1, 2, …, n. Unlike `1:n`, it correctly gives an empty sequence when n is 0, which makes it the safe choice for loops.",
    syntax: "seq_len(length.out)",
    args: [{ name: "length.out", description: "A single whole number n: how long the sequence should be." }],
    example: String.raw`seq_len(5)
seq_len(0)
n <- 3
for (i in seq_len(n)) {
  cat("Round", i, "\n")
}`,
    output: "[1] 1 2 3 4 5\ninteger(0)\nRound 1\nRound 2\nRound 3",
    mistakes: [
      "Using `1:n` when `n` can be 0 – `1:0` is `1 0`, so a loop would run twice instead of not at all.",
      "Passing a whole vector instead of one number. To count along a vector use `seq_along(x)`.",
    ],
    related: ["seq_along", "seq", "length"],
  },
  {
    name: "seq_along",
    package: "base",
    category: "Vectors",
    purpose:
      "Gives the positions 1, 2, …, length(x) of a vector. It is the safe way to loop over the positions of a vector, because for an empty vector it gives no positions at all.",
    syntax: "seq_along(along.with)",
    args: [{ name: "along.with", description: "The vector (or list) whose positions you want." }],
    example: String.raw`fruits <- c("apple", "banana", "cherry")
seq_along(fruits)
for (i in seq_along(fruits)) {
  cat(i, fruits[i], "\n")
}
empty <- c()
seq_along(empty)`,
    output: "[1] 1 2 3\n1 apple\n2 banana\n3 cherry\ninteger(0)",
    mistakes: [
      "Writing `seq_along(length(x))`. `length(x)` is a single number, so this always gives `1`. Pass the vector itself: `seq_along(x)`.",
      "Using `1:length(x)` instead – when `x` is empty it gives `1 0` and the loop body runs on positions that do not exist.",
    ],
    related: ["seq_len", "length", "seq"],
  },
  {
    name: "rep",
    package: "base",
    category: "Vectors",
    purpose: "Repeats values. `times` repeats the whole vector, `each` repeats every element before moving on.",
    syntax: "rep(x, times = 1, each = 1, length.out = NA)",
    args: [
      { name: "x", description: "The value or vector to repeat." },
      { name: "times", description: "How many times to repeat the whole vector." },
      { name: "each", description: "How many times to repeat each element in turn." },
      { name: "length.out", description: "Repeat until the result has exactly this length." },
    ],
    example: `rep(0, times = 5)
rep(c("A", "B"), times = 3)
rep(c("A", "B"), each = 3)
rep(1:3, length.out = 7)`,
    output: "[1] 0 0 0 0 0\n[1] \"A\" \"B\" \"A\" \"B\" \"A\" \"B\"\n[1] \"A\" \"A\" \"A\" \"B\" \"B\" \"B\"\n[1] 1 2 3 1 2 3 1",
    mistakes: [
      "Mixing up `times` and `each`: `times` gives A B A B A B, `each` gives A A A B B B.",
      "Giving `times` a vector whose length does not match `x` (e.g. `rep(1:3, times = 1:2)`) – R stops with \"invalid 'times' argument\".",
    ],
    related: ["seq", "c", "length"],
  },
  {
    name: "length",
    package: "base",
    category: "Vectors",
    purpose: "Counts how many elements a vector or list has. For a data frame it counts the columns.",
    syntax: "length(x)",
    args: [{ name: "x", description: "A vector, list or other object." }],
    example: `scores <- c(80, 90, 100, 75)
length(scores)
length("hello world")
nchar("hello world")
length(mtcars)`,
    output: "[1] 4\n[1] 1\n[1] 11\n[1] 11",
    mistakes: [
      "Using `length()` to count the letters in a word. `length(\"hello world\")` is 1 (one string); use `nchar()` to count characters.",
      "Using `length()` to count rows of a data frame – it returns the number of columns. Use `nrow()`.",
    ],
    related: ["nchar", "nrow", "ncol", "seq_along"],
  },
  {
    name: "rev",
    package: "base",
    category: "Vectors",
    purpose: "Reverses the order of the elements of a vector, so the last becomes first. Combine it with `sort()` to sort from largest to smallest.",
    syntax: "rev(x)",
    args: [{ name: "x", description: "The vector to reverse." }],
    example: `rev(c(1, 2, 3, 4))
rev(c("a", "b", "c"))
sort(c(3, 1, 2))
rev(sort(c(3, 1, 2)))`,
    output: "[1] 4 3 2 1\n[1] \"c\" \"b\" \"a\"\n[1] 1 2 3\n[1] 3 2 1",
    mistakes: [
      "Expecting `rev()` to sort. It only flips the current order – sort first if you need sorted values.",
      "Using `rev()` on a data frame to reverse the rows. It reverses the columns instead; for rows use `df[nrow(df):1, ]`.",
    ],
    related: ["sort", "order"],
  },
  {
    name: "sort",
    package: "base",
    category: "Vectors",
    purpose: "Returns the values of a vector in increasing (or decreasing) order. Missing values are dropped unless you ask to keep them.",
    syntax: "sort(x, decreasing = FALSE, na.last = NA)",
    args: [
      { name: "x", description: "The vector to sort (numbers, text or dates)." },
      { name: "decreasing", description: "`TRUE` to sort from largest to smallest." },
      { name: "na.last", description: "`NA` (default) removes missing values; `TRUE` puts them at the end." },
    ],
    example: `ages <- c(34, 18, 52, 27)
sort(ages)
sort(ages, decreasing = TRUE)
sort(c("banana", "apple", "cherry"))
sort(c(3, NA, 1))`,
    output: "[1] 18 27 34 52\n[1] 52 34 27 18\n[1] \"apple\"  \"banana\" \"cherry\"\n[1] 1 3",
    mistakes: [
      "Not noticing that `sort()` drops `NA` values – the result can be shorter than the input. Use `na.last = TRUE` to keep them.",
      "Trying to sort a data frame with `sort(df)`. To reorder rows by a column use `df[order(df$col), ]` or `arrange()`.",
      "Sorting numbers stored as text, which sorts alphabetically: `\"10\"` comes before `\"9\"`.",
    ],
    related: ["order", "rev", "arrange", "unique"],
  },
  {
    name: "order",
    package: "base",
    category: "Vectors",
    purpose:
      "Returns the *positions* that would put a vector in order. Its main use is sorting the rows of a data frame: `df[order(df$col), ]`.",
    syntax: "order(..., decreasing = FALSE)",
    args: [
      { name: "...", description: "One or more vectors to order by (later ones break ties)." },
      { name: "decreasing", description: "`TRUE` for largest first." },
    ],
    example: `ages <- c(34, 18, 52)
order(ages)
people <- data.frame(name = c("Ana", "Ben", "Cleo"), age = c(34, 18, 52))
people[order(people$age), ]
people[order(people$age, decreasing = TRUE), ]`,
    output: "[1] 2 1 3\n  name age\n2  Ben  18\n1  Ana  34\n3 Cleo  52\n  name age\n3 Cleo  52\n1  Ana  34\n2  Ben  18",
    mistakes: [
      "Confusing `order()` with `sort()`: `order(c(34, 18, 52))` is `2 1 3` (positions), not the sorted values.",
      "Forgetting the comma in `df[order(df$age), ]`. Without it R tries to reorder columns and stops with \"undefined columns selected\".",
    ],
    related: ["sort", "rev", "arrange"],
  },
  {
    name: "unique",
    package: "base",
    category: "Vectors",
    purpose: "Removes repeated values and keeps each distinct value once, in the order it first appears. Great for answering \"which categories are there?\".",
    syntax: "unique(x)",
    args: [{ name: "x", description: "A vector (or a data frame, to remove duplicated rows)." }],
    example: `colors <- c("red", "blue", "red", "green", "blue")
unique(colors)
length(unique(colors))
students <- read.csv("data/students.csv")
unique(students$class)`,
    output: "[1] \"red\"   \"blue\"  \"green\"\n[1] 3\n[1] \"C\" \"A\" \"B\"",
    mistakes: [
      "Expecting sorted results – `unique()` keeps first-appearance order. Wrap it in `sort()` if you want alphabetical order.",
      "Forgetting that capitals and spaces matter: `\"Boston\"`, `\"boston\"` and `\" Boston\"` are three different values. Clean with `trimws()` and `tolower()` first.",
    ],
    related: ["duplicated", "table", "sort", "distinct", "length"],
  },
  {
    name: "duplicated",
    package: "base",
    category: "Vectors",
    purpose:
      "Marks every value (or data frame row) that already appeared earlier with `TRUE`. Use it to count or remove duplicates.",
    syntax: "duplicated(x)",
    args: [{ name: "x", description: "A vector or data frame." }],
    example: `ids <- c("A1", "B2", "A1", "C3", "B2")
duplicated(ids)
sum(duplicated(ids))
ids[!duplicated(ids)]
df <- data.frame(id = c(1, 2, 2), score = c(10, 20, 20))
df[!duplicated(df), ]`,
    output: "[1] FALSE FALSE  TRUE FALSE  TRUE\n[1] 2\n[1] \"A1\" \"B2\" \"C3\"\n  id score\n1  1    10\n2  2    20",
    mistakes: [
      "Expecting both copies to be marked. The first copy is `FALSE`; only the later repeats are `TRUE`.",
      "Missing near-duplicates: rows that differ only by a space or capital letter are not duplicates until you clean the text.",
    ],
    related: ["unique", "distinct", "sum", "which"],
  },
  {
    name: "which",
    package: "base",
    category: "Vectors",
    purpose: "Tells you the positions where a condition is `TRUE`. Answers questions like \"which students scored above 60?\" with their index numbers.",
    syntax: "which(x)",
    args: [{ name: "x", description: "A logical vector, usually a condition such as `scores > 60`." }],
    example: `scores <- c(55, 82, 47, 91, 68)
scores > 60
which(scores > 60)
scores[which(scores > 60)]
which(c(NA, TRUE, FALSE, TRUE))`,
    output: "[1] FALSE  TRUE FALSE  TRUE  TRUE\n[1] 2 4 5\n[1] 82 91 68\n[1] 2 4",
    mistakes: [
      "Expecting the values instead of the positions. Use `x[which(cond)]` or simply `x[cond]` for the values.",
      "Removing with `x[-which(cond)]` when nothing matches: `which()` returns an empty result and `x[-integer(0)]` drops *everything*. `x[!cond]` is safer.",
    ],
    related: ["which.max", "which.min", "any", "subset"],
  },
  {
    name: "which.max",
    package: "base",
    category: "Vectors",
    purpose: "Gives the position of the largest value. Use it to find *where* (or *who*) the maximum is, not just how big it is.",
    syntax: "which.max(x)",
    args: [{ name: "x", description: "A numeric vector." }],
    example: `temps <- c(18, 25, 31, 22, 31)
which.max(temps)
days <- c("Mon", "Tue", "Wed", "Thu", "Fri")
days[which.max(temps)]
max(temps)`,
    output: "[1] 3\n[1] \"Wed\"\n[1] 31",
    mistakes: [
      "Forgetting about ties: only the *first* position of the maximum is returned (here 3, although Friday is also 31). Use `which(x == max(x))` to get all of them.",
      "Expecting the maximum value itself – that is `max()`.",
    ],
    related: ["which.min", "max", "which", "order"],
  },
  {
    name: "which.min",
    package: "base",
    category: "Vectors",
    purpose: "Gives the position of the smallest value. If the vector has names, the name is shown too.",
    syntax: "which.min(x)",
    args: [{ name: "x", description: "A numeric vector." }],
    example: `prices <- c(apple = 1.2, bread = 2.5, milk = 0.9)
which.min(prices)
names(which.min(prices))
min(prices)`,
    output: "milk\n   3\n[1] \"milk\"\n[1] 0.9",
    mistakes: [
      "Expecting the smallest value instead of its position – that is `min()`.",
      "Forgetting that ties return only the first position.",
    ],
    related: ["which.max", "min", "which", "names"],
  },
  {
    name: "is.na",
    package: "base",
    category: "Vectors",
    purpose:
      "Checks every value for missingness and returns `TRUE` where a value is `NA`. Combine with `sum()` to count missing values or with `!` to keep only complete ones.",
    syntax: "is.na(x)",
    args: [{ name: "x", description: "A vector, or a whole data frame." }],
    example: `ages <- c(23, NA, 41, NA, 35)
is.na(ages)
sum(is.na(ages))
ages[!is.na(ages)]
mean(ages, na.rm = TRUE)`,
    output: "[1] FALSE  TRUE FALSE  TRUE FALSE\n[1] 2\n[1] 23 41 35\n[1] 33",
    mistakes: [
      "Testing with `x == NA`. Any comparison with `NA` gives `NA`, never `TRUE`. Always use `is.na(x)`.",
      "Expecting text such as `\"N/A\"` or an empty cell to count as missing – they are ordinary strings. Use `read.csv(..., na.strings = c(\"\", \"N/A\"))` or replace them.",
    ],
    related: ["na.omit", "complete.cases", "mean", "sum"],
  },
  {
    name: "%in%",
    package: "base",
    category: "Vectors",
    purpose:
      "Asks, for every value on the left, \"is it one of the values on the right?\" and answers with `TRUE`/`FALSE`. Ideal for keeping rows that belong to a set of categories.",
    syntax: "x %in% table",
    args: [
      { name: "x", description: "The values to look up." },
      { name: "table", description: "The set of allowed values." },
    ],
    example: `fruits <- c("apple", "kiwi", "plum")
"kiwi" %in% fruits
c("plum", "pear") %in% fruits
students <- read.csv("data/students.csv")
nrow(students[students$class %in% c("A", "B"), ])`,
    output: "[1] TRUE\n[1]  TRUE FALSE\n[1] 40",
    mistakes: [
      "Using `==` with several options: `students$class == c(\"A\", \"B\")` compares element by element (alternating A, B, A, B …) and silently gives wrong rows. Use `%in%`.",
      "Swapping the sides: `x %in% y` has one answer per element of `x`. Put the values you are checking on the left.",
    ],
    related: ["which", "any", "filter", "unique"],
  },
  {
    name: "factor",
    package: "base",
    category: "Vectors",
    purpose:
      "Turns a vector into a *factor*: a categorical variable with a fixed set of possible values called levels. Factors control the order of categories in tables and plots.",
    syntax: "factor(x, levels, labels = levels, ordered = FALSE)",
    args: [
      { name: "x", description: "The values (usually text) to turn into categories." },
      { name: "levels", description: "The allowed categories, in the order you want them. Default: sorted alphabetically." },
      { name: "labels", description: "Optional new names for the levels." },
      { name: "ordered", description: "`TRUE` if the categories have a natural order (low < medium < high)." },
    ],
    example: `sizes <- c("small", "large", "medium", "small")
f <- factor(sizes, levels = c("small", "medium", "large"))
f
table(f)
as.integer(f)`,
    output: "[1] small  large  medium small\nLevels: small medium large\nf\n small medium  large\n     2      1      1\n[1] 1 3 2 1",
    mistakes: [
      "Leaving out `levels` and getting alphabetical order (large, medium, small) in tables and plots.",
      "Assigning a value that is not a level: R puts `NA` there and warns \"invalid factor level, NA generated\".",
      "Converting number-like factors with `as.numeric()` – you get the level codes. Use `as.numeric(as.character(f))`.",
    ],
    related: ["levels", "table", "as.character", "cut"],
  },
  {
    name: "levels",
    package: "base",
    category: "Vectors",
    purpose: "Shows the categories (levels) of a factor, in order. With `levels(x) <- …` you can rename them.",
    syntax: "levels(x)\nlevels(x) <- value",
    args: [
      { name: "x", description: "A factor." },
      { name: "value", description: "New names for the levels, in the same order as the current levels." },
    ],
    example: `grades <- factor(c("B", "A", "C", "A"))
levels(grades)
nlevels(grades)
levels(grades) <- c("Excellent", "Good", "Fair")
grades`,
    output: "[1] \"A\" \"B\" \"C\"\n[1] 3\n[1] Good      Excellent Fair      Excellent\nLevels: Excellent Good Fair",
    mistakes: [
      "Using `levels(x) <- …` to reorder categories. It *renames* them position by position, so a wrong order silently mislabels your data. To reorder, use `factor(x, levels = …)`.",
      "Calling `levels()` on a character vector – the answer is `NULL`. Convert with `factor()` first.",
    ],
    related: ["factor", "table", "as.character"],
  },

  /* ---------------------------------------------------------------- */
  /* Math & rounding                                                  */
  /* ---------------------------------------------------------------- */
  {
    name: "sum",
    package: "base",
    category: "Math & rounding",
    purpose:
      "Adds up all the values. Because `TRUE` counts as 1 and `FALSE` as 0, `sum()` of a condition counts how many values meet it.",
    syntax: "sum(..., na.rm = FALSE)",
    args: [
      { name: "...", description: "Numeric (or logical) vectors to add up." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `prices <- c(2.50, 4.00, 3.25)
sum(prices)
sum(1:100)
sum(c(5, NA, 10), na.rm = TRUE)
scores <- c(55, 82, 47, 91)
sum(scores > 60)`,
    output: "[1] 9.75\n[1] 5050\n[1] 15\n[1] 2",
    mistakes: [
      "Forgetting `na.rm = TRUE`: a single `NA` makes the whole sum `NA`.",
      "Summing text: `sum(c(\"1\", \"2\"))` stops with \"invalid 'type' (character) of argument\". Convert with `as.numeric()` first.",
    ],
    related: ["mean", "cumsum", "length", "colMeans"],
  },
  {
    name: "max",
    package: "base",
    category: "Math & rounding",
    purpose: "Returns the largest value. You can give it one vector or several values.",
    syntax: "max(..., na.rm = FALSE)",
    args: [
      { name: "...", description: "Numbers or vectors." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `temps <- c(18, 25, 31, 22)
max(temps)
max(3, 9, 4)
max(c(5, NA, 8))
max(c(5, NA, 8), na.rm = TRUE)`,
    output: "[1] 31\n[1] 9\n[1] NA\n[1] 8",
    mistakes: [
      "Forgetting `na.rm = TRUE` – with any `NA` the answer is `NA`.",
      "Wanting *where* the maximum is. `max()` gives the value; `which.max()` gives the position.",
      "Expecting element-by-element maxima of two vectors – `max(a, b)` returns one number. Use `pmax(a, b)` for that.",
    ],
    related: ["min", "range", "which.max", "summary"],
  },
  {
    name: "min",
    package: "base",
    category: "Math & rounding",
    purpose: "Returns the smallest value. With text it returns the first value in alphabetical order.",
    syntax: "min(..., na.rm = FALSE)",
    args: [
      { name: "...", description: "Numbers or vectors." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `prices <- c(4.99, 2.49, 7.25)
min(prices)
min(c("banana", "apple", "cherry"))
pmin(c(1, 5, 9), 4)`,
    output: "[1] 2.49\n[1] \"apple\"\n[1] 1 4 4",
    mistakes: [
      "Forgetting `na.rm = TRUE` when the data contain `NA`.",
      "Using `min()` to cap values element by element – that is `pmin()`, shown in the last line.",
    ],
    related: ["max", "range", "which.min"],
  },
  {
    name: "range",
    package: "base",
    category: "Math & rounding",
    purpose: "Returns two numbers: the smallest and the largest value. The statistical *range* (the spread) is their difference, `diff(range(x))`.",
    syntax: "range(..., na.rm = FALSE)",
    args: [
      { name: "...", description: "Numeric vectors." },
      { name: "na.rm", description: "`TRUE` to ignore missing values." },
    ],
    example: `ages <- c(34, 18, 52, 27)
range(ages)
diff(range(ages))
range(c(3, NA, 9), na.rm = TRUE)`,
    output: "[1] 18 52\n[1] 34\n[1] 3 9",
    mistakes: [
      "Expecting a single number. `range()` returns minimum and maximum; use `diff(range(x))` or `max(x) - min(x)` for the width.",
      "Forgetting `na.rm = TRUE`, which gives `NA NA`.",
    ],
    related: ["min", "max", "IQR", "summary"],
  },
  {
    name: "round",
    package: "base",
    category: "Math & rounding",
    purpose:
      "Rounds numbers to a chosen number of decimal places. Note: an exact half is rounded to the nearest *even* number, so `round(2.5)` is 2 and `round(3.5)` is 4.",
    syntax: "round(x, digits = 0)",
    args: [
      { name: "x", description: "The number(s) to round." },
      { name: "digits", description: "Decimal places to keep. Negative values round to tens, hundreds, …" },
    ],
    example: `round(3.14159, 2)
round(2.5)
round(3.5)
round(1234.567, -2)
round(-1.7)`,
    output: "[1] 3.14\n[1] 2\n[1] 4\n[1] 1200\n[1] -2",
    mistakes: [
      "Expecting halves to always round up – R rounds `2.5` to `2` (round half to even, a standard that avoids bias).",
      "Rounding in the middle of a calculation, which adds rounding error. Round only the final result for display.",
      "Writing `round(x, 2)` and expecting `2.50` to show the trailing zero. Use `format(x, nsmall = 2)` or `sprintf(\"%.2f\", x)` for that.",
    ],
    related: ["signif", "ceiling", "floor", "format", "sprintf"],
  },
  {
    name: "signif",
    package: "base",
    category: "Math & rounding",
    purpose: "Rounds to a number of *significant* digits (counting from the first non-zero digit), useful for very large or very small numbers.",
    syntax: "signif(x, digits = 6)",
    args: [
      { name: "x", description: "The number(s) to round." },
      { name: "digits", description: "How many significant digits to keep." },
    ],
    example: `signif(123456, 2)
signif(0.0012345, 3)
signif(3.14159, 3)`,
    output: "[1] 120000\n[1] 0.00123\n[1] 3.14",
    mistakes: [
      "Confusing it with `round()`: `round(x, 2)` keeps 2 *decimal places*, `signif(x, 2)` keeps 2 *meaningful digits*.",
      "Expecting trailing zeros: `signif(2.5, 3)` is still shown as `2.5`. Use `format()` or `sprintf()` when you need a fixed display.",
    ],
    related: ["round", "format"],
  },
  {
    name: "ceiling",
    package: "base",
    category: "Math & rounding",
    purpose: "Rounds *up* to the next whole number. Handy for questions like \"how many tables do I need?\".",
    syntax: "ceiling(x)",
    args: [{ name: "x", description: "The number(s) to round up." }],
    example: `ceiling(2.1)
ceiling(-2.1)
guests <- 23
tables_needed <- ceiling(guests / 6)
tables_needed`,
    output: "[1] 3\n[1] -2\n[1] 4",
    mistakes: [
      "Expecting `ceiling(-2.1)` to be `-3`. \"Up\" means towards larger numbers, so it is `-2`.",
      "Using `ceiling()` to round to the *nearest* whole number – `ceiling(2.1)` is 3. Use `round()` for that.",
    ],
    related: ["floor", "round", "as.integer"],
  },
  {
    name: "floor",
    package: "base",
    category: "Math & rounding",
    purpose: "Rounds *down* to the whole number below. Together with `%%` (the remainder) it splits quantities, e.g. minutes into hours and minutes.",
    syntax: "floor(x)",
    args: [{ name: "x", description: "The number(s) to round down." }],
    example: `floor(2.9)
floor(-2.1)
total_minutes <- 135
floor(total_minutes / 60)
total_minutes %% 60`,
    output: "[1] 2\n[1] -3\n[1] 2\n[1] 15",
    mistakes: [
      "Expecting `floor(-2.1)` to be `-2`. \"Down\" means towards smaller numbers, so it is `-3`.",
      "Using `floor()` to round to the nearest whole number – that is `round()`.",
    ],
    related: ["ceiling", "round", "as.integer"],
  },
  {
    name: "sqrt",
    package: "base",
    category: "Math & rounding",
    purpose: "Calculates the square root. It works on every element of a vector at once.",
    syntax: "sqrt(x)",
    args: [{ name: "x", description: "A number or numeric vector (should not be negative)." }],
    example: `sqrt(16)
sqrt(c(4, 9, 25))
sqrt(2)
sqrt(-1)`,
    output: "[1] 4\n[1] 2 3 5\n[1] 1.414214\n[1] NaN\nWarning message:\nIn sqrt(-1) : NaNs produced",
    mistakes: [
      "Taking the square root of a negative number – the result is `NaN` (\"not a number\") with the warning \"NaNs produced\".",
      "Writing `sqrt 16` without parentheses – a syntax error. Functions always need `()`.",
    ],
    related: ["abs", "exp", "log", "sd"],
  },
  {
    name: "abs",
    package: "base",
    category: "Math & rounding",
    purpose: "Returns the absolute value – the size of a number without its sign. Useful for distances and errors (\"how far off was the prediction?\").",
    syntax: "abs(x)",
    args: [{ name: "x", description: "A number or numeric vector." }],
    example: `abs(-7)
abs(c(-2, 0, 3.5))
predicted <- c(10, 20, 30)
actual <- c(12, 18, 33)
abs(actual - predicted)
mean(abs(actual - predicted))`,
    output: "[1] 7\n[1] 2.0 0.0 3.5\n[1] 2 2 3\n[1] 2.333333",
    mistakes: [
      "Applying `abs()` to text numbers such as `\"-5\"` – R stops with \"non-numeric argument to mathematical function\". Convert first.",
      "Forgetting that `abs()` throws away the direction: errors of −5 and +5 look the same. Keep the signed differences if over- and under-estimates matter.",
    ],
    related: ["sqrt", "round", "mean"],
  },
  {
    name: "exp",
    package: "base",
    category: "Math & rounding",
    purpose: "Calculates e (about 2.718) raised to a power. It is the opposite of the natural logarithm `log()` and appears in growth and interest calculations.",
    syntax: "exp(x)",
    args: [{ name: "x", description: "The power to raise e to." }],
    example: `exp(1)
exp(0)
exp(log(10))
1000 * exp(0.05 * 2)`,
    output: "[1] 2.718282\n[1] 1\n[1] 10\n[1] 1105.171",
    mistakes: [
      "Writing `e^2` – R has no built-in variable `e` (\"object 'e' not found\"). Use `exp(2)`.",
      "Confusing `exp(x)` with `x^2` or with scientific notation such as `1e3` (which means 1000).",
    ],
    related: ["log", "sqrt"],
  },
  {
    name: "log",
    package: "base",
    category: "Math & rounding",
    purpose:
      "Calculates logarithms. By default it is the *natural* log (base e); use `base =`, `log10()` or `log2()` for other bases. Logs are used to tame very skewed data such as incomes.",
    syntax: "log(x, base = exp(1))",
    args: [
      { name: "x", description: "Positive number(s)." },
      { name: "base", description: "The base of the logarithm (default e)." },
    ],
    example: `log(100)
log(100, base = 10)
log10(1000)
log2(8)
log(0)`,
    output: "[1] 4.60517\n[1] 2\n[1] 3\n[1] 3\n[1] -Inf",
    mistakes: [
      "Expecting `log(100)` to be 2. Without `base` it is the natural log (4.60517); use `log10(100)`.",
      "Taking the log of zero or negative values: `log(0)` is `-Inf` and `log(-1)` is `NaN` with a warning.",
    ],
    related: ["exp", "sqrt"],
  },
  {
    name: "cumsum",
    package: "base",
    category: "Math & rounding",
    purpose:
      "Calculates a running (cumulative) total: each value is the sum of everything up to that point. Relatives: `cumprod()`, `cummax()`, `cummin()`.",
    syntax: "cumsum(x)",
    args: [{ name: "x", description: "A numeric vector." }],
    example: `daily_steps <- c(3000, 4500, 2000, 6000)
cumsum(daily_steps)
cumprod(c(1, 2, 3, 4))
cummax(c(3, 1, 4, 1, 5))`,
    output: "[1]  3000  7500  9500 15500\n[1]  1  2  6 24\n[1] 3 3 4 4 5",
    mistakes: [
      "Expecting one total – that is `sum()`. `cumsum()` returns a vector as long as the input.",
      "Having an `NA` in the data: every running total after it becomes `NA` (there is no `na.rm`).",
    ],
    related: ["sum", "max", "seq"],
  },
];
