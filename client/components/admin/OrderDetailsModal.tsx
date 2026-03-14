"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Order } from "@/data/orders";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!mounted || !order) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-cream rounded-3xl p-8 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary italic">
                  Order Details
                </h2>
                <p className="text-sm text-text-muted mt-1">#{order.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address */}
            <div className="pb-4 mb-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-text-dark mb-1">
                Address
              </h3>
              <p className="text-sm text-text-muted">
                {order.deliveryAddress}
              </p>
            </div>

            {/* Items */}
            <div className="pb-4 mb-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-text-dark mb-3">
                Items
              </h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-text-dark">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-sm text-text-dark">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-text-dark">Total</span>
              <span className="text-base font-bold text-text-dark">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
