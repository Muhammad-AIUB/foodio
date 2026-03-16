"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check } from "lucide-react";
import { TOAST_EVENT, type ToastDetail } from "@/lib/toast";

const TOAST_LIFETIME_MS = 4000;

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastDetail[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      setToasts((current) => [...current, detail]);

      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== detail.id));
      }, TOAST_LIFETIME_MS);
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex justify-center px-4">
      <div className="flex w-full max-w-md flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-[15px] font-medium text-[#1f2937] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] ${
              toast.variant === "error" ? "border border-red-100" : ""
            }`}
          >
            <span
              className={`inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                toast.variant === "error"
                  ? "bg-red-100 text-red-600"
                  : "bg-[#0F766E] text-white"
              }`}
            >
              {toast.variant === "error" ? (
                <AlertCircle className="h-3.5 w-3.5" />
              ) : (
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              )}
            </span>
            <div className="min-w-0 flex-1 leading-6 text-[#1f2937]">
              {toast.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
