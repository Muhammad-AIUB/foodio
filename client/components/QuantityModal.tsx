"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

interface QuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemPrice: string;
  itemImage: string;
}

export default function QuantityModal({
  isOpen,
  onClose,
  itemName,
  itemPrice,
  itemImage,
}: QuantityModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen]);

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
            className="relative w-full max-w-md bg-cream rounded-3xl p-8 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-primary">
                Select the quantity
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/60 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Items label */}
            <div className="border-b border-gray-200 pb-2 mb-4">
              <span className="text-sm text-text-muted">Items</span>
            </div>

            {/* Item row */}
            <div className="flex items-center justify-between mb-8">
              <span className="font-semibold text-text-dark text-lg">
                {itemName}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-primary hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1) setQuantity(val);
                  }}
                  min={1}
                  className="w-14 h-10 text-center text-lg font-semibold text-text-dark border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-full border border-primary bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full border border-gray-300 text-text-dark text-sm font-semibold hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const numericPrice = parseFloat(itemPrice.replace("$", ""));
                  addItem({
                    name: itemName,
                    price: numericPrice,
                    image: itemImage,
                    quantity,
                  });
                  onClose();
                }}
                className="flex-1 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Add to cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
