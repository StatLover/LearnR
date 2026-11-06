import type { Lesson } from "../../types";

export const valuesAndArithmeticLesson: Lesson = {
  id: "values-and-arithmetic",
  module: 2,
  title: "Numbers, Text, Logical Values and Arithmetic",
  summary:
    "Meet R's three everyday kinds of values – numbers, text and TRUE/FALSE – and calculate with + - * / ^ %% and %/% in the right order.",
  minutes: 25,
  objectives: [
    "Recognise numeric, character and logical values and write each one correctly.",
    "Calculate with the arithmetic operators +, -, *, /, ^, %% and %/%.",
    "Predict results using R's order of operations, and control the order with parentheses.",
    "Solve small real-life problems by doing arithmetic with variables.",
  ],
  intro: `Every value in R has a **kind** (programmers say a *type*). Almost everything you do as a beginner uses just three kinds:

- **numbers**, such as \`42\` or \`1.75\` – for counting and measuring,
- **text**, such as \`"Biscuit"\` – for names, labels and categories,
- **logical values**, \`TRUE\` and \`FALSE\` – for yes/no answers.

In this lesson you will learn to write each kind correctly and then put numbers to work with R's **arithmetic operators** – the symbols for adding, subtracting, multiplying, dividing, powers and remainders – including the rules R follows to decide which part of a calculation to do first.`,
  sections: [
    {
      id: "three-kinds",
      title: "Three kinds of values",
      blocks: [
        { kind: "diagram", name: "data-types", caption: "R's basic kinds of values: numeric, character, logical (and integer, which you meet in the next lesson)." },
        {
          kind: "definition",
          term: "Numeric",
          md: `A number, with or without decimals: \`42\`, \`-7\`, \`3.14\`. Numbers are written **without quotes**, and decimals use a **dot**.`,
        },
        {
          kind: "definition",
          term: "Character",
          md: `Text, written **inside quotes**: \`"Biscuit"\`, \`"New York"\`, \`"42"\`. R calls text values *character* values; programmers also call them *strings*.`,
        },
        {
          kind: "definition",
          term: "Logical",
          md: `One of the two special values \`TRUE\` or \`FALSE\` (always in capital letters, never in quotes). Logical values – also called *boolean* values – are the answers to yes/no questions.`,
        },
        {
          kind: "code",
          example: {
            id: "three-kinds",
            title: "One of each",
            code: `height_m <- 1.68
pet_name <- "Biscuit"
likes_r <- TRUE
height_m
pet_name
likes_r`,
            explanation: [
              { code: "height_m <- 1.68", text: "A **numeric** value: a decimal number, no quotes." },
              { code: `pet_name <- "Biscuit"`, text: "A **character** value: text inside quotes." },
              { code: "likes_r <- TRUE", text: "A **logical** value: `TRUE`, written in capitals with no quotes." },
              { code: "height_m\npet_name\nlikes_r", text: "Display all three." },
            ],
            output: `[1] 1.68
[1] "Biscuit"
[1] TRUE`,
            outputNote: "Look at how each kind is displayed: the number plain, the text in quotes, and `TRUE` in capitals without quotes.",
            tryIt: "Change `likes_r` to `FALSE`, and `pet_name` to the name of a pet you have (or would like).",
          },
        },
        {
          kind: "text",
          md: `A few more things worth knowing about numbers:`,
        },
        {
          kind: "code",
          example: {
            id: "number-formats",
            title: "How R writes numbers",
            code: `-12
0.5
1500000
1000000
2e3`,
            explanation: [
              { code: "-12", text: "A negative number: put the minus sign in front." },
              { code: "0.5", text: "A decimal. (`.5` also works, but `0.5` is easier to read.)" },
              { code: "1500000", text: "One and a half million. Never put commas or spaces inside a number." },
              { code: "1000000", text: "One million – watch how R displays it." },
              { code: "2e3", text: "*Scientific notation*: `2e3` means 2 × 10³ = 2000." },
            ],
            output: `[1] -12
[1] 0.5
[1] 1500000
[1] 1e+06
[1] 2000`,
            outputNote:
              "R shows one million as `1e+06`, which means 1 × 10⁶ (a 1 followed by six zeros). This is just a shorter way of *displaying* the number – the value is still exactly 1000000.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Quotes change the kind",
          md: `\`42\` is a number, but \`"42"\` is text that happens to contain digits – you cannot do maths with it. Likewise \`TRUE\` is a logical value, but \`"TRUE"\` is just a four-letter word. When a value is in quotes, R treats it as text.`,
        },
        {
          kind: "question",
          question: {
            id: "m2-arith-q7",
            type: "multiple-choice",
            prompt: "Which of these is a logical value?",
            options: ["FALSE", "\"FALSE\"", "false", "0.5"],
            answer: 0,
            optionFeedback: [
              "Correct – `FALSE` in capitals without quotes is a logical value.",
              "With quotes it is text (a character value), not a logical value.",
              "R is case-sensitive: logical values must be written in capitals, `TRUE` or `FALSE`.",
              "That is a number (numeric).",
            ],
            explanation: "Logical values are exactly `TRUE` and `FALSE`: all capitals, no quotes.",
            concept: "logical-values",
          },
        },
      ],
    },
    {
      id: "arithmetic-operators",
      title: "Arithmetic operators",
      blocks: [
        {
          kind: "definition",
          term: "Operator",
          md: `A symbol that performs an action on values, such as \`+\` (add) or \`*\` (multiply). **Arithmetic operators** do maths. A piece of code that produces a value, such as \`7 + 2\`, is called an **expression**.`,
        },
        {
          kind: "table",
          caption: "R's arithmetic operators",
          headers: ["Operator", "Meaning", "Example", "Result"],
          rows: [
            ["`+`", "add", "`7 + 2`", "`9`"],
            ["`-`", "subtract", "`7 - 2`", "`5`"],
            ["`*`", "multiply", "`7 * 2`", "`14`"],
            ["`/`", "divide", "`7 / 2`", "`3.5`"],
            ["`^`", "power (\"to the power of\")", "`7 ^ 2`", "`49`"],
            ["`%/%`", "integer division (how many *whole* times)", "`7 %/% 2`", "`3`"],
            ["`%%`", "remainder (what is left over)", "`7 %% 2`", "`1`"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "basic-ops",
            title: "The five basic operators",
            code: `7 + 2
7 - 2
7 * 2
7 / 2
7 ^ 2`,
            explanation: [
              { code: "7 + 2", text: "Addition: 9." },
              { code: "7 - 2", text: "Subtraction: 5." },
              { code: "7 * 2", text: "Multiplication with the star: 14." },
              { code: "7 / 2", text: "Division: 3.5. R gives decimals when the answer is not a whole number." },
              { code: "7 ^ 2", text: "Power: 7² = 7 × 7 = 49. (`7 ^ 3` would be 7 × 7 × 7.)" },
            ],
            output: `[1] 9
[1] 5
[1] 14
[1] 3.5
[1] 49`,
            outputNote: "One answer per line, in order. Spaces around operators are optional, but they make code much easier to read.",
            tryIt: "Calculate 2 to the power of 10 with `2 ^ 10`.",
          },
        },
        {
          kind: "code",
          example: {
            id: "decimals-display",
            title: "Long decimals and dividing by zero",
            code: `10 / 3
5 / 0
0 / 0`,
            explanation: [
              { code: "10 / 3", text: "The true answer goes on forever (3.3333…). R *displays* 7 significant digits but stores many more." },
              { code: "5 / 0", text: "Dividing a positive number by zero gives `Inf` – R's symbol for infinity." },
              { code: "0 / 0", text: "Zero divided by zero has no sensible answer, so R returns `NaN`, short for \"Not a Number\"." },
            ],
            output: `[1] 3.333333
[1] Inf
[1] NaN`,
            outputNote: "R does not crash when you divide by zero; it returns the special values `Inf` or `NaN`. If you see them in your results, check for a division by zero.",
          },
        },
      ],
    },
    {
      id: "remainder-and-integer-division",
      title: "Integer division and remainders: %/% and %%",
      blocks: [
        {
          kind: "text",
          md: `Imagine sharing **17 cookies among 5 friends**. Each friend gets **3** whole cookies, and **2** are left over. R has an operator for each part of that answer:

- \`%/%\` (integer division) answers *"how many whole times does 5 fit into 17?"* → 3
- \`%%\` (remainder, also called *modulo*) answers *"what is left over?"* → 2`,
        },
        {
          kind: "code",
          example: {
            id: "cookies",
            title: "Sharing cookies",
            code: `17 %/% 5
17 %% 5`,
            explanation: [
              { code: "17 %/% 5", text: "5 fits into 17 three whole times (5 × 3 = 15)." },
              { code: "17 %% 5", text: "After giving out 15 cookies, 17 − 15 = 2 are left over." },
            ],
            output: `[1] 3
[1] 2`,
            outputNote: "Together they describe the whole result: 17 = 5 × 3 + 2.",
            tryIt: "Share 23 cookies among 4 friends. How many does each get, and how many are left?",
          },
        },
        {
          kind: "text",
          md: `These two operators are surprisingly useful. Converting units is a classic example: 45 days is how many whole weeks and how many extra days?`,
        },
        {
          kind: "code",
          example: {
            id: "weeks-and-days",
            title: "Days into weeks",
            code: `total_days <- 45
weeks <- total_days %/% 7
extra_days <- total_days %% 7
weeks
extra_days`,
            explanation: [
              { code: "total_days <- 45", text: "The number of days to convert." },
              { code: "weeks <- total_days %/% 7", text: "Whole weeks: 7 fits into 45 six times." },
              { code: "extra_days <- total_days %% 7", text: "Leftover days: 45 − 6 × 7 = 3." },
              { code: "weeks\nextra_days", text: "Show both results." },
            ],
            output: `[1] 6
[1] 3`,
            outputNote: "45 days = 6 weeks and 3 days.",
          },
        },
        {
          kind: "code",
          example: {
            id: "even-odd",
            title: "Even or odd?",
            code: `10 %% 2
7 %% 2`,
            explanation: [
              { code: "10 %% 2", text: "10 divides evenly by 2, so the remainder is 0 – 10 is **even**." },
              { code: "7 %% 2", text: "7 divided by 2 leaves 1 – 7 is **odd**." },
            ],
            output: `[1] 0
[1] 1`,
            outputNote: "A number is even exactly when `number %% 2` is 0. Programmers use this trick all the time.",
          },
        },
      ],
    },
    {
      id: "order-of-operations",
      title: "Order of operations",
      blocks: [
        {
          kind: "text",
          md: `When a calculation has several operators, R follows the same rules you learned in maths class (often remembered as BODMAS or PEMDAS):

1. **Parentheses** \`( )\` first,
2. then **powers** \`^\`,
3. then **multiplication and division** \`*\` \`/\` (from left to right),
4. then **addition and subtraction** \`+\` \`-\` (from left to right).`,
        },
        {
          kind: "code",
          example: {
            id: "order",
            title: "Same numbers, different answers",
            code: `2 + 3 * 4
(2 + 3) * 4
10 - 2 ^ 2`,
            explanation: [
              { code: "2 + 3 * 4", text: "Multiplication comes before addition: 3 × 4 = 12, then 2 + 12 = 14." },
              { code: "(2 + 3) * 4", text: "Parentheses come first: 2 + 3 = 5, then 5 × 4 = 20." },
              { code: "10 - 2 ^ 2", text: "The power comes first: 2² = 4, then 10 − 4 = 6." },
            ],
            output: `[1] 14
[1] 20
[1] 6`,
            outputNote: "Parentheses change the answer from 14 to 20. When in doubt, add parentheses – they make your intention clear to both R and human readers.",
          },
        },
        {
          kind: "text",
          md: `A real example where this matters: the average of three test scores. You must add the scores **before** dividing by 3.`,
        },
        {
          kind: "code",
          example: {
            id: "average-order",
            title: "Calculating an average",
            code: `(80 + 90 + 70) / 3
80 + 90 + 70 / 3`,
            explanation: [
              { code: "(80 + 90 + 70) / 3", text: "Correct: add all three scores (240), then divide by 3." },
              { code: "80 + 90 + 70 / 3", text: "Wrong: only `70` is divided by 3 (23.33…), then 80 and 90 are added to it." },
            ],
            output: `[1] 80
[1] 193.3333`,
            outputNote: "An average of 193 for scores out of 100 is clearly wrong – forgetting parentheses is one of the most common beginner mistakes. R gave no error because both lines are valid code.",
          },
        },
        {
          kind: "callout",
          tone: "note",
          title: "Two surprises",
          md: `- \`%%\` and \`%/%\` are worked out **before** \`*\` and \`/\`. Use parentheses when you mix them, e.g. \`(a * b) %% 7\`.
- Powers come before a minus sign at the front: \`-2 ^ 2\` is \`-(2 ^ 2)\`, which is \`-4\`. Write \`(-2) ^ 2\` to square minus two and get \`4\`.`,
        },
        {
          kind: "code",
          example: {
            id: "minus-power",
            title: "Minus signs and powers",
            code: `-2 ^ 2
(-2) ^ 2`,
            explanation: [
              { code: "-2 ^ 2", text: "R does the power first (2² = 4) and then applies the minus sign." },
              { code: "(-2) ^ 2", text: "The parentheses make −2 the number being squared: (−2) × (−2) = 4." },
            ],
            output: `[1] -4
[1] 4`,
          },
        },
        {
          kind: "question",
          question: {
            id: "m2-arith-q8",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `2 * (3 + 4)`,
            options: ["[1] 14", "[1] 10", "[1] 24", "[1] 9"],
            answer: 0,
            optionFeedback: [
              "Correct – parentheses first (3 + 4 = 7), then 2 × 7 = 14.",
              "That would be `2 * 3 + 4`. Here the parentheses make R add first.",
              "Check the operators: it is 2 × 7, not 2 × 12.",
              "The 2 multiplies the whole sum in parentheses.",
            ],
            explanation: "R calculates what is inside the parentheses first: 3 + 4 = 7. Then 2 × 7 = 14.",
            concept: "order-of-operations",
          },
        },
      ],
    },
    {
      id: "arithmetic-with-variables",
      title: "Putting it to work with variables",
      blocks: [
        {
          kind: "text",
          md: `Arithmetic becomes really useful when combined with variables. Here is a health example: the **body mass index (BMI)**, which is weight (in kg) divided by height (in metres) squared.`,
        },
        {
          kind: "code",
          example: {
            id: "bmi",
            title: "Calculating BMI",
            code: `weight_kg <- 70
height_m <- 1.75
bmi <- weight_kg / height_m ^ 2
bmi`,
            explanation: [
              { code: "weight_kg <- 70", text: "Weight in kilograms. Putting the unit in the name avoids confusion." },
              { code: "height_m <- 1.75", text: "Height in metres." },
              {
                code: "bmi <- weight_kg / height_m ^ 2",
                text: "Because `^` comes before `/`, R first squares the height (1.75² = 3.0625) and then divides: 70 ÷ 3.0625. No parentheses needed – but `weight_kg / (height_m ^ 2)` would be just as correct and maybe clearer.",
              },
              { code: "bmi", text: "Show the result." },
            ],
            output: "[1] 22.85714",
            outputNote: "The BMI is about 22.86. R shows 7 significant digits; in the next lessons you will learn to round it.",
            tryIt: "Change the weight and height to other values. What happens if you write `(weight_kg / height_m) ^ 2` instead?",
          },
        },
        {
          kind: "code",
          example: {
            id: "restaurant-bill",
            title: "Splitting a restaurant bill",
            code: `bill <- 84
tip_rate <- 0.15
people <- 4
total <- bill + bill * tip_rate
per_person <- total / people
total
per_person`,
            explanation: [
              { code: "bill <- 84\ntip_rate <- 0.15\npeople <- 4", text: "The bill, a 15% tip written as a decimal (15 ÷ 100 = 0.15), and the number of people." },
              { code: "total <- bill + bill * tip_rate", text: "Multiplication first: the tip is 84 × 0.15 = 12.6, then 84 + 12.6 = 96.6." },
              { code: "per_person <- total / people", text: "Split the total four ways." },
              { code: "total\nper_person", text: "Show the results." },
            ],
            output: `[1] 96.6
[1] 24.15`,
            outputNote: "Each person pays 24.15. Change any of the three inputs and the whole calculation updates when you run it again.",
            tryIt: "Make it a 20% tip for 6 people.",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Doing maths with numbers in quotes",
      wrong: `"10" + 5`,
      error: "non-numeric argument to binary operator",
      why: "`\"10\"` is text, not a number. Arithmetic operators only work on numbers. (\"Binary operator\" just means an operator with a value on each side, like `+`.)",
      right: `10 + 5`,
    },
    {
      title: "Writing TRUE or FALSE in lower case",
      wrong: `is_member <- true`,
      error: "object 'true' not found",
      why: "Logical values must be written in capitals. R reads `true` as the name of a variable, which does not exist.",
      right: `is_member <- TRUE`,
    },
    {
      title: "Forgetting parentheses in an average",
      wrong: `80 + 90 + 70 / 3`,
      why: "Division happens before addition, so only the last score is divided by 3. R gives no error – just a wrong answer (193.3333).",
      right: `(80 + 90 + 70) / 3`,
    },
    {
      title: "Using a comma as the decimal point",
      wrong: `price <- 3,50`,
      error: "unexpected ','",
      why: "In many countries a comma marks decimals, but R always uses a dot. Commas separate arguments in R, so R is confused here.",
      right: `price <- 3.50`,
    },
    {
      title: "Leaving out the multiplication sign",
      wrong: `2(3 + 4)`,
      error: "attempt to apply non-function",
      why: "In maths, 2(3 + 4) means multiply, but in R a name or value followed by parentheses means *call a function*. `2` is not a function, so R stops. Always write `*`.",
      right: `2 * (3 + 4)`,
    },
  ],
  exerciseIds: ["m2-temperature", "m2-minutes-to-hours"],
  quiz: [
    {
      id: "m2-arith-q1",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `10 %% 3`,
      options: ["[1] 1", "[1] 3", "[1] 3.333333", "[1] 0"],
      answer: 0,
      optionFeedback: [
        "Correct – 3 fits into 10 three times (9), leaving a remainder of 1.",
        "That is the result of `10 %/% 3` (whole times). `%%` gives the remainder.",
        "That is `10 / 3`, ordinary division.",
        "10 does not divide evenly by 3, so the remainder is not 0.",
      ],
      explanation: "`%%` gives the remainder after division: 10 = 3 × 3 + 1, so `10 %% 3` is 1.",
      concept: "integer-division-remainder",
    },
    {
      id: "m2-arith-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `2 + 3 ^ 2`,
      options: ["[1] 11", "[1] 25", "[1] 10", "[1] 13"],
      answer: 0,
      optionFeedback: [
        "Correct – the power first (3² = 9), then 2 + 9 = 11.",
        "That would be `(2 + 3) ^ 2`. Powers come before addition.",
        "`^` means power, not multiply: 3 ^ 2 is 9, not 6.",
        "Check the power: 3 ^ 2 = 9, so the answer is 2 + 9.",
      ],
      explanation: "Powers are calculated before addition. `3 ^ 2` = 9, then `2 + 9` = 11.",
      concept: "order-of-operations",
    },
    {
      id: "m2-arith-q3",
      type: "multiple-choice",
      prompt: "Which of these is a **character** (text) value?",
      options: [`"42"`, "42", "TRUE", "4.2"],
      answer: 0,
      optionFeedback: [
        "Correct – the quotes make it text, even though it contains digits.",
        "Without quotes, 42 is a number (numeric).",
        "`TRUE` without quotes is a logical value.",
        "4.2 is a decimal number (numeric).",
      ],
      explanation: "Anything in quotes is a character value. `\"42\"` looks like a number but R treats it as text.",
      concept: "character-values",
    },
    {
      id: "m2-arith-q4",
      type: "true-false",
      prompt: "`TRUE` and `\"TRUE\"` are the same kind of value in R.",
      answer: false,
      explanation: "`TRUE` (no quotes) is a logical value. `\"TRUE\"` (with quotes) is a character value – just text made of four letters.",
      concept: "logical-values",
    },
    {
      id: "m2-arith-q5",
      type: "fill-blank",
      prompt: "Complete the code so it calculates how many **whole** weeks there are in 30 days (the answer should be 4).",
      code: `30 ___ 7`,
      accept: ["%/%"],
      hint: "You need integer division, which ignores the leftover days.",
      explanation: "`30 %/% 7` is 4: seven fits into 30 four whole times. (`30 %% 7` would give the 2 leftover days.)",
      concept: "integer-division-remainder",
    },
    {
      id: "m2-arith-q6",
      type: "find-error",
      prompt: "This code should add up the fruit, but it stops with an error. Click the line where R stops.",
      code: `apples <- 12
pears <- "8"
total_fruit <- apples + pears
total_fruit`,
      errorLine: 3,
      errorKind: "error",
      fix: `apples <- 12
pears <- 8
total_fruit <- apples + pears
total_fruit`,
      explanation: "R stops on line 3 with `non-numeric argument to binary operator` because `pears` holds the text `\"8\"`. The real cause is on line 2: remove the quotes so that `pears` stores the number 8.",
      concept: "numeric-values",
    },
  ],
  keyPoints: [
    "Numeric values are numbers written without quotes, using a dot for decimals (e.g. 1.75).",
    "Character values are text inside quotes (e.g. \"Biscuit\"); \"42\" in quotes is text, not a number.",
    "Logical values are TRUE and FALSE – capital letters, no quotes.",
    "The arithmetic operators are + - * / ^, plus %/% (whole number of times) and %% (remainder).",
    "R uses the usual order of operations: parentheses, powers, multiply/divide, then add/subtract.",
    "Use parentheses whenever the order matters, such as (a + b + c) / 3 for an average.",
    "Dividing by zero gives Inf (or NaN for 0 / 0) instead of an error.",
  ],
  concepts: ["numeric-values", "character-values", "logical-values", "arithmetic", "integer-division-remainder", "order-of-operations"],
  glossary: ["numeric", "character", "logical", "boolean", "operator", "arithmetic-operator", "expression", "inf", "nan"],
  playground: `# Try every arithmetic operator
7 + 2
7 - 2
7 * 2
7 / 2
7 ^ 2
7 %/% 2
7 %% 2
`,
  prerequisites: ["variables-and-assignment"],
};
