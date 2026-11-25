import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Buttons: solid fills from the palette for actions, quiet outline/ghost
 * styles for everything else. `.press` (globals.css) adds the hover/press
 * feedback.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.1em] [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary: "press bg-primary text-primary-foreground shadow-sm",
        success: "press bg-mint text-on-accent shadow-sm",
        sun: "press bg-sun text-on-sun shadow-sm",
        accent: "press bg-sky text-on-accent shadow-sm",
        grape: "press bg-grape text-on-accent shadow-sm",
        danger: "press bg-coral text-on-accent shadow-sm",
        outline: "press border border-border-strong bg-card text-foreground hover:bg-surface-2",
        secondary: "bg-surface-2 text-foreground hover:bg-surface-3",
        ghost: "text-foreground hover:bg-surface-2",
        link: "text-primary underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 rounded-lg px-3 text-sm",
        md: "h-10 rounded-lg px-4 text-sm",
        lg: "h-11 rounded-lg px-5 text-[15px]",
        xl: "h-12 rounded-xl px-6 text-base",
        icon: "size-10 rounded-lg",
        "icon-sm": "size-8 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} type={asChild ? undefined : (type ?? "button")} {...props} />;
}
