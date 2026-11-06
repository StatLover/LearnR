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
      <D.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-fade-up" />
      <D.Content
        className={cn(
          "fixed left-1/2 top-[8vh] z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 rounded-xl border border-border bg-card p-6 shadow-2xl outline-none max-h-[84vh] overflow-y-auto scrollbar-thin",
          className,
        )}
        {...props}
      >
        <D.Title className={cn("text-lg font-semibold pr-8", hideTitle && "sr-only")}>{title}</D.Title>
        {description ? (
          <D.Description className="mt-1 text-sm text-muted-foreground">{description}</D.Description>
        ) : (
          <D.Description className="sr-only">{title}</D.Description>
        )}
        <div className={cn(!hideTitle && "mt-4")}>{children}</div>
        <D.Close className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground cursor-pointer" aria-label="Close">
          <X className="size-4" />
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}
