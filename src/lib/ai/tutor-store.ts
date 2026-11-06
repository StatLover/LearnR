"use client";
/**
 * Browser side of the AI tutor: the conversation (kept in localStorage), the
 * streaming request to /api/ai/chat, and the tool loop – when the tutor asks
 * to run R code, the code runs here in webR and the real output is sent back.
 */
import { useSyncExternalStore } from "react";
import { rSession } from "../r/session";
import { transcript } from "../r/console";
import { progress, progressStore } from "../store/progress";
import { settingsStore, type TutorMode } from "../store/settings";

type Block = Record<string, unknown> & { type: string };
export interface ChatMessage {
  role: "user" | "assistant";
  content: string | Block[];
}
export interface ToolRun {
  code: string;
  purpose?: string;
  output: string;
  status: string;
  images: string[];
}
export interface TutorState {
  messages: ChatMessage[];
  toolRuns: Record<string, ToolRun>;
  streaming: string | null;
  busy: boolean;
  error: string | null;
  activity: string | null;
  retryText?: string | null;
}

const KEY = "ra-tutor";
const MAX_MESSAGES = 70;
let state: TutorState = { messages: [], toolRuns: {}, streaming: null, busy: false, error: null, activity: null };
let loaded = false;
const listeners = new Set<() => void>();
let controller: AbortController | null = null;
let pending: string | null = null;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (raw?.messages) state = { ...state, messages: raw.messages, toolRuns: raw.toolRuns ?? {} };
  } catch {
    /* ignore */
  }
}
function save() {
  try {
    const toolRuns = Object.fromEntries(Object.entries(state.toolRuns).map(([k, v]) => [k, { ...v, images: [] }]));
    localStorage.setItem(KEY, JSON.stringify({ messages: state.messages, toolRuns }));
  } catch {
    /* storage full */
  }
}
function set(p: Partial<TutorState>, persist = false) {
  state = { ...state, ...p };
  if (persist) save();
  listeners.forEach((l) => l());
}

const SERVER: TutorState = { messages: [], toolRuns: {}, streaming: null, busy: false, error: null, activity: null };
export function useTutor(): TutorState {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => (load(), state),
    () => SERVER,
  );
}

export interface TutorContext {
  lessonId?: string;
  exerciseId?: string;
  mode?: TutorMode;
}

async function requestTurn(messages: ChatMessage[], ctx: TutorContext, onText: (t: string) => void, signal: AbortSignal) {
  const p = progressStore.get();
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      messages,
      mode: ctx.mode ?? settingsStore.get().tutorMode,
      lessonId: ctx.lessonId,
      exerciseId: ctx.exerciseId,
      profile: {
        programming: p.profile.programming,
        statistics: p.profile.statistics,
        completedLessons: Object.values(p.lessons).filter((l) => l.completedAt).length,
      },
    }),
  });
  if (!res.ok || !res.body) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error ?? `The tutor could not answer (HTTP ${res.status}).`);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let done: { content: Block[]; stop_reason: string } | null = null;
  for (;;) {
    const { value, done: end } = await reader.read();
    if (end) break;
    buf += dec.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      const ev = JSON.parse(line);
      if (ev.type === "text") onText(ev.text);
      else if (ev.type === "done") done = ev;
      else if (ev.type === "error") throw new Error(ev.message);
    }
  }
  if (!done) throw new Error("The connection to the tutor was interrupted. Please try again.");
  return done;
}

async function runToolCall(block: Block): Promise<{ result: Block; run: ToolRun }> {
  const input = (block.input ?? {}) as { code?: unknown; purpose?: unknown };
  const id = String(block.id);
  if (typeof input.code !== "string" || !input.code.trim() || input.code.length > 20_000) {
    return {
      result: { type: "tool_result", tool_use_id: id, is_error: true, content: JSON.stringify({ INVALID_JSON: JSON.stringify(block.input ?? null).slice(0, 2000) }) },
      run: { code: String(input.code ?? ""), output: "The tutor sent code that could not be read.", status: "invalid", images: [] },
    };
  }
  const r = await rSession.run(input.code, { workspace: "tutor", fresh: true, timeoutMs: 20000 });
  let out = transcript(r.lines);
  if (out.length > 6000) out = out.slice(0, 6000) + "\n… (output truncated)";
  const summary = `Status: ${r.status}\n${r.images.length ? `${r.images.length} plot(s) drawn and shown to the learner.\n` : ""}Console output:\n${out || "(no output)"}`;
  return {
    result: { type: "tool_result", tool_use_id: id, content: summary, is_error: r.status !== "ok" },
    run: { code: input.code, purpose: typeof input.purpose === "string" ? input.purpose : undefined, output: out, status: r.status, images: r.images },
  };
}

