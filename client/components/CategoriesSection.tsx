"use client";

import { useState } from "react";
import { UtensilsCrossed, Beef, Layers } from "lucide-react";
import { motion } from "framer-motion";
import FoodCard from "./FoodCard";
import { foodItems } from "@/data/menuItems";

const categories = [
  { name: "Starters", icon: UtensilsCrossed },
  { name: "Main Courses", icon: Beef },
  { name: "Desserts", icon: Layers },
];

export default function CategoriesSection() {
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof foodItems>("Starters");

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center gap-4 sm:gap-6 mb-16"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() =>
                  setActiveCategory(cat.name as keyof typeof foodItems)
                }
                className={`flex flex-col items-center gap-3 px-8 sm:px-12 py-5 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-cream shadow-sm"
                    : "bg-transparent hover:bg-gray-50"
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

        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
          {foodItems[activeCategory].map((item, index) => (
            <FoodCard key={item.name} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
