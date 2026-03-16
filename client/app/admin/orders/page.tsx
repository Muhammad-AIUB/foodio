"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";
import type { OrderApi, OrderStatus } from "@/lib/types";
import OrdersTable from "@/components/admin/OrdersTable";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";

export default function AdminOrdersPage() {
  const [orderList, setOrderList] = useState<OrderApi[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderApi | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<{ data: OrderApi[] }>("/orders");
      const orders = data?.data ?? data ?? [];
      setOrderList(Array.isArray(orders) ? orders : []);
    } catch (err) {
      setError("Failed to load orders");
      setOrderList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrderList((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch {
      setError("Failed to update order status");
    }
  };

  const handleViewDetails = (order: OrderApi) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary italic mb-6 sm:mb-8">
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
