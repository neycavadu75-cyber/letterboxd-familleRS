import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    let baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
    
    if (variant === "outline") baseStyles += " border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-100";
    else if (variant === "ghost") baseStyles += " hover:bg-zinc-800 text-zinc-100";
    else baseStyles += " bg-indigo-600 text-white hover:bg-indigo-700";

    if (size === "sm") baseStyles += " h-8 px-3 text-xs";
    else if (size === "lg") baseStyles += " h-10 px-8";
    else baseStyles += " h-9 px-4 py-2";

    return (
      <button ref={ref} className={`${baseStyles} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
