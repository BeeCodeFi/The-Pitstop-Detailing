"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Sparkles,
  Shield,
  Droplets,
  Car,
  Paintbrush,
  Wrench,
} from "lucide-react";
import { Card } from "@/components/ui";

const services = [
  {
    icon: Droplets,
    title: "Exterior Detailing",
    description:
      "Multi-stage paint correction, clay bar treatment, and hand polishing to restore your car's showroom finish.",
    color: "text-blue-400",
  },
  {
    icon: Sparkles,
    title: "Interior Detailing",
    description:
      "Deep vacuum, steam cleaning, leather conditioning, and odor elimination for a factory-fresh cabin.",
    color: "text-amber-400",
  },
  {
    icon: Shield,
    title: "Ceramic Coating",
    description:
      "9H nano-ceramic protection offering years of UV resistance, hydrophobic properties, and scratch defense.",
    color: "text-emerald-400",
  },
  {
    icon: Paintbrush,
    title: "Paint Protection Film",
    description:
      "Self-healing TPU film that shields your paint from rock chips, scratches, and environmental damage.",
    color: "text-purple-400",
  },
  {
    icon: Car,
    title: "Pickup & Delivery",
    description:
      "We pick up your vehicle from your doorstep and deliver it back looking pristine. Zero hassle for you.",
    color: "text-primary",
  },
  {
    icon: Wrench,
    title: "Engine Bay Detailing",
    description:
      "Professional degreasing, steam cleaning, and dressing to make your engine bay look brand new.",
    color: "text-orange-400",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-primary tracking-[0.3em] uppercase">
            What We Do
          </span>
          <h2 className="mt-3 font-heading text-4xl sm:text-5xl md:text-6xl text-foreground">
            OUR SERVICES
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            From basic washes to complete transformations — we offer a full
            spectrum of professional detailing services for every vehicle type.
          </p>
        </motion.div>

        {/* Service grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={cardVariants}>
              <Card className="h-full group cursor-pointer">
                <div
                  className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${service.color}`}
                >
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
