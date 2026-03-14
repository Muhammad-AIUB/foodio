"use client";

import { Order, OrderStatus } from "@/data/orders";

const STATUS_STEPS: OrderStatus[] = ["pending", "preparing", "ready", "completed"];
const STATUS_LABELS = ["PENDING", "PREPARING", "READY", "COMPLETED"];

function getStepIndex(status: OrderStatus): number {
  return STATUS_STEPS.indexOf(status);
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const isPending = status === "pending";
  const label = isPending ? "Pending" : "Completed";
  const classes = isPending
    ? "border-orange-400 text-orange-500"
    : "border-green-500 text-green-600";

  return (
    <span className={`rounded-full border px-3 py-1 text-sm font-medium ${classes}`}>
      {label}
    </span>
  );
}

function OrderStepper({ status }: { status: OrderStatus }) {
  const currentIndex = getStepIndex(status);

  return (
    <div className="flex items-center justify-center py-6">
      <div className="flex items-center gap-0">
        {STATUS_STEPS.map((step, index) => {
          const isActive = index <= currentIndex;
          const isLast = index === STATUS_STEPS.length - 1;

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`h-3.5 w-3.5 rounded-full border-2 ${
                    isActive
                      ? "border-primary bg-primary"
                      : "border-gray-300 bg-white"
                  }`}
                />
                <span
                  className={`mt-2 text-xs font-semibold tracking-wide ${
                    isActive ? "text-text-dark" : "text-gray-400"
                  }`}
                >
                  {STATUS_LABELS[index]}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`mx-1 mb-5 h-0.5 w-16 sm:w-24 md:w-28 ${
                    index < currentIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-text-dark">
            Order #{order.id}
          </h3>
          <p className="mt-0.5 text-sm text-text-muted">
            Placed on {new Date(order.placedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at {new Date(order.placedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-text-dark">
            ${order.totalAmount.toFixed(2)}
          </span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Items */}
      <div className="mt-6">
        <p className="text-xs font-semibold tracking-wider text-text-muted">
          ITEMS
        </p>
        <div className="mt-3 space-y-2">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <span className="font-medium text-text-dark">
                {item.quantity}x {item.name}
              </span>
              <span className="text-text-dark">
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
        <p className="text-base font-bold text-text-dark">
          Total Amount : ${order.totalAmount.toFixed(2)}
        </p>
      </div>

      {/* Delivery Address */}
      <div className="mt-4">
        <span className="text-sm font-semibold text-text-dark">
          Delivering to:
        </span>{" "}
        <span className="text-sm text-text-muted">
          {order.deliveryAddress}
        </span>
      </div>

      {/* Stepper */}
      <OrderStepper status={order.status} />
    </div>
  );
}
