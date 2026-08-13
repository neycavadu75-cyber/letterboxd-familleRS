import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-rose-500 text-white hover:bg-rose-600",
          variant === "ghost" && "hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200",
          variant === "outline" && "border border-stone-200 dark:border-stone-800 bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-8 px-3 text-xs",
          size === "icon" && "h-10 w-10 p-0 flex items-center justify-center",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
