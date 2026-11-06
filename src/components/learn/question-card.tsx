"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Lightbulb } from "lucide-react";
import type { QuizQuestion } from "@/content/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/content/markdown";
import { StaticCode } from "@/components/code/static-code";
import { highlightR } from "@/lib/r/language";
import { progress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<QuizQuestion["type"], string> = {
  "multiple-choice": "Multiple choice",
  "predict-output": "Predict the output",
  "fill-blank": "Fill in the blank",
  "find-error": "Find the error",
  "true-false": "True or false",
};

const norm = (s: string) => s.replace(/\s+/g, "").replace(/["']/g, '"').toLowerCase();

export function isCorrect(q: QuizQuestion, answer: unknown): boolean {
  switch (q.type) {
    case "multiple-choice":
    case "predict-output":
      return answer === q.answer;
    case "true-false":
      return answer === q.answer;
    case "fill-blank":
      return typeof answer === "string" && q.accept.some((a) => norm(a) === norm(answer));
    case "find-error":
      return answer === q.errorLine;
  }
}

export interface QuestionCardProps {
  question: QuizQuestion;
  index?: number;
  /** Called once when the learner submits an answer. */
  onAnswered?: (correct: boolean) => void;
  /** Quiz mode: answers are revealed together by the parent. */
  allowRetry?: boolean;
  compact?: boolean;
}

export function QuestionCard({ question: q, index, onAnswered, allowRetry = true }: QuestionCardProps) {
  const [answer, setAnswer] = useState<unknown>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const correct = submitted && isCorrect(q, answer);
  const name = `q-${q.id}`;

  const submit = () => {
    if (answer === null || answer === "") return;
    setSubmitted(true);
    const ok = isCorrect(q, answer);
    progress.recordQuestion(q.id, ok, q.concept);
    onAnswered?.(ok);
  };
  const retry = () => {
    setSubmitted(false);
    setAnswer(null);
  };

  const optionList = (options: string[], mono: boolean) => (
    <div role="radiogroup" aria-labelledby={`${name}-prompt`} className="grid gap-2">
      {options.map((o, i) => {
        const chosen = answer === i;
        const isAns = submitted && "answer" in q && q.answer === i;
        return (
          <label
            key={i}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
              !submitted && (chosen ? "border-primary bg-primary-soft" : "border-border hover:bg-surface-2"),
              submitted && isAns && "border-success bg-success-soft",
              submitted && chosen && !isAns && "border-danger bg-danger-soft",
              submitted && !chosen && !isAns && "border-border opacity-70",
              submitted && "cursor-default",
            )}
          >
            <input type="radio" name={name} className="mt-1 accent-[var(--primary)]" checked={chosen} disabled={submitted} onChange={() => setAnswer(i)} />
            <span className="min-w-0 flex-1">
              {mono ? <pre className="code-static whitespace-pre-wrap text-[13px]">{o}</pre> : <Markdown runnableCode={false}>{o}</Markdown>}
              {submitted && (chosen || isAns) && "optionFeedback" in q && q.optionFeedback?.[i] && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  <Markdown runnableCode={false}>{q.optionFeedback[i]}</Markdown>
                </span>
              )}
            </span>
            {submitted && isAns && <CheckCircle2 className="size-4 shrink-0 text-success" aria-label="Correct answer" />}
            {submitted && chosen && !isAns && <XCircle className="size-4 shrink-0 text-danger" aria-label="Your answer (incorrect)" />}
          </label>
        );
      })}
    </div>
  );

  return (
    <fieldset className="rounded-xl border border-border bg-card p-4" data-question={q.id}>
      <legend className="sr-only">{q.prompt}</legend>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {index !== undefined && <span className="text-xs font-semibold text-muted-foreground">Question {index + 1}</span>}
        <Badge variant="outline">{TYPE_LABEL[q.type]}</Badge>
      </div>
      <div id={`${name}-prompt`} className="mb-3 font-medium">
        <Markdown runnableCode={false}>{q.prompt}</Markdown>
      </div>

      {(q.type === "multiple-choice" || q.type === "true-false") && "code" in q && q.code && <StaticCode code={q.code} className="mb-3 rounded-lg border border-border" />}
      {q.type === "predict-output" && <StaticCode code={q.code} className="mb-3 rounded-lg border border-border" />}

      {q.type === "multiple-choice" && optionList(q.options, false)}
      {q.type === "predict-output" && optionList(q.options, true)}
      {q.type === "true-false" && (
        <div role="radiogroup" aria-labelledby={`${name}-prompt`} className="flex gap-2">
          {[true, false].map((v) => {
            const chosen = answer === v;
            const isAns = submitted && q.answer === v;
            return (
              <label
                key={String(v)}
                className={cn(
                  "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium",
                  !submitted && (chosen ? "border-primary bg-primary-soft" : "border-border hover:bg-surface-2"),
                  submitted && isAns && "border-success bg-success-soft",
                  submitted && chosen && !isAns && "border-danger bg-danger-soft",
                )}
              >
                <input type="radio" name={name} className="accent-[var(--primary)]" checked={chosen} disabled={submitted} onChange={() => setAnswer(v)} />
                {v ? "True" : "False"}
              </label>
            );
          })}
        </div>
      )}

      {q.type === "fill-blank" && <FillBlank code={q.code} value={(answer as string) ?? ""} onChange={setAnswer} disabled={submitted} onEnter={submit} id={name} />}

      {q.type === "find-error" && (
        <div role="radiogroup" aria-labelledby={`${name}-prompt`} className="overflow-hidden rounded-lg border border-border bg-code">
          <p className="border-b border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">Click the line that contains the mistake.</p>
          {highlightR(q.code).map((spans, i) => {
            const line = i + 1;
            const chosen = answer === line;
            const isAns = submitted && q.errorLine === line;
            return (
              <button
                key={i}
                role="radio"
                aria-checked={chosen}
                aria-label={`Line ${line}`}
                disabled={submitted}
                onClick={() => setAnswer(line)}
                className={cn(
                  "code-static flex w-full items-start gap-3 px-3 py-0.5 text-left text-[13px] cursor-pointer",
                  !submitted && (chosen ? "bg-primary-soft" : "hover:bg-surface-2"),
                  submitted && isAns && "bg-success-soft",
                  submitted && chosen && !isAns && "bg-danger-soft",
                )}
              >
                <span className="w-5 shrink-0 select-none text-right text-[var(--code-gutter)]">{line}</span>
                <span className="whitespace-pre-wrap">{spans.length ? spans.map((s, j) => (s.cls ? <span key={j} className={s.cls}>{s.text}</span> : s.text)) : " "}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!submitted ? (
          <>
            <Button size="sm" onClick={submit} disabled={answer === null || answer === ""}>
              Check answer
            </Button>
            {q.type === "fill-blank" && q.hint && (
              <Button size="sm" variant="ghost" onClick={() => setShowHint(true)}>
                <Lightbulb /> Hint
              </Button>
            )}
          </>
        ) : (
          allowRetry &&
          !correct && (
            <Button size="sm" variant="outline" onClick={retry}>
              <RotateCcw /> Try again
            </Button>
          )
        )}
      </div>
      {showHint && !submitted && q.type === "fill-blank" && q.hint && <p className="mt-2 text-sm text-muted-foreground">💡 {q.hint}</p>}

      {submitted && (
        <div role="status" className={cn("mt-3 rounded-lg p-3 text-sm", correct ? "bg-success-soft" : "bg-danger-soft")}>
          <p className={cn("flex items-center gap-1.5 font-semibold", correct ? "text-success" : "text-danger")}>
            {correct ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
            {correct ? "Correct – well done!" : "Not quite – here's why:"}
          </p>
          {!correct && q.type === "fill-blank" && <p className="mt-1">Accepted answer: <code className="font-mono">{q.accept[0]}</code></p>}
          {!correct && q.type === "find-error" && <p className="mt-1">The mistake is on line {q.errorLine}.</p>}
          <div className="mt-1">
            <Markdown runnableCode={false}>{q.explanation}</Markdown>
          </div>
          {q.type === "find-error" && (
            <div className="mt-2">
              <p className="text-xs font-semibold">Corrected code</p>
              <StaticCode code={q.fix} className="mt-1 rounded-md border border-border" />
            </div>
          )}
        </div>
      )}
    </fieldset>
  );
}

function FillBlank({ code, value, onChange, disabled, onEnter, id }: { code: string; value: string; onChange: (v: string) => void; disabled: boolean; onEnter: () => void; id: string }) {
  const [before, after] = code.split("___");
  const width = Math.max(4, Math.min(30, value.length + 2));
  return (
    <div className="code-static overflow-x-auto rounded-lg border border-border bg-code px-4 py-3 text-[13px]">
      <pre className="whitespace-pre-wrap">
        {before}
        <label htmlFor={`${id}-blank`} className="sr-only">
          Fill in the blank
        </label>
        <input
          id={`${id}-blank`}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
          spellCheck={false}
          autoComplete="off"
          style={{ width: `${width}ch` }}
          className="mx-0.5 rounded border-b-2 border-primary bg-primary-soft px-1 font-mono text-foreground outline-none focus-visible:outline-2 focus-visible:outline-ring"
          placeholder="?"
        />
        {after}
      </pre>
    </div>
  );
}
