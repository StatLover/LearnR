import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Colourful page hero used at the top of every main page: a soft gradient
 * band with decorative blobs, an icon tile, the title and an optional
 * illustration / actions on the right.
 */
export function PageHeader({
  title,
  description,
  icon,
  children,
  className,
  color = "primary",
  eyebrow,
  art,
}: {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Accent colour name: primary, mint, sun, coral, sky, grape, tangerine, pink, teal */
  color?: string;
  eyebrow?: string;
  /** Illustration shown on the right (e.g. the mascot). */
  art?: ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden border-b border-border", className)} style={{ background: `var(--${color}-soft)` }}>
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-5 px-5 py-8 sm:py-10">
        {icon && (
          <div className="grid size-12 shrink-0 place-items-center rounded-xl text-on-accent [&_svg]:size-6" style={{ background: `var(--${color})` }}>
            {icon}
          </div>
        )}
        {/* On phones the text takes the full width (icon above, actions below) instead of being squeezed. */}
        <div className="min-w-0 flex-1 basis-full sm:basis-0">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: `var(--${color})` }}>{eyebrow}</p>}
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {description && <div className="mt-2 max-w-3xl text-base text-muted-foreground">{description}</div>}
        </div>
        {children}
        {art && <div className="hidden shrink-0 md:block">{art}</div>}
      </div>
    </div>
  );
}
