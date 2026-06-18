"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";

const galleryItems = [
  {
    id: 1,
    title: "Ceramic Coating — BMW M4",
    category: "ceramic",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Full Detail — Mercedes AMG",
    category: "exterior",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Interior Restoration — Audi RS7",
    category: "interior",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "PPF Installation — Porsche 911",
    category: "ppf",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Paint Correction — Tesla Model S",
    category: "exterior",
    image: "https://images.unsplash.com/photo-1580274455191-1c62238ce452?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Engine Bay Detail — Range Rover",
    category: "engine",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop",
  },
];

export function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-primary tracking-[0.3em] uppercase">
            Our Work
          </span>
          <h2 className="mt-3 font-heading text-4xl sm:text-5xl md:text-6xl text-foreground">
            GALLERY
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Every vehicle tells a story. Here are some of our recent
            transformations that speak for themselves.
          </p>
        </motion.div>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative aspect-[3/2] rounded-xl overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                  hoveredId === item.id ? "opacity-100" : "opacity-0"
                }`}
              />
              {/* Title */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 ${
                  hoveredId === item.id
                    ? "translate-y-0"
                    : "translate-y-full"
                }`}
              >
                <p className="text-sm font-semibold text-white">
                  {item.title}
                </p>
                <span className="text-xs text-primary capitalize">
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
