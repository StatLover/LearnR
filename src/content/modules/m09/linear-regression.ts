import type { Lesson } from "../../types";

export const linearRegressionLesson: Lesson = {
  id: "linear-regression",
  module: 9,
  title: "Linear Regression and Interpreting Model Output",
  summary: "Fit straight-line models with lm(), read every line of summary(), use residuals and R-squared, and make predictions with predict().",
  minutes: 50,
  objectives: [
    "Explain what a regression line, its intercept and its slope mean",
    "Fit a linear regression with lm() and interpret its coefficients in real units",
    "Read the full summary() of a model line by line: residuals, coefficients, standard errors, p-values, R-squared and the F-statistic",
    "Compute and inspect fitted values and residuals",
    "Make predictions with predict() – and know when not to trust them",
  ],
  intro: `Correlation (Module 7) told you that bigger houses tend to cost more: r = 0.85. **Linear regression** goes further: it draws the **best straight line** through the cloud of points, so you can say *how much* more a house costs for each extra square foot, and **predict** the price of a house you have not seen.

A regression model has the form **outcome = intercept + slope × predictor + error**. The intercept and slope are called **coefficients**; R estimates them from the data with \`lm()\` ("linear model"). The error part – how far each real point is from the line – is called the **residual**, and studying it tells you how good the model is.

In this lesson you will fit models, read R's model output line by line, and learn to explain a model honestly: what it says, how sure we are, and where it stops being trustworthy.`,
  sections: [
    {
      id: "regression-idea",
      title: "The idea: the best straight line",
      blocks: [
        {
          kind: "text",
          md: `Back to five students and their study hours: (1 h, 52 points), (2, 60), (3, 61), (4, 70), (5, 75). A straight line through these points can be written as

> **predicted score = intercept + slope × hours**

* The **intercept** is where the line crosses the y-axis: the predicted score for 0 hours.
* The **slope** is how much the prediction changes when hours go up by **one**.

Which line is "best"? For every point, the vertical distance between the point and the line is its **residual** (observed − predicted). \`lm()\` chooses the line that makes the **sum of the squared residuals** as small as possible – the *least squares* line. (Squaring, as with the variance, stops positive and negative misses from cancelling out.)`,
        },
        {
          kind: "diagram",
          name: "regression-line",
          caption: "A regression line through the data. The vertical gaps between the points and the line are the residuals; least squares makes their squared total as small as possible.",
        },
        {
          kind: "code",
          example: {
            id: "lm-small",
            title: "A first regression by hand and with lm()",
            code: `hours <- c(1, 2, 3, 4, 5)
score <- c(52, 60, 61, 70, 75)

fit <- lm(score ~ hours)
coef(fit)
46.8 + 5.6 * 3
fitted(fit)
residuals(fit)`,
            explanation: [
              { code: "fit <- lm(score ~ hours)", text: "Fit a linear model. The formula `score ~ hours` reads \"score explained by hours\": the **outcome** goes on the left of `~`, the **predictor** on the right." },
              { code: "coef(fit)", text: "The two estimated coefficients: intercept and slope." },
              { code: "46.8 + 5.6 * 3", text: "Using the line by hand: the predicted score for 3 hours of study." },
              { code: "fitted(fit)", text: "The predicted (fitted) value for each of the five students." },
              { code: "residuals(fit)", text: "Observed minus fitted, for each student." },
            ],
            output: `(Intercept)       hours
       46.8         5.6
[1] 63.6
   1    2    3    4    5
52.4 58.0 63.6 69.2 74.8
   1    2    3    4    5
-0.4  2.0 -2.6  0.8  0.2`,
            outputNote: "The best line is **score = 46.8 + 5.6 × hours**: every extra hour of study goes with **5.6 more points** on average. Student 3 studied 3 hours: the line predicts 63.6, but the student scored 61, so the residual is 61 − 63.6 = **−2.6** (the point lies below the line). Student 2 is 2 points above the line.",
            tryIt: "Change the last score from 75 to 90 and refit. How do the slope and the residuals change?",
          },
        },
        {
          kind: "code",
          example: {
            id: "lm-small-plot",
            title: "Drawing the line",
            code: `hours <- c(1, 2, 3, 4, 5)
score <- c(52, 60, 61, 70, 75)
fit <- lm(score ~ hours)

plot(hours, score, pch = 19)
abline(fit, col = "red")`,
            explanation: [
              { code: "plot(hours, score, pch = 19)", text: "A scatter plot; `pch = 19` draws filled dots." },
              { code: "abline(fit, col = \"red\")", text: "`abline()` adds the fitted regression line to the plot." },
            ],
            plot: true,
          },
        },
      ],
    },
    {
      id: "fitting-lm",
      title: "Fitting a model to real data",
      blocks: [
        {
          kind: "text",
          md: `Now a real question: **how does a house's size relate to its sale price?** With a data frame, give the column names in the formula and the data frame in \`data =\`.`,
        },
        {
          kind: "code",
          example: {
            id: "lm-housing",
            title: "price ~ size_sqft",
            code: `housing <- read.csv("data/housing.csv")

model <- lm(price ~ size_sqft, data = housing)
model
coef(model)`,
            explanation: [
              { code: "model <- lm(price ~ size_sqft, data = housing)", text: "Price (outcome) explained by living area in square feet (predictor), using the housing data." },
              { code: "model", text: "Printing a model shows the call and the rounded coefficients." },
              { code: "coef(model)", text: "The coefficients with more digits, as a named vector." },
            ],
            output: `
Call:
lm(formula = price ~ size_sqft, data = housing)

Coefficients:
(Intercept)    size_sqft
    88492.1        131.7

(Intercept)   size_sqft
  88492.130     131.668`,
            outputNote: `The fitted line is **price = 88,492 + 131.67 × size_sqft**.

* **Slope (131.67):** each extra square foot goes with a sale price about **$132 higher** on average – so 100 extra square feet go with about $13,200 more.
* **Intercept (88,492):** the predicted price of a house with **0** square feet. That is not a real house, so the intercept here is just the starting height of the line, not something to interpret.`,
          },
        },
        {
          kind: "code",
          example: {
            id: "lm-housing-plot",
            title: "The model on the scatter plot",
            code: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)

plot(housing$size_sqft, housing$price,
     xlab = "Size (square feet)", ylab = "Price ($)")
abline(model, col = "red", lwd = 2)`,
            explanation: [
              { code: "plot(housing$size_sqft, housing$price,", text: "One point per house." },
              { code: "abline(model, col = \"red\", lwd = 2)", text: "The regression line, drawn thicker with `lwd = 2`." },
            ],
            plot: true,
            tryIt: "Fit `lm(price ~ year_built, data = housing)`. Is the slope positive or negative? Do newer houses cost more?",
          },
        },
      ],
    },
    {
      id: "summary-lm",
      title: "Reading summary(model) line by line",
      blocks: [
        {
          kind: "text",
          md: `\`summary()\` gives the full report of a model: how big the residuals are, how precise each coefficient is, whether it is significantly different from zero, and how much of the variation the model explains. It looks intimidating at first, so we will read it piece by piece.`,
        },
        {
          kind: "code",
          example: {
            id: "summary-lm",
            title: "The full model summary",
            code: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)

summary(model)`,
            explanation: [
              { code: "summary(model)", text: "The detailed report of the fitted model." },
            ],
            output: `
Call:
lm(formula = price ~ size_sqft, data = housing)

Residuals:
    Min      1Q  Median      3Q     Max
-111696  -29258      13   33326  135872

Coefficients:
             Estimate Std. Error t value Pr(>|t|)
(Intercept) 88492.130  11372.646   7.781 3.89e-13 ***
size_sqft     131.668      5.815  22.644  < 2e-16 ***
---
Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1

Residual standard error: 42960 on 198 degrees of freedom
Multiple R-squared:  0.7214,\tAdjusted R-squared:   0.72
F-statistic: 512.8 on 1 and 198 DF,  p-value: < 2.2e-16`,
            outputNote: "Every part is explained in the table below. The short version: *each extra square foot goes with about $132 more (SE $5.8, p < 0.001), size explains 72% of the variation in prices, and typical predictions miss by about $43,000.*",
          },
        },
        {
          kind: "table",
          caption: "What each part of summary(model) means",
          headers: ["Part of the output", "What it means for the housing model"],
          rows: [
            ["**Call**", "The model you fitted: price explained by size_sqft."],
            ["**Residuals** Min / 1Q / Median / 3Q / Max", "A five-number summary of the residuals. The median is near 0 and the quartiles are roughly symmetric (−29,258 and 33,326), which is what a good model looks like. The worst misses are −$111,696 and +$135,872."],
            ["**Estimate**", "The coefficients: intercept 88,492 and slope 131.67 dollars per square foot."],
            ["**Std. Error**", "The standard error of each estimate – its uncertainty. The slope is 131.67 ± about 5.8, so a 95% CI is roughly 131.67 ± 2 × 5.8 ≈ 120 to 143 (`confint(model)` gives it exactly)."],
            ["**t value**", "Estimate ÷ Std. Error: 131.668 / 5.815 = 22.6 standard errors away from 0."],
            ["**Pr(>\\|t\\|)**", "The p-value for H₀: *this coefficient is 0* (\"size has no linear relationship with price\"). `< 2e-16` means smaller than 0.0000000000000002 – overwhelming evidence that the slope is not 0."],
            ["**Stars / Signif. codes**", "A quick visual of the p-value: `***` means below 0.001. The legend line explains the symbols."],
            ["**Residual standard error: 42960 on 198 degrees of freedom**", "The typical size of a residual: predictions are usually off by about $43,000. df = 200 houses − 2 coefficients."],
            ["**Multiple R-squared: 0.7214**", "72% of the variation in prices is explained by size. The rest comes from everything the model does not include (neighbourhood, condition, luck …)."],
            ["**Adjusted R-squared: 0.72**", "R-squared with a small penalty for every extra predictor; useful when comparing models with different numbers of predictors."],
            ["**F-statistic: 512.8 on 1 and 198 DF, p-value: < 2.2e-16**", "A test of H₀: *all slopes are 0* (the model is no better than predicting the mean price for every house). With one predictor it gives the same verdict as the slope's t-test."],
          ],
        },
        {
          kind: "question",
          question: {
            id: "m9-reg-q1",
            type: "multiple-choice",
            prompt: "In the housing model, the slope for size_sqft has a p-value below 2e-16. What does this tell you?",
            options: [
              "If size had no linear relationship with price, a slope this far from 0 would be almost impossible – strong evidence the true slope is not 0",
              "Size explains almost 100% of the variation in price",
              "The slope is very large",
              "Bigger houses cause higher prices",
            ],
            answer: 0,
            explanation: "The coefficient's p-value tests H₀: slope = 0. A tiny p-value is strong evidence against that. It says nothing about how much variation is explained (that is R-squared), how large the slope is (that is the estimate) or about causation.",
            optionFeedback: [
              "Correct.",
              "That is what R-squared measures – here 72%, not 100%.",
              "The size of the slope is in the Estimate column. A p-value can be tiny for a small slope if there is lots of data.",
              "Regression on observational data shows association, not causation (though here a causal story is plausible, the model alone cannot prove it).",
            ],
            concept: "interpreting-models",
          },
        },
      ],
    },
    {
      id: "residuals-and-r-squared",
      title: "Residuals and R-squared",
      blocks: [
        {
          kind: "definition",
          term: "Residual",
          md: "**observed value − predicted value.** A positive residual means the real value is above the line (the house sold for more than the model predicted); a negative residual means it is below. Residuals always add up to (almost exactly) zero for a model with an intercept.",
        },
        {
          kind: "code",
          example: {
            id: "fitted-residuals",
            title: "fitted() and residuals()",
            code: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)

head(housing$price)
head(fitted(model))
head(residuals(model))`,
            explanation: [
              { code: "head(housing$price)", text: "The real prices of the first six houses." },
              { code: "head(fitted(model))", text: "What the model predicts for those houses from their size." },
              { code: "head(residuals(model))", text: "Real minus predicted." },
            ],
            output: `[1] 298000 241000 461000 483000 321000 324500
       1        2        3        4        5        6
321544.5 318911.2 445312.4 428195.6 259660.5 336028.0
        1         2         3         4         5         6
-23544.51 -77911.15  15687.56  54804.40  61339.45 -11527.99`,
            outputNote: "House 1 sold for $298,000; for its size the model expected $321,545, so its residual is 298,000 − 321,545 = **−$23,545** – it sold for less than similar-sized houses. House 5 sold for **$61,339 more** than expected.",
          },
        },
        {
          kind: "code",
          example: {
            id: "residual-plot",
            title: "A residual plot",
            code: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)

plot(fitted(model), residuals(model),
     xlab = "Fitted price", ylab = "Residual")
abline(h = 0, col = "red")`,
            explanation: [
              { code: "plot(fitted(model), residuals(model),", text: "Each house: predicted price on the x-axis, residual on the y-axis." },
              { code: "abline(h = 0, col = \"red\")", text: "A horizontal line at 0 (`h` = horizontal): points on it were predicted perfectly." },
            ],
            plot: true,
            outputNote: "What you hope to see: a shapeless cloud evenly spread around 0. A curve would mean the relationship is not a straight line; a funnel (spread growing with the fitted value) would mean predictions are less reliable for some houses. Checking this plot is a standard part of every regression.",
          },
        },
        {
          kind: "text",
          md: `### R-squared: how much variation is explained?

Prices vary a lot from house to house. Some of that variation can be explained by size; the rest is left in the residuals. **R-squared** is the share that is explained:

> R² = 1 − (variation left in the residuals) / (total variation in the outcome)

It runs from 0 (the model explains nothing) to 1 (every point is on the line). For a model with a single predictor, R² is exactly the square of the correlation coefficient.`,
        },
        {
          kind: "code",
          example: {
            id: "r-squared",
            title: "R-squared and correlation",
            code: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)

summary(model)$r.squared
cor(housing$size_sqft, housing$price)^2
summary(model)$sigma`,
            explanation: [
              { code: "summary(model)$r.squared", text: "Like test results, a model summary is a list – `$r.squared` extracts R²." },
              { code: "cor(housing$size_sqft, housing$price)^2", text: "The squared correlation from Module 7 (0.849²)." },
              { code: "summary(model)$sigma", text: "The residual standard error (the typical size of a residual)." },
            ],
            output: `[1] 0.721425
[1] 0.721425
[1] 42959.79`,
            outputNote: "Identical: **72.1%** of the variation in house prices is explained by size. A high R² does not mean the model is perfect – typical predictions are still off by about $43,000 – and a low R² does not mean a slope is unimportant. In fields like medicine or psychology, an R² of 0.2 can be valuable.",
          },
        },
      ],
    },
    {
      id: "predict",
      title: "Making predictions with predict()",
      blocks: [
        {
          kind: "text",
          md: `\`predict(model, newdata = …)\` applies the fitted line to new cases. \`newdata\` must be a **data frame with a column of the same name** as the predictor in the model (\`size_sqft\`).`,
        },
        {
          kind: "code",
          example: {
            id: "predict-prices",
            title: "Predicting prices for new houses",
            code: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)

new_houses <- data.frame(size_sqft = c(1500, 2000, 2500))
predict(model, newdata = new_houses)`,
            explanation: [
              { code: "new_houses <- data.frame(size_sqft = c(1500, 2000, 2500))", text: "Three new houses, described with exactly the column name the model knows." },
              { code: "predict(model, newdata = new_houses)", text: "Predicted price for each row: 88,492 + 131.67 × size." },
            ],
            output: `       1        2        3
285994.1 351828.2 417662.2`,
            outputNote: "A 2,000 sq ft house is predicted to sell for about **$351,800**. Check by hand: 88,492 + 131.668 × 2,000 = 351,828. Each extra 500 sq ft adds 500 × 131.67 ≈ $65,800.",
          },
        },
        {
          kind: "code",
          example: {
            id: "predict-intervals",
            title: "How sure is a prediction?",
            code: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)
house <- data.frame(size_sqft = 2000)

predict(model, newdata = house, interval = "confidence")
predict(model, newdata = house, interval = "prediction")`,
            explanation: [
              { code: `interval = "confidence"`, text: "A 95% CI for the **average** price of all 2,000 sq ft houses." },
              { code: `interval = "prediction"`, text: "A 95% interval for the price of **one particular** 2,000 sq ft house." },
            ],
            output: `       fit      lwr      upr
1 351828.2 345693.8 357962.5
       fit      lwr      upr
1 351828.2 266888.9 436767.4`,
            outputNote: "`fit` is the prediction, `lwr` and `upr` the interval. The **average** price of 2,000 sq ft houses is pinned down well ($345,700 to $358,000), but **a single** such house could plausibly sell for anything from about $267,000 to $437,000 – individual houses vary much more than averages. Quote the prediction interval when someone asks \"what will *my* house sell for?\".",
          },
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Do not extrapolate",
          md: "The houses in the data range from 630 to 2,850 sq ft. Inside that range the line describes the data well. Outside it, nobody knows whether the straight line still holds: `predict()` will happily claim that a 10,000 sq ft house costs $1,405,172, but the data contains no evidence about such houses. Only trust predictions within (or very near) the range of the data you fitted.",
        },
      ],
    },
    {
      id: "multiple-regression",
      title: "More than one predictor",
      blocks: [
        {
          kind: "text",
          md: `Prices depend on more than size: location matters too. Add predictors with \`+\`. For a **categorical** predictor such as \`neighborhood\`, R picks one category as the **baseline** (the first in alphabetical order, here Downtown) and estimates how much each other category differs from it.`,
        },
        {
          kind: "code",
          example: {
            id: "multiple-regression",
            title: "price ~ size_sqft + neighborhood",
            code: `housing <- read.csv("data/housing.csv")

model2 <- lm(price ~ size_sqft + neighborhood, data = housing)
summary(model2)`,
            explanation: [
              { code: "lm(price ~ size_sqft + neighborhood, data = housing)", text: "Price explained by size **and** neighbourhood together." },
            ],
            output: `
Call:
lm(formula = price ~ size_sqft + neighborhood, data = housing)

Residuals:
   Min     1Q Median     3Q    Max
-79766 -19611      2  18610  97359

Coefficients:
                        Estimate Std. Error t value Pr(>|t|)
(Intercept)           121287.959   8427.225  14.392  < 2e-16 ***
size_sqft                134.809      3.919  34.396  < 2e-16 ***
neighborhoodHillcrest -22231.571   5632.437  -3.947  0.00011 ***
neighborhoodOakwood   -87874.834   6037.257 -14.555  < 2e-16 ***
neighborhoodRiverside -51146.769   5934.504  -8.619 2.31e-15 ***
---
Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1

Residual standard error: 28920 on 195 degrees of freedom
Multiple R-squared:  0.8757,\tAdjusted R-squared:  0.8732
F-statistic: 343.5 on 4 and 195 DF,  p-value: < 2.2e-16`,
            outputNote: `How to read the coefficients in a model with several predictors:

* **size_sqft 134.8** – *for houses in the same neighbourhood*, each extra square foot goes with about $135 more.
* **neighborhoodOakwood −87,875** – *for houses of the same size*, an Oakwood house sells for about $87,900 **less than a Downtown house** (Downtown is the baseline, so it has no row of its own). Hillcrest is about $22,200 and Riverside about $51,100 cheaper than Downtown.
* All p-values are tiny, so every difference is statistically significant.
* **R-squared rose from 0.72 to 0.876**, and the residual standard error fell from $42,960 to $28,920: knowing the neighbourhood makes predictions much better.

The phrase "holding the other predictors constant" is the key to multiple regression: each coefficient is the difference associated with its own predictor *when the other predictors are the same*.`,
            tryIt: "Add `bedrooms` to the model: `lm(price ~ size_sqft + neighborhood + bedrooms, data = housing)`. Is the bedrooms coefficient significant once size is already in the model?",
          },
        },
      ],
    },
    {
      id: "interpreting-models",
      title: "Interpreting model output responsibly",
      blocks: [
        {
          kind: "steps",
          title: "A checklist for explaining a regression model",
          items: [
            "**State the model**: which outcome, which predictors, how many observations.",
            "**Interpret each slope in real units**, with \"on average\" and – for several predictors – \"holding the others constant\".",
            "**Give the uncertainty**: the standard error or a confidence interval (`confint(model)`), and the p-value of the coefficients you discuss.",
            "**Say how well the model fits**: R-squared and the residual standard error (the typical size of a prediction error).",
            "**Check the residual plot** for curves, funnels or extreme outliers.",
            "**Stay inside the data**: no predictions far outside the observed range.",
            "**Association, not causation** – unless the data comes from a randomised experiment.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Example write-up",
          md: "*\"We modelled the sale price of 200 houses with a linear regression on living area. Each additional square foot was associated with a price about $132 higher on average (95% CI roughly $120 to $143, p < 0.001). Size alone explained 72% of the variation in price, and typical predictions were off by about $43,000. Adding the neighbourhood raised R² to 0.88. The model is based on houses between 630 and 2,850 sq ft and should not be used outside that range.\"*",
        },
      ],
    },
  ],
  mistakes: [
    {
      title: "Forgetting data = in lm()",
      wrong: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft)`,
      error: "object 'price' not found",
      why: "The formula only names columns. Without `data = housing`, R looks for variables called `price` and `size_sqft` in your workspace and cannot find them.",
      right: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)`,
    },
    {
      title: "Using the wrong column name in predict()",
      wrong: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)
