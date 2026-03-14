"use client";

import { useState } from "react";
import { orders as initialOrders, type Order, type OrderStatus } from "@/data/orders";
import OrdersTable from "@/components/admin/OrdersTable";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";

export default function AdminOrdersPage() {
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrderList((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-primary italic mb-8">
        Order Management
      </h1>

      <OrdersTable
        orders={orderList}
        onStatusChange={handleStatusChange}
        onViewDetails={handleViewDetails}
      />

      <OrderDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </>
  );
}
