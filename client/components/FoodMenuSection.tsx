"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, SlidersHorizontal, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FoodCard from "./FoodCard";
import { api } from "@/lib/axios";
import type { MenuItemApi, CategoryApi } from "@/lib/types";

interface FoodItemView {
  name: string;
  description: string;
  price: string;
  image: string;
}

type SortOption = "availability" | "price";

export default function FoodMenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItemApi[]>([]);
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      api.get<{ data: MenuItemApi[] }>("/menu-items"),
      api.get<{ data: CategoryApi[] }>("/categories"),
    ])
      .then(([itemsRes, catsRes]) => {
        const items = itemsRes.data?.data ?? itemsRes.data ?? [];
        const cats = catsRes.data?.data ?? catsRes.data ?? [];
        setMenuItems(Array.isArray(items) ? items : []);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(() => {
        setMenuItems([]);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categoryNames = useMemo(
    () => ["All", ...categories.map((c) => c.name)],
    [categories]
  );

  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== "All") {
      items = items.filter(
        (i) => i.category?.name?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(q));
    }
    if (sortBy === "availability") {
      items = [...items].sort((a, b) => Number(b.availability) - Number(a.availability));
    } else if (sortBy === "price") {
      items = [...items].sort((a, b) => Number(a.price) - Number(b.price));
    }
    return items.map((m): FoodItemView => ({
      name: m.name,
      description: m.description ?? "",
      price: `$${Number(m.price).toFixed(2)}`,
      image: m.imageUrl ?? "/images/image1.jpeg",
    }));
  }, [menuItems, activeCategory, searchQuery, sortBy]);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 mb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 mb-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary mb-4 italic">
            Our Menu
          </h1>
          <p className="text-text-muted text-lg">
            Discover our selection of premium dishes, crafted with passion.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-text-dark hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-48 sm:w-56 border border-gray-200 rounded-full text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                aria-expanded={sortOpen}
                aria-haspopup="true"
              >
                Sort
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-100 z-50 overflow-hidden"
                    role="menu"
                  >
                    <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-text-dark border-b border-text-dark pb-0.5">
                        Sort by
                      </span>
                      <button
                        onClick={() => {
                          setSortBy(null);
                        }}
                        className="text-xs font-medium text-text-muted hover:text-text-dark transition-colors"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="px-2 pb-3 space-y-1">
                      {(
                        [
                          { value: "availability", label: "Availability" },
                          { value: "price", label: "Price" },
                        ] as const
                      ).map((option) => {
                        const isSelected = sortBy === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setSortOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              isSelected
                                ? "bg-primary/5 text-text-dark"
                                : "text-text-dark hover:bg-gray-50"
                            }`}
                            role="menuitemradio"
                            aria-checked={isSelected}
                          >
                            {option.label}
                            <span
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-primary border-primary"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6 pb-24">
          {filteredItems.map((item, index) => (
            <FoodCard key={`${item.name}-${index}`} {...item} index={index % 4} animateOnLoad />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p className="text-center text-text-muted py-12">
            No dishes found matching your search.
          </p>
        )}
      </div>
    </section>
  );
}
