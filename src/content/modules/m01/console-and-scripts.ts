import type { Lesson } from "../../types";

export const consoleAndScriptsLesson: Lesson = {
  id: "console-and-scripts",
  module: 1,
  title: "R, RStudio, the Console and Scripts",
  summary:
    "Find out how R differs from RStudio, learn the two ways of giving R instructions – the console and scripts – and see how both work on this website.",
  minutes: 15,
  objectives: [
    "Explain the difference between R (the language that does the work) and RStudio (a program that makes R easier to use).",
    "Describe when to type a command in the console and when to save code in a script.",
    "Run code on this website and know which part acts like a script and which part acts like the console.",
    "Read R's output, including the [1] and [26] labels at the start of a line.",
  ],
  intro: `People often mention **R** and **RStudio** in the same breath, but they are two different things. R is the *engine* that actually runs your code. RStudio is a *dashboard* – a friendly program that you use to write code and see the results.

There are also two ways of giving R instructions. In the **console** you type one command, press Enter and get an answer straight away – like asking a quick question. In a **script** you write many lines of code in a file, save it, and run it whenever you like – like writing down a recipe so you can cook it again.

On this website you get both, with nothing to install: the code editor works like a script, and the output area works like the console.`,
  sections: [
    {
      id: "r-vs-rstudio",
      title: "R versus RStudio",
      blocks: [
        {
          kind: "text",
          md: `Think of a car. The **engine** is what really makes the car move, but you never touch it directly – you use the steering wheel, pedals and dashboard. R is the engine: it reads your code and calculates the results. RStudio is the dashboard: it gives you a comfortable place to write code, see the output, look at your data and view charts.`,
        },
        { kind: "diagram", name: "r-vs-rstudio", caption: "R is the engine that runs code; RStudio is the dashboard you drive it with." },
        {
          kind: "definition",
          term: "RStudio",
          md: `A free program (made by the company Posit) that makes working with R easier. It organises your work into panes: a script editor, the console, a list of your stored data, and a pane for plots and help pages. RStudio needs R installed to work – it is a dashboard *for* R.`,
        },
        {
          kind: "table",
          caption: "R and RStudio side by side",
          headers: ["", "R", "RStudio"],
          rows: [
            ["What it is", "A programming language and the engine that runs it", "A program for writing and running R code comfortably"],
            ["Can it run code on its own?", "Yes", "No – it sends your code to R"],
            ["What you see", "A plain console window", "Several panes: editor, console, environment, plots/help"],
            ["Cost", "Free", "Free (desktop version)"],
          ],
        },
        {
          kind: "callout",
          tone: "info",
          title: "On this website: no installation needed",
          md: `R Academy runs a full version of R **inside your web browser** using *webR* (R converted so that browsers can run it). Everything in this course works right here.

When you later want R on your own computer, you install two things, in this order:
1. **R** itself, from the official CRAN website (cran.r-project.org).
2. **RStudio Desktop**, from Posit's website.

Then you open RStudio, and it uses R behind the scenes.`,
        },
      ],
    },
    {
      id: "the-console",
      title: "The console: one command at a time",
      blocks: [
        {
          kind: "definition",
          term: "Console",
          md: `The place where you type an R command, press Enter and immediately see the answer. In R and RStudio the console shows a \`>\` symbol (called the *prompt*) when it is ready for your next command.`,
        },
        {
          kind: "text",
          md: `In RStudio, a conversation with the console looks like this – you type the part after \`>\`, and R answers on the next line:

\`\`\`
> 7 + 8
[1] 15
\`\`\`

The \`>\` is **not** part of your code; it is just R saying "I'm ready". If a command is unfinished (for example you forgot a closing parenthesis), the console shows a \`+\` instead, meaning "I'm waiting for the rest". You can finish the command or press **Esc** to cancel it.

The console is perfect for quick questions – *what is 7 + 8?* – but anything you type there is not saved as a program. To keep your work, you use a script.`,
        },
        {
          kind: "code",
          example: {
            id: "console-question",
            title: "A quick console-style question",
            code: `7 + 8`,
            explanation: [{ code: "7 + 8", text: "One quick instruction: add 7 and 8. This is the kind of thing you would type straight into the console." }],
            output: "[1] 15",
            outputNote: "R answers immediately with `[1] 15`. Notice there is no `>` in the code itself – the prompt only appears in the console window.",
            tryIt: "Ask R another quick question, such as how many hours are in a week: `7 * 24`.",
          },
        },
      ],
    },
    {
      id: "scripts",
      title: "Scripts: code you can save and run again",
      blocks: [
        {
          kind: "definition",
          term: "Script",
          md: `A text file containing lines of R code, saved so you can run it again later. R script files end in \`.R\` (for example \`my_analysis.R\`). When you run a script, R carries out its lines in order, from top to bottom.`,
        },
        { kind: "diagram", name: "console-vs-script", caption: "The console runs one line right now; a script is a saved file of many lines you can run again and again." },
        {
          kind: "text",
          md: `Why bother with scripts? Because real work has many steps. With a script you can:

- **save** your work and come back to it tomorrow,
- **re-run** every step with one click (for example when new data arrives),
- **fix** a mistake on one line without retyping everything,
- **share** your exact steps with a classmate or colleague.

Here is a tiny three-line script about a week of walking. It uses \`print()\` to show some text – you will learn all about \`print()\` in the next lesson.`,
        },
        {
          kind: "code",
          example: {
            id: "tiny-script",
            title: "A tiny script",
            code: `print("Steps walked over three days")
8200 + 10450 + 7300
(8200 + 10450 + 7300) / 3`,
            explanation: [
              { code: `print("Steps walked over three days")`, text: "Line 1 shows a title so the output is easy to understand. The text is inside quotes." },
              { code: "8200 + 10450 + 7300", text: "Line 2 adds up the steps from three days." },
              { code: "(8200 + 10450 + 7300) / 3", text: "Line 3 adds the steps first (because of the parentheses), then divides by 3 to get the average per day." },
            ],
            output: `[1] "Steps walked over three days"
[1] 25950
[1] 8650`,
            outputNote:
              "R ran the three lines from top to bottom and printed one result for each, in the same order. Text is shown with its quotes; numbers are shown without them.",
            tryIt: "Add a fourth day of 9000 steps: change both calculations (and remember to divide by 4).",
          },
        },
        {
          kind: "text",
          md: `Scripts also make it easy to **change** your work. Here is a script that works out the cost of a school trip for 28 students, with an entry fee of 15 each and 120 for the bus:`,
        },
        {
          kind: "code",
          example: {
            id: "trip-script",
            title: "A script you can update",
            code: `print("Cost of the school trip")
28 * 15
28 * 15 + 120`,
            explanation: [
              { code: `print("Cost of the school trip")`, text: "A title for the output." },
              { code: "28 * 15", text: "The entry fees: 28 students × 15 each." },
              { code: "28 * 15 + 120", text: "The total: entry fees plus 120 for the bus. R multiplies before it adds, just like in maths class." },
            ],
            output: `[1] "Cost of the school trip"
[1] 420
[1] 540`,
            outputNote: "The entry fees come to 420 and the whole trip to 540.",
            tryIt: "Two more students sign up. Change 28 to 30 in **both** lines and run the script again. (In Module 2 you will learn to store the number of students once, in a *variable*, so you only have to change it in one place.)",
          },
        },
        {
          kind: "table",
          caption: "Console or script?",
          headers: ["", "Console", "Script"],
          rows: [
            ["How you use it", "Type one command, press Enter", "Write many lines, then run them"],
            ["Is it saved?", "No – it is a one-off", "Yes – saved in a .R file"],
            ["Best for", "Quick checks and experiments", "Real work you want to keep, repeat or share"],
            ["Everyday example", "Asking a friend a quick question", "Writing down a recipe"],
          ],
        },
      ],
    },
    {
      id: "this-website",
      title: "The console and scripts on this website",
      blocks: [
        {
          kind: "text",
          md: `On R Academy every code box and the playground have two parts:

- The **code editor** (where the code is written) works like a **script**: it can hold many lines, and pressing **Run** runs them all, from top to bottom.
- The **output panel** (where results appear) works like the **console**: it shows what R printed, including any messages, warnings or errors.`,
        },
        {
          kind: "steps",
          title: "Running your code",
          items: [
            "Type or change the code in the editor.",
            "Press **Run** – or use the keyboard shortcut **Ctrl + Enter** (Windows and Linux) or **Cmd + Enter** (Mac). RStudio uses the same shortcut, so it is worth learning now.",
            "Read the output panel. Each result appears in the same order as the code that produced it.",
          ],
        },
        {
          kind: "code",
          example: {
            id: "run-order",
            title: "Code runs from top to bottom",
            code: `print("First")
print("Second")
print("Third")`,
            explanation: [
              { code: `print("First")`, text: "Runs first, so its output appears first." },
              { code: `print("Second")`, text: "Runs second." },
              { code: `print("Third")`, text: "Runs last, so its output is at the bottom." },
            ],
            output: `[1] "First"
[1] "Second"
[1] "Third"`,
            outputNote: "The output follows the order of the code exactly. A script is a recipe: the steps happen in the order you write them.",
            tryIt: "Swap the first and last lines and run again. What happens to the order of the output?",
          },
        },
        {
          kind: "question",
          question: {
            id: "m1-console-q6",
            type: "multiple-choice",
            prompt: "You have written 20 lines of R code to analyse your monthly budget, and you want to run them again next month. Where should the code live?",
            options: ["In a script", "Typed into the console each time", "On a sticky note", "It does not matter"],
            answer: 0,
            optionFeedback: [
              "Correct – a script saves your code so you can re-run all 20 lines with one click.",
              "That works, but you would have to retype all 20 lines every month – and might make mistakes.",
              "A computer cannot run a sticky note! Save the code in a script file instead.",
              "It matters a lot: only a script keeps your code so you can run it again.",
            ],
            explanation: "Scripts are for code you want to keep, repeat or share. The console is for quick one-off commands.",
            concept: "scripts",
          },
        },
      ],
    },
    {
      id: "reading-output",
      title: "Reading R's output",
      blocks: [
        {
          kind: "text",
          md: `You have seen \`[1]\` at the start of every answer. When a result contains **many** values, R spreads them over several lines, and each line starts with the position of its first value. The code \`1:30\` means "the whole numbers from 1 to 30":`,
        },
        {
          kind: "code",
          example: {
            id: "many-values",
            title: "Where does [26] come from?",
            code: `1:30`,
            explanation: [
              { code: "1:30", text: "The colon `:` creates all the whole numbers from 1 up to 30 – thirty values in total." },
            ],
            output: ` [1]  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25
[26] 26 27 28 29 30`,
            outputNote:
              "The first line starts with `[1]` because it begins with the 1st value. The second line starts with `[26]` because the first number on it, 26, is the 26th value. These labels help you count your way through long results.",
            tryIt: "Try `1:100`. How many lines does R need, and what are the labels on the left?",
          },
        },
        {
          kind: "text",
          md: `There is one more thing to know about running several lines: if R hits a line it cannot understand, it **stops** there and prints an **error** message. The lines before the problem have already run, but the lines after it do not run at all.`,
        },
        {
          kind: "code",
          example: {
            id: "stops-at-error",
            title: "R stops at the first error",
            code: `print("This line runs")
print(oops)
print("This line never runs")`,
            explanation: [
              { code: `print("This line runs")`, text: "Works normally and prints its text." },
              {
                code: "print(oops)",
                text: "`oops` has no quotes, so R looks for something stored under the name `oops`. Nothing has that name, so R stops with an error.",
              },
              { code: `print("This line never runs")`, text: "Never reached, because R stopped on the line before." },
            ],
            output: `[1] "This line runs"
Error: object 'oops' not found`,
            expectError: true,
            outputNote:
              "You see the first result, then the error message. Errors are completely normal – they are R's way of telling you exactly what to fix. Here, adding quotes (`print(\"oops\")`) would fix it.",
            tryIt: "Fix the second line by putting quotes around `oops`, then run all three lines again.",
          },
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Copying the > prompt into your code",
      wrong: `> 2 + 3`,
      error: "unexpected '>'",
      why: "Books and websites often show console sessions with the `>` prompt in front of each command. The `>` is R saying \"ready\" – it is not part of the code. If you copy it, R tries to read it as code and gets confused.",
      right: `2 + 3`,
    },
    {
      title: "Copying the [1] from the output",
      wrong: `[1] 5 + 2`,
      error: "unexpected '['",
      why: "The `[1]` is a label R adds to its *answers*. It never belongs in the code you write.",
      right: `5 + 2`,
    },
    {
      title: "Forgetting to close a parenthesis",
      wrong: `(8200 + 10450`,
      error: "unexpected end of input",
      why: "Every opening parenthesis `(` needs a matching closing one `)`. In RStudio's console you would see a `+` prompt while R waits for the rest of the command; in a script you get this error.",
      right: `(8200 + 10450)`,
    },
  ],
  exerciseIds: ["m1-script-order", "m1-time-facts"],
  quiz: [
    {
      id: "m1-console-q1",
      type: "multiple-choice",
      prompt: "Which sentence best describes the relationship between R and RStudio?",
      options: [
        "R is the language and engine that runs the code; RStudio is a program that makes using R easier",
        "RStudio is the language; R is a website about it",
        "They are two names for exactly the same program",
        "RStudio is a newer version of R that replaces it",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – R is the engine, RStudio is the dashboard.",
        "It is the other way round: R is the language. RStudio is a program for working with it.",
        "They are different programs. RStudio needs R installed so it can send your code to R.",
        "RStudio does not replace R – it uses R behind the scenes.",
      ],
      explanation: "R does the actual work of running code. RStudio is a separate, free program that gives you a comfortable workspace (editor, console, plots) for using R.",
      concept: "r-vs-rstudio",
    },
    {
      id: "m1-console-q2",
      type: "true-false",
      prompt: "To run the code on the R Academy website you must first install R and RStudio on your computer.",
      answer: false,
      explanation: "On this website R runs inside your browser (webR), so there is nothing to install. You only need to install R (and RStudio) if you want to use R outside this site.",
      concept: "r-vs-rstudio",
    },
    {
      id: "m1-console-q3",
      type: "multiple-choice",
      prompt: "What is the main difference between the console and a script?",
      options: [
        "The console runs one command right away and does not save it; a script is a saved file of code you can run again",
        "The console can only do maths; a script can only show text",
        "Scripts run code from bottom to top",
        "There is no difference",
      ],
      answer: 0,
      optionFeedback: [
        "Correct – console for quick one-off commands, scripts for saved, repeatable work.",
        "Both can run any R code. The difference is whether the code is saved.",
        "Scripts run from top to bottom, just like reading a recipe.",
        "They run the same R code, but only a script keeps it for later.",
      ],
      explanation: "Use the console for quick questions and experiments; use a script for work you want to keep, repeat or share.",
      concept: "scripts",
    },
    {
      id: "m1-console-q4",
      type: "predict-output",
      prompt: "What does this script print?",
      code: `print("Start")
3 * 3
print("End")`,
      options: [
        `[1] "Start"
[1] 9
[1] "End"`,
        `[1] "End"
[1] 9
[1] "Start"`,
        `[1] "Start"
[1] "End"`,
        `Start
9
End`,
      ],
      answer: 0,
      optionFeedback: [
        "Correct – three lines of code, three results, in the same order.",
        "Code runs from top to bottom, so \"Start\" comes first.",
        "The middle line is a calculation, and its result is shown too.",
        "R puts the `[1]` label in front of each result, and shows text with quotes.",
      ],
      explanation: "R runs a script from top to bottom and shows each result in order. Text appears in quotes and every result starts with `[1]`.",
      concept: "reading-output",
    },
    {
      id: "m1-console-q5",
      type: "find-error",
      prompt: "This code was copied from a book and now gives an error. Click the faulty line.",
      code: `print("Adding numbers")
> 4 + 4
print("Done")`,
      errorLine: 2,
      errorKind: "error",
      fix: `print("Adding numbers")
4 + 4
print("Done")`,
      explanation: "The `>` at the start of line 2 is the console prompt that the book showed. It is not part of the code, so it must be removed.",
      concept: "console",
    },
  ],
  keyPoints: [
    "R is the engine that runs code; RStudio is a free dashboard program that makes R easier to use (it needs R installed).",
    "On this website R runs in your browser with webR, so you do not need to install anything.",
    "The console runs one command immediately and does not save it – great for quick checks.",
    "A script is a saved file of R code (ending in .R) that runs from top to bottom and can be re-run, fixed and shared.",
    "Here, the code editor acts like a script and the output panel acts like the console; press Run or Ctrl/Cmd + Enter.",
    "Labels like [1] and [26] show the position of the first value on each line of output.",
    "R stops at the first error; lines after it do not run.",
  ],
  concepts: ["r-vs-rstudio", "console", "scripts", "reading-output"],
  glossary: ["rstudio", "console", "script", "webr"],
  playground: `# This editor works like a script: every line runs from top to bottom.
print("My first script")
60 * 24
365 * 24
`,
  prerequisites: ["what-is-programming"],
};
