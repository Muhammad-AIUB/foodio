"use client";

import { useState, useEffect } from "react";
import { UtensilsCrossed, Beef, Layers } from "lucide-react";
import { motion } from "framer-motion";
import FoodCard from "./FoodCard";
import { api } from "@/lib/axios";
import type { MenuItemApi, CategoryApi } from "@/lib/types";

const CAT_ICONS: Record<string, typeof UtensilsCrossed> = {
  Starters: UtensilsCrossed,
  "Main Courses": Beef,
  Desserts: Layers,
};

export default function CategoriesSection() {
  const [menuItems, setMenuItems] = useState<MenuItemApi[]>([]);
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");

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
        if (cats.length && !activeCategory) {
          setActiveCategory((cats as CategoryApi[])[0]?.name ?? "");
        }
      })
      .catch(() => {
        setMenuItems([]);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (categories.length && !activeCategory) {
      setActiveCategory(categories[0]?.name ?? "");
    }
  }, [categories, activeCategory]);

  const itemsForCategory = menuItems.filter(
    (i) => i.category?.name?.toLowerCase() === activeCategory?.toLowerCase()
  );

  if (loading) {
    return (
      <section className="py-8 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </section>
    );
  }

  return (
    <section className="  bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-primary mb-4 italic">
            Curated Categories
          </h2>
          <p className="text-text-muted text-lg">
            Explore our diverse menu of culinary delights.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center gap-4 sm:gap-6 mb-16 flex-wrap"
        >
          {categories.map((cat) => {
            const Icon = CAT_ICONS[cat.name] ?? UtensilsCrossed;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex flex-col items-center gap-3 px-8 sm:px-12 py-5 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive ? "bg-cream shadow-sm" : "bg-transparent hover:bg-gray-50"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-text-dark">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </motion.div>

        {activeCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
            {itemsForCategory.map((item, index) => (
              <FoodCard
                key={item.id}
                name={item.name}
                description={item.description ?? ""}
                price={`$${Number(item.price).toFixed(2)}`}
                image={item.imageUrl ?? "/images/image1.jpeg"}
                index={index}
              />
            ))}
          </div>
        )}

        {itemsForCategory.length === 0 && activeCategory && (
          <p className="text-center text-text-muted py-12">
            No items in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
