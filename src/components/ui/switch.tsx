"use client";
import { Switch as S } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: ComponentProps<typeof S.Root>) {
  return (
    <S.Root
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-surface-3 transition-colors data-[state=checked]:bg-mint",
        className,
      )}
      {...props}
    >
      <S.Thumb className="pointer-events-none block size-5.5 translate-x-1 rounded-full bg-white shadow-md transition-transform data-[state=checked]:translate-x-[22px]" />
    </S.Root>
  );
}
