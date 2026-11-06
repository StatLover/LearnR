"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyText, cn } from "@/lib/utils";

/** Small copy-to-clipboard button for code snippets (hidden when printing). */
export function CopyButton({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        }
      }}
      className={cn(
        "inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg border-2 px-1.5 text-xs font-bold transition-colors print:hidden",
        done ? "border-mint bg-mint-soft text-success" : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground",
        className,
      )}
      aria-label={done ? "Copied" : label}
    >
      {done ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {done && <span>Copied!</span>}
      <span role="status" className="sr-only">
        {done ? "Copied to the clipboard" : ""}
      </span>
    </button>
  );
}
