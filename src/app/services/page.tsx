"use client";

import { motion } from "framer-motion";
import { Shield, Droplets, Sparkles, Paintbrush, Car, Wrench, Lightbulb, Wind } from "lucide-react";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui";
import Link from "next/link";

const categories = [
  {
    icon: Droplets,
    title: "Exterior Detailing",
    services: [
      { name: "Foam Wash & Dry", price: "₹499", duration: "45 min" },
      { name: "Clay Bar Treatment", price: "₹1,499", duration: "1.5 hr" },
      { name: "Single Stage Polish", price: "₹3,999", duration: "3 hr" },
      { name: "Multi-Stage Paint Correction", price: "₹7,999", duration: "6 hr" },
    ],
  },
  {
    icon: Sparkles,
    title: "Interior Detailing",
    services: [
      { name: "Basic Interior Clean", price: "₹999", duration: "1 hr" },
      { name: "Deep Interior Detail", price: "₹2,999", duration: "3 hr" },
      { name: "Leather Treatment & Conditioning", price: "₹1,999", duration: "2 hr" },
      { name: "Full Interior Restoration", price: "₹5,999", duration: "5 hr" },
    ],
  },
  {
    icon: Shield,
    title: "Ceramic Coating",
    services: [
      { name: "Graphene Spray Coating (6 months)", price: "₹4,999", duration: "4 hr" },
      { name: "9H Ceramic Coating (2 years)", price: "₹14,999", duration: "8 hr" },
      { name: "9H Pro Ceramic (5 years)", price: "₹24,999", duration: "2 days" },
      { name: "Multi-Layer Ceramic (7 years)", price: "₹39,999", duration: "3 days" },
    ],
  },
  {
    icon: Paintbrush,
    title: "Paint Protection Film",
    services: [
      { name: "High Impact Areas (Front)", price: "₹29,999", duration: "1 day" },
      { name: "Half Body PPF", price: "₹59,999", duration: "2 days" },
      { name: "Full Body PPF (Glossy)", price: "₹99,999", duration: "3 days" },
      { name: "Full Body PPF (Matte)", price: "₹1,19,999", duration: "3 days" },
    ],
  },
  {
    icon: Wrench,
    title: "Engine & Mechanical",
    services: [
      { name: "Engine Bay Degrease & Detail", price: "₹1,999", duration: "1.5 hr" },
      { name: "Underbody Anti-Rust Coating", price: "₹3,999", duration: "3 hr" },
      { name: "AC Vent Sanitization", price: "₹799", duration: "30 min" },
    ],
  },
  {
    icon: Lightbulb,
    title: "Headlight & Glass",
    services: [
      { name: "Headlight Restoration", price: "₹1,499", duration: "1 hr" },
      { name: "Windshield Ceramic Coat", price: "₹1,999", duration: "1 hr" },
      { name: "Full Glass Treatment", price: "₹2,999", duration: "2 hr" },
    ],
  },
  {
    icon: Wind,
    title: "Odor & Sanitization",
    services: [
      { name: "Ozone Treatment", price: "₹1,499", duration: "1 hr" },
      { name: "Full Cabin Sanitization", price: "₹999", duration: "45 min" },
      { name: "Smoke & Pet Odor Removal", price: "₹2,499", duration: "2 hr" },
    ],
  },
  {
    icon: Car,
    title: "Pickup & Delivery",
    services: [
      { name: "Vehicle Pickup (within 10 km)", price: "FREE*", duration: "—" },
      { name: "Vehicle Pickup (10-25 km)", price: "₹499", duration: "—" },
      { name: "Priority Same-Day Pickup", price: "₹999", duration: "—" },
    ],
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
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-primary tracking-[0.3em] uppercase">
            Complete Service Menu
          </span>
          <h1 className="mt-3 font-heading text-5xl sm:text-6xl md:text-7xl text-foreground">
            OUR SERVICES
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Professional-grade products, trained technicians, and meticulous
            attention to detail. Every service backed by our satisfaction guarantee.
          </p>
        </motion.div>

        {/* Service categories */}
        <div className="space-y-12">
          {categories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
            >
              <Card hover={false} className="p-0 overflow-hidden">
                {/* Category header */}
                <div className="flex items-center gap-4 p-6 border-b border-border bg-muted/30">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    {category.title}
                  </h2>
                </div>

                {/* Services list */}
                <div className="divide-y divide-border">
                  {category.services.map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {service.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Duration: {service.duration}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {service.price}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-sm text-muted-foreground mb-4">
            * Prices may vary based on vehicle size and condition. Free pickup on orders above ₹5,000.
          </p>
          <Link href="/booking">
            <Button size="xl">Book Your Service Now</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
