import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastState {
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const notify = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  return { toast, notify, dismiss };
}