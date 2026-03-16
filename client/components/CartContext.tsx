"use client";

import { ReactNode } from "react";
import { useCartStore } from "@/store/useCartStore";
import type { CartItem } from "@/store/useCartStore";

export type { CartItem };

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

export function useCart(): CartContextValue {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalAmountFn = useCartStore((s) => s.totalAmount);
  const totalItemsFn = useCartStore((s) => s.totalItems);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount: totalAmountFn(),
    totalItems: totalItemsFn(),
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
