import type { Exercise } from "../../types";

export const m04Exercises: Exercise[] = [
  {
    id: "m4-ticket-price",
    title: "Museum ticket prices",
    difficulty: "easy",
    module: 4,
    lesson: "conditions-and-logic",
    concepts: ["if-statements", "else-if", "comparison-operators"],
    prompt:
      "A museum charges by age:\n\n" +
      "| Age | Price |\n|---|---|\n| under 12 | 5 |\n| 65 or over | 6 |\n| everyone else | 10 |\n\n" +
      "1. Write an `if` / `else if` / `else` statement that stores the right price for `age` in a variable called `price`.\n" +
      "2. Store `TRUE` in `discount` if the price is less than 10, otherwise `FALSE` – use a comparison, not `if`.\n\n" +
      "The starter code sets `age <- 67`. When your code works, try other ages (8, 12, 30, 65) to check every path.",
    starterCode: `age <- 67

# 1. if / else if / else that sets price


# 2. discount: is the price less than 10?

`,
    expected: "For `age <- 67`, `price` is 6 and `discount` is `TRUE`.",
    hints: [
      "Start with `if (age < 12) {` and set `price <- 5` inside the curly brackets.",
      "Add `} else if (age >= 65) {` for the seniors and finish with `} else {` for everyone else – keep each `else` on the same line as the `}` before it.",
      "A comparison already gives TRUE or FALSE, so part 2 is simply `discount <- price < 10`.",
    ],
    solution: `age <- 67

if (age < 12) {
  price <- 5
} else if (age >= 65) {
  price <- 6
} else {
  price <- 10
}

discount <- price < 10
price
discount`,
    explanation:
      "- `if (age < 12)` is FALSE for 67, so R moves on to the next condition.\n" +
      "- `else if (age >= 65)` is TRUE, so `price <- 6` runs and the final `else` is skipped.\n" +
      "- Each `else` sits on the same line as the closing `}` before it; otherwise R would report *unexpected 'else'*.\n" +
      "- `price < 10` is a comparison, so it already produces `TRUE` or `FALSE` – no `if` needed to store it in `discount`.",
    tests: [
      {
        name: "`price` is 6 for a 67-year-old",
        check: `.defined("price") && isTRUE(all.equal(as.numeric(price), 6))`,
        failMessage: "For `age <- 67` the price should be 6. Check the condition for 65 or over: `age >= 65`.",
      },
      {
        name: "`discount` is TRUE",
        check: `.defined("discount") && isTRUE(discount)`,
        failMessage: "Store the result of the comparison `price < 10` in `discount`.",
      },
      {
        name: "Your code uses if and else",
        check: `grepl("if\\\\s*\\\\(", .code) && grepl("else", .code)`,
        failMessage: "Use an `if` / `else if` / `else` statement to choose the price, rather than typing the answer directly.",
      },
    ],
  },
  {
    id: "m4-weather-labels",
    title: "A week of weather labels",
    difficulty: "medium",
    module: 4,
    lesson: "conditions-and-logic",
    concepts: ["ifelse-function", "logical-operators", "in-operator", "comparison-operators"],
    prompt:
      "You have a week of temperatures and the matching day names.\n\n" +
      "1. Store a label for every day in `label`: `\"hot\"` if the temperature is **25 or more**, otherwise `\"not hot\"`.\n" +
      "2. Store the number of hot days in `n_hot`.\n" +
      "3. Store the temperatures that are **between 15 and 25, inclusive** (15 ≤ t ≤ 25) in `comfortable`.\n" +
      "4. Store the **names of the days** with such comfortable temperatures in `comfortable_days`.\n" +
      "5. Store the temperatures of the weekend days (`\"Sat\"` and `\"Sun\"`) in `weekend_temps` – use `%in%`.",
    starterCode: `temps <- c(8, 15, 22, 29, 33, 19, 11)
days <- c("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")

# 1. "hot" / "not hot" for every day
label <- "not hot"

# 2. Number of hot days


# 3. Comfortable temperatures (15 to 25, inclusive)


# 4. Names of the comfortable days


# 5. Weekend temperatures

`,
    expected: "`label` has 7 values (Thu and Fri are \"hot\"), `n_hot` is 2, `comfortable` is `15 22 19`, `comfortable_days` is `\"Tue\" \"Wed\" \"Sat\"` and `weekend_temps` is `19 11`.",
    hints: [
      "`if` cannot decide for a whole vector – use `ifelse(temps >= 25, \"hot\", \"not hot\")`. Count TRUE values with `sum()`.",
      "Both conditions must hold, so combine them with `&`: `temps >= 15 & temps <= 25`. Use that condition inside `temps[ ]` and inside `days[ ]`.",
      "`days %in% c(\"Sat\", \"Sun\")` is TRUE for the weekend; put it inside `temps[ ]`.",
    ],
    solution: `temps <- c(8, 15, 22, 29, 33, 19, 11)
days <- c("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")

label <- ifelse(temps >= 25, "hot", "not hot")
n_hot <- sum(temps >= 25)
comfortable <- temps[temps >= 15 & temps <= 25]
comfortable_days <- days[temps >= 15 & temps <= 25]
weekend_temps <- temps[days %in% c("Sat", "Sun")]

label
comfortable_days`,
    explanation:
      "- `ifelse()` checks `temps >= 25` for each of the 7 days and picks `\"hot\"` or `\"not hot\"` – one label per day.\n" +
      "- `sum(temps >= 25)` counts the TRUE values: Thursday (29) and Friday (33).\n" +
      "- `temps >= 15 & temps <= 25` is TRUE only where **both** comparisons are TRUE. `>=` and `<=` include the boundaries, so 15 counts.\n" +
      "- Because `days` is in the same order as `temps`, the same condition picks the matching day names.\n" +
      "- `days %in% c(\"Sat\", \"Sun\")` is `FALSE FALSE FALSE FALSE FALSE TRUE TRUE`, which selects the last two temperatures.",
    tests: [
      {
        name: "`label` has the right label for every day",
        check: `.defined("label") && identical(as.character(label), c("not hot", "not hot", "not hot", "hot", "hot", "not hot", "not hot"))`,
        failMessage: "`label` needs 7 values. Use `ifelse(temps >= 25, \"hot\", \"not hot\")` – check the spelling of both labels.",
      },
      {
        name: "`n_hot` is 2",
        check: `.defined("n_hot") && isTRUE(all.equal(as.numeric(n_hot), 2))`,
        failMessage: "Count the hot days with `sum(temps >= 25)`.",
      },
      {
        name: "`comfortable` is 15 22 19",
        check: `.defined("comfortable") && isTRUE(all.equal(as.numeric(comfortable), c(15, 22, 19)))`,
        failMessage: "Use `&` to require both `temps >= 15` and `temps <= 25`. Did you include 15 itself (`>=`, not `>`)?",
      },
      {
        name: "`comfortable_days` is Tue, Wed, Sat",
        check: `.defined("comfortable_days") && identical(as.character(comfortable_days), c("Tue", "Wed", "Sat"))`,
        failMessage: "Use the same condition as in step 3, but inside `days[ ]`.",
      },
      {
        name: "`weekend_temps` is 19 11",
        check: `.defined("weekend_temps") && isTRUE(all.equal(as.numeric(weekend_temps), c(19, 11)))`,
        failMessage: "Pick from `temps` with the condition `days %in% c(\"Sat\", \"Sun\")`.",
      },
    ],
  },
  {
    id: "m4-loop-total",
    title: "Step counter",
    difficulty: "easy",
    module: 4,
    lesson: "for-and-while-loops",
    concepts: ["for-loops", "accumulating-results"],
    prompt:
      "A fitness tracker recorded the steps you walked on 7 days. Use a **for loop** (not `sum()`) to work out:\n\n" +
      "1. `total_steps` – the total number of steps over the week.\n" +
      "2. `active_days` – the number of days with **at least 7000** steps.\n\n" +
      "The two counters and an empty loop are already set up for you.",
    starterCode: `steps <- c(4200, 8100, 6500, 10200, 7300, 9100, 5600)

total_steps <- 0
active_days <- 0

for (s in steps) {
  # add s to total_steps

  # if s is at least 7000, add 1 to active_days

}

total_steps
active_days
`,
    expected: "`total_steps` is 51000 and `active_days` is 4.",
    hints: [
      "Inside the loop, `s` is one day's steps. Update the total with `total_steps <- total_steps + s`.",
      "Wrap the second update in an `if`: `if (s >= 7000) { ... }`.",
      "Inside that `if`, write `active_days <- active_days + 1`.",
    ],
    solution: `steps <- c(4200, 8100, 6500, 10200, 7300, 9100, 5600)

total_steps <- 0
active_days <- 0

for (s in steps) {
  total_steps <- total_steps + s
  if (s >= 7000) {
    active_days <- active_days + 1
  }
}

total_steps
active_days`,
    explanation:
      "- Both counters start at 0 **before** the loop, so they are not reset in each iteration.\n" +
      "- The loop visits each day: in the first iteration `s` is 4200, then 8100, and so on.\n" +
      "- `total_steps <- total_steps + s` adds today's steps to the running total, which ends at 51000.\n" +
      "- The `if` adds 1 to `active_days` only on days with 7000 steps or more: 8100, 10200, 7300 and 9100 – 4 days.\n" +
      "- Check: `sum(steps)` and `sum(steps >= 7000)` give the same answers in one line each – loops and vectorized code agree!",
    tests: [
      {
        name: "`total_steps` is 51000",
        check: `.defined("total_steps") && isTRUE(all.equal(as.numeric(total_steps), 51000))`,
        failMessage: "Inside the loop, add each day's steps: `total_steps <- total_steps + s`. Make sure `total_steps <- 0` is before the loop, not inside it.",
      },
      {
        name: "`active_days` is 4",
        check: `.defined("active_days") && isTRUE(all.equal(as.numeric(active_days), 4))`,
        failMessage: "Inside the loop, use `if (s >= 7000)` and add 1 to `active_days` inside it. 7000 itself should count, so use `>=`.",
      },
      {
        name: "Your code uses a for loop",
        check: `grepl("for\\\\s*\\\\(", .code)`,
        failMessage: "This exercise is about loops – calculate the values inside `for (s in steps) { ... }`.",
      },
    ],
  },
  {
    id: "m4-savings-goal",
    title: "Saving for a new bike",
    difficulty: "medium",
    module: 4,
    lesson: "for-and-while-loops",
    concepts: ["while-loops", "accumulating-results", "infinite-loops"],
    prompt:
      "You have 500 in a savings account and want to buy a bike that costs **1000**. At the end of each month, the bank first adds **1% interest** (the balance is multiplied by 1.01), and then you deposit **75**.\n\n" +
      "Use a **while loop** to find out:\n\n" +
      "1. `months` – how many months it takes until the balance is **at least 1000**.\n" +
      "2. `balance` – the balance at that moment.",
    starterCode: `balance <- 500
months <- 0

# Repeat while the balance is below 1000:
#   add 1% interest, then deposit 75, then count the month

`,
    expected: "`months` is 7 and `balance` is about 1077.08.",
    hints: [
      "The loop starts with `while (balance < 1000) {` – it keeps going as long as you cannot afford the bike yet.",
      "Inside the loop, update the balance in one line: `balance <- balance * 1.01 + 75` (interest first, then the deposit).",
      "Don't forget to count: `months <- months + 1` inside the loop – and close the loop with `}`.",
    ],
    solution: `balance <- 500
months <- 0

while (balance < 1000) {
  balance <- balance * 1.01 + 75
  months <- months + 1
}

months
round(balance, 2)`,
    explanation:
      "- `while (balance < 1000)` is checked before every month. While it is TRUE, another month passes.\n" +
      "- `balance * 1.01 + 75` adds 1% interest and then the deposit, in that order.\n" +
      "- `months <- months + 1` counts the months. Both lines change variables, and the balance grows every time, so the condition is sure to become FALSE eventually – no infinite loop.\n" +
      "- After 6 months the balance is about 992.16, still below 1000. After month 7 it is about 1077.08, the condition is FALSE, and the loop ends.",
    tests: [
      {
        name: "`months` is 7",
        check: `.defined("months") && isTRUE(all.equal(as.numeric(months), 7))`,
        failMessage: "`months` should be 7. Make sure the loop condition is `balance < 1000` and that you add 1 to `months` inside the loop.",
      },
      {
        name: "`balance` is about 1077.08",
        check: `.defined("balance") && isTRUE(all.equal(as.numeric(balance), 1077.083, tolerance = 1e-5))`,
        failMessage: "Check the order of the update: interest first, then the deposit – `balance <- balance * 1.01 + 75`.",
      },
      {
        name: "Your code uses a while loop",
        check: `grepl("while\\\\s*\\\\(", .code)`,
        failMessage: "Use a `while (balance < 1000) { ... }` loop – you don't know in advance how many months you need.",
      },
    ],
  },
  {
    id: "m4-first-function",
    title: "Your first function: circle area",
    difficulty: "easy",
    module: 4,
    lesson: "writing-functions",
    concepts: ["functions", "function-anatomy", "calling-functions", "return-values"],
    prompt:
      "The area of a circle is π × radius². R has π built in as `pi`.\n\n" +
      "1. Write a function called `circle_area` with one argument, `radius`, that returns the area of a circle with that radius.\n" +
      "2. Call your function to calculate the area of a circle with radius 5 and store the result in `area_5`.",
    starterCode: `# 1. Write the function circle_area here


# 2. Area of a circle with radius 5
area_5 <- 0
area_5
`,
    expected: "`circle_area(1)` returns 3.141593, `circle_area(2)` returns 12.56637 and `area_5` is about 78.54.",
    hints: [
      "The shape is `circle_area <- function(radius) { ... }`.",
      "The body needs just one line: `pi * radius^2`. As the last expression, it is returned.",
      "Call it like a built-in function: `area_5 <- circle_area(5)`.",
    ],
    solution: `circle_area <- function(radius) {
  pi * radius^2
}

area_5 <- circle_area(5)
area_5`,
    explanation:
      "- `circle_area <- function(radius) {` creates a function with one argument and stores it under the name `circle_area`.\n" +
      "- `pi * radius^2` is the last (and only) expression in the body, so its value is returned. `^2` squares the radius before multiplying.\n" +
      "- `circle_area(5)` runs the body with `radius` set to 5 and returns 78.53982, which is stored in `area_5`.\n" +
      "- Because `^` and `*` are vectorized, `circle_area(c(1, 2, 3))` works too.",
    tests: [
      {
        name: "`circle_area` is a function",
        check: `.defined("circle_area") && is.function(circle_area)`,
        failMessage: "Create the function with `circle_area <- function(radius) { ... }`.",
      },
      {
        name: "`circle_area()` returns the right areas",
        check: `isTRUE(all.equal(circle_area(1), pi)) && isTRUE(all.equal(circle_area(2), 4 * pi)) && isTRUE(all.equal(circle_area(radius = 10), 100 * pi))`,
        failMessage: "The body should return `pi * radius^2`. Make sure it is the last line of the body (not stored in a variable as the last step) and that the argument is called `radius`.",
      },
      {
        name: "`area_5` is the area for radius 5",
        check: `.defined("area_5") && isTRUE(all.equal(as.numeric(area_5), 25 * pi))`,
        failMessage: "Store the result of the call: `area_5 <- circle_area(5)`.",
      },
    ],
  },
  {
    id: "m4-tip-calculator",
    title: "Tip calculator with defaults",
    difficulty: "medium",
    module: 4,
    lesson: "writing-functions",
    concepts: ["arguments", "default-arguments", "named-arguments", "return-values"],
    prompt:
      "Build a small tip calculator for a restaurant.\n\n" +
      "1. Write a function `tip_amount(bill, percent = 15)` that returns the tip: `bill * percent / 100`, **rounded to 2 decimal places**.\n" +
      "2. Write a function `total_bill(bill, percent = 15)` that returns the bill **plus** the tip. Use your `tip_amount()` function inside it.\n" +
      "3. Use **named arguments** to calculate the total for a bill of 48.50 with a 20% tip, and store it in `my_total`.",
    starterCode: `# 1. tip_amount(bill, percent = 15)
tip_amount <- function(bill) {
  bill * 15 / 100
}

# 2. total_bill(bill, percent = 15)


# 3. Total for 48.50 with a 20% tip (use named arguments)

`,
    expected: "`tip_amount(40)` is 6, `tip_amount(40, 20)` is 8, `tip_amount(10.01)` is 1.5, `total_bill(40)` is 46 and `my_total` is 58.2.",
    hints: [
      "Give the second argument a default in the definition: `function(bill, percent = 15)`. Use `percent` in the body instead of the fixed 15, and wrap the result in `round(..., 2)`.",
      "A function can call another function: the body of `total_bill` can be `bill + tip_amount(bill, percent)`.",
      "Named arguments look like `total_bill(bill = 48.5, percent = 20)`.",
    ],
    solution: `tip_amount <- function(bill, percent = 15) {
  round(bill * percent / 100, 2)
}

total_bill <- function(bill, percent = 15) {
  bill + tip_amount(bill, percent)
}

my_total <- total_bill(bill = 48.5, percent = 20)

tip_amount(40)
total_bill(40)
my_total`,
    explanation:
      "- `percent = 15` in the definition is a **default**: `tip_amount(40)` uses 15%, while `tip_amount(40, 20)` overrides it.\n" +
      "- `round(..., 2)` keeps the tip to whole cents: `tip_amount(10.01)` gives 1.5 instead of 1.5015.\n" +
      "- `total_bill()` reuses `tip_amount()` instead of repeating the formula – if the rounding rule ever changes, you only fix it in one place. It passes its own `percent` on, so its default and any value the caller gives both reach `tip_amount()`.\n" +
      "- `total_bill(bill = 48.5, percent = 20)` names both arguments: 48.5 + 9.7 = 58.2.",
    tests: [
      {
        name: "`tip_amount()` uses a default of 15%",
        check: `.defined("tip_amount") && is.function(tip_amount) && isTRUE(all.equal(tip_amount(40), 6))`,
        failMessage: "`tip_amount(40)` should be 6. Give the function the arguments `(bill, percent = 15)`.",
      },
      {
        name: "`tip_amount()` accepts other percentages and named arguments",
        check: `isTRUE(all.equal(tip_amount(40, 20), 8)) && isTRUE(all.equal(tip_amount(percent = 10, bill = 55), 5.5))`,
        failMessage: "Use the `percent` argument in the body instead of a fixed 15: `bill * percent / 100`.",
      },
      {
        name: "`tip_amount()` rounds to 2 decimal places",
        check: `isTRUE(all.equal(tip_amount(10.01), 1.5))`,
        failMessage: "`tip_amount(10.01)` should be 1.5 – wrap the calculation in `round(..., 2)`.",
      },
      {
        name: "`total_bill()` adds the tip to the bill",
        check: `.defined("total_bill") && is.function(total_bill) && isTRUE(all.equal(total_bill(40), 46)) && isTRUE(all.equal(total_bill(100, percent = 10), 110))`,
        failMessage: "`total_bill(40)` should be 46 and `total_bill(100, percent = 10)` should be 110. Return `bill + tip_amount(bill, percent)`.",
      },
      {
        name: "`my_total` is 58.2",
        check: `.defined("my_total") && isTRUE(all.equal(as.numeric(my_total), 58.2))`,
        failMessage: "Store `total_bill(bill = 48.5, percent = 20)` in `my_total`.",
      },
    ],
  },
  {
    id: "m4-classify-scores",
    title: "Score classifier",
    difficulty: "challenge",
    module: 4,
    lesson: "writing-functions",
    datasets: ["students"],
    concepts: ["functions", "default-arguments", "for-loops", "seq-along", "else-if", "return-values"],
    prompt:
      "Write a function that sorts test scores into three groups, then use it on the students dataset.\n\n" +
      "1. Write a function `classify_scores(scores, pass_mark = 50)` that returns a **character vector with one label per score**:\n" +
      "   - `\"excellent\"` for scores of **90 or more**,\n" +
      "   - `\"pass\"` for scores from `pass_mark` up to 89,\n" +
      "   - `\"fail\"` for scores below `pass_mark`.\n" +
      "   It must work for a vector of any length. You can use a `for` loop with `if` / `else if` / `else`, or `ifelse()`.\n" +
      "2. Read `data/students.csv` into `students` and add a column `level` with the classification of each student's `math` score, using a pass mark of **60**.\n" +
      "3. Store a frequency table of `students$level` in `level_counts`.",
    starterCode: `# 1. Write classify_scores(scores, pass_mark = 50)
classify_scores <- function(scores, pass_mark = 50) {
  result <- character(length(scores))
  # fill result with "excellent", "pass" or "fail" for each score

  result
}

# 2. Add the column level to the students data (pass mark 60)
students <- read.csv("data/students.csv")


# 3. Frequency table of the levels

`,
    expected: "`classify_scores(c(35, 50, 72, 90))` returns `\"fail\" \"pass\" \"pass\" \"excellent\"`, `classify_scores(c(55, 60), pass_mark = 60)` returns `\"fail\" \"pass\"`, and `level_counts` shows 7 excellent, 8 fail and 45 pass.",
    hints: [
      "`character(n)` creates a text vector with `n` empty values, just like `numeric(n)` creates zeros. Loop over its positions with `for (i in seq_along(scores))`.",
      "Inside the loop, check the conditions from the top down: `if (scores[i] >= 90) { result[i] <- \"excellent\" } else if (scores[i] >= pass_mark) { ... } else { ... }`.",
      "Call it with a named argument: `students$level <- classify_scores(students$math, pass_mark = 60)`, then `level_counts <- table(students$level)`.",
    ],
    solution: `classify_scores <- function(scores, pass_mark = 50) {
  result <- character(length(scores))
  for (i in seq_along(scores)) {
    if (scores[i] >= 90) {
      result[i] <- "excellent"
    } else if (scores[i] >= pass_mark) {
      result[i] <- "pass"
    } else {
      result[i] <- "fail"
    }
  }
  result
}

students <- read.csv("data/students.csv")
students$level <- classify_scores(students$math, pass_mark = 60)
level_counts <- table(students$level)

classify_scores(c(35, 50, 72, 90))
level_counts`,
    explanation:
      "- `character(length(scores))` makes an empty container with one slot per score; the loop fills one slot per iteration.\n" +
      "- `seq_along(scores)` gives the positions 1, 2, …, and works even for an empty vector.\n" +
      "- The `if` chain checks the **highest** group first. If `scores[i] >= pass_mark` came first, a 95 would be labelled \"pass\".\n" +
      "- `result` is the last expression, so the finished vector is returned.\n" +
      "- `pass_mark = 50` is a default; `classify_scores(students$math, pass_mark = 60)` overrides it with a named argument.\n" +
      "- An alternative body without a loop: `ifelse(scores >= 90, \"excellent\", ifelse(scores >= pass_mark, \"pass\", \"fail\"))`.",
    tests: [
      {
        name: "`classify_scores` is a function",
        check: `.defined("classify_scores") && is.function(classify_scores)`,
        failMessage: "Define the function with `classify_scores <- function(scores, pass_mark = 50) { ... }`.",
      },
      {
        name: "It labels a vector of scores with the default pass mark",
        check: `identical(as.character(classify_scores(c(35, 50, 72, 90, 99, 49))), c("fail", "pass", "pass", "excellent", "excellent", "fail"))`,
        failMessage: "`classify_scores(c(35, 50, 72, 90, 99, 49))` should give fail, pass, pass, excellent, excellent, fail. Check the order of your conditions (90 first) and that 50 counts as a pass (`>=`).",
      },
      {
        name: "It respects a different pass mark",
        check: `identical(as.character(classify_scores(c(55, 60, 95), pass_mark = 60)), c("fail", "pass", "excellent"))`,
        failMessage: "Use the `pass_mark` argument in your condition instead of a fixed 50.",
      },
      {
        name: "`students$level` holds the labels for the math scores (pass mark 60)",
        check: `.defined("students") && "level" %in% names(students) && { m <- read.csv("data/students.csv")$math; identical(as.character(students$level), ifelse(m >= 90, "excellent", ifelse(m >= 60, "pass", "fail"))) }`,
        failMessage: "Add the column with `students$level <- classify_scores(students$math, pass_mark = 60)`.",
      },
      {
        name: "`level_counts` is the frequency table of the levels",
        check: `.defined("level_counts") && inherits(level_counts, "table") && sum(level_counts) == 60 && isTRUE(all.equal(as.vector(level_counts[c("excellent", "fail", "pass")]), c(7, 8, 45)))`,
        failMessage: "Use `level_counts <- table(students$level)` after adding the `level` column.",
      },
    ],
  },
];
