"use client";
import { DropdownMenu as M } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const DropdownMenu = M.Root;
export const DropdownMenuTrigger = M.Trigger;

export function DropdownMenuContent({ className, ...props }: ComponentProps<typeof M.Content>) {
  return (
    <M.Portal>
      <M.Content
        sideOffset={6}
        align="end"
        className={cn("z-50 min-w-48 rounded-2xl border-2 border-border bg-surface p-1.5 shadow-[var(--shadow-pop)] animate-pop-in", className)}
        {...props}
      />
    </M.Portal>
  );
}

export function DropdownMenuItem({ className, ...props }: ComponentProps<typeof M.Item>) {
  return (
    <M.Item
      className={cn(
        "flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-bold outline-none data-[highlighted]:bg-primary-soft [&_svg]:size-4 [&_svg]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof M.Label>) {
  return <M.Label className={cn("px-2.5 py-1 text-xs font-medium text-muted-foreground", className)} {...props} />;
}

export const DropdownMenuSeparator = ({ className }: { className?: string }) => <M.Separator className={cn("my-1 h-px bg-border", className)} />;

export const DropdownMenuRadioGroup = M.RadioGroup;
export function DropdownMenuRadioItem({ className, children, ...props }: ComponentProps<typeof M.RadioItem>) {
  return (
    <M.RadioItem
      className={cn(
        "flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-bold outline-none data-[highlighted]:bg-primary-soft data-[state=checked]:font-semibold [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </M.RadioItem>
  );
}
