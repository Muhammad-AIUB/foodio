"use client";

import type { OrderApi, OrderStatus } from "@/lib/types";
import StatusDropdown from "./StatusDropdown";

interface OrdersTableProps {
  orders: OrderApi[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onViewDetails: (order: OrderApi) => void;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }) +
    ", " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
}

export default function OrdersTable({
  orders,
  onStatusChange,
  onViewDetails,
}: OrdersTableProps) {
  if (!Array.isArray(orders)) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
        Failed to load orders.
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-10 text-center text-text-muted">
        No orders available right now.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-text-muted">
              Order ID
            </th>
            <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-text-muted">
              Date
            </th>
            <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-text-muted">
              Customer
            </th>
            <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-text-muted">
              Total
            </th>
            <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-text-muted">
              Status
            </th>
            <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-text-muted">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order.id}
              className={
                index < orders.length - 1 ? "border-b border-gray-100" : ""
              }
            >
              <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-text-dark">
                {order.id.substring(0, 8)}...
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-text-dark">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-text-dark">
                {order.user?.name ?? "—"}
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-text-dark">
                ${Number(order.totalPrice).toFixed(2)}
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4">
                <StatusDropdown
                  value={order.status}
                  onChange={(status) => onStatusChange(order.id, status)}
                />
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4">
                <button
                  onClick={() => onViewDetails(order)}
                  className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-text-dark hover:bg-gray-50 transition-colors"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
