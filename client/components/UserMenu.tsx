"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, LogOut, ChevronDown, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface UserMenuProps {
  /** Called when user selects an item (e.g. to close mobile nav) */
  onAction?: () => void;
}

export default function UserMenu({ onAction }: UserMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isOrdersActive = pathname === "/my-orders";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    onAction?.();
    await logout();
    router.push("/sign-in");
  };

  const handleLinkClick = () => {
    setOpen(false);
    onAction?.();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-primary hover:bg-gray-50 transition-colors border border-gray-200"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </span>
        <span className="hidden sm:inline max-w-[120px] truncate">
          {user.name || "Account"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-lg bg-white border border-gray-200 shadow-lg z-50 overflow-hidden"
          role="menu"
        >
          <div className="p-2 min-w-0">
            {/* Header */}
            <div className="px-2 py-1.5 mb-1">
              <p className="text-sm font-medium text-gray-500">My Account</p>
              <div className="mt-1.5 border-b border-gray-200" />
            </div>

            {/* Orders (active state when on orders page) */}
            <div className="mb-1">
              <Link
                href="/my-orders"
                onClick={handleLinkClick}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isOrdersActive
                    ? "bg-gray-50 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                role="menuitem"
              >
                <span>Orders</span>
                {isOrdersActive && (
                  <Check className="w-4 h-4 text-gray-900 shrink-0" />
                )}
              </Link>
              <div className="border-b border-gray-200" />
            </div>

            {/* Sign out */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              role="menuitem"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
