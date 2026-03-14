'use client';

import { UtensilsCrossed, ChefHat, Cake } from 'lucide-react';
import { CATEGORIES } from '@/lib/mock-data';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  starters: UtensilsCrossed,
  main: ChefHat,
  desserts: Cake,
};

interface CategoriesProps {
  active?: string;
  onSelect?: (id: string) => void;
}

export default function Categories({ active, onSelect }: CategoriesProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h2 className="font-playfair text-2xl font-bold text-[#1A362D] sm:text-3xl">
          Curated Categories
        </h2>
        <p className="mt-1 text-sm text-gray-600">Explore our diverse menu of culinary delights.</p>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id];
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect?.(cat.id)}
              className={`flex flex-col items-center gap-2 rounded-2xl px-8 py-6 transition-all ${
                isActive
                  ? 'bg-[#F0EEE9] text-[#1A362D] shadow-md'
                  : 'bg-white text-gray-500'
              }`}
            >
              {Icon && <Icon className="h-6 w-6" strokeWidth={1.5} />}
              <span className="text-sm font-medium">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
