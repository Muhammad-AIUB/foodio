"use client";

import type { Order, OrderStatus } from "@/data/orders";
import StatusDropdown from "./StatusDropdown";

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onViewDetails: (order: Order) => void;
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
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">
              Order ID
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">
              Date
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">
              Customer
            </th>
            <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">
              Total
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
          {orders.map((order, index) => (
            <tr
              key={order.id}
              className={
                index < orders.length - 1 ? "border-b border-gray-100" : ""
              }
            >
              <td className="px-6 py-4 text-sm text-text-dark">
                {order.id.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 text-sm text-text-dark">
                {formatDate(order.placedAt)}
              </td>
              <td className="px-6 py-4 text-sm text-text-dark">
                {order.customer}
              </td>
              <td className="px-6 py-4 text-sm text-text-dark">
                ${order.totalAmount.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <StatusDropdown
                  value={order.status}
                  onChange={(status) => onStatusChange(order.id, status)}
                />
              </td>
              <td className="px-6 py-4">
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
