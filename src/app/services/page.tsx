"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const carTypes = [
  {
    id: "hatchback",
    label: "Hatchback",
    model: "Maruti Swift",
    tagline: "Swift · i20 · Polo & similar",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=700&q=80&auto=format&fit=crop",
  },
  {
    id: "sedan",
    label: "Sedan",
    model: "Hyundai Verna",
    tagline: "Verna · City · Ciaz & similar",
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=700&q=80&auto=format&fit=crop",
  },
  {
    id: "compact_suv",
    label: "Compact SUV",
    model: "Hyundai Creta",
    tagline: "Creta · Seltos · Brezza & similar",
    image:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=700&q=80&auto=format&fit=crop",
  },
  {
    id: "suv",
    label: "SUV",
    model: "Toyota Fortuner",
    tagline: "Fortuner · Endeavour · MU-X & similar",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=700&q=80&auto=format&fit=crop",
  },
  {
    id: "luxury",
    label: "Luxury",
    model: "BMW",
    tagline: "BMW · Mercedes · Audi · Porsche & similar",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=700&q=80&auto=format&fit=crop",
  },
];

export default function ServicesPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold text-primary tracking-[0.3em] uppercase">
            Tailored For Your Car
          </span>
          <h1 className="mt-3 font-heading text-5xl sm:text-6xl md:text-7xl text-foreground">
            OUR SERVICES
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Select your vehicle type below to see services and pricing tailored
            specifically for your car.
          </p>
        </motion.div>

        {/* Car type grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6">
          {carTypes.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link href={"/services/" + car.id} className="group block">
                <div className="relative overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-xl transition-shadow duration-300">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.model}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Type badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-white text-xs font-bold">
                      {car.label}
                    </span>

                    {/* Hover arrow */}
                    <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-foreground text-base">
                      {car.model}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {car.tagline}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-primary">
                      View Services & Pricing →
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
