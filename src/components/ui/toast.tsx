"use client";
import { useSyncExternalStore } from "react";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: "success" | "info" | "warning";
}

let items: ToastItem[] = [];
let next = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(title: string, opts: { description?: string; tone?: ToastItem["tone"]; duration?: number } = {}) {
  const id = next++;
  items = [...items, { id, title, description: opts.description, tone: opts.tone ?? "success" }].slice(-4);
  emit();
  setTimeout(() => dismiss(id), opts.duration ?? 3500);
}
function dismiss(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

const EMPTY: ToastItem[] = [];

export function Toaster() {
  const list = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => items,
    () => EMPTY,
  );
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(92vw,360px)] flex-col gap-2">
      {list.map((t) => {
        const Icon = t.tone === "success" ? CheckCircle2 : t.tone === "warning" ? AlertTriangle : Info;
        return (
          <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xl animate-fade-up">
            <Icon className={cn("mt-0.5 size-5 shrink-0", t.tone === "success" ? "text-success" : t.tone === "warning" ? "text-warning" : "text-info")} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Dismiss notification">
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
