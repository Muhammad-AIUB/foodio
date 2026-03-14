"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import QuantityModal from "./QuantityModal";

interface FoodCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
  index: number;
  animateOnLoad?: boolean;
}

export default function FoodCard({
  name,
  description,
  price,
  image,
  index,
  animateOnLoad = false,
}: FoodCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const animationProps = animateOnLoad
    ? {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
      }
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
      };

  return (
    <motion.div
      {...animationProps}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="relative bg-cream rounded-3xl pt-24 pb-5 pl-5 pr-5 flex flex-col min-h-[320px] transition-shadow duration-300 hover:shadow-md mt-16"
    >
      {/* Food Image — circular, left-aligned, overlapping top */}
      <div className="absolute -top-14 -left-6 w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] rounded-full overflow-hidden shadow-lg">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 mt-2">
        <h3 className="font-sans font-bold text-text-dark text-lg mb-1">
          {name}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed mb-4">
          {description}
        </p>

        <div className="mt-auto">
          <span className="text-2xl font-bold text-text-dark">{price}</span>
          <div className="absolute bottom-[-4%] right-[0%]">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
            >
              Add to Cart
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      <QuantityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemName={name}
        itemPrice={price}
        itemImage={image}
      />
    </motion.div>
  );
}
