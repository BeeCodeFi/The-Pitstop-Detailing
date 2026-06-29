"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import {
  Shield,
  Droplets,
  Sparkles,
  Paintbrush,
  Car,
  Wrench,
  Lightbulb,
  Wind,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui";
import Link from "next/link";
import { cn } from "@/lib/utils";

// â”€â”€â”€ Car Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type CarTypeId = "hatchback" | "sedan" | "compact_suv" | "suv" | "luxury";

const carTypes: {
  id: CarTypeId;
  label: string;
  tagline: string;
  image: string;
}[] = [
  {
    id: "hatchback",
    label: "Hatchback",
    tagline: "Swift Â· i20 Â· Polo",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=480&q=80&auto=format&fit=crop",
  },
  {
    id: "sedan",
    label: "Sedan",
    tagline: "City Â· Verna Â· Ciaz",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=480&q=80&auto=format&fit=crop",
  },
  {
    id: "compact_suv",
    label: "Compact SUV",
    tagline: "Creta Â· Seltos Â· Brezza",
    image:
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=480&q=80&auto=format&fit=crop",
  },
  {
    id: "suv",
    label: "SUV",
    tagline: "Fortuner Â· Endeavour Â· Kodiaq",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=480&q=80&auto=format&fit=crop",
  },
  {
    id: "luxury",
    label: "Luxury",
    tagline: "BMW Â· Merc Â· Audi Â· Porsche",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=480&q=80&auto=format&fit=crop",
  },
];

// â”€â”€â”€ Pricing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const carMultipliers: Record<CarTypeId, number> = {
  hatchback: 0.8,
  sedan: 1.0,
  compact_suv: 1.2,
  suv: 1.4,
  luxury: 1.8,
};

/** Apply car-type multiplier to a price string like "â‚¹1,499". */
function applyMultiplier(price: string, multiplier: number): string {
  if (price === "FREE*" || price === "â€”") return price;
  if (!price.startsWith("â‚¹")) return price;
  const num = parseInt(price.replace("â‚¹", "").replace(/,/g, ""), 10);
  if (isNaN(num)) return price;
  const result = Math.round((num * multiplier) / 100) * 100;
  return "â‚¹" + result.toLocaleString("en-IN");
}

