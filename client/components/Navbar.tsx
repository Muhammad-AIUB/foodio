"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import CartModal from "./CartModal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Food Menu", href: "/food-menu" },
  { name: "My Orders", href: "/my-orders" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/40 backdrop-blur-sm border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.jpeg"
              alt="Foodio logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-serif text-2xl font-bold text-primary">
              Foodio.
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border border-primary text-primary"
                      : "text-primary hover:bg-accent"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-primary" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <Link
              href="/sign-in"
              className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent text-primary"
                        : "text-primary hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => { setCartOpen(true); setMobileOpen(false); }}
                  className="relative p-2"
                >
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
}
