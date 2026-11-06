import type { Exercise } from "../../types";

export const module08Exercises: Exercise[] = [
  {
    id: "m8-price-with-tax",
    title: "A function with a default tax rate",
    difficulty: "easy",
    module: 8,
    lesson: "advanced-functions-and-scope",
    concepts: ["default-arguments", "named-arguments"],
    prompt: `Write a function called \`price_with_tax\` with two arguments:

* \`price\` – the price before tax (no default),
* \`rate\` – the tax rate, with a **default of 0.2** (20 %).

It should return \`price * (1 + rate)\`, **rounded to 2 decimal places**.

Then use it to create two variables:

* \`book\` – the price of a 15-dollar book with the default rate,
* \`food\` – the price of 15 dollars of food with a reduced rate of 0.05 (use a **named** argument).`,
    starterCode: `# Write price_with_tax() here: a price argument and a rate argument with default 0.2


# Then use it:
# book <- ...
# food <- ...
`,
    expected: "`price_with_tax(100)` returns `120`, `price_with_tax(100, rate = 0.1)` returns `110`, `book` is `18` and `food` is `15.75`.",
    hints: [
      "Start with `price_with_tax <- function(price, rate = 0.2) { ... }`.",
      "Inside the body, compute `price * (1 + rate)` and wrap it in `round(..., 2)`.",
      "Call it as `book <- price_with_tax(15)` and `food <- price_with_tax(15, rate = 0.05)`.",
    ],
    solution: `price_with_tax <- function(price, rate = 0.2) {
  round(price * (1 + rate), 2)
}

book <- price_with_tax(15)
food <- price_with_tax(15, rate = 0.05)
book
food`,
    explanation: `* \`function(price, rate = 0.2)\` declares two parameters; \`rate = 0.2\` is the default used whenever the caller leaves \`rate\` out.
* \`round(price * (1 + rate), 2)\` adds the tax and rounds to cents. As the last expression of the body, it is the return value.
* \`price_with_tax(15)\` uses the default: 15 × 1.2 = 18.
* \`price_with_tax(15, rate = 0.05)\` overrides the default by name: 15 × 1.05 = 15.75. Naming the argument makes it obvious what 0.05 means.`,
    tests: [
      {
        name: "`price_with_tax` is a function",
        check: `.defined("price_with_tax") && is.function(price_with_tax)`,
        failMessage: "Create a function with `price_with_tax <- function(price, rate = 0.2) { ... }`.",
      },
      {
        name: "The default rate is 20 %",
        check: `isTRUE(all.equal(price_with_tax(100), 120))`,
        failMessage: "`price_with_tax(100)` should return 120. Did you give `rate` the default value 0.2?",
      },
      {
        name: "A different rate can be passed by name",
        check: `isTRUE(all.equal(price_with_tax(100, rate = 0.1), 110))`,
        failMessage: "`price_with_tax(100, rate = 0.1)` should return 110. Is the second argument called `rate`?",
      },
      {
        name: "The result is rounded to 2 decimals",
        check: `isTRUE(all.equal(price_with_tax(9.99), 11.99))`,
        failMessage: "9.99 × 1.2 is 11.988, which should be rounded to 11.99. Use `round(..., 2)`.",
      },
      {
        name: "`book` and `food` have the right values",
        check: `isTRUE(all.equal(book, 18)) && isTRUE(all.equal(food, 15.75))`,
        failMessage: "`book` should be `price_with_tax(15)` (18) and `food` should be `price_with_tax(15, rate = 0.05)` (15.75).",
      },
    ],
  },
  {
    id: "m8-describe-scores",
    title: "A summary function that returns a list",
    difficulty: "medium",
    module: 8,
    lesson: "advanced-functions-and-scope",
    concepts: ["return-list", "input-validation"],
    datasets: ["students"],
    prompt: `Write a function \`describe_scores(x)\` that:

1. **stops with an error** if \`x\` is not numeric (use \`stop()\` or \`stopifnot()\`), and
2. returns a **named list** with four elements:
   * \`mean\`, \`min\` and \`max\` of \`x\`, ignoring missing values,
   * \`n_missing\` – how many values of \`x\` are \`NA\`.

Then use it on the science scores of \`students.csv\` and store the result in \`science_summary\`.`,
    starterCode: `students <- read.csv("data/students.csv")

describe_scores <- function(x) {
  # 1. stop with a clear message if x is not numeric

  # 2. return a named list: mean, min, max (ignoring NA) and n_missing

}

science_summary <- describe_scores(students$science)
science_summary
`,
    expected: "`science_summary$mean` is about 74.3, `science_summary$n_missing` is 3, and `describe_scores(c(\"a\", \"b\"))` stops with an error.",
    hints: [
      "Begin the body with a check such as `if (!is.numeric(x)) stop(\"x must be numeric\")`.",
      "Build the result with `list(mean = ..., min = ..., max = ..., n_missing = ...)`, using `na.rm = TRUE` in `mean()`, `min()` and `max()`.",
      "`n_missing = sum(is.na(x))` counts the missing values, because each `TRUE` counts as 1.",
    ],
    solution: `students <- read.csv("data/students.csv")

describe_scores <- function(x) {
  if (!is.numeric(x)) {
    stop("x must be numeric")
  }
  list(
    mean = mean(x, na.rm = TRUE),
    min = min(x, na.rm = TRUE),
    max = max(x, na.rm = TRUE),
    n_missing = sum(is.na(x))
  )
}

science_summary <- describe_scores(students$science)
science_summary`,
    explanation: `* The \`if (!is.numeric(x)) stop(...)\` guard runs first, so text input never reaches the calculations – the user gets a clear message instead.
* \`list(...)\` packs four results into one object, because a function can only return one thing. Naming the elements lets the caller write \`science_summary$mean\`.
* \`na.rm = TRUE\` makes \`mean()\`, \`min()\` and \`max()\` skip the three missing science scores.
* \`sum(is.na(x))\` counts the \`TRUE\`s returned by \`is.na()\` – the number of missing values.`,
    tests: [
      {
        name: "`describe_scores` is a function",
        check: `.defined("describe_scores") && is.function(describe_scores)`,
        failMessage: "Keep the line `describe_scores <- function(x) { ... }`.",
      },
      {
        name: "It returns a list with mean, min, max and n_missing",
        check: `local({ r <- describe_scores(c(2, NA, 4, 9)); is.list(r) && all(c("mean", "min", "max", "n_missing") %in% names(r)) })`,
        failMessage: "Return `list(mean = ..., min = ..., max = ..., n_missing = ...)` – the names must be exactly these.",
      },
      {
        name: "The values are correct and missing values are ignored",
        check: `local({ r <- describe_scores(c(2, NA, 4, 9)); isTRUE(all.equal(r$mean, 5)) && r$min == 2 && r$max == 9 && r$n_missing == 1 })`,
        failMessage: "For `c(2, NA, 4, 9)` the mean should be 5, min 2, max 9 and n_missing 1. Did you use `na.rm = TRUE`?",
      },
      {
        name: "Text input stops with an error",
        check: `inherits(tryCatch(describe_scores(c("a", "b")), error = function(e) e), "error")`,
        failMessage: "`describe_scores(c(\"a\", \"b\"))` should stop. Add `if (!is.numeric(x)) stop(\"...\")` at the start of the function.",
      },
      {
        name: "`science_summary` describes the science scores",
        check: `isTRUE(all.equal(science_summary$mean, mean(read.csv("data/students.csv")$science, na.rm = TRUE))) && science_summary$n_missing == 3`,
        failMessage: "Store `describe_scores(students$science)` in `science_summary`. Its mean should be about 74.3 with 3 missing values.",
      },
    ],
  },
  {
    id: "m8-sapply-columns",
    title: "Column summaries with sapply()",
    difficulty: "easy",
    module: 8,
    lesson: "apply-family-and-data-transformations",
    concepts: ["lapply-sapply", "anonymous-functions"],
    datasets: ["mtcars"],
    prompt: `The data frame \`cars\` contains three columns of the built-in \`mtcars\` data: \`mpg\`, \`hp\` and \`wt\`.

1. Use \`sapply()\` to compute the **median** of each column. Store the result in \`medians\`.
2. Use \`sapply()\` with an **anonymous function** to compute the spread (maximum minus minimum) of each column. Store it in \`spreads\`.`,
    starterCode: `cars <- mtcars[, c("mpg", "hp", "wt")]

# 1. medians: the median of each column, using sapply()


# 2. spreads: max minus min of each column, using sapply() and an anonymous function

`,
    expected: "`medians` is a named vector with `mpg` 19.2, `hp` 123 and `wt` 3.325; `spreads` has `mpg` 23.5, `hp` 283 and `wt` 3.911.",
    hints: [
      "`sapply(cars, median)` applies `median` to every column.",
      "For the spread you need your own function: `function(x) max(x) - min(x)` (or `\\(x) max(x) - min(x)`).",
      "`spreads <- sapply(cars, function(x) max(x) - min(x))`",
    ],
    solution: String.raw`cars <- mtcars[, c("mpg", "hp", "wt")]

medians <- sapply(cars, median)
spreads <- sapply(cars, \(x) max(x) - min(x))
medians
spreads`,
    explanation: `* A data frame is a list of columns, so \`sapply(cars, median)\` calls \`median()\` once per column and simplifies the three answers into a named vector.
* There is no built-in "spread" function, so you write one on the spot: \`\\(x) max(x) - min(x)\` is an anonymous function (\`\\(x)\` is short for \`function(x)\`). \`sapply()\` calls it with each column as \`x\`.
* No loop and no empty result vector were needed – \`sapply()\` collects the results and keeps the column names.`,
    tests: [
      {
        name: "`medians` holds the median of each column",
        check: `isTRUE(all.equal(unname(medians), unname(sapply(mtcars[, c("mpg", "hp", "wt")], median))))`,
        failMessage: "`medians` should contain three numbers: the medians of mpg, hp and wt. Try `sapply(cars, median)`.",
      },
      {
        name: "`spreads` holds max minus min of each column",
        check: `isTRUE(all.equal(unname(spreads), c(23.5, 283, 3.911)))`,
        failMessage: "`spreads` should be 23.5, 283 and 3.911. Use `sapply(cars, function(x) max(x) - min(x))`.",
      },
      {
        name: "An apply-family function was used",
        check: String.raw`grepl("apply(", gsub("#[^\n]*", "", .code), fixed = TRUE)`,
        failMessage: "This exercise is about the apply family – please use `sapply()` (or `vapply()`) instead of computing each column separately.",
      },
    ],
  },
  {
    id: "m8-grade-bands",
    title: "Reading bands with cut() and aggregate()",
    difficulty: "medium",
    module: 8,
    lesson: "apply-family-and-data-transformations",
    concepts: ["cut-ifelse", "aggregate"],
    datasets: ["students"],
    prompt: `Using \`students.csv\`:

1. Add a column \`band\` to \`students\` that puts each **reading** score into a band with \`cut()\`:
   * 0–69 → \`"low"\`, 70–84 → \`"medium"\`, 85–100 → \`"high"\`.
2. Create \`band_counts\`: a table of how many students are in each band.
3. Create \`band_hours\`: a **data frame** with the mean \`study_hours\` of each band, made with \`aggregate()\`.`,
    starterCode: `students <- read.csv("data/students.csv")

# 1. Add a column 'band' with cut(): 0-69 "low", 70-84 "medium", 85-100 "high"


# 2. band_counts: how many students are in each band


# 3. band_hours: mean study_hours per band, as a data frame (use aggregate)

`,
    expected: "`band_counts` shows 16 low, 22 medium and 22 high students, and `band_hours` has one row per band with its mean study hours.",
    hints: [
      "`cut()` needs the boundaries `breaks = c(0, 69, 84, 100)` and the three `labels`.",
      "`band_counts <- table(students$band)`.",
      "`band_hours <- aggregate(study_hours ~ band, data = students, FUN = mean)`.",
    ],
    solution: `students <- read.csv("data/students.csv")

students$band <- cut(
  students$reading,
  breaks = c(0, 69, 84, 100),
  labels = c("low", "medium", "high")
)

band_counts <- table(students$band)
band_hours <- aggregate(study_hours ~ band, data = students, FUN = mean)

band_counts
band_hours`,
    explanation: `* \`breaks = c(0, 69, 84, 100)\` creates the intervals (0, 69], (69, 84] and (84, 100] – i.e. up to 69, 70 to 84 and 85 to 100 for whole-number scores. \`labels\` names them.
* \`cut()\` returns a factor, so \`table()\` lists the bands in their natural order.
* \`aggregate(study_hours ~ band, data = students, FUN = mean)\` reads "study hours, grouped by band, averaged" and returns a data frame with the columns \`band\` and \`study_hours\`.
* Comparing the rows shows that students in higher reading bands study more hours on average.`,
    tests: [
      {
        name: "`students` has a correct `band` column",
        check: `"band" %in% names(students) && identical(as.character(students$band), as.character(cut(students$reading, c(0, 69, 84, 100), labels = c("low", "medium", "high"))))`,
        failMessage: "Create `students$band` with `cut(students$reading, breaks = c(0, 69, 84, 100), labels = c(\"low\", \"medium\", \"high\"))`.",
      },
      {
        name: "`band_counts` counts the students per band",
        check: `identical(as.vector(band_counts[c("low", "medium", "high")]), c(16L, 22L, 22L))`,
        failMessage: "`band_counts` should be `table(students$band)`: 16 low, 22 medium, 22 high.",
      },
      {
        name: "`band_hours` is a data frame of mean study hours per band",
        check: `local({ s <- read.csv("data/students.csv"); b <- cut(s$reading, c(0, 69, 84, 100), labels = c("low", "medium", "high")); want <- as.vector(tapply(s$study_hours, b, mean)); is.data.frame(band_hours) && nrow(band_hours) == 3 && isTRUE(all.equal(band_hours$study_hours[match(c("low", "medium", "high"), as.character(band_hours$band))], want)) })`,
        failMessage: "Use `aggregate(study_hours ~ band, data = students, FUN = mean)` – it returns a data frame with the columns `band` and `study_hours`.",
      },
    ],
  },
  {
    id: "m8-weather-dates",
    title: "Questions about a year of weather",
    difficulty: "medium",
    module: 8,
    lesson: "dates-strings-and-regex",
    concepts: ["dates", "date-arithmetic"],
    datasets: ["weather"],
    prompt: `Answer three questions about \`weather.csv\` (one row per day of 2023):

1. Convert the \`date\` column of \`weather\` to real dates.
2. \`rainy_july\`: on how many days in **July** did it rain (\`rain_mm\` greater than 0)?
3. \`wettest_month\`: the **name** of the month with the highest *total* rainfall (for example \`"March"\`). Use \`months()\` and \`tapply()\`.
4. \`days_until_christmas\`: how many days lie between the **hottest day** of the year (highest \`temp_max\`) and 25 December 2023? Store it as a plain number.`,
    starterCode: `weather <- read.csv("data/weather.csv")

# 1. Convert the date column to Date


# 2. rainy_july: number of July days with rain_mm > 0


# 3. wettest_month: name of the month with the highest total rain


# 4. days_until_christmas: days from the hottest day to 2023-12-25, as a number

`,
    expected: "`wettest_month` is `\"January\"` and `days_until_christmas` is `161` (the hottest day was 17 July).",
    hints: [
      "Step 1 is `weather$date <- as.Date(weather$date)`. For July, compare `months(weather$date) == \"July\"`.",
      "`tapply(weather$rain_mm, months(weather$date), sum)` gives the total rain per month; `names(which.max(...))` returns the name of the largest one.",
      "`hottest_day <- weather$date[which.max(weather$temp_max)]`, then `as.numeric(as.Date(\"2023-12-25\") - hottest_day)`.",
    ],
    solution: `weather <- read.csv("data/weather.csv")
weather$date <- as.Date(weather$date)

july <- weather[months(weather$date) == "July", ]
rainy_july <- sum(july$rain_mm > 0)

rain_per_month <- tapply(weather$rain_mm, months(weather$date), sum)
wettest_month <- names(which.max(rain_per_month))

hottest_day <- weather$date[which.max(weather$temp_max)]
days_until_christmas <- as.numeric(as.Date("2023-12-25") - hottest_day)

rainy_july
wettest_month
days_until_christmas`,
    explanation: `* \`as.Date()\` turns the text column into dates; after that, \`months()\` can name the month of every day.
* \`july$rain_mm > 0\` is \`TRUE\` on rainy days and \`sum()\` counts them.
* \`tapply(..., months(weather$date), sum)\` totals the rain per month name. \`which.max()\` finds the position of the largest total and \`names()\` returns its label.
* \`which.max(weather$temp_max)\` is the row of the hottest day; subtracting two dates gives a time difference in days, and \`as.numeric()\` turns it into a plain number.`,
    tests: [
      {
        name: "The date column is converted",
        check: `inherits(weather$date, "Date")`,
        failMessage: "Convert the column with `weather$date <- as.Date(weather$date)`.",
      },
      {
        name: "`rainy_july` is correct",
        check: `local({ w <- read.csv("data/weather.csv"); r <- w$rain_mm[substr(w$date, 6, 7) == "07"]; isTRUE(all.equal(as.numeric(rainy_july), sum(r > 0))) })`,
        failMessage: "Keep only July (`months(weather$date) == \"July\"`) and count the days with `rain_mm > 0` using `sum()`.",
      },
      {
        name: "`wettest_month` is the right month name",
        check: `identical(unname(wettest_month), "January")`,
        failMessage: "Total the rain per month with `tapply(weather$rain_mm, months(weather$date), sum)` and take `names(which.max(...))`.",
      },
      {
        name: "`days_until_christmas` is correct",
        check: `isTRUE(all.equal(as.numeric(days_until_christmas), 161))`,
        failMessage: "Find the hottest day with `which.max(weather$temp_max)` and subtract it from `as.Date(\"2023-12-25\")`.",
      },
    ],
  },
  {
    id: "m8-clean-codes",
    title: "Cleaning product codes with regular expressions",
    difficulty: "challenge",
    module: 8,
    lesson: "dates-strings-and-regex",
    concepts: ["string-functions", "regular-expressions"],
    prompt: `A shop exported its product codes with inconsistent spaces and capitals. A valid code is **two letters, a dash and one or more digits**, e.g. \`AB-102\`.

1. \`clean\`: the codes with spaces removed from both ends and converted to **upper case**.
2. \`valid\`: a logical vector, \`TRUE\` for codes in \`clean\` that match the valid pattern from start to end.
3. \`numbers\`: the digits of every code in \`clean\` as **numbers** (\`"CD-0450"\` → 450).
4. \`report\`: the sentence \`"4 of 5 codes are valid"\`, built with \`sprintf()\` from \`valid\` (do not type the numbers yourself).`,
    starterCode: `raw <- c(" ab-102 ", "AB-7", "cd-0450", "Cd-33 ", "xy_9")

# 1. clean: remove spaces at both ends and convert to upper case


# 2. valid: TRUE for two letters, a dash and one or more digits


# 3. numbers: the digits of each code as numbers


# 4. report: "4 of 5 codes are valid", built with sprintf()

`,
    expected: "`clean` is `\"AB-102\" \"AB-7\" \"CD-0450\" \"CD-33\" \"XY_9\"`, `valid` is `TRUE TRUE TRUE TRUE FALSE`, `numbers` is `102 7 450 33 9`.",
    hints: [
      "Combine two functions for step 1: `toupper(trimws(raw))`.",
      "The pattern needs anchors: `\"^[A-Z][A-Z]-[0-9]+$\"`. Use it with `grepl()`.",
      "For the digits: `regmatches(clean, regexpr(\"[0-9]+\", clean))` then `as.numeric()`. For the sentence: `sprintf(\"%d of %d codes are valid\", sum(valid), length(valid))`.",
    ],
    solution: `raw <- c(" ab-102 ", "AB-7", "cd-0450", "Cd-33 ", "xy_9")

clean <- toupper(trimws(raw))
valid <- grepl("^[A-Z][A-Z]-[0-9]+$", clean)
numbers <- as.numeric(regmatches(clean, regexpr("[0-9]+", clean)))
report <- sprintf("%d of %d codes are valid", sum(valid), length(valid))

clean
valid
numbers
report`,
    explanation: `* \`trimws()\` removes the stray spaces and \`toupper()\` makes the letters consistent, so \`" ab-102 "\` becomes \`"AB-102"\`.
* In \`"^[A-Z][A-Z]-[0-9]+$"\`, \`^\` and \`$\` force the whole string to match; \`[A-Z][A-Z]\` is two capital letters, \`-\` a dash and \`[0-9]+\` one or more digits. \`"XY_9"\` fails because it has an underscore.
* \`regexpr("[0-9]+", clean)\` finds the run of digits in each code and \`regmatches()\` extracts it as text; \`as.numeric()\` turns \`"0450"\` into 450.
* \`sum(valid)\` counts the \`TRUE\`s and \`length(valid)\` the codes; \`%d\` places each whole number into the sentence.`,
    tests: [
      {
        name: "`clean` is trimmed and in upper case",
        check: `identical(clean, c("AB-102", "AB-7", "CD-0450", "CD-33", "XY_9"))`,
        failMessage: "Use `toupper(trimws(raw))` so that every code has no outer spaces and only capital letters.",
      },
      {
        name: "`valid` marks the valid codes",
        check: `identical(as.vector(valid), c(TRUE, TRUE, TRUE, TRUE, FALSE))`,
        failMessage: "Use `grepl()` with an anchored pattern: `\"^[A-Z][A-Z]-[0-9]+$\"`. Only `\"XY_9\"` is invalid.",
      },
      {
        name: "`numbers` holds the digits as numbers",
        check: `is.numeric(numbers) && isTRUE(all.equal(unname(numbers), c(102, 7, 450, 33, 9)))`,
        failMessage: "Extract the digits (e.g. `regmatches(clean, regexpr(\"[0-9]+\", clean))`) and convert them with `as.numeric()`.",
      },
      {
        name: "`report` is the right sentence",
        check: `identical(report, "4 of 5 codes are valid")`,
        failMessage: "Build the text with `sprintf(\"%d of %d codes are valid\", sum(valid), length(valid))`.",
      },
    ],
  },
  {
    id: "m8-fix-the-bugs",
    title: "Debug a broken script",
    difficulty: "medium",
    module: 8,
    lesson: "packages-and-debugging",
    concepts: ["reading-errors", "debugging-checklist"],
    datasets: ["students"],
    prompt: `This script should compute the average math score of the students who study **at least 10 hours** per week and store a sentence about it in \`message_text\`. It contains **three bugs**.

Run it, read each error message, fix one bug at a time and run again until it works. Keep the variable names \`average_math\` and \`message_text\`.`,
    starterCode: `# Average math score of students who study at least 10 hours per week
students <- read.csv("data/student.csv")

hard_workers <- students[students$study_hours >= 10, ]
average_math <- mean(hard_workers$Math)
message_text <- paste("Average math score:", round(average_math, 1)

message_text
`,
    expected: "`average_math` is the mean math score of students with `study_hours >= 10`, and `message_text` is `\"Average math score: \"` followed by that value rounded to 1 decimal place.",
    hints: [
      "The first error is a syntax error: count the opening and closing brackets in the `paste()` line.",
      "Next, R cannot open the file. Compare the file name with the dataset name `students.csv`.",
      "Finally, `mean()` warns that its argument is not numeric: column names are case-sensitive – the column is `math`, not `Math`.",
    ],
    solution: `# Average math score of students who study at least 10 hours per week
students <- read.csv("data/students.csv")

hard_workers <- students[students$study_hours >= 10, ]
average_math <- mean(hard_workers$math)
message_text <- paste("Average math score:", round(average_math, 1))

message_text`,
    explanation: `The three bugs and how the messages point to them:

1. **Missing bracket** – \`paste(... round(average_math, 1)\` opened two brackets but closed only one. R reports an *unexpected symbol* (or end of input) before running anything, so syntax errors are always fixed first.
2. **Wrong file name** – \`"data/student.csv"\` does not exist; R says it *cannot open* the file. The dataset is \`students.csv\`.
3. **Wrong capital letter** – \`hard_workers$Math\` returns \`NULL\` because the column is called \`math\`. \`mean(NULL)\` gives \`NA\` with the warning *argument is not numeric or logical*. A quick \`names(students)\` or \`str(students)\` reveals the right name.

After the fixes, the script keeps the students with \`study_hours >= 10\`, averages their math scores and builds the sentence.`,
    tests: [
      {
        name: "The script runs without errors",
        check: `is.null(.error)`,
        failMessage: "There is still an error. Read the message: which line and which function does it mention?",
      },
      {
        name: "`average_math` is correct",
        check: `local({ s <- read.csv("data/students.csv"); isTRUE(all.equal(average_math, mean(s$math[s$study_hours >= 10]))) })`,
        failMessage: "`average_math` should be the mean of the `math` column for students with `study_hours >= 10`. Check the spelling of the column name.",
      },
      {
        name: "`message_text` contains the rounded average",
        check: `local({ s <- read.csv("data/students.csv"); identical(message_text, paste("Average math score:", round(mean(s$math[s$study_hours >= 10]), 1))) })`,
        failMessage: "`message_text` should be `paste(\"Average math score:\", round(average_math, 1))`.",
      },
    ],
  },
  {
    id: "m8-safe-convert",
    title: "Convert values safely with tryCatch()",
    difficulty: "challenge",
    module: 8,
    lesson: "packages-and-debugging",
    concepts: ["trycatch", "warnings"],
    prompt: `\`as.numeric("twelve")\` returns \`NA\` with a warning. Write a safer converter.

1. Complete \`to_number(x)\` so that it uses \`tryCatch()\` around \`as.numeric(x)\`. If a **warning** happens, it must show the message \`Could not convert: <x>\` with \`message()\` (e.g. \`Could not convert: twelve\`) and return \`NA\`. No warning may escape.
2. Apply it to every element of \`entries\` with \`sapply()\` and store the result in \`converted\`.
3. Store the sum of \`converted\`, ignoring missing values, in \`total\`.`,
    starterCode: `to_number <- function(x) {
  # use tryCatch() around as.numeric(x)
  # on a warning: show a message "Could not convert: ..." and return NA
  as.numeric(x)
}

entries <- c("12", "7.5", "twelve", "3")
converted <- sapply(entries, to_number)
total <- sum(converted, na.rm = TRUE)
total
`,
    expected: "`to_number(\"4.5\")` returns 4.5; `to_number(\"abc\")` prints `Could not convert: abc` and returns `NA` without a warning; `total` is 22.5.",
    hints: [
      "The structure is `tryCatch(as.numeric(x), warning = function(w) { ... })`.",
      "Inside the handler, first `message(\"Could not convert: \", x)`, then `NA` as the last line so it is returned.",
      "The rest of the starter code (`sapply()` and `sum(..., na.rm = TRUE)`) can stay as it is.",
    ],
    solution: `to_number <- function(x) {
  tryCatch(
    as.numeric(x),
    warning = function(w) {
      message("Could not convert: ", x)
      NA
    }
  )
}

entries <- c("12", "7.5", "twelve", "3")
converted <- sapply(entries, to_number)
total <- sum(converted, na.rm = TRUE)

converted
total`,
    explanation: `* \`tryCatch(as.numeric(x), warning = function(w) { ... })\` tries the conversion. Good text converts normally and the handler never runs.
* For \`"twelve"\`, \`as.numeric()\` raises a warning. Instead of letting it through, \`tryCatch()\` calls the handler, which reports the problem with \`message()\` and returns \`NA\` as its last value.
* \`sapply(entries, to_number)\` runs the converter on each entry; the result keeps the original texts as names.
* \`sum(converted, na.rm = TRUE)\` adds 12 + 7.5 + 3 = 22.5, skipping the \`NA\`.`,
    tests: [
      {
        name: "Good text is converted to a number",
        check: `isTRUE(all.equal(suppressMessages(to_number("4.5")), 4.5))`,
        failMessage: "`to_number(\"4.5\")` should return the number 4.5.",
      },
      {
        name: "Bad text gives NA without a warning",
        check: `local({ warned <- FALSE; v <- withCallingHandlers(suppressMessages(to_number("abc")), warning = function(w) { warned <<- TRUE; invokeRestart("muffleWarning") }); is.na(v) && !warned })`,
        failMessage: "Wrap `as.numeric(x)` in `tryCatch(..., warning = function(w) { ...; NA })` so that the warning is caught and `NA` is returned.",
      },
      {
        name: "Bad text shows a message",
        check: `local({ m <- tryCatch(to_number("abc"), message = function(m) conditionMessage(m)); is.character(m) && grepl("Could not convert: abc", m, fixed = TRUE) })`,
        failMessage: "Inside the warning handler, call `message(\"Could not convert: \", x)` before returning `NA`.",
      },
      {
        name: "`converted` and `total` are correct",
        check: `isTRUE(all.equal(unname(converted), c(12, 7.5, NA, 3))) && isTRUE(all.equal(total, 22.5))`,
        failMessage: "`converted` should be `sapply(entries, to_number)` (12, 7.5, NA, 3) and `total` their sum without the NA, 22.5.",
      },
    ],
  },
];
