import { createContext } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  title?: string;
  /** Milliseconds before auto-dismiss. Use 0 for a toast that stays until closed. */
  duration?: number;
}

export interface ToastData {
  id: string;
  variant: ToastVariant;
  message: string;
  title?: string;
  duration: number;
}

export interface ToastApi {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export const ToastContext = createContext<ToastApi | undefined>(undefined);
