import type { TopicKind } from "@/lib/game/worlds";

/** One-click example programs for the playground. All of them are plain, runnable R. */
export interface Starter {
  id: string;
  title: string;
  description: string;
  art: TopicKind;
  color: string;
  code: string;
}

export const starters: Starter[] = [
  {
    id: "summarise",
    title: "Summarise a dataset",
    description: "str(), summary() and a group average",
    art: "table",
    color: "sky",
    code: `# Summarise a dataset
students <- read.csv("data/students.csv")

str(students)       # the columns and their types
summary(students)   # min, quartiles, mean and max of each column

# Average math score in each class
aggregate(math ~ class, data = students, FUN = mean)
`,
  },
  {
    id: "ggplot",
    title: "Make a ggplot",
    description: "A colourful scatter plot with ggplot2",
    art: "scatter",
    color: "pink",
    code: `# Make a ggplot
library(ggplot2)

ggplot(iris, aes(x = Petal.Length, y = Petal.Width, colour = Species)) +
  geom_point(size = 3, alpha = 0.8) +
  labs(title = "Iris petals",
       x = "Petal length (cm)",
       y = "Petal width (cm)") +
  theme_minimal()
`,
  },
  {
    id: "function",
    title: "Write a function",
    description: "Your own reusable bmi() function",
    art: "function",
    color: "grape",
    code: `# Write a function
bmi <- function(weight_kg, height_m) {
  value <- weight_kg / height_m^2
  round(value, 1)
}

bmi(70, 1.75)

# Functions work on whole vectors, too
bmi(weight_kg = c(55, 80, 95), height_m = c(1.60, 1.80, 1.75))
`,
  },
  {
    id: "dice",
    title: "Simulate dice",
    description: "600 random rolls and a bar chart",
    art: "bar",
    color: "tangerine",
    code: `# Simulate dice
set.seed(2024)
rolls <- sample(1:6, size = 600, replace = TRUE)

table(rolls)   # how often each face came up
mean(rolls)    # a fair die averages 3.5

barplot(table(rolls), col = "orange", border = "white",
        main = "600 rolls of a fair die", xlab = "Face", ylab = "Count")
`,
  },
  {
    id: "dplyr",
    title: "Transform with dplyr",
    description: "filter, group_by and summarise",
    art: "pipe",
    color: "teal",
    code: `# Transform data with dplyr
library(dplyr)
students <- read.csv("data/students.csv")

students |>
  filter(!is.na(science)) |>
  group_by(class) |>
  summarise(students = n(),
            avg_math = mean(math),
            avg_science = mean(science)) |>
  arrange(desc(avg_math))
`,
  },
  {
    id: "regression",
    title: "Fit a regression",
    description: "lm() on mtcars with a fitted line",
    art: "regression",
    color: "mint",
    code: `# Fit a linear regression
model <- lm(mpg ~ wt, data = mtcars)
summary(model)

plot(mtcars$wt, mtcars$mpg, pch = 19, col = "steelblue",
     xlab = "Weight (1000 lbs)", ylab = "Miles per gallon",
     main = "Heavier cars drive fewer miles per gallon")
abline(model, col = "tomato", lwd = 3)
`,
  },
];
