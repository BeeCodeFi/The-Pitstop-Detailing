"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Truck, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui";

const steps = [
  {
    icon: Calendar,
    step: "01",
    title: "Choose Service & Time",
    description: "Select your desired service, pick a convenient date and time slot from our live calendar.",
  },
  {
    icon: Truck,
    step: "02",
    title: "Pickup Your Vehicle",
    description: "Our team arrives at your doorstep to pick up your vehicle. No need to drive anywhere.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Pay & Track",
    description: "Secure online payment via UPI, cards, or wallets. Track your vehicle's detailing progress live.",
  },
];

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-primary tracking-[0.3em] uppercase">
            Simple Process
          </span>
          <h2 className="mt-3 font-heading text-4xl sm:text-5xl md:text-6xl text-foreground">
            HOW IT WORKS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative text-center group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary/30 bg-muted mb-4 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                <step.icon className="h-7 w-7 text-primary" />
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-muted p-10 sm:p-14 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(227,24,55,0.1),transparent_50%)]" />
          <div className="relative">
            <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
              READY TO TRANSFORM
              <br />
              YOUR RIDE?
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Book your appointment today and experience the difference
              professional detailing makes. Free pickup & delivery on all
              premium services.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/booking">
                <Button size="xl" className="group">
                  Book Your Slot
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="xl">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
