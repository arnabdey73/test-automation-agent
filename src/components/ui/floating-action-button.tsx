import * as React from "react";
import { cn } from "../../lib/utils";

interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success";
  icon?: React.ReactNode;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(
  (
    {
      className,
      variant = "primary",
      icon,
      position = "bottom-right",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
      success: "bg-success text-success-foreground hover:bg-success/90 focus:ring-success",
    };
    
    const positions = {
      "bottom-right": "fixed bottom-6 right-6",
      "bottom-left": "fixed bottom-6 left-6",
      "top-right": "fixed top-6 right-6",
      "top-left": "fixed top-6 left-6",
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          positions[position],
          "h-14 w-14",
          className
        )}
        {...props}
      >
        {icon || children}
      </button>
    );
  }
);

FloatingActionButton.displayName = "FloatingActionButton";

export { FloatingActionButton };
