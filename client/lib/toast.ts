"use client";

export type ToastVariant = "error" | "success";

export interface ToastDetail {
  id: string;
  message: string;
  variant: ToastVariant;
}

export const TOAST_EVENT = "foodio:toast";

function emitToast(variant: ToastVariant, message: string) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<ToastDetail>(TOAST_EVENT, {
      detail: {
        id: crypto.randomUUID(),
        message,
        variant,
      },
    })
  );
}

export const toast = {
  error(message: string) {
    emitToast("error", message);
  },
  success(message: string) {
    emitToast("success", message);
  },
};