export const tutor = {
  /** Send a message and run the tutor's tool calls until it gives a final answer. */
  async send(text: string, ctx: TutorContext = {}) {
    load();
    if (state.busy || !text.trim()) return;
    if (state.messages.length >= MAX_MESSAGES) {
      set({ error: "This conversation is very long. Clear it to start a new one – long conversations get slower and less focused." });
      return;
    }
    controller = new AbortController();
    const signal = controller.signal;
    set({ messages: [...state.messages, { role: "user", content: text }], busy: true, error: null, streaming: "", activity: null, retryText: null }, true);
    progress.bumpStat("tutorMessages");
    try {
      for (let round = 0; round < 5; round++) {
        let streamed = "";
        const turn = await requestTurn(state.messages, ctx, (t) => {
          streamed += t;
          set({ streaming: streamed });
        }, signal);
        set({ messages: [...state.messages, { role: "assistant", content: turn.content }], streaming: null }, true);
        if (turn.stop_reason !== "tool_use") {
          if (turn.stop_reason === "refusal") set({ error: "The tutor could not answer this request." });
          if (turn.stop_reason === "max_tokens") set({ error: "The answer was cut off because it was too long. Ask the tutor to continue." });
          break;
        }
        const calls = turn.content.filter((b) => b.type === "tool_use");
        const results: Block[] = [];
        const runs: Record<string, ToolRun> = {};
        for (const call of calls) {
          set({ activity: "Running R code in your browser…" });
          const { result, run } = await runToolCall(call);
          results.push(result);
          runs[String(call.id)] = run;
        }
        set({ messages: [...state.messages, { role: "user", content: results }], toolRuns: { ...state.toolRuns, ...runs }, activity: null, streaming: "" }, true);
      }
    } catch (e) {
      if (!signal.aborted) set({ error: e instanceof Error ? e.message : String(e) });
      // Keep the conversation valid: drop a trailing turn the model never answered
      // (a tool result, or the question itself – which is offered for retry).
      const last = state.messages[state.messages.length - 1];
      if (last?.role === "user" && Array.isArray(last.content)) set({ messages: state.messages.slice(0, -2) }, true);
      else if (last?.role === "user" && typeof last.content === "string") set({ messages: state.messages.slice(0, -1), retryText: last.content }, true);
    } finally {
      set({ busy: false, streaming: null, activity: null }, true);
      controller = null;
    }
  },
  stop() {
    controller?.abort();
  },
  clear() {
    controller?.abort();
    set({ messages: [], toolRuns: {}, error: null, streaming: null, busy: false }, true);
  },
  /** Queue a message to be sent when the tutor page opens. */
  queue(text: string) {
    pending = text;
  },
  takeQueued(): string | null {
    const p = pending;
    pending = null;
    return p;
  },
};

let statusPromise: Promise<{ configured: boolean; model: string | null }> | null = null;
export function aiStatus() {
  if (!statusPromise) statusPromise = fetch("/api/ai/status").then((r) => r.json()).catch(() => ({ configured: false, model: null }));
  return statusPromise;
}

/** Build a message containing the learner's code and its real output. */
export function codeMessage(code: string, output: string | null, question = "Can you explain what this code does and help me with any problems?") {
  return `${question}\n\nMy code:\n\`\`\`r\n${code}\n\`\`\`\n${output !== null ? `\nWhen I ran it, R printed:\n\`\`\`\n${output || "(no output)"}\n\`\`\`` : "\n(I have not run it yet.)"}`;
}
