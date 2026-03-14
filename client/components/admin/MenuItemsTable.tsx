"use client";

import { SquarePen, Trash2 } from "lucide-react";
import type { AdminFoodItem } from "@/data/menuItems";

interface MenuItemsTableProps {
  items: AdminFoodItem[];
  onEdit: (item: AdminFoodItem) => void;
  onDelete: (id: string) => void;
}

export default function MenuItemsTable({
  items,
  onEdit,
  onDelete,
}: MenuItemsTableProps) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">
              Name
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">
              Category
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">
              Price
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">
              Status
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id}
              className={index < items.length - 1 ? "border-b border-gray-100" : ""}
            >
              <td className="px-6 py-4 text-sm font-medium text-text-dark">
                {item.name}
              </td>
              <td className="px-6 py-4 text-sm text-text-dark">
                {item.category}
              </td>
              <td className="px-6 py-4 text-sm text-text-dark">
                ${item.price.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "available"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {item.status === "available" ? "Available" : "Unavailable"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-text-muted hover:text-primary transition-colors"
                  >
                    <SquarePen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
