import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ToastContext,
  type ToastApi,
  type ToastData,
  type ToastOptions,
  type ToastVariant,
} from "./toast-context";
import { ToastItem } from "@/components/ui/ToastItem";

const MAX_TOASTS = 4;

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 4000,
  info: 4000,
  warning: 6000,
  error: 7000,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const push = useCallback(
    (variant: ToastVariant, message: string, options?: ToastOptions) => {
      const id = `toast-${++counter.current}`;
      const toast: ToastData = {
        id,
        variant,
        message,
        title: options?.title,
        duration: options?.duration ?? DEFAULT_DURATION[variant],
      };
      // Keep only the newest MAX_TOASTS
      setToasts((prev) => [...prev, toast].slice(-MAX_TOASTS));
      return id;
    },
    [],
  );

  // Stable reference: components calling useToast() don't re-render when toasts change
  const api = useMemo<ToastApi>(
    () => ({
      success: (message, options) => push("success", message, options),
      error: (message, options) => push("error", message, options),
      warning: (message, options) => push("warning", message, options),
      info: (message, options) => push("info", message, options),
      dismiss,
      dismissAll,
    }),
    [push, dismiss, dismissAll],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex flex-col items-stretch gap-2 px-4 pb-4 pt-2 sm:left-auto sm:items-end">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