// â”€â”€â”€ Service Categories (base prices = sedan) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const categories = [
  {
    icon: Droplets,
    title: "Exterior Detailing",
    services: [
      { name: "Foam Wash & Dry", price: "â‚¹499", duration: "45 min" },
      { name: "Clay Bar Treatment", price: "â‚¹1,499", duration: "1.5 hr" },
      { name: "Single Stage Polish", price: "â‚¹3,999", duration: "3 hr" },
      {
        name: "Multi-Stage Paint Correction",
        price: "â‚¹7,999",
        duration: "6 hr",
      },
    ],
  },
  {
    icon: Sparkles,
    title: "Interior Detailing",
    services: [
      { name: "Basic Interior Clean", price: "â‚¹999", duration: "1 hr" },
      { name: "Deep Interior Detail", price: "â‚¹2,999", duration: "3 hr" },
      {
        name: "Leather Treatment & Conditioning",
        price: "â‚¹1,999",
        duration: "2 hr",
      },
      {
        name: "Full Interior Restoration",
        price: "â‚¹5,999",
        duration: "5 hr",
      },
    ],
  },
  {
    icon: Shield,
    title: "Ceramic Coating",
    services: [
      {
        name: "Graphene Spray Coating (6 months)",
        price: "â‚¹4,999",
        duration: "4 hr",
      },
      {
        name: "9H Ceramic Coating (2 years)",
        price: "â‚¹14,999",
        duration: "8 hr",
      },
      {
        name: "9H Pro Ceramic (5 years)",
        price: "â‚¹24,999",
        duration: "2 days",
      },
      {
        name: "Multi-Layer Ceramic (7 years)",
        price: "â‚¹39,999",
        duration: "3 days",
      },
    ],
  },
  {
    icon: Paintbrush,
    title: "Paint Protection Film",
    services: [
      {
        name: "High Impact Areas (Front)",
        price: "â‚¹29,999",
        duration: "1 day",
      },
      { name: "Half Body PPF", price: "â‚¹59,999", duration: "2 days" },
      {
        name: "Full Body PPF (Glossy)",
        price: "â‚¹99,999",
        duration: "3 days",
      },
      {
        name: "Full Body PPF (Matte)",
        price: "â‚¹1,19,999",
        duration: "3 days",
      },
    ],
  },
  {
    icon: Wrench,
    title: "Engine & Mechanical",
    services: [
      {
        name: "Engine Bay Degrease & Detail",
        price: "â‚¹1,999",
        duration: "1.5 hr",
      },
      {
        name: "Underbody Anti-Rust Coating",
        price: "â‚¹3,999",
        duration: "3 hr",
      },
      { name: "AC Vent Sanitization", price: "â‚¹799", duration: "30 min" },
    ],
  },
  {
    icon: Lightbulb,
    title: "Headlight & Glass",
    services: [
      { name: "Headlight Restoration", price: "â‚¹1,499", duration: "1 hr" },
      {
        name: "Windshield Ceramic Coat",
        price: "â‚¹1,999",
        duration: "1 hr",
      },
      { name: "Full Glass Treatment", price: "â‚¹2,999", duration: "2 hr" },
    ],
  },
  {
    icon: Wind,
    title: "Odor & Sanitization",
    services: [
      { name: "Ozone Treatment", price: "â‚¹1,499", duration: "1 hr" },
      {
        name: "Full Cabin Sanitization",
        price: "â‚¹999",
        duration: "45 min",
      },
      {
        name: "Smoke & Pet Odor Removal",
        price: "â‚¹2,499",
        duration: "2 hr",
      },
    ],
  },
  {
    icon: Car,
    title: "Pickup & Delivery",
    services: [
      {
        name: "Vehicle Pickup (within 10 km)",
        price: "FREE*",
        duration: "â€”",
      },
      { name: "Vehicle Pickup (10-25 km)", price: "â‚¹499", duration: "â€”" },
      { name: "Priority Same-Day Pickup", price: "â‚¹999", duration: "â€”" },
    ],
  },
];

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ServicesPage() {
  const [selectedCar, setSelectedCar] = useState<CarTypeId>("sedan");
  const multiplier = carMultipliers[selectedCar];
  const selectedLabel = carTypes.find((c) => c.id === selectedCar)!.label;

  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* â”€â”€ Header â”€â”€ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-primary tracking-[0.3em] uppercase">
            Complete Service Menu
          </span>
          <h1 className="mt-3 font-heading text-5xl sm:text-6xl md:text-7xl text-foreground">
            OUR SERVICES
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Professional-grade products, trained technicians, and meticulous
            attention to detail. Select your vehicle type below to see tailored
            pricing.
          </p>
        </motion.div>

        {/* â”€â”€ Car Type Selector â”€â”€ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-14"
        >
          <p className="text-center text-xs font-semibold text-muted-foreground tracking-[0.25em] uppercase mb-6">
            Select Your Vehicle Type
          </p>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 snap-x snap-mandatory justify-start sm:justify-center scrollbar-none">
            {carTypes.map((car) => {
              const isSelected = selectedCar === car.id;
              return (
                <button
                  key={car.id}
                  onClick={() => setSelectedCar(car.id)}
                  className={cn(
                    "flex-shrink-0 snap-center rounded-xl border overflow-hidden w-[150px] sm:w-[172px] transition-all duration-300 cursor-pointer group text-left",
                    isSelected
                      ? "border-primary shadow-lg shadow-primary/20 scale-[1.03]"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  {/* Car image */}
                  <div className="relative w-full aspect-video bg-muted overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.label}
                      fill
                      className={cn(
                        "object-cover transition-all duration-500",
                        isSelected
                          ? "brightness-100 scale-105"
                          : "brightness-60 group-hover:brightness-80"
                      )}
                      sizes="(max-width: 640px) 150px, 172px"
                    />
                    {/* Red overlay glow on selected */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/15 pointer-events-none" />
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={cn(
                      "px-3 py-2.5 transition-colors duration-300",
                      isSelected ? "bg-primary/8" : "bg-card"
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm font-bold leading-tight",
                        isSelected ? "text-primary" : "text-foreground"
                      )}
                    >
                      {car.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      {car.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected car badge */}
          <div className="flex justify-center mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCar}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-semibold"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Showing prices for: {selectedLabel}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* â”€â”€ Service Categories â”€â”€ */}
        <div className="space-y-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
            >
              <Card hover={false} className="p-0 overflow-hidden">
                {/* Category header */}
                <div className="flex items-center gap-4 p-5 border-b border-border bg-muted/30">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">
                    {category.title}
                  </h2>
                </div>

                {/* Services list */}
                <div className="divide-y divide-border">
                  {category.services.map((service) => {
                    const displayPrice = applyMultiplier(
                      service.price,
                      multiplier
                    );
                    const isFree = displayPrice === "FREE*";
                    return (
                      <div
                        key={service.name}
                        className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {service.name}
                          </p>
                          {service.duration !== "â€”" && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" />
                              {service.duration}
                            </p>
                          )}
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${service.name}-${selectedCar}`}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.18 }}
                            className={cn(
                              "text-sm font-bold shrink-0 ml-4",
                              isFree ? "text-emerald-400" : "text-primary"
                            )}
                          >
                            {displayPrice}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* â”€â”€ CTA â”€â”€ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-sm text-muted-foreground mb-4">
            * Prices may vary based on vehicle condition. Free pickup on orders
            above â‚¹5,000.
          </p>
          <Link href="/booking">
            <Button size="xl">Book Your Service Now</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
