"use client";

import { useEffect, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div>
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
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-text-muted"
                >
                  No menu items found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={index < currentItems.length - 1 ? "border-b border-gray-100" : ""}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-text-dark transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-text-muted">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-text-dark transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
