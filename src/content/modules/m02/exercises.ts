import type { Exercise } from "../../types";

export const module02Exercises: Exercise[] = [
  {
    id: "m2-create-variables",
    title: "Create your first variables",
    difficulty: "easy",
    module: 2,
    lesson: "variables-and-assignment",
    concepts: ["variables", "assignment"],
    prompt: `Create two variables and then display them:

1. \`name\` – your first name, as **text** (in quotes).
2. \`age\` – your age, as a **number** (no quotes).
3. Print both variables.

A made-up name and age are fine too!`,
    starterCode: `# 1. Store your first name (as text) in a variable called name

# 2. Store your age (as a number) in a variable called age

# 3. Print both variables

`,
    expected: `For example, with the name Maria and the age 34:

\`\`\`
[1] "Maria"
[1] 34
\`\`\``,
    hints: [
      "Use the assignment arrow `<-` to store a value: `variable_name <- value`.",
      "Text needs quotes, numbers don't: `name <- \"Maria\"` and `age <- 34`.",
      "To display them, add `print(name)` and `print(age)` (or just type `name` and `age` on their own lines).",
    ],
    solution: `# 1. Store your first name (as text)
name <- "Maria"
# 2. Store your age (as a number)
age <- 34
# 3. Print both variables
print(name)
print(age)`,
    explanation: `- \`name <- "Maria"\` creates a variable called \`name\`; the quotes make the value text.
- \`age <- 34\` creates \`age\` holding the number 34 – no quotes, so you could calculate with it (\`age + 1\`).
- \`print(name)\` and \`print(age)\` display the stored values. Note that there are no quotes around the *variable names* – \`print("name")\` would just print the word name.`,
    tests: [
      { name: "`name` exists and holds text", check: `.defined("name") && is.character(name)`, failMessage: "Create a variable called `name` holding text in quotes, e.g. `name <- \"Maria\"`." },
      { name: "`age` exists and holds a number", check: `.defined("age") && is.numeric(age)`, failMessage: "Create a variable called `age` holding a number **without** quotes, e.g. `age <- 34`." },
      { name: "The name is printed", check: `.defined("name") && is.character(name) && grepl(name[1], .out, fixed = TRUE)`, failMessage: "Print the variable with `print(name)` – without quotes around `name`." },
      { name: "The age is printed", check: `.defined("age") && is.numeric(age) && grepl(paste("[1]", format(age[1])), .out, fixed = TRUE)`, failMessage: "Print the age with `print(age)`." },
    ],
  },
  {
    id: "m2-bank-balance",
    title: "Update a bank balance",
    difficulty: "medium",
    module: 2,
    lesson: "variables-and-assignment",
    concepts: ["overwriting", "variables"],
    prompt: `You open a savings account with **100**. Update the variable \`balance\` step by step – each time by **overwriting** \`balance\` using its current value (like \`balance <- balance + ...\`):

1. Deposit **250**.
2. Spend **75**.
3. The bank adds **10% interest**: multiply the balance by **1.1**.
4. Print the final balance.`,
    starterCode: `# Start balance
balance <- 100

# 1. Deposit 250 (update balance using its current value)

# 2. Spend 75

# 3. Add 10% interest: multiply by 1.1

# 4. Print the final balance

`,
    expected: `\`\`\`
[1] 302.5
\`\`\``,
    hints: [
      "To add to a variable, put the variable on both sides of the arrow: `balance <- balance + 250`.",
      "Spending is subtraction: `balance <- balance - 75`. Interest is multiplication by 1.1.",
      "The steps are `balance <- balance + 250`, `balance <- balance - 75`, `balance <- balance * 1.1`, then `print(balance)`.",
    ],
    solution: `# Start balance
balance <- 100
# 1. Deposit 250
balance <- balance + 250
# 2. Spend 75
balance <- balance - 75
# 3. Add 10% interest
balance <- balance * 1.1
# 4. Print the final balance
print(balance)`,
    explanation: `R always works out the right-hand side of \`<-\` first, then stores the result back in \`balance\`:

- \`balance <- balance + 250\`: 100 + 250 = 350.
- \`balance <- balance - 75\`: 350 − 75 = 275.
- \`balance <- balance * 1.1\`: 275 × 1.1 = 302.5.
- \`print(balance)\` shows \`[1] 302.5\`.

Each step overwrites the old value, so \`balance\` always holds the latest amount – just like a real bank balance.`,
    tests: [
      { name: "The final balance is 302.5", check: `isTRUE(all.equal(balance, 302.5))`, failMessage: "`balance` should end at 302.5. Check each step: +250, then −75, then ×1.1 (in that order)." },
      {
        name: "`balance` is updated using its own value",
        check: `sum(gregexpr("balance\\\\s*(<-|=)\\\\s*balance", .code)[[1]] > 0) >= 3`,
        failMessage: "Update `balance` step by step with lines like `balance <- balance + 250` (three updates in total).",
      },
      { name: "The final balance is printed", check: `grepl("302.5", .out, fixed = TRUE)`, failMessage: "Finish with `print(balance)` so the final balance is shown." },
    ],
  },
  {
    id: "m2-temperature",
    title: "Celsius to Fahrenheit",
    difficulty: "easy",
    module: 2,
    lesson: "values-and-arithmetic",
    concepts: ["arithmetic", "order-of-operations"],
    prompt: `Convert a temperature from Celsius to Fahrenheit. The formula is:

> Fahrenheit = Celsius × 9 ÷ 5 + 32

1. Store **25** in a variable called \`celsius\`.
2. Calculate the temperature in Fahrenheit and store it in \`fahrenheit\`, **using the variable** \`celsius\` in your calculation.
3. Print \`fahrenheit\`.`,
    starterCode: `# 1. Store the temperature in Celsius
celsius <- 25

# 2. Convert it to Fahrenheit (use the variable celsius)

# 3. Print the result

`,
    expected: `\`\`\`
[1] 77
\`\`\``,
    hints: [
      "Translate the formula into R: × becomes `*` and ÷ becomes `/`.",
      "Multiplication and division happen before addition, so you don't need parentheses here.",
      "`fahrenheit <- celsius * 9 / 5 + 32`, then `print(fahrenheit)`.",
    ],
    solution: `# 1. Store the temperature in Celsius
celsius <- 25
# 2. Convert it to Fahrenheit
fahrenheit <- celsius * 9 / 5 + 32
# 3. Print the result
print(fahrenheit)`,
    explanation: `- \`celsius * 9 / 5 + 32\`: R does the multiplication and division first, from left to right (25 × 9 = 225, 225 ÷ 5 = 45), then the addition (45 + 32 = 77).
- The result is stored in \`fahrenheit\` and printed: \`[1] 77\`.

Because you used the variable \`celsius\`, you can convert any temperature by changing just the first line – try \`celsius <- 100\` (you should get 212).`,
    tests: [
      { name: "`celsius` is 25", check: `.defined("celsius") && isTRUE(all.equal(celsius, 25))`, failMessage: "Keep `celsius <- 25` on the first line." },
      { name: "`fahrenheit` is 77", check: `.defined("fahrenheit") && isTRUE(all.equal(fahrenheit, 77))`, failMessage: "`fahrenheit` should be 77. Use the formula `celsius * 9 / 5 + 32`." },
      { name: "The calculation uses `celsius`", check: `grepl("fahrenheit\\\\s*(<-|=).*celsius", .code)`, failMessage: "Calculate `fahrenheit` from the variable `celsius` instead of typing 25 again." },
      { name: "The result is printed", check: `grepl("[1] 77", .out, fixed = TRUE)`, failMessage: "Print the result with `print(fahrenheit)`." },
    ],
  },
  {
    id: "m2-minutes-to-hours",
    title: "How long is the movie?",
    difficulty: "medium",
    module: 2,
    lesson: "values-and-arithmetic",
    concepts: ["integer-division-remainder", "arithmetic"],
    prompt: `A movie lasts **135 minutes**. Work out how long that is in hours and minutes:

1. \`hours\` – the number of **whole** hours (use \`%/%\`).
2. \`minutes_left\` – the minutes left over after the whole hours (use \`%%\`).
3. Print both.

Use the variable \`movie_minutes\` in your calculations.`,
    starterCode: `movie_minutes <- 135

# 1. Whole hours

# 2. Minutes left over

# 3. Print both

`,
    expected: `\`\`\`
[1] 2
[1] 15
\`\`\`

So the movie lasts 2 hours and 15 minutes.`,
    hints: [
      "There are 60 minutes in an hour, so you divide by 60 – but in two different ways.",
      "`%/%` gives the whole number of times 60 fits into 135; `%%` gives the remainder.",
      "`hours <- movie_minutes %/% 60` and `minutes_left <- movie_minutes %% 60`, then print both.",
    ],
    solution: `movie_minutes <- 135
# 1. Whole hours
hours <- movie_minutes %/% 60
# 2. Minutes left over
minutes_left <- movie_minutes %% 60
# 3. Print both
print(hours)
print(minutes_left)`,
    explanation: `- \`movie_minutes %/% 60\` asks how many *whole* times 60 fits into 135: 2 (because 2 × 60 = 120).
- \`movie_minutes %% 60\` gives what is left over: 135 − 120 = 15.
- So 135 minutes = 2 hours and 15 minutes.

Ordinary division, \`135 / 60\`, would give 2.25 hours – correct, but not in the "hours and minutes" form people use.`,
    tests: [
      { name: "`hours` is 2", check: `.defined("hours") && isTRUE(all.equal(hours, 2))`, failMessage: "`hours` should be 2. Use integer division: `movie_minutes %/% 60`." },
      { name: "`minutes_left` is 15", check: `.defined("minutes_left") && isTRUE(all.equal(minutes_left, 15))`, failMessage: "`minutes_left` should be 15. Use the remainder operator: `movie_minutes %% 60`." },
      { name: "Both results are printed", check: `grepl("[1] 2", .out, fixed = TRUE) && grepl("[1] 15", .out, fixed = TRUE)`, failMessage: "Print both variables, e.g. `print(hours)` and `print(minutes_left)`." },
    ],
  },
  {
    id: "m2-type-conversion",
    title: "Data that arrived as text",
    difficulty: "medium",
    module: 2,
    lesson: "operators-and-data-types",
    concepts: ["type-conversion", "data-types", "comparison-operators"],
    prompt: `An online form stored a person's details as **text**:

\`\`\`r
age_text <- "34"
height_text <- "1.72"
\`\`\`

1. Convert them to numbers and store them in \`age\` and \`height\`.
2. Calculate \`age_in_months\` (the age × 12).
3. Create \`is_adult\`, which should be \`TRUE\` if \`age\` is 18 or more (use a comparison operator).
4. Print \`class(age)\` to check that \`age\` is now numeric.`,
    starterCode: `age_text <- "34"
height_text <- "1.72"

# 1. Convert the text to numbers

# 2. Age in months

# 3. Is the person an adult (18 or older)?

# 4. Check the type of age

`,
    expected: `\`age\` is 34, \`height\` is 1.72, \`age_in_months\` is 408, \`is_adult\` is \`TRUE\`, and the output shows:

\`\`\`
[1] "numeric"
\`\`\``,
    hints: [
      "Text can't be used for maths. Which function turns text into a number? It starts with `as.`",
      "`age <- as.numeric(age_text)` – do the same for the height. For `is_adult`, use the `>=` operator.",
      "`age_in_months <- age * 12`, `is_adult <- age >= 18`, then `print(class(age))`.",
    ],
    solution: `age_text <- "34"
height_text <- "1.72"
# 1. Convert the text to numbers
age <- as.numeric(age_text)
height <- as.numeric(height_text)
# 2. Age in months
age_in_months <- age * 12
# 3. Is the person an adult (18 or older)?
is_adult <- age >= 18
# 4. Check the type of age
print(class(age))`,
    explanation: `- \`as.numeric(age_text)\` turns the text \`"34"\` into the number 34; \`as.numeric(height_text)\` gives 1.72.
- Now arithmetic works: \`age * 12\` is 408. (With the original text, \`age_text * 12\` would give "non-numeric argument to binary operator".)
- \`age >= 18\` compares 34 with 18 and returns the logical value \`TRUE\`, which is stored in \`is_adult\`.
- \`class(age)\` returns \`"numeric"\`, confirming the conversion worked.`,
    tests: [
      { name: "`age` is the number 34", check: `.defined("age") && is.numeric(age) && isTRUE(all.equal(as.numeric(age), 34))`, failMessage: "Convert the text with `age <- as.numeric(age_text)`." },
      { name: "`height` is the number 1.72", check: `.defined("height") && is.numeric(height) && isTRUE(all.equal(height, 1.72))`, failMessage: "Convert the height with `height <- as.numeric(height_text)`." },
      { name: "`age_in_months` is 408", check: `.defined("age_in_months") && isTRUE(all.equal(as.numeric(age_in_months), 408))`, failMessage: "`age_in_months` should be the numeric age multiplied by 12." },
      { name: "`is_adult` is TRUE", check: `.defined("is_adult") && is.logical(is_adult) && isTRUE(is_adult)`, failMessage: "Create `is_adult` with a comparison: `is_adult <- age >= 18`. It should be the logical value TRUE, not text." },
      { name: "The class of `age` is printed", check: `grepl("\\"numeric\\"", .out, fixed = TRUE) || grepl("\\"integer\\"", .out, fixed = TRUE)`, failMessage: "Finish with `print(class(age))` – it should show \"numeric\"." },
    ],
  },
  {
    id: "m2-name-badge",
    title: "Make a name badge",
    difficulty: "challenge",
    module: 2,
    lesson: "functions-and-error-messages",
    concepts: ["text-functions", "built-in-functions", "function-arguments"],
    prompt: `A quiz app stores a player's details like this:

\`\`\`r
first_name <- "ada"
last_name <- "lovelace"
score <- 87.456
\`\`\`

Use built-in functions to create:

1. \`full_name\` – the full name in capital letters with a space between the names: \`"ADA LOVELACE"\`.
2. \`name_length\` – the number of characters in \`full_name\` (spaces count).
3. \`rounded_score\` – the score rounded to **1** decimal place.
4. \`badge\` – the text \`"ADA LOVELACE scored 87.5"\`, built from your variables with \`paste()\`.

Finally, print \`badge\`. Use the variables – don't type the answers in by hand!`,
    starterCode: `first_name <- "ada"
last_name <- "lovelace"
score <- 87.456

# 1. Full name in capitals

# 2. Number of characters in the full name

# 3. Score rounded to 1 decimal place

# 4. Build the badge text and print it

`,
    expected: `\`full_name\` is "ADA LOVELACE", \`name_length\` is 12, \`rounded_score\` is 87.5, and the output shows:

\`\`\`
[1] "ADA LOVELACE scored 87.5"
\`\`\``,
    hints: [
      "You need four functions: `paste()`, `toupper()`, `nchar()` and `round()`.",
      "`full_name <- toupper(paste(first_name, last_name))` joins the names with a space and then capitalises them. For rounding, give `round()` a second argument: `digits = 1`.",
      "`name_length <- nchar(full_name)`, `rounded_score <- round(score, digits = 1)`, `badge <- paste(full_name, \"scored\", rounded_score)`, then `print(badge)`.",
    ],
    solution: `first_name <- "ada"
last_name <- "lovelace"
score <- 87.456
# 1. Full name in capitals
full_name <- toupper(paste(first_name, last_name))
# 2. Number of characters in the full name
name_length <- nchar(full_name)
# 3. Score rounded to 1 decimal place
rounded_score <- round(score, digits = 1)
# 4. Build the badge text and print it
badge <- paste(full_name, "scored", rounded_score)
print(badge)`,
    explanation: `- \`paste(first_name, last_name)\` gives \`"ada lovelace"\`; wrapping it in \`toupper()\` gives \`"ADA LOVELACE"\`. R works from the inside out. (\`paste(toupper(first_name), toupper(last_name))\` works too.)
- \`nchar(full_name)\` counts 3 letters + 1 space + 8 letters = 12.
- \`round(score, digits = 1)\` keeps one decimal place: 87.456 → 87.5.
- \`paste(full_name, "scored", rounded_score)\` joins the three pieces with spaces, converting the number to text automatically.
- \`print(badge)\` shows \`[1] "ADA LOVELACE scored 87.5"\`.`,
    tests: [
      { name: "`full_name` is \"ADA LOVELACE\"", check: `.defined("full_name") && identical(full_name, "ADA LOVELACE")`, failMessage: "`full_name` should be \"ADA LOVELACE\": join the names with `paste()` (which adds a space) and capitalise with `toupper()`." },
      { name: "`name_length` is 12", check: `.defined("name_length") && isTRUE(all.equal(as.numeric(name_length), 12))`, failMessage: "Use `nchar(full_name)` – it should count 12 characters, including the space." },
      { name: "`rounded_score` is 87.5", check: `.defined("rounded_score") && isTRUE(all.equal(rounded_score, 87.5))`, failMessage: "Round with `round(score, digits = 1)`." },
      { name: "`badge` is \"ADA LOVELACE scored 87.5\"", check: `.defined("badge") && identical(badge, "ADA LOVELACE scored 87.5")`, failMessage: "Build the badge with `paste(full_name, \"scored\", rounded_score)` – `paste()` adds the spaces for you." },
      { name: "The badge is printed", check: `grepl("ADA LOVELACE scored 87.5", .out, fixed = TRUE)`, failMessage: "Finish with `print(badge)`." },
    ],
  },
  {
    id: "m2-fix-the-errors",
    title: "Debug the shopping program",
    difficulty: "challenge",
    module: 2,
    lesson: "functions-and-error-messages",
    concepts: ["error-messages", "case-sensitivity", "type-conversion"],
    prompt: `This program should work out the cost of 4 notebooks at 12.50 each, take off a discount of 5, and print \`"You pay 45"\`. But it contains **three bugs**.

Run it, read the first error message, fix that bug and run again – repeat until the program works. Each error message tells you what is wrong. (Stuck? Try the Error Detective page.)`,
    starterCode: `# Fix the bugs so the whole program runs.
item_price <- "12.5"
quantity <- 4
total_cost <- item_price * quantity
discount <- 5
final_cost <- total_cost - Discount
Print(paste("You pay", final_cost))
`,
    expected: `The program runs without errors and prints:

\`\`\`
[1] "You pay 45"
\`\`\``,
    hints: [
      "The first error is \"non-numeric argument to binary operator\". Which variable holds text instead of a number?",
      "Bug 2 is \"object 'Discount' not found\" – compare the capital letters with the line where `discount` is created. Bug 3 is \"could not find function\".",
      "Remove the quotes: `item_price <- 12.5`. Use `discount` with a small d. Use `print` with a small p.",
    ],
    solution: `# Fix the bugs so the whole program runs.
item_price <- 12.5
quantity <- 4
total_cost <- item_price * quantity
discount <- 5
final_cost <- total_cost - discount
print(paste("You pay", final_cost))`,
    explanation: `Fixing errors one at a time, in the order R reports them:

1. \`non-numeric argument to binary operator\` on the \`total_cost\` line: \`item_price\` was the text \`"12.5"\`. Removing the quotes makes it a number (\`as.numeric(item_price)\` would also work). Now \`total_cost\` is 12.5 × 4 = 50.
2. \`object 'Discount' not found\`: the variable was created as \`discount\`. R is case-sensitive, so the name must match exactly. \`final_cost\` is 50 − 5 = 45.
3. \`could not find function "Print"\`: the function is \`print\` with a small p.

Notice that the first error appeared on line 4, but the real cause was on line 2 – the line R stops on is where the problem *shows up*, not always where it *starts*.`,
    tests: [
      { name: "The program runs without an error", check: `is.null(.error)`, failMessage: "R still stops with an error. Read the message, fix that one bug, and run again." },
      { name: "`total_cost` is 50", check: `.defined("total_cost") && isTRUE(all.equal(total_cost, 50))`, failMessage: "`total_cost` should be 12.5 × 4 = 50. Make sure `item_price` is a number, not text." },
      { name: "`final_cost` is 45", check: `.defined("final_cost") && isTRUE(all.equal(final_cost, 45))`, failMessage: "`final_cost` should be 50 − 5 = 45. Check the spelling (and capitals) of `discount`." },
      { name: "Prints \"You pay 45\"", check: `grepl("You pay 45", .out, fixed = TRUE)`, failMessage: "The last line should print the message – remember that R's function is `print`, all lower case." },
    ],
  },
];
