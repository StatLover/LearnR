import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap [&_svg]:size-3.5", {
  variants: {
    variant: {
      default: "bg-surface-2 text-foreground",
      primary: "bg-primary-soft text-primary-strong dark:text-primary",
      accent: "bg-sky-soft text-sky",
      success: "bg-mint-soft text-success",
      warning: "bg-sun-soft text-warning",
      danger: "bg-coral-soft text-danger",
      info: "bg-sky-soft text-info",
      grape: "bg-grape-soft text-grape",
      outline: "border-2 border-border text-muted-foreground",
      xp: "bg-sun-soft text-warning",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function DifficultyBadge({ difficulty }: { difficulty: "easy" | "medium" | "challenge" }) {
  const map = { easy: "success", medium: "info", challenge: "grape" } as const;
  const label = { easy: "Easy", medium: "Medium", challenge: "Challenge" }[difficulty];
  const dots = { easy: 1, medium: 2, challenge: 3 }[difficulty];
  return (
    <Badge variant={map[difficulty]}>
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("size-1.5 rounded-full bg-current", i > dots && "opacity-25")} />
        ))}
      </span>
      {label}
    </Badge>
  );
}

export function XpBadge({ xp, className }: { xp: number; className?: string }) {
  return (
    <Badge variant="xp" className={className}>
      <Zap className="fill-current" /> +{xp} XP
    </Badge>
  );
}
