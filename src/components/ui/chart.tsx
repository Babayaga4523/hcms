"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Chart components using Recharts with shadcn/ui styling
export interface ChartConfig {
  [key: string]: {
    label?: string
    color?: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({
  children,
  config,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
    </div>
  )
}

interface ChartTooltipProps {
  children: React.ReactNode
}

export function ChartTooltip({ children }: ChartTooltipProps) {
  return <>{children}</>
}

interface ChartTooltipContentProps {
  children: React.ReactNode
  className?: string
}

export function ChartTooltipContent({ children, className }: ChartTooltipContentProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-white px-3 py-2 text-sm shadow-xl",
      "ring-1 ring-black/5",
      className
    )}>
      {children}
    </div>
  )
}

interface ChartLegendProps {
  children: React.ReactNode
  className?: string
}

export function ChartLegend({ children, className }: ChartLegendProps) {
  return (
    <div className={cn("flex items-center justify-center gap-4 pt-4", className)}>
      {children}
    </div>
  )
}

interface ChartLegendItemProps {
  config: ChartConfig
}

export function ChartLegendContent({ config }: ChartLegendItemProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {Object.entries(config).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: value.color }}
          />
          <span className="text-xs text-muted-foreground">{value.label}</span>
        </div>
      ))}
    </div>
  )
}

// Chart styles for Tailwind
const chartStyles = `
  :root {
    --chart-1: 12 76 228;
    --chart-2: 139 92 246;
    --chart-3: 16 185 129;
    --chart-4: 245 158 11;
    --chart-5: 239 68 68;
  }
`
