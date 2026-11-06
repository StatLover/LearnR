import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, icon, children, className }: { title: string; description?: ReactNode; icon?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("border-b border-border bg-surface", className)}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="flex flex-wrap items-start gap-4">
          {icon && <div className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary [&_svg]:size-6">{icon}</div>}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            {description && <div className="mt-2 max-w-3xl text-muted-foreground">{description}</div>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
