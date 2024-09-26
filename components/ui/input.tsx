import * as React from "react";
import { cn } from "@/lib/utils";

// Add at least one custom property to avoid the empty interface warning
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  customProp?: string; // Example custom prop
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, type, customProp, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border-2 border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props} // Apply the rest of the props
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
