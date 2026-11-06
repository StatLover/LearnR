import type { Completion } from "@codemirror/autocomplete";

/** Functions beginners use most, offered by the editor's autocomplete. */
const FUNCTIONS = `print cat paste paste0 sprintf format c seq seq_along seq_len rep length rev sort order unique which which.max which.min
any all sum mean median max min range round signif ceiling floor sqrt abs exp log log10 cumsum prod class typeof str head tail summary
nrow ncol dim names colnames rownames is.na is.null is.numeric is.character as.numeric as.character as.integer as.logical as.factor
factor levels nlevels table prop.table list matrix array data.frame rbind cbind subset merge apply sapply lapply vapply tapply mapply
aggregate ifelse switch nchar toupper tolower trimws substr substring strsplit gsub sub grepl regmatches gregexpr sprintf
as.Date Sys.Date Sys.time format difftime months weekdays seq.Date read.csv write.csv readLines file.exists list.files
sd var quantile IQR cor scale t.test chisq.test aov TukeyHSD lm glm predict residuals coef confint anova shapiro.test wilcox.test
dnorm pnorm qnorm rnorm dbinom pbinom rbinom runif sample set.seed plot hist barplot boxplot lines points abline legend par pie
library require install.packages help stopifnot stop warning message tryCatch invisible return function exists rm ls
complete.cases na.omit duplicated is.element setdiff union intersect cut findInterval
filter select mutate arrange desc summarise summarize group_by ungroup n count rename distinct left_join inner_join case_when if_else across
pivot_longer pivot_wider drop_na replace_na separate unite
ggplot aes geom_point geom_line geom_bar geom_col geom_histogram geom_boxplot geom_smooth geom_density facet_wrap labs theme_minimal theme_bw theme_classic theme scale_fill_manual scale_colour_manual coord_flip`
  .split(/\s+/)
  .filter(Boolean);

const KEYWORDS = ["if", "else", "for", "while", "repeat", "function", "return", "next", "break", "in", "TRUE", "FALSE", "NULL", "NA", "Inf", "NaN"];

const SNIPPETS: Completion[] = [
  { label: "fun", type: "text", detail: "function template", apply: "my_function <- function(x) {\n  \n}" },
  { label: "iff", type: "text", detail: "if / else template", apply: "if (condition) {\n  \n} else {\n  \n}" },
  { label: "forl", type: "text", detail: "for loop template", apply: "for (i in 1:10) {\n  \n}" },
];

export const R_COMPLETIONS: Completion[] = [
  ...[...new Set(FUNCTIONS)].map((f) => ({ label: f, type: "function", apply: f })),
  ...KEYWORDS.map((k) => ({ label: k, type: "keyword" })),
  ...SNIPPETS,
];
