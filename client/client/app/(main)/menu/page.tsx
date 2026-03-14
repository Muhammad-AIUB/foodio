'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import ProductCard from '@/components/home/ProductCard';
import { useCart } from '@/components/providers/CartProvider';
import { PRODUCTS, CATEGORIES } from '@/lib/mock-data';

export default function MenuPage() {
  const { addToCart } = useCart();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'default' | 'price'>('default');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (sort === 'price') list = [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [category, search, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">Our Menu</h1>
        <p className="mt-2 text-slate-600">Discover our selection of premium dishes, crafted with passion.</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === 'all' ? 'bg-[#1A3C34] text-white' : 'border border-[#E6E2D8] bg-[#FDF6EA] text-slate-700 hover:bg-[#FEF7EA]'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === c.id ? 'bg-[#1A3C34] text-white' : 'border border-[#E6E2D8] bg-[#FDF6EA] text-slate-700 hover:bg-[#FEF7EA]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#E6E2D8] bg-[#FDF6EA] py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#1A3C34]"
            />
          </div>
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 rounded-lg border border-[#E6E2D8] bg-[#FDF6EA] px-4 py-2 text-sm text-slate-700 hover:bg-[#FEF7EA]"
            >
              Sort
              <svg className={`h-4 w-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {sortOpen && (
              <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <p className="flex items-center justify-between border-b border-[#E6E2D8] px-3 py-2 text-xs text-slate-500">
                  Sort by <button type="button" onClick={() => setSort('default')} className="text-[#1A3C34] hover:underline">Clear</button>
                </p>
                <button type="button" onClick={() => { setSort('default'); setSortOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50">
                  {sort === 'default' ? '✓' : <span className="w-4" />} Availability
                </button>
                <button type="button" onClick={() => { setSort('price'); setSortOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50">
                  {sort === 'price' ? '✓' : <span className="w-4" />} Price
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}
