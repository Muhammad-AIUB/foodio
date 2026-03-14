"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AlignJustify, ClipboardList, LogOut } from "lucide-react";

const navItems = [
  { name: "Menu Items", href: "/admin/menu", icon: AlignJustify },
  { name: "Orders", href: "/admin/orders", icon: ClipboardList },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] min-h-screen bg-white border-r border-gray-100 flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <Image
          src="/images/logo.jpeg"
          alt="Foodio logo"
          width={28}
          height={28}
          className="w-7 h-7"
        />
        <span className="font-serif text-xl font-bold text-primary">
          Foodio.
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href === "/admin/menu" && pathname === "/admin");
          return (
            <Link
              key={item.name}
              href={item.href}
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

      {/* Sign Out */}
      <div className="mt-auto pt-6 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
