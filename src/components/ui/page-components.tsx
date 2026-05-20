"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", className)}>
      <div>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-[#9CA3AF]">/</span>}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="hover:text-[#1A2B6B] transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className={cn(index === breadcrumbs.length - 1 && "text-[#1A1A2E] font-medium")}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title & Description */}
        <h1 className="text-2xl font-bold text-[#1A1A2E]">{title}</h1>
        {description && (
          <p className="text-sm text-[#6B7280] mt-1">{description}</p>
        )}
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-3">{actions}</div>
      )}
    </div>
  );
}

// Page Card - wraps content in a card
interface PageCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageCard({ children, className, noPadding }: PageCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#E5E7EB] bg-white shadow-sm",
        !noPadding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

// Page Section - for grouping related content
interface PageSectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageSection({
  title,
  description,
  actions,
  children,
  className,
}: PageSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-[#1A1A2E]">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-[#6B7280] mt-0.5">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

// Form Grid - for organizing form fields
interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function FormGrid({ children, columns = 2, className }: FormGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

// Form Actions - for form submit/cancel buttons
interface FormActionsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  showDivider?: boolean;
  className?: string;
}

export function FormActions({
  onCancel,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  showDivider = true,
  className,
}: FormActionsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-3 pt-4", showDivider && "border-t border-[#F3F4F6]", className)}>
      {onCancel && (
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      {onSubmit && (
        <Button onClick={onSubmit}>{submitText}</Button>
      )}
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {icon && (
        <div className="rounded-full bg-[#F3F4F6] p-4 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#1A1A2E]">{title}</h3>
      {description && (
        <p className="text-sm text-[#6B7280] mt-1 max-w-sm">{description}</p>
      )}
      {action && (
        <Button className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Loading State Component
interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-[#E5E7EB]" />
        <div className="absolute inset-0 h-14 w-14 rounded-full border-4 border-transparent border-t-[#1A2B6B] animate-spin" />
      </div>
      <p className="mt-4 text-sm text-[#6B7280]">{message}</p>
    </div>
  );
}

// Stat Item Component
interface StatItemProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatItem({ label, value, trend, icon, className }: StatItemProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF0F8]">
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs text-[#6B7280]">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold text-[#1A1A2E]">{value}</p>
          {trend && (
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? "text-[#10B981]" : "text-[#EF4444]"
              }`}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Tabs Component
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex border-b border-[#E5E7EB]", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === tab.id
              ? "border-[#1A2B6B] text-[#1A2B6B]"
              : "border-transparent text-[#6B7280] hover:text-[#1A1A2E] hover:border-[#E5E7EB]"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Divider Component
interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <hr className={cn("border-[#E5E7EB]", className)} />;
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <hr className="flex-1 border-[#E5E7EB]" />
      <span className="text-xs text-[#9CA3AF] font-medium">{label}</span>
      <hr className="flex-1 border-[#E5E7EB]" />
    </div>
  );
}

// Alert Banner Component
interface AlertBannerProps {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function AlertBanner({
  variant = "info",
  title,
  children,
  className,
}: AlertBannerProps) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div className={cn("p-4 rounded-lg border", styles[variant], className)}>
      {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
      <div className="text-sm">{children}</div>
    </div>
  );
}