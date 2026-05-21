"use client";

import * as React from "react";

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = React.useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const duration = t.duration ?? (t.type === "error" ? 8000 : t.type === "warning" ? 7000 : 5000);
      setToasts((prev) => [...prev, { ...t, id, duration }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const success = React.useCallback(
    (title: string, message?: string) => toast({ type: "success", title, message }),
    [toast]
  );

  const error = React.useCallback(
    (title: string, message?: string) => toast({ type: "error", title, message, duration: 8000 }),
    [toast]
  );

  const info = React.useCallback(
    (title: string, message?: string) => toast({ type: "info", title, message }),
    [toast]
  );

  const warning = React.useCallback(
    (title: string, message?: string) => toast({ type: "warning", title, message, duration: 7000 }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800 border",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  const icons = {
    success: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L17 7M22 2L2 2l20 20" />
    ),
    error: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4-4 4 4 4-4M22 2l-20 20M2 2l20 20" />
    ),
    info: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-9m-9 9 9-9m9-9v8m0 0h-9m9 9h9m-9-9v-8" />
    ),
    warning: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v5m0 1-1 1-4m0 6h0m-10 10v-1" />
    ),
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right duration-300 ${styles[toast.type]}`}
    >
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icons[toast.type]}
      </svg>
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.message && <p className="text-sm opacity-80 mt-0.5">{toast.message}</p>}
      </div>
      <button
        onClick={onDismiss}
        className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
