"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import CircularImage from "./CircularImage";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-0 items-center min-h-[calc(100vh-80px)]">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-12 lg:py-0 lg:pr-12"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
              <Image src="/images/Icon_Book.jpeg" alt="Menu icon" width={18} height={18} />
              <span className="text-sm font-medium text-text-dark">
                Food Ordering Service
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[64px] xl:text-[72px] leading-[1.08] font-serif font-bold text-primary mb-8">
              Where Great Food
              <br className="hidden lg:block" />
              {" "}Meets{" "}
              <span className="italic font-normal">Great Taste.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-text-muted max-w-[500px] mb-10 leading-relaxed">
              Experience a symphony of flavors crafted with passion. Premium
              ingredients, exquisite recipes, delivered to your door.
            </p>

            {/* CTA */}
            <Link href="/food-menu" className="bg-primary text-white px-8 py-4 rounded-full text-base font-medium inline-flex items-center gap-3 hover:bg-primary/90 transition-all duration-200 hover:shadow-lg">
              View Menu
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:absolute lg:top-[22%] lg:right-[-1%] relative flex items-center justify-center"
          >
            {/* Circular Food Image */}
            <div className="relative z-10">
              <CircularImage
                src={[
                  "/images/image1.jpeg",
                  "/images/image2.jpeg",
                  "/images/image3.jpeg",
                ]}
                alt="Premium food dish"
                size={420}
                delay={1}
                interval={2000}
              />

              {/* Floating Badge - Today's Offer */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: [0, -20, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.6 },
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
                className="absolute -top-2 right-0 sm:top-2 sm:-right-4 bg-white rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Today&apos;s Offer</p>
                  <p className="text-sm font-bold text-text-dark">
                    Free Delivery
                  </p>
                </div>
              </motion.div>

              {/* Floating Badge - Avg. Delivery */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: [0, 20, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.8 },
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
                className="absolute bottom-8 -left-4 sm:bottom-12 sm:left-0 bg-white rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Avg. Delivery</p>
                  <p className="text-sm font-bold text-text-dark">
                    22 Minutes
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
