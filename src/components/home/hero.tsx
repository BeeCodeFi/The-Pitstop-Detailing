"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smoke/particle reveal
      gsap.fromTo(
        smokeRef.current,
        { opacity: 1, scale: 1.2 },
        { opacity: 0, scale: 1, duration: 2, delay: 0.5, ease: "power2.out" }
      );

      // Title reveal
      gsap.fromTo(
        titleRef.current,
        { y: 80, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.2, delay: 0.8, ease: "power3.out" }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />

      {/* Red glow accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-primary/10 rounded-full blur-[120px]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Smoke overlay */}
      <div
        ref={smokeRef}
        className="absolute inset-0 bg-gradient-to-t from-primary/5 via-background to-background pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary/30 bg-primary/5 mb-6 sm:mb-8"
        >
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          <span className="text-[10px] sm:text-xs font-medium text-primary tracking-wide uppercase">
            Premium Car Detailing Studio
          </span>
        </motion.div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="font-heading text-[3.5rem] sm:text-7xl md:text-8xl lg:text-9xl text-foreground leading-[0.85] tracking-tight opacity-0"
        >
          THE{" "}
          <span className="text-gradient">PITSTOP</span>
          <br />
          <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-muted-foreground">
            DETAILING
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2"
        >
          Where performance meets perfection. Expert ceramic coatings, paint
          protection, and full detailing with{" "}
          <span className="text-foreground font-medium">
            complimentary vehicle pickup & delivery
          </span>
          .
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-8 sm:mt-10 flex flex-col xs:flex-row sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link href="/booking" className="w-full xs:w-auto sm:w-auto">
            <Button size="xl" className="group w-full xs:w-auto sm:w-auto">
              Book Appointment
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/services" className="w-full xs:w-auto sm:w-auto">
            <Button variant="outline" size="xl" className="w-full xs:w-auto sm:w-auto">
              Explore Services
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-12 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: "5000+", label: "Cars Detailed" },
            { value: "8+", label: "Years Experience" },
            { value: "4.9★", label: "Google Rating" },
            { value: "100%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
