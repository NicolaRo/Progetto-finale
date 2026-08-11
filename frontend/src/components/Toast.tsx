import { ToastState } from "../hooks/useToast";

interface ToastProps {
  toast: ToastState | null;
}

export function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div
      className={`toast-cart ${toast.type === "error" ? "toast-cart--error" : ""}`}
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
    >
      <p className="text-body">{toast.message}</p>
    </div>
  );
}