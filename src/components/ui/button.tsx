"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[#1A2B6B] to-[#2A3D8B] text-white shadow-md hover:shadow-lg hover:from-[#152454] hover:to-[#1A2B6B] focus-visible:ring-[#1A2B6B]",
        secondary:
          "bg-white text-[#1A2B6B] border-2 border-[#E5E7EB] hover:border-[#1A2B6B] hover:bg-[#EEF0F8] focus-visible:ring-[#1A2B6B]",
        ghost:
          "text-[#6B7280] hover:bg-gray-100 hover:text-[#1A2B6B]",
        danger:
          "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-md hover:shadow-lg hover:from-[#DC2626] hover:to-[#B91C1C] focus-visible:ring-[#EF4444]",
        success:
          "bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-md hover:shadow-lg hover:from-[#059669] hover:to-[#047857] focus-visible:ring-[#10B981]",
        warning:
          "bg-gradient-to-r from-[#E8A020] to-[#D08F1D] text-white shadow-md hover:shadow-lg hover:from-[#D08F1D] hover:to-[#B57B16] focus-visible:ring-[#E8A020]",
        link:
          "text-[#1A2B6B] underline-offset-4 hover:underline",
        outline:
          "border-2 border-[#1A2B6B] text-[#1A2B6B] hover:bg-[#1A2B6B] hover:text-white",
      },
      size: {
        "xs": "h-7 px-2.5 text-[11px]",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      fullWidth,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && "w-full"
        )}
        ref={ref}
        disabled={disabled || loading}
        suppressHydrationWarning
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

// Icon Button Component
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  tooltip?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = "ghost", size = "md", tooltip, className, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    const variantClasses = {
      primary: "bg-[#1A2B6B] text-white hover:bg-[#152454] shadow-sm",
      secondary: "bg-white text-[#1A2B6B] border border-[#E5E7EB] hover:border-[#1A2B6B]",
      ghost: "text-[#6B7280] hover:bg-gray-100 hover:text-[#1A2B6B]",
      danger: "text-[#EF4444] hover:bg-red-50 hover:text-[#DC2626]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        title={tooltip}
        suppressHydrationWarning
        {...props}
      >
        {icon}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export { Button, buttonVariants, IconButton };