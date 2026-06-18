"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const categories = ["All", "Exterior", "Interior", "Ceramic", "PPF", "Before/After"];

const items = [
  { id: 1, title: "BMW M4 — Ceramic Coating", category: "Ceramic", image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop" },
  { id: 2, title: "Mercedes AMG GT — Full Detail", category: "Exterior", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop" },
  { id: 3, title: "Audi RS7 — Interior Restore", category: "Interior", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop" },
  { id: 4, title: "Porsche 911 — PPF Full Body", category: "PPF", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop" },
  { id: 5, title: "Tesla Model S — Paint Correction", category: "Before/After", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop" },
  { id: 6, title: "Range Rover — Engine Bay", category: "Exterior", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop" },
  { id: 7, title: "Lamborghini Huracan — Ceramic", category: "Ceramic", image: "https://images.unsplash.com/photo-1525609004556-c46c90e6df01?w=800&h=600&fit=crop" },
  { id: 8, title: "Rolls Royce — Interior Detail", category: "Interior", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop" },
  { id: 9, title: "Ferrari 488 — PPF Install", category: "PPF", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<typeof items[0] | null>(null);

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-primary tracking-[0.3em] uppercase">
            Our Portfolio
          </span>
          <h1 className="mt-3 font-heading text-5xl sm:text-6xl md:text-7xl text-foreground">
            GALLERY
          </h1>
        </motion.div>

        {/* Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setLightbox(item)}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end">
                <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <span className="text-xs text-primary">{item.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative max-w-4xl w-full aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src={lightbox.image}
              alt={lightbox.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute bottom-8 text-center">
            <p className="text-lg font-bold text-white">{lightbox.title}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
