"use client";

import { orders } from "@/data/orders";
import OrderCard from "./OrderCard";

export default function MyOrdersSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-text-dark sm:text-4xl">
        My Orders
      </h1>
      <div className="mt-8 space-y-6">
        {orders.map((order, idx) => (
          <OrderCard key={idx} order={order} />
        ))}
      </div>
    </section>
  );
}
