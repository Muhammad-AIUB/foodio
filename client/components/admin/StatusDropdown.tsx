"use client";

import { ChevronDown } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

interface StatusDropdownProps {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
}

const statuses: { value: OrderStatus; label: string }[] = [
  { value: "Pending", label: "Pending" },
  { value: "Preparing", label: "Preparing" },
  { value: "Ready", label: "Ready" },
  { value: "Completed", label: "Completed" },
];

export default function StatusDropdown({
  value,
  onChange,
}: StatusDropdownProps) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        className="appearance-none bg-accent/50 border border-gray-200 rounded-lg px-4 py-2 pr-9 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
    </div>
  );
}
