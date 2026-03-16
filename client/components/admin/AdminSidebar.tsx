"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AlignJustify, ClipboardList, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

const navItems = [
  { name: "Menu Items", href: "/admin/menu", icon: AlignJustify },
  { name: "Orders", href: "/admin/orders", icon: ClipboardList },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    window.location.href = "/sign-in";
  };

  const logoBlock = (
    <div className="flex items-center gap-2 mb-8 px-2">
      <Image src="/images/logo.jpeg" alt="Foodio logo" width={28} height={28} className="w-7 h-7" />
      <span className="font-serif text-xl font-bold text-primary">Foodio.</span>
    </div>
  );

  const sidebarNav = (
    <>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href === "/admin/menu" && pathname === "/admin");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-text-dark hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white border border-gray-200 shadow-sm text-primary hover:bg-gray-50"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="lg:hidden fixed left-0 top-0 z-50 w-[260px] min-h-screen bg-white border-r border-gray-100 flex flex-col px-4 py-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Image src="/images/logo.jpeg" alt="Foodio" width={28} height={28} className="w-7 h-7" />
                  <span className="font-serif text-xl font-bold text-primary">Foodio.</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarNav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex w-[220px] min-h-screen bg-white border-r border-gray-100 flex-col px-4 py-6 shrink-0">
        {logoBlock}
        {sidebarNav}
      </aside>
    </>
  );
}