predict(model, newdata = data.frame(size = 2000))`,
      error: "object 'size_sqft' not found",
      why: "`newdata` must contain a column with exactly the predictor's name from the formula (`size_sqft`), not just any name.",
      right: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)
predict(model, newdata = data.frame(size_sqft = 2000))`,
    },
    {
      title: "Swapping outcome and predictor",
      wrong: `housing <- read.csv("data/housing.csv")
lm(size_sqft ~ price, data = housing)`,
      why: "The code runs, but it models **size explained by price** – a different line with a different slope (square feet per dollar). Always put the outcome you want to predict on the left of `~`.",
      right: `housing <- read.csv("data/housing.csv")
lm(price ~ size_sqft, data = housing)`,
    },
    {
      title: "Predicting far outside the data",
      wrong: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)
predict(model, newdata = data.frame(size_sqft = 10000))`,
      why: "R returns a number (about $1.4 million) without complaint, but the data only contains houses up to 2,850 sq ft. There is no evidence that the straight line continues that far.",
      right: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)
range(housing$size_sqft)
predict(model, newdata = data.frame(size_sqft = 2500))`,
    },
  ],
  exerciseIds: ["m9-house-price-model"],
  quiz: [
    {
      id: "m9-reg-q2",
      type: "multiple-choice",
      prompt: "A model of exam score on study hours has the slope 1.59. What does it mean?",
      options: [
        "Each extra hour of study per week goes with about 1.59 more points on average",
        "Students study 1.59 hours on average",
        "1.59% of the variation in scores is explained",
        "Studying one more hour will raise any student's score by exactly 1.59 points",
      ],
      answer: 0,
      explanation: "The slope is the change in the predicted outcome for a one-unit increase in the predictor – an average association, not a guarantee for each individual.",
      optionFeedback: [
        "Correct.",
        "The slope is not a mean of the predictor.",
        "That would be R-squared, which is reported separately.",
        "Regression describes an average relationship; individual students vary around the line (and the model alone does not prove cause and effect).",
      ],
      concept: "linear-regression",
    },
    {
      id: "m9-reg-q3",
      type: "predict-output",
      prompt: "What does this code print? (The points lie exactly on a line.)",
      code: `x <- c(1, 2, 3, 4, 5)
y <- c(3, 5, 7, 9, 11)
coef(lm(y ~ x))`,
      options: [
        `(Intercept)           x
          1           2`,
        `(Intercept)           x
          2           1`,
        `(Intercept)           x
          3           2`,
        `[1] 1 2`,
      ],
      answer: 0,
      explanation: "y goes up by 2 whenever x goes up by 1, so the slope is 2. At x = 0 the line would be at 3 − 2 = 1, so the intercept is 1: y = 1 + 2x.",
      optionFeedback: [
        "Correct.",
        "The intercept and slope are swapped: y rises by 2 per unit of x.",
        "3 is the value of y at x = 1, not at x = 0.",
        "`coef()` returns a **named** vector, so the names are printed above the values.",
      ],
      concept: "linear-regression",
    },
    {
      id: "m9-reg-q4",
      type: "fill-blank",
      prompt: "Complete the code to predict the price of an 1,800 sq ft house.",
      code: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)
predict(model, newdata = ___(size_sqft = 1800))`,
      accept: ["data.frame"],
      hint: "`newdata` must be a table whose column is named like the predictor.",
      explanation: "`newdata` must be a data frame with a `size_sqft` column: `data.frame(size_sqft = 1800)`. The prediction is about $325,500.",
      concept: "linear-regression",
    },
    {
      id: "m9-reg-q5",
      type: "multiple-choice",
      prompt: "A model has Multiple R-squared: 0.35. What does this mean?",
      options: [
        "The predictors explain 35% of the variation in the outcome",
        "35% of the predictions are correct",
        "The slope is 0.35",
        "The model is useless because R-squared is below 0.5",
      ],
      answer: 0,
      explanation: "R-squared is the share of the outcome's variation explained by the model. 0.35 means 35% is explained and 65% remains in the residuals. Whether that is useful depends on the field and the question.",
      optionFeedback: [
        "Correct.",
        "Predictions are rarely exactly right; R-squared is about explained variation, not hit rate.",
        "The slope is in the Estimate column.",
        "There is no universal cut-off – in many fields an R² of 0.35 is informative.",
      ],
      concept: "interpreting-models",
    },
    {
      id: "m9-reg-q6",
      type: "true-false",
      prompt: "A residual is the observed value minus the value predicted by the model.",
      answer: true,
      explanation: "True. A positive residual means the point lies above the regression line; a negative one means it lies below. `residuals(model)` returns them all.",
      concept: "linear-regression",
    },
    {
      id: "m9-reg-q7",
      type: "find-error",
      prompt: "This code should fit a model of price on size. Click the line that fails.",
      code: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft)
summary(model)`,
      errorLine: 2,
      errorKind: "error",
      fix: `housing <- read.csv("data/housing.csv")
model <- lm(price ~ size_sqft, data = housing)
summary(model)`,
      explanation: "Without `data = housing`, `lm()` cannot find the columns `price` and `size_sqft` (\"object 'price' not found\").",
      concept: "linear-regression",
    },
  ],
  keyPoints: [
    "Linear regression fits the straight line outcome = intercept + slope × predictor that minimises the sum of squared residuals.",
    "Fit it with `lm(outcome ~ predictor, data = df)`; `coef()` gives the intercept and slope.",
    "The slope is the average change in the outcome for a one-unit increase in the predictor; interpret the intercept only if a predictor value of 0 makes sense.",
    "`summary(model)` shows residuals, estimates with standard errors, t values and p-values (H₀: coefficient = 0), the residual standard error, R-squared and the F-test.",
    "Residuals are observed − fitted values; a residual plot should look like a shapeless cloud around 0.",
    "R-squared is the share of variation explained; with one predictor it equals the squared correlation.",
    "`predict(model, newdata = data.frame(...))` makes predictions; use prediction intervals for single cases and never extrapolate far outside the data.",
  ],
  concepts: ["linear-regression", "interpreting-models"],
  glossary: ["linear-regression", "coefficient", "residual", "r-squared", "standard-error", "p-value", "scatter-plot", "correlation", "degrees-of-freedom"],
  playground: `# Linear regression – experiment here!
housing <- read.csv("data/housing.csv")

model <- lm(price ~ size_sqft, data = housing)
summary(model)
predict(model, newdata = data.frame(size_sqft = 1800))
`,
  prerequisites: ["t-tests-chi-square-anova"],
  datasets: ["housing"],
};
