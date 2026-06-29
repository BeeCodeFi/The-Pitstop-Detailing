"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import React from "react";
import {
  Sparkles,
  Shield,
  Droplets,
  Car,
  Paintbrush,
  Wrench,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

// ─── Car Types ───────────────────────────────────────────────────────────────

type CarTypeId = "hatchback" | "sedan" | "compact_suv" | "suv" | "luxury";

const carTypes: {
  id: CarTypeId;
  label: string;
  tagline: string;
  Svg: () => React.JSX.Element;
}[] = [
  {
    id: "hatchback",
    label: "Hatchback",
    tagline: "Compact city cars",
    Svg: HatchbackSvg,
  },
  {
    id: "sedan",
    label: "Sedan",
    tagline: "Classic 3-box cars",
    Svg: SedanSvg,
  },
  {
    id: "compact_suv",
    label: "Compact SUV",
    tagline: "Small crossovers",
    Svg: CompactSuvSvg,
  },
  {
    id: "suv",
    label: "SUV",
    tagline: "Full-size utility",
    Svg: SuvSvg,
  },
  {
    id: "luxury",
    label: "Luxury",
    tagline: "Premium & exotic",
    Svg: LuxurySvg,
  },
];

// ─── Car SVG Silhouettes ──────────────────────────────────────────────────────

function HatchbackSvg() {
  return (
    <svg
      viewBox="0 0 200 82"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* Body with window cutout */}
      <path
        fillRule="evenodd"
        d="M22,78 L22,60 Q26,40 52,29 L76,18 Q102,12 130,12 Q158,12 170,23 L178,38 L180,62 L180,78 Z
           M60,29 L80,18 Q108,11 130,11 Q157,11 168,22 L176,37 L108,37 Z"
      />
      <circle cx="52" cy="76" r="13" />
      <circle cx="152" cy="76" r="13" />
    </svg>
  );
}

function SedanSvg() {
  return (
    <svg
      viewBox="0 0 218 82"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* Body with window cutout (trunk has no window) */}
      <path
        fillRule="evenodd"
        d="M18,78 L18,63 L40,35 L66,20 Q97,12 138,12 Q167,12 184,25 L198,52 L200,65 L200,78 Z
           M44,35 L70,18 Q102,10 138,10 Q166,10 182,23 L194,46 L118,46 Z"
      />
      <circle cx="50" cy="76" r="13" />
      <circle cx="168" cy="76" r="13" />
    </svg>
  );
}

function CompactSuvSvg() {
  return (
    <svg
      viewBox="0 0 212 82"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* Taller body, more upright pillars */}
      <path
        fillRule="evenodd"
        d="M18,78 L18,52 L24,28 L50,16 Q82,8 124,8 Q160,8 176,20 L192,46 L195,60 L195,78 Z
           M28,28 L54,14 Q86,6 124,6 Q160,6 175,18 L189,42 L114,42 Z"
      />
      <circle cx="50" cy="76" r="13" />
      <circle cx="165" cy="76" r="13" />
    </svg>
  );
}

function SuvSvg() {
  return (
    <svg
      viewBox="0 0 224 82"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* Tall and boxy */}
      <path
        fillRule="evenodd"
        d="M18,78 L18,46 L20,22 L42,10 Q78,2 128,2 Q168,2 186,14 L204,40 L206,56 L206,78 Z
           M22,22 L46,8 Q82,0 128,0 Q168,0 185,12 L202,38 L116,38 Z"
      />
      <circle cx="50" cy="76" r="14" />
      <circle cx="174" cy="76" r="14" />
    </svg>
  );
}

function LuxurySvg() {
  return (
    <svg
      viewBox="0 0 238 82"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* Long, low, sleek fastback */}
      <path
        fillRule="evenodd"
        d="M18,78 L18,66 L55,42 L90,26 Q124,18 162,18 Q192,18 208,30 L220,54 L223,67 L223,78 Z
           M64,42 L98,24 Q132,16 162,16 Q192,16 207,28 L218,50 L148,50 Z"
      />
      <circle cx="55" cy="76" r="13" />
      <circle cx="190" cy="76" r="13" />
    </svg>
  );
}

// ─── Services with per-car-type pricing ─────────────────────────────────────

type PriceMap = Record<CarTypeId, string>;

