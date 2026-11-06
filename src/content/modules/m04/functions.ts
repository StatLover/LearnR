import type { Lesson } from "../../types";

export const functionsLesson: Lesson = {
  id: "writing-functions",
  module: 4,
  title: "Writing Your Own Functions",
  summary: "Package code you use again and again into your own functions, with arguments, default values and return values.",
  minutes: 40,
  objectives: [
    "Explain why functions make code shorter, clearer and less error-prone",
    "Write a function with function() and call it with different inputs",
    "Name the parts of a function: name, arguments, body and return value",
    "Use default arguments and call functions with named arguments",
    "Return results with the last expression or with return()",
    "Combine functions with if statements and loops",
  ],
  intro:
    "You have used many functions already: `mean()`, `round()`, `paste()`, `table()`… Each one is a small machine: you put something in (the **arguments**), it does its job, and it gives something back (the **return value**). You don't need to know how `mean()` works inside – you just use it.\n\n" +
    "Now you will build your own machines. Whenever you find yourself copying and pasting the same lines with small changes, that is a sign you need a function. Write the steps once, give them a name, and then use that name as often as you like.\n\n" +
    "Functions make your code shorter, easier to read, and safer: if you need to fix something, you fix it in **one** place instead of in every copy.",
  sections: [
    {
      id: "why-functions",
      title: "Why write functions?",
      blocks: [
        {
          kind: "definition",
          term: "Function",
          md: "A named, reusable block of code. It takes inputs (**arguments**), runs the code in its **body**, and gives back a result (its **return value**).",
        },
        {
          kind: "text",
          md: "Imagine converting three temperatures from Celsius to Fahrenheit. Without a function you repeat the formula – and every copy is a chance for a typo:\n\n" +
            "```r\nmorning <- 12 * 9 / 5 + 32\nnoon <- 21 * 9 / 5 + 32\nevening <- 16 * 9 / 5 + 23   # oops - a typo!\n```\n\n" +
            "With a function, the formula is written exactly once and every conversion uses the same, correct steps.",
        },
        {
          kind: "code",
          example: {
            id: "celsius-function",
            title: "Write once, use many times",
            code: `to_fahrenheit <- function(celsius) {
  celsius * 9 / 5 + 32
}

to_fahrenheit(12)
to_fahrenheit(21)
to_fahrenheit(16)`,
            explanation: [
              { code: "to_fahrenheit <- function(celsius) {", text: "Create a function and store it under the name `to_fahrenheit`. It has one input, called `celsius`." },
              { code: "  celsius * 9 / 5 + 32", text: "The body: the formula, written once." },
              { code: "to_fahrenheit(12)", text: "**Call** the function with the value 12. Inside, `celsius` is 12." },
            ],
            output: `[1] 53.6
[1] 69.8
[1] 60.8`,
          },
        },
      ],
    },
    {
      id: "function-anatomy",
      title: "Anatomy of a function",
      blocks: [
        { kind: "diagram", name: "function-anatomy", caption: "name <- function(arguments) { body } – the last value in the body is returned." },
        {
          kind: "code",
          example: {
            id: "say-hello",
            title: "The parts of a function",
            code: `say_hello <- function(name) {
  message_text <- paste("Hello,", name)
  message_text
}

say_hello("Amara")
say_hello("Ben")`,
            explanation: [
              { code: "say_hello", text: "The **name** of the function. Choose a verb that says what it does, in snake_case." },
              { code: "<-", text: "A function is stored with `<-`, just like any other value." },
              { code: "function(name)", text: "The keyword `function` creates the function. Inside the round brackets are its **arguments** – here one, called `name`." },
              { code: "{", text: "The curly brackets hold the **body**: the steps the function performs." },
              { code: `  message_text <- paste("Hello,", name)`, text: "Inside the body, `name` holds whatever value the caller gave." },
              { code: "  message_text", text: "The **last** line of the body is the **return value** – what the function gives back." },
              { code: `say_hello("Amara")`, text: "Calling the function: `\"Amara\"` goes into `name`, the body runs, and the result is printed." },
            ],
            output: `[1] "Hello, Amara"
[1] "Hello, Ben"`,
            tryIt: "Call `say_hello()` with your own name.",
          },
        },
        {
          kind: "definition",
          term: "Parameter and argument",
          md: "The name in the function definition (`name` in `function(name)`) is called a **parameter**. The actual value you pass in when calling (`\"Amara\"`) is the **argument**. In everyday talk, people often say \"argument\" for both.",
        },
        {
          kind: "callout",
          tone: "info",
          title: "Defining is not running",
          md: "Running the lines `say_hello <- function(name) { ... }` only **creates** the function – nothing is printed and no greeting happens yet. The body runs each time you **call** the function with round brackets: `say_hello(\"Amara\")`.",
        },
        {
          kind: "code",
          example: {
            id: "square-vector",
            title: "Your functions are vectorized too",
            code: `square <- function(x) {
  x^2
}

square(4)
square(c(1, 2, 3))`,
            explanation: [
              { code: "  x^2", text: "The body uses `^`, which is vectorized…" },
              { code: "square(c(1, 2, 3))", text: "…so the function automatically works on whole vectors." },
            ],
            output: `[1] 16
[1] 1 4 9`,
          },
        },
      ],
    },
    {
      id: "arguments",
      title: "Arguments: giving a function its inputs",
      blocks: [
        {
          kind: "text",
          md: "A function can have several arguments, separated by commas. When you call it, R matches the values to the arguments **by position** (first value to first argument, …) – or **by name**, if you write `name = value`. Named arguments can be given in any order and make calls easier to read.",
        },
        {
          kind: "code",
          example: {
            id: "multiple-args",
            title: "Two arguments",
            code: `rectangle_area <- function(width, height) {
  width * height
}

rectangle_area(3, 4)
rectangle_area(height = 10, width = 2)`,
            explanation: [
              { code: "rectangle_area <- function(width, height) {", text: "Two arguments: `width` first, `height` second." },
              { code: "rectangle_area(3, 4)", text: "By position: `width` is 3 and `height` is 4." },
              { code: "rectangle_area(height = 10, width = 2)", text: "By name: the order no longer matters." },
            ],
            output: `[1] 12
[1] 20`,
          },
        },
        {
          kind: "text",
          md: "Give an argument a **default value** with `=` in the definition. If the caller leaves that argument out, the default is used. Built-in functions do this all the time: `mean(x, na.rm = FALSE)` has the default `FALSE` for `na.rm`, which is why you only write it when you want `TRUE`.",
        },
        {
          kind: "code",
          example: {
            id: "default-args",
            title: "Default values",
            code: `greet <- function(name, greeting = "Hello") {
  paste(greeting, name)
}

greet("Chloe")
greet("Chloe", "Good morning")
greet(greeting = "Hi", name = "Dev")`,
            explanation: [
              { code: `greet <- function(name, greeting = "Hello") {`, text: "`greeting` has the default value `\"Hello\"`; `name` has no default, so it must always be given." },
              { code: `greet("Chloe")`, text: "Only `name` is given, so `greeting` uses its default." },
              { code: `greet("Chloe", "Good morning")`, text: "The second value replaces the default." },
              { code: `greet(greeting = "Hi", name = "Dev")`, text: "Named arguments, in any order." },
            ],
            output: `[1] "Hello Chloe"
[1] "Good morning Chloe"
[1] "Hi Dev"`,
            tryIt: "Change the default greeting to `\"Welcome\"` and call `greet(\"Chloe\")` again.",
          },
        },
        {
          kind: "text",
          md: "If an argument has **no** default and you forget it, R stops as soon as the body needs that value:",
        },
        {
          kind: "code",
          example: {
            id: "missing-argument",
            title: "A missing argument",
            code: `rectangle_area <- function(width, height) {
  width * height
}

rectangle_area(3)`,
            explanation: [
              { code: "rectangle_area(3)", text: "3 goes into `width`, but nothing goes into `height`, and it has no default." },
            ],
            output: `Error in rectangle_area(3) : argument "height" is missing, with no default`,
            outputNote: "The message names the missing argument, so the fix is easy: give it a value, or give the argument a default in the definition.",
            expectError: true,
          },
        },
        {
          kind: "question",
          question: {
            id: "m4-fun-q1",
            type: "predict-output",
            prompt: "What does this code print?",
            code: `power <- function(x, p = 2) {
  x^p
}
power(3)
power(2, 3)`,
            options: ["[1] 9\n[1] 8", "[1] 9\n[1] 9", "[1] 6\n[1] 6", "[1] 8\n[1] 9"],
            answer: 0,
            explanation: "`power(3)` uses the default `p = 2`: 3² = 9. `power(2, 3)` sets `x = 2` and `p = 3`: 2³ = 8.",
            optionFeedback: [
              "Correct!",
              "In the second call, the 3 replaces the default `p`, so it computes 2³.",
              "`^` means \"to the power of\", not multiplication.",
              "Match the values by position: in `power(2, 3)`, `x` is 2 and `p` is 3.",
            ],
            concept: "default-arguments",
          },
        },
      ],
    },
    {
      id: "return-values",
      title: "Return values: getting results out",
      blocks: [
        {
          kind: "definition",
          term: "Return value",
          md: "The result a function gives back to the code that called it. You can print it, store it in a variable, or use it in a calculation.",
        },
        {
          kind: "text",
          md: "A function automatically returns the value of the **last expression** in its body. Store the result with `<-` to use it later – a function's return value is just a value.",
        },
        {
          kind: "code",
          example: {
            id: "last-expression",
            title: "The last expression is returned",
            code: `add_tax <- function(price, rate = 0.2) {
  tax <- price * rate
  price + tax
}

add_tax(50)
total <- add_tax(100, rate = 0.1)
total
total * 2`,
            explanation: [
              { code: "  tax <- price * rate", text: "A helper variable. It exists only while the function runs." },
              { code: "  price + tax", text: "The last expression: its value is returned." },
              { code: "add_tax(50)", text: "50 plus 20% tax." },
              { code: "total <- add_tax(100, rate = 0.1)", text: "Store the returned value (110) in `total` – nothing is printed." },
              { code: "total * 2", text: "Use the stored result in a calculation." },
            ],
            output: `[1] 60
[1] 110
[1] 220`,
          },
        },
        {
          kind: "text",
          md: "Use `return()` when you want to give back a value **early** and stop the function right there. This is handy with `if`: as soon as you know the answer, return it.",
        },
        {
          kind: "code",
          example: {
            id: "return-early",
            title: "Returning early with return()",
            code: `check_age <- function(age) {
  if (age < 0) {
    return("Invalid age")
  }
  if (age >= 18) {
    return("Adult")
  }
  "Minor"
}

check_age(25)
check_age(12)
check_age(-3)`,
            explanation: [
              { code: `    return("Invalid age")`, text: "For a negative age, give back this text and **stop** – the rest of the body is skipped." },
              { code: `    return("Adult")`, text: "For adults, stop here with \"Adult\"." },
              { code: `  "Minor"`, text: "Only reached when neither `return()` ran. As the last expression, it is returned." },
            ],
            output: `[1] "Adult"
[1] "Minor"
[1] "Invalid age"`,
          },
        },
        {
          kind: "text",
          md: "A function returns **one** object. To give back several results, put them into a vector (or a list) and return that:",
        },
        {
          kind: "code",
          example: {
            id: "return-several",
            title: "Returning several values at once",
            code: `describe <- function(x) {
  c(mean = mean(x), min = min(x), max = max(x))
}

describe(c(4, 8, 15, 16, 23, 42))`,
            explanation: [
              { code: "  c(mean = mean(x), min = min(x), max = max(x))", text: "A vector of three values. Writing `name = value` inside `c()` gives each value a name." },
            ],
            output: `mean  min  max
  18    4   42`,
            outputNote: "A **named vector** prints each name above its value, instead of a `[1]`.",
          },
        },
      ],
    },
    {
      id: "functions-with-logic",
      title: "Putting it together: functions with if and loops",
      blocks: [
        {
          kind: "text",
          md: "Everything from this module fits inside a function. A function that contains an `if` chain turns a one-off decision into a reusable tool:",
        },
        {
          kind: "code",
          example: {
            id: "grade-function",
            title: "A reusable grading tool",
            code: `letter_grade <- function(score) {
  if (score >= 90) {
    "A"
  } else if (score >= 75) {
    "B"
  } else if (score >= 50) {
    "C"
  } else {
    "F"
  }
}

letter_grade(95)
letter_grade(62)
letter_grade(30)`,
            explanation: [
              { code: "letter_grade <- function(score) {", text: "One argument: the score to grade." },
              { code: "  if (score >= 90) {", text: "The whole `if` chain is the last (and only) expression, so the value of whichever block runs is returned." },
            ],
            output: `[1] "A"
[1] "C"
[1] "F"`,
            tryIt: "Add an \"A+\" grade for scores of 98 or more. Where in the chain must it go?",
          },
        },
        {
          kind: "code",
          example: {
            id: "count-above",
            title: "A function with a loop and a default",
            code: `count_above <- function(values, threshold = 50) {
  count <- 0
  for (v in values) {
    if (v > threshold) {
      count <- count + 1
    }
  }
  count
}

scores <- c(45, 78, 92, 50, 33)
count_above(scores)
count_above(scores, threshold = 80)`,
            explanation: [
              { code: "count_above <- function(values, threshold = 50) {", text: "Two arguments; `threshold` defaults to 50." },
              { code: "  count <- 0", text: "Start a counter – inside the function." },
              { code: "  count", text: "After the loop, return the counter." },
              { code: "count_above(scores, threshold = 80)", text: "Override the default with a named argument." },
            ],
            output: `[1] 2
[1] 1`,
            outputNote: "With the default threshold, 78 and 92 count (50 is not **greater** than 50). With 80, only 92 counts.",
          },
        },
        {
          kind: "code",
          example: {
            id: "function-on-data",
            title: "Using your function on real data",
            code: `percent <- function(part, whole) {
  round(part / whole * 100, 1)
}

students <- read.csv("data/students.csv")
passed <- sum(students$math >= 70)
percent(passed, nrow(students))`,
            explanation: [
              { code: "  round(part / whole * 100, 1)", text: "Turn a part of a whole into a percentage with one decimal place." },
              { code: "passed <- sum(students$math >= 70)", text: "Count the students with at least 70 in math (39 of them)." },
              { code: "percent(passed, nrow(students))", text: "Arguments can be any expression – here a variable and a function call." },
            ],
            output: `[1] 65`,
          },
        },
        {
          kind: "callout",
          tone: "note",
          title: "What happens inside stays inside",
          md: "Variables created inside a function, like `count` or `tax` above, exist only while the function runs – they do not appear in your workspace afterwards. This is called **scope**, and it keeps functions from accidentally changing your other variables. You will explore it in Module 8.",
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Calling a function before creating it",
      wrong: `area(3, 4)
area <- function(w, h) {
  w * h
}`,
      error: "could not find function \"area\"",
      why: "R runs code from top to bottom. On line 1, `area` does not exist yet. Run the definition first, then call the function.",
      right: `area <- function(w, h) {
  w * h
}
area(3, 4)`,
    },
    {
      title: "Forgetting an argument that has no default",
      wrong: `greet <- function(name, greeting) {
  paste(greeting, name)
}
greet("Ana")`,
      error: "argument \"greeting\" is missing, with no default",
      why: "The function needs two values but got one. Either pass both, or give `greeting` a default in the definition.",
      right: `greet <- function(name, greeting = "Hello") {
  paste(greeting, name)
}
greet("Ana")`,
    },
    {
      title: "Ending a function with an assignment",
      wrong: `add_one <- function(x) {
  result <- x + 1
}
add_one(5)`,
      why: "The last expression is the assignment `result <- x + 1`. Its value (6) is returned **invisibly**, so calling `add_one(5)` prints nothing – it looks as if the function does not work. End the body with the value you want to return.",
      right: `add_one <- function(x) {
  result <- x + 1
  result
}
add_one(5)`,
    },
    {
      title: "Misspelling the keyword function",
      wrong: `square <- fuction(x) {
  x^2
}`,
      error: "unexpected '{'",
      why: "`fuction(x)` looks like a call to an (unknown) function, and a `{` straight after a call makes no sense to R. Check the spelling of `function`.",
      right: `square <- function(x) {
  x^2
}
square(3)`,
    },
  ],
  exerciseIds: ["m4-first-function", "m4-tip-calculator", "m4-classify-scores"],
  quiz: [
    {
      id: "m4-fun-q2",
      type: "predict-output",
      prompt: "What does this code print?",
      code: `triple <- function(x) {
  x * 3
}
triple(4)`,
      options: ["[1] 12", "[1] 4", "[1] 7", "[1] 3"],
      answer: 0,
      explanation: "4 goes into `x`, and the body returns `4 * 3` = 12.",
      optionFeedback: [
        "Correct!",
        "4 is the input; the function returns the result of its body.",
        "The body multiplies, it does not add.",
        "3 is part of the formula, not the result.",
      ],
      concept: "calling-functions",
    },
    {
      id: "m4-fun-q3",
      type: "multiple-choice",
      prompt: "A function's body has no `return()`. What does the function give back?",
      options: [
        "Nothing – without return() a function has no result",
        "The value of the last expression in the body",
        "The value of the first line of the body",
        "Always TRUE",
      ],
      answer: 1,
      explanation: "R returns the value of the last expression that runs. `return()` is only needed to stop early.",
      optionFeedback: [
        "Every R function returns something; `return()` is optional.",
        "Correct!",
        "R evaluates the whole body and returns the **last** value.",
        "The result is whatever the last expression produces.",
      ],
      concept: "return-values",
    },
    {
      id: "m4-fun-q4",
      type: "fill-blank",
      prompt: "Complete the code to create a function called `cube`.",
      code: `cube <- ___(x) {
  x^3
}
cube(2)`,
      accept: ["function"],
      hint: "The keyword that creates a new function.",
      explanation: "`function(x) { ... }` creates a function with one argument, `x`. `cube(2)` then returns 8.",
      concept: "function-anatomy",
    },
    {
      id: "m4-fun-q5",
      type: "true-false",
      prompt: "When you call a function with named arguments, such as `rectangle_area(height = 10, width = 2)`, you can give them in any order.",
      answer: true,
      explanation: "R matches named arguments by their names, so the order does not matter. Only unnamed arguments are matched by position.",
      concept: "named-arguments",
    },
    {
      id: "m4-fun-q6",
      type: "find-error",
      prompt: "This code stops with an error. Click the line where R stops.",
      code: `greet <- function(name, greeting) {
  paste(greeting, name)
}
greet("Ana")`,
      errorLine: 4,
      errorKind: "error",
      fix: `greet <- function(name, greeting) {
  paste(greeting, name)
}
greet("Ana", "Hello")`,
      explanation: "The function needs two arguments, but the call on line 4 gives only one, so R reports *argument \"greeting\" is missing, with no default*. Pass a greeting, or give `greeting` a default value such as `greeting = \"Hello\"`.",
      concept: "arguments",
    },
  ],
  keyPoints: [
    "A function is a named, reusable block of code: `name <- function(arguments) { body }`.",
    "Defining a function only creates it; the body runs when you call it with round brackets.",
    "Arguments are matched by position or by name; named arguments can come in any order.",
    "A default value (`greeting = \"Hello\"`) is used when the caller leaves that argument out.",
    "A function returns the value of its last expression; `return()` gives a value back early and stops the function.",
    "Return several results together in a vector or a list.",
  ],
  concepts: [
    "functions",
    "function-anatomy",
    "calling-functions",
    "arguments",
    "default-arguments",
    "named-arguments",
    "return-values",
  ],
  glossary: ["function", "argument", "parameter", "default-argument", "return-value", "scope"],
  prerequisites: ["for-and-while-loops"],
  datasets: ["students"],
  playground: `# Build your own function
bmi <- function(weight_kg, height_m) {
  round(weight_kg / height_m^2, 1)
}

bmi(70, 1.75)
bmi(height_m = 1.6, weight_kg = 55)
`,
};
