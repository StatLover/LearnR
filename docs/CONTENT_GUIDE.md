# R Academy – Content Authoring Guide

This guide explains how lessons, exercises, quizzes, projects and reference
material are written for R Academy, so that anyone can add new content that
matches the rest of the course. All content is plain TypeScript data typed by
[`src/content/types.ts`](../src/content/types.ts) – read that file first; every
field is documented there.

## 1. Audience and tone

* Readers are **absolute beginners**. Assume they have never programmed and do
  not know statistics. Stage 2 and 3 readers have finished the earlier modules.
* Use **simple, friendly English**: short sentences, second person ("you"),
  everyday analogies ("a variable is a labelled box"). Encourage; never blame.
* **Define every technical term the first time it appears**, in plain words.
  Use a `definition` block or a short parenthetical: "a *vector* (a list of
  values of the same type)".
* Explain *why* as well as *how*. After each example, explain the result and
  invite the learner to change something.
* No placeholder text, no "lorem ipsum", no "coming soon". Every sentence must
  teach something correct.

## 2. What every lesson contains

The lesson page renders these parts in this order (field in brackets):

1. Learning objectives (`objectives`) – what the learner will be able to do.
2. A simple explanation (`intro`) – the big picture in plain words, 1–3 short paragraphs.
3. Detailed explanations (`sections` → `text`, `definition`, `callout`, `diagram`, `table`, `steps` blocks).
4. Correct, executable R examples (`code` blocks with a `CodeExample`).
5. Line-by-line explanations (`example.explanation`).
6. Expected output (`example.output`, plus `example.outputNote` explaining it).
7. Common beginner mistakes (`mistakes`).
8. At least one interactive exercise (`exerciseIds` → module `exercises`).
9. A short quiz (`quiz`, 4–6 questions, mixed types).
10. A summary of key concepts (`keyPoints`).

A good lesson has 4–7 sections, 6–10 code examples, 1–2 inline `question`
blocks ("check your understanding") and 1–2 diagrams where one helps.

### Educational depth – the standard to match

Do not just show `scores <- c(80, 90, 100)`. Explain each piece:

* `scores` is the variable name.
* `<-` assigns a value to a variable.
* `c()` combines values into a vector.
* `80`, `90` and `100` are numeric values.
* A vector stores multiple values of the same basic type.

Then demonstrate and explain the results:

```r
scores <- c(80, 90, 100)

mean(scores)
max(scores)
min(scores)
```

```
[1] 90
[1] 100
[1] 80
```

…and ask the learner to modify the code (`tryIt`).

## 3. Code rules

* **Every example is self-contained.** Learners can run any example on its own,
  in any order, so each example creates or loads everything it uses (including
  `library()` calls and `read.csv()`).
* Use `<-` for assignment, `snake_case` names, spaces around operators, one
  statement per line. Keep examples short (usually 2–12 lines).
* Sample data: R Academy CSV files are available in the folder `data/`
  (`read.csv("data/students.csv")`; see `src/content/datasets.ts` and the files
  in `public/data/`). Built-in datasets such as `mtcars`, `iris`, `airquality`,
  `ToothGrowth`, `PlantGrowth`, `ChickWeight`, `women`, `cars` also work. Do
  **not** use `penguins` (needs R ≥ 4.5).
* Use `set.seed()` before anything random so output is reproducible. Code whose
  output changes between runs (`Sys.Date()`, `Sys.time()`) gets `verify: false`.
* Packages: only `dplyr`, `tidyr`, `ggplot2`, `stringr`, `lubridate` (plus base
  R). Call `library()` inside each example that needs one and list it in
  `packages`. dplyr verbs on a `data.frame` return a `data.frame` – prefer that
  to tibbles (`read.csv`, not `readr`), because tibble printing changes between
  versions.
* Things that do not work in the browser and must not appear in runnable code:
  `install.packages()` from CRAN mirrors (explain it in text instead – on the
  site packages are installed automatically), `setwd()` to personal folders,
  `file.choose()`, `readline()`, downloads from the internet, `system()`.
* R code that contains backslashes (regular expressions, `"\n"`) must survive
  the TypeScript string: write it with ``String.raw`...` `` or double each
  backslash. Template literals also need `` \` `` for backticks and `\${` for
  `${`. The verifier runs the exact string, so mistakes are caught.

## 4. Expected output must be real

The `output` of an example is **exactly** what R Academy's console prints, and
`npm run verify:content` runs every example through real R and fails if the
text differs. The console follows R's own format:

* printed values: `[1] 90`
* `message()` text is printed as is
* warnings after the expression that caused them:
  `Warning message:\nNAs introduced by coercion` or
  `Warning message:\nIn sqrt(-1) : NaNs produced`
* errors: `Error in log("a") : non-numeric argument to mathematical function`
  or `Error: object 'x' not found`; execution stops at the first error
* syntax errors: `Error: unexpected symbol (line 2, column 7)` followed by R's
  context lines
* package start-up notes ("Attaching package…") are **not** part of `output`

Never guess output. Write the example, run the verifier, and when the verifier
shows the actual output, check that your explanation still matches it before
copying it into `output`. Console width is 80 characters.

The browser runs **R 4.6 (webR)**. Content that needs packages is verified with
a local **R 4.3** (dplyr 1.1.4, ggplot2 3.4.4, tidyr 1.3.1), so avoid features
newer than R 4.3 / ggplot2 3.4 (`|>` and `\(x)` are fine).

## 5. Quizzes

Use a mix of `multiple-choice`, `predict-output`, `fill-blank`, `find-error` and
`true-false`. Every question has an `explanation` that teaches (why the right
answer is right). Add `optionFeedback` to multiple-choice questions where a
wrong option reflects a common misconception. `predict-output` options are exact
console outputs and are verified. `find-error` with `errorKind: "error"` is
verified to really fail on `errorLine`; its `fix` must run cleanly. Tag each
question with a `concept` that appears in a lesson's `concepts` list – the
dashboard uses these tags to suggest revision.

## 6. Exercises

* Each lesson links to at least one exercise; each module has easy, medium and
  challenge exercises (aim for 5–8 per module).
* Starter code is valid R (comments explaining what to write, maybe a partial
  line) – never `___` placeholders, because the learner runs it.
* Tests check **results**, not the exact code, so any correct solution passes.
  Use the helpers documented on `ExerciseTest` (`.out`, `.error`, `.plots`,
  `.code`, `.defined()`, `.has_geom()`, `.gg_label()`), e.g.
  `isTRUE(all.equal(average, 85))` or `grepl("Hello", .out, fixed = TRUE)`.
* `failMessage` is a friendly, specific nudge ("`total` should be the sum of all
  three prices – did you include `price3`?").
* 3 progressive hints: a gentle nudge, a stronger clue, then nearly the answer.
* `explanation` walks through the solution line by line.

## 7. Verifying and type-checking

```bash
npm run verify:content -- --module 3          # one module
npm run verify:content -- --file src/content/projects.ts
npm run verify:content                        # everything
npx tsc --noEmit                              # type-check
```

Fix every failure. A warning (for example "starter code already passes every
test") usually points at a real problem too.

## 8. Adding a new lesson

1. Create `src/content/modules/mNN/<lesson-id>.ts` exporting a `Lesson`.
2. Add it to the `lessons` array of the module file (`src/content/modules/mNN-*.ts`)
   and add its exercises to the module's `exercises`.
3. Run the verifier. The lesson automatically appears in the learning path,
   search, dashboard progress and the AI tutor's lesson context.