const services: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  prices: PriceMap;
}[] = [
  {
    icon: Droplets,
    title: "Exterior Detailing",
    description:
      "Multi-stage paint correction, clay bar treatment, and hand polishing to restore your car's showroom finish.",
    color: "text-blue-400",
    prices: {
      hatchback: "₹1,999",
      sedan: "₹2,499",
      compact_suv: "₹2,999",
      suv: "₹3,499",
      luxury: "₹4,999",
    },
  },
  {
    icon: Sparkles,
    title: "Interior Detailing",
    description:
      "Deep vacuum, steam cleaning, leather conditioning, and odor elimination for a factory-fresh cabin.",
    color: "text-amber-400",
    prices: {
      hatchback: "₹1,499",
      sedan: "₹1,999",
      compact_suv: "₹2,499",
      suv: "₹2,999",
      luxury: "₹3,999",
    },
  },
  {
    icon: Shield,
    title: "Ceramic Coating",
    description:
      "9H nano-ceramic protection offering years of UV resistance, hydrophobic properties, and scratch defense.",
    color: "text-emerald-400",
    prices: {
      hatchback: "₹9,999",
      sedan: "₹12,999",
      compact_suv: "₹14,999",
      suv: "₹17,999",
      luxury: "₹24,999",
    },
  },
  {
    icon: Paintbrush,
    title: "Paint Protection Film",
    description:
      "Self-healing TPU film that shields your paint from rock chips, scratches, and environmental damage.",
    color: "text-purple-400",
    prices: {
      hatchback: "₹24,999",
      sedan: "₹29,999",
      compact_suv: "₹34,999",
      suv: "₹39,999",
      luxury: "₹54,999",
    },
  },
  {
    icon: Car,
    title: "Pickup & Delivery",
    description:
      "We pick up your vehicle from your doorstep and deliver it back looking pristine. Zero hassle for you.",
    color: "text-primary",
    prices: {
      hatchback: "Free",
      sedan: "Free",
      compact_suv: "Free",
      suv: "Free",
      luxury: "Free",
    },
  },
  {
    icon: Wrench,
    title: "Engine Bay Detailing",
    description:
      "Professional degreasing, steam cleaning, and dressing to make your engine bay look brand new.",
    color: "text-orange-400",
    prices: {
      hatchback: "₹1,499",
      sedan: "₹1,999",
      compact_suv: "₹2,499",
      suv: "₹2,999",
      luxury: "₹3,999",
    },
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Services() {
  const [selectedCar, setSelectedCar] = useState<CarTypeId>("sedan");
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <section className="py-16 sm:py-24 relative">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-primary tracking-[0.3em] uppercase">
            What We Do
          </span>
          <h2 className="mt-3 font-heading text-4xl sm:text-5xl md:text-6xl text-foreground">
            OUR SERVICES
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            From basic washes to complete transformations — tailored pricing for
            every vehicle type.
          </p>
        </motion.div>

        {/* ── Car type selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <p className="text-center text-xs font-semibold text-muted-foreground tracking-[0.25em] uppercase mb-6">
            Select Your Vehicle Type
          </p>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory justify-start sm:justify-center scrollbar-none">
            {carTypes.map((car) => {
              const isSelected = selectedCar === car.id;
              return (
                <button
                  key={car.id}
                  onClick={() => setSelectedCar(car.id)}
                  className={cn(
                    "flex-shrink-0 snap-center flex flex-col items-center gap-2 rounded-xl border p-3 sm:p-4 w-[130px] sm:w-[148px] transition-all duration-300 cursor-pointer group",
                    isSelected
                      ? "border-primary bg-primary/8 shadow-lg shadow-primary/15"
                      : "border-border bg-card hover:border-primary/40 hover:bg-card-hover"
                  )}
                >
                  {/* Car illustration */}
                  <div
                    className={cn(
                      "w-full transition-colors duration-300",
                      isSelected
                        ? "text-primary"
                        : "text-foreground/50 group-hover:text-foreground/70"
                    )}
                  >
                    <car.Svg />
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <p
                      className={cn(
                        "text-sm font-bold transition-colors duration-300",
                        isSelected ? "text-primary" : "text-foreground"
                      )}
                    >
                      {car.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {car.tagline}
                    </p>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="car-selected-dot"
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Service cards ── */}
        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="wait">
            {services.map((service) => (
              <motion.div key={service.title} variants={cardVariants}>
                <Card className="h-full group cursor-pointer flex flex-col">
                  <div
                    className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${service.color}`}
                  >
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {service.description}
                  </p>

                  {/* Price tag */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${service.title}-${selectedCar}`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "text-xl font-bold",
                          service.prices[selectedCar] === "Free"
                            ? "text-emerald-400"
                            : "text-primary"
                        )}
                      >
                        {service.prices[selectedCar]}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Check className="h-3 w-3 text-primary" />
                      {carTypes.find((c) => c.id === selectedCar)?.label}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
