"use client";
import { Dialog as D } from "radix-ui";
import { X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export function DialogContent({
  className,
  children,
  title,
  description,
  hideTitle,
  ...props
}: ComponentProps<typeof D.Content> & { title: string; description?: ReactNode; hideTitle?: boolean }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-[#0c0f24]/50 backdrop-blur-[3px] animate-fade-up" />
      <D.Content
        className={cn(
          "fixed left-1/2 top-[7vh] z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 rounded-3xl border-2 border-border bg-surface p-6 shadow-2xl outline-none max-h-[86vh] overflow-y-auto scrollbar-thin animate-pop-in",
          className,
        )}
        {...props}
      >
        <D.Title className={cn("pr-8 font-display text-xl font-semibold", hideTitle && "sr-only")}>{title}</D.Title>
        {description ? (
          <D.Description className="mt-1 text-sm text-muted-foreground">{description}</D.Description>
        ) : (
          <D.Description className="sr-only">{title}</D.Description>
        )}
        <div className={cn(!hideTitle && "mt-4")}>{children}</div>
        <D.Close className="absolute right-4 top-4 rounded-xl p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground cursor-pointer" aria-label="Close">
          <X className="size-5" />
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}
