import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, getStatusColor } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#1A2B6B] to-[#2A3D8B] text-white",
        secondary: "bg-gray-100 text-gray-700",
        success: "bg-gradient-to-r from-[#10B981] to-[#059669] text-white",
        warning: "bg-gradient-to-r from-[#E8A020] to-[#D08F1D] text-white",
        danger: "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white",
        info: "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white",
        outline: "border-2 border-current text-foreground bg-transparent",
        soft: "bg-[#F3F4F6] text-[#6B7280]",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  status?: string;
}

function Badge({ className, variant, size, status, children, ...props }: BadgeProps) {
  if (status && !variant) {
    const colors = getStatusColor(status);
    return (
      <span
        className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold")}
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
        }}
        {...props}
      >
        {children || status.replace(/_/g, " ")}
      </span>
    );
  }

  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  );
}

// Dot Badge - small status indicator
function DotBadge({ status }: { status: string }) {
  const colors = getStatusColor(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: colors.text }}
      />
      {status.replace(/_/g, " ")}
    </span>
  );
}

// Count Badge - for notification counts
function CountBadge({ count }: { count: number }) {
  return (
    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white px-1 shadow-sm">
      {count > 99 ? "99+" : count}
    </span>
  );
}

// Status Badge with icon
function StatusBadge({ status, icon }: { status: string; icon?: React.ReactNode }) {
  const colors = getStatusColor(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {status.replace(/_/g, " ")}
    </span>
  );
}

export { Badge, badgeVariants, CountBadge, DotBadge, StatusBadge };