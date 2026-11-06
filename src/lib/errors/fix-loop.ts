/**
 * Turns proposed fixes into *verified* corrected code: a fix is applied, R
 * re-runs the code, and if a new (different) error appears its fix is applied
 * too – up to a few rounds. A corrected version is only offered when R
 * actually runs it without an error, and the output shown is R's real output.
 */
import type { RunResult } from "../r/console";
import { analyzeRun, type AnalysisContext, type Diagnosis } from "./analyze";

export interface VerifiedFix {
  code: string;
  steps: string[];
  result: RunResult;
  confidence: "high" | "medium";
  /** Diagnoses that still apply after the fix (e.g. warnings). */
  remaining: Diagnosis[];
}

export interface FixDeps {
  run(code: string): Promise<RunResult>;
  context(result: RunResult, code: string): Promise<Omit<AnalysisContext, "code" | "info">>;
}

export async function verifyFix(original: string, first: Diagnosis, deps: FixDeps, maxRounds = 5): Promise<VerifiedFix | null> {
  if (!first.fix) return null;
  let code = first.fix.code;
  const steps = [first.fix.summary];
  let confidence = first.fix.confidence;
  const seen = new Set([original, code]);
  for (let round = 0; round < maxRounds; round++) {
    const result = await deps.run(code);
    const st = result.info?.status;
    if (st === "ok") {
      const ctx = await deps.context(result, code);
      return { code, steps, result, confidence, remaining: analyzeRun({ code, info: result.info, ...ctx }) };
    }
    if (!result.info || (st !== "error" && st !== "parse_error")) return null;
    const ctx = await deps.context(result, code);
    const [d] = analyzeRun({ code, info: result.info, ...ctx });
    if (!d?.fix || seen.has(d.fix.code)) return null;
    code = d.fix.code;
    seen.add(code);
    steps.push(d.fix.summary);
    if (d.fix.confidence === "medium") confidence = "medium";
  }
  return null;
}
