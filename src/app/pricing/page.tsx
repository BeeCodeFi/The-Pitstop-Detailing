"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { cn } from "@/lib/utils";

const packages = [
  {
    name: "Essential",
    tagline: "Perfect for regular maintenance",
    prices: { sedan: "₹2,499", suv: "₹3,499" },
    features: [
      "Foam wash & hand dry",
      "Interior vacuum & wipe",
      "Tyre & trim dressing",
      "Dashboard polish",
      "Air freshener",
    ],
    popular: false,
  },
  {
    name: "Premium",
    tagline: "Our most popular package",
    prices: { sedan: "₹5,999", suv: "₹7,999" },
    features: [
      "Everything in Essential",
      "Clay bar paint decontamination",
      "Single-stage machine polish",
      "Leather cleaning & conditioning",
      "Engine bay rinse",
      "Glass treatment",
      "Free pickup & delivery",
    ],
    popular: true,
  },
  {
    name: "Ultimate",
    tagline: "Complete transformation",
    prices: { sedan: "₹11,999", suv: "₹15,999" },
    features: [
      "Everything in Premium",
      "Multi-stage paint correction",
      "6-month graphene spray coat",
      "Interior steam sanitization",
      "Headlight restoration",
      "Underbody wash",
      "Engine bay detail & dress",
      "Priority scheduling",
      "Free pickup & delivery",
    ],
    popular: false,
  },
];

const addOns = [
  { name: "Ceramic Coating (2-Year)", price: "₹14,999+" },
  { name: "PPF — Front Bumper", price: "₹12,999" },
  { name: "Windshield Ceramic Coat", price: "₹1,999" },
  { name: "Seat Shampooing", price: "₹1,499" },
  { name: "Odor Removal (Ozone)", price: "₹1,499" },
  { name: "Headlight Restoration", price: "₹1,499" },
];

export default function PricingPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-xs font-semibold text-primary tracking-[0.3em] uppercase">
            Simple & Transparent
          </span>
          <h1 className="mt-3 font-heading text-5xl sm:text-6xl md:text-7xl text-foreground">
            PRICING
          </h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Choose from our curated packages or build your own custom service. No
            hidden fees, ever.
          </p>
        </motion.div>

        {/* Packages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-14 sm:mb-20">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={cn(
                "relative rounded-2xl border p-6 sm:p-8 flex flex-col",
                pkg.popular
                  ? "border-primary bg-gradient-to-b from-primary/5 to-card shadow-xl shadow-primary/10"
                  : "border-border bg-card"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-bold flex items-center gap-1">
                  <Star className="h-3 w-3 fill-white" /> Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-heading text-2xl text-foreground">
                  {pkg.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {pkg.tagline}
                </p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {pkg.prices.sedan}
                  </span>
                  <span className="text-xs text-muted-foreground">/ sedan</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  SUV/Luxury: {pkg.prices.suv}
                </p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/booking">
                <Button
                  variant={pkg.popular ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  Book {pkg.name}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl text-foreground text-center mb-8">
            ADD-ONS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <span className="text-sm text-foreground">{addon.name}</span>
                <span className="text-sm font-bold text-primary">
                  {addon.price}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
