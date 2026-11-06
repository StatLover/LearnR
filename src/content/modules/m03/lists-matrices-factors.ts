import type { Lesson } from "../../types";

export const listsMatricesFactorsLesson: Lesson = {
  id: "lists-matrices-factors",
  module: 3,
  title: "Lists, Matrices and Factors",
  summary: "Meet three more ways to organise data: lists that hold anything, matrices that form a grid, and factors for categories.",
  minutes: 40,
  objectives: [
    "Create a list that holds values of different types and lengths",
    "Get things out of a list with $, [[ ]] and [ ], and explain the difference between [[ ]] and [ ]",
    "Create a matrix and select values with [row, column]",
    "Build a matrix from vectors with rbind() and cbind()",
    "Turn categories into a factor, inspect its levels and count them with table()",
    "Create an ordered factor for categories that have a natural order",
  ],
  intro:
    "Vectors are great, but they have two limits: every value must have the same type, and the values form a single row. Real information is often messier.\n\n" +
    "In this lesson you meet three new containers. A **list** is like a backpack: you can put anything in it – a name, a number, a whole vector – each in its own labelled pocket. A **matrix** is like a spreadsheet grid or a seating plan: values arranged in rows and columns. A **factor** is R's way of storing **categories** such as \"small / medium / large\" or \"yes / no\", so that R knows exactly which categories are allowed.\n\n" +
    "All three appear everywhere in R. Data frames, the tables you will meet in the next lesson, are built from these ideas.",
  sections: [
    {
      id: "lists",
      title: "Lists: one container for many kinds of things",
      blocks: [
        {
          kind: "definition",
          term: "List",
          md: "A container that can hold values of **different types and lengths**. Each item in a list is called an *element*, and elements usually have names.",
        },
        { kind: "diagram", name: "list", caption: "A list holds different kinds of things – text, numbers, whole vectors – in one container." },
        {
          kind: "code",
          example: {
            id: "create-list",
            title: "Creating a list",
            code: `student <- list(name = "Amara", age = 16, scores = c(86, 82, 83), passed = TRUE)
student`,
            explanation: [
              { code: "student <-", text: "Store the result in a variable called `student`." },
              { code: "list(", text: "`list()` creates a list. Like `c()`, it takes values separated by commas." },
              { code: `name = "Amara"`, text: "`name = ` gives this element a **name**. The value is a piece of text." },
              { code: "age = 16", text: "An element called `age` holding a number." },
              { code: "scores = c(86, 82, 83)", text: "An element holding a whole vector of three numbers. A plain vector could never mix this with text!" },
              { code: "passed = TRUE", text: "A logical value." },
            ],
            output: `$name
[1] "Amara"

$age
[1] 16

$scores
[1] 86 82 83

$passed
[1] TRUE`,
            outputNote: "R prints each element under its name, written with a `$` in front (`$name`, `$age`, …). Each element keeps its own type: the text still has quotes, the numbers do not.",
          },
        },
        {
          kind: "text",
          md: "The easiest way to get an element out of a list is the **dollar sign** `$` followed by the element's name. What comes out is the value itself, so you can use it straight away.",
        },
        {
          kind: "code",
          example: {
            id: "list-dollar",
            title: "Getting elements with $",
            code: `student <- list(name = "Amara", age = 16, scores = c(86, 82, 83))

student$name
student$scores
mean(student$scores)`,
            explanation: [
              { code: "student$name", text: "Read it as \"the `name` element of `student`\"." },
              { code: "student$scores", text: "This gives back the vector stored in `scores`." },
              { code: "mean(student$scores)", text: "Because `student$scores` is an ordinary numeric vector, `mean()` works on it." },
            ],
            output: `[1] "Amara"
[1] 86 82 83
[1] 83.66667`,
            tryIt: "Get the age with `student$age` and add 1 to it.",
          },
        },
      ],
    },
    {
      id: "list-brackets",
      title: "[[ ]] versus [ ], and changing a list",
      blocks: [
        {
          kind: "text",
          md: "Lists also have two kinds of square brackets, and the difference matters:\n\n" +
            "- **Double brackets** `[[ ]]` take an element **out** of the list and give you the value inside. `student[[\"age\"]]` is the same as `student$age`. You can also use a position: `student[[3]]`.\n" +
            "- **Single brackets** `[ ]` give you a **smaller list** that still has the element inside it.\n\n" +
            "Think of a list as a train: `[ ]` gives you a carriage (still part of a train, still a list), while `[[ ]]` gives you the cargo **inside** the carriage.",
        },
        {
          kind: "code",
          example: {
            id: "list-brackets",
            title: "[[ ]] versus [ ]",
            code: `student <- list(name = "Amara", age = 16, scores = c(86, 82, 83))

student[["age"]]
student[[3]]
student["age"]

class(student[["age"]])
class(student["age"])`,
            explanation: [
              { code: `student[["age"]]`, text: "Double brackets with a name: the value 16 itself." },
              { code: "student[[3]]", text: "Double brackets with a position: the third element, the scores vector." },
              { code: `student["age"]`, text: "Single brackets: a smaller list that contains the `age` element. Note the `$age` label in the output." },
              { code: `class(student[["age"]])`, text: "The value inside is numeric." },
              { code: `class(student["age"])`, text: "With single brackets you still have a list." },
            ],
            output: `[1] 16
[1] 86 82 83
$age
[1] 16

[1] "numeric"
[1] "list"`,
            outputNote: "Use `$` or `[[ ]]` when you want to **work with** a value (do maths, print it). Single brackets are for when you want to keep a list, for example to select a few elements of it.",
          },
        },
        {
          kind: "text",
          md: "Like vectors, lists can be changed: assign to an element to change it, or assign to a new name to add an element. `names()` lists the element names, `length()` counts them, and `str()` (short for *structure*) gives a compact overview.",
        },
        {
          kind: "code",
          example: {
            id: "list-modify",
            title: "Changing and adding elements",
            code: `student <- list(name = "Amara", age = 16)

student$age <- 17
student$city <- "Lisbon"

length(student)
names(student)
str(student)`,
            explanation: [
              { code: "student$age <- 17", text: "Replace the value of the existing `age` element." },
              { code: `student$city <- "Lisbon"`, text: "There is no `city` element yet, so R adds one." },
              { code: "length(student)", text: "The list now has three elements." },
              { code: "names(student)", text: "The names of the elements, as a character vector." },
              { code: "str(student)", text: "One line per element: its name, its type (`chr` = character, `num` = numeric) and its value." },
            ],
            output: `[1] 3
[1] "name" "age"  "city"
List of 3
 $ name: chr "Amara"
 $ age : num 17
 $ city: chr "Lisbon"`,
          },
        },
        {
          kind: "question",
          question: {
            id: "m3-lmf-q1",
            type: "multiple-choice",
            prompt: "`pet <- list(name = \"Milo\", weights = c(4.1, 4.3))`. Which code gives the **numeric vector** of weights, so that `mean()` can use it?",
            options: ["pet[\"weights\"]", "pet[[\"weights\"]]", "pet(weights)", "weights$pet"],
            answer: 1,
            explanation: "`[[ ]]` (or `pet$weights`) takes the value out of the list. Single brackets would return a list that merely contains the vector.",
            optionFeedback: [
              "Single brackets return a smaller **list**, and `mean()` of a list gives `NA` with a warning.",
              "Correct!",
              "Round brackets are for calling functions; `pet` is a list, not a function.",
              "The list name comes first and the element name after the `$`: `pet$weights`.",
            ],
            concept: "list-indexing",
          },
        },
      ],
    },
    {
      id: "matrices",
      title: "Matrices: values in a grid",
      blocks: [
        {
          kind: "definition",
          term: "Matrix",
          md: "A grid of values arranged in **rows** (going across) and **columns** (going down). Like a vector, every value in a matrix must have the **same type**.",
        },
        {
          kind: "code",
          example: {
            id: "create-matrix",
            title: "Creating a matrix",
            code: `m <- matrix(1:6, nrow = 2, ncol = 3)
m
dim(m)`,
            explanation: [
              { code: "matrix(1:6, nrow = 2, ncol = 3)", text: "`matrix()` takes a vector of values (here 1 to 6) and arranges it into a grid with 2 rows (`nrow`) and 3 columns (`ncol`)." },
              { code: "m", text: "Print the matrix." },
              { code: "dim(m)", text: "`dim()` gives the **dimensions**: number of rows, then number of columns." },
            ],
            output: `     [,1] [,2] [,3]
[1,]    1    3    5
[2,]    2    4    6
[1] 2 3`,
            outputNote: "`[1,]` labels row 1 and `[,1]` labels column 1 – the comma shows which side the number is on. Notice that R filled the grid **column by column**: 1 and 2 went into column 1, 3 and 4 into column 2, and so on.",
          },
        },
        { kind: "diagram", name: "matrix", caption: "Every value in a matrix has an address: [row, column]." },
        {
          kind: "code",
          example: {
            id: "matrix-byrow",
            title: "Filling row by row",
            code: `m <- matrix(1:6, nrow = 2, byrow = TRUE)
m
nrow(m)
ncol(m)`,
            explanation: [
              { code: "matrix(1:6, nrow = 2, byrow = TRUE)", text: "`byrow = TRUE` fills the first row completely before starting the second. We gave only `nrow`, so R works out that 6 values need 3 columns." },
              { code: "nrow(m)", text: "Number of rows." },
              { code: "ncol(m)", text: "Number of columns." },
            ],
            output: `     [,1] [,2] [,3]
[1,]    1    2    3
[2,]    4    5    6
[1] 2
[1] 3`,
          },
        },
        {
          kind: "text",
          md: "To pick values from a matrix you give **two** indexes in the square brackets, separated by a comma: `[row, column]`. **Row always comes first.** Leave one side empty to mean \"all of them\": `m[1, ]` is all of row 1, `m[, 2]` is all of column 2.",
        },
        {
          kind: "code",
          example: {
            id: "matrix-index",
            title: "Selecting with [row, column]",
            code: `m <- matrix(1:6, nrow = 2, ncol = 3)

m[2, 3]
m[1, ]
m[, 2]

m[1, 2] <- 100
m`,
            explanation: [
              { code: "m[2, 3]", text: "Row 2, column 3: the value 6." },
              { code: "m[1, ]", text: "Row 1, every column." },
              { code: "m[, 2]", text: "Every row, column 2." },
              { code: "m[1, 2] <- 100", text: "Change the value in row 1, column 2." },
            ],
            output: `[1] 6
[1] 1 3 5
[1] 3 4
     [,1] [,2] [,3]
[1,]    1  100    5
[2,]    2    4    6`,
            tryIt: "Print just the bottom-left value. Then try `m * 2` – arithmetic on a matrix is vectorized, just like on a vector.",
          },
        },
      ],
    },
    {
      id: "rbind-cbind",
      title: "Building a matrix from vectors: rbind() and cbind()",
      blocks: [
        {
          kind: "text",
          md: "You can also build a matrix by sticking vectors together. `rbind()` (**r**ow **bind**) stacks vectors on top of each other as rows; `cbind()` (**c**olumn **bind**) puts them side by side as columns. The vector names become row or column labels.",
        },
        {
          kind: "code",
          example: {
            id: "rbind-cbind",
            title: "Combining vectors with rbind() and cbind()",
            code: `week1 <- c(5, 8, 2)
week2 <- c(6, 7, 4)

sales_rows <- rbind(week1, week2)
sales_rows

sales_cols <- cbind(week1, week2)
sales_cols`,
            explanation: [
              { code: "week1 <- c(5, 8, 2)", text: "Sales of three products in week 1." },
              { code: "sales_rows <- rbind(week1, week2)", text: "Each vector becomes one **row**, so we get 2 rows and 3 columns." },
              { code: "sales_cols <- cbind(week1, week2)", text: "Each vector becomes one **column**, so we get 3 rows and 2 columns." },
            ],
            output: `      [,1] [,2] [,3]
week1    5    8    2
week2    6    7    4
     week1 week2
[1,]     5     6
[2,]     8     7
[3,]     2     4`,
            outputNote: "The rows (or columns) are now labelled `week1` and `week2` instead of `[1,]` and `[2,]`. You can also use `rbind()` to add a row to an existing matrix: `rbind(sales_rows, c(9, 9, 9))`.",
          },
        },
      ],
    },
    {
      id: "factors",
      title: "Factors: data with categories",
      blocks: [
        {
          kind: "text",
          md: "Many columns of real data are **categories** rather than numbers: a T-shirt size, a country, a yes/no answer. Statisticians call these *categorical variables*. R stores them in a special type called a **factor**.",
        },
        {
          kind: "definition",
          term: "Factor",
          md: "A vector for **categorical data**. A factor stores each value together with the list of allowed categories, which are called its **levels**.",
        },
        {
          kind: "code",
          example: {
            id: "create-factor",
            title: "Creating a factor",
            code: `sizes <- c("small", "large", "medium", "small", "large", "small")
size_factor <- factor(sizes)

size_factor
levels(size_factor)
nlevels(size_factor)`,
            explanation: [
              { code: `sizes <- c("small", "large", "medium", "small", "large", "small")`, text: "An ordinary character vector of six T-shirt sizes." },
              { code: "size_factor <- factor(sizes)", text: "`factor()` turns it into a factor. R finds the different categories and makes them the levels." },
              { code: "levels(size_factor)", text: "`levels()` lists the categories." },
              { code: "nlevels(size_factor)", text: "`nlevels()` counts them." },
            ],
            output: `[1] small  large  medium small  large  small
Levels: large medium small
[1] "large"  "medium" "small"
[1] 3`,
            outputNote: "A factor prints **without quotes**, followed by a `Levels:` line. The values are still in their original order, but the levels are sorted alphabetically – R does not know that \"medium\" belongs between \"small\" and \"large\" (yet!).",
          },
        },
        { kind: "diagram", name: "factor", caption: "Each value of a factor is linked to one of a fixed set of levels." },
        {
          kind: "text",
          md: "The most common thing to do with categories is to **count** them. `table()` makes a *frequency table*: how often each level appears.",
        },
        {
          kind: "code",
          example: {
            id: "table-factor",
            title: "Counting categories with table()",
            code: `sizes <- factor(c("small", "large", "medium", "small", "large", "small"))
table(sizes)`,
            explanation: [
              { code: `sizes <- factor(c("small", "large", "medium", "small", "large", "small"))`, text: "Create the factor in one step." },
              { code: "table(sizes)", text: "Count how many times each level occurs." },
            ],
            output: `sizes
 large medium  small
     2      1      3`,
            outputNote: "The first line is the name of what was counted. Below each level is its count: 2 large, 1 medium and 3 small shirts.",
          },
        },
      ],
    },
    {
      id: "ordered-factors",
      title: "Ordered factors, and why factors matter",
      blocks: [
        {
          kind: "text",
          md: "Some categories have a natural order: small < medium < large, or low < medium < high. Tell R the order with the `levels` argument, and add `ordered = TRUE` to make an **ordered factor**. Now tables follow your order and you can even compare values.",
        },
        {
          kind: "code",
          example: {
            id: "ordered-factor",
            title: "Ordered factors",
            code: `sizes <- c("small", "large", "medium", "small", "large", "small")
size_ord <- factor(sizes, levels = c("small", "medium", "large"), ordered = TRUE)

size_ord
table(size_ord)
size_ord[2] > size_ord[1]`,
            explanation: [
              { code: `levels = c("small", "medium", "large")`, text: "List the levels in the order you want, from lowest to highest." },
              { code: "ordered = TRUE", text: "Tell R that this order has a meaning." },
              { code: "table(size_ord)", text: "The table now lists the levels in your order." },
              { code: "size_ord[2] > size_ord[1]", text: "Is the 2nd shirt (large) bigger than the 1st (small)? With an ordered factor R can answer." },
            ],
            output: `[1] small  large  medium small  large  small
Levels: small < medium < large
size_ord
 small medium  large
     3      1      2
[1] TRUE`,
            outputNote: "The `<` signs in `Levels: small < medium < large` show that the factor is ordered.",
          },
        },
        {
          kind: "text",
          md: "Why bother with factors instead of plain text? Because a factor **knows all the possible categories**, even ones that do not appear in the data, and it protects you from values that are not allowed.",
        },
        {
          kind: "code",
          example: {
            id: "factor-why",
            title: "A factor knows its categories",
            code: `answers <- factor(c("yes", "yes", "maybe"), levels = c("yes", "no", "maybe"))
table(answers)

answers[2] <- "perhaps"
answers`,
            explanation: [
              { code: `levels = c("yes", "no", "maybe")`, text: "We list all three allowed answers, even though nobody answered \"no\"." },
              { code: "table(answers)", text: "The table includes \"no\" with a count of 0 – useful in reports, where a missing category would be easy to overlook." },
              { code: `answers[2] <- "perhaps"`, text: "\"perhaps\" is not one of the levels, so R refuses to store it." },
            ],
            output: `answers
  yes    no maybe
    2     0     1
Warning message:
In \`[<-.factor\`(\`*tmp*\`, 2, value = "perhaps") : invalid factor level, NA generated
[1] yes   <NA>  maybe
Levels: yes no maybe`,
            outputNote: "The warning's middle part is R's internal name for \"assigning into a factor\" – the important bit is *invalid factor level, NA generated*. R put `<NA>` (missing) instead of the unknown answer. With plain text, a typo like this would slip into your data unnoticed.",
          },
        },
        {
          kind: "text",
          md: "Factors are common in R's built-in datasets. The famous `iris` dataset (measurements of 150 flowers) stores the species of each flower as a factor:",
        },
        {
          kind: "code",
          example: {
            id: "iris-species",
            title: "A factor in real data",
            code: `class(iris$Species)
levels(iris$Species)
table(iris$Species)`,
            explanation: [
              { code: "class(iris$Species)", text: "`iris$Species` is the Species column of the `iris` table (you will learn this `$` syntax for tables in the next lesson). It is a factor." },
              { code: "levels(iris$Species)", text: "The three species are the levels." },
              { code: "table(iris$Species)", text: "There are 50 flowers of each species." },
            ],
            output: `[1] "factor"
[1] "setosa"     "versicolor" "virginica"

    setosa versicolor  virginica
        50         50         50`,
            outputNote: "This time the table has an empty first line, because what was counted (`iris$Species`) is not a simple variable name.",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Using [ ] when you need [[ ]]",
      wrong: `student <- list(name = "Amara", scores = c(86, 82, 83))
mean(student["scores"])`,
      error: "argument is not numeric or logical",
      why: "Single brackets return a smaller **list**, not the numbers inside it. `mean()` cannot average a list, so it warns you and returns `NA`.",
      right: `student <- list(name = "Amara", scores = c(86, 82, 83))
mean(student[["scores"]])`,
    },
    {
      title: "Swapping rows and columns",
      wrong: `m <- matrix(1:6, nrow = 2, ncol = 3)
m[3, 1]`,
      error: "subscript out of bounds",
      why: "The matrix has only 2 rows, so there is no row 3. Inside `[ , ]` the **row** always comes first and the **column** second. *Subscript out of bounds* means \"you asked for a position that does not exist\".",
      right: `m <- matrix(1:6, nrow = 2, ncol = 3)
m[1, 3]`,
    },
    {
      title: "Turning a factor of numbers straight into numbers",
      wrong: `codes <- factor(c("10", "20", "10"))
as.numeric(codes)`,
      why: "Inside, a factor stores each value as the **number of its level** (level 1, level 2, …). `as.numeric()` returns those level numbers – here `1 2 1` – not `10 20 10`. Convert to text first, then to numbers.",
      right: `codes <- factor(c("10", "20", "10"))
as.numeric(as.character(codes))`,
    },
    {
      title: "A typo in the levels",
      wrong: `priority <- factor(c("low", "high", "medium"), levels = c("low", "med", "high"))
priority`,
      why: "The levels must match the values **exactly**. \"medium\" is not in the levels (only \"med\" is), so it silently becomes `<NA>`. Always check the output of a new factor for unexpected `<NA>` values.",
      right: `priority <- factor(c("low", "high", "medium"), levels = c("low", "medium", "high"))
priority`,
    },
  ],
  exerciseIds: ["m3-list-basics", "m3-matrix-practice", "m3-factor-counts"],
  quiz: [
    {
      id: "m3-lmf-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `info <- list(city = "Paris", year = 2024)
info$year`,
      options: ["[1] 2024", "$year\n[1] 2024", "[1] \"year\"", "[1] \"Paris\" 2024"],
      answer: 0,
      explanation: "`$` takes the element called `year` out of the list and gives back its value, 2024.",
      optionFeedback: [
        "Correct!",
        "That is what single brackets, `info[\"year\"]`, would print – a smaller list.",
        "`$year` returns the value stored under the name, not the name itself.",
        "Only the `year` element is returned.",
      ],
      concept: "list-indexing",
    },
    {
      id: "m3-lmf-q3",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `m <- matrix(1:6, nrow = 2)
m[2, 2]`,
      options: ["[1] 2", "[1] 4", "[1] 5", "[1] 3"],
      answer: 1,
      explanation: "The matrix is filled column by column: column 1 is 1, 2; column 2 is 3, 4; column 3 is 5, 6. Row 2 of column 2 is 4.",
      optionFeedback: [
        "2 is in row 2, column **1**.",
        "Correct!",
        "5 would be correct if the matrix were filled by row (`byrow = TRUE`).",
        "3 is in row **1**, column 2.",
      ],
      concept: "matrix-indexing",
    },
    {
      id: "m3-lmf-q4",
      type: "fill-blank",
      prompt: "Complete the code so that it counts how many times each size appears.",
      code: `sizes <- factor(c("S", "M", "S", "L", "S"))
___(sizes)`,
      accept: ["table"],
      hint: "The function that builds a frequency table.",
      explanation: "`table(sizes)` counts each level: L 1, M 1, S 3.",
      concept: "frequency-tables",
    },
    {
      id: "m3-lmf-q5",
      type: "find-error",
      prompt: "This code should show the value in row 2, column 3. Click the line with the mistake.",
      code: `m <- matrix(1:6, nrow = 2, ncol = 3)
m[3, 2]`,
      errorLine: 2,
      errorKind: "error",
      fix: `m <- matrix(1:6, nrow = 2, ncol = 3)
m[2, 3]`,
      explanation: "The row comes first: `m[2, 3]`. `m[3, 2]` asks for row 3, which does not exist, so R stops with *subscript out of bounds*.",
      concept: "matrix-indexing",
    },
    {
      id: "m3-lmf-q6",
      type: "true-false",
      prompt: "A list can hold a text value, a number and a whole vector at the same time.",
      answer: true,
      explanation: "That is exactly what lists are for. Vectors and matrices need a single type; lists do not.",
      concept: "lists",
    },
    {
      id: "m3-lmf-q7",
      type: "multiple-choice",
      prompt: "You have survey answers \"low\", \"medium\" and \"high\". Which code creates a factor that knows that low < medium < high?",
      options: [
        "factor(answers)",
        "factor(answers, levels = c(\"low\", \"medium\", \"high\"), ordered = TRUE)",
        "c(\"low\" < \"medium\" < \"high\")",
        "table(answers, ordered = TRUE)",
      ],
      answer: 1,
      explanation: "`levels` sets the order of the categories and `ordered = TRUE` says the order is meaningful.",
      optionFeedback: [
        "Without `levels`, R sorts the levels alphabetically: high, low, medium.",
        "Correct!",
        "This compares pieces of text; it does not create a factor.",
        "`table()` counts values; it does not create an ordered factor.",
      ],
      concept: "ordered-factors",
    },
  ],
  keyPoints: [
    "A list holds values of any type and length; create it with `list(name = value, ...)`.",
    "`list$name` and `list[[\"name\"]]` give the value inside; `list[\"name\"]` gives a smaller list.",
    "A matrix is a grid of same-type values; `matrix(values, nrow = , ncol = )` creates one and fills it column by column unless `byrow = TRUE`.",
    "Select from a matrix with `[row, column]` – row first; an empty side means \"all\".",
    "`rbind()` stacks vectors as rows and `cbind()` puts them side by side as columns.",
    "A factor stores categories; `levels()` shows them and `table()` counts them.",
    "Use `factor(x, levels = ..., ordered = TRUE)` for categories with a natural order.",
  ],
  concepts: [
    "lists",
    "list-indexing",
    "matrices",
    "matrix-indexing",
    "rbind-cbind",
    "factors",
    "factor-levels",
    "ordered-factors",
    "frequency-tables",
  ],
  glossary: ["list", "matrix", "factor", "level", "categorical-variable", "frequency-table", "row", "column", "dollar-operator"],
  prerequisites: ["vectors"],
  datasets: ["iris"],
  playground: `# A list, a matrix and a factor to explore
pet <- list(name = "Milo", species = "cat", weights = c(4.1, 4.3, 4.2))
pet$weights

grid <- matrix(1:9, nrow = 3)
grid[2, ]

colours <- factor(c("red", "blue", "red", "green", "red"))
table(colours)
`,
};
