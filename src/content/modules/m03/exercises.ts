import type { Exercise } from "../../types";

export const m03Exercises: Exercise[] = [
  {
    id: "m3-vector-basics",
    title: "A week of temperatures",
    difficulty: "easy",
    module: 3,
    lesson: "vectors",
    concepts: ["creating-vectors", "vector-length", "vectorized-arithmetic"],
    prompt:
      "The daily high temperatures (in °C) for one week were **18, 21, 24, 19, 25, 27 and 22**.\n\n" +
      "1. Store them, in that order, in a vector called `temps`.\n" +
      "2. Store the number of days in `n_days` (use `length()`).\n" +
      "3. Store the average temperature in `avg_temp`.\n" +
      "4. Store the highest temperature in `hottest`.\n" +
      "5. Convert every temperature to Fahrenheit with the formula `temps * 9 / 5 + 32` and store the result in `temps_f`.",
    starterCode: `# 1. Create the vector temps
temps <- c(18, 21)

# 2. Number of days


# 3. Average temperature


# 4. Highest temperature


# 5. Temperatures in Fahrenheit

`,
    expected: "`temps` holds 7 values, `n_days` is 7, `avg_temp` is about 22.29, `hottest` is 27 and `temps_f` starts with 64.4.",
    hints: [
      "Put all seven numbers inside `c()`, separated by commas.",
      "`length(temps)`, `mean(temps)` and `max(temps)` give you the next three answers.",
      "Arithmetic works on the whole vector at once: `temps_f <- temps * 9 / 5 + 32`.",
    ],
    solution: `temps <- c(18, 21, 24, 19, 25, 27, 22)
n_days <- length(temps)
avg_temp <- mean(temps)
hottest <- max(temps)
temps_f <- temps * 9 / 5 + 32
avg_temp
temps_f`,
    explanation:
      "- `c(18, 21, 24, 19, 25, 27, 22)` combines the seven temperatures into one numeric vector, stored in `temps`.\n" +
      "- `length(temps)` counts the values: 7.\n" +
      "- `mean(temps)` adds them up (156) and divides by 7, giving about 22.29.\n" +
      "- `max(temps)` finds the largest value, 27.\n" +
      "- `temps * 9 / 5 + 32` is vectorized: R converts all seven values in one step, so `temps_f` is a new vector of seven Fahrenheit values (64.4, 69.8, …).",
    tests: [
      {
        name: "`temps` holds the seven temperatures in order",
        check: `.defined("temps") && isTRUE(all.equal(as.numeric(temps), c(18, 21, 24, 19, 25, 27, 22)))`,
        failMessage: "`temps` should be `c(18, 21, 24, 19, 25, 27, 22)` – check that all seven values are there, in the given order.",
      },
      {
        name: "`n_days` is 7",
        check: `.defined("n_days") && isTRUE(all.equal(as.numeric(n_days), 7))`,
        failMessage: "Use `n_days <- length(temps)`.",
      },
      {
        name: "`avg_temp` is the mean temperature",
        check: `.defined("avg_temp") && isTRUE(all.equal(avg_temp, mean(c(18, 21, 24, 19, 25, 27, 22))))`,
        failMessage: "`avg_temp` should be `mean(temps)` (about 22.29).",
      },
      {
        name: "`hottest` is 27",
        check: `.defined("hottest") && isTRUE(all.equal(as.numeric(hottest), 27))`,
        failMessage: "Use `max()` to find the highest temperature.",
      },
      {
        name: "`temps_f` holds the Fahrenheit temperatures",
        check: `.defined("temps_f") && isTRUE(all.equal(as.numeric(temps_f), c(18, 21, 24, 19, 25, 27, 22) * 9 / 5 + 32))`,
        failMessage: "`temps_f` should be `temps * 9 / 5 + 32` – one Fahrenheit value for each of the seven days.",
      },
    ],
  },
  {
    id: "m3-vector-indexing",
    title: "Shopping list detective",
    difficulty: "medium",
    module: 3,
    lesson: "vectors",
    concepts: ["indexing", "negative-indexing", "logical-indexing", "modifying-vectors"],
    prompt:
      "You have two vectors: the items on a shopping list and their prices (in the same order).\n\n" +
      "1. Store the **first three** prices in `first_three`.\n" +
      "2. Store all prices **except the last one** in `without_last`.\n" +
      "3. Store the **names** of the items that cost **more than 10** in `expensive_items`.\n" +
      "4. Store **how many** items cost more than 10 in `n_expensive`.\n" +
      "5. The cheese was mispriced: change the price of `\"cheese\"` (position 4) to `8.5` in `prices` itself.",
    starterCode: `items <- c("bread", "coffee", "apples", "cheese", "milk", "olive oil")
prices <- c(2.5, 12, 4.25, 30, 1.8, 18)

# 1. The first three prices
first_three <- prices[1]

# 2. All prices except the last one


# 3. Names of the items that cost more than 10


# 4. How many items cost more than 10


# 5. Change the cheese price to 8.5

`,
    expected: "`first_three` is `2.5 12 4.25`, `without_last` has 5 prices, `expensive_items` is `\"coffee\" \"cheese\" \"olive oil\"`, `n_expensive` is 3, and `prices[4]` is 8.5 afterwards.",
    hints: [
      "Several positions go inside `c()` or use `:` – for example `prices[1:3]`. A minus sign leaves a position out.",
      "`prices > 10` gives TRUE/FALSE for every price. Use it inside `items[ ]` to get names, and inside `sum()` to count.",
      "Do steps 3 and 4 **before** step 5 (the new cheese price is not above 10). Step 5 is `prices[4] <- 8.5`.",
    ],
    solution: `items <- c("bread", "coffee", "apples", "cheese", "milk", "olive oil")
prices <- c(2.5, 12, 4.25, 30, 1.8, 18)

first_three <- prices[1:3]
without_last <- prices[-length(prices)]
expensive_items <- items[prices > 10]
n_expensive <- sum(prices > 10)
prices[4] <- 8.5

expensive_items
prices`,
    explanation:
      "- `prices[1:3]` uses the vector of positions 1, 2, 3.\n" +
      "- `prices[-length(prices)]` removes the last position. `length(prices)` is 6, so this is the same as `prices[-6]`, but it keeps working if the list grows.\n" +
      "- `prices > 10` is `FALSE TRUE FALSE TRUE FALSE TRUE`. Because `items` is in the same order, `items[prices > 10]` picks the matching names.\n" +
      "- `sum(prices > 10)` counts the `TRUE` values: 3.\n" +
      "- `prices[4] <- 8.5` replaces the value at position 4. We do it last so that the old price still counts in steps 3 and 4.",
    tests: [
      {
        name: "`first_three` holds the first three prices",
        check: `.defined("first_three") && isTRUE(all.equal(first_three, c(2.5, 12, 4.25)))`,
        failMessage: "`first_three` should be `prices[1:3]` (or `prices[c(1, 2, 3)]`).",
      },
      {
        name: "`without_last` holds every price but the last",
        check: `.defined("without_last") && isTRUE(all.equal(without_last, c(2.5, 12, 4.25, 30, 1.8)))`,
        failMessage: "Leave out position 6 with a negative index: `prices[-6]` or `prices[-length(prices)]`. Do this before you change the cheese price.",
      },
      {
        name: "`expensive_items` names the items over 10",
        check: `.defined("expensive_items") && identical(as.character(expensive_items), c("coffee", "cheese", "olive oil"))`,
        failMessage: "Use the condition on the prices to pick from the names: `items[prices > 10]` (before changing the cheese price).",
      },
      {
        name: "`n_expensive` is 3",
        check: `.defined("n_expensive") && isTRUE(all.equal(as.numeric(n_expensive), 3))`,
        failMessage: "Count the TRUE values with `sum(prices > 10)` – before you change the cheese price.",
      },
      {
        name: "The cheese now costs 8.5",
        check: `.defined("prices") && length(prices) == 6 && isTRUE(all.equal(prices[4], 8.5))`,
        failMessage: "Change the value inside `prices` with `prices[4] <- 8.5`.",
      },
    ],
  },
  {
    id: "m3-list-basics",
    title: "Milo's pet record",
    difficulty: "easy",
    module: 3,
    lesson: "lists-matrices-factors",
    concepts: ["lists", "list-indexing"],
    prompt:
      "A vet keeps one record per pet. Build Milo's record as a list.\n\n" +
      "1. Create a list called `pet` with four named elements: `name` = `\"Milo\"`, `species` = `\"cat\"`, `age` = `4` and `weights` = the vector `c(4.1, 4.3, 4.2)` (his last three weigh-ins in kg).\n" +
      "2. Store Milo's average weight in `avg_weight` – get the weights out of the list first.\n" +
      "3. Milo just had a birthday: change his `age` in the list to `5`.\n" +
      "4. Add a new element called `vaccinated` with the value `TRUE`.",
    starterCode: `# 1. Create the list pet
pet <- list(name = "Milo")

# 2. Average weight


# 3. Change the age to 5


# 4. Add the element vaccinated

`,
    expected: "`pet` is a list with five elements (name, species, age, weights, vaccinated), `pet$age` is 5 and `avg_weight` is 4.2.",
    hints: [
      "Inside `list()`, write each element as `name = value`, separated by commas.",
      "`pet$weights` gives you the numeric vector, so `mean(pet$weights)` works.",
      "Assigning to an element changes it or creates it: `pet$age <- 5` and `pet$vaccinated <- TRUE`.",
    ],
    solution: `pet <- list(name = "Milo", species = "cat", age = 4, weights = c(4.1, 4.3, 4.2))
avg_weight <- mean(pet$weights)
pet$age <- 5
pet$vaccinated <- TRUE
str(pet)`,
    explanation:
      "- `list(name = \"Milo\", species = \"cat\", age = 4, weights = c(4.1, 4.3, 4.2))` creates a list whose elements have different types (text, number, numeric vector) – something a vector could not hold.\n" +
      "- `pet$weights` takes the vector out of the list, so `mean()` can average it: (4.1 + 4.3 + 4.2) / 3 = 4.2. `mean(pet[[\"weights\"]])` works too, but `mean(pet[\"weights\"])` would not, because single brackets return a list.\n" +
      "- `pet$age <- 5` replaces the existing value.\n" +
      "- `pet$vaccinated <- TRUE` adds a fifth element, because no element of that name existed yet.\n" +
      "- `str(pet)` prints a compact overview so you can check your work.",
    tests: [
      {
        name: "`pet` is a list",
        check: `.defined("pet") && is.list(pet)`,
        failMessage: "Create `pet` with `list()`, not `c()`.",
      },
      {
        name: "`pet` has the right name, species and weights",
        check: `identical(pet$name, "Milo") && identical(pet$species, "cat") && isTRUE(all.equal(pet$weights, c(4.1, 4.3, 4.2)))`,
        failMessage: "Check the elements `name = \"Milo\"`, `species = \"cat\"` and `weights = c(4.1, 4.3, 4.2)` – names and values must match exactly.",
      },
      {
        name: "`avg_weight` is the mean of the weights",
        check: `.defined("avg_weight") && isTRUE(all.equal(as.numeric(avg_weight), 4.2))`,
        failMessage: "Use `avg_weight <- mean(pet$weights)`.",
      },
      {
        name: "Milo's age is now 5",
        check: `isTRUE(all.equal(pet$age, 5))`,
        failMessage: "Change the element with `pet$age <- 5`.",
      },
      {
        name: "`pet$vaccinated` is TRUE",
        check: `isTRUE(pet$vaccinated)`,
        failMessage: "Add the new element with `pet$vaccinated <- TRUE`.",
      },
    ],
  },
  {
    id: "m3-matrix-practice",
    title: "Cinema ticket grid",
    difficulty: "medium",
    module: 3,
    lesson: "lists-matrices-factors",
    concepts: ["matrices", "matrix-indexing", "rbind-cbind"],
    prompt:
      "A small cinema shows three films, each in a morning and an evening show. The two vectors in the starter code hold the tickets sold for film 1, 2 and 3.\n\n" +
      "1. Use `rbind()` to combine `morning` and `evening` into a matrix called `tickets` (row 1 = morning, row 2 = evening, one column per film).\n" +
      "2. The morning count for film 1 was typed wrongly: change the value in row 1, column 1 of `tickets` to `15`.\n" +
      "3. Store all ticket counts of **film 2** (the whole of column 2) in `film2`.\n" +
      "4. Store the number of tickets for the **evening** show of **film 3** in `evening_film3`.\n" +
      "5. Store the total number of tickets sold (all shows) in `total_tickets`.",
    starterCode: `morning <- c(12, 30, 25)
evening <- c(40, 55, 61)

# 1. Combine the vectors into the matrix tickets
tickets <- morning

# 2. Fix row 1, column 1


# 3. Column 2 (film 2)


# 4. Evening show of film 3


# 5. Total tickets

`,
    expected: "`tickets` is a 2 × 3 matrix, `film2` is `30 55`, `evening_film3` is 61 and `total_tickets` is 226.",
    hints: [
      "`rbind(morning, evening)` makes each vector one row.",
      "Inside `[row, column]` the row comes first: `tickets[1, 1] <- 15`. Leave the row empty to get a whole column: `tickets[, 2]`.",
      "`sum()` works on a whole matrix, just like on a vector: `total_tickets <- sum(tickets)`.",
    ],
    solution: `morning <- c(12, 30, 25)
evening <- c(40, 55, 61)

tickets <- rbind(morning, evening)
tickets[1, 1] <- 15
film2 <- tickets[, 2]
evening_film3 <- tickets[2, 3]
total_tickets <- sum(tickets)

tickets
total_tickets`,
    explanation:
      "- `rbind(morning, evening)` stacks the two vectors as rows, giving a 2 × 3 matrix whose rows are labelled `morning` and `evening`.\n" +
      "- `tickets[1, 1] <- 15` replaces the value in row 1, column 1 (it was 12).\n" +
      "- `tickets[, 2]` leaves the row position empty, which means \"all rows\", so you get both shows of film 2: 30 and 55.\n" +
      "- `tickets[2, 3]` is row 2 (evening), column 3 (film 3): 61.\n" +
      "- `sum(tickets)` adds every value in the grid: 15 + 30 + 25 + 40 + 55 + 61 = 226.",
    tests: [
      {
        name: "`tickets` is a matrix with 2 rows and 3 columns",
        check: `.defined("tickets") && is.matrix(tickets) && identical(as.integer(dim(tickets)), c(2L, 3L))`,
        failMessage: "Create `tickets` with `rbind(morning, evening)` – that gives 2 rows and 3 columns.",
      },
      {
        name: "`tickets` holds the corrected counts",
        check: `isTRUE(all.equal(unname(tickets), matrix(c(15, 40, 30, 55, 25, 61), nrow = 2)))`,
        failMessage: "Row 1 should be 15 30 25 and row 2 should be 40 55 61. Did you change `tickets[1, 1]` to 15?",
      },
      {
        name: "`film2` is column 2",
        check: `.defined("film2") && isTRUE(all.equal(as.numeric(film2), c(30, 55)))`,
        failMessage: "Get the whole second column with `tickets[, 2]` (empty row position, then 2).",
      },
      {
        name: "`evening_film3` is 61",
        check: `.defined("evening_film3") && isTRUE(all.equal(as.numeric(evening_film3), 61))`,
        failMessage: "Evening is row 2 and film 3 is column 3: `tickets[2, 3]`.",
      },
      {
        name: "`total_tickets` is 226",
        check: `.defined("total_tickets") && isTRUE(all.equal(as.numeric(total_tickets), 226))`,
        failMessage: "Use `sum(tickets)` after correcting the first value.",
      },
    ],
  },
  {
    id: "m3-factor-counts",
    title: "Customer satisfaction levels",
    difficulty: "medium",
    module: 3,
    lesson: "lists-matrices-factors",
    concepts: ["factors", "factor-levels", "ordered-factors", "frequency-tables"],
    prompt:
      "Eight customers rated a service as `\"low\"`, `\"medium\"` or `\"high\"`. The answers are in `responses`.\n\n" +
      "1. Turn `responses` into an **ordered factor** called `satisfaction` with the levels in the order low < medium < high.\n" +
      "2. Store a frequency table of `satisfaction` in `counts`.\n" +
      "3. Store the number of `\"high\"` answers in `n_high`.\n" +
      "4. Store the number of answers that are **medium or better** in `at_least_medium`.",
    starterCode: `responses <- c("high", "low", "medium", "high", "high", "medium", "low", "high")

# 1. Ordered factor
satisfaction <- factor(responses)

# 2. Frequency table


# 3. Number of "high" answers


# 4. Number of answers that are medium or better

`,
    expected: "`levels(satisfaction)` is `\"low\" \"medium\" \"high\"`, `counts` shows 2, 2 and 4, `n_high` is 4 and `at_least_medium` is 6.",
    hints: [
      "`factor()` needs two extra arguments: `levels = c(\"low\", \"medium\", \"high\")` and `ordered = TRUE`.",
      "`table(satisfaction)` counts each level. A comparison such as `satisfaction == \"high\"` gives TRUE/FALSE values that `sum()` can count.",
      "Because the factor is ordered, `satisfaction >= \"medium\"` works – wrap it in `sum()`.",
    ],
    solution: `responses <- c("high", "low", "medium", "high", "high", "medium", "low", "high")

satisfaction <- factor(responses, levels = c("low", "medium", "high"), ordered = TRUE)
counts <- table(satisfaction)
n_high <- sum(satisfaction == "high")
at_least_medium <- sum(satisfaction >= "medium")

counts
at_least_medium`,
    explanation:
      "- `factor(responses, levels = c(\"low\", \"medium\", \"high\"), ordered = TRUE)` creates a factor whose levels follow the natural order instead of the alphabet (which would give high, low, medium).\n" +
      "- `table(satisfaction)` counts each level in that order: low 2, medium 2, high 4.\n" +
      "- `satisfaction == \"high\"` is TRUE for each \"high\" answer; `sum()` counts them: 4. (`counts[[\"high\"]]` gives the same number.)\n" +
      "- `satisfaction >= \"medium\"` only works because the factor is **ordered**: R knows that high is above medium. Counting the TRUE values gives 2 + 4 = 6.",
    tests: [
      {
        name: "`satisfaction` is an ordered factor",
        check: `.defined("satisfaction") && is.ordered(satisfaction)`,
        failMessage: "Add `ordered = TRUE` inside `factor()`.",
      },
      {
        name: "The levels are low, medium, high (in that order)",
        check: `identical(levels(satisfaction), c("low", "medium", "high")) && identical(as.character(satisfaction), responses)`,
        failMessage: "Give the levels in order: `levels = c(\"low\", \"medium\", \"high\")`, and build the factor from `responses`.",
      },
      {
        name: "`counts` is the frequency table",
        check: `.defined("counts") && inherits(counts, "table") && isTRUE(all.equal(as.vector(counts), c(2, 2, 4)))`,
        failMessage: "Use `counts <- table(satisfaction)` (after creating the ordered factor).",
      },
      {
        name: "`n_high` is 4",
        check: `.defined("n_high") && isTRUE(all.equal(as.numeric(n_high), 4))`,
        failMessage: "Count the \"high\" answers, for example with `sum(satisfaction == \"high\")`.",
      },
      {
        name: "`at_least_medium` is 6",
        check: `.defined("at_least_medium") && isTRUE(all.equal(as.numeric(at_least_medium), 6))`,
        failMessage: "Medium or better means `satisfaction >= \"medium\"`. Count the TRUE values with `sum()`.",
      },
    ],
  },
  {
    id: "m3-data-frame-basics",
    title: "My reading list",
    difficulty: "easy",
    module: 3,
    lesson: "data-frames",
    concepts: ["creating-data-frames", "dollar-operator", "adding-columns", "modifying-data"],
    prompt:
      "Build a small table of books.\n\n" +
      "1. Create a data frame called `books` with three columns:\n" +
      "   - `title`: `\"Matilda\"`, `\"Dune\"`, `\"Holes\"`, `\"Wonder\"`\n" +
      "   - `pages`: `240`, `412`, `233`, `310`\n" +
      "   - `read`: `TRUE`, `FALSE`, `TRUE`, `FALSE`\n" +
      "2. Store the average number of pages in `avg_pages`.\n" +
      "3. Add a column called `long` that is `TRUE` for books with **more than 300 pages**.\n" +
      "4. You just finished *Dune* (row 2): change its `read` value to `TRUE`.",
    starterCode: `# 1. Create the data frame books
books <- data.frame(
  title = c("Matilda", "Dune", "Holes", "Wonder")
)

# 2. Average number of pages


# 3. Add the column long


# 4. Mark Dune as read


books
`,
    expected: "`books` has 4 rows and the columns title, pages, read and long; `avg_pages` is 298.75; `long` is `FALSE TRUE FALSE TRUE`; `read` is `TRUE TRUE TRUE FALSE`.",
    hints: [
      "Inside `data.frame()`, add `pages = c(...)` and `read = c(...)` after the title column, separated by commas.",
      "A column is a vector: `mean(books$pages)` gives the average, and `books$pages > 300` gives TRUE/FALSE for each book.",
      "Store the comparison as a new column with `books$long <- books$pages > 300`, and change one value with `books$read[2] <- TRUE`.",
    ],
    solution: `books <- data.frame(
  title = c("Matilda", "Dune", "Holes", "Wonder"),
  pages = c(240, 412, 233, 310),
  read = c(TRUE, FALSE, TRUE, FALSE)
)
avg_pages <- mean(books$pages)
books$long <- books$pages > 300
books$read[2] <- TRUE
books`,
    explanation:
      "- `data.frame()` takes one `name = vector` pair per column. All three vectors have four values, one per book.\n" +
      "- `books$pages` is the pages column as a numeric vector, so `mean()` gives (240 + 412 + 233 + 310) / 4 = 298.75.\n" +
      "- `books$pages > 300` compares every book at once and gives `FALSE TRUE FALSE TRUE`. Assigning it to `books$long` stores it as a new logical column.\n" +
      "- `books$read[2] <- TRUE` changes position 2 of the `read` column. `books[2, \"read\"] <- TRUE` does exactly the same.",
    tests: [
      {
        name: "`books` is a data frame with 4 rows",
        check: `.defined("books") && is.data.frame(books) && nrow(books) == 4`,
        failMessage: "Create `books` with `data.frame()` – each column needs four values.",
      },
      {
        name: "`books` has the title and pages columns",
        check: `identical(as.character(books$title), c("Matilda", "Dune", "Holes", "Wonder")) && isTRUE(all.equal(as.numeric(books$pages), c(240, 412, 233, 310)))`,
        failMessage: "Check the columns `title` and `pages` – names are lower case and the values must be in the given order.",
      },
      {
        name: "`avg_pages` is 298.75",
        check: `.defined("avg_pages") && isTRUE(all.equal(as.numeric(avg_pages), 298.75))`,
        failMessage: "Use `avg_pages <- mean(books$pages)`.",
      },
      {
        name: "The `long` column marks books over 300 pages",
        check: `"long" %in% names(books) && identical(as.logical(books$long), c(FALSE, TRUE, FALSE, TRUE))`,
        failMessage: "Add the column with `books$long <- books$pages > 300`.",
      },
      {
        name: "Dune is now marked as read",
        check: `"read" %in% names(books) && identical(as.logical(books$read), c(TRUE, TRUE, TRUE, FALSE))`,
        failMessage: "Create the `read` column as `c(TRUE, FALSE, TRUE, FALSE)`, then change row 2 with `books$read[2] <- TRUE`.",
      },
    ],
  },
  {
    id: "m3-data-frame-filter",
    title: "Class reports from real data",
    difficulty: "challenge",
    module: 3,
    lesson: "data-frames",
    datasets: ["students"],
    concepts: ["filtering-rows", "data-frame-indexing", "adding-columns", "dollar-operator"],
    prompt:
      "The school wants a few quick facts from `data/students.csv` (60 students, with columns such as `name`, `class`, `math` and `reading`).\n\n" +
      "1. Store all rows (and all columns) of the students in class `\"B\"` in `class_b`.\n" +
      "2. Store the number of students in class B in `n_class_b`.\n" +
      "3. Store the **names** of all students with a math score of **90 or more** in `top_math` (a character vector).\n" +
      "4. Add a column called `average` to `students`: each student's average of `math` and `reading`.\n" +
      "5. Store the rows of the students who are in class `\"A\"` **and** have an `average` of **85 or more** in `stars`.",
    starterCode: `students <- read.csv("data/students.csv")

# 1. Students in class B
class_b <- students

# 2. Number of students in class B


# 3. Names of students with math >= 90


# 4. Add the column average


# 5. Class A students with an average of at least 85

`,
    expected: "`class_b` has 22 rows, `n_class_b` is 22, `top_math` has 7 names starting with \"Chloe\", `students$average` exists, and `stars` has 6 rows (Tara, Fatima, Lena, Yara, Zane and Gina).",
    hints: [
      "Filtering rows looks like `students[condition, ]` – the condition goes before the comma, e.g. `students$class == \"B\"`.",
      "For names only, put the column name after the comma: `students[students$math >= 90, \"name\"]`. Count rows with `nrow()`. The new column is `(students$math + students$reading) / 2`.",
      "Combine two conditions with `&`: `students[students$class == \"A\" & students$average >= 85, ]`. Add the `average` column before step 5.",
    ],
    solution: `students <- read.csv("data/students.csv")

class_b <- students[students$class == "B", ]
n_class_b <- nrow(class_b)
top_math <- students[students$math >= 90, "name"]
students$average <- (students$math + students$reading) / 2
stars <- students[students$class == "A" & students$average >= 85, ]

n_class_b
top_math
stars[, c("name", "average")]`,
    explanation:
      "- `students$class == \"B\"` is TRUE for every student in class B; on the row side of `[ , ]` it keeps those 22 rows, and the empty column side keeps all columns.\n" +
      "- `nrow(class_b)` counts the rows of the filtered table. (`sum(students$class == \"B\")` would also work.)\n" +
      "- `students[students$math >= 90, \"name\"]` filters the rows **and** selects the `name` column, so the result is a character vector of 7 names.\n" +
      "- `(students$math + students$reading) / 2` is vectorized: R adds the two columns position by position and halves every result. Assigning it to `students$average` adds the column.\n" +
      "- `&` means **and**: a row is kept only when both conditions are TRUE. Six class A students have an average of 85 or more.",
    tests: [
      {
        name: "`class_b` holds exactly the class B students",
        check: `.defined("class_b") && is.data.frame(class_b) && { s <- read.csv("data/students.csv"); identical(class_b$student_id, s$student_id[s$class == "B"]) }`,
        failMessage: "Filter the rows with `students[students$class == \"B\", ]` – don't forget the comma.",
      },
      {
        name: "`n_class_b` is 22",
        check: `.defined("n_class_b") && isTRUE(all.equal(as.numeric(n_class_b), 22))`,
        failMessage: "Count the rows of `class_b` with `nrow(class_b)`.",
      },
      {
        name: "`top_math` holds the names of the students with math >= 90",
        check: `.defined("top_math") && { s <- read.csv("data/students.csv"); identical(sort(as.character(top_math)), sort(s$name[s$math >= 90])) }`,
        failMessage: "Use `students[students$math >= 90, \"name\"]` – 90 itself counts, so use `>=`. The result should be names, not whole rows.",
      },
      {
        name: "`students` has a correct `average` column",
        check: `.defined("students") && "average" %in% names(students) && isTRUE(all.equal(as.numeric(students$average), (students$math + students$reading) / 2))`,
        failMessage: "Add the column with `students$average <- (students$math + students$reading) / 2`.",
      },
      {
        name: "`stars` holds the class A students with an average of 85 or more",
        check: `.defined("stars") && is.data.frame(stars) && { s <- read.csv("data/students.csv"); a <- (s$math + s$reading) / 2; identical(sort(stars$student_id), sort(s$student_id[s$class == "A" & a >= 85])) }`,
        failMessage: "Combine both conditions with `&` inside the row side: `students[students$class == \"A\" & students$average >= 85, ]`.",
      },
    ],
  },
  {
    id: "m3-students-checkup",
    title: "Health check for a dataset",
    difficulty: "challenge",
    module: 3,
    lesson: "missing-values-and-inspection",
    datasets: ["students"],
    concepts: ["data-inspection", "data-dimensions", "missing-values", "is-na", "na-rm"],
    prompt:
      "Before analysing a dataset, a good analyst checks its size and looks for missing values. Do a check-up of `data/students.csv`.\n\n" +
      "1. Store the number of rows in `n_students` and the number of columns in `n_columns`.\n" +
      "2. Store the number of missing values in the `science` column in `n_missing`.\n" +
      "3. Store the average science score, **ignoring** missing values, in `avg_science`.\n" +
      "4. Store the **names** of the students whose science score is missing in `missing_names`.\n" +
      "5. Store the average science score of the students in class `\"A\"` (ignoring missing values) in `class_a_science`.",
    starterCode: `students <- read.csv("data/students.csv")

# Have a look first
str(students)

# 1. Size of the dataset
n_students <- 0
n_columns <- 0

# 2. Missing science scores


# 3. Average science score (ignore NA)


# 4. Names of students with a missing science score


# 5. Average science score in class A (ignore NA)

`,
    expected: "`n_students` is 60, `n_columns` is 10, `n_missing` is 3, `avg_science` is about 74.3, `missing_names` is `\"Grace\" \"Wei\" \"Oscar\"` and `class_a_science` is about 73.59.",
    hints: [
      "`nrow()` and `ncol()` give the size. `is.na()` marks each missing value with TRUE, and `sum()` counts the TRUEs.",
      "`mean()` needs `na.rm = TRUE` to skip the missing values. To get names, use `is.na(students$science)` as a condition on `students$name`.",
      "For step 5, pick the class A science scores first – `students$science[students$class == \"A\"]` – and then take their `mean()` with `na.rm = TRUE`.",
    ],
    solution: `students <- read.csv("data/students.csv")

n_students <- nrow(students)
n_columns <- ncol(students)
n_missing <- sum(is.na(students$science))
avg_science <- mean(students$science, na.rm = TRUE)
missing_names <- students$name[is.na(students$science)]
class_a_science <- mean(students$science[students$class == "A"], na.rm = TRUE)

n_missing
missing_names
round(class_a_science, 2)`,
    explanation:
      "- `nrow()` and `ncol()` return 60 and 10.\n" +
      "- `is.na(students$science)` gives one TRUE/FALSE per student; `sum()` counts the TRUEs, so `n_missing` is 3.\n" +
      "- Without `na.rm = TRUE`, `mean()` would return `NA`, because one unknown value makes the total unknown. With it, R averages the 57 known scores: about 74.3.\n" +
      "- `students$name[is.na(students$science)]` uses the TRUE/FALSE vector to pick names – logical indexing on one vector, using a condition on another.\n" +
      "- `students$science[students$class == \"A\"]` keeps the science scores of class A only. One of them (Wei's) is missing, so `na.rm = TRUE` is needed again; the result is about 73.59.",
    tests: [
      {
        name: "`n_students` is 60 and `n_columns` is 10",
        check: `.defined("n_students") && .defined("n_columns") && isTRUE(all.equal(as.numeric(n_students), 60)) && isTRUE(all.equal(as.numeric(n_columns), 10))`,
        failMessage: "Use `nrow(students)` and `ncol(students)`.",
      },
      {
        name: "`n_missing` is 3",
        check: `.defined("n_missing") && isTRUE(all.equal(as.numeric(n_missing), 3))`,
        failMessage: "Count the missing science scores with `sum(is.na(students$science))`.",
      },
      {
        name: "`avg_science` ignores the missing values",
        check: `.defined("avg_science") && isTRUE(all.equal(as.numeric(avg_science), mean(read.csv("data/students.csv")$science, na.rm = TRUE)))`,
        failMessage: "`avg_science` should not be NA – add `na.rm = TRUE` inside `mean()`.",
      },
      {
        name: "`missing_names` lists Grace, Wei and Oscar",
        check: `.defined("missing_names") && identical(sort(as.character(missing_names)), sort(c("Grace", "Wei", "Oscar")))`,
        failMessage: "Pick names with a condition: `students$name[is.na(students$science)]`.",
      },
      {
        name: "`class_a_science` is the class A average",
        check: `.defined("class_a_science") && isTRUE(all.equal(as.numeric(class_a_science), 73.58824, tolerance = 1e-5))`,
        failMessage: "Filter first, then average: `mean(students$science[students$class == \"A\"], na.rm = TRUE)`. Without `na.rm = TRUE` you get NA, because one class A score is missing.",
      },
    ],
  },
];
