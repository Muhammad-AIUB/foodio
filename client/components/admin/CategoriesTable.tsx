"use client";

import { SquarePen, Trash2 } from "lucide-react";

interface CategoriesTableProps {
  categories: string[];
  onEdit: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">
              Name
            </th>
            <th className="text-right px-6 py-4 text-sm font-medium text-text-muted">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((name, index) => (
            <tr
              key={name}
              className={
                index < categories.length - 1 ? "border-b border-gray-100" : ""
              }
            >
              <td className="px-6 py-4 text-sm font-medium text-text-dark">
                {name}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => onEdit(name)}
                    className="text-text-muted hover:text-primary transition-colors"
                  >
                    <SquarePen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(name)}
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
