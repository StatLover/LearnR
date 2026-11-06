import type { Lesson } from "../../types";

export const operatorsAndDataTypesLesson: Lesson = {
  id: "operators-and-data-types",
  module: 2,
  title: "Comparisons, Data Types and Type Conversion",
  summary:
    "Ask R yes/no questions with comparison and logical operators, check what type a value is with class() and typeof(), and convert between types safely.",
  minutes: 25,
  objectives: [
    "Compare values with ==, !=, <, >, <= and >= and read the TRUE/FALSE answer.",
    "Combine simple yes/no questions with & (and), | (or) and ! (not).",
    "Find out a value's type with class(), typeof(), is.numeric() and is.character().",
    "Convert values with as.numeric(), as.character() and as.integer(), and understand the warning \"NAs introduced by coercion\".",
  ],
  intro: `In the last lesson you met R's three everyday kinds of values: numbers, text and \`TRUE\`/\`FALSE\`. Now you will use them together.

First you will ask R **yes/no questions** – "is 5 bigger than 3?", "is this person 18 or older?" – using **comparison operators**. R answers with \`TRUE\` or \`FALSE\`.

Then you will learn to check a value's **data type** and to **convert** a value from one type to another, for example turning the text \`"42"\` into the number \`42\` so you can calculate with it. This is something you will do constantly with real data, which often arrives as text.`,
  sections: [
    {
      id: "comparison-operators",
      title: "Comparison operators: asking yes/no questions",
      blocks: [
        {
          kind: "definition",
          term: "Comparison operator",
          md: `A symbol that compares two values and answers with a logical value: \`TRUE\` if the comparison is correct, \`FALSE\` if it is not.`,
        },
        {
          kind: "table",
          caption: "Comparison operators",
          headers: ["Operator", "Question it asks", "Example", "Result"],
          rows: [
            ["`==`", "is equal to?", "`5 == 5`", "`TRUE`"],
            ["`!=`", "is not equal to?", "`5 != 5`", "`FALSE`"],
            ["`<`", "is less than?", "`3 < 5`", "`TRUE`"],
            ["`>`", "is greater than?", "`3 > 5`", "`FALSE`"],
            ["`<=`", "is less than or equal to?", "`5 <= 5`", "`TRUE`"],
            ["`>=`", "is greater than or equal to?", "`4 >= 5`", "`FALSE`"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "comparisons",
            title: "Four questions for R",
            code: `5 > 3
5 < 3
5 == 5
5 != 5`,
            explanation: [
              { code: "5 > 3", text: "Is 5 greater than 3? Yes." },
              { code: "5 < 3", text: "Is 5 less than 3? No." },
              { code: "5 == 5", text: "Is 5 equal to 5? Yes. Note the **double** equals sign." },
              { code: "5 != 5", text: "Is 5 *not* equal to 5? No – they are equal. `!=` reads as \"not equal\"." },
            ],
            output: `[1] TRUE
[1] FALSE
[1] TRUE
[1] FALSE`,
            outputNote: "Every comparison returns a logical value. That is what `TRUE` and `FALSE` are mainly for.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "= is not ==",
          md: `A single \`=\` *assigns* a value (like \`<-\`). A double \`==\` *asks* whether two values are equal. Mixing them up is one of the most common beginner mistakes.`,
        },
        {
          kind: "text",
          md: `Comparisons work with variables, and you can store the answer in a variable too:`,
        },
        {
          kind: "code",
          example: {
            id: "can-vote",
            title: "Is this person old enough to vote?",
            code: `age <- 17
can_vote <- age >= 18
can_vote`,
            explanation: [
              { code: "age <- 17", text: "Store the person's age." },
              { code: "can_vote <- age >= 18", text: "R works out `17 >= 18` (FALSE) and stores that logical value in `can_vote`." },
              { code: "can_vote", text: "Show the answer." },
            ],
            output: "[1] FALSE",
            outputNote: "17 is not greater than or equal to 18, so the answer is `FALSE`.",
            tryIt: "Change `age` to 18. Is the answer what you expected?",
          },
        },
        {
          kind: "code",
          example: {
            id: "compare-text",
            title: "Comparing text",
            code: `"apple" == "apple"
"Apple" == "apple"`,
            explanation: [
              { code: `"apple" == "apple"`, text: "Exactly the same text, so `TRUE`." },
              { code: `"Apple" == "apple"`, text: "Capital A vs small a – R is case-sensitive, so these are **not** equal." },
            ],
            output: `[1] TRUE
[1] FALSE`,
            outputNote: "Text must match exactly, including capital letters and spaces, to count as equal.",
          },
        },
      ],
    },
    {
      id: "logical-operators",
      title: "Logical operators: and, or, not",
      blocks: [
        {
          kind: "definition",
          term: "Logical operator",
          md: `A symbol that combines or flips \`TRUE\`/\`FALSE\` values: \`&\` means **and**, \`|\` means **or**, \`!\` means **not**.`,
        },
        {
          kind: "table",
          caption: "How &, | and ! work",
          headers: ["Operator", "Result is TRUE when…", "Example", "Result"],
          rows: [
            ["`&` (and)", "**both** sides are TRUE", "`TRUE & FALSE`", "`FALSE`"],
            ["`|` (or)", "**at least one** side is TRUE", "`TRUE | FALSE`", "`TRUE`"],
            ["`!` (not)", "the value is FALSE (it flips it)", "`!TRUE`", "`FALSE`"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "and-or-not",
            title: "Combining questions",
            code: `age <- 25
has_ticket <- TRUE
age >= 18 & has_ticket
age < 12 | age > 65
!has_ticket`,
            explanation: [
              { code: "age <- 25\nhas_ticket <- TRUE", text: "Information about a visitor to a concert." },
              { code: "age >= 18 & has_ticket", text: "Is the visitor an adult **and** do they have a ticket? Both are TRUE, so the answer is TRUE." },
              { code: "age < 12 | age > 65", text: "Is the visitor a child **or** a senior (for a discount)? Neither is true, so FALSE." },
              { code: "!has_ticket", text: "**Not** has_ticket: flips TRUE into FALSE. \"Is the visitor missing a ticket?\" – no." },
            ],
            output: `[1] TRUE
[1] FALSE
[1] FALSE`,
            outputNote: "`&` needs both parts to be TRUE; `|` needs at least one; `!` turns TRUE into FALSE and FALSE into TRUE.",
            tryIt: "Set `age <- 70` and run again. Which answers change?",
          },
        },
        {
          kind: "callout",
          tone: "info",
          title: "More logic later",
          md: `This is a gentle first look. In Module 4 you will use comparisons and logical operators to make your code take decisions with \`if\` and \`else\`.`,
        },
        {
          kind: "question",
          question: {
            id: "m2-types-q7",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `(3 > 1) | (2 > 5)`,
            options: ["[1] TRUE", "[1] FALSE", "[1] 3", `[1] "TRUE"`],
            answer: 0,
            optionFeedback: [
              "Correct – `3 > 1` is TRUE, and `|` (or) only needs one TRUE side.",
              "`2 > 5` is FALSE, but `|` is TRUE when at least one side is TRUE.",
              "Comparisons and logical operators always give TRUE or FALSE.",
              "R prints logical values without quotes.",
            ],
            explanation: "`3 > 1` is TRUE and `2 > 5` is FALSE. With `|` (or), one TRUE is enough, so the result is TRUE.",
            concept: "logical-operators",
          },
        },
      ],
    },
    {
      id: "checking-types",
      title: "Checking a value's type",
      blocks: [
        {
          kind: "definition",
          term: "Data type",
          md: `The kind of value something is – for example numeric, character or logical. The type decides what you can do with a value: you can add numbers, but not words.`,
        },
        {
          kind: "text",
          md: `Two functions tell you the type of a value:

- \`class()\` gives the everyday, high-level description (\`"numeric"\`, \`"character"\`, \`"logical"\`). This is the one you will use most.
- \`typeof()\` gives R's internal storage type. For numbers it says \`"double"\` (a number that can have decimals) or \`"integer"\` (a whole number).`,
        },
        {
          kind: "definition",
          term: "Integer",
          md: `A whole number with no decimal part. In R you create one by adding the letter \`L\` after it: \`42L\`. Ordinary numbers like \`42\` are stored as *doubles*, which can hold decimals. For everyday work the difference rarely matters.`,
        },
        {
          kind: "code",
          example: {
            id: "class-typeof",
            title: "class() and typeof()",
            code: `class(42)
class("hello")
class(TRUE)
typeof(42)
typeof(42L)`,
            explanation: [
              { code: "class(42)", text: "42 is a number." },
              { code: `class("hello")`, text: "\"hello\" is text." },
              { code: "class(TRUE)", text: "TRUE is a logical value." },
              { code: "typeof(42)", text: "Internally R stores ordinary numbers as *double* (decimal-capable) numbers." },
              { code: "typeof(42L)", text: "With the `L`, 42 is stored as an integer." },
            ],
            output: `[1] "numeric"
[1] "character"
[1] "logical"
[1] "double"
[1] "integer"`,
            outputNote: "The answers are themselves text, which is why they appear in quotes.",
          },
        },
        {
          kind: "table",
          caption: "Values and their types",
          headers: ["Value", "class()", "typeof()"],
          rows: [
            ["`3.7`", "`\"numeric\"`", "`\"double\"`"],
            ["`42L`", "`\"integer\"`", "`\"integer\"`"],
            ["`\"hello\"`", "`\"character\"`", "`\"character\"`"],
            ["`TRUE`", "`\"logical\"`", "`\"logical\"`"],
          ],
        },
        {
          kind: "text",
          md: `Sometimes you just want a yes/no answer: *is this a number?* The \`is.\` functions answer exactly that:`,
        },
        {
          kind: "code",
          example: {
            id: "is-functions",
            title: "is.numeric() and friends",
            code: `is.numeric(3.7)
is.numeric("3.7")
is.character("3.7")
is.logical(FALSE)`,
            explanation: [
              { code: "is.numeric(3.7)", text: "Is 3.7 a number? Yes." },
              { code: `is.numeric("3.7")`, text: "Is \"3.7\" a number? No – the quotes make it text." },
              { code: `is.character("3.7")`, text: "Is \"3.7\" text? Yes." },
              { code: "is.logical(FALSE)", text: "Is FALSE a logical value? Yes." },
            ],
            output: `[1] TRUE
[1] FALSE
[1] TRUE
[1] TRUE`,
            outputNote: "These checks are handy before calculating: if `is.numeric(x)` is FALSE, maths with `x` will fail.",
          },
        },
      ],
    },
    {
      id: "converting-types",
      title: "Converting between types",
      blocks: [
        {
          kind: "definition",
          term: "Type conversion",
          md: `Changing a value from one type to another, such as text \`"42"\` to the number \`42\`. R's conversion functions all start with \`as.\`: \`as.numeric()\`, \`as.character()\`, \`as.integer()\`, \`as.logical()\`. Converting is also called **coercion**.`,
        },
        {
          kind: "code",
          example: {
            id: "as-functions",
            title: "The as. functions",
            code: `as.numeric("42")
as.character(99)
as.integer(3.9)
as.numeric(TRUE)
as.numeric(FALSE)`,
            explanation: [
              { code: `as.numeric("42")`, text: "Text to number: the quotes disappear in the output, because it is now a number." },
              { code: "as.character(99)", text: "Number to text: the output now has quotes." },
              { code: "as.integer(3.9)", text: "To a whole number. **Careful:** `as.integer()` simply chops off the decimals – it does not round. 3.9 becomes 3." },
              { code: "as.numeric(TRUE)\nas.numeric(FALSE)", text: "Logical to number: TRUE becomes 1 and FALSE becomes 0." },
            ],
            output: `[1] 42
[1] "99"
[1] 3
[1] 1
[1] 0`,
            outputNote: "Watch the quotes appear and disappear – they show you the type at a glance.",
          },
        },
        {
          kind: "text",
          md: `Here is why conversion matters. Data from files, websites and forms often arrives as **text**, even when it looks like a number. You must convert it before you calculate:`,
        },
        {
          kind: "code",
          example: {
            id: "text-to-number",
            title: "A price that arrived as text",
            code: `price_text <- "19.99"
price <- as.numeric(price_text)
price * 2`,
            explanation: [
              { code: `price_text <- "19.99"`, text: "The price is stored as text (it has quotes), so `price_text * 2` would give an error." },
              { code: "price <- as.numeric(price_text)", text: "Convert the text into a number and store it in a new variable." },
              { code: "price * 2", text: "Now arithmetic works." },
            ],
            output: "[1] 39.98",
            outputNote: "Two items cost 39.98.",
            tryIt: "Try running `price_text * 2` to see the error you avoided.",
          },
        },
        {
          kind: "text",
          md: `R also converts types **automatically** in some situations. For example, when you do maths with logical values, R quietly treats \`TRUE\` as 1 and \`FALSE\` as 0:`,
        },
        {
          kind: "code",
          example: {
            id: "auto-coercion",
            title: "Automatic conversion",
            code: `TRUE + TRUE
TRUE + FALSE + TRUE`,
            explanation: [
              { code: "TRUE + TRUE", text: "1 + 1 = 2." },
              { code: "TRUE + FALSE + TRUE", text: "1 + 0 + 1 = 2. This is a handy way to count how many things are TRUE." },
            ],
            output: `[1] 2
[1] 2`,
          },
        },
      ],
    },
    {
      id: "coercion-warning",
      title: "When conversion fails: NA and a warning",
      blocks: [
        {
          kind: "text",
          md: `What happens if you ask R to turn text that is **not** a number into a number?`,
        },
        {
          kind: "code",
          example: {
            id: "na-coercion",
            title: "Converting a word",
            code: `as.numeric("twelve")`,
            explanation: [
              { code: `as.numeric("twelve")`, text: "R cannot read the word \"twelve\" as a number – it only understands digits." },
            ],
            output: `[1] NA
Warning message:
NAs introduced by coercion`,
            outputNote:
              "R gives back `NA` and prints a **warning**. `NA` means *Not Available* – a missing value. The warning \"NAs introduced by coercion\" means \"while converting, I had to put in NA because some values could not be converted\".",
          },
        },
        {
          kind: "definition",
          term: "NA",
          md: `R's symbol for a **missing** or unknown value ("Not Available"). You will meet \`NA\` a lot when working with real data, where some values are often missing.`,
        },
        {
          kind: "definition",
          term: "Warning",
          md: `A message saying "this worked, but something looks suspicious". Unlike an **error**, a warning does not stop your code – the code keeps running, but you should check the result.`,
        },
        {
          kind: "code",
          example: {
            id: "comma-number",
            title: "A common surprise: commas in numbers",
            code: `as.numeric("1,500")
as.numeric("1500")`,
            explanation: [
              { code: `as.numeric("1,500")`, text: "The comma is not allowed in an R number, so the conversion fails." },
              { code: `as.numeric("1500")`, text: "Without the comma, the conversion works." },
            ],
            output: `[1] NA
Warning message:
NAs introduced by coercion
[1] 1500`,
            outputNote: "The warning appears straight after the line that caused it, and then the next line runs normally – a warning does not stop the code.",
          },
        },
        {
          kind: "table",
          caption: "Warning or error?",
          headers: ["", "Warning", "Error"],
          rows: [
            ["Starts with", "`Warning message:`", "`Error`"],
            ["Does the code keep running?", "Yes", "No – R stops"],
            ["Example", "`as.numeric(\"twelve\")` → NA plus a warning", "`\"twelve\" + 1` → error"],
            ["What to do", "Check the result – it may contain NA", "Fix the code and run again"],
          ],
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Using = instead of == to compare",
      wrong: `5 = 5`,
      error: "invalid (do_set) left-hand side to assignment",
      why: "A single `=` means *assign*, so R thinks you are trying to store 5 inside the number 5, which is impossible. To ask \"is equal?\", use `==`.",
      right: `5 == 5`,
    },
    {
      title: "Writing =< instead of <=",
      wrong: `5 =< 6`,
      error: "unexpected '<'",
      why: "R only understands `<=` and `>=` with the equals sign **second**. Say it the way you read it: \"less than or equal\".",
      right: `5 <= 6`,
    },
    {
      title: "Converting text that contains commas or words",
      wrong: `as.numeric("1,200")`,
      error: "NAs introduced by coercion",
      why: "R numbers cannot contain commas, spaces between digits, currency signs or words. The conversion fails and gives `NA` with a warning. Remove the extra characters first.",
      right: `as.numeric("1200")`,
    },
    {
      title: "Expecting as.integer() to round",
      wrong: `as.integer(4.8)`,
      why: "`as.integer()` cuts off the decimal part, so 4.8 becomes 4, not 5. There is no error – just a result you might not expect. Use `round()` (next lesson) to round properly.",
      right: `round(4.8)`,
    },
    {
      title: "Forgetting that text comparisons are case-sensitive",
      wrong: `answer <- "Yes"
answer == "yes"`,
      why: "This returns `FALSE` because \"Yes\" and \"yes\" differ in one capital letter. No error is shown, so the mistake is easy to miss. Compare against exactly the same text.",
      right: `answer <- "Yes"
answer == "Yes"`,
    },
  ],
  exerciseIds: ["m2-type-conversion"],
  quiz: [
    {
      id: "m2-types-q1",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `class("3.14")`,
      options: [`[1] "character"`, `[1] "numeric"`, `[1] "double"`, "[1] 3.14"],
      answer: 0,
      optionFeedback: [
        "Correct – the quotes make \"3.14\" text.",
        "It looks like a number, but the quotes make it a character value.",
        "`double` is what `typeof()` says for real numbers – and this is not a number anyway.",
        "`class()` reports the type, not the value.",
      ],
      explanation: "Anything in quotes is character data, so `class(\"3.14\")` is `\"character\"`. To get a number you would use `as.numeric(\"3.14\")`.",
      concept: "data-types",
    },
    {
      id: "m2-types-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `10 != 10`,
      options: ["[1] FALSE", "[1] TRUE", "[1] 0", "[1] 10"],
      answer: 0,
      optionFeedback: [
        "Correct – 10 *is* equal to 10, so \"not equal\" is FALSE.",
        "`!=` asks \"is not equal?\". 10 and 10 are equal, so the answer is FALSE.",
        "Comparisons give TRUE or FALSE, not numbers.",
        "Comparisons give TRUE or FALSE, not one of the values.",
      ],
      explanation: "`!=` means \"not equal to\". Since 10 equals 10, `10 != 10` is FALSE.",
      concept: "comparison-operators",
    },
    {
      id: "m2-types-q3",
      type: "multiple-choice",
      prompt: "What happens when you run `as.numeric(\"hello\")`?",
      options: [
        "R returns NA and prints the warning \"NAs introduced by coercion\"",
        "R returns 0",
        "R returns the number of letters, 5",
        "R stops with an error and nothing is returned",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – the conversion fails, so R puts in a missing value (NA) and warns you.",
        "R does not guess a number – it uses NA to mark the failed conversion.",
        "Counting letters is a job for `nchar()` (next lesson).",
        "It is a warning, not an error: R keeps running and returns NA.",
      ],
      explanation: "Text that does not look like a number cannot be converted. R returns `NA` (missing) and gives a warning, but does not stop.",
      concept: "coercion-warning",
    },
    {
      id: "m2-types-q4",
      type: "fill-blank",
      prompt: "Complete the code so that the text `\"25\"` becomes a number and the last line prints `[1] 30`.",
      code: `x <- "25"
x_number <- ___(x)
x_number + 5`,
      accept: ["as.numeric", "as.integer", "as.double"],
      hint: "Conversion functions start with `as.`",
      explanation: "`as.numeric(x)` turns the text `\"25\"` into the number 25, so `x_number + 5` gives 30.",
      concept: "type-conversion",
    },
    {
      id: "m2-types-q5",
      type: "true-false",
      prompt: "A warning stops your code from running, just like an error does.",
      answer: false,
      explanation: "A warning lets the code continue – it only alerts you that something may be wrong. An error stops the code at that line.",
      concept: "coercion-warning",
    },
    {
      id: "m2-types-q6",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `age <- 20
age >= 18 & age < 65`,
      options: ["[1] TRUE", "[1] FALSE", "[1] 20", "[1] TRUE TRUE"],
      answer: 0,
      optionFeedback: [
        "Correct – both comparisons are TRUE, so `&` gives TRUE.",
        "Check each side: 20 >= 18 is TRUE and 20 < 65 is TRUE.",
        "The comparisons produce a logical answer, not the age.",
        "`&` combines the two answers into a single TRUE or FALSE.",
      ],
      explanation: "`age >= 18` is TRUE and `age < 65` is TRUE. `&` (and) is TRUE only when both sides are TRUE – which they are.",
      concept: "logical-operators",
    },
  ],
  keyPoints: [
    "Comparison operators (==, !=, <, >, <=, >=) compare two values and return TRUE or FALSE.",
    "Use == to ask \"is equal?\"; a single = assigns a value.",
    "& (and) is TRUE only if both sides are TRUE, | (or) if at least one is, and ! (not) flips TRUE and FALSE.",
    "class() tells you a value's type (\"numeric\", \"character\", \"logical\"); typeof() shows how it is stored (\"double\", \"integer\", …).",
    "is.numeric(), is.character() and is.logical() answer yes/no questions about a value's type.",
    "as.numeric(), as.character() and as.integer() convert between types; as.integer() cuts off decimals instead of rounding.",
    "If text cannot be converted to a number, R returns NA with the warning \"NAs introduced by coercion\" – a warning does not stop the code.",
  ],
  concepts: ["comparison-operators", "logical-operators", "data-types", "type-conversion", "coercion-warning"],
  glossary: ["comparison-operator", "logical-operator", "data-type", "integer", "type-conversion", "coercion", "na", "warning"],
  playground: `# Ask R some yes/no questions
age <- 17
age >= 18

# Check and convert types
class("42")
as.numeric("42") + 8
`,
  prerequisites: ["values-and-arithmetic"],
};
