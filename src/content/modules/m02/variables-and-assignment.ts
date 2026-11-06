import type { Lesson } from "../../types";

export const variablesAndAssignmentLesson: Lesson = {
  id: "variables-and-assignment",
  module: 2,
  title: "Variables and Assignment",
  summary:
    "Store values in named variables with <-, reuse them in calculations, update them, and choose names that R accepts and humans understand.",
  minutes: 20,
  objectives: [
    "Create a variable with the assignment arrow <- and display its value.",
    "Use variables in calculations instead of typing the same numbers again.",
    "Overwrite (update) a variable and predict its new value.",
    "Choose valid, readable variable names and remember that R is case-sensitive.",
  ],
  intro: `So far you have typed numbers straight into your calculations. That works for quick sums, but real programs need to **remember** things: a price, a name, a score. In R you remember a value by storing it in a **variable**.

Think of a variable as a **labelled box**. You put a value in the box and write a name on the label. Later you can ask for the box by its name and R hands you what is inside. You can also empty the box and put something new in it.

You store a value with the **assignment arrow** \`<-\`. For example, \`age <- 25\` means "put 25 in a box labelled \`age\`".`,
  sections: [
    {
      id: "creating-variables",
      title: "Creating a variable",
      blocks: [
        {
          kind: "definition",
          term: "Variable",
          md: `A name that refers to a stored value. Once you create a variable, you can use its name anywhere you would use the value itself. In R, a stored thing is also called an **object**.`,
        },
        {
          kind: "definition",
          term: "Assignment",
          md: `Storing a value in a variable. In R you assign with the arrow \`<-\` (a "less than" sign followed by a minus sign). Read \`age <- 25\` out loud as "age **gets** 25".`,
        },
        { kind: "diagram", name: "assignment", caption: "x <- 5 puts the value 5 into a box labelled x." },
        {
          kind: "code",
          example: {
            id: "first-variable",
            title: "Store a number, then look at it",
            code: `age <- 25
age`,
            explanation: [
              {
                code: "age <- 25",
                text: "`age` is the variable name, `<-` is the assignment arrow, and `25` is the value. The arrow points from the value into the name: \"put 25 into `age`\". This line prints **nothing** – assignment is silent.",
              },
              { code: "age", text: "Typing just the name asks R \"what is in the box called `age`?\". R shows the stored value." },
            ],
            output: "[1] 25",
            outputNote: "Only the second line produces output. The first line quietly stored the value; the second line displayed it.",
            tryIt: "Change 25 to your own age and run it again.",
          },
        },
        {
          kind: "text",
          md: `Variables can hold text too. Remember that text always goes inside quotes – the *variable name* does not.`,
        },
        {
          kind: "code",
          example: {
            id: "text-variable",
            title: "Store some text",
            code: `city <- "Nairobi"
print(city)`,
            explanation: [
              { code: `city <- "Nairobi"`, text: "Creates a variable called `city` holding the text `\"Nairobi\"`." },
              { code: "print(city)", text: "Prints the value stored in `city`. No quotes around `city` – we want the variable, not the word \"city\"." },
            ],
            output: `[1] "Nairobi"`,
            outputNote: "R shows the stored text, with quotes because it is a string.",
            tryIt: "Store your own city in the variable and print it.",
          },
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Typing the arrow quickly",
          md: `In RStudio, press **Alt + -** (Windows/Linux) or **Option + -** (Mac) to type \` <- \` in one go. You may also see \`=\` used for assignment (\`age = 25\`). It works, but \`<-\` is the standard R style, and this course uses it everywhere.`,
        },
      ],
    },
    {
      id: "using-variables",
      title: "Using variables in calculations",
      blocks: [
        {
          kind: "text",
          md: `The real power of variables is that you can calculate with them. R replaces each name with its stored value, then does the maths.`,
        },
        {
          kind: "code",
          example: {
            id: "shopping",
            title: "A shopping calculation",
            code: `price <- 4.5
quantity <- 3
total <- price * quantity
total`,
            explanation: [
              { code: "price <- 4.5", text: "Stores the price of one item, 4.5." },
              { code: "quantity <- 3", text: "Stores how many items we buy." },
              {
                code: "total <- price * quantity",
                text: "R looks up `price` (4.5) and `quantity` (3), multiplies them, and stores the answer, 13.5, in a **new** variable `total`.",
              },
              { code: "total", text: "Shows the value of `total`." },
            ],
            output: "[1] 13.5",
            outputNote: "The total cost is 13.5. Because the numbers live in variables, the last two lines describe the calculation in words: total = price × quantity.",
            tryIt: "Change `quantity` to 10 and run again. Only one number changed, but the total updates automatically.",
          },
        },
        {
          kind: "code",
          example: {
            id: "rectangle",
            title: "One variable, used many times",
            code: `width <- 8
height <- 5
area <- width * height
perimeter <- 2 * (width + height)
area
perimeter`,
            explanation: [
              { code: "width <- 8\nheight <- 5", text: "Store the two side lengths of a rectangle." },
              { code: "area <- width * height", text: "Area = width × height = 8 × 5 = 40." },
              { code: "perimeter <- 2 * (width + height)", text: "Perimeter = 2 × (8 + 5) = 26. The parentheses make R add first." },
              { code: "area\nperimeter", text: "Show both results." },
            ],
            output: `[1] 40
[1] 26`,
            outputNote: "Each variable name on its own line is displayed, in order.",
            tryIt: "Make the rectangle a square by setting `height <- 8`. What are the new area and perimeter?",
          },
        },
        {
          kind: "question",
          question: {
            id: "m2-vars-q7",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `a <- 10
b <- 4
a - b`,
            options: ["[1] 6", "[1] 14", "[1] -6", `[1] "a - b"`],
            answer: 0,
            optionFeedback: [
              "Correct – R replaces `a` with 10 and `b` with 4, then subtracts: 10 − 4 = 6.",
              "That would be `a + b`. The code subtracts.",
              "Order matters: `a - b` is 10 − 4, not 4 − 10.",
              "`a - b` has no quotes, so it is a calculation, not text.",
            ],
            explanation: "When you use a variable in a calculation, R uses the value stored in it. `a - b` becomes `10 - 4`, which is 6.",
            concept: "variables",
          },
        },
      ],
    },
    {
      id: "overwriting",
      title: "Overwriting and updating variables",
      blocks: [
        {
          kind: "text",
          md: `A variable holds **one** value at a time. If you assign a new value to an existing name, the old value is thrown away and replaced. This is called **overwriting**.`,
        },
        {
          kind: "code",
          example: {
            id: "overwrite",
            title: "Replacing a value",
            code: `score <- 70
score
score <- 85
score`,
            explanation: [
              { code: "score <- 70", text: "Creates `score` with the value 70." },
              { code: "score", text: "Shows 70." },
              { code: "score <- 85", text: "Puts 85 into the same box. The 70 is gone." },
              { code: "score", text: "Now shows 85." },
            ],
            output: `[1] 70
[1] 85`,
            outputNote: "The same name shows different values at different moments: a variable always holds its *latest* value.",
          },
        },
        {
          kind: "text",
          md: `You can also update a variable **using its own current value**. R always works out the right-hand side of \`<-\` first, then stores the result.`,
        },
        {
          kind: "code",
          example: {
            id: "update",
            title: "Adding to a running total",
            code: `steps <- 4000
steps <- steps + 2500
steps`,
            explanation: [
              { code: "steps <- 4000", text: "You have walked 4000 steps so far today." },
              {
                code: "steps <- steps + 2500",
                text: "First R calculates the right-hand side: the current `steps` (4000) + 2500 = 6500. Then it stores 6500 back into `steps`.",
              },
              { code: "steps", text: "Shows the updated value." },
            ],
            output: "[1] 6500",
            outputNote: "`steps <- steps + 2500` looks strange in maths class, but in R it simply means \"take the old value, add 2500, and save the result under the same name\".",
            tryIt: "Add another line `steps <- steps + 1000` before the last line. What do you expect to see?",
          },
        },
        {
          kind: "text",
          md: `An important detail: a variable stores a **value**, not a formula. If you change one variable, variables calculated from it earlier do **not** change by themselves.`,
        },
        {
          kind: "code",
          example: {
            id: "no-auto-update",
            title: "Variables don't update themselves",
            code: `x <- 2
y <- x * 10
x <- 5
y`,
            explanation: [
              { code: "x <- 2", text: "Stores 2 in `x`." },
              { code: "y <- x * 10", text: "Calculates 2 × 10 = 20 **right now** and stores the number 20 in `y`." },
              { code: "x <- 5", text: "Changes `x` to 5. This does not touch `y`." },
              { code: "y", text: "`y` still holds 20." },
            ],
            output: "[1] 20",
            outputNote: "Unlike a spreadsheet cell with a formula, `y` remembers the result from when it was created. To get the new result you would run `y <- x * 10` again.",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "R overwrites without asking",
          md: `R never warns you when you reuse a name – the old value simply disappears. Choose distinct names for things you want to keep, such as \`price_before\` and \`price_after\`.`,
        },
      ],
    },
    {
      id: "naming-rules",
      title: "Naming rules and good names",
      blocks: [
        {
          kind: "text",
          md: `R has a few rules about variable names:

- A name may contain **letters, numbers, dots \`.\` and underscores \`_\`**.
- It must **start with a letter** (or a dot that is not followed by a number).
- It **cannot contain spaces** or symbols like \`-\`, \`!\` or \`@\`.
- It cannot be one of R's **reserved words**, such as \`if\`, \`else\`, \`for\`, \`function\`, \`TRUE\`, \`FALSE\` or \`NULL\`.

Beyond the rules, good names describe what they hold. This course uses **snake_case**: lowercase words joined by underscores, like \`total_price\`.`,
        },
        {
          kind: "table",
          caption: "Which names does R accept?",
          headers: ["Name", "Allowed?", "Why"],
          rows: [
            ["`total_price`", "Yes", "Letters and an underscore – clear snake_case"],
            ["`score2`", "Yes", "Numbers are fine after the first letter"],
            ["`num.students`", "Yes", "Dots are allowed (but underscores are more common today)"],
            ["`2nd_place`", "No", "Starts with a number"],
            ["`my score`", "No", "Contains a space"],
            ["`my-score`", "No", "R reads `-` as minus: \"my minus score\""],
            ["`if`", "No", "A reserved word that R uses itself"],
            ["`x`", "Yes, but…", "Allowed, but it does not say what it holds"],
          ],
        },
        {
          kind: "code",
          example: {
            id: "good-names",
            title: "Clear, valid names",
            code: `first_name <- "Amina"
num_students <- 32
test_score_2 <- 91
num_students`,
            explanation: [
              { code: `first_name <- "Amina"`, text: "Two words joined by an underscore – easy to read." },
              { code: "num_students <- 32", text: "Says exactly what the number means: the number of students." },
              { code: "test_score_2 <- 91", text: "A number inside a name is fine, as long as the name does not *start* with it." },
              { code: "num_students", text: "Shows the value stored under that name." },
            ],
            output: "[1] 32",
            outputNote: "Only the last line prints. Well-chosen names make code read almost like a sentence.",
          },
        },
      ],
    },
    {
      id: "case-sensitivity",
      title: "R is case-sensitive",
      blocks: [
        {
          kind: "definition",
          term: "Case-sensitive",
          md: `Capital (UPPER CASE) and small (lower case) letters count as different. In R, \`age\`, \`Age\` and \`AGE\` are three completely different names.`,
        },
        {
          kind: "code",
          example: {
            id: "two-ages",
            title: "Two different variables",
            code: `age <- 30
Age <- 99
age
Age`,
            explanation: [
              { code: "age <- 30", text: "Creates `age` (small a)." },
              { code: "Age <- 99", text: "Creates a **different** variable, `Age` (capital A)." },
              { code: "age\nAge", text: "Each name has its own value." },
            ],
            output: `[1] 30
[1] 99`,
            outputNote: "Two boxes with almost the same label. This is confusing – which is why it's best to stick to lowercase names.",
          },
        },
        {
          kind: "text",
          md: `The most common result of a case mix-up is an error. Here the variable was created with a small \`t\` but requested with a capital \`T\`:`,
        },
        {
          kind: "code",
          example: {
            id: "case-error",
            title: "A case mix-up",
            code: `temperature <- 21
Temperature`,
            explanation: [
              { code: "temperature <- 21", text: "Creates `temperature` with a small t." },
              { code: "Temperature", text: "Asks for `Temperature` with a capital T – a name that was never created." },
            ],
            output: "Error: object 'Temperature' not found",
            expectError: true,
            outputNote: "\"Object not found\" means R has no variable with exactly that name. Whenever you see it, check the spelling *and* the capital letters.",
            tryIt: "Fix the second line so it prints 21.",
          },
        },
        {
          kind: "text",
          md: `To see which variables currently exist, use \`ls()\` (short for "list"). It prints the names of everything you have stored. RStudio also shows them in its **Environment** pane.`,
        },
        {
          kind: "code",
          example: {
            id: "list-variables",
            title: "What have I stored?",
            code: `height <- 172
weight <- 68
ls()`,
            explanation: [
              { code: "height <- 172\nweight <- 68", text: "Create two variables." },
              { code: "ls()", text: "Lists the names of all variables in your workspace, in alphabetical order." },
            ],
            output: `[1] "height" "weight"`,
            outputNote: "`ls()` returns the names as text, so they appear in quotes. When you get an \"object not found\" error, `ls()` shows you the names that *do* exist.",
          },
        },
        {
          kind: "question",
          question: {
            id: "m2-vars-q8",
            type: "true-false",
            prompt: "After running `Total <- 100`, the line `total` will print `[1] 100`.",
            answer: false,
            explanation: "R is case-sensitive. `Total` and `total` are different names, so `total` gives the error `object 'total' not found`.",
            concept: "case-sensitivity",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Mixing up capital and small letters",
      wrong: `total <- 50
Total`,
      error: "object 'Total' not found",
      why: "R is case-sensitive, so `Total` is a different name from `total`. Use exactly the same spelling and capitals every time.",
      right: `total <- 50
total`,
    },
    {
      title: "A space in a variable name",
      wrong: `my age <- 30`,
      error: "unexpected symbol",
      why: "R reads `my` and `age` as two separate things side by side, which makes no sense to it. Join words with an underscore instead.",
      right: `my_age <- 30`,
    },
    {
      title: "Starting a name with a number",
      wrong: `1st_score <- 88`,
      error: "unexpected symbol",
      why: "Variable names must start with a letter. R reads the `1` as a number and then doesn't know what to do with `st_score`.",
      right: `score_1 <- 88`,
    },
    {
      title: "Using a variable before creating it",
      wrong: `total <- price * 2
price <- 5`,
      error: "object 'price' not found",
      why: "R runs code from top to bottom. On the first line, `price` does not exist yet. Create a variable before you use it.",
      right: `price <- 5
total <- price * 2`,
    },
    {
      title: "Putting a space inside the arrow",
      wrong: `score < - 10`,
      error: "object 'score' not found",
      why: "With a space, `< -` is no longer an arrow: R reads it as \"is `score` less than minus 10?\". Since `score` doesn't exist, R complains. Always write `<-` with no space between the two characters.",
      right: `score <- 10`,
    },
    {
      title: "Quotes around a variable name",
      wrong: `city <- "Lima"
print("city")`,
      why: "With quotes, `\"city\"` is just the word city, so R prints `[1] \"city\"` instead of the stored value. There is no error – just the wrong result. Leave the quotes off when you mean the variable.",
      right: `city <- "Lima"
print(city)`,
    },
  ],
  exerciseIds: ["m2-create-variables", "m2-bank-balance"],
  quiz: [
    {
      id: "m2-vars-q1",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- 3
x <- x * 2
x`,
      options: ["[1] 6", "[1] 3", "[1] 9", "Error: object 'x' not found"],
      answer: 0,
      optionFeedback: [
        "Correct – R takes the old value 3, multiplies by 2 and stores 6 back in `x`.",
        "The second line overwrote `x`, so the 3 is gone.",
        "`x * 2` doubles the value: 3 × 2 = 6, not 3 × 3.",
        "`x` was created on the first line, so it exists.",
      ],
      explanation: "R calculates the right-hand side first (`3 * 2` = 6) and then stores the result in `x`, replacing the old value.",
      concept: "overwriting",
    },
    {
      id: "m2-vars-q2",
      type: "multiple-choice",
      prompt: "Which of these is a valid variable name in R?",
      options: ["my_score", "2score", "my score", "my-score"],
      answer: 0,
      optionFeedback: [
        "Correct – letters joined by an underscore.",
        "Names cannot start with a number.",
        "Names cannot contain spaces.",
        "R reads `-` as minus, so this means \"my minus score\".",
      ],
      explanation: "Variable names start with a letter and contain only letters, numbers, dots and underscores. `my_score` follows all the rules.",
      concept: "naming-rules",
    },
    {
      id: "m2-vars-q3",
      type: "true-false",
      prompt: "`Name` and `name` are the same variable in R.",
      answer: false,
      explanation: "R is case-sensitive: capital and small letters are different, so `Name` and `name` are two separate variables.",
      concept: "case-sensitivity",
    },
    {
      id: "m2-vars-q4",
      type: "fill-blank",
      prompt: "Complete the code to store the value 172 in a variable called `height`.",
      code: `height ___ 172`,
      accept: ["<-", "="],
      hint: "It is the assignment arrow: a less-than sign followed by a minus sign.",
      explanation: "`height <- 172` assigns the value 172 to the name `height`. (`=` also works, but `<-` is the usual R style.)",
      concept: "assignment",
    },
    {
      id: "m2-vars-q5",
      type: "find-error",
      prompt: "This code should calculate the area of a rectangle, but it stops with an error. Click the faulty line.",
      code: `width <- 6
depth <- 4
area <- Width * depth
area`,
      errorLine: 3,
      errorKind: "error",
      fix: `width <- 6
depth <- 4
area <- width * depth
area`,
      explanation: "The variable was created as `width` (small w) but line 3 uses `Width` (capital W). R is case-sensitive, so it says `object 'Width' not found`.",
      concept: "case-sensitivity",
    },
    {
      id: "m2-vars-q6",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `x <- 2
y <- x + 1
x <- 10
y`,
      options: ["[1] 3", "[1] 11", "[1] 10", "[1] 2"],
      answer: 0,
      optionFeedback: [
        "Correct – `y` was calculated as 2 + 1 = 3 and keeps that value.",
        "`y` does not recalculate when `x` changes. It stored the number 3.",
        "That is the new value of `x`, but the code prints `y`.",
        "`y` was set to `x + 1`, which was 3.",
      ],
      explanation: "A variable stores a value, not a formula. `y` got the value 3 when line 2 ran; changing `x` afterwards does not change `y`.",
      concept: "variables",
    },
  ],
  keyPoints: [
    "A variable is a named box that stores a value; create one with the assignment arrow, e.g. age <- 25.",
    "Assignment prints nothing; type the variable's name (or use print()) to see its value.",
    "R replaces variable names with their values in calculations, e.g. total <- price * quantity.",
    "Assigning to an existing name overwrites the old value; x <- x + 1 updates x using its current value.",
    "A variable stores a value, not a formula – it does not change when other variables change later.",
    "Names start with a letter, contain only letters, numbers, dots and underscores, and have no spaces; use snake_case.",
    "R is case-sensitive: age and Age are different variables, and a mismatch gives \"object not found\".",
  ],
  concepts: ["variables", "assignment", "overwriting", "naming-rules", "case-sensitivity"],
  glossary: ["variable", "assignment", "value", "object", "case-sensitive"],
  playground: `# Store values in variables, then use them
price <- 4.5
quantity <- 3
total <- price * quantity
total
`,
  prerequisites: ["first-r-program"],
};
