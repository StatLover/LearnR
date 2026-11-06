/**
 * R code installed into every R session (browser webR, Node webR in the
 * content verifier, and native R in the verifier).
 *
 * It provides the helpers R Academy uses to run learner code:
 *  - .ra_run():   parse + evaluate code expression by expression, recording
 *                 the exact line range of any error/warning, formatting the
 *                 console transcript like the R console, capturing tables.
 *  - .ra_check(): syntax check + token data for static analysis.
 *  - .ra_tests(): evaluate exercise tests against the learner's variables.
 *  - .ra_env_summary(): the "Environment" pane.
 *
 * Console lines on stderr are tagged with "\x1e" + a type letter
 * (E = error, W = warning, M = message, I = info) so the UI can colour them.
 * Everything lives in an attached environment ("tools:rAcademy"), so it never
 * shows up in the learner's ls() and survives rm(list = ls()).
 */
export const R_RUNTIME = String.raw`
local(envir = new.env(parent = baseenv()), {
  if ("tools:rAcademy" %in% search()) detach("tools:rAcademy", character.only = TRUE)
  state <- new.env(parent = emptyenv())
  ra <- new.env(parent = environment())
  state$dark <- FALSE
  state$plots <- 0L
  state$tables <- list()
  state$workspaces <- new.env(parent = emptyenv())
  ra$.ra_state <- state

  ra$.ra_emit <- function(type, text) {
    if (!length(text) || !nzchar(text)) return(invisible())
    text <- sub("\n$", "", text)
    lines <- strsplit(text, "\n", fixed = TRUE)[[1L]]
    if (!length(lines)) lines <- ""
    cat(paste0("\036", type, lines, "\n"), sep = "", file = stderr())
    invisible()
  }

  # ---------------- JSON encoder (no packages needed) ----------------
  ra$.ra_json_str <- function(s) {
    s <- enc2utf8(as.character(s))
    out <- gsub("\\", "\\\\", s, fixed = TRUE)
    out <- gsub("\"", "\\\"", out, fixed = TRUE)
    out <- gsub("\n", "\\n", out, fixed = TRUE)
    out <- gsub("\r", "\\r", out, fixed = TRUE)
    out <- gsub("\t", "\\t", out, fixed = TRUE)
    out <- gsub("[[:cntrl:]]", "", out)
    ifelse(is.na(s), "null", paste0("\"", out, "\""))
  }
  ra$.ra_json <- function(x) {
    if (is.null(x)) return("null")
    if (is.list(x) && !is.data.frame(x)) {
      nm <- names(x)
      if (!is.null(nm) && !inherits(x, "AsIs")) {
        vals <- vapply(x, .ra_json, "")
        return(paste0("{", paste0(.ra_json_str(nm), ":", vals, collapse = ","), "}"))
      }
      vals <- vapply(x, .ra_json, "")
      return(paste0("[", paste0(vals, collapse = ","), "]"))
    }
    asis <- inherits(x, "AsIs")
    if (is.factor(x)) x <- as.character(x)
    vals <- if (is.character(x)) .ra_json_str(x)
      else if (is.logical(x)) ifelse(is.na(x), "null", ifelse(x, "true", "false"))
      else if (is.numeric(x)) ifelse(is.finite(x), formatC(as.numeric(x), digits = 15, format = "g"), "null")
      else .ra_json_str(as.character(x))
    vals <- trimws(vals)
    if (length(x) == 1L && !asis) vals else paste0("[", paste0(vals, collapse = ","), "]")
  }

  # ---------------- helpers ----------------
  ra$.ra_call <- function(call) {
    if (is.null(call) || !is.language(call)) return(NULL)
    if (is.call(call) && identical(call[[1L]], quote(eval)) && length(call) >= 2L &&
        identical(call[[2L]], quote(.ra_expr))) return(NULL)
    txt <- paste(deparse(call, width.cutoff = 500L, nlines = 1L), collapse = " ")
    if (nchar(txt) > 160L) txt <- paste0(substr(txt, 1L, 157L), "...")
    txt
  }

  ra$.ra_stack <- function(calls) {
    if (is.null(calls) || !length(calls)) return(I(character()))
    txt <- vapply(calls, function(cl) paste(deparse(cl, width.cutoff = 200L, nlines = 1L), collapse = " "), "")
    start <- which(txt == "eval(.ra_expr, envir)")
    if (!length(start)) return(I(character()))
    txt <- txt[-seq_len(max(start))]
    drop <- grepl("^(\\.handleSimpleError|h\\(simpleError|\\(function\\(e\\)|withCallingHandlers\\(|doWithOneRestart|withOneRestart|withRestarts|signalCondition|\\.signalSimpleWarning|stop\\(e\\))", txt)
    txt <- txt[!drop]
    if (length(txt) > 25L) txt <- txt[seq_len(25L)]
    I(txt)
  }

  ra$.ra_parse_error <- function(msg) {
    m <- regmatches(msg, regexec("^<text>:([0-9]+):([0-9]+): ([^\n]*)", msg))[[1L]]
    if (length(m) == 4L) {
      context <- sub("^[^\n]*\n?", "", msg)
      return(list(line = as.integer(m[2L]), col = as.integer(m[3L]), message = m[4L], context = context, raw = msg))
    }
    list(line = NULL, col = NULL, message = msg, context = "", raw = msg)
  }

  ra$.ra_format_error <- function(err) {
    if (is.null(err$call)) paste0("Error: ", err$message)
    else paste0("Error in ", err$call, " : ", err$message)
  }

  ra$.ra_emit_warnings <- function(warns, after_error = FALSE) {
    n <- length(warns)
    if (!n) return(invisible())
    fmt <- function(w) if (is.null(w$call)) w$message else paste0("In ", w$call, " : ", w$message)
    head <- if (n == 1L) "Warning message:" else "Warning messages:"
    if (after_error) head <- paste("In addition:", head)
    shown <- warns[seq_len(min(n, 10L))]
    body <- if (n == 1L) fmt(warns[[1L]]) else paste0(seq_along(shown), ": ", vapply(shown, fmt, ""), collapse = "\n")
    if (n > 10L) body <- paste0(body, "\n... and ", n - 10L, " more warnings")
    .ra_emit("W", paste0(head, "\n", body))
  }

  ra$.ra_record_table <- function(x, label) {
    x <- as.data.frame(x)
    n <- min(nrow(x), 200L)
    cols <- names(x)
    rows <- lapply(seq_len(n), function(i) I(vapply(x[i, , drop = FALSE], function(v) {
      v <- v[[1L]]
      if (is.null(v) || (length(v) == 1L && is.na(v))) "NA" else paste(format(v), collapse = ", ")
    }, "")))
    types <- vapply(x, function(v) class(v)[1L], "")
    tbl <- list(label = label, nrow = nrow(x), ncol = ncol(x), names = I(cols), types = I(unname(types)), rows = I(rows))
    state$tables[[length(state$tables) + 1L]] <- tbl
    invisible()
  }

  ra$View <- function(x, title) {
    label <- if (missing(title)) paste(deparse(substitute(x), nlines = 1L), collapse = " ") else title
    if (is.data.frame(x) || is.matrix(x)) .ra_record_table(x, label)
    else print(x)
    .ra_emit("I", paste0("Opened '", label, "' in the Data viewer tab."))
    invisible(x)
  }

  ra$.ra_gg_dark <- function() {
    fg <- "#e5e7eb"; mid <- "#9ca3af"; bg <- "#0f172a"; panel <- "#111c33"; grid <- "#26344f"
    ggplot2::theme(
      text = ggplot2::element_text(colour = fg),
      axis.text = ggplot2::element_text(colour = mid),
      axis.ticks = ggplot2::element_line(colour = mid),
      plot.background = ggplot2::element_rect(fill = bg, colour = NA),
      panel.background = ggplot2::element_rect(fill = panel, colour = NA),
      panel.grid.major = ggplot2::element_line(colour = grid),
      panel.grid.minor = ggplot2::element_line(colour = grid, linewidth = 0.25),
      legend.background = ggplot2::element_rect(fill = bg, colour = NA),
      legend.key = ggplot2::element_rect(fill = panel, colour = NA),
      strip.background = ggplot2::element_rect(fill = "#1e293b", colour = NA),
      strip.text = ggplot2::element_text(colour = fg)
    )
  }

  ra$.ra_print <- function(value, label, envir) {
    if (inherits(value, c("ggplot", "ggplot2::ggplot")) && isTRUE(state$dark)) {
      value <- tryCatch(value + .ra_gg_dark(), error = function(e) value)
    }
    # Evaluate print() from the learner's environment so S3 methods they
    # defined themselves (print.myclass) are found, exactly like the console.
    eval(quote(print(.ra_value)), list(.ra_value = value), envir)
    if (is.data.frame(value)) .ra_record_table(value, label)
    invisible()
  }

  ra$.ra_hooks <- function() {
    setHook("before.plot.new", function() {
      if (isTRUE(state$dark)) graphics::par(fg = "#e5e7eb", col = "#e5e7eb", col.axis = "#cbd5e1",
        col.lab = "#e5e7eb", col.main = "#f8fafc", col.sub = "#cbd5e1")
    })
    setHook("plot.new", function() state$plots <- state$plots + 1L)
    setHook("grid.newpage", function() state$plots <- state$plots + 1L)
    invisible()
  }

  # A separate environment for each part of the site (playground, each lesson,
  # the error checker, exercises), so variables never leak between them.
  ra$.ra_workspace <- function(name, fresh = FALSE) {
    ws <- state$workspaces
    if (fresh || !exists(name, envir = ws, inherits = FALSE)) assign(name, new.env(parent = globalenv()), envir = ws)
    get(name, envir = ws, inherits = FALSE)
  }
  ra$.ra_reset_workspace <- function(name) {
    if (exists(name, envir = state$workspaces, inherits = FALSE)) rm(list = name, envir = state$workspaces)
    invisible()
  }

  # ---------------- run code ----------------
  ra$.ra_run <- function(code, envir = globalenv(), dark = FALSE) {
    t0 <- proc.time()[["elapsed"]]
    state$dark <- isTRUE(dark)
    state$plots <- 0L
    state$tables <- list()
    res <- list(status = "ok", n_expr = 0L, completed = 0L, error = NULL,
                warnings = I(list()), parse_error = NULL, plots = 0L, tables = I(list()), elapsed = 0)
    on.exit(state$dark <- FALSE, add = TRUE)
    exprs <- tryCatch(parse(text = code, keep.source = TRUE), error = function(e) e)
    if (inherits(exprs, "error")) {
      res$status <- "parse_error"
      pe <- .ra_parse_error(conditionMessage(exprs))
      res$parse_error <- pe
      where <- if (!is.null(pe$line)) paste0(" (line ", pe$line, ", column ", pe$col, ")") else ""
      .ra_emit("E", paste0("Error: ", pe$message, where, if (nzchar(pe$context)) paste0("\n", pe$context) else ""))
      return(res)
    }
    srcrefs <- attr(exprs, "srcref")
    res$n_expr <- length(exprs)
    all_warns <- list()
    for (i in seq_along(exprs)) {
      sr <- srcrefs[[i]]
      l1 <- sr[[1L]]; l2 <- sr[[3L]]
      label <- paste(deparse(exprs[[i]], width.cutoff = 60L, nlines = 1L), collapse = " ")
      warns <- list()
      stack <- NULL
      .ra_expr <- exprs[[i]]
      ok <- withCallingHandlers(
        tryCatch(
          withCallingHandlers({
            vis <- withVisible(eval(.ra_expr, envir))
            if (vis$visible) .ra_print(vis$value, label, envir)
            TRUE
          }, error = function(e) stack <<- sys.calls()),
          error = function(e) {
            res$status <<- "error"
            res$error <<- list(message = conditionMessage(e), call = .ra_call(conditionCall(e)),
                               class = I(class(e)), line_start = l1, line_end = l2, expr = i,
                               stack = .ra_stack(stack))
            FALSE
          },
          interrupt = function(e) {
            res$status <<- "interrupted"
            FALSE
          }),
        warning = function(w) {
          warns[[length(warns) + 1L]] <<- list(message = conditionMessage(w), call = .ra_call(conditionCall(w)),
                                              line_start = l1, line_end = l2)
          invokeRestart("muffleWarning")
        },
        message = function(m) {
          # Package start-up notes (e.g. "Attaching package: 'dplyr'") are shown
          # dimmed as info lines; ordinary message() output is shown normally.
          .ra_emit(if (inherits(m, "packageStartupMessage")) "I" else "M", conditionMessage(m))
          invokeRestart("muffleMessage")
        })
      if (!ok && identical(res$status, "error")) .ra_emit("E", .ra_format_error(res$error))
      if (!ok && identical(res$status, "interrupted")) .ra_emit("E", "Execution stopped.")
      if (length(warns)) {
        .ra_emit_warnings(warns, after_error = !ok)
        all_warns <- c(all_warns, warns)
      }
      if (!ok) break
      res$completed <- i
    }
    res$warnings <- I(all_warns)
    res$plots <- state$plots
    res$tables <- I(state$tables)
    res$elapsed <- proc.time()[["elapsed"]] - t0
    res
  }

  # ---------------- syntax check + tokens (static analysis) ----------------
  ra$.ra_check <- function(code, envir = globalenv()) {
    exprs <- tryCatch(parse(text = code, keep.source = TRUE), error = function(e) e)
    if (inherits(exprs, "error")) return(list(ok = FALSE, parse_error = .ra_parse_error(conditionMessage(exprs))))
    pd <- utils::getParseData(exprs, includeText = TRUE)
    pd <- pd[pd$terminal, c("line1", "col1", "line2", "col2", "token", "text")]
    calls <- unique(pd$text[pd$token == "SYMBOL_FUNCTION_CALL"])
    pkgs <- unique(pd$text[pd$token == "SYMBOL_PACKAGE"])
    known <- vapply(calls, function(f) exists(f, envir = envir, mode = "function"), logical(1))
    list(ok = TRUE, n_expr = length(exprs),
         tokens = I(lapply(seq_len(nrow(pd)), function(i) list(l1 = pd$line1[i], c1 = pd$col1[i], l2 = pd$line2[i], c2 = pd$col2[i], t = pd$token[i], x = pd$text[i]))),
         unknown_functions = I(calls[!known]), packages = I(pkgs))
  }

  ra$.ra_function_names <- function() {
    I(sort(unique(unlist(lapply(search(), function(s) ls(s, all.names = FALSE))))))
  }

  ra$.ra_formals <- function(fname) {
    f <- tryCatch(get(fname, envir = globalenv(), mode = "function"), error = function(e) NULL)
    if (is.null(f)) return(I(character()))
    nm <- names(formals(args(f)))
    def <- tryCatch(get(paste0(fname, ".default"), envir = globalenv(), mode = "function"), error = function(e) NULL)
    if (!is.null(def)) nm <- c(nm, names(formals(def)))
    I(unique(setdiff(nm, "...")))
  }

  # ---------------- environment pane ----------------
  ra$.ra_env_summary <- function(envir) {
    nms <- sort(ls(envir))
    I(lapply(nms, function(n) {
      x <- get(n, envir = envir)
      size <- if (is.data.frame(x)) sprintf("%d obs. of %d variables", nrow(x), ncol(x))
        else if (is.function(x)) "function"
        else if (is.matrix(x)) paste(dim(x), collapse = " x ")
        else paste0("length ", length(x))
      preview <- tryCatch(paste(utils::capture.output(utils::str(x, give.attr = FALSE, vec.len = 3, list.len = 4, max.level = 1))[1L], collapse = ""), error = function(e) "")
      list(name = n, class = class(x)[1L], type = typeof(x), size = size, preview = trimws(preview))
    }))
  }

  # ---------------- exercise tests ----------------
  ra$.ra_tests <- function(checks, uenv, out = "", err = NULL, plots = 0L, code = "") {
    tenv <- new.env(parent = uenv)
    tenv$.out <- out
    tenv$.error <- err
    tenv$.plots <- as.integer(plots)
    tenv$.code <- code
    tenv$.defined <- function(name) exists(name, envir = uenv, inherits = FALSE)
    tenv$.has_geom <- function(p, geom) {
      if (!inherits(p, c("ggplot", "ggplot2::ggplot"))) return(FALSE)
      layers <- tryCatch(p$layers, error = function(e) NULL)
      if (is.null(layers)) layers <- tryCatch(eval(call("@", p, quote(layers))), error = function(e) list())
      any(vapply(layers, function(l) inherits(l$geom, geom), logical(1)))
    }
    tenv$.gg_label <- function(p, which) {
      lab <- tryCatch(p$labels[[which]], error = function(e) NULL)
      if (is.null(lab) && "get_labs" %in% getNamespaceExports("ggplot2"))
        lab <- tryCatch(ggplot2::get_labs(p)[[which]], error = function(e) NULL)
      lab
    }
    I(lapply(checks, function(chk) {
      tryCatch({
        v <- suppressWarnings(suppressMessages(eval(parse(text = chk), envir = tenv)))
        list(pass = isTRUE(v), error = NULL)
      }, error = function(e) list(pass = FALSE, error = conditionMessage(e)))
    }))
  }

  # Every helper's enclosing environment is ra (whose parent holds state),
  # so helpers find each other but never the learner's variables.
  for (n in ls(ra, all.names = TRUE)) {
    f <- ra[[n]]
    if (is.function(f)) { environment(f) <- ra; assign(n, f, envir = ra) }
  }
  ra$.ra_hooks()
  attach(ra, name = "tools:rAcademy", warn.conflicts = FALSE)
})
invisible(TRUE)
`;

/** Base/recommended packages that ship with R and never need installing. */
export const BASE_PACKAGES = new Set([
  "base", "compiler", "datasets", "graphics", "grDevices", "grid", "methods", "parallel",
  "splines", "stats", "stats4", "tcltk", "tools", "utils", "webr",
]);

/** Find package names referenced by library(), require(), requireNamespace() or pkg::fn. */
export function detectPackages(code: string): string[] {
  const found = new Set<string>();
  const stripped = code
    .split("\n")
    .map((line) => line.replace(/#.*$/, ""))
    .join("\n");
  const re = /\b(?:library|require|requireNamespace)\s*\(\s*["']?([A-Za-z][A-Za-z0-9.]*)["']?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(stripped))) found.add(m[1]);
  const ns = /\b([A-Za-z][A-Za-z0-9.]*):::?[A-Za-z_.]/g;
  while ((m = ns.exec(stripped))) found.add(m[1]);
  return [...found].filter((p) => !BASE_PACKAGES.has(p));
}
