import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-dark outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-primary focus:ring-2 ring-primary",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
