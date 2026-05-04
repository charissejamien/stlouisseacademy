import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, id, className, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          id={id}
          className={cn(
            "peer placeholder-transparent",
            className
          )}
          placeholder={label}
        />
        <label
          htmlFor={id}
          className="absolute left-3 top-2.5 text-sm text-muted-foreground transition-all 
          peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground 
          peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-sla-blue peer-focus:bg-white peer-focus:px-1
          pointer-events-none" 
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };