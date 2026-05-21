"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function Spinner({ size = "md", className, text }: SpinnerProps) {
  const sizeClasses: Record<string, string> = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const textSizes: Record<string, string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <div
        className={cn(
          "rounded-full border-gray-200 border-t-blue-600 animate-spin",
          sizeClasses[size]
        )}
      />
      {text && (
        <span className={cn("text-gray-500", textSizes[size])}>
          {text}
        </span>
      )}
    </div>
  );
}

interface LoadingOverlayProps {
  text?: string;
  className?: string;
}

export function LoadingOverlay({ text = "Loading...", className }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10",
        className
      )}
    >
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}

interface FullPageLoaderProps {
  text?: string;
}

export function FullPageLoader({ text = "Loading..." }: FullPageLoaderProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    </div>
  );
}
