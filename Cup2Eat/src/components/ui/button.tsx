import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/btn relative inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background,color,box-shadow,border-color] duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        gold:
          "overflow-hidden bg-[linear-gradient(135deg,var(--color-gold-hi),var(--color-gold)_45%,var(--color-bronze))] text-ink shadow-[0_18px_50px_-18px_rgba(201,164,92,.9),inset_0_1px_0_rgba(255,255,255,.45)] hover:shadow-[0_22px_60px_-14px_rgba(235,211,160,.95),inset_0_1px_0_rgba(255,255,255,.6)]",
        outline:
          "border border-gold/40 text-cream hover:border-gold hover:bg-gold/10",
        ghost: "text-cream/80 hover:text-gold-hi",
      },
      size: {
        default: "h-12 px-7 text-[15px]",
        lg: "h-15 px-9 text-base",
        sm: "h-10 px-5 text-sm",
      },
    },
    defaultVariants: { variant: "gold", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
