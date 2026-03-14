"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CircularImageProps {
  src: string | string[];
  alt: string;
  size?: number;
  delay?: number;
  interval?: number;
}

export default function CircularImage({
  src,
  alt,
  size = 300,
  delay = 0,
  interval = 1000,
}: CircularImageProps) {
  const images = Array.isArray(src) ? src : [src];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="relative rounded-full overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300"
      style={{ width: size, height: size }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            fill
            className="w-full h-full object-cover"
            sizes={`${size}px`}
            priority
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
