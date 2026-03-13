'use client';

import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/mock-data';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="relative overflow-visible rounded-3xl bg-[#FCFAF6] px-6 pt-20 pb-16 shadow-md transition-shadow hover:shadow-lg">
      {/* Overlapping plate - breaks out of top */}
      <div className="absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <h3 className="text-center text-lg font-bold text-gray-900">{product.name}</h3>
      <p className="mt-2 line-clamp-2 text-center text-sm text-gray-500">{product.description}</p>
      <p className="mt-3 text-center text-xl font-bold text-[#1A362D]">${product.price.toFixed(2)}</p>

      {/* Overlapping Add to Cart - breaks out of bottom-right */}
      <button
        type="button"
        onClick={() => onAddToCart?.(product.id)}
        className="absolute -bottom-5 right-4 flex items-center gap-2 rounded-lg bg-[#1A362D] px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_25px_rgba(26,54,45,0.4)] transition-shadow hover:shadow-[0_10px_30px_rgba(26,54,45,0.5)]"
      >
        <ShoppingCart className="h-4 w-4" strokeWidth={2} />
        Add to Cart
      </button>
    </div>
  );
}
