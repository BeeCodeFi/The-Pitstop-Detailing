"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Shield,
  Droplets,
  Sparkles,
  Paintbrush,
  Car,
  Wrench,
  Lightbulb,
  Wind,
} from "lucide-react";
import { useParams, notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui";

// ─── Car type data ────────────────────────────────────────────────────────────────────────────────

const CAR_TYPES = {
  hatchback: {
    label: "Hatchback",
    model: "Maruti Swift",
    tagline: "Swift · i20 · Polo & similar",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1400&q=80&auto=format&fit=crop",
  },
  sedan: {
    label: "Sedan",
    model: "Hyundai Verna",
    tagline: "Verna · City · Ciaz & similar",
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1400&q=80&auto=format&fit=crop",
  },
  compact_suv: {
    label: "Compact SUV",
    model: "Hyundai Creta",
    tagline: "Creta · Seltos · Brezza & similar",
    image:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1400&q=80&auto=format&fit=crop",
  },
  suv: {
    label: "SUV",
    model: "Toyota Fortuner",
    tagline: "Fortuner · Endeavour · MU-X & similar",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1400&q=80&auto=format&fit=crop",
  },
  luxury: {
    label: "Luxury",
    model: "BMW",
    tagline: "BMW · Mercedes · Audi · Porsche & similar",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1400&q=80&auto=format&fit=crop",
  },
} as const;

type CarTypeId = keyof typeof CAR_TYPES;

// ─── Price helper ────────────────────────────────────────────────────────────────────────────────────

function formatPrice(amount: number | null): string {
  if (amount === null) return "N/A";
  return "₹" + amount.toLocaleString("en-IN");
}

// ─── Price map type ─────────────────────────────────────────────────────────────────────────────────

type PriceMap = Record<CarTypeId, number | null>;

// ─── Service categories (prices from official rate chart) ───────────────────────────────

const CATEGORIES = [
  {
    icon: Droplets,
    title: "Wash",
    services: [
      {
        name: "Foam Wash",
        prices: { hatchback: 350, sedan: 400, compact_suv: 400, suv: 500, luxury: 500 } as PriceMap,
        duration: "30 min",
      },
    ],
  },
  {
    icon: Sparkles,
    title: "Exterior",
    services: [
      {
        name: "Exterior Detailing",
        prices: { hatchback: 1500, sedan: 1500, compact_suv: 2000, suv: 2000, luxury: 3000 } as PriceMap,
        duration: "2 hr",
      },
      {
        name: "Iron Fallout Removal",
        prices: { hatchback: 999, sedan: 1199, compact_suv: 1499, suv: 1699, luxury: 1999 } as PriceMap,
        duration: "1 hr",
      },
      {
        name: "Tar Removal",
        prices: { hatchback: 999, sedan: 1199, compact_suv: 1499, suv: 1699, luxury: 1999 } as PriceMap,
        duration: "1 hr",
      },
      {
        name: "Water Spot Removal",
        prices: { hatchback: 1499, sedan: 1799, compact_suv: 1999, suv: 2299, luxury: 2999 } as PriceMap,
        duration: "1 hr",
      },
      {
        name: "Trim Restoration",
        prices: { hatchback: 999, sedan: 1199, compact_suv: 1499, suv: 1699, luxury: 1999 } as PriceMap,
        duration: "1 hr",
      },
    ],
  },
  {
    icon: Paintbrush,
    title: "Paint Correction",
    services: [
      {
        name: "Rubbing & Polishing",
        prices: { hatchback: 1500, sedan: 1500, compact_suv: 2000, suv: 2000, luxury: 4000 } as PriceMap,
        duration: "3 hr",
      },
    ],
  },
  {
    icon: Wind,
    title: "Interior",
    services: [
      {
        name: "Interior Detailing",
        prices: { hatchback: 1500, sedan: 1500, compact_suv: 2000, suv: 2000, luxury: 3500 } as PriceMap,
        duration: "2 hr",
      },
      {
        name: "Leather Coating",
        prices: { hatchback: 2999, sedan: 3499, compact_suv: 3999, suv: 4499, luxury: 5999 } as PriceMap,
        duration: "2 hr",
      },
      {
        name: "Steam Cleaning",
        prices: { hatchback: 500, sedan: 700, compact_suv: 700, suv: 1000, luxury: 1500 } as PriceMap,
        duration: "1 hr",
      },
      {
        name: "AC Vent Sanitization",
        prices: { hatchback: 799, sedan: 999, compact_suv: 1199, suv: 1399, luxury: 1799 } as PriceMap,
        duration: "30 min",
      },
      {
        name: "Odor Removal",
        prices: { hatchback: 999, sedan: 1199, compact_suv: 1499, suv: 1699, luxury: 1999 } as PriceMap,
        duration: "1 hr",
      },
    ],
  },
  {
    icon: Shield,
    title: "Ceramic & Graphene",
    services: [
      {
        name: "Ceramic Coating 9H (1 Year)",
        prices: { hatchback: 12499, sedan: 14999, compact_suv: 17499, suv: 19999, luxury: 24999 } as PriceMap,
        duration: "8 hr",
      },
      {
        name: "Ceramic Coating 10H (2 Year)",
        prices: { hatchback: 16499, sedan: 18999, compact_suv: 21499, suv: 23999, luxury: 29999 } as PriceMap,
        duration: "8 hr",
      },
      {
        name: "Graphene Coating",
        prices: { hatchback: 22499, sedan: 24999, compact_suv: 28499, suv: 32999, luxury: 35999 } as PriceMap,
        duration: "2 days",
      },
    ],
  },
  {
    icon: Car,
    title: "Paint Protection Film",
    services: [
      {
        name: "PPF Full Body (5 Year)",
        prices: { hatchback: 60000, sedan: 70000, compact_suv: 70000, suv: 80000, luxury: 90000 } as PriceMap,
        duration: "3 days",
      },
      {
        name: "PPF Full Body (10 Year)",
        prices: { hatchback: 80000, sedan: 90000, compact_suv: 90000, suv: 100000, luxury: 100000 } as PriceMap,
        duration: "3 days",
      },
      {
        name: "Matt PPF (5 Year)",
        prices: { hatchback: 65000, sedan: 75000, compact_suv: 75000, suv: 85000, luxury: 95000 } as PriceMap,
        duration: "3 days",
      },
    ],
  },
  {
    icon: Wrench,
    title: "Engine & Underbody",
    services: [
      {
        name: "Underbody Coating",
        prices: { hatchback: 2000, sedan: 2000, compact_suv: 2000, suv: 2000, luxury: null } as PriceMap,
        duration: "3 hr",
      },
    ],
  },
  {
    icon: Lightbulb,
    title: "Glass",
    services: [
      {
        name: "Glass Coating",
        prices: { hatchback: 1000, sedan: 1000, compact_suv: 1000, suv: 1000, luxury: 1000 } as PriceMap,
        duration: "2 hr",
      },
    ],
  },
  {
    icon: Sparkles,
    title: "Lighting",
    services: [
      {
        name: "Headlight Restoration",
        prices: { hatchback: 799, sedan: 999, compact_suv: 1199, suv: 1399, luxury: 1799 } as PriceMap,
        duration: "1 hr",
      },
    ],
  },
  {
    icon: Car,
    title: "Wheel & Tire",
    services: [
      {
        name: "Alloy Wheel Coating",
        prices: { hatchback: 399, sedan: 499, compact_suv: 599, suv: 699, luxury: 899 } as PriceMap,
        duration: "2 hr",
      },
    ],
  },
];

// ─── Page component ────────────────────────────────────────────────────────────────────────────────────

export default function CarServicePage() {
  const params = useParams();
  const carTypeId = params.carType as string;
  const car = CAR_TYPES[carTypeId as CarTypeId];

  if (!car) {
    notFound();
  }

  const { model, label, tagline, image } = car;

  return (
    <div className="pb-24">
      {/* ── Hero ── */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src={image}
          alt={model}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-8 pb-8 max-w-7xl mx-auto w-full">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-medium mb-4 w-fit transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Vehicle Types
          </Link>
          <span className="px-2.5 py-1 rounded-full bg-primary text-white text-xs font-bold w-fit mb-2">
            {label}
          </span>

          <p className="text-sm text-white/70 mt-1">{tagline}</p>
        </div>
      </div>

      {/* ── Services ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="space-y-5">
          {CATEGORIES.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
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

                {/* Service rows */}
                <div className="divide-y divide-border">
                  {category.services.map((service) => {
                    const price = service.prices[carTypeId as CarTypeId];
                    const displayPrice = formatPrice(price);
                    const isNA = price === null;
                    return (
                      <div
                        key={service.name}
                        className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {service.name}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                          </p>
                        </div>
                        <span
                          className={
                            "text-sm font-bold shrink-0 ml-4 " +
                            (isNA ? "text-muted-foreground" : "text-primary")
                          }
                        >
                          {displayPrice}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="text-sm text-muted-foreground mb-4">
            * Prices are indicative. Free pickup on orders above ₹5,000.
          </p>
          <Link href="/booking">
            <Button size="xl">Book Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
