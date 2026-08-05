import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 ring-primary disabled:opacity-50",
          {
            "bg-primary text-black bg-primary-hover": variant === "primary",
            "border border-[var(--color-border)] bg-transparent text-dark hover:border-primary hover:text-primary":
              variant === "secondary",
            "text-[var(--color-muted)] hover:text-primary": variant === "ghost",
            "bg-red-700 text-white hover:bg-red-800": variant === "danger",
            "rounded-md px-3 py-1.5 text-sm": size === "sm",
            "rounded-md px-4 py-2 text-sm": size === "md",
            "rounded-md px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export default Button;
