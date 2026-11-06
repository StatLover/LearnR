import type { Project } from "../types";

export const salesTrendsProject: Project = {
  id: "sales-trends",
  title: "Visualizing Sales Trends",
  level: "intermediate",
  summary:
    "Turn three years of monthly sales from four regions into totals, growth rates, a multi-line ggplot2 chart and a seasonal profile – and spot the region that is falling behind.",
  intro: `You are the new data analyst at a (fictional) camping-gear company that sells tents, sleeping bags and stoves through four regional teams: North, South, East and West. The sales director is preparing next year's plan and sends you a file with the units sold and revenue for every region and every month from January 2022 to December 2024 – 144 rows.

Her questions:

- How much did we sell each month, and in each region?
- Are we growing? Is every region growing?
- What were our best and worst months?
- Is there a seasonal pattern we should plan stock and staff around?

Sales data is a *time series* – measurements taken at regular points in time – so the first job is to make R understand that the \`month\` column contains **dates**, not just text. Then you will use **dplyr** to add things up by month, region and year, and **ggplot2** to draw the line chart every sales meeting needs. Expect a few surprises: totals can hide a region in trouble, and a "best month ever" can be partly growth and partly season.`,
  datasets: ["sales"],
  skills: [
    "Converting text to dates with as.Date()",
    "Extracting the year and month with format()",
    "Totals with dplyr's group_by() and summarise()",
    "Growth rates with mutate() and lag()",
    "Multi-line time-series charts with ggplot2",
    "Finding maxima and minima with which.max() and which.min()",
    "Detecting seasonality",
  ],
  minutes: 60,
  packages: ["dplyr", "ggplot2"],
  steps: [
    {
      id: "import-dates",
      title: "Import the data and convert month to a Date",
      instructions: `Load the packages and the data, and make R understand the dates.

1. Load **dplyr** and **ggplot2**, read \`data/sales.csv\` into \`sales\` and look at it with \`str()\`. What type is the \`month\` column?
2. Convert \`month\` into a real date with \`as.Date()\`. The text is already in the standard year-month-day format (\`"2022-01-01"\`), so no \`format\` argument is needed.
3. Add a numeric column \`year\`: \`format(sales$month, "%Y")\` extracts the year as text, and \`as.numeric()\` turns it into a number.
4. Check the result with \`str()\`, \`range(sales$month)\` and \`table(sales$year)\`.`,
      starterCode: `# Step 1: import the data and convert month to a Date
library(dplyr)
library(ggplot2)

sales <- read.csv("data/sales.csv")
str(sales)

# Convert the month column from text to Date
# sales$month <- ...


# Add a numeric year column
# sales$year <- as.numeric(format(sales$month, "%Y"))


# Check: structure, first and last month, rows per year

`,
      hints: [
        "`as.Date(sales$month)` reads text in the form \"2022-01-01\" directly.",
        "Once `month` is a Date, `format(sales$month, \"%Y\")` gives \"2022\", \"2023\", … – wrap it in `as.numeric()`.",
        "`sales$month <- as.Date(sales$month)`, `sales$year <- as.numeric(format(sales$month, \"%Y\"))`, then `str(sales)`, `range(sales$month)` and `table(sales$year)`.",
      ],
      solution: `library(dplyr)
library(ggplot2)

sales <- read.csv("data/sales.csv")
str(sales)

sales$month <- as.Date(sales$month)
sales$year <- as.numeric(format(sales$month, "%Y"))

str(sales)
range(sales$month)
table(sales$year)
`,
      explanation: `- The first \`str(sales)\` shows **144 obs. of 4 variables**, and \`month\` is \`chr\` – text. As text, R cannot do date arithmetic, and sorting would only work by luck.
- \`as.Date(sales$month)\` converts the text into \`Date\` values. Because the text uses the international year-month-day format, \`as.Date()\` understands it without a \`format\` argument.
- \`format(sales$month, "%Y")\` turns each date back into text, keeping only the year (\`%Y\` = 4-digit year); \`as.numeric()\` makes it a number so you can sort and group by it.
- The second \`str()\` confirms: \`month\` is now \`Date\` and \`year\` is \`num\`.
- \`range(sales$month)\` gives **"2022-01-01" "2024-12-01"**: three full years, with each month represented by its first day.
- \`table(sales$year)\` shows **48 rows per year** – 12 months × 4 regions – so no month is missing.`,
      tests: [
        {
          name: "`sales$month` is a Date column",
          check: `inherits(sales$month, "Date")`,
          failMessage: "Convert the column with `sales$month <- as.Date(sales$month)`.",
        },
        {
          name: "`sales$year` is numeric with the years 2022, 2023 and 2024",
          check: `is.numeric(sales$year) && setequal(sales$year, 2022:2024)`,
          failMessage: "Create `sales$year <- as.numeric(format(sales$month, \"%Y\"))` – after converting `month` to a Date.",
        },
        {
          name: "`sales` still has 144 rows",
          check: `nrow(sales) == 144`,
          failMessage: "`sales` should keep all 144 rows – reread the file if something went wrong.",
        },
      ],
    },
    {
      id: "monthly-totals",
      title: "Total sales per month",
      instructions: `Each month appears four times (once per region). Add the regions together to get the company's total for each month.

1. Create \`monthly\` from \`sales\`: \`group_by(month)\`, then \`summarise()\` the total \`units\` (\`sum(units)\`) and total \`revenue\` (\`sum(revenue)\`). End with \`as.data.frame()\`.
2. Print the number of rows of \`monthly\` and its first 6 rows.`,
      starterCode: `# Step 2: company totals per month

monthly <- sales |>
  group_by(month) |>
  summarise(
    units = sum(units)
    # add the total revenue here
  ) |>
  as.data.frame()

# How many months? What do the first rows look like?

`,
      hints: [
        "Add `revenue = sum(revenue)` inside `summarise()`, after a comma.",
        "`nrow(monthly)` counts the months; `head(monthly)` shows the first 6 rows.",
        "`summarise(units = sum(units), revenue = sum(revenue))`, then `nrow(monthly)` and `head(monthly)`.",
      ],
      solution: `monthly <- sales |>
  group_by(month) |>
  summarise(
    units = sum(units),
    revenue = sum(revenue)
  ) |>
  as.data.frame()

nrow(monthly)
head(monthly)
`,
      explanation: `- \`group_by(month)\` puts the four regional rows of each month into one group. \`summarise()\` then collapses each group into a single row: \`sum(units)\` and \`sum(revenue)\` add up the four regions.
- \`as.data.frame()\` turns dplyr's result (a *tibble*) into a plain data frame, which prints every decimal.
- \`nrow(monthly)\` is **36** – one row per month for three years.
- The first rows show the company's start in 2022: **January 1,254 units and $29,432.96**, then February $33,315.78, March $38,013.71, April $40,211.60, May $47,367.82 and June $45,061.94.

Even these six numbers hint at a pattern: revenue climbs steeply from winter into late spring. Keep that in mind for Step 7.`,
      tests: [
        {
          name: "`monthly` has 36 rows (one per month)",
          check: `nrow(monthly) == 36 && all(c("month", "units", "revenue") %in% names(monthly))`,
          failMessage: "Group by `month` and summarise `units` and `revenue`.",
        },
        {
          name: "January 2022 revenue is 29432.96",
          check: `isTRUE(all.equal(monthly$revenue[monthly$month == as.Date("2022-01-01")], 29432.96))`,
          failMessage: "Use `revenue = sum(revenue)` to add up the four regions.",
        },
        {
          name: "The monthly totals add up to the overall total",
          check: `isTRUE(all.equal(sum(monthly$revenue), sum(sales$revenue))) && sum(monthly$units) == sum(sales$units)`,
          failMessage: "Every sale should be counted once: group by `month` only, and use `sum()`.",
        },
      ],
    },
    {
      id: "region-totals",
      title: "Total sales per region",
      instructions: `Now compare the four regions over the whole three years.

1. Create \`by_region\` from \`sales\`: group by \`region\` and summarise:
   - \`units\` – total units,
   - \`revenue\` – total revenue,
   - \`price_per_unit\` – revenue divided by units (inside \`summarise()\` you can use the columns you just created).
2. Sort it from highest to lowest revenue with \`arrange(desc(revenue))\` and end with \`as.data.frame()\`.
3. Print \`by_region\`, and each region's share of total revenue in percent, rounded to 1 decimal.`,
      starterCode: `# Step 3: totals per region

by_region <- sales |>
  group_by(region) |>
  summarise(
    units = sum(units),
    revenue = sum(revenue)
    # add price_per_unit = revenue / units
  ) |>
  # sort from highest to lowest revenue
  as.data.frame()
by_region

# Share of total revenue per region (%)

`,
      hints: [
        "Inside `summarise()`, `price_per_unit = revenue / units` uses the totals created just before it.",
        "Sorting from high to low: add `arrange(desc(revenue)) |>` before `as.data.frame()`.",
        "Shares: `round(by_region$revenue / sum(by_region$revenue) * 100, 1)`.",
      ],
      solution: `by_region <- sales |>
  group_by(region) |>
  summarise(
    units = sum(units),
    revenue = sum(revenue),
    price_per_unit = revenue / units
  ) |>
  arrange(desc(revenue)) |>
  as.data.frame()
by_region

round(by_region$revenue / sum(by_region$revenue) * 100, 1)
`,
      explanation: `- \`group_by(region)\` + \`summarise()\` gives one row per region. Inside \`summarise()\`, \`price_per_unit = revenue / units\` uses the *totals* just computed, so it is the average price actually paid per unit.
- \`arrange(desc(revenue))\` sorts the rows by revenue, highest first (\`desc\` = descending).
- The result:

| region | units | revenue | price_per_unit |
|---|---|---|---|
| North | 19,311 | 473,708.7 | 24.53 |
| South | 19,319 | 445,650.1 | 23.07 |
| West | 16,481 | 361,711.2 | 21.95 |
| East | 13,116 | 342,037.8 | 26.08 |

- Revenue shares (same order): **29.2%, 27.5%, 22.3%, 21.1%**.

Two things stand out. North and South sold almost exactly the same number of units (19,311 vs 19,319), but North earned about $28,000 more because its customers pay more per unit. And East sells the fewest units but at the **highest price** ($26.08) – perhaps more premium products. Totals alone never tell the full story; ratios such as price per unit add the "why".`,
      tests: [
        {
          name: "`by_region` has 4 rows sorted by revenue (North first)",
          check: `nrow(by_region) == 4 && by_region$region[1] == "North" && !is.unsorted(rev(by_region$revenue))`,
          failMessage: "Group by `region`, summarise, and sort with `arrange(desc(revenue))`.",
        },
        {
          name: "North's total revenue is about 473,708.7",
          check: `isTRUE(all.equal(by_region$revenue[by_region$region == "North"], 473708.7, tolerance = 1e-6))`,
          failMessage: "Use `revenue = sum(revenue)` inside `summarise()`.",
        },
        {
          name: "`price_per_unit` is revenue / units (East ≈ 26.08)",
          check: `"price_per_unit" %in% names(by_region) && isTRUE(all.equal(by_region$price_per_unit[by_region$region == "East"], 26.07791, tolerance = 1e-5))`,
          failMessage: "Add `price_per_unit = revenue / units` inside `summarise()`, after the totals.",
        },
      ],
    },
    {
      id: "yearly-growth",
      title: "Calculate growth per year",
      instructions: `*Growth* compares each year with the year before: growth % = (this year / last year − 1) × 100. dplyr's \`lag()\` gives "the previous value" of a column, which makes this a one-liner.

1. Create \`yearly\`: group \`sales\` by \`year\`, summarise the total \`revenue\`, then add \`growth_pct = (revenue / lag(revenue) - 1) * 100\` with \`mutate()\`. End with \`as.data.frame()\` and print it.
2. Do the same per region and year in \`region_yearly\`: group by \`region\` and \`year\` and summarise revenue (add \`.groups = "drop"\` to \`summarise()\`), then \`group_by(region)\` again before the \`mutate()\` so that \`lag()\` only looks at the same region's previous year. Finish with \`ungroup()\` and \`as.data.frame()\`, and print it.`,
      starterCode: `# Step 4: growth per year

yearly <- sales |>
  group_by(year) |>
  summarise(revenue = sum(revenue)) |>
  mutate(growth_pct = (revenue / lag(revenue) - 1) * 100) |>
  as.data.frame()
yearly

# The same per region: total per region and year, then growth within each region
# region_yearly <- sales |>
#   group_by(region, year) |>
#   summarise(revenue = sum(revenue), .groups = "drop") |>
#   group_by(region) |>
#   ...

`,
      hints: [
        "`yearly` is already complete in the starter code – run it and read the result. Then build `region_yearly` step by step.",
        "After `group_by(region)`, add the same `mutate(growth_pct = (revenue / lag(revenue) - 1) * 100)` as for `yearly`.",
        "Finish `region_yearly` with `ungroup() |> as.data.frame()` and print it.",
      ],
      solution: `yearly <- sales |>
  group_by(year) |>
  summarise(revenue = sum(revenue)) |>
  mutate(growth_pct = (revenue / lag(revenue) - 1) * 100) |>
  as.data.frame()
yearly

region_yearly <- sales |>
  group_by(region, year) |>
  summarise(revenue = sum(revenue), .groups = "drop") |>
  group_by(region) |>
  mutate(growth_pct = (revenue / lag(revenue) - 1) * 100) |>
  ungroup() |>
  as.data.frame()
region_yearly
`,
      explanation: `- In \`yearly\`, \`summarise()\` gives one total per year, and \`lag(revenue)\` shifts the column down by one row, so each year sits next to the previous year's revenue. 2022 has no previous year, so its growth is \`NA\`.
- Company revenue: **2022: $482,892.8 → 2023: $537,241.8 (+11.25%) → 2024: $602,973.3 (+12.24%)**. Healthy, even slightly accelerating growth.
- For \`region_yearly\`, \`group_by(region, year)\` makes one group per region-year combination. \`.groups = "drop"\` removes the grouping after \`summarise()\`; the new \`group_by(region)\` ensures \`lag()\` never compares East 2022 with the end of another region.
- The per-region growth tells a different story from the total:

| region | 2023 | 2024 |
|---|---|---|
| East | +11.7% | +10.1% |
| North | +13.1% | +18.6% |
| South | +25.7% | +18.8% |
| West | **−4.8%** | **−2.0%** |

The company total grows by about 12% a year, but **West is shrinking** – its revenue fell from $125,399.8 in 2022 to $116,933.8 in 2024, while South grew fastest. A single company-wide number would have hidden this completely. This is the kind of finding the sales director needs to hear.`,
      tests: [
        {
          name: "`yearly` has 3 rows with growth_pct (2024 ≈ 12.24%)",
          check: `nrow(yearly) == 3 && is.na(yearly$growth_pct[yearly$year == 2022]) && isTRUE(all.equal(yearly$growth_pct[yearly$year == 2024], 12.235, tolerance = 1e-3))`,
          failMessage: "Compute `growth_pct = (revenue / lag(revenue) - 1) * 100` after summarising revenue per year.",
        },
        {
          name: "`region_yearly` has 12 rows (4 regions × 3 years)",
          check: `nrow(region_yearly) == 12 && all(c("region", "year", "revenue", "growth_pct") %in% names(region_yearly))`,
          failMessage: "Group by `region` and `year`, summarise `revenue`, then add `growth_pct` with `mutate()`.",
        },
        {
          name: "West's 2023 growth is about -4.8%",
          check: `isTRUE(all.equal(region_yearly$growth_pct[region_yearly$region == "West" & region_yearly$year == 2023], -4.802399, tolerance = 1e-4))`,
          failMessage: "Before `mutate()`, use `group_by(region)` so that `lag()` compares each region with its own previous year.",
        },
      ],
    },
    {
      id: "line-chart",
      title: "Draw monthly revenue by region",
      instructions: `A line chart is the natural way to show a time series: time on the x-axis, the value on the y-axis, and one line per group.

Create \`region_plot\` with ggplot2, using the original \`sales\` data (one row per region and month):
1. \`month\` on the x-axis, \`revenue\` on the y-axis, and \`colour = region\` so each region gets its own coloured line.
2. Lines with \`geom_line()\` (\`linewidth = 1\` makes them a bit thicker).
3. A title, axis labels and a legend title with \`labs()\` (\`colour = "Region"\` names the legend).
4. Optionally a cleaner look with \`theme_minimal()\`.

Print the plot.`,
      starterCode: `# Step 5: line chart of monthly revenue per region

region_plot <- ggplot(sales, aes(x = month, y = revenue)) +
  geom_line()
  # 1. add colour = region inside aes()
  # 2. add + labs(title = ..., x = ..., y = ..., colour = ...)

region_plot
`,
      hints: [
        "The colour mapping goes inside `aes()`: `aes(x = month, y = revenue, colour = region)`.",
        "Add the labels with `+ labs(title = \"Monthly revenue by region, 2022-2024\", x = \"Month\", y = \"Revenue ($)\", colour = \"Region\")`.",
        "`region_plot <- ggplot(sales, aes(x = month, y = revenue, colour = region)) + geom_line(linewidth = 1) + labs(...) + theme_minimal()`, then `region_plot`.",
      ],
      solution: `region_plot <- ggplot(sales, aes(x = month, y = revenue, colour = region)) +
  geom_line(linewidth = 1) +
  labs(title = "Monthly revenue by region, 2022-2024",
       x = "Month", y = "Revenue ($)", colour = "Region") +
  theme_minimal()
region_plot
`,
      explanation: `- \`aes(x = month, y = revenue, colour = region)\` maps three columns to three visual properties. Mapping \`colour\` to \`region\` does two jobs: ggplot2 draws a separate line for each region **and** gives each a colour with a legend. Without it, \`geom_line()\` would connect all 144 points into one zig-zag line.
- Because \`month\` is a real \`Date\` (Step 1), the x-axis is a proper time axis with evenly spaced years. With text months it would be a crowded row of 36 labels.
- \`linewidth = 1\` thickens the lines; \`labs()\` sets the title, the axis titles and the legend title; \`theme_minimal()\` removes the grey background.

What the chart shows:

- **A repeating wave every year**: low in winter, high from May to August, with a small bump in November. That is *seasonality* – Step 7 measures it.
- **North and South climb** from year to year: each summer peak is higher than the last.
- **West stays flat or slips**, confirming the negative growth from Step 4. In 2022 West was the second-best region; by 2024 it is the smallest of the four, behind even East.

The chart makes both patterns – season and trend – visible at once, which is exactly why line charts are the standard for time series.`,
      tests: [
        {
          name: "`region_plot` uses lines",
          check: `.has_geom(region_plot, "GeomLine")`,
          failMessage: "Build `region_plot` with `geom_line()`.",
        },
        {
          name: "There is one coloured line per region (4 colours)",
          check: `length(unique(ggplot2::layer_data(region_plot, 1)$colour)) == 4`,
          failMessage: "Add `colour = region` inside `aes()`.",
        },
        {
          name: "The chart has a title",
          check: `!is.null(.gg_label(region_plot, "title"))`,
          failMessage: "Add a title with `labs(title = \"...\")`.",
        },
        {
          name: "The chart is drawn",
          check: `.plots >= 1`,
          failMessage: "Print the plot by writing `region_plot` on its own line.",
        },
      ],
    },
    {
      id: "best-worst-months",
      title: "Find the best and worst months",
      instructions: `Use the company totals in \`monthly\` (Step 2) to find the extremes.

1. Print the 3 best months (\`arrange(desc(revenue))\` then \`head(3)\`) and the 3 worst months (\`arrange(revenue)\` then \`head(3)\`).
2. Store the date of the month with the highest revenue in \`best_month\` and the date of the month with the lowest revenue in \`worst_month\`. \`which.max()\` returns the *position* of the largest value; use it to pick the matching element of \`monthly$month\`.
3. Print how many times larger the best month's revenue is than the worst month's.`,
      starterCode: `# Step 6: best and worst months

# Top 3 and bottom 3 months by revenue
monthly |> arrange(desc(revenue)) |> head(3)


# The single best and worst month (as dates)
best_month <- monthly$month[which.max(monthly$revenue)]
# worst_month <- ...


# How many times larger is the best month than the worst?

`,
      hints: [
        "For the bottom 3, sort in ascending order: `monthly |> arrange(revenue) |> head(3)`.",
        "`which.min()` is the counterpart of `which.max()`: `monthly$month[which.min(monthly$revenue)]`.",
        "`max(monthly$revenue) / min(monthly$revenue)` gives the ratio.",
      ],
      solution: `monthly |> arrange(desc(revenue)) |> head(3)
monthly |> arrange(revenue) |> head(3)

best_month <- monthly$month[which.max(monthly$revenue)]
worst_month <- monthly$month[which.min(monthly$revenue)]
best_month
worst_month

max(monthly$revenue) / min(monthly$revenue)
`,
      explanation: `- \`arrange(desc(revenue)) |> head(3)\` lists the top three months: **June 2024 ($58,015.23), May 2024 ($57,477.01) and July 2024 ($56,036.97)**.
- \`arrange(revenue) |> head(3)\` lists the bottom three: **January 2022 ($29,432.96), February 2022 ($33,315.78) and January 2023 ($34,198.26)**.
- \`which.max(monthly$revenue)\` returns the row number of the largest revenue (30); \`monthly$month[30]\` is the matching date. So \`best_month\` is **2024-06-01** and \`worst_month\` is **2022-01-01**.
- The ratio is **1.97**: the best month brought in almost twice as much as the worst.

But look at *which* months they are. All three best months are summer 2024 – the most recent summer. All three worst months are winter months of the first two years. Two effects are mixed together: **growth** (later years are bigger) and **season** (summer beats winter). A fair question for planning is therefore not "which was our best month ever?" but "which time of year is strongest?" – which is what the next step answers.`,
      tests: [
        {
          name: "`best_month` is June 2024",
          check: `isTRUE(as.Date(best_month) == as.Date("2024-06-01"))`,
          failMessage: "`best_month` should be a single date: `monthly$month[which.max(monthly$revenue)]`.",
        },
        {
          name: "`worst_month` is January 2022",
          check: `isTRUE(as.Date(worst_month) == as.Date("2022-01-01"))`,
          failMessage: "`worst_month` should be a single date: `monthly$month[which.min(monthly$revenue)]`.",
        },
      ],
    },
    {
      id: "seasonality",
      title: "Measure the seasonal pattern",
      instructions: `To see the pure seasonal pattern, average each calendar month over the three years: the average January, the average February, and so on. Every month has exactly one value per year, so growth affects all months equally.

1. Create \`seasonal\` from \`monthly\`:
   - add \`month_num\` (1–12) with \`mutate(month_num = as.numeric(format(month, "%m")))\`,
   - \`group_by(month_num)\` and \`summarise(avg_revenue = mean(revenue))\`,
   - add a readable label: \`mutate(month_name = factor(month.abb[month_num], levels = month.abb))\`. \`month.abb\` is R's built-in vector \`"Jan"\`, \`"Feb"\`, …; making it a *factor* with these levels keeps the months in calendar order instead of alphabetical order.
   - end with \`as.data.frame()\` and print it.
2. Create \`season_plot\`: a bar chart with \`month_name\` on the x-axis and \`avg_revenue\` on the y-axis (\`geom_col()\` draws bars whose height is a value from the data), with a title and labels. Print it.`,
      starterCode: `# Step 7: seasonality

seasonal <- monthly |>
  mutate(month_num = as.numeric(format(month, "%m"))) |>
  group_by(month_num) |>
  summarise(avg_revenue = mean(revenue)) |>
  # add month_name = factor(month.abb[month_num], levels = month.abb)
  as.data.frame()
seasonal

# Bar chart of the average revenue per calendar month
# season_plot <- ggplot(seasonal, aes(x = month_name, y = avg_revenue)) + ...

`,
      hints: [
        "Insert `mutate(month_name = factor(month.abb[month_num], levels = month.abb)) |>` before `as.data.frame()`.",
        "`geom_col()` draws one bar per row with the height given by `y`.",
        "`season_plot <- ggplot(seasonal, aes(x = month_name, y = avg_revenue)) + geom_col(fill = \"darkgreen\") + labs(title = \"Average revenue by calendar month\", x = \"Month\", y = \"Average revenue ($)\")`, then `season_plot`.",
      ],
      solution: `seasonal <- monthly |>
  mutate(month_num = as.numeric(format(month, "%m"))) |>
  group_by(month_num) |>
  summarise(avg_revenue = mean(revenue)) |>
  mutate(month_name = factor(month.abb[month_num], levels = month.abb)) |>
  as.data.frame()
seasonal

season_plot <- ggplot(seasonal, aes(x = month_name, y = avg_revenue)) +
  geom_col(fill = "darkgreen") +
  labs(title = "Average revenue by calendar month (2022-2024)",
       x = "Month", y = "Average revenue ($)")
season_plot
`,
      explanation: `- \`format(month, "%m")\` extracts the month number as text ("01" … "12"), and \`as.numeric()\` makes it 1 … 12.
- \`group_by(month_num)\` puts January 2022, January 2023 and January 2024 together, and \`mean(revenue)\` averages them.
- \`month.abb[month_num]\` looks up the short name of each month number; \`factor(..., levels = month.abb)\` fixes the order Jan → Dec. Without it, ggplot2 would sort the bars alphabetically (Apr, Aug, Dec, …).
- The seasonal profile:

| | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| avg revenue ($) | 34,055 | 37,695 | 42,883 | 45,695 | **51,285** | 51,043 | 50,708 | 49,269 | 43,841 | 40,664 | 47,888 | 46,011 |

- **May is the strongest month** on average and **January the weakest**; the peak is about 1.5 times the low point. Sales climb through spring, stay high from May to August (camping season), drop in September and October, and then jump again in **November** – probably gifts for the holiday season – before easing in December.

For the director's plan: stock up and staff up from April, expect a quiet January and February, and prepare a second, smaller push for November.`,
      tests: [
        {
          name: "`seasonal` has 12 rows with month_num and avg_revenue",
          check: `nrow(seasonal) == 12 && all(c("month_num", "avg_revenue") %in% names(seasonal))`,
          failMessage: "Group `monthly` by `month_num` and summarise `avg_revenue = mean(revenue)`.",
        },
        {
          name: "May has the highest and January the lowest average revenue",
          check: `seasonal$month_num[which.max(seasonal$avg_revenue)] == 5 && seasonal$month_num[which.min(seasonal$avg_revenue)] == 1`,
          failMessage: "Use the monthly company totals (`monthly`) and average them per calendar month with `mean()`.",
        },
        {
          name: "January's average revenue is about 34,055",
          check: `isTRUE(all.equal(seasonal$avg_revenue[seasonal$month_num == 1], 34055.38, tolerance = 1e-5))`,
          failMessage: "`avg_revenue` should be the mean of the three January totals in `monthly`.",
        },
        {
          name: "`season_plot` is a bar (or line) chart and is drawn",
          check: `(.has_geom(season_plot, "GeomCol") || .has_geom(season_plot, "GeomBar") || .has_geom(season_plot, "GeomLine")) && .plots >= 1`,
          failMessage: "Build `season_plot` with `geom_col()` and print it by writing `season_plot` on its own line.",
        },
      ],
    },
  ],
  wrapUp: `You turned 144 rows of raw sales into a clear story for next year's plan:

- The company grew about **11–12% a year**, from $482,893 in 2022 to $602,973 in 2024.
- **North** earns the most (29.2% of revenue) and **South** grows fastest – but **West is shrinking** (−4.8% in 2023, −2.0% in 2024), something the company total completely hides.
- Sales follow a strong **season**: the average May is about 1.5 times the average January, with a second bump in November.
- The "best month ever" (June 2024) was the product of both growth and season – separating the two is what makes the analysis useful.

Technically you practised the core time-series toolkit: \`as.Date()\` and \`format()\` for dates, \`group_by()\` + \`summarise()\` for totals at different levels, \`lag()\` for growth, and ggplot2 line and bar charts.

**Ideas to go further**

- Split the line chart into one small panel per region with \`facet_wrap(~ region)\` – which version shows the West problem more clearly?
- Compare *units* and *revenue* growth per region: is West selling fewer items, or the same items at lower prices?
- Compute each month's growth compared with the **same month last year** (\`lag(revenue, 12)\` on the monthly data) – a fairer comparison that removes seasonality.
- Draw the seasonal profile as one line per year (\`colour = factor(year)\`) to see whether the pattern is stable.`,
};
