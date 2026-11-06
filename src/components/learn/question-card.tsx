"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Lightbulb } from "lucide-react";
import type { QuizQuestion } from "@/content/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/content/markdown";
import { StaticCode } from "@/components/code/static-code";
import { HexyAvatar } from "@/components/brand/mascot";
import { highlightR } from "@/lib/r/language";
import { progress } from "@/lib/store/progress";
import { encourage, praise, XP } from "@/lib/game/xp";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<QuizQuestion["type"], string> = {
  "multiple-choice": "Pick the answer",
  "predict-output": "Predict the output",
  "fill-blank": "Fill in the blank",
  "find-error": "Find the bug",
  "true-false": "True or false?",
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
  total?: number;
  /** Called once when the learner submits an answer. */
  onAnswered?: (correct: boolean) => void;
  allowRetry?: boolean;
  /** Borderless variant used inside the lesson player. */
  bare?: boolean;
}

const LETTERS = "ABCDEFGH";

export function QuestionCard({ question: q, index, total, onAnswered, allowRetry = true, bare }: QuestionCardProps) {
  const [answer, setAnswer] = useState<unknown>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [tries, setTries] = useState(0);
  const correct = submitted && isCorrect(q, answer);
  const name = `q-${q.id}`;
  const seed = q.id.length + tries;

  const submit = () => {
    if (answer === null || answer === "") return;
    setSubmitted(true);
    setTries((t) => t + 1);
    const ok = isCorrect(q, answer);
    progress.recordQuestion(q.id, ok, q.concept);
    onAnswered?.(ok);
  };
  const retry = () => {
    setSubmitted(false);
    setAnswer(null);
  };

  const tile = (on: boolean, isAns: boolean, chosen: boolean) =>
    cn(
      "press flex w-full cursor-pointer items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[15px] font-semibold",
      !submitted && (on ? "border-primary bg-primary-soft [--press-shadow:var(--primary)]" : "border-border bg-surface [--press-shadow:var(--border)] hover:bg-surface-2"),
      submitted && isAns && "border-mint bg-mint-soft [--press-shadow:var(--mint)]",
      submitted && chosen && !isAns && "border-coral bg-coral-soft [--press-shadow:var(--coral)] animate-shake",
      submitted && !chosen && !isAns && "border-border bg-surface opacity-60 [--press-shadow:var(--border)]",
      submitted && "cursor-default",
    );

  const optionList = (options: string[], mono: boolean) => (
    <div role="radiogroup" aria-labelledby={`${name}-prompt`} className="grid gap-2.5">
      {options.map((o, i) => {
        const chosen = answer === i;
        const isAns = submitted && "answer" in q && q.answer === i;
        return (
          <label key={i} className={tile(chosen, Boolean(isAns), chosen)}>
            <input type="radio" name={name} className="sr-only" checked={chosen} disabled={submitted} onChange={() => setAnswer(i)} />
            <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg border-2 font-display text-sm", chosen ? "border-primary text-primary" : "border-border text-muted-foreground")} aria-hidden>
              {LETTERS[i]}
            </span>
            <span className="min-w-0 flex-1">
              {mono ? <pre className="code-static whitespace-pre-wrap text-[13px]">{o}</pre> : <Markdown runnableCode={false}>{o}</Markdown>}
              {submitted && (chosen || isAns) && "optionFeedback" in q && q.optionFeedback?.[i] && (
                <span className="mt-1 block text-xs font-medium text-muted-foreground">
                  <Markdown runnableCode={false}>{q.optionFeedback[i]}</Markdown>
                </span>
              )}
            </span>
            {submitted && isAns && <CheckCircle2 className="size-5 shrink-0 text-success" aria-label="Correct answer" />}
            {submitted && chosen && !isAns && <XCircle className="size-5 shrink-0 text-danger" aria-label="Your answer (incorrect)" />}
          </label>
        );
      })}
    </div>
  );

  return (
    <fieldset className={cn(!bare && "rounded-3xl border-2 border-border bg-card p-5")} data-question={q.id}>
      <legend className="sr-only">{q.prompt}</legend>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="grape">{TYPE_LABEL[q.type]}</Badge>
        {index !== undefined && (
          <span className="text-xs font-bold text-muted-foreground">
            Question {index + 1}
            {total ? ` of ${total}` : ""}
          </span>
        )}
        <span className="ml-auto text-xs font-bold text-warning">+{XP.question} XP</span>
      </div>
      <div id={`${name}-prompt`} className="mb-4 font-display text-lg font-semibold leading-snug">
        <Markdown runnableCode={false}>{q.prompt}</Markdown>
      </div>

      {(q.type === "multiple-choice" || q.type === "true-false") && "code" in q && q.code && <StaticCode code={q.code} className="mb-4 rounded-2xl border-2 border-border" />}
      {q.type === "predict-output" && <StaticCode code={q.code} className="mb-4 rounded-2xl border-2 border-border" />}

      {q.type === "multiple-choice" && optionList(q.options, false)}
      {q.type === "predict-output" && optionList(q.options, true)}
      {q.type === "true-false" && (
        <div role="radiogroup" aria-labelledby={`${name}-prompt`} className="grid grid-cols-2 gap-3">
          {[true, false].map((v) => {
            const chosen = answer === v;
            const isAns = submitted && q.answer === v;
            return (
              <label key={String(v)} className={cn(tile(chosen, isAns, chosen), "justify-center py-4 font-display text-lg")}>
                <input type="radio" name={name} className="sr-only" checked={chosen} disabled={submitted} onChange={() => setAnswer(v)} />
                {v ? "👍 True" : "👎 False"}
              </label>
            );
          })}
        </div>
      )}

      {q.type === "fill-blank" && <FillBlank code={q.code} value={(answer as string) ?? ""} onChange={setAnswer} disabled={submitted} onEnter={submit} id={name} />}

      {q.type === "find-error" && (
        <div role="radiogroup" aria-labelledby={`${name}-prompt`} className="overflow-hidden rounded-2xl border-2 border-border bg-code">
          <p className="border-b-2 border-border bg-surface-2 px-4 py-2 text-xs font-bold text-muted-foreground">🐞 Tap the line that contains the bug</p>
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
                  "code-static flex w-full items-start gap-3 px-4 py-1 text-left text-[13px] transition-colors cursor-pointer",
                  !submitted && (chosen ? "bg-primary-soft" : "hover:bg-surface-2"),
                  submitted && isAns && "bg-mint-soft",
                  submitted && chosen && !isAns && "bg-coral-soft",
                )}
              >
                <span className="w-5 shrink-0 select-none text-right text-[var(--code-gutter)]">{line}</span>
                <span className="whitespace-pre-wrap">{spans.length ? spans.map((s, j) => (s.cls ? <span key={j} className={s.cls}>{s.text}</span> : s.text)) : " "}</span>
              </button>
            );
          })}
        </div>
      )}

      {!submitted && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button onClick={submit} disabled={answer === null || answer === ""} size="lg">
            Check
          </Button>
          {q.type === "fill-blank" && q.hint && (
            <Button variant="ghost" onClick={() => setShowHint(true)}>
              <Lightbulb /> Hint
            </Button>
          )}
        </div>
      )}
      {showHint && !submitted && q.type === "fill-blank" && q.hint && <p className="mt-3 rounded-2xl bg-sun-soft px-4 py-2 text-sm font-semibold">💡 {q.hint}</p>}

      {submitted && (
        <div role="status" className={cn("mt-4 rounded-2xl border-2 p-4 animate-slide-up", correct ? "border-mint bg-mint-soft" : "border-coral bg-coral-soft")}>
          <div className="flex items-start gap-3">
            <HexyAvatar mood={correct ? "celebrate" : "oops"} size={44} className={correct ? "bg-mint/20" : "bg-coral/20"} />
            <div className="min-w-0 flex-1">
              <p className={cn("font-display text-lg font-semibold", correct ? "text-success" : "text-danger")}>{correct ? praise(seed) : encourage(seed)}</p>
              {!correct && q.type === "fill-blank" && (
                <p className="mt-1 text-sm font-semibold">
                  Accepted answer: <code className="font-mono">{q.accept[0]}</code>
                </p>
              )}
              {!correct && q.type === "find-error" && <p className="mt-1 text-sm font-semibold">The bug is on line {q.errorLine}.</p>}
              <div className="mt-1 text-sm">
                <Markdown runnableCode={false}>{q.explanation}</Markdown>
              </div>
              {q.type === "find-error" && (
                <div className="mt-2">
                  <p className="text-xs font-bold">Fixed code</p>
                  <StaticCode code={q.fix} className="mt-1 rounded-xl border-2 border-border" />
                </div>
              )}
              {allowRetry && !correct && (
                <Button size="sm" variant="outline" className="mt-3" onClick={retry}>
                  <RotateCcw /> Try again
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
}

function FillBlank({ code, value, onChange, disabled, onEnter, id }: { code: string; value: string; onChange: (v: string) => void; disabled: boolean; onEnter: () => void; id: string }) {
  const [before, after] = code.split("___");
  const width = Math.max(4, Math.min(30, value.length + 2));
  return (
    <div className="code-static overflow-x-auto rounded-2xl border-2 border-border bg-code px-4 py-3 text-[14px]">
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
          className="mx-0.5 rounded-lg border-2 border-dashed border-primary bg-primary-soft px-1.5 font-mono font-bold text-foreground outline-none focus-visible:border-solid"
          placeholder="?"
        />
        {after}
      </pre>
    </div>
  );
}
