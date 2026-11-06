import type { GlossaryTerm } from "../types";

/** Glossary – general programming terms ("programming") and R-specific terms ("r"). */
export const programmingTerms: GlossaryTerm[] = [
  /* ---------------------------------------------------------------- */
  /* Programming                                                       */
  /* ---------------------------------------------------------------- */
  {
    slug: "program",
    term: "Program",
    category: "programming",
    definition:
      "A set of instructions that tells a computer what to do, step by step. Like a recipe, it lists actions in order, and the computer follows them exactly – it does not guess what you meant. An R script that loads data, cleans it and draws a chart is a small program.",
    related: ["code", "script", "programming-language"],
  },
  {
    slug: "code",
    term: "Code",
    category: "programming",
    definition:
      "The text you write in a programming language to give the computer instructions. In R, every line you type – such as `mean(c(1, 2, 3))` – is code. \"Running\" code means asking R to carry out those instructions.",
    example: `mean(c(1, 2, 3))`,
    related: ["program", "syntax", "script", "console"],
  },
  {
    slug: "programming-language",
    term: "Programming language",
    category: "programming",
    definition:
      "A language with strict rules that both people and computers can read, used to write programs. Each language has its own vocabulary and grammar (syntax). R is a programming language designed especially for working with data and statistics; others include Python and JavaScript.",
    related: ["r", "syntax", "code"],
  },
  {
    slug: "syntax",
    term: "Syntax",
    category: "programming",
    definition:
      "The grammar rules of a programming language: where brackets, commas and quotes go. If the syntax is wrong (for example a missing closing bracket), R cannot understand the line at all and reports a syntax error such as \"unexpected symbol\" before running anything.",
    example: `# Correct syntax: every opening bracket is closed
total <- sum(c(1, 2, 3))
total`,
    related: ["error", "code", "programming-language"],
  },
  {
    slug: "console",
    term: "Console",
    category: "programming",
    definition:
      "The window where you type R commands one at a time and see the results immediately – like a calculator conversation with R. The `>` prompt means R is waiting for your next command. Work typed only in the console is not saved, which is why longer work goes into a script.",
    example: `2 + 3`,
    related: ["script", "code", "r"],
  },
  {
    slug: "script",
    term: "Script",
    category: "programming",
    definition:
      "A saved text file (ending in `.R`) containing R code that you can run again at any time. Think of it as a written-down recipe, while the console is cooking without notes. Scripts make your work repeatable and shareable.",
    example: `# A tiny script: create data, then summarise it
scores <- c(72, 85, 90)
mean(scores)`,
    related: ["console", "comment", "program"],
  },
  {
    slug: "comment",
    term: "Comment",
    category: "programming",
    definition:
      "A note in your code that R ignores. In R, everything after a `#` on a line is a comment. Comments explain *why* the code does something, for other people and for your future self.",
    example: `# Convert a temperature from Celsius to Fahrenheit
celsius <- 20
celsius * 9 / 5 + 32  # the conversion formula`,
    related: ["script", "code"],
  },
  {
    slug: "variable",
    term: "Variable",
    category: "programming",
    definition:
      "A name that stores a value so you can use it later – like a labelled box. You create one with `<-`, for example `age <- 30`, and then type `age` to get 30 back. Its value can be replaced at any time by assigning again.",
    example: `age <- 30
age + 1`,
    related: ["assignment", "value", "object"],
  },
  {
    slug: "assignment",
    term: "Assignment",
    category: "programming",
    definition:
      "Storing a value in a variable. In R you write the name, the arrow `<-` and the value: `price <- 9.99`. Read it as \"price gets 9.99\". Assigning to an existing name replaces its old value without any warning.",
    example: `price <- 9.99
price <- price * 2
price`,
    related: ["variable", "value", "operator"],
  },
  {
    slug: "value",
    term: "Value",
    category: "programming",
    definition:
      "A piece of data, such as the number `42`, the text `\"hello\"` or the logical `TRUE`. Values can be typed directly, stored in variables or produced by functions.",
    example: `42
"hello"
TRUE`,
    related: ["variable", "data-type", "object"],
  },
  {
    slug: "object",
    term: "Object",
    category: "programming",
    definition:
      "Anything R stores in memory: a number, a vector, a data frame, a function, a fitted model. When you assign something to a name you create an object. `ls()` lists the objects in your workspace and `class()` tells you what kind each is.",
    example: `scores <- c(80, 90)
class(scores)
ls()`,
    related: ["variable", "environment", "workspace"],
  },
  {
    slug: "function",
    term: "Function",
    category: "programming",
    definition:
      "A reusable piece of code that takes inputs (arguments), does a job and gives back a result (the return value) – like a machine where you put something in and get something out. You call it with its name and parentheses: `round(3.14159, 2)`. You can also write your own with `function()`.",
    example: `round(3.14159, 2)
double_it <- function(x) {
  x * 2
}
double_it(21)`,
    related: ["argument", "return-value", "parameter", "anonymous-function"],
  },
  {
    slug: "argument",
    term: "Argument",
    category: "programming",
    definition:
      "A value you give to a function when you call it, written inside the parentheses. In `round(3.14159, digits = 2)`, `3.14159` and `digits = 2` are the arguments. Arguments can be given by position or by name; naming them makes code clearer.",
    example: `round(3.14159, digits = 2)
round(digits = 1, x = 2.75)`,
    related: ["parameter", "function", "default-argument"],
  },
  {
    slug: "parameter",
    term: "Parameter",
    category: "programming",
    definition:
      "The named input slot in a function's definition. In `function(x, times)` the parameters are `x` and `times`; when you call the function, the values you pass (the arguments) fill these slots. People often use \"parameter\" and \"argument\" interchangeably.",
    example: `repeat_word <- function(word, times) {
  paste(rep(word, times), collapse = " ")
}
repeat_word("hip", 2)`,
    related: ["argument", "function", "default-argument"],
  },
  {
    slug: "default-argument",
    term: "Default argument",
    category: "programming",
    definition:
      "A value a parameter uses automatically when you do not supply one. For example `round()` has `digits = 0` as its default, so `round(3.7)` gives 4. In your own functions you set defaults like `function(x, times = 2)`.",
    example: `greet <- function(name, greeting = "Hello") {
  paste(greeting, name)
}
greet("Ada")
greet("Ada", greeting = "Hi")`,
    related: ["argument", "parameter", "function"],
  },
  {
    slug: "return-value",
    term: "Return value",
    category: "programming",
    definition:
      "The result a function hands back when it finishes. In R a function returns the value of its last line (or whatever you give to `return()`). You can store the return value in a variable: `m <- mean(x)`.",
    example: `square <- function(x) {
  x^2
}
result <- square(4)
result`,
    related: ["function", "argument"],
  },
  {
    slug: "error",
    term: "Error",
    category: "programming",
    definition:
      "A message R prints when it cannot run your code, and then it stops. Errors start with `Error` and usually say where and why, e.g. \"object 'x' not found\". Errors are normal – read the message, fix the cause and run again.",
    example: `# try() shows the error message but lets the code continue
try(log("ten"))`,
    related: ["warning", "bug", "debugging", "syntax"],
  },
  {
    slug: "warning",
    term: "Warning",
    category: "programming",
    definition:
      "A message that says R *did* run your code but something may be wrong, such as \"NAs introduced by coercion\". Unlike an error, a warning does not stop the code – but you should read it, because the result may not be what you expect.",
    example: `as.numeric(c("1", "two", "3"))`,
    related: ["error", "coercion", "na"],
  },
  {
    slug: "bug",
    term: "Bug",
    category: "programming",
    definition:
      "A mistake in code that makes it do the wrong thing. Some bugs cause errors; the sneakier ones run silently and give wrong answers, like dividing by the wrong number. Finding and fixing bugs is called debugging.",
    example: `scores <- c(80, 90, 100)
sum(scores) / 2              # bug: should divide by 3
sum(scores) / length(scores) # fixed`,
    related: ["debugging", "error"],
  },
  {
    slug: "debugging",
    term: "Debugging",
    category: "programming",
    definition:
      "Finding and fixing bugs. Useful steps: read the error message, run the code line by line, print intermediate values with `print()` or `str()`, and check your assumptions (is the column really numeric?). Changing one thing at a time makes the cause easy to spot.",
    example: `prices <- c("10", "20", "30")
str(prices)   # chr - the prices are text, not numbers
sum(as.numeric(prices))`,
    related: ["bug", "error", "warning"],
  },
  {
    slug: "expression",
    term: "Expression",
    category: "programming",
    definition:
      "A piece of code that R can evaluate to produce a value, such as `2 + 3`, `mean(x)` or `x > 5`. Expressions can be combined into bigger expressions, and each line of a script is usually one expression.",
    example: `2 + 3 * 4
(2 + 3) * 4`,
    related: ["operator", "value", "code"],
  },
  {
    slug: "operator",
    term: "Operator",
    category: "programming",
    definition:
      "A symbol that performs an operation on values, such as `+` (add), `>` (greater than), `&` (and) or `<-` (assign). Operators are really shortcuts for functions: `2 + 3` does the same as `` `+`(2, 3) ``.",
    example: `10 - 4
10 > 4
TRUE & FALSE`,
    related: ["arithmetic-operator", "comparison-operator", "logical-operator", "assignment"],
  },
  {
    slug: "arithmetic-operator",
    term: "Arithmetic operator",
    category: "programming",
    definition:
      "A symbol for calculations: `+` add, `-` subtract, `*` multiply, `/` divide, `^` power, `%%` remainder after division and `%/%` whole-number division. R follows the usual order of operations (powers, then multiplication/division, then addition/subtraction); use parentheses to change it.",
    example: `7 + 2
7 / 2
7 %% 2
7 %/% 2
2^3`,
    related: ["operator", "expression", "numeric"],
  },
  {
    slug: "comparison-operator",
    term: "Comparison operator",
    category: "programming",
    definition:
      "A symbol that compares two values and answers `TRUE` or `FALSE`: `==` equal, `!=` not equal, `<` less than, `>` greater than, `<=` and `>=`. Note the double `==` for \"is equal to\" – a single `=` is used for arguments.",
    example: `5 == 5
5 != 3
c(1, 5, 10) > 4`,
    related: ["operator", "boolean", "logical-operator", "condition"],
  },
  {
    slug: "logical-operator",
    term: "Logical operator",
    category: "programming",
    definition:
      "A symbol that combines `TRUE`/`FALSE` values: `&` (and – both must be true), `|` (or – at least one true) and `!` (not – flips the value). They let you build conditions such as \"age over 18 **and** member\".",
    example: `age <- 25
member <- TRUE
age > 18 & member
age > 30 | member
!member`,
    related: ["boolean", "comparison-operator", "condition"],
  },
  {
    slug: "boolean",
    term: "Boolean",
    category: "programming",
    definition:
      "A value that can only be true or false, named after the mathematician George Boole. In R the boolean values are `TRUE` and `FALSE` (type \"logical\"). Every comparison produces booleans, and conditions in `if` statements must be a single boolean.",
    example: `is_raining <- FALSE
is_raining
3 > 2`,
    related: ["logical", "condition", "comparison-operator"],
  },
  {
    slug: "condition",
    term: "Condition",
    category: "programming",
    definition:
      "A question with a `TRUE`/`FALSE` answer that decides what the code does next, like `temperature > 30`. Conditions are used in `if` statements, `while` loops and for filtering data.",
    example: `temperature <- 32
temperature > 30`,
    related: ["if-statement", "boolean", "comparison-operator", "while-loop"],
  },
  {
    slug: "if-statement",
    term: "If statement",
    category: "programming",
    definition:
      "Code that runs only when a condition is `TRUE`: `if (condition) { ... }`. An optional `else { ... }` part runs otherwise. It is how a program makes decisions, like \"if it rains, take an umbrella; else wear sunglasses\".",
    example: `temperature <- 32
if (temperature > 30) {
  print("It's hot!")
} else {
  print("Nice weather.")
}`,
    related: ["condition", "boolean", "loop"],
  },
  {
    slug: "loop",
    term: "Loop",
    category: "programming",
    definition:
      "Code that repeats a block of instructions several times, so you do not have to copy it. R has `for` loops (repeat for each item) and `while` loops (repeat while a condition is true). In R, many loops can be replaced by vectorised code or the apply family.",
    related: ["for-loop", "while-loop", "iteration", "vectorization"],
  },
  {
    slug: "for-loop",
    term: "For loop",
    category: "programming",
    definition:
      "A loop that runs its body once for each element of a sequence: `for (item in items) { ... }`. On every round, the loop variable takes the next value. Use it when you know in advance what to loop over.",
    example: `for (fruit in c("apple", "kiwi", "plum")) {
  print(toupper(fruit))
}`,
    related: ["loop", "iteration", "while-loop", "index"],
  },
  {
    slug: "while-loop",
    term: "While loop",
    category: "programming",
    definition:
      "A loop that keeps running as long as its condition is `TRUE`: `while (condition) { ... }`. Something inside the loop must eventually make the condition `FALSE`, otherwise it runs forever (an infinite loop).",
    example: `savings <- 100
years <- 0
while (savings < 200) {
  savings <- savings * 1.1
  years <- years + 1
}
years`,
    related: ["loop", "for-loop", "condition"],
  },
  {
    slug: "iteration",
    term: "Iteration",
    category: "programming",
    definition:
      "One pass through the body of a loop – or, more generally, the act of repeating steps. A loop over five items performs five iterations.",
    example: `for (i in 1:3) {
  cat("Iteration", i, "\\n")
}`,
    related: ["loop", "for-loop", "apply-family"],
  },
  {
    slug: "index",
    term: "Index",
    category: "programming",
    definition:
      "The position number of an element. In R counting starts at **1**, so `x[1]` is the first element and `x[3]` the third. Indexes go in square brackets and can also be vectors, like `x[c(1, 3)]`, or negative to drop elements, like `x[-1]`.",
    example: `colors <- c("red", "green", "blue")
colors[1]
colors[c(1, 3)]
colors[-1]`,
    related: ["subsetting", "vector", "for-loop"],
  },
  {
    slug: "string",
    term: "String",
    category: "programming",
    definition:
      "A piece of text, written in quotes: `\"hello\"` or `'hello'`. A string can contain letters, digits, spaces and symbols – `\"42\"` is a string, not a number. In R strings have the data type \"character\".",
    example: `greeting <- "Hello, R!"
nchar(greeting)
toupper(greeting)`,
    related: ["character", "data-type", "regular-expression"],
  },
  {
    slug: "data-type",
    term: "Data type",
    category: "programming",
    definition:
      "The kind of value something is, which decides what you can do with it. R's basic types are numeric (decimal numbers), integer (whole numbers), character (text) and logical (`TRUE`/`FALSE`). You cannot add text, for example, so knowing the type explains many errors. Check it with `class()`.",
    example: `class(3.5)
class(3L)
class("3.5")
class(TRUE)`,
    related: ["numeric", "integer", "character", "logical", "type-conversion"],
  },
  {
    slug: "type-conversion",
    term: "Type conversion",
    category: "programming",
    definition:
      "Changing a value from one data type to another on purpose, using functions such as `as.numeric()`, `as.character()`, `as.integer()` and `as.logical()`. It is common after importing data, when numbers have been read as text.",
    example: `as.numeric("3.5")
as.character(42)
as.integer(7.9)`,
    related: ["coercion", "data-type", "numeric"],
  },
  {
    slug: "coercion",
    term: "Coercion",
    category: "programming",
    definition:
      "When R converts a value to another type *automatically*. For example, a vector can hold only one type, so `c(1, \"a\")` coerces the 1 into the text `\"1\"`. Coercion that fails produces `NA` with the warning \"NAs introduced by coercion\".",
    example: `c(1, "a", TRUE)
TRUE + TRUE`,
    related: ["type-conversion", "data-type", "vector", "warning"],
  },
  {
    slug: "environment",
    term: "Environment",
    category: "programming",
    definition:
      "A place where R keeps variables, like a room with labelled boxes. The global environment holds the variables you create at the top level; every function call gets its own small temporary environment. When you use a name, R looks in the current environment first, then in the ones around it.",
    example: `x <- 10
f <- function() {
  x <- 99   # a different x, inside the function's environment
  x
}
f()
x`,
    related: ["scope", "workspace", "object"],
  },
  {
    slug: "scope",
    term: "Scope",
    category: "programming",
    definition:
      "The part of a program where a variable can be seen and used. Variables created inside a function are *local* – they exist only while the function runs and do not change variables with the same name outside it.",
    example: `total <- 0
add_ten <- function() {
  total <- 10
  total
}
add_ten()
total`,
    related: ["environment", "function", "variable"],
  },
  {
    slug: "working-directory",
    term: "Working directory",
    category: "programming",
    definition:
      "The folder R treats as \"here\". File paths that do not start from the top of the drive are looked up relative to it, so `read.csv(\"data/students.csv\")` means \"the `data` folder inside the working directory\". `getwd()` shows it; in RStudio, projects set it for you.",
    example: `file.exists("data/students.csv")`,
    related: ["file-path", "csv"],
  },
  {
    slug: "file-path",
    term: "File path",
    category: "programming",
    definition:
      "The address of a file on a computer, such as `\"data/students.csv\"`. A *relative* path starts from the working directory; an *absolute* path starts from the top (`\"C:/Users/...\"` or `\"/home/...\"`). In R always use forward slashes `/`, even on Windows.",
    example: `list.files("data")`,
    related: ["working-directory", "csv"],
  },
  {
    slug: "anonymous-function",
    term: "Anonymous function",
    category: "programming",
    definition:
      "A small function without a name, written right where it is used – often inside `sapply()` or `lapply()`. You write it as `function(x) x * 2`, or with R's shortcut `\\(x) x * 2`.",
    example: `sapply(c(1, 2, 3), function(x) x * 10)
sapply(c(1, 2, 3), \\(x) x^2)`,
    related: ["function", "apply-family"],
  },
  {
    slug: "regular-expression",
    term: "Regular expression",
    category: "programming",
    definition:
      "A mini-language for describing text patterns, used by `grepl()`, `sub()`, `gsub()` and `strsplit()`. For example `^A` means \"starts with A\", `[0-9]` means \"any digit\" and `.` means \"any character\". Special characters like `.` and `$` must be escaped (or use `fixed = TRUE`) when you mean them literally. Often shortened to *regex*.",
    example: `codes <- c("A12", "B7", "A3")
grepl("^A", codes)
gsub("[0-9]", "", codes)`,
    related: ["string", "case-sensitive"],
  },
  {
    slug: "case-sensitive",
    term: "Case-sensitive",
    category: "programming",
    definition:
      "Upper- and lower-case letters count as different. R is case-sensitive: `Score` and `score` are two different variables, `Mean()` does not exist (it is `mean()`), and `\"Yes\" == \"yes\"` is `FALSE`.",
    example: `"Yes" == "yes"
tolower("Yes") == "yes"`,
    related: ["string", "variable", "error"],
  },
  {
    slug: "reserved-word",
    term: "Reserved word",
    category: "programming",
    definition:
      "A word that has a fixed meaning in R and cannot be used as a variable name, such as `if`, `else`, `for`, `while`, `function`, `TRUE`, `FALSE`, `NULL` and `NA`. Trying to assign to one, like `if <- 5`, gives an error, so pick a different name such as `if_value`.",
    example: `# if <- 5 would be a syntax error; choose another name
if_value <- 5
if_value`,
    related: ["variable", "syntax"],
  },

  /* ---------------------------------------------------------------- */
  /* R                                                                */
  /* ---------------------------------------------------------------- */
  {
    slug: "r",
    term: "R",
    category: "r",
    definition:
      "A free programming language made for data analysis, statistics and graphics. It runs on every major operating system, and thousands of free add-on packages extend it. R is widely used in science, health, business and government.",
    example: `summary(c(3, 7, 8, 12))`,
    related: ["rstudio", "webr", "package", "programming-language"],
  },
  {
    slug: "rstudio",
    term: "RStudio",
    category: "r",
    definition:
      "A popular free program for writing R code. It is the *dashboard* while R is the *engine*: RStudio shows panes for your script, the console, your variables and plots, but the calculations are done by R underneath. You need R installed to use it.",
    related: ["r", "console", "script"],
  },
  {
    slug: "webr",
    term: "webR",
    category: "r",
    definition:
      "A version of R that runs inside a web browser (compiled to WebAssembly). R Academy uses webR, so the code you run on this site is real R running on your own computer – nothing to install.",
    related: ["r", "console"],
  },
  {
    slug: "package",
    term: "Package",
    category: "r",
    definition:
      "A bundle of extra functions (and sometimes data) that someone has shared, like an app for your phone. You install a package once (`install.packages(\"dplyr\")` on your own computer; automatic on R Academy) and load it with `library(dplyr)` in each session.",
    example: `library(dplyr)
mtcars |> filter(mpg > 30) |> select(mpg, cyl)`,
    related: ["library", "cran", "tidyverse"],
  },
  {
    slug: "library",
    term: "Library",
    category: "r",
    definition:
      "Two related meanings: the `library()` function, which loads an installed package so its functions become available, and the folder on your computer where packages are installed. \"Load the library\" usually means running `library(packagename)`.",
    example: `library(stats)
median(c(4, 1, 9))`,
    related: ["package", "cran"],
  },
  {
    slug: "cran",
    term: "CRAN",
    category: "r",
    definition:
      "The Comprehensive R Archive Network: the official, free online store for R packages, with more than 20,000 of them. `install.packages()` downloads packages from CRAN.",
    related: ["package", "library"],
  },
  {
    slug: "workspace",
    term: "Workspace",
    category: "r",
    definition:
      "All the objects (variables, data, functions) you have created in your current R session – the contents of the global environment. `ls()` lists them and `rm()` removes them.",
    example: `a <- 1
b <- "two"
ls()`,
    related: ["environment", "object"],
  },
  {
    slug: "numeric",
    term: "Numeric",
    category: "r",
    definition:
      "R's data type for numbers, including decimals, such as `3.14` or `-2`. Internally they are stored as \"double\" (double-precision numbers). Most measurements – heights, prices, temperatures – are numeric.",
    example: `x <- 3.14
class(x)
is.numeric(x)`,
    related: ["integer", "data-type", "numeric-variable"],
  },
  {
    slug: "integer",
    term: "Integer",
    category: "r",
    definition:
      "A whole number without a decimal part. In R you create one with an `L` suffix (`5L`), and sequences like `1:10` are integers too. For most work you can treat integers and other numbers the same way.",
    example: `class(5L)
class(1:3)
class(5)`,
    related: ["numeric", "data-type"],
  },
  {
    slug: "character",
    term: "Character",
    category: "r",
    definition:
      "R's data type for text (strings), such as `\"Alice\"` or `\"2024-03-15\"`. Anything inside quotes is character, even `\"42\"`. Names, categories and IDs are usually character data.",
    example: `name <- "Alice"
class(name)
class("42")`,
    related: ["string", "data-type", "factor"],
  },
  {
    slug: "logical",
    term: "Logical",
    category: "r",
    definition:
      "R's data type for `TRUE` and `FALSE` (and `NA` for unknown). Comparisons create logical values. Because `TRUE` counts as 1 and `FALSE` as 0, `sum()` of a logical vector counts the `TRUE`s and `mean()` gives their proportion.",
    example: `passed <- c(TRUE, FALSE, TRUE, TRUE)
class(passed)
sum(passed)
mean(passed)`,
    related: ["boolean", "data-type", "comparison-operator"],
  },
  {
    slug: "vector",
    term: "Vector",
    category: "r",
    definition:
      "R's most basic data structure: an ordered row of values that all have the same type, like a row of numbered boxes. You create one with `c()`, e.g. `c(80, 90, 100)`. Even a single number is a vector of length 1, which is why R prints `[1]` before results.",
    example: `scores <- c(80, 90, 100)
length(scores)
scores[2]`,
    related: ["index", "vectorization", "recycling", "list"],
  },
  {
    slug: "vectorization",
    term: "Vectorization",
    category: "r",
    definition:
      "R's ability to apply an operation to every element of a vector at once, without writing a loop. `prices * 1.2` multiplies every price; `scores > 50` checks every score. Vectorised code is shorter and faster than loops.",
    example: `prices <- c(10, 20, 30)
prices * 1.2
prices > 15`,
    related: ["vector", "recycling", "loop"],
  },
  {
    slug: "recycling",
    term: "Recycling",
    category: "r",
    definition:
      "What R does when it combines two vectors of different lengths: the shorter one is repeated to match the longer one. `c(1, 2, 3, 4) + c(10, 20)` adds 10, 20, 10, 20. Adding a single number to a vector is recycling too. If the lengths do not fit evenly, R warns you.",
    example: `c(1, 2, 3, 4) + c(10, 20)
c(1, 2, 3) * 2`,
    related: ["vectorization", "vector"],
  },
  {
    slug: "list",
    term: "List",
    category: "r",
    definition:
      "A container that can hold elements of different types and sizes – a number, a text, a whole vector, even another list – like a bag with labelled compartments. Get an element with `[[ ]]` or `$`. Data frames are special lists whose elements are columns of equal length.",
    example: `person <- list(name = "Ada", age = 36, skills = c("R", "maths"))
person$name
person[["skills"]]`,
    related: ["vector", "data-frame", "dollar-operator"],
  },
  {
    slug: "matrix",
    term: "Matrix",
    category: "r",
    definition:
      "A two-dimensional grid of values (rows and columns) that all have the same type. You pick a cell with `m[row, column]`. Matrices are used for numeric tables and in maths; for real datasets with mixed column types use a data frame.",
    example: `m <- matrix(1:6, nrow = 2)
m
m[2, 3]`,
    related: ["data-frame", "vector", "index"],
  },
  {
    slug: "factor",
    term: "Factor",
    category: "r",
    definition:
      "R's type for categorical data: values that belong to a fixed set of categories called levels, such as \"small\", \"medium\", \"large\". Factors remember the order of the categories, which controls tables and plots. Create one with `factor()`.",
    example: `sizes <- factor(c("small", "large", "small"),
                levels = c("small", "medium", "large"))
sizes
table(sizes)`,
    related: ["level", "categorical-variable", "character"],
  },
  {
    slug: "level",
    term: "Level",
    category: "r",
    definition:
      "One of the possible categories of a factor. A factor of T-shirt sizes might have the levels \"S\", \"M\" and \"L\". `levels()` lists them in order; a level can exist even if no value currently uses it.",
    example: `sizes <- factor(c("M", "S", "M"), levels = c("S", "M", "L"))
levels(sizes)
table(sizes)`,
    related: ["factor", "categorical-variable"],
  },
  {
    slug: "data-frame",
    term: "Data frame",
    category: "r",
    definition:
      "R's table for data: rows are observations and columns are variables, like a spreadsheet. Each column is a vector, so all values in one column share a type, but different columns can have different types. `read.csv()` gives you a data frame.",
    example: `people <- data.frame(name = c("Ana", "Ben"), age = c(28, 35))
people
nrow(people)`,
    related: ["tibble", "row", "column", "observation", "dataset"],
  },
  {
    slug: "tibble",
    term: "Tibble",
    category: "r",
    definition:
      "The tidyverse's modern version of a data frame. It works like a data frame but prints more neatly (showing only the first rows and each column's type) and is stricter about mistakes. Some tidyverse functions, such as a grouped `summarise()`, return tibbles; `as.data.frame()` turns one back into a plain data frame.",
    related: ["data-frame", "tidyverse", "dplyr"],
  },
  {
    slug: "na",
    term: "NA",
    category: "r",
    definition:
      "R's marker for a missing value – \"Not Available\". Any calculation involving `NA` usually gives `NA`, because R cannot know the answer. Use `is.na()` to find missing values and `na.rm = TRUE` to ignore them in functions like `mean()`.",
    example: `ages <- c(23, NA, 41)
mean(ages)
mean(ages, na.rm = TRUE)
is.na(ages)`,
    related: ["missing-data", "null", "nan"],
  },
  {
    slug: "null",
    term: "NULL",
    category: "r",
    definition:
      "R's representation of \"nothing at all\" – not a missing value but the absence of any object. A function that returns nothing returns `NULL`, and assigning `NULL` to a data frame column removes the column. `length(NULL)` is 0.",
    example: `length(NULL)
df <- data.frame(a = 1:2, b = 3:4)
df$b <- NULL
df`,
    related: ["na", "object"],
  },
  {
    slug: "nan",
    term: "NaN",
    category: "r",
    definition:
      "\"Not a Number\": the result of a calculation that has no sensible numeric answer, such as `0 / 0` or `sqrt(-1)`. R treats `NaN` as a kind of missing value, so `is.na(NaN)` is `TRUE`.",
    example: `0 / 0
is.na(0 / 0)`,
    related: ["na", "inf"],
  },
  {
    slug: "inf",
    term: "Inf",
    category: "r",
    definition:
      "Infinity. R gives `Inf` (or `-Inf`) when a result is too large to represent or when you divide a non-zero number by zero, for example `1 / 0`. `is.finite()` checks for ordinary numbers.",
    example: `1 / 0
-1 / 0
log(0)`,
    related: ["nan", "na", "numeric"],
  },
  {
    slug: "subsetting",
    term: "Subsetting",
    category: "r",
    definition:
      "Selecting part of an object: some elements of a vector, some rows or columns of a data frame. R uses square brackets – `x[2]`, `x[x > 5]`, `df[1:3, ]`, `df[, \"age\"]` – and also `$`, `[[ ]]`, `subset()` and dplyr's `filter()`/`select()`.",
    example: `x <- c(4, 8, 15, 16)
x[x > 10]
mtcars[1:2, c("mpg", "hp")]`,
    related: ["index", "dollar-operator", "dplyr"],
  },
  {
    slug: "dollar-operator",
    term: "Dollar operator ($)",
    category: "r",
    definition:
      "The `$` sign picks one column of a data frame (or one element of a list) by name: `students$math`. The result is a plain vector you can pass to functions like `mean()`. Names after `$` are case-sensitive.",
    example: `mean(mtcars$mpg)
person <- list(name = "Ada", age = 36)
person$age`,
    related: ["data-frame", "list", "subsetting"],
  },
  {
    slug: "pipe",
    term: "Pipe",
    category: "r",
    definition:
      "The operator `|>` (or the tidyverse's `%>%`) passes the result on its left into the function on its right, as the first argument. `data |> filter(...) |> summarise(...)` reads like a recipe: take the data, *then* filter, *then* summarise – instead of nesting functions inside each other.",
    example: `c(4, 9, 16) |> sqrt() |> sum()`,
    related: ["dplyr", "tidyverse", "function"],
  },
  {
    slug: "tidyverse",
    term: "Tidyverse",
    category: "r",
    definition:
      "A family of R packages designed to work together with a consistent style for data science, including dplyr (data manipulation), tidyr (reshaping), ggplot2 (graphics), readr, stringr and lubridate. They all expect tidy data.",
    related: ["dplyr", "tidyr", "ggplot2", "tidy-data", "pipe"],
  },
  {
    slug: "dplyr",
    term: "dplyr",
    category: "r",
    definition:
      "A tidyverse package for manipulating data frames with a small set of clearly named verbs: `filter()` rows, `select()` columns, `mutate()` new columns, `arrange()` to sort, `summarise()` with `group_by()` for summaries. Verbs are chained with the pipe.",
    example: `library(dplyr)
mtcars |>
  filter(cyl == 4) |>
  summarise(avg_mpg = mean(mpg))`,
    related: ["tidyverse", "pipe", "tidyr", "join", "grouping"],
  },
  {
    slug: "tidyr",
    term: "tidyr",
    category: "r",
    definition:
      "A tidyverse package for reshaping and tidying data. `pivot_longer()` and `pivot_wider()` switch between long and wide format, `separate()` splits one column into several, and `drop_na()`/`replace_na()` handle missing values.",
    example: `library(tidyr)
scores <- data.frame(name = c("Ana", "Ben"), math = c(90, 75), art = c(80, 95))
as.data.frame(pivot_longer(scores, c(math, art), names_to = "subject"))`,
    related: ["tidyverse", "tidy-data", "long-format", "wide-format"],
  },
  {
    slug: "ggplot2",
    term: "ggplot2",
    category: "r",
    definition:
      "The tidyverse package for graphics, based on the \"grammar of graphics\" (the \"gg\" in its name). You build a chart in layers – data, aesthetics (which column goes where), geoms (points, bars, lines), labels and a theme – added together with `+`.",
    example: `library(ggplot2)
ggplot(mtcars, aes(x = wt, y = mpg)) +
  geom_point()`,
    related: ["aesthetic", "geom", "facet", "tidyverse"],
  },
  {
    slug: "aesthetic",
    term: "Aesthetic",
    category: "r",
    definition:
      "In ggplot2, a visual property that can show data: x position, y position, colour, fill, size, shape. Inside `aes()` you *map* columns to aesthetics, e.g. `aes(x = wt, y = mpg, colour = factor(cyl))`.",
    example: `library(ggplot2)
ggplot(mtcars, aes(x = wt, y = mpg, colour = factor(cyl))) +
  geom_point()`,
    related: ["ggplot2", "geom"],
  },
  {
    slug: "geom",
    term: "Geom",
    category: "r",
    definition:
      "Short for *geometric object*: the shape ggplot2 uses to draw the data – `geom_point()` for points, `geom_line()` for lines, `geom_col()` and `geom_bar()` for bars, `geom_histogram()`, `geom_boxplot()` and more. You add one or more geoms to a plot with `+`.",
    example: `library(ggplot2)
ggplot(mtcars, aes(x = factor(cyl), y = mpg)) +
  geom_boxplot()`,
    related: ["ggplot2", "aesthetic"],
  },
  {
    slug: "facet",
    term: "Facet",
    category: "r",
    definition:
      "In ggplot2, one of several small panels showing the same plot for different groups, created with `facet_wrap(~ group)`. Facets make it easy to compare groups side by side.",
    example: `library(ggplot2)
ggplot(mtcars, aes(x = wt, y = mpg)) +
  geom_point() +
  facet_wrap(~ am)`,
    related: ["ggplot2", "grouping"],
  },
  {
    slug: "apply-family",
    term: "Apply family",
    category: "r",
    definition:
      "A group of R functions – `apply()`, `lapply()`, `sapply()`, `vapply()`, `tapply()`, `mapply()` – that apply a function to each element, row, column or group. They replace many `for` loops with one line: you say *what* to do to each piece, and R does the repeating.",
    example: `sapply(c(1, 4, 9), sqrt)
tapply(mtcars$mpg, mtcars$cyl, mean)`,
    related: ["anonymous-function", "loop", "iteration", "vectorization"],
  },
  {
    slug: "date",
    term: "Date",
    category: "r",
    definition:
      "R's type for calendar dates, created from text with `as.Date(\"2024-03-15\")`. Real dates sort correctly, can be subtracted to get the number of days between them, and can be formatted or split into parts such as weekday or month.",
    example: `d <- as.Date("2024-03-15")
d + 7
weekdays(d)
as.Date("2024-12-25") - d`,
    related: ["data-type", "character"],
  },
  {
    slug: "seed",
    term: "Random seed",
    category: "r",
    definition:
      "The starting number of R's random number generator. Setting it with `set.seed(42)` before any random step makes your \"random\" results the same every time you run the code, so others can reproduce them.",
    example: `set.seed(42)
sample(1:100, 3)`,
    related: ["random-sample", "probability"],
  },
];
