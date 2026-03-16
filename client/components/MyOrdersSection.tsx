"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import type { OrderApi } from "@/lib/types";
import OrderCard from "./OrderCard";

export default function MyOrdersSection() {
  const [orders, setOrders] = useState<OrderApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ data: OrderApi[] }>("/orders/my")
      .then(({ data }) => {
        const list = data?.data ?? data ?? [];
        setOrders(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        setError("Failed to load orders");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-dark md:text-4xl">
        My Orders
      </h1>
      <div className="mt-8 space-y-6">
        {orders.length === 0 ? (
          <p className="text-text-muted">You have no orders yet.</p>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </section>
  );
}
