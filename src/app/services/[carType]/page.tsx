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

// ─── Car type data ────────────────────────────────────────────────────────────

const CAR_TYPES = {
  hatchback: {
    label: "Hatchback",
    model: "Maruti Swift",
    tagline: "Swift · i20 · Polo & similar",
    multiplier: 0.8,
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1400&q=80&auto=format&fit=crop",
  },
  sedan: {
    label: "Sedan",
    model: "Hyundai Verna",
    tagline: "Verna · City · Ciaz & similar",
    multiplier: 1.0,
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80&auto=format&fit=crop",
  },
  compact_suv: {
    label: "Compact SUV",
    model: "Hyundai Creta",
    tagline: "Creta · Seltos · Brezza & similar",
    multiplier: 1.2,
    image:
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1400&q=80&auto=format&fit=crop",
  },
  suv: {
    label: "SUV",
    model: "Toyota Fortuner",
    tagline: "Fortuner · Endeavour · MU-X & similar",
    multiplier: 1.4,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1400&q=80&auto=format&fit=crop",
  },
  luxury: {
    label: "Luxury",
    model: "BMW",
    tagline: "BMW · Mercedes · Audi · Porsche & similar",
    multiplier: 1.8,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1400&q=80&auto=format&fit=crop",
  },
} as const;

type CarTypeId = keyof typeof CAR_TYPES;

// ─── Price helper ─────────────────────────────────────────────────────────────

function applyMultiplier(price: string, multiplier: number): string {
  if (price === "FREE*" || price === "—") return price;
  if (!price.startsWith("₹")) return price;
  const num = parseInt(price.replace("₹", "").replace(/,/g, ""), 10);
  if (isNaN(num)) return price;
  const result = Math.round((num * multiplier) / 100) * 100;
  return "₹" + result.toLocaleString("en-IN");
}

// ─── Service categories (base prices = Sedan 1×) ─────────────────────────────

const CATEGORIES = [
  {
    icon: Droplets,
    title: "Exterior Detailing",
    services: [
      { name: "Foam Wash & Dry", price: "₹499", duration: "45 min" },
      { name: "Clay Bar Treatment", price: "₹1,499", duration: "1.5 hr" },
      { name: "Single Stage Polish", price: "₹3,999", duration: "3 hr" },
      {
        name: "Multi-Stage Paint Correction",
        price: "₹7,999",
        duration: "6 hr",
      },
    ],
  },
  {
    icon: Sparkles,
    title: "Interior Detailing",
    services: [
      { name: "Basic Interior Clean", price: "₹999", duration: "1 hr" },
      { name: "Deep Interior Detail", price: "₹2,999", duration: "3 hr" },
      {
        name: "Leather Treatment & Conditioning",
        price: "₹1,999",
        duration: "2 hr",
      },
      {
        name: "Full Interior Restoration",
        price: "₹5,999",
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
        price: "₹4,999",
        duration: "4 hr",
      },
      {
        name: "9H Ceramic Coating (2 years)",
        price: "₹14,999",
        duration: "8 hr",
      },
      {
        name: "9H Pro Ceramic (5 years)",
        price: "₹24,999",
        duration: "2 days",
      },
      {
        name: "Multi-Layer Ceramic (7 years)",
        price: "₹39,999",
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
        price: "₹29,999",
        duration: "1 day",
      },
      { name: "Half Body PPF", price: "₹59,999", duration: "2 days" },
      {
        name: "Full Body PPF (Glossy)",
        price: "₹99,999",
        duration: "3 days",
      },
      {
        name: "Full Body PPF (Matte)",
        price: "₹1,19,999",
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
        price: "₹1,999",
        duration: "1.5 hr",
      },
      {
        name: "Underbody Anti-Rust Coating",
        price: "₹3,999",
        duration: "3 hr",
      },
      { name: "AC Vent Sanitization", price: "₹799", duration: "30 min" },
    ],
  },
  {
    icon: Lightbulb,
    title: "Headlight & Glass",
    services: [
      {
        name: "Headlight Restoration",
        price: "₹1,499",
        duration: "1 hr",
      },
      {
        name: "Windshield Ceramic Coat",
        price: "₹1,999",
        duration: "1 hr",
      },
      {
        name: "Full Glass Treatment",
        price: "₹2,999",
        duration: "2 hr",
      },
    ],
  },
  {
    icon: Wind,
    title: "Odor & Sanitization",
    services: [
      { name: "Ozone Treatment", price: "₹1,499", duration: "1 hr" },
      {
        name: "Full Cabin Sanitization",
        price: "₹999",
        duration: "45 min",
      },
      {
        name: "Smoke & Pet Odor Removal",
        price: "₹2,499",
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
        duration: "—",
      },
      {
        name: "Vehicle Pickup (10-25 km)",
        price: "₹499",
        duration: "—",
      },
      {
        name: "Priority Same-Day Pickup",
        price: "₹999",
        duration: "—",
      },
    ],
  },
];

// ─── Page component ───────────────────────────────────────────────────────────

export default function CarServicePage() {
  const params = useParams();
  const carTypeId = params.carType as string;
  const car = CAR_TYPES[carTypeId as CarTypeId];

  if (!car) {
    notFound();
  }

  const { multiplier, model, label, tagline, image } = car;

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
          <h1 className="font-heading text-4xl sm:text-5xl text-white">
            {model}
          </h1>
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
                          {service.duration !== "—" && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" />
                              {service.duration}
                            </p>
                          )}
                        </div>
                        <span
                          className={
                            "text-sm font-bold shrink-0 ml-4 " +
                            (isFree ? "text-emerald-400" : "text-primary")
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
            * Prices are approximate. Free pickup on orders above ₹5,000.
          </p>
          <Link href="/booking">
            <Button size="xl">{"Book For " + model}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
