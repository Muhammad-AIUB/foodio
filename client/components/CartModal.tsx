"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeItem, updateQuantity, totalAmount, totalItems, clearCart } = useCart();

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-cream rounded-3xl p-8 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-primary italic">
                Cart
              </h2>
              <span className="text-sm text-text-muted">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Empty State */}
            {items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-muted text-lg">Your cart is empty</p>
                <p className="text-text-muted text-sm mt-2">
                  Add some delicious items from the menu!
                </p>
              </div>
            )}

            {/* Cart Items */}
            <div className="space-y-0">
              {items.map((item, index) => (
                <div key={item.name}>
                  <div className="py-5">
                    {/* Item Info Row */}
                    <div className="flex items-center gap-4 mb-4">
                      {/* Circular Image */}
                      <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden shadow-md flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="60px"
                        />
                      </div>
                      {/* Name & Quantity */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sans font-bold text-text-dark text-base">
                          {item.name}
                        </h3>
                        <p className="text-sm text-text-muted">
                          Quantity : {item.quantity}
                        </p>
                      </div>
                      {/* Delete Button */}
                      <button
                        onClick={() => removeItem(item.name)}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>

                    {/* Quantity Controls & Price Row */}
                    <div className="flex items-center justify-between pl-[76px]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.name, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-primary hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-14 h-10 flex items-center justify-center text-lg font-semibold text-text-dark border border-gray-200 rounded-lg bg-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.name, item.quantity + 1)
                          }
                          className="w-9 h-9 rounded-full border border-primary bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-lg font-bold text-text-dark">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  {index < items.length - 1 && (
                    <div className="border-b border-gray-200" />
                  )}
                </div>
              ))}
            </div>

            {/* Total Amount */}
            {items.length > 0 && (
              <>
                <div className="border-t border-gray-200 mt-2 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl font-bold text-text-dark">
                      Total Amount :
                    </span>
                    <span className="text-xl font-bold text-text-dark">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-full border border-gray-300 text-text-dark text-sm font-semibold hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      clearCart();
                      onClose();
                    }}
                    className="flex-1 py-3.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Confirm Order
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
