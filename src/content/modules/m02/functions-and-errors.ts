import type { Lesson } from "../../types";

export const functionsAndErrorsLesson: Lesson = {
  id: "functions-and-error-messages",
  module: 2,
  title: "Built-in Functions and Error Messages",
  summary:
    "Use R's ready-made functions such as round(), sqrt(), nchar() and paste(), look up help with ?, and learn to read and fix the most common error messages.",
  minutes: 30,
  objectives: [
    "Call a built-in function with one or more arguments, including named arguments such as digits = 2.",
    "Use round(), sqrt(), abs(), nchar(), toupper(), tolower() and paste() to solve small problems.",
    "Look up how a function works with ?function_name.",
    "Read the parts of an R error message and fix the most common beginner errors.",
  ],
  intro: `You have already used a few **functions**: \`print()\`, \`class()\`, \`as.numeric()\`. A function is like a button on a calculator – \`√\` for square root, for example. You give it a value, it does its job, and it hands back a result. R comes with **thousands** of these ready-made functions.

In the first half of this lesson you will learn how to call functions, give them extra instructions (called *arguments*), and use some of the most useful ones for numbers and text.

In the second half you will learn to read **error messages**. Every programmer – beginner or expert – sees errors every day. An error message is not a telling-off; it is R pointing to the problem. Once you know how to read one, most errors take seconds to fix.`,
  sections: [
    {
      id: "calling-functions",
      title: "Calling a function",
      blocks: [
        {
          kind: "definition",
          term: "Function",
          md: `A named, reusable piece of code that does one job. You **call** it by writing its name followed by parentheses, with its input inside: \`sqrt(16)\`.`,
        },
        {
          kind: "definition",
          term: "Return value",
          md: `The result a function hands back after doing its job. \`sqrt(16)\` *returns* 4. You can print a return value, use it in a calculation, or store it in a variable.`,
        },
        {
          kind: "code",
          example: {
            id: "number-functions",
            title: "Three handy number functions",
            code: `sqrt(16)
abs(-7)
round(3.14159)`,
            explanation: [
              { code: "sqrt(16)", text: "`sqrt()` returns the **square root**: the number that, multiplied by itself, gives 16." },
              { code: "abs(-7)", text: "`abs()` returns the **absolute value**: the distance from zero, always positive. Useful for differences where only the size matters." },
              { code: "round(3.14159)", text: "`round()` **rounds** to the nearest whole number." },
            ],
            output: `[1] 4
[1] 7
[1] 3`,
            outputNote: "Each function returned a single number, which R displayed.",
            tryIt: "What is the square root of 2? Try `sqrt(2)`.",
          },
        },
        {
          kind: "text",
          md: `A function's return value can be stored in a variable or used straight away in more calculations:`,
        },
        {
          kind: "code",
          example: {
            id: "use-return-value",
            title: "Using what a function returns",
            code: `side <- sqrt(49)
side
side * 4
max(4, 9, 2)
sum(3, 5, 8)`,
            explanation: [
              { code: "side <- sqrt(49)", text: "A square has an area of 49. `sqrt(49)` returns 7, which is stored in `side`." },
              { code: "side\nside * 4", text: "Show the side length, then the perimeter (4 sides)." },
              { code: "max(4, 9, 2)", text: "`max()` returns the largest of the values you give it. (`min()` returns the smallest.)" },
              { code: "sum(3, 5, 8)", text: "`sum()` adds up all the values you give it." },
            ],
            output: `[1] 7
[1] 28
[1] 9
[1] 16`,
          },
        },
      ],
    },
    {
      id: "arguments",
      title: "Arguments: giving a function more instructions",
      blocks: [
        {
          kind: "definition",
          term: "Argument",
          md: `A value you pass to a function inside its parentheses. Several arguments are separated by commas. Many arguments have a **name**, such as \`digits\` in \`round(x, digits = 2)\`. The names a function expects (like \`x\` and \`digits\`) are also called its **parameters**.`,
        },
        {
          kind: "definition",
          term: "Default argument",
          md: `An argument that already has a value if you do not give one. For \`round()\`, \`digits\` defaults to 0, which is why \`round(3.14159)\` gives a whole number.`,
        },
        {
          kind: "code",
          example: {
            id: "round-digits",
            title: "Rounding to decimal places",
            code: `round(3.14159, digits = 2)
round(3.14159, 2)
round(sqrt(10), digits = 1)`,
            explanation: [
              { code: "round(3.14159, digits = 2)", text: "Two arguments: the number to round, and `digits = 2` – keep two decimal places. Naming the argument makes the code easy to read." },
              { code: "round(3.14159, 2)", text: "The same, without the name. R matches arguments by **position**: the second value goes to the second argument, which is `digits`." },
              {
                code: "round(sqrt(10), digits = 1)",
                text: "A function inside a function (*nesting*). R works from the inside out: first `sqrt(10)` = 3.162278…, then `round(..., digits = 1)`.",
              },
            ],
            output: `[1] 3.14
[1] 3.14
[1] 3.2`,
            outputNote: "Named and unnamed arguments give the same result. Named arguments are clearer, especially when a function has many of them.",
            tryIt: "Round the BMI from the earlier lesson, `70 / 1.75 ^ 2`, to one decimal place.",
          },
        },
        {
          kind: "text",
          md: `Here is a practical example that combines several things you know:`,
        },
        {
          kind: "code",
          example: {
            id: "tip-calculator",
            title: "A tip calculator",
            code: `bill <- 47.5
tip <- bill * 0.18
round(tip, 2)
total <- round(bill + tip, 2)
paste("Total to pay:", total)`,
            explanation: [
              { code: "bill <- 47.5\ntip <- bill * 0.18", text: "The bill and an 18% tip." },
              { code: "round(tip, 2)", text: "Show the tip rounded to 2 decimal places (cents)." },
              { code: "total <- round(bill + tip, 2)", text: "Add the tip to the bill, round it, and store it." },
              { code: `paste("Total to pay:", total)`, text: "Join a label and the number into one piece of text – `paste()` is explained in the next section." },
            ],
            output: `[1] 8.55
[1] "Total to pay: 56.05"`,
          },
        },
      ],
    },
    {
      id: "text-functions",
      title: "Functions for text",
      blocks: [
        {
          kind: "code",
          example: {
            id: "nchar-toupper",
            title: "Counting and changing letters",
            code: `name <- "Grace Hopper"
nchar(name)
toupper(name)
tolower(name)`,
            explanation: [
              { code: `name <- "Grace Hopper"`, text: "Store a name (Grace Hopper was a computing pioneer)." },
              { code: "nchar(name)", text: "`nchar()` counts the **number of characters**. The space counts too: 5 + 1 + 6 = 12." },
              { code: "toupper(name)", text: "`toupper()` returns the text in UPPER CASE." },
              { code: "tolower(name)", text: "`tolower()` returns the text in lower case." },
            ],
            output: `[1] 12
[1] "GRACE HOPPER"
[1] "grace hopper"`,
            outputNote: "`toupper()` and `tolower()` return new text; the variable `name` itself is unchanged unless you assign the result back to it.",
          },
        },
        {
          kind: "text",
          md: `\`paste()\` **joins** pieces of text (and numbers) into one string, with a space between each piece. \`paste0()\` does the same with no space.`,
        },
        {
          kind: "code",
          example: {
            id: "paste",
            title: "Joining text with paste()",
            code: `first <- "Grace"
last <- "Hopper"
paste(first, last)
paste0(first, last)
paste("Score:", 95)
paste("2026", "11", "06", sep = "-")`,
            explanation: [
              { code: "paste(first, last)", text: "Joins the two strings with a space in between." },
              { code: "paste0(first, last)", text: "`paste0()` joins with **no** separator." },
              { code: `paste("Score:", 95)`, text: "Numbers are turned into text automatically, so you can build sentences with results in them." },
              { code: `paste("2026", "11", "06", sep = "-")`, text: "The `sep` argument chooses the separator – here a dash instead of a space." },
            ],
            output: `[1] "Grace Hopper"
[1] "GraceHopper"
[1] "Score: 95"
[1] "2026-11-06"`,
            outputNote: "`paste()` always returns text, so every result is in quotes.",
          },
        },
        {
          kind: "text",
          md: `Remember the Module 1 problem that \`print("My age is", 28)\` did not work? \`paste()\` is the solution: build one string first, then print it.`,
        },
        {
          kind: "code",
          example: {
            id: "paste-print",
            title: "print() + paste()",
            code: `age <- 28
print(paste("My age is", age))`,
            explanation: [
              { code: "age <- 28", text: "Store the age." },
              { code: `print(paste("My age is", age))`, text: "`paste()` runs first (inside out) and returns `\"My age is 28\"`; `print()` then shows that single string." },
            ],
            output: `[1] "My age is 28"`,
            tryIt: "Add your city: `paste(\"My age is\", age, \"and I live in\", \"Lagos\")`.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m2-funs-q7",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `fruit <- "mango"
paste("I like", toupper(fruit))`,
            options: [`[1] "I like MANGO"`, `[1] "I likeMANGO"`, `[1] "I LIKE MANGO"`, `[1] "I like mango"`],
            answer: 0,
            optionFeedback: [
              "Correct – `toupper()` changes only the fruit, and `paste()` adds a space.",
              "`paste()` puts a space between pieces; `paste0()` would not.",
              "`toupper()` is applied only to `fruit`, not to \"I like\".",
              "`toupper(fruit)` turns mango into MANGO before pasting.",
            ],
            explanation: "R works from the inside out: `toupper(fruit)` gives `\"MANGO\"`, then `paste()` joins `\"I like\"` and `\"MANGO\"` with a space.",
            concept: "text-functions",
          },
        },
      ],
    },
    {
      id: "getting-help",
      title: "Getting help with ?",
      blocks: [
        {
          kind: "text",
          md: `Nobody remembers every function. Programmers look things up all the time, and R has a built-in help system:

- \`?round\` – open the help page for \`round()\`. (\`help(round)\` does the same.)
- \`??"square root"\` – search all help pages for a phrase when you don't know the function's name.

In RStudio the help page appears in the **Help** pane. On this website you can also look functions up in the **Functions** reference, or ask the **AI tutor** next to each lesson.`,
        },
        {
          kind: "table",
          caption: "The parts of an R help page",
          headers: ["Section", "What it tells you"],
          rows: [
            ["Description", "What the function does, in one or two sentences"],
            ["Usage", "How to call it, e.g. `round(x, digits = 0)` – this also shows default values"],
            ["Arguments", "What each argument means"],
            ["Value", "What the function returns"],
            ["Examples", "Example code you can copy and run – often the most useful part"],
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Read the Usage line",
          md: `The *Usage* line \`round(x, digits = 0)\` tells you a lot: \`round()\` takes a value \`x\`, and an argument \`digits\` whose default is \`0\`. That is exactly why \`round(3.14159)\` gave 3.`,
        },
      ],
    },
    {
      id: "reading-errors",
      title: "Reading an error message",
      blocks: [
        {
          kind: "definition",
          term: "Error",
          md: `A message from R saying "I cannot do this", after which R **stops** running your code. A mistake in code that causes an error or a wrong result is called a **bug**, and finding and fixing it is called **debugging**.`,
        },
        { kind: "diagram", name: "error-anatomy", caption: "An R error message: the word Error, where it happened (the call), and what went wrong (the message)." },
        {
          kind: "text",
          md: `Most R errors have the same shape:

\`\`\`
Error in sqrt("49") : non-numeric argument to mathematical function
\`\`\`

- **\`Error\`** – R has stopped.
- **\`in sqrt("49")\`** – *where* it happened: the piece of code (the *call*) R was running. Sometimes this part is missing and the message starts with \`Error:\`.
- **after the colon** – *what* went wrong. This is the most important part – read it slowly.`,
        },
        {
          kind: "steps",
          title: "How to fix an error",
          items: [
            "Don't panic – errors are normal and nothing is broken.",
            "Read the message after the colon. What is R complaining about?",
            "Look at the code mentioned in the message (or the line number) and check spelling, capitals, quotes, commas and parentheses.",
            "Change **one** thing and run the code again.",
            "Still stuck? Paste your code into the **Error Checker** page of this site, which explains R errors in plain English, or ask the AI tutor.",
          ],
        },
        {
          kind: "text",
          md: `Let's meet the five errors beginners see most often.

**1. "object '…' not found"** – R cannot find a variable with that name. Usually a typo, a capital letter, or a variable that was never created (or created further down).`,
        },
        {
          kind: "code",
          example: {
            id: "error-object-not-found",
            title: "object not found",
            code: `total_sales <- 2500
total_sale`,
            explanation: [
              { code: "total_sales <- 2500", text: "Creates `total_sales` (with an s)." },
              { code: "total_sale", text: "Asks for `total_sale` – the s is missing, so this name does not exist." },
            ],
            output: "Error: object 'total_sale' not found",
            expectError: true,
            outputNote: "Fix: use exactly the name you created, `total_sales`. Running `ls()` shows which names exist.",
          },
        },
        {
          kind: "text",
          md: `**2. "could not find function"** – R does not know a function with that name. Usually a misspelling or wrong capitals. (Later in the course you will also see this when a function comes from a package that has not been loaded.)`,
        },
        {
          kind: "code",
          example: {
            id: "error-no-function",
            title: "could not find function",
            code: `squareroot(25)`,
            explanation: [
              { code: "squareroot(25)", text: "There is no function called `squareroot`. The square-root function is `sqrt`." },
            ],
            output: `Error in squareroot(25) : could not find function "squareroot"`,
            expectError: true,
            outputNote: "Fix: `sqrt(25)`. If you are unsure of a name, search the help with `??\"square root\"` or look in the Functions reference.",
          },
        },
        {
          kind: "text",
          md: `**3. "non-numeric argument to binary operator"** – you tried to do arithmetic with something that is not a number, usually text in quotes. (A *binary operator* is one with a value on each side, like \`*\` or \`+\`.)`,
        },
        {
          kind: "code",
          example: {
            id: "error-non-numeric",
            title: "non-numeric argument to binary operator",
            code: `price <- "20"
price * 2`,
            explanation: [
              { code: `price <- "20"`, text: "The quotes make `price` text, not a number." },
              { code: "price * 2", text: "Multiplying text is impossible, so R stops." },
            ],
            output: "Error in price * 2 : non-numeric argument to binary operator",
            expectError: true,
            outputNote: "Fix: store a number (`price <- 20`) or convert it (`as.numeric(price) * 2`). Notice that the error shows up on line 2, but the real cause is on line 1 – the line in the message is not always the line to change.",
          },
        },
        {
          kind: "text",
          md: `**4. "unexpected symbol"** (and its cousins "unexpected numeric constant", "unexpected ')'"…) – a **syntax error**: R could not even read your code, because two things are next to each other without an operator or comma between them. R shows the line and puts a \`^\` under the spot where it got confused.`,
        },
        {
          kind: "code",
          example: {
            id: "error-unexpected-symbol",
            title: "unexpected symbol",
            code: `my score <- 10`,
            explanation: [
              { code: "my score <- 10", text: "A space in a variable name: R reads `my` and then, unexpectedly, another name `score`." },
            ],
            output: `Error: unexpected symbol (line 1, column 4)
1: my score
       ^`,
            expectError: true,
            outputNote: "The message tells you the line and column, and the `^` points at `score`. Fix: `my_score <- 10`.",
          },
        },
        {
          kind: "text",
          md: `**5. "unexpected string constant"** – a piece of text in quotes appears where R didn't expect one. Usually a missing comma between arguments, or a missing \`+\`/parenthesis.`,
        },
        {
          kind: "code",
          example: {
            id: "error-unexpected-string",
            title: "unexpected string constant",
            code: `paste("Hello" "World")`,
            explanation: [
              { code: `paste("Hello" "World")`, text: "Two strings side by side with no comma between them." },
            ],
            output: `Error: unexpected string constant (line 1, column 15)
1: paste("Hello" "World"
                  ^`,
            expectError: true,
            outputNote: "Fix: separate the arguments with a comma: `paste(\"Hello\", \"World\")`.",
          },
        },
        {
          kind: "table",
          caption: "Common errors at a glance",
          headers: ["Message contains…", "It usually means…", "Typical fix"],
          rows: [
            ["`object 'x' not found`", "No variable with that exact name exists", "Check spelling and capitals; create the variable first"],
            ["`could not find function \"f\"`", "No function with that name is available", "Check spelling and capitals (e.g. `print`, not `Print`)"],
            ["`non-numeric argument to binary operator`", "Maths with text", "Remove quotes or use `as.numeric()`"],
            ["`unexpected symbol` / `numeric constant`", "Two things next to each other with nothing between them", "Add the missing comma or operator, or remove a space in a name"],
            ["`unexpected string constant`", "A string where R didn't expect one", "Add the missing comma between arguments"],
            ["`unexpected end of input`", "The code stopped too early", "Close every `(` and every quote"],
          ],
        },
        {
          kind: "callout",
          tone: "info",
          title: "The Error Checker",
          md: `R Academy has an **Error Checker** page: paste any code that gives an error and it highlights the problem line and explains the message in plain English, with suggestions for fixing it.`,
        },
        {
          kind: "question",
          question: {
            id: "m2-funs-q8",
            type: "multiple-choice",
            prompt: "In the message `Error in sqrt(\"49\") : non-numeric argument to mathematical function`, which part tells you **what** went wrong?",
            options: [
              "non-numeric argument to mathematical function",
              "Error",
              "in sqrt(\"49\")",
              "The whole message means the same thing",
            ],
            answer: 0,
            optionFeedback: [
              "Correct – the text after the colon describes the problem: the argument is not a number.",
              "\"Error\" only tells you that R stopped.",
              "This part tells you *where* the problem happened.",
              "Each part has a different job: what happened, where, and why.",
            ],
            explanation: "The part after the colon is the actual message. Here it says the argument given to a maths function (`sqrt`) is not a number – because `\"49\"` is text.",
            concept: "error-messages",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Misspelling a function name or using capitals",
      wrong: `Sqrt(49)`,
      error: `could not find function "Sqrt"`,
      why: "Function names are case-sensitive, just like variable names. The square-root function is `sqrt` in lower case.",
      right: `sqrt(49)`,
    },
    {
      title: "Forgetting the parentheses",
      wrong: `toupper "hello"`,
      error: "unexpected string constant",
      why: "A function call needs parentheses around its arguments. Without them, R sees a name followed by a string and doesn't know what to do.",
      right: `toupper("hello")`,
    },
    {
      title: "Giving a maths function text",
      wrong: `sqrt("49")`,
      error: "non-numeric argument to mathematical function",
      why: "`\"49\"` is text because of the quotes. Maths functions like `sqrt()` and `round()` need numbers.",
      right: `sqrt(49)`,
    },
    {
      title: "Forgetting the comma between arguments",
      wrong: `round(3.14159 2)`,
      error: "unexpected numeric constant",
      why: "Arguments must be separated by commas. Without one, R sees two numbers side by side.",
      right: `round(3.14159, 2)`,
    },
    {
      title: "Not closing every parenthesis",
      wrong: `round(sqrt(10), 2`,
      error: "unexpected end of input",
      why: "When functions are nested, each `(` needs its own `)`. Count them: here there are two opening parentheses but only one closing one.",
      right: `round(sqrt(10), 2)`,
    },
    {
      title: "Expecting paste0() to add spaces",
      wrong: `paste0("Hello", "world")`,
      why: "`paste0()` joins pieces with nothing in between, giving `\"Helloworld\"`. There is no error, just a squashed result. Use `paste()` when you want spaces.",
      right: `paste("Hello", "world")`,
    },
  ],
  exerciseIds: ["m2-name-badge", "m2-fix-the-errors"],
  quiz: [
    {
      id: "m2-funs-q1",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `round(7.4567, 1)`,
      options: ["[1] 7.5", "[1] 7", "[1] 7.4", "[1] 7.46"],
      answer: 0,
      optionFeedback: [
        "Correct – one decimal place: 7.4567 rounds up to 7.5.",
        "That would be `round(7.4567)` with the default of 0 digits.",
        "The second decimal (5) means the first decimal rounds up, from 7.4 to 7.5.",
        "That is two decimal places; here `digits` is 1.",
      ],
      explanation: "The second argument of `round()` is `digits`. `round(7.4567, 1)` keeps one decimal place, and because the next digit is 5, it rounds up to 7.5.",
      concept: "function-arguments",
    },
    {
      id: "m2-funs-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `nchar("data")`,
      options: ["[1] 4", "[1] 1", `[1] "data"`, "[1] 6"],
      answer: 0,
      optionFeedback: [
        "Correct – d, a, t, a: four characters.",
        "`nchar()` counts the characters in the text, not the number of words.",
        "`nchar()` returns a number, not the text itself.",
        "The quotes are not counted – only the characters between them.",
      ],
      explanation: "`nchar()` returns the number of characters in a string. \"data\" has 4.",
      concept: "text-functions",
    },
    {
      id: "m2-funs-q3",
      type: "multiple-choice",
      prompt: "You run `Mean(5, 10)` and see `could not find function \"Mean\"`. What is the most likely cause?",
      options: [
        "The function name is spelled with a capital letter; it should be mean",
        "The numbers 5 and 10 are too small",
        "R is broken and needs to be reinstalled",
        "You need to put the numbers in quotes",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – R is case-sensitive, and the function is called `mean` in lower case.",
        "The numbers are fine; R cannot even find the function.",
        "R is fine! This message means R doesn't know a function with exactly that name.",
        "Quotes would turn the numbers into text, which would cause a different error.",
      ],
      explanation: "\"could not find function\" means no function with that exact name exists. Function names are case-sensitive, so `Mean` is not the same as `mean`.",
      concept: "error-messages",
    },
    {
      id: "m2-funs-q4",
      type: "find-error",
      prompt: "This code stops with an error. Click the line where R stops.",
      code: `name <- "Ada"
greeting <- paste("Hello", name)
print(greting)`,
      errorLine: 3,
      errorKind: "error",
      fix: `name <- "Ada"
greeting <- paste("Hello", name)
print(greeting)`,
      explanation: "Line 3 asks for `greting`, but the variable is called `greeting` (with two e's). R says `object 'greting' not found`.",
      concept: "error-messages",
    },
    {
      id: "m2-funs-q5",
      type: "fill-blank",
      prompt: "Complete the code so it prints `[1] \"GOOD MORNING\"`.",
      code: `___("good morning")`,
      accept: ["toupper"],
      hint: "It is the function that turns text into UPPER CASE.",
      explanation: "`toupper()` returns its text argument in capital letters. (`tolower()` does the opposite.)",
      concept: "text-functions",
    },
    {
      id: "m2-funs-q6",
      type: "true-false",
      prompt: "Typing `?round` opens the help page for the round() function.",
      answer: true,
      explanation: "A question mark followed by a function name opens its help page, with a description, the usage, the arguments and examples. `help(round)` does the same.",
      concept: "getting-help",
    },
  ],
  keyPoints: [
    "A function is called by its name followed by parentheses, e.g. sqrt(16); the result it hands back is its return value.",
    "Arguments go inside the parentheses, separated by commas; they can be given by position or by name (digits = 2).",
    "Many arguments have defaults – round() uses digits = 0 unless you say otherwise.",
    "Useful functions: round(), sqrt(), abs(), max(), sum(), nchar(), toupper(), tolower(), paste() and paste0().",
    "Use ?function_name (or help()) to open a function's help page; ??\"phrase\" searches all help pages.",
    "An error message has three parts: Error, where it happened (the call), and what went wrong (after the colon).",
    "\"object not found\" and \"could not find function\" usually mean a typo or wrong capitals; \"non-numeric argument\" means maths with text; \"unexpected …\" means a syntax mistake such as a missing comma.",
  ],
  concepts: ["built-in-functions", "function-arguments", "text-functions", "getting-help", "error-messages"],
  glossary: ["return-value", "parameter", "default-argument", "error", "bug", "debugging"],
  playground: `# Try some built-in functions
sqrt(81)
round(22.85714, digits = 1)
toupper("hello")
paste("R", "is", "fun")
`,
  prerequisites: ["operators-and-data-types"],
};
