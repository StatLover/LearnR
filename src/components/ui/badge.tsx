import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3", {
  variants: {
    variant: {
      default: "bg-surface-2 text-foreground",
      primary: "bg-primary-soft text-primary-strong dark:text-primary",
      accent: "bg-accent-soft text-accent",
      success: "bg-success-soft text-success",
      warning: "bg-warning-soft text-warning",
      danger: "bg-danger-soft text-danger",
      info: "bg-info-soft text-info",
      outline: "border border-border text-muted-foreground",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function DifficultyBadge({ difficulty }: { difficulty: "easy" | "medium" | "challenge" }) {
  const map = { easy: "success", medium: "info", challenge: "warning" } as const;
  return <Badge variant={map[difficulty]}>{difficulty === "challenge" ? "Challenge" : difficulty[0].toUpperCase() + difficulty.slice(1)}</Badge>;
}
