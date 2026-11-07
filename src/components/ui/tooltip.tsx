"use client";
import { Tooltip as T } from "radix-ui";
import type { ReactNode } from "react";

export const TooltipProvider = T.Provider;

export function Tooltip({ content, children, side = "top" }: { content: ReactNode; children: ReactNode; side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <T.Root delayDuration={250}>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content side={side} sideOffset={8} className="z-[60] max-w-xs rounded-xl bg-foreground px-3 py-1.5 text-xs font-bold text-background shadow-lg animate-pop-in">
          {content}
          <T.Arrow className="fill-foreground" />
        </T.Content>
      </T.Portal>
    </T.Root>
  );
}
