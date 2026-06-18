"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { SITE_CONFIG } from "@/lib/constants";
import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // In production, this would call an API endpoint
    setSubmitted(true);
  }

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
            Get In Touch
          </span>
          <h1 className="mt-3 font-heading text-5xl sm:text-6xl md:text-7xl text-foreground">
            CONTACT US
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Have questions? Want a custom quote? Reach out — we&apos;d love to hear
            from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {submitted ? (
              <div className="p-8 rounded-xl border border-success/30 bg-success/5 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll get back to you within 24 hours. You can also reach us
                  directly via WhatsApp for faster response.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="name"
                    label="Full Name"
                    placeholder="Your name"
                    required
                  />
                  <Input
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
                <Input
                  id="vehicle"
                  label="Vehicle (optional)"
                  placeholder="e.g., BMW 3 Series 2023"
                />
                <div className="space-y-1.5">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    placeholder="Tell us about your requirements..."
                    className="flex w-full rounded-md border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {[
                {
                  icon: MapPin,
                  title: "Visit Us",
                  detail: SITE_CONFIG.address,
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  detail: SITE_CONFIG.phone,
                  href: `tel:${SITE_CONFIG.phone}`,
                },
                {
                  icon: Mail,
                  title: "Email Us",
                  detail: SITE_CONFIG.email,
                  href: `mailto:${SITE_CONFIG.email}`,
                },
                {
                  icon: Clock,
                  title: "Working Hours",
                  detail: "Mon–Sat: 8 AM – 7 PM | Sun: 9 AM – 5 PM",
                },
                {
                  icon: MessageCircle,
                  title: "WhatsApp",
                  detail: "Chat with us for quick queries",
                  href: `https://wa.me/919876543210`,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h4>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {item.detail}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden border border-border aspect-video bg-muted flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Google Maps Embed (Add API key in production)
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
