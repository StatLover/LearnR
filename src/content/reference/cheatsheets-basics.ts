import type { CheatSheet } from "../types";

/** Cheat sheets – R basics: variables, vectors, data frames, conditions & loops, functions. */
export const basicsCheatSheets: CheatSheet[] = [
  {
    id: "variables",
    title: "Variables & data types",
    description: "Create variables, recognise R's basic data types, check and convert them, and calculate with operators.",
    sections: [
      {
        title: "Creating variables",
        items: [
          { code: "age <- 30", description: "Assign a value to a name with `<-` (read it as \"age gets 30\")." },
          { code: "name <- \"Ada\"", description: "Text (a string) always goes inside quotes." },
          { code: "age\nprint(age)", description: "Type the name (or use `print()`) to see the value." },
          { code: "age <- age + 1", description: "Assigning again replaces the old value – there is no warning." },
          { code: "total_score <- 95", description: "Names may contain letters, digits, `_` and `.`, must start with a letter and are case-sensitive. Use `snake_case`." },
        ],
      },
      {
        title: "Basic data types",
        items: [
          { code: "3.14\n-2", description: "**numeric** (stored as \"double\"): any number, with or without decimals." },
          { code: "5L", description: "**integer**: a whole number, marked with `L`. `1:10` also creates integers." },
          { code: "\"hello\"\n\"42\"", description: "**character**: text. Anything in quotes is text, even digits." },
          { code: "TRUE\nFALSE", description: "**logical**: yes/no values, the result of every comparison. Always in capitals." },
          { code: "NA", description: "A missing value. It can appear in a vector of any type." },
        ],
      },
      {
        title: "Checking types",
        items: [
          { code: "class(age)", description: "What kind of object it is: `\"numeric\"`, `\"character\"`, `\"logical\"`, `\"data.frame\"`, …" },
          { code: "typeof(5L)", description: "How R stores it internally: `\"integer\"`, `\"double\"`, …" },
          { code: "is.numeric(age)\nis.character(name)", description: "Yes/no checks for a specific type." },
          { code: "str(name)", description: "A compact description of any object: type and first values." },
        ],
      },
      {
        title: "Converting types",
        items: [
          { code: "as.numeric(\"3.5\")", description: "Text to number. Text that is not a number becomes `NA` with a warning." },
          { code: "as.character(42)", description: "Number to text, e.g. for building labels." },
          { code: "as.integer(3.9)", description: "To a whole number – the decimals are cut off (gives 3), not rounded." },
          { code: "as.logical(c(\"TRUE\", \"false\", \"T\"))", description: "Text to `TRUE`/`FALSE`; `0` becomes `FALSE` and other numbers `TRUE`." },
          { code: "c(1, \"a\", TRUE)", description: "Coercion: a vector holds one type, so mixing converts everything to text." },
        ],
      },
      {
        title: "Operators",
        items: [
          { code: "7 + 2\n7 - 2\n7 * 2\n7 / 2", description: "Add, subtract, multiply, divide." },
          { code: "7 ^ 2\n7 %% 2\n7 %/% 2", description: "Power (49), remainder after division (1), whole-number division (3)." },
          { code: "age == 30\nage != 30\nage >= 18", description: "Comparisons give `TRUE`/`FALSE`. Equality is `==` (two signs)." },
          { code: "age > 18 & age < 65\nage < 18 | age > 65\n!is.na(age)", description: "Combine conditions: `&` and, `|` or, `!` not." },
          { code: "(2 + 3) * 4", description: "Parentheses control the order of operations (powers, then × ÷, then + −)." },
        ],
      },
      {
        title: "Special values",
        items: [
          { code: "is.na(c(1, NA, 3))", description: "Find missing values. Never test with `x == NA`." },
          { code: "mean(c(1, NA, 3), na.rm = TRUE)", description: "Most summary functions ignore `NA` with `na.rm = TRUE`." },
          { code: "0 / 0\n1 / 0", description: "`NaN` (not a number) and `Inf` (infinity)." },
          { code: "x <- NULL\nlength(x)", description: "`NULL` means \"nothing at all\" (length 0)." },
        ],
      },
    ],
  },
  {
    id: "vectors",
    title: "Vectors",
    description: "Create vectors, pick and change elements, and use R's vectorised operations instead of loops.",
    sections: [
      {
        title: "Creating vectors",
        items: [
          { code: "scores <- c(80, 90, 100)", description: "Combine values into a vector with `c()`." },
          { code: "1:10", description: "A sequence of whole numbers from 1 to 10." },
          { code: "seq(0, 1, by = 0.25)\nseq(10, 100, length.out = 4)", description: "Sequences with a step, or with a given number of values." },
          { code: "rep(\"a\", times = 3)\nrep(c(1, 2), each = 2)", description: "Repeat values: `times` repeats the whole vector, `each` every element." },
          { code: "numeric(3)\ncharacter(2)", description: "Empty vectors of a given length (filled with 0 or \"\"), useful before a loop." },
        ],
      },
      {
        title: "Picking elements (indexing)",
        items: [
          { code: "scores[1]", description: "The first element – R counts from 1." },
          { code: "scores[c(1, 3)]", description: "Several elements by position." },
          { code: "scores[-1]", description: "Everything except the first element." },
          { code: "scores[scores > 85]", description: "Elements that meet a condition." },
          { code: "scores[length(scores)]", description: "The last element." },
          { code: "ages <- c(ana = 28, ben = 35)\nages[\"ben\"]", description: "Elements by name, for a named vector." },
        ],
      },
      {
        title: "Changing vectors",
        items: [
          { code: "scores[2] <- 95", description: "Replace one element." },
          { code: "scores <- c(scores, 70)", description: "Append a value (remember to assign the result)." },
          { code: "scores[scores < 75] <- 75", description: "Replace all elements that meet a condition." },
          { code: "sort(scores)\nsort(scores, decreasing = TRUE)", description: "Sorted copies, smallest or largest first." },
          { code: "rev(scores)", description: "Reverse the order." },
        ],
      },
      {
        title: "Vectorised operations",
        items: [
          { code: "scores * 2\nscores + 5", description: "Arithmetic is applied to every element at once – no loop needed." },
          { code: "c(1, 2, 3) + c(10, 20, 30)", description: "Two vectors are combined element by element." },
          { code: "scores > 85", description: "A comparison gives one `TRUE`/`FALSE` per element." },
          { code: "sum(scores > 85)\nmean(scores > 85)", description: "Count how many meet a condition, or the proportion that do." },
          { code: "which(scores > 85)", description: "Positions where the condition is `TRUE`." },
          { code: "scores %in% c(90, 95)", description: "Is each value one of these?" },
        ],
      },
      {
        title: "Summaries",
        items: [
          { code: "length(scores)", description: "Number of elements." },
          { code: "sum(scores)\nmean(scores)\nmedian(scores)", description: "Total, average and middle value." },
          { code: "min(scores)\nmax(scores)\nrange(scores)", description: "Smallest, largest, and both at once." },
          { code: "unique(c(\"a\", \"b\", \"a\"))\ntable(c(\"a\", \"b\", \"a\"))", description: "Distinct values, and how often each occurs." },
          { code: "cumsum(scores)", description: "Running total." },
        ],
      },
    ],
  },
  {
    id: "data-frames",
    title: "Data frames",
    description: "Create, import, inspect, subset, change and combine data frames – R's tables – with base R.",
    sections: [
      {
        title: "Create & import",
        items: [
          { code: "df <- data.frame(name = c(\"Ana\", \"Ben\", \"Cleo\"),\n                 age = c(28, 35, 42))", description: "Build a data frame from vectors of equal length – one per column." },
          { code: "students <- read.csv(\"data/students.csv\")", description: "Read a CSV file into a data frame." },
          { code: "read.csv(\"data/customers_messy.csv\", na.strings = c(\"\", \"NA\", \"N/A\"))", description: "Tell R which text means \"missing\"." },
          { code: "write.csv(df, \"people.csv\", row.names = FALSE)", description: "Save a data frame as a CSV file." },
        ],
      },
      {
        title: "Inspect",
        items: [
          { code: "head(students)\ntail(students, 3)", description: "First 6 rows / last 3 rows." },
          { code: "str(students)", description: "Columns, their types and first values – run this after every import." },
          { code: "summary(students)", description: "Summary statistics for every column." },
          { code: "nrow(students)\nncol(students)\ndim(students)", description: "Number of rows, columns, or both." },
          { code: "names(students)", description: "Column names." },
          { code: "colSums(is.na(students))", description: "Missing values per column." },
        ],
      },
      {
        title: "Select rows & columns",
        items: [
          { code: "students$math", description: "One column as a vector." },
          { code: "students[1, ]", description: "First row (all columns). Rows go before the comma." },
          { code: "students[, c(\"name\", \"math\")]", description: "Some columns (all rows). Columns go after the comma." },
          { code: "students[1:5, c(\"name\", \"math\")]", description: "Rows and columns together." },
          { code: "students[students$math > 90, ]", description: "Rows that meet a condition (note the comma)." },
          { code: "subset(students, class == \"A\" & math > 80, select = c(name, math))", description: "The same with `subset()` – column names can be used directly." },
        ],
      },
      {
        title: "Change",
        items: [
          { code: "df$age_months <- df$age * 12", description: "Add a calculated column." },
          { code: "df$age_months <- NULL", description: "Remove a column." },
          { code: "names(df)[names(df) == \"age\"] <- \"years\"", description: "Rename a column." },
          { code: "students[order(students$math), ]\nstudents[order(-students$math), ]", description: "Sort rows by a column, ascending or descending." },
          { code: "students$passed <- ifelse(students$math >= 60, \"yes\", \"no\")", description: "A new column from a condition." },
        ],
      },
      {
        title: "Combine & summarise",
        items: [
          { code: "rbind(df, data.frame(name = \"Dev\", age = 19))", description: "Add rows (the column names must match)." },
          { code: "cbind(df, city = c(\"Rome\", \"Oslo\", \"Lima\"))", description: "Add columns side by side." },
          { code: "grades <- data.frame(name = c(\"Ana\", \"Ben\"), grade = c(\"A\", \"B\"))\nmerge(df, grades, by = \"name\", all.x = TRUE)", description: "Join two tables by a key column, keeping every row of the first." },
          { code: "aggregate(math ~ class, data = students, FUN = mean)", description: "A summary per group." },
          { code: "table(students$class)", description: "Count rows per category." },
          { code: "na.omit(students)", description: "Drop rows that contain any missing value." },
        ],
      },
    ],
  },
  {
    id: "loops",
    title: "Conditions & loops",
    description: "Make decisions with if/else and ifelse(), and repeat work with for and while loops – or avoid loops with vectorised code.",
    sections: [
      {
        title: "Conditions",
        items: [
          { code: "x <- 7\nx > 5\nx == 7\nx != 7", description: "Comparisons give `TRUE` or `FALSE`." },
          { code: "x > 5 & x < 10\nx < 0 | x > 100\n!(x > 5)", description: "And, or, not." },
          { code: "x %in% c(1, 3, 7)", description: "Is the value one of several options?" },
          { code: "any(c(1, 8) > 5)\nall(c(1, 8) > 5)", description: "Is at least one / every value `TRUE`?" },
          { code: "isTRUE(NA > 5)", description: "A safe single `TRUE`/`FALSE`, even when the value is `NA`." },
        ],
      },
      {
        title: "if / else",
        items: [
          { code: "if (x > 5) {\n  print(\"big\")\n}", description: "Run code only when the condition is `TRUE`." },
          { code: "if (x > 5) {\n  print(\"big\")\n} else {\n  print(\"small\")\n}", description: "Two branches. `else` must be on the same line as the closing `}`." },
          { code: "temp <- 22\nif (temp > 30) {\n  \"hot\"\n} else if (temp > 15) {\n  \"mild\"\n} else {\n  \"cold\"\n}", description: "Several branches, checked from top to bottom." },
          { code: "scores <- c(45, 78, 62)\nifelse(scores >= 60, \"pass\", \"fail\")", description: "Vectorised if/else: one answer per element. `if` handles only a single value." },
        ],
      },
      {
        title: "for loops",
        items: [
          { code: "for (i in 1:3) {\n  print(i)\n}", description: "Repeat once for each value; `i` takes the next value each round." },
          { code: "fruits <- c(\"apple\", \"kiwi\")\nfor (fruit in fruits) {\n  print(toupper(fruit))\n}", description: "Loop directly over the elements." },
          { code: "for (i in seq_along(fruits)) {\n  cat(i, fruits[i], \"\\n\")\n}", description: "Loop over positions safely with `seq_along()`." },
          { code: "squares <- numeric(5)\nfor (i in 1:5) {\n  squares[i] <- i^2\n}\nsquares", description: "Create the result vector first, then fill it in the loop." },
          { code: "total <- 0\nfor (s in scores) {\n  total <- total + s\n}\ntotal", description: "Accumulate a running total." },
        ],
      },
      {
        title: "while loops & control",
        items: [
          { code: "n <- 1\nwhile (n < 100) {\n  n <- n * 2\n}\nn", description: "Repeat while the condition is `TRUE`. Make sure something changes, or it never stops." },
          { code: "for (i in 1:10) {\n  if (i > 3) break\n  print(i)\n}", description: "`break` leaves the loop immediately." },
          { code: "for (i in 1:5) {\n  if (i %% 2 == 0) next\n  print(i)\n}", description: "`next` skips to the next round." },
        ],
      },
      {
        title: "Without a loop",
        items: [
          { code: "scores * 2", description: "Vectorised arithmetic replaces most simple loops." },
          { code: "sapply(1:5, function(i) i^2)", description: "Apply a function to every element and collect the results." },
          { code: "cumsum(c(5, 10, 15))", description: "Running totals without a loop." },
          { code: "sum(scores >= 60)", description: "Count matches without a counter variable." },
        ],
      },
    ],
  },
  {
    id: "functions",
    title: "Functions",
    description: "Call functions with arguments, write your own with defaults and checks, and apply functions to many values at once.",
    sections: [
      {
        title: "Calling functions",
        items: [
          { code: "round(3.14159, digits = 2)", description: "Name, then arguments in parentheses. Naming arguments makes code clearer." },
          { code: "round(3.14159, 2)", description: "Arguments can also be given by position." },
          { code: "args(round)", description: "Show a function's arguments and defaults (`?round` opens its help page in RStudio)." },
          { code: "round(mean(c(1.234, 5.678)), 1)", description: "Nested calls run from the inside out." },
          { code: "c(1.234, 5.678) |> mean() |> round(1)", description: "The same with the pipe `|>`: read it as \"then\"." },
        ],
      },
      {
        title: "Writing a function",
        items: [
          { code: "square <- function(x) {\n  x^2\n}\nsquare(4)", description: "`function(arguments) { body }`. The last value is returned." },
          { code: "bmi <- function(weight_kg, height_m) {\n  weight_kg / height_m^2\n}\nbmi(70, 1.75)", description: "Several arguments, separated by commas." },
          { code: "greet <- function(name, greeting = \"Hello\") {\n  paste(greeting, name)\n}\ngreet(\"Ada\")", description: "A default argument is used when the caller leaves it out." },
          { code: "safe_divide <- function(a, b) {\n  if (b == 0) {\n    return(NA)\n  }\n  a / b\n}", description: "`return()` leaves the function early with a value." },
          { code: "stats <- function(x) {\n  list(mean = mean(x), sd = sd(x))\n}\nstats(c(2, 4, 6))$mean", description: "Return several results in a list." },
        ],
      },
      {
        title: "Checks & messages",
        items: [
          { code: "check_age <- function(age) {\n  if (age < 0) stop(\"age cannot be negative\")\n  age\n}", description: "`stop()` ends the function with your own error message." },
          { code: "half <- function(x) {\n  stopifnot(is.numeric(x))\n  x / 2\n}", description: "`stopifnot()` checks conditions quickly." },
          { code: "message(\"Loading data...\")", description: "A progress note for the user." },
          { code: "warning(\"some values were missing\")", description: "Warn that something may be wrong, without stopping." },
        ],
      },
      {
        title: "Scope",
        items: [
          { code: "x <- 10\nf <- function() {\n  x <- 99\n  x\n}\nf()\nx", description: "Variables created inside a function are local: the outer `x` stays 10." },
          { code: "add <- function(a, b) {\n  a + b\n}", description: "Pass everything a function needs as arguments rather than relying on outside variables." },
        ],
      },
      {
        title: "Apply a function to many values",
        items: [
          { code: "sapply(c(1, 4, 9), sqrt)", description: "Apply to each element, simplify to a vector." },
          { code: "sapply(c(1, 2, 3), function(v) v * 10)\nsapply(c(1, 2, 3), \\(v) v * 10)", description: "Anonymous functions, long and short form." },
          { code: "lapply(list(a = 1:3, b = 4:6), sum)", description: "Always returns a list." },
          { code: "vapply(c(\"a\", \"bb\"), nchar, FUN.VALUE = integer(1))", description: "Like `sapply()` but with a declared result type." },
          { code: "apply(matrix(1:6, nrow = 2), 1, sum)", description: "Apply to each row (`1`) or column (`2`) of a matrix." },
          { code: "tapply(mtcars$mpg, mtcars$cyl, mean)", description: "Apply to each group." },
        ],
      },
    ],
  },
];
