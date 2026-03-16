"use client";

import type { ReactNode } from "react";

export type ToastVariant = "error" | "success";

export interface ToastDetail {
  id: string;
  message: ReactNode;
  variant: ToastVariant;
}

export const TOAST_EVENT = "foodio:toast";

function emitToast(variant: ToastVariant, message: ReactNode) {
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
  error(message: ReactNode) {
    emitToast("error", message);
  },
  success(message: ReactNode) {
    emitToast("success", message);
  },
};
