import type { Project } from "../types";

export const housingEdaCapstoneProject: Project = {
  id: "housing-eda-capstone",
  title: "Capstone: A Complete Exploratory Analysis of House Prices",
  level: "capstone",
  summary:
    "Run a full analysis from question to written report on 200 house sales: check and clean the data, describe each variable, explore relationships with charts, fit a regression of price on size and neighborhood, check it, and summarise what you found.",
  intro: `This is your final project – a complete *exploratory data analysis* (EDA): investigating a dataset from every angle to understand it, before or instead of formal modelling. You will use almost everything from the course.

**The client.** A small, family-run (fictional) estate agency in a mid-sized city sells houses in four neighborhoods: Downtown, Riverside, Hillcrest and Oakwood. Sellers keep asking the same two questions: *"What is my house worth?"* and *"How much does the neighborhood matter?"* The agency gives you its records of 200 recent sales – size, bedrooms, bathrooms, year built, garage and sale price – and asks for a short, well-supported report.

**The plan.** Professional analyses follow a pipeline, and so will you:

1. **Question** – write down what you want to find out.
2. **Import** – load the data and take a first look.
3. **Data quality** – missing values, duplicates, impossible values, inconsistent labels.
4. **Cleaning** – fix what needs fixing and *document every decision*.
5. **Univariate summaries** – describe each important variable on its own.
6. **Relationships** – how price relates to size and to neighborhood.
7. **Visualisation** – charts that show the key patterns.
8. **Model** – a linear regression of price on size and neighborhood.
9. **Model check and predictions** – does the model fit, and what does it predict?
10. **Report** – a short written summary of the findings and their limits.

Each step builds on the previous ones, so work through them in order. The tests check your results, not your exact code – if you find another correct way, it will pass too.`,
  datasets: ["housing"],
  skills: [
    "Framing an analysis question",
    "Data-quality checks: missing values, duplicates, ranges, labels",
    "Imputing missing values by group and flagging them",
    "Univariate summaries and histograms",
    "Correlation and scatter plots",
    "Group summaries and box plots with dplyr and ggplot2",
    "Multiple linear regression with a numeric and a categorical predictor",
    "Residual checks and predictions",
    "Writing an analysis report",
  ],
  minutes: 120,
  packages: ["dplyr", "ggplot2"],
  steps: [
    {
      id: "question-import",
      title: "Ask the question and import the data",
      instructions: `Every good analysis starts with a clear question – it tells you which variables matter and when you are done.

1. Store your research question as one sentence in \`question\`. Base it on the client's two questions: how much is a house worth, and how much does the neighborhood matter? (For example: *"How much do size and neighborhood explain the sale price of a house?"*)
2. Load **dplyr** and **ggplot2**.
3. Read \`data/housing.csv\` into \`housing\`.
4. Take a first look with \`dim()\` (rows and columns), \`str()\` and \`head()\`.`,
      starterCode: `# Step 1: the question and the data
library(dplyr)
library(ggplot2)

# Write your research question as one sentence
question <- ""

# Import the data
housing <- read.csv("data/housing.csv")

# First look: number of rows and columns, structure, first rows

`,
      hints: [
        "A research question is specific and answerable with the data, e.g. it names the outcome (price) and the explanations you will study (size, neighborhood).",
        "`dim(housing)` returns the number of rows and columns; `str()` shows each column's type.",
        "`question <- \"How much do size and neighborhood explain the sale price of a house?\"`, then `dim(housing)`, `str(housing)` and `head(housing)`.",
      ],
      solution: `question <- "How much do size and neighborhood explain the sale price of a house?"

library(dplyr)
library(ggplot2)

housing <- read.csv("data/housing.csv")

dim(housing)
str(housing)
head(housing)
`,
      explanation: `- \`question\` names the **outcome** (sale price) and the two **explanations** to study (size and neighborhood). Writing it down keeps the analysis focused: bedrooms, bathrooms and garages are interesting, but they are secondary to this question.
- \`dim(housing)\` gives **200 8**: 200 sales and 8 columns.
- \`str(housing)\` shows the types: \`house_id\`, \`size_sqft\`, \`bedrooms\`, \`bathrooms\`, \`year_built\` and \`price\` are integers; \`neighborhood\` and \`garage\` are text.
- \`head(housing)\` shows the first six sales. House 1, for example, is a 1,770 sq ft Oakwood house with 4 bedrooms, built in 2008, with a garage, sold for $298,000; house 3 is a 2,710 sq ft Hillcrest house sold for $461,000.

Already you can guess the main story: bigger houses cost more. The rest of the project measures *how much* more, and how the neighborhood changes the picture.`,
      tests: [
        {
          name: "`question` is a sentence",
          check: `is.character(question) && length(question) == 1 && nchar(question) >= 20`,
          failMessage: "Write your research question as one sentence of text, e.g. `question <- \"How much do size and neighborhood explain the sale price of a house?\"`.",
        },
        {
          name: "`housing` has 200 rows and 8 columns",
          check: `is.data.frame(housing) && nrow(housing) == 200 && ncol(housing) == 8`,
          failMessage: "Read the file with `housing <- read.csv(\"data/housing.csv\")`.",
        },
      ],
    },
    {
      id: "data-quality",
      title: "Check the data quality",
      instructions: `Before trusting any number, check the data systematically. Answer four questions:

1. **Missing values:** count them per column with \`colSums(is.na(housing))\` and store the number of missing \`year_built\` values in \`n_missing_year\`.
2. **Duplicates:** every sale should have its own \`house_id\`. Store the number of repeated ids in \`n_duplicate_ids\` (use \`duplicated()\`).
3. **Consistent labels:** print \`table()\` of \`neighborhood\` and of \`garage\` – are there any misspellings?
4. **Plausible values:** print a \`summary()\` of \`size_sqft\`, \`bedrooms\`, \`bathrooms\`, \`year_built\` and \`price\` – any impossible values (negative sizes, prices of 0, houses built in the future)?

Finally, print the rows with a missing \`year_built\`.`,
      starterCode: `# Step 2: data quality

# 1. Missing values per column
colSums(is.na(housing))
n_missing_year <- 0

# 2. Repeated house ids
n_duplicate_ids <- 0

# 3. Are the category labels consistent?


# 4. Are the numeric values plausible?


# The rows with a missing year_built

`,
      hints: [
        "`sum(is.na(housing$year_built))` counts the missing years; `sum(duplicated(housing$house_id))` counts repeated ids.",
        "`table(housing$neighborhood)` and `table(housing$garage)`, then `summary(housing[, c(\"size_sqft\", \"bedrooms\", \"bathrooms\", \"year_built\", \"price\")])`.",
        "Print the incomplete rows with `housing[is.na(housing$year_built), ]`.",
      ],
      solution: `colSums(is.na(housing))
n_missing_year <- sum(is.na(housing$year_built))
n_missing_year

n_duplicate_ids <- sum(duplicated(housing$house_id))
n_duplicate_ids

table(housing$neighborhood)
table(housing$garage)

summary(housing[, c("size_sqft", "bedrooms", "bathrooms", "year_built", "price")])

housing[is.na(housing$year_built), ]
`,
      explanation: `- **Missing values:** only \`year_built\` has gaps – **4 missing** (2% of the rows). \`n_missing_year\` is 4.
- **Duplicates:** \`duplicated(housing$house_id)\` is \`FALSE\` for every row, so \`n_duplicate_ids\` is **0** – each sale appears once.
- **Labels:** exactly four neighborhoods – **Downtown 47, Hillcrest 60, Oakwood 45, Riverside 48** – and two garage values – **No 70, Yes 130**. No misspellings or stray spaces.
- **Ranges:** sizes from **630 to 2,850** sq ft, 1–5 bedrooms, 1–4 bathrooms, build years from **1950 to 2022**, prices from **$90,500 to $544,500**. All plausible – no negative sizes, zero prices or future years.
- **The 4 incomplete rows** are houses 14 and 103 (Downtown), 58 (Oakwood) and 167 (Riverside). They look normal in every other column.

Verdict: this is a clean dataset with one small issue. Writing the verdict down matters – a report should say "we checked for missing values, duplicates and impossible values" rather than leave readers to wonder.`,
      tests: [
        {
          name: "`n_missing_year` is 4",
          check: `isTRUE(n_missing_year == 4)`,
          failMessage: "Count the missing build years with `sum(is.na(housing$year_built))`.",
        },
        {
          name: "`n_duplicate_ids` is 0",
          check: `isTRUE(n_duplicate_ids == 0)`,
          failMessage: "Count repeated ids with `sum(duplicated(housing$house_id))`.",
        },
      ],
    },
    {
      id: "cleaning",
      title: "Clean the data and document your decisions",
      instructions: `Decide what to do with the 4 missing build years. The options:

- **Delete the 4 rows** – simple, but throws away their perfectly good size and price information.
- **Leave them as \`NA\`** – honest, but every calculation with \`year_built\` then needs \`na.rm = TRUE\`.
- **Impute** (fill in) a reasonable value – here, the median build year of the house's own neighborhood – and **flag** the filled values so you can always tell them apart.

Use the third option, and prepare the data for the analysis:

1. With dplyr, \`group_by(neighborhood)\` and \`mutate()\` two columns – in this order:
   - \`year_imputed = is.na(year_built)\` – the flag (\`TRUE\` for the 4 filled values);
   - \`year_built = ifelse(is.na(year_built), round(median(year_built, na.rm = TRUE)), year_built)\` – because of \`group_by()\`, the median is computed within each neighborhood.
   Then \`ungroup()\` and \`as.data.frame()\`, and store the result back in \`housing\`.
2. Convert \`neighborhood\` and \`garage\` into factors with \`factor()\` (categorical variables with fixed levels – the regression in Step 8 will use them).
3. Add \`price_per_sqft\` = price divided by size.
4. Print the 4 imputed rows (\`house_id\`, \`neighborhood\`, \`year_built\`) and check with \`str()\`.`,
      starterCode: `# Step 3: cleaning

# Fill the missing build years with the neighborhood median, and flag them
housing <- housing |>
  group_by(neighborhood) |>
  mutate(
    year_imputed = is.na(year_built)
    # add: year_built = ifelse(is.na(year_built), round(median(year_built, na.rm = TRUE)), year_built)
  ) |>
  ungroup() |>
  as.data.frame()

# Categorical variables as factors


# Price per square foot


# Check the imputed rows and the structure

`,
      hints: [
        "Inside `mutate()`, put a comma after `year_imputed = is.na(year_built)` and add the `year_built = ifelse(...)` line. The flag must come first, before the gaps are filled.",
        "`housing$neighborhood <- factor(housing$neighborhood)` – do the same for `garage`. Then `housing$price_per_sqft <- housing$price / housing$size_sqft`.",
        "Check with `housing[housing$year_imputed, c(\"house_id\", \"neighborhood\", \"year_built\")]` and `str(housing)`.",
      ],
      solution: `housing <- housing |>
  group_by(neighborhood) |>
  mutate(
    year_imputed = is.na(year_built),
    year_built = ifelse(is.na(year_built), round(median(year_built, na.rm = TRUE)), year_built)
  ) |>
  ungroup() |>
  as.data.frame()

housing$neighborhood <- factor(housing$neighborhood)
housing$garage <- factor(housing$garage)

housing$price_per_sqft <- housing$price / housing$size_sqft

housing[housing$year_imputed, c("house_id", "neighborhood", "year_built")]
str(housing)
`,
      explanation: `- \`group_by(neighborhood)\` makes the next \`mutate()\` work neighborhood by neighborhood. Inside it, \`median(year_built, na.rm = TRUE)\` is the median build year *of that neighborhood*.
- The order inside \`mutate()\` matters: \`year_imputed = is.na(year_built)\` is computed **first**, while the gaps still exist, so it is \`TRUE\` for exactly the 4 houses. Then \`ifelse()\` replaces each \`NA\` with the rounded median and keeps every other year unchanged.
- \`ungroup()\` removes the grouping and \`as.data.frame()\` turns the tibble back into a plain data frame.
- The imputed values: houses **14 and 103 (Downtown) → 1981**, **58 (Oakwood) → 1986** and **167 (Riverside) → 1993**. Oakwood's median is 1986.5; \`round()\` gives 1986 because R rounds an exact .5 to the nearest even number.
- \`factor()\` turns \`neighborhood\` into a factor with 4 levels in alphabetical order (Downtown, Hillcrest, Oakwood, Riverside) and \`garage\` into one with levels No and Yes. The first level, Downtown, will be the *reference level* in the regression.
- \`price_per_sqft\` divides price by size – a fair way to compare prices of houses of different sizes. House 1, for example, sold for about $168 per sq ft.
- \`str(housing)\` now shows **200 obs. of 10 variables**, with the two factors, the logical flag \`year_imputed\` and the new \`price_per_sqft\` column.

**Decision log for the report:** *4 missing build years (2%) were imputed with the median of the house's neighborhood and flagged in \`year_imputed\`. Build year is not part of the main question, so this choice cannot noticeably affect the conclusions.*`,
      tests: [
        {
          name: "No `year_built` value is missing any more",
          check: `!anyNA(housing$year_built) && nrow(housing) == 200`,
          failMessage: "Fill the gaps inside `mutate()` with `ifelse(is.na(year_built), round(median(year_built, na.rm = TRUE)), year_built)` – and keep all 200 rows.",
        },
        {
          name: "`year_imputed` flags exactly the 4 filled values",
          check: `"year_imputed" %in% names(housing) && sum(housing$year_imputed) == 4 && all(sort(housing$house_id[housing$year_imputed]) == c(14, 58, 103, 167))`,
          failMessage: "Create `year_imputed = is.na(year_built)` *before* filling the gaps (put it first inside `mutate()`).",
        },
        {
          name: "Imputed years use the neighborhood median (house 14 → 1981, house 167 → 1993)",
          check: `housing$year_built[housing$house_id == 14] == 1981 && housing$year_built[housing$house_id == 167] == 1993`,
          failMessage: "Use `group_by(neighborhood)` before `mutate()` so the median is computed per neighborhood, and round it.",
        },
        {
          name: "`neighborhood` and `garage` are factors and `price_per_sqft` exists",
          check: `is.factor(housing$neighborhood) && is.factor(housing$garage) && isTRUE(all.equal(housing$price_per_sqft, housing$price / housing$size_sqft))`,
          failMessage: "Use `factor()` on both columns and add `housing$price_per_sqft <- housing$price / housing$size_sqft`.",
        },
      ],
    },
    {
      id: "univariate",
      title: "Describe each variable on its own",
      instructions: `*Univariate* analysis means looking at one variable at a time: its centre, its spread and its shape.

1. Print \`summary(housing$price)\` and store the standard deviation of price in \`price_sd\`.
2. Print \`summary(housing$size_sqft)\`, the percentage of houses with a garage (rounded to whole numbers) and a table of \`bedrooms\`.
3. Create \`price_hist\`: a ggplot2 histogram of \`price\` with \`geom_histogram(binwidth = 25000)\` – each bar then covers a $25,000 price range. Add a title and axis labels and print it. Describe the shape: one peak or several? Symmetric or with a longer tail on one side?`,
      starterCode: `# Step 4: univariate summaries

# Price: centre and spread
summary(housing$price)
price_sd <- 0

# Size, garages and bedrooms


# Histogram of price
# price_hist <- ggplot(housing, aes(x = price)) +
#   geom_histogram(binwidth = 25000) + ...

`,
      hints: [
        "`price_sd <- sd(housing$price)`. Garage percentages: `round(prop.table(table(housing$garage)) * 100)`.",
        "A histogram needs only an x aesthetic: `ggplot(housing, aes(x = price)) + geom_histogram(binwidth = 25000)`.",
        "Add `fill = \"steelblue\", colour = \"white\"` inside `geom_histogram()` for clearer bars, then `+ labs(title = \"Distribution of sale prices\", x = \"Sale price ($)\", y = \"Number of houses\")`, and print `price_hist`.",
      ],
      solution: `summary(housing$price)
price_sd <- sd(housing$price)
price_sd

summary(housing$size_sqft)
round(prop.table(table(housing$garage)) * 100)
table(housing$bedrooms)

price_hist <- ggplot(housing, aes(x = price)) +
  geom_histogram(binwidth = 25000, fill = "steelblue", colour = "white") +
  labs(title = "Distribution of sale prices", x = "Sale price ($)", y = "Number of houses")
price_hist
`,
      explanation: `- **Price:** Min. $90,500, 1st Qu. $274,750, **median $343,750, mean $336,660**, 3rd Qu. $399,250, Max. $544,500. The middle half of the houses sold for between about $275,000 and $400,000.
- \`price_sd\` is **$81,189** – a typical house sells about $81,000 above or below the average, a large spread that the analysis has to explain.
- **Size:** 630 to 2,850 sq ft, median 1,930, mean 1,885.
- **Garages:** 65% of the houses have one (35% don't).
- **Bedrooms:** 1: 16, 2: 46, 3: 61, 4: 65, 5: 12 – most houses have 2–4 bedrooms.
- \`geom_histogram(binwidth = 25000)\` sorts the 200 prices into $25,000-wide bins and draws one bar per bin; \`fill\` colours the bars and \`colour = "white"\` outlines them so neighbouring bars stay distinct.

**Shape:** the histogram is a **single broad hump** – most prices fall between about $225,000 and $450,000, with the tallest bars between $325,000 and $425,000 – and it has a **longer tail on the left**: a handful of small, cheap houses (only 4 sold for under $175,000; the cheapest, a 630 sq ft Oakwood house, for $90,500). That tail pulls the mean ($336,660) slightly *below* the median ($343,750). No price is so extreme that it looks like an error – the most expensive house is a large 2,820 sq ft Downtown home at $544,500.`,
      tests: [
        {
          name: "`price_sd` ≈ 81,189",
          check: `isTRUE(all.equal(as.numeric(price_sd), 81188.99, tolerance = 1e-6))`,
          failMessage: "Use `price_sd <- sd(housing$price)`.",
        },
        {
          name: "`price_hist` is a histogram of price",
          check: `.has_geom(price_hist, "GeomBar") && isTRUE(all.equal(sum(ggplot2::layer_data(price_hist, 1)$count), 200))`,
          failMessage: "Build `price_hist` with `ggplot(housing, aes(x = price)) + geom_histogram(binwidth = 25000)`.",
        },
        {
          name: "The histogram is drawn",
          check: `.plots >= 1`,
          failMessage: "Print the histogram by writing `price_hist` on its own line.",
        },
      ],
    },
    {
      id: "price-vs-size",
      title: "Relationship 1: price and size",
      instructions: `Now look at relationships, starting with the most obvious one.

1. Store the correlation between \`size_sqft\` and \`price\` in \`size_cor\`.
2. Print the correlation matrix (rounded to 2 decimals) of \`size_sqft\`, \`bedrooms\`, \`bathrooms\`, \`year_built\` and \`price\`.
3. Create \`size_plot\`: a scatter plot with \`size_sqft\` on the x-axis and \`price\` on the y-axis, semi-transparent points (\`alpha = 0.6\`), a straight trend line (\`geom_smooth(method = "lm", se = FALSE)\`), a title and axis labels. Print it.`,
      starterCode: `# Step 5: price vs size

size_cor <- cor(housing$size_sqft, housing$price)
size_cor

# Correlation matrix of the numeric variables


# Scatter plot with a trend line
# size_plot <- ggplot(housing, aes(x = size_sqft, y = price)) + ...

`,
      hints: [
        "`round(cor(housing[, c(\"size_sqft\", \"bedrooms\", \"bathrooms\", \"year_built\", \"price\")]), 2)`.",
        "Scatter plot layers: `geom_point(alpha = 0.6)` and `geom_smooth(method = \"lm\", se = FALSE)`.",
        "`size_plot <- ggplot(housing, aes(x = size_sqft, y = price)) + geom_point(alpha = 0.6) + geom_smooth(method = \"lm\", se = FALSE) + labs(title = \"Bigger houses sell for more\", x = \"Living area (sq ft)\", y = \"Sale price ($)\")`, then `size_plot`.",
      ],
      solution: `size_cor <- cor(housing$size_sqft, housing$price)
size_cor

round(cor(housing[, c("size_sqft", "bedrooms", "bathrooms", "year_built", "price")]), 2)

size_plot <- ggplot(housing, aes(x = size_sqft, y = price)) +
  geom_point(alpha = 0.6) +
  geom_smooth(method = "lm", se = FALSE) +
  labs(title = "Bigger houses sell for more",
       x = "Living area (sq ft)", y = "Sale price ($)")
size_plot
`,
      explanation: `- \`size_cor\` is **0.849** – a very strong positive relationship. Size is clearly the main driver of price.
- The correlation matrix, read along the \`price\` row: **size 0.85, bedrooms 0.76, bathrooms 0.56, year built 0.18**. Bedrooms look important too – but bedrooms and size are themselves correlated at **0.88**: bigger houses simply have more bedrooms. Bedrooms mostly repeat the information already in size, so our question and model focus on size. Build year has only a weak relationship with price (0.18).
- In \`size_plot\`, each dot is one sale; \`alpha = 0.6\` makes the dots slightly transparent so overlapping dots show up darker. \`geom_smooth(method = "lm", se = FALSE)\` adds the best straight line (R prints "\`geom_smooth()\` using formula = 'y ~ x'").

The points follow the line closely and the relationship looks straight, not curved – so a linear model is a sensible choice. But the points also form a band that is quite wide: at 2,000 sq ft, prices vary by more than $100,000. Something else is shifting houses up or down. The next step tests the obvious candidate – the neighborhood.`,
      tests: [
        {
          name: "`size_cor` ≈ 0.849",
          check: `isTRUE(all.equal(as.numeric(size_cor), 0.8493674, tolerance = 1e-5))`,
          failMessage: "Use `cor(housing$size_sqft, housing$price)`.",
        },
        {
          name: "`size_plot` has points and a trend line",
          check: `.has_geom(size_plot, "GeomPoint") && .has_geom(size_plot, "GeomSmooth")`,
          failMessage: "Add `geom_point()` and `geom_smooth(method = \"lm\", se = FALSE)` to `size_plot`.",
        },
        {
          name: "Size is on the x-axis and price on the y-axis",
          check: `any(vapply(1:5, function(i) tryCatch({ d <- ggplot2::layer_data(size_plot, i); isTRUE(all.equal(sort(as.numeric(d$x)), sort(as.numeric(housing$size_sqft)))) && isTRUE(all.equal(sort(as.numeric(d$y)), sort(as.numeric(housing$price)))) }, error = function(e) FALSE), logical(1)))`,
          failMessage: "Map the columns with `aes(x = size_sqft, y = price)`.",
        },
        {
          name: "The plot is drawn",
          check: `.plots >= 1`,
          failMessage: "Print the plot by writing `size_plot` on its own line.",
        },
      ],
    },
    {
      id: "by-neighborhood",
      title: "Relationship 2: price by neighborhood",
      instructions: `Compare the four neighborhoods.

1. Create \`neighborhood_summary\` with \`group_by(neighborhood)\` and \`summarise()\`:
   - \`n\` – number of sales,
   - \`median_price\` – the median price,
   - \`mean_size\` – the mean size,
   - \`mean_price_per_sqft\` – the mean price per square foot.
   Sort it by \`median_price\`, highest first, end with \`as.data.frame()\` and print it.
2. Create \`nb_plot\`: a box plot of \`price\` by \`neighborhood\` (one box per neighborhood, \`fill = neighborhood\`, and \`show.legend = FALSE\` inside \`geom_boxplot()\` because the x-axis already names the boxes). Add a title and labels and print it.`,
      starterCode: `# Step 6: price by neighborhood

neighborhood_summary <- housing |>
  group_by(neighborhood) |>
  summarise(
    n = n(),
    median_price = median(price)
    # add mean_size and mean_price_per_sqft
  ) |>
  # sort by median_price, highest first
  as.data.frame()
neighborhood_summary

# Box plot of price per neighborhood
# nb_plot <- ggplot(housing, aes(x = neighborhood, y = price, fill = neighborhood)) + ...

`,
      hints: [
        "`mean_size = mean(size_sqft)` and `mean_price_per_sqft = mean(price_per_sqft)` inside `summarise()`.",
        "Sort with `arrange(desc(median_price)) |>` before `as.data.frame()`.",
        "`nb_plot <- ggplot(housing, aes(x = neighborhood, y = price, fill = neighborhood)) + geom_boxplot(show.legend = FALSE) + labs(title = \"Sale price by neighborhood\", x = \"Neighborhood\", y = \"Sale price ($)\")`.",
      ],
      solution: `neighborhood_summary <- housing |>
  group_by(neighborhood) |>
  summarise(
    n = n(),
    median_price = median(price),
    mean_size = mean(size_sqft),
    mean_price_per_sqft = mean(price_per_sqft)
  ) |>
  arrange(desc(median_price)) |>
  as.data.frame()
neighborhood_summary

nb_plot <- ggplot(housing, aes(x = neighborhood, y = price, fill = neighborhood)) +
  geom_boxplot(show.legend = FALSE) +
  labs(title = "Sale price by neighborhood", x = "Neighborhood", y = "Sale price ($)")
nb_plot
`,
      explanation: `- The summary, most expensive first:

| neighborhood | n | median_price | mean_size | mean_price_per_sqft |
|---|---|---|---|---|
| Downtown | 47 | 377,500 | 1,861 | 207.86 |
| Hillcrest | 60 | 365,000 | 1,865 | 192.74 |
| Riverside | 48 | 334,500 | 1,888 | 176.15 |
| Oakwood | 45 | 294,500 | **1,933** | **153.46** |

- Downtown has the highest median price and Oakwood the lowest – a gap of $83,000.
- The crucial detail is in \`mean_size\`: **Oakwood's houses are the largest on average, yet the cheapest.** So the price differences cannot be explained by size; the neighborhood itself matters. \`mean_price_per_sqft\` shows it directly: a square foot costs about **$208 Downtown but only $153 in Oakwood**.
- The box plot shows the same ranking, together with a wide spread inside every neighborhood (the boxes overlap) – size differences *within* each neighborhood are still at work.

This comparison is fair only because the neighborhoods have similar mixes of house sizes. If Downtown had only mansions, its high prices would say nothing about location. The next step looks at size and neighborhood together to be sure.`,
      tests: [
        {
          name: "`neighborhood_summary` has 4 rows, sorted by median price (Downtown first)",
          check: `nrow(neighborhood_summary) == 4 && as.character(neighborhood_summary$neighborhood[1]) == "Downtown" && !is.unsorted(rev(neighborhood_summary$median_price))`,
          failMessage: "Group by `neighborhood`, summarise, and sort with `arrange(desc(median_price))`.",
        },
        {
          name: "Downtown's mean price per sq ft ≈ 207.86 and Oakwood's mean size ≈ 1,933",
          check: `isTRUE(all.equal(neighborhood_summary$mean_price_per_sqft[neighborhood_summary$neighborhood == "Downtown"], 207.862, tolerance = 1e-5)) && isTRUE(all.equal(neighborhood_summary$mean_size[neighborhood_summary$neighborhood == "Oakwood"], 1933.333, tolerance = 1e-5))`,
          failMessage: "Add `mean_size = mean(size_sqft)` and `mean_price_per_sqft = mean(price_per_sqft)` to `summarise()`.",
        },
        {
          name: "`nb_plot` is a box plot and is drawn",
          check: `.has_geom(nb_plot, "GeomBoxplot") && .plots >= 1`,
          failMessage: "Build `nb_plot` with `geom_boxplot()` and print it.",
        },
      ],
    },
    {
      id: "combined-visual",
      title: "Visualise size and neighborhood together",
      instructions: `One chart can show both explanations at once: a scatter plot of price against size, with **one colour and one trend line per neighborhood**.

Create \`combined_plot\`:
1. \`size_sqft\` on the x-axis, \`price\` on the y-axis and \`colour = neighborhood\` – all inside \`ggplot(aes(...))\`, so that both the points and the trend lines are split by neighborhood.
2. \`geom_point(alpha = 0.6)\` and \`geom_smooth(method = "lm", se = FALSE)\`.
3. A title, axis labels and a legend title (\`colour = "Neighborhood"\` inside \`labs()\`).

Print it, and look at the four lines: do they have similar *slopes* (steepness)? Are they at different *heights*?`,
      starterCode: `# Step 7: size and neighborhood in one chart

combined_plot <- ggplot(housing, aes(x = size_sqft, y = price, colour = neighborhood)) +
  geom_point(alpha = 0.6)
  # add + geom_smooth(...) and + labs(...)

combined_plot
`,
      hints: [
        "Because `colour = neighborhood` is in `ggplot(aes(...))`, every layer – including `geom_smooth()` – is split by neighborhood.",
        "Add `+ geom_smooth(method = \"lm\", se = FALSE)` after `geom_point()`.",
        "`+ labs(title = \"Price vs size in each neighborhood\", x = \"Living area (sq ft)\", y = \"Sale price ($)\", colour = \"Neighborhood\")`, then print `combined_plot`.",
      ],
      solution: `combined_plot <- ggplot(housing, aes(x = size_sqft, y = price, colour = neighborhood)) +
  geom_point(alpha = 0.6) +
  geom_smooth(method = "lm", se = FALSE) +
  labs(title = "Price vs size in each neighborhood",
       x = "Living area (sq ft)", y = "Sale price ($)", colour = "Neighborhood")
combined_plot
`,
      explanation: `- Mapping \`colour = neighborhood\` in \`ggplot()\` applies it to every layer: the points get four colours, and \`geom_smooth()\` fits a **separate** straight line for each neighborhood (R prints the usual "\`geom_smooth()\` using formula = 'y ~ x'" note).
- What the chart shows:
  - **Four nearly parallel lines.** If you fit each neighborhood separately, the slopes are all close to **$131–$137 per square foot** (Hillcrest $131, Downtown $135, Riverside $137, Oakwood $137). An extra square foot adds about the same amount everywhere.
  - **Different heights.** The Downtown line is highest and the Oakwood line lowest, with Hillcrest and Riverside in between – the same ranking as in Step 6, but now *for houses of the same size*.
  - **Tight clouds.** Within each neighborhood the points hug their line much more closely than in the single-colour plot of Step 5; within-neighborhood correlations are 0.91–0.94.
  - **Overlapping sizes.** Every neighborhood has small and large houses, so the lines are compared over the same range.

"Parallel lines at different heights" is exactly the pattern described by a regression with **one common slope for size plus a separate shift for each neighborhood**: \`price ~ size_sqft + neighborhood\`. The chart has told you which model to fit.`,
      tests: [
        {
          name: "`combined_plot` has points and trend lines",
          check: `.has_geom(combined_plot, "GeomPoint") && .has_geom(combined_plot, "GeomSmooth")`,
          failMessage: "Add `geom_point()` and `geom_smooth(method = \"lm\", se = FALSE)`.",
        },
        {
          name: "Points are coloured by neighborhood (4 colours)",
          check: `length(unique(ggplot2::layer_data(combined_plot, 1)$colour)) == 4`,
          failMessage: "Put `colour = neighborhood` inside `aes()` in `ggplot()`.",
        },
        {
          name: "There is one trend line per neighborhood",
          check: `any(vapply(1:5, function(i) tryCatch({ d <- ggplot2::layer_data(combined_plot, i); nrow(d) != nrow(housing) && length(unique(d$group)) == 4 }, error = function(e) FALSE), logical(1)))`,
          failMessage: "Map `colour = neighborhood` in `ggplot(aes(...))` (not only inside `geom_point()`), so `geom_smooth()` also splits by neighborhood.",
        },
        {
          name: "The chart is drawn",
          check: `.plots >= 1`,
          failMessage: "Print the chart by writing `combined_plot` on its own line.",
        },
      ],
    },
    {
      id: "regression",
      title: "Fit the model: price ~ size + neighborhood",
      instructions: `Fit the model the chart suggested: a *multiple linear regression* with one numeric predictor (size) and one categorical predictor (neighborhood).

1. Fit \`price_model <- lm(price ~ size_sqft + neighborhood, data = housing)\` and print its \`summary()\`.
2. Print the coefficients rounded to 1 decimal with \`round(coef(price_model), 1)\` and the R-squared with \`summary(price_model)$r.squared\`.
3. For comparison, print the R-squared of a model with size only: \`summary(lm(price ~ size_sqft, data = housing))$r.squared\`.

For a factor such as \`neighborhood\`, \`lm()\` uses the first level (Downtown) as the *reference level* and estimates how much each other neighborhood differs from it, for houses of the same size.`,
      starterCode: `# Step 8: the regression model

# Price explained by size AND neighborhood
# price_model <- lm(price ~ ..., data = housing)


# Full summary


# Coefficients (rounded) and R-squared


# R-squared of a model with size only, for comparison

`,
      hints: [
        "Put the outcome on the left of `~` and the predictors on the right, joined with `+`: `lm(price ~ size_sqft + neighborhood, data = housing)`. Then `summary(price_model)` prints the coefficient table, the residual standard error and R-squared.",
        "`round(coef(price_model), 1)` and `summary(price_model)$r.squared`.",
        "`summary(lm(price ~ size_sqft, data = housing))$r.squared` fits and summarises the smaller model in one line.",
      ],
      solution: `price_model <- lm(price ~ size_sqft + neighborhood, data = housing)
summary(price_model)

round(coef(price_model), 1)
summary(price_model)$r.squared

summary(lm(price ~ size_sqft, data = housing))$r.squared
`,
      explanation: `The coefficient table of \`summary(price_model)\`, rounded:

| term | estimate | meaning |
|---|---|---|
| (Intercept) | 121,288 | starting point of the Downtown line (a 0 sq ft house – not meaningful on its own) |
| size_sqft | **134.8** | each extra square foot adds about **$135**, in every neighborhood |
| neighborhoodHillcrest | **-22,232** | same size, Hillcrest sells for about $22,000 less than Downtown |
| neighborhoodRiverside | **-51,147** | about $51,000 less than Downtown |
| neighborhoodOakwood | **-87,875** | about $88,000 less than Downtown |

- All p-values (\`Pr(>|t|)\`) are tiny (the largest is 0.00011 for Hillcrest), so every term adds real information.
- **Multiple R-squared: 0.8757** – size and neighborhood together explain about **88%** of the variation in price. The size-only model explains **72%** (R-squared 0.7214), so knowing the neighborhood adds 16 percentage points.
- **Residual standard error: 28,920** – the model's predictions are typically off by about $29,000, compared with the $81,189 standard deviation of price you found in Step 4.
- The size effect ($134.8 per sq ft) is a little higher than in the size-only model ($131.7): once neighborhood is accounted for, the large-but-cheap Oakwood houses no longer flatten the size line.

Reading coefficients correctly is the heart of regression: each one is the expected difference in price **when the other variables are held constant**. "Oakwood −$87,875" does not mean Oakwood houses sell for $87,875 less on average (the raw median gap was $83,000) – it means *a house of the same size* sells for that much less.`,
      tests: [
        {
          name: "`price_model` is lm(price ~ size_sqft + neighborhood)",
          check: `inherits(price_model, "lm") && length(coef(price_model)) == 5 && isTRUE(all.equal(unname(coef(price_model)[["size_sqft"]]), 134.809, tolerance = 1e-5))`,
          failMessage: "Fit `lm(price ~ size_sqft + neighborhood, data = housing)`.",
        },
        {
          name: "The model explains about 88% of the variation (R-squared ≈ 0.876)",
          check: `isTRUE(all.equal(summary(price_model)$r.squared, 0.875708, tolerance = 1e-5))`,
          failMessage: "Check that `price_model` includes both `size_sqft` and `neighborhood`, and uses all 200 houses.",
        },
      ],
    },
    {
      id: "check-predict",
      title: "Check the model and make predictions",
      instructions: `Before using a model, check it. *Residuals* are the prediction errors: actual price minus fitted (predicted) price. If the model is appropriate, a plot of residuals against fitted values looks like a shapeless cloud around 0 – no curve, no funnel.

1. Add two columns to \`housing\`: \`fitted\` with \`fitted(price_model)\` and \`residual\` with \`residuals(price_model)\`.
2. Create \`resid_plot\`: a scatter plot of \`fitted\` (x) against \`residual\` (y) with a horizontal red line at 0 (\`geom_hline(yintercept = 0, colour = "red")\`). Print it and print \`summary(housing$residual)\`.
3. Answer the client's first question for a typical house: create \`new_houses\`, a data frame with \`size_sqft = 2000\` and \`neighborhood = c("Downtown", "Hillcrest", "Riverside", "Oakwood")\`, and store \`predict(price_model, newdata = new_houses)\` in \`predictions\`. Print them rounded.`,
      starterCode: `# Step 9: check the model, then predict

# Fitted values and residuals
housing$fitted <- fitted(price_model)
# housing$residual <- ...


# Residuals vs fitted values
# resid_plot <- ggplot(housing, aes(x = fitted, y = residual)) + ...


# Predicted price of a 2,000 sq ft house in each neighborhood
new_houses <- data.frame(
  size_sqft = 2000,
  neighborhood = c("Downtown", "Hillcrest", "Riverside", "Oakwood")
)
# predictions <- predict(...)

`,
      hints: [
        "`housing$residual <- residuals(price_model)`.",
        "`resid_plot <- ggplot(housing, aes(x = fitted, y = residual)) + geom_point(alpha = 0.6) + geom_hline(yintercept = 0, colour = \"red\")`, plus a title and labels.",
        "`predictions <- predict(price_model, newdata = new_houses)` and `round(predictions)`.",
      ],
      solution: `housing$fitted <- fitted(price_model)
housing$residual <- residuals(price_model)

resid_plot <- ggplot(housing, aes(x = fitted, y = residual)) +
  geom_point(alpha = 0.6) +
  geom_hline(yintercept = 0, colour = "red") +
  labs(title = "Residuals vs fitted values",
       x = "Fitted price ($)", y = "Residual ($)")
resid_plot
summary(housing$residual)

new_houses <- data.frame(
  size_sqft = 2000,
  neighborhood = c("Downtown", "Hillcrest", "Riverside", "Oakwood")
)
predictions <- predict(price_model, newdata = new_houses)
round(predictions)
`,
      explanation: `- \`fitted(price_model)\` returns the model's predicted price for each of the 200 houses and \`residuals(price_model)\` the difference between the actual and the predicted price.
- **The residual plot** shows a cloud of points spread evenly above and below the red zero line across the whole range of fitted prices – no curve (which would mean a straight line is the wrong shape) and no funnel (which would mean errors grow for expensive houses). The model's assumptions look reasonable.
- \`summary(housing$residual)\`: the residuals run from **-$79,766 to +$97,359** with a median of about **$2** and a mean of 0. Half of the houses sell within about **±$19,000** of the prediction (1st Qu. -19,610, 3rd Qu. 18,610). The largest positive residual is house 156, a 1,820 sq ft Downtown house that sold for $464,000 – about $97,000 more than predicted. Something the data do not record (a renovation? a great view?) probably explains it.
- \`new_houses\` has one row per neighborhood, all 2,000 sq ft; \`predict()\` needs the same column names as the model. The predictions:

| neighborhood | predicted price for 2,000 sq ft |
|---|---|
| Downtown | **$390,907** |
| Hillcrest | **$368,675** |
| Riverside | **$339,760** |
| Oakwood | **$303,032** |

The same house is predicted to be worth about $88,000 more Downtown than in Oakwood. Remember the typical error of about ±$29,000 when quoting such numbers, and only predict for sizes inside the data's range (630–2,850 sq ft) – the model knows nothing about a 6,000 sq ft mansion.`,
      tests: [
        {
          name: "`housing$residual` holds the model's residuals",
          check: `"residual" %in% names(housing) && isTRUE(all.equal(unname(housing$residual), unname(residuals(price_model))))`,
          failMessage: "Add `housing$residual <- residuals(price_model)`.",
        },
        {
          name: "`resid_plot` is a scatter plot of residuals and is drawn",
          check: `.has_geom(resid_plot, "GeomPoint") && .plots >= 1`,
          failMessage: "Build `resid_plot` with `geom_point()` (plus `geom_hline(yintercept = 0)`) and print it.",
        },
        {
          name: "`predictions` contains the 4 predicted prices (Downtown ≈ 390,907, Oakwood ≈ 303,032)",
          check: `length(predictions) == 4 && isTRUE(all.equal(sort(as.numeric(predictions)), sort(c(390906.6, 368675.0, 339759.8, 303031.7)), tolerance = 1e-6))`,
          failMessage: "Use `predict(price_model, newdata = new_houses)` with `size_sqft = 2000` and the four neighborhood names.",
        },
      ],
    },
    {
      id: "final-report",
      title: "Write the final report",
      instructions: `Finish the analysis the way a professional would: with a short report that answers the question in plain language.

1. **In comments** (lines starting with \`#\`), write your summary for the agency: the answer to the question, the most important numbers, how you handled data problems, and the limitations of the analysis. Comments are part of the code but are not run – perfect for written conclusions next to the analysis that supports them.
2. **In code**, create a character vector \`report\` with **at least five** sentences built with \`paste0()\` from your results, so that the key numbers can never be mistyped. Include the question, the price of an extra square foot (from \`coef(price_model)\`), the neighborhood effect, the R-squared and a limitation.
3. Print it with \`writeLines(report)\`.

Tip: \`format(x, big.mark = ",")\` prints a large number with thousands separators, e.g. \`format(87875, big.mark = ",")\` gives \`"87,875"\`.`,
      starterCode: `# Step 10: final report

# ---- Written summary (comments) ----
# Question:
# Answer:
# Key numbers:
# Data issues and decisions:
# Limitations:

# ---- Key findings built from the results ----
coefs <- coef(price_model)

report <- c(
  paste0("Question: ", question)
  # add at least four more sentences, separated by commas
)

writeLines(report)
`,
      hints: [
        "`coefs[[\"size_sqft\"]]` is the price of one extra square foot; `coefs[[\"neighborhoodOakwood\"]]` is the Oakwood difference (negative).",
        "R-squared as a percentage: `round(summary(price_model)$r.squared * 100)`. Missing years: `n_missing_year`.",
        "Example sentence: `paste0(\"Each extra square foot adds about $\", round(coefs[[\"size_sqft\"]]), \" to the price.\")`. A limitation can be plain text, e.g. \"The data cover only 200 sales in four neighborhoods, and features such as condition or views are not recorded.\"",
      ],
      solution: `# ---- Written summary (comments) ----
# Question: How much do size and neighborhood explain the sale price of a house?
# Answer: Both matter a lot. Size is the main driver: each extra square foot
#   adds about $135, in every neighborhood. For a house of the same size,
#   Downtown is the most expensive neighborhood, followed by Hillcrest
#   (-$22k), Riverside (-$51k) and Oakwood (-$88k).
# Key numbers: price ~ size + neighborhood explains 88% of the variation in
#   price (size alone: 72%); typical prediction error about $29,000.
#   A 2,000 sq ft house: about $391k Downtown vs $303k in Oakwood.
# Data issues and decisions: the data were clean apart from 4 missing build
#   years (2%), filled with the neighborhood median and flagged.
# Limitations: 200 sales from four neighborhoods only; condition, views and
#   renovations are not recorded; the model describes these sales and should
#   not be used for houses much smaller or larger than 630-2,850 sq ft.

# ---- Key findings built from the results ----
coefs <- coef(price_model)

report <- c(
  paste0("Question: ", question),
  paste0("Data: ", nrow(housing), " house sales in 4 neighborhoods; ", n_missing_year,
         " missing build years were filled with the neighborhood median."),
  paste0("Size is the main driver: each extra square foot adds about $",
         round(coefs[["size_sqft"]]), " to the price (correlation ", round(size_cor, 2), ")."),
  paste0("Location matters too: for the same size, Oakwood homes sell for about $",
         format(round(-coefs[["neighborhoodOakwood"]]), big.mark = ","), " less than Downtown homes."),
  paste0("Size and neighborhood together explain ", round(summary(price_model)$r.squared * 100),
         "% of the variation in price; predictions are typically off by about $",
         format(round(summary(price_model)$sigma, -3), big.mark = ","), "."),
  "Limitation: only 200 sales were analysed, and features such as condition, views or renovations are not in the data."
)

writeLines(report)
`,
      explanation: `**The comments** hold the human-readable report: question, answer, key numbers, data decisions and limitations. Keeping them right next to the code means anyone can see exactly which analysis supports each claim.

**The \`report\` vector** repeats the key findings with the numbers pulled straight from the results:

- *Question: How much do size and neighborhood explain the sale price of a house?*
- *Data: 200 house sales in 4 neighborhoods; 4 missing build years were filled with the neighborhood median.*
- *Size is the main driver: each extra square foot adds about $135 to the price (correlation 0.85).* – \`round(coefs[["size_sqft"]])\` turns 134.809 into 135.
- *Location matters too: for the same size, Oakwood homes sell for about $87,875 less than Downtown homes.* – the coefficient is negative (-87,874.8), so \`-coefs[[...]]\` makes it positive for the sentence, and \`format(..., big.mark = ",")\` adds the comma.
- *Size and neighborhood together explain 88% of the variation in price; predictions are typically off by about $29,000.* – \`summary(price_model)$sigma\` is the residual standard error (28,920); \`round(..., -3)\` rounds to the nearest thousand.
- *Limitation: only 200 sales were analysed, and features such as condition, views or renovations are not in the data.*

**Answer to the client:** *"Your house's size sets the basic price – roughly $135 per square foot – and the neighborhood shifts it up or down by as much as $88,000. Together they explain almost 90% of the differences in sale prices, though any individual estimate can be off by around $29,000."*

Congratulations – you have completed a full analysis: from a question, through quality checks, cleaning, description, visualisation and modelling, to a clear, honest answer.`,
      tests: [
        {
          name: "`report` is a character vector with at least 5 sentences",
          check: `is.character(report) && length(report) >= 5`,
          failMessage: "Create `report <- c(...)` with five or more sentences separated by commas.",
        },
        {
          name: "The report includes the price of an extra square foot (about $135)",
          check: `any(grepl("13[45]", report))`,
          failMessage: "Add a sentence with `round(coefs[[\"size_sqft\"]])` – the price of one extra square foot.",
        },
        {
          name: "The report mentions a neighborhood",
          check: `any(grepl("Downtown|Hillcrest|Riverside|Oakwood|neighborhood", report, ignore.case = TRUE))`,
          failMessage: "Add a sentence about how much the neighborhood matters, e.g. using `coefs[[\"neighborhoodOakwood\"]]`.",
        },
      ],
    },
  ],
  wrapUp: `You have completed a full exploratory data analysis – the same pipeline professional analysts follow every day:

1. **Question:** how much do size and neighborhood explain the sale price?
2. **Import and quality checks:** 200 sales, no duplicates, plausible values, 4 missing build years.
3. **Cleaning:** missing years imputed with the neighborhood median and flagged; factors and price per square foot created.
4. **Univariate:** median price $343,750 with a standard deviation of $81,189; a single-peaked distribution with a slight tail of cheap, small houses.
5. **Relationships:** price rises strongly with size (r = 0.85); Oakwood has the largest but cheapest houses, so location matters on its own.
6. **Visualisation:** four parallel lines at different heights pointed straight to the right model.
7. **Model:** each square foot adds about **$135**; for the same size, Hillcrest, Riverside and Oakwood sell for $22k, $51k and $88k less than Downtown; R² = 0.88.
8. **Checks and predictions:** residuals look patternless; a 2,000 sq ft house is predicted at about $391k Downtown and $303k in Oakwood (±$29k).
9. **Report:** clear sentences with numbers taken straight from the results, plus honest limitations.

**Ideas to go further**

- Add \`garage\`, \`bathrooms\` or \`year_built\` to the model and compare the R-squared and the size coefficient. Does a garage add value once size is known?
- Test whether the size effect really is the same everywhere: fit \`lm(price ~ size_sqft * neighborhood, data = housing)\` (an *interaction*) and compare it with your model using \`anova()\`.
- Check the robustness of the cleaning decision: refit the model on the 196 houses with a known build year (\`housing[!housing$year_imputed, ]\`).
- Turn your analysis into a reusable report with R Markdown or Quarto, so the agency can rerun it when new sales arrive.`,
};
