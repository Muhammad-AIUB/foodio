"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import FoodCard from "./FoodCard";
import { foodItems, categoryNames } from "@/data/menuItems";

export default function FoodMenuSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    let items =
      activeCategory === "All"
        ? Object.values(foodItems).flat()
        : foodItems[activeCategory] || [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
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

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          {/* Category Pills */}
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

          {/* Search & Sort */}
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
            <button className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              Sort
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
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
