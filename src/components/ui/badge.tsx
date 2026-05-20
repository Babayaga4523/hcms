import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, getStatusColor } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#1A2B6B] text-white",
        secondary: "bg-gray-100 text-gray-800",
        success: "bg-[#DCFCE7] text-[#166534]",
        warning: "bg-[#FEF9C3] text-[#854D0E]",
        danger: "bg-[#FEE2E2] text-[#991B1B]",
        info: "bg-[#DBEAFE] text-[#1E40AF]",
        outline: "border border-current text-foreground",
        accent: "bg-[#E8A020] text-white",
        pill: "rounded-full px-3 py-1 text-xs font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  status?: string;
}

function Badge({ className, variant, status, children, ...props }: BadgeProps) {
  if (status && !variant) {
    const colors = getStatusColor(status);
    return (
      <span
        className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold")}
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          borderColor: colors.border,
        }}
        {...props}
      >
        {children || status.replace(/_/g, " ")}
      </span>
    );
  }

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

// Count Badge - for notification counts
function CountBadge({ count }: { count: number }) {
  return (
    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#1A2B6B] px-1">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export { Badge, badgeVariants, CountBadge };