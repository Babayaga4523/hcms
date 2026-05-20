"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  footer?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
};

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "md",
  footer,
  className,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
}: ModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose, closeOnEscape]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal Container */}
      <div
        className={cn(
          "relative w-full rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200",
          "border border-[#E5E7EB]",
          maxWidthClasses[maxWidth],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-[#1A1A2E]">{title}</h2>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#1A2B6B] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F3F4F6] bg-[#FAFAFA] rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Confirm Dialog Component
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: {
      button: "bg-[#EF4444] hover:bg-[#DC2626]",
      icon: "text-[#EF4444]",
      bg: "bg-red-50",
    },
    warning: {
      button: "bg-[#E8A020] hover:bg-[#D08F1D]",
      icon: "text-[#E8A020]",
      bg: "bg-amber-50",
    },
    info: {
      button: "bg-[#3B82F6] hover:bg-[#2563EB]",
      icon: "text-[#3B82F6]",
      bg: "bg-blue-50",
    },
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="sm" showCloseButton={false}>
      <div className="text-center">
        <div
          className={cn(
            "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full",
            variantStyles[variant].bg
          )}
        >
          <svg
            className={cn("h-7 w-7", variantStyles[variant].icon)}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-[#1A1A2E]">{title}</h3>
        <p className="text-sm text-[#6B7280]">{message}</p>
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          loading={isLoading}
          className={variantStyles[variant].button}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

// Drawer component (slide from right)
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg";
  className?: string;
  footer?: React.ReactNode;
}

const drawerWidths = {
  sm: "320px",
  md: "480px",
  lg: "640px",
};

export function Drawer({
  open,
  onClose,
  title,
  children,
  width = "md",
  className,
  footer,
}: DrawerProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "absolute right-0 top-0 h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col",
          className
        )}
        style={{ width: drawerWidths[width] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
          <h2 className="text-lg font-semibold text-[#1A1A2E]">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#1A2B6B] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F3F4F6] bg-[#FAFAFA]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Slide-over Panel (similar to Drawer but with more options)
interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  position?: "left" | "right";
  width?: "sm" | "md" | "lg";
  className?: string;
}

export function SlideOver({
  open,
  onClose,
  title,
  description,
  children,
  position = "right",
  width = "md",
  className,
}: SlideOverProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "absolute top-0 bottom-0 bg-white shadow-2xl animate-in slide-in-from-right duration-300",
          position === "right" ? "right-0" : "left-0",
          className
        )}
        style={{ width: drawerWidths[width] }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#F3F4F6]">
            <div className="flex items-start justify-between">
              <div>
                {title && (
                  <h2 className="text-lg font-semibold text-[#1A1A2E]">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#1A2B6B] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}