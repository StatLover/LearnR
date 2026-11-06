"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyText } from "@/lib/utils";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        }
      }}
      className="rounded p-1 text-muted-foreground opacity-60 hover:bg-surface-2 hover:text-foreground hover:opacity-100 focus-visible:opacity-100 print:hidden cursor-pointer"
      aria-label={done ? "Copied" : label}
    >
      {done ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
    </button>
  );
}
