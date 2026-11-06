import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Chunky, tactile buttons: solid colour with a darker "3D" bottom edge that
 * presses down when clicked (see `.press` in globals.css).
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-semibold tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.1em] [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary: "press bg-primary text-primary-foreground [--press-shadow:var(--primary-shadow)]",
        success: "press bg-mint text-white [--press-shadow:var(--mint-shadow)]",
        sun: "press bg-sun text-[#3b2600] [--press-shadow:var(--sun-shadow)]",
        accent: "press bg-sky text-white [--press-shadow:var(--sky-shadow)]",
        grape: "press bg-grape text-white [--press-shadow:var(--grape-shadow)]",
        danger: "press bg-coral text-white [--press-shadow:var(--coral-shadow)]",
        outline: "press border-2 border-border bg-surface text-foreground hover:bg-surface-2 [--press-shadow:var(--border)]",
        secondary: "bg-surface-2 text-foreground hover:bg-surface-3",
        ghost: "text-foreground hover:bg-surface-2",
        link: "text-primary underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 rounded-xl px-3.5 text-sm",
        md: "h-11 rounded-2xl px-5 text-[15px]",
        lg: "h-12 rounded-2xl px-7 text-base",
        xl: "h-14 rounded-2xl px-9 text-lg",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
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
