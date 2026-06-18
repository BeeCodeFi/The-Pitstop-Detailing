"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button, Input, Card } from "@/components/ui";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Car,
  Calendar,
  MapPin,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Service", icon: Sparkles },
  { id: 2, label: "Vehicle", icon: Car },
  { id: 3, label: "Schedule", icon: Calendar },
  { id: 4, label: "Pickup", icon: MapPin },
  { id: 5, label: "Payment", icon: CreditCard },
];

const services = [
  { id: "essential", name: "Essential Package", price: "₹2,499", duration: "2-3 hrs" },
  { id: "premium", name: "Premium Package", price: "₹5,999", duration: "4-5 hrs" },
  { id: "ultimate", name: "Ultimate Package", price: "₹11,999", duration: "6-8 hrs" },
  { id: "ceramic", name: "Ceramic Coating (2yr)", price: "₹14,999", duration: "1-2 days" },
  { id: "ppf-front", name: "PPF — Front Section", price: "₹29,999", duration: "1 day" },
  { id: "ppf-full", name: "PPF — Full Body", price: "₹99,999", duration: "3 days" },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM",
  "03:00 PM", "04:00 PM", "05:00 PM",
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [needsPickup, setNeedsPickup] = useState(true);

  const next = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <div className="py-24 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-heading text-4xl sm:text-5xl text-foreground">
            BOOK YOUR SLOT
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Complete the steps below to schedule your detailing appointment
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10 max-w-lg mx-auto">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  currentStep > step.id
                    ? "bg-primary text-white"
                    : currentStep === step.id
                    ? "border-2 border-primary text-primary bg-primary/10"
                    : "border border-border text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "hidden sm:block w-8 h-px mx-2 transition-colors",
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Select a Service
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={cn(
                        "text-left p-4 rounded-xl border transition-all",
                        selectedService === service.id
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                          : "border-border bg-card hover:border-primary/30"
                      )}
                    >
                      <p className="font-semibold text-foreground text-sm">
                        {service.name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-primary font-bold">
                          {service.price}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {service.duration}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Vehicle Details
                </h2>
                <Card hover={false}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="make" label="Make" placeholder="e.g., BMW" required />
                    <Input id="model" label="Model" placeholder="e.g., 3 Series" required />
                    <Input id="year" label="Year" type="number" placeholder="2023" required />
                    <Input id="color" label="Color" placeholder="e.g., Black" />
                    <Input id="plate" label="Plate Number" placeholder="KA 01 AB 1234" />
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-muted-foreground">
                        Vehicle Type
                      </label>
                      <select className="flex h-11 w-full rounded-md border border-border bg-secondary px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="hatchback">Hatchback</option>
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="luxury">Luxury</option>
                        <option value="bike">Bike</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 3: Schedule */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Pick a Date & Time
                </h2>
                <Card hover={false}>
                  <Input
                    id="date"
                    label="Preferred Date"
                    type="date"
                    required
                  />
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "py-2 px-3 rounded-md text-xs font-medium border transition-all",
                            selectedSlot === slot
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/30"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 4: Pickup */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Pickup & Delivery
                </h2>
                <Card hover={false}>
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setNeedsPickup(true)}
                      className={cn(
                        "flex-1 p-4 rounded-xl border text-center transition-all",
                        needsPickup
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-semibold text-foreground">
                        Pickup My Vehicle
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        We&apos;ll come to you
                      </p>
                    </button>
                    <button
                      onClick={() => setNeedsPickup(false)}
                      className={cn(
                        "flex-1 p-4 rounded-xl border text-center transition-all",
                        !needsPickup
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <Car className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-semibold text-foreground">
                        I&apos;ll Drop Off
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Visit our studio
                      </p>
                    </button>
                  </div>
                  {needsPickup && (
                    <div className="space-y-4">
                      <Input
                        id="address"
                        label="Pickup Address"
                        placeholder="Full street address"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input id="city" label="City" placeholder="Bangalore" required />
                        <Input id="pincode" label="Pincode" placeholder="560001" required />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        * Free pickup within 10 km. ₹499 for 10-25 km.
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Step 5: Payment */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Confirm & Pay
                </h2>
                <Card hover={false}>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service</span>
                      <span className="text-foreground font-medium">
                        {services.find((s) => s.id === selectedService)?.name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date & Time</span>
                      <span className="text-foreground font-medium">
                        {selectedSlot || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-foreground font-medium">
                        {needsPickup ? "Pickup & Delivery" : "Self Drop-off"}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-bold text-primary text-lg">
                        {services.find((s) => s.id === selectedService)?.price || "—"}
                      </span>
                    </div>
                  </div>
                  <Input
                    id="notes"
                    label="Special Instructions (optional)"
                    placeholder="Any specific requests or concerns..."
                  />
                  <Button size="lg" className="w-full mt-6">
                    <CreditCard className="h-4 w-4" />
                    Pay with Razorpay
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Secure payment via UPI, Cards, Wallets & Netbanking
                  </p>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={prev}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {currentStep < 5 && (
            <Button onClick={next}>
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
