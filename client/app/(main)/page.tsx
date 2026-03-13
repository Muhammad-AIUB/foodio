'use client';

import { useState } from 'react';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import ProductCard from '@/components/home/ProductCard';
import { useCart } from '@/components/providers/CartProvider';
import { PRODUCTS } from '@/lib/mock-data';

export default function HomePage() {
  const { addToCart } = useCart();
  const [category, setCategory] = useState<string | undefined>();

  const filtered = category
    ? PRODUCTS.filter((p) => p.category === category)
    : PRODUCTS;

  return (
    <>
      <Hero />
      <Categories active={category} onSelect={(id) => setCategory(id === category ? undefined : id)} />
      <section className="overflow-visible px-4 pb-16 pt-8 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>
    </>
  );
}
