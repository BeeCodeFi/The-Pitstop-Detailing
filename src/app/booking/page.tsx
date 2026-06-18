"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  AlertCircle,
  CheckCircle2,
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
  { id: "essential", name: "Essential Package", price: 2499, priceLabel: "₹2,499", duration: "2-3 hrs", desc: "Foam wash, interior vacuum, tyre dressing" },
  { id: "premium", name: "Premium Package", price: 5999, priceLabel: "₹5,999", duration: "4-5 hrs", desc: "Clay bar, machine polish, leather conditioning" },
  { id: "ultimate", name: "Ultimate Package", price: 11999, priceLabel: "₹11,999", duration: "6-8 hrs", desc: "Paint correction, graphene coat, full interior" },
  { id: "ceramic", name: "Ceramic Coating (2yr)", price: 14999, priceLabel: "₹14,999", duration: "1-2 days", desc: "9H ceramic protection with UV resistance" },
  { id: "ppf-front", name: "PPF — Front Section", price: 29999, priceLabel: "₹29,999", duration: "1 day", desc: "Self-healing film on bumper, hood, fenders" },
  { id: "ppf-full", name: "PPF — Full Body", price: 99999, priceLabel: "₹99,999", duration: "3 days", desc: "Complete body protection with premium TPU" },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM",
  "03:00 PM", "04:00 PM", "05:00 PM",
];

interface BookingState {
  serviceId: string;
  vehicle: {
    make: string;
    model: string;
    year: string;
    color: string;
    plateNumber: string;
    vehicleType: string;
  };
  date: string;
  timeSlot: string;
  needsPickup: boolean;
  pickup: {
    address: string;
    city: string;
    pincode: string;
  };
  notes: string;
}

const initialState: BookingState = {
  serviceId: "",
  vehicle: { make: "", model: "", year: "", color: "", plateNumber: "", vehicleType: "sedan" },
  date: "",
  timeSlot: "",
  needsPickup: true,
  pickup: { address: "", city: "", pincode: "" },
  notes: "",
};

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [booking, setBooking] = useState<BookingState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ success: boolean; message: string; bookingId?: string } | null>(null);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!booking.serviceId) newErrors.service = "Please select a service";
        break;
      case 2:
        if (!booking.vehicle.make.trim()) newErrors.make = "Make is required";
        if (!booking.vehicle.model.trim()) newErrors.model = "Model is required";
        if (!booking.vehicle.year || parseInt(booking.vehicle.year) < 1990)
          newErrors.year = "Valid year is required";
        break;
      case 3:
        if (!booking.date) newErrors.date = "Please select a date";
        if (!booking.timeSlot) newErrors.timeSlot = "Please select a time slot";
        break;
      case 4:
        if (booking.needsPickup) {
          if (!booking.pickup.address.trim()) newErrors.address = "Address is required";
          if (!booking.pickup.city.trim()) newErrors.city = "City is required";
          if (!booking.pickup.pincode.trim() || booking.pickup.pincode.length !== 6)
            newErrors.pincode = "Valid 6-digit pincode is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [booking]);

  const next = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 5));
    }
  };
  const prev = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const selectedService = services.find((s) => s.id === booking.serviceId);

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        serviceId: booking.serviceId,
        vehicle: {
          make: booking.vehicle.make,
          model: booking.vehicle.model,
          year: parseInt(booking.vehicle.year),
          color: booking.vehicle.color || undefined,
          plateNumber: booking.vehicle.plateNumber || undefined,
          vehicleType: booking.vehicle.vehicleType,
        },
        date: booking.date,
        timeSlot: booking.timeSlot,
        needsPickup: booking.needsPickup,
        pickup: booking.needsPickup ? booking.pickup : undefined,
        notes: booking.notes || undefined,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        setBookingResult({ success: false, message: json.error || "Booking failed" });
        return;
      }

      setBookingResult({
        success: true,
        message: "Booking confirmed! We'll send you a confirmation shortly.",
        bookingId: json.booking?.id,
      });
    } catch {
      setBookingResult({ success: false, message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success / Error result screen
  if (bookingResult) {
    return (
      <div className="py-24 min-h-screen">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className={cn(
              "h-20 w-20 rounded-full mx-auto mb-6 flex items-center justify-center",
              bookingResult.success ? "bg-success/10" : "bg-error/10"
            )}>
              {bookingResult.success ? (
                <CheckCircle2 className="h-10 w-10 text-success" />
              ) : (
                <AlertCircle className="h-10 w-10 text-error" />
              )}
            </div>
            <h1 className="font-heading text-3xl text-foreground mb-3">
              {bookingResult.success ? "BOOKING CONFIRMED!" : "BOOKING FAILED"}
            </h1>
            <p className="text-muted-foreground mb-2">{bookingResult.message}</p>
            {bookingResult.bookingId && (
              <p className="text-xs text-muted-foreground mb-8">
                Booking ID: <span className="font-mono text-primary">{bookingResult.bookingId}</span>
              </p>
            )}
            <div className="flex gap-3 justify-center">
              {bookingResult.success ? (
                <>
                  <Button onClick={() => router.push("/dashboard")}>View Dashboard</Button>
                  <Button variant="secondary" onClick={() => router.push("/")}>Back to Home</Button>
                </>
              ) : (
                <Button onClick={() => { setBookingResult(null); setCurrentStep(5); }}>Try Again</Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-heading text-4xl sm:text-5xl text-foreground">BOOK YOUR SLOT</h1>
          <p className="text-sm text-muted-foreground mt-2">Complete the steps below to schedule your detailing appointment</p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10 max-w-lg mx-auto">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => { if (step.id < currentStep) setCurrentStep(step.id); }}
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  currentStep > step.id
                    ? "bg-primary text-white cursor-pointer hover:bg-primary-dark"
                    : currentStep === step.id
                    ? "border-2 border-primary text-primary bg-primary/10"
                    : "border border-border text-muted-foreground cursor-default"
                )}
                disabled={step.id > currentStep}
              >
                {currentStep > step.id ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
              </button>
              {i < steps.length - 1 && (
                <div className={cn("hidden sm:block w-8 h-px mx-2 transition-colors", currentStep > step.id ? "bg-primary" : "bg-border")} />
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
            {/* Step 1: Service */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground mb-4">Select a Service</h2>
                {errors.service && <p className="text-sm text-error flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.service}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setBooking((b) => ({ ...b, serviceId: service.id }))}
                      className={cn(
                        "text-left p-4 rounded-xl border transition-all",
                        booking.serviceId === service.id
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary"
                          : "border-border bg-card hover:border-primary/30"
                      )}
                    >
                      <p className="font-semibold text-foreground text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{service.desc}</p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                        <span className="text-primary font-bold">{service.priceLabel}</span>
                        <span className="text-xs text-muted-foreground">{service.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Vehicle */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground mb-4">Vehicle Details</h2>
                <Card hover={false}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="make" label="Make" placeholder="e.g., BMW" required
                      value={booking.vehicle.make}
                      onChange={(e) => setBooking((b) => ({ ...b, vehicle: { ...b.vehicle, make: e.target.value } }))}
                      error={errors.make}
                    />
                    <Input
                      id="model" label="Model" placeholder="e.g., 3 Series" required
                      value={booking.vehicle.model}
                      onChange={(e) => setBooking((b) => ({ ...b, vehicle: { ...b.vehicle, model: e.target.value } }))}
                      error={errors.model}
                    />
                    <Input
                      id="year" label="Year" type="number" placeholder="2023" required
                      value={booking.vehicle.year}
                      onChange={(e) => setBooking((b) => ({ ...b, vehicle: { ...b.vehicle, year: e.target.value } }))}
                      error={errors.year}
                    />
                    <Input
                      id="color" label="Color" placeholder="e.g., Black"
                      value={booking.vehicle.color}
                      onChange={(e) => setBooking((b) => ({ ...b, vehicle: { ...b.vehicle, color: e.target.value } }))}
                    />
                    <Input
                      id="plate" label="Plate Number" placeholder="KA 01 AB 1234"
                      value={booking.vehicle.plateNumber}
                      onChange={(e) => setBooking((b) => ({ ...b, vehicle: { ...b.vehicle, plateNumber: e.target.value } }))}
                    />
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-muted-foreground">Vehicle Type</label>
                      <select
                        value={booking.vehicle.vehicleType}
                        onChange={(e) => setBooking((b) => ({ ...b, vehicle: { ...b.vehicle, vehicleType: e.target.value } }))}
                        className="flex h-11 w-full rounded-md border border-border bg-secondary px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
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
                <h2 className="text-lg font-bold text-foreground mb-4">Pick a Date & Time</h2>
                <Card hover={false}>
                  <Input
                    id="date" label="Preferred Date" type="date" required
                    min={getMinDate()}
                    value={booking.date}
                    onChange={(e) => setBooking((b) => ({ ...b, date: e.target.value }))}
                    error={errors.date}
                  />
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-3">Available Time Slots</label>
                    {errors.timeSlot && <p className="text-sm text-error mb-2 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.timeSlot}</p>}
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setBooking((b) => ({ ...b, timeSlot: slot }))}
                          className={cn(
                            "py-2.5 px-3 rounded-md text-xs font-medium border transition-all",
                            booking.timeSlot === slot
                              ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
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
                <h2 className="text-lg font-bold text-foreground mb-4">Pickup & Delivery</h2>
                <Card hover={false}>
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setBooking((b) => ({ ...b, needsPickup: true }))}
                      className={cn(
                        "flex-1 p-4 rounded-xl border text-center transition-all",
                        booking.needsPickup ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/30"
                      )}
                    >
                      <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Pickup My Vehicle</p>
                      <p className="text-xs text-muted-foreground mt-1">We&apos;ll come to you</p>
                    </button>
                    <button
                      onClick={() => setBooking((b) => ({ ...b, needsPickup: false }))}
                      className={cn(
                        "flex-1 p-4 rounded-xl border text-center transition-all",
                        !booking.needsPickup ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/30"
                      )}
                    >
                      <Car className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-semibold text-foreground">I&apos;ll Drop Off</p>
                      <p className="text-xs text-muted-foreground mt-1">Visit our studio</p>
                    </button>
                  </div>
                  {booking.needsPickup && (
                    <div className="space-y-4">
                      <Input
                        id="address" label="Pickup Address" placeholder="Full street address" required
                        value={booking.pickup.address}
                        onChange={(e) => setBooking((b) => ({ ...b, pickup: { ...b.pickup, address: e.target.value } }))}
                        error={errors.address}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          id="city" label="City" placeholder="Bangalore" required
                          value={booking.pickup.city}
                          onChange={(e) => setBooking((b) => ({ ...b, pickup: { ...b.pickup, city: e.target.value } }))}
                          error={errors.city}
                        />
                        <Input
                          id="pincode" label="Pincode" placeholder="560001" required maxLength={6}
                          value={booking.pickup.pincode}
                          onChange={(e) => setBooking((b) => ({ ...b, pickup: { ...b.pickup, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) } }))}
                          error={errors.pincode}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">* Free pickup within 10 km on orders above ₹5,000. ₹499 for 10-25 km.</p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Step 5: Confirm & Pay */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground mb-4">Confirm & Pay</h2>
                <Card hover={false}>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service</span>
                      <span className="text-foreground font-medium">{selectedService?.name || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vehicle</span>
                      <span className="text-foreground font-medium">
                        {booking.vehicle.make && booking.vehicle.model
                          ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date & Time</span>
                      <span className="text-foreground font-medium">
                        {booking.date && booking.timeSlot
                          ? `${new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} at ${booking.timeSlot}`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-foreground font-medium">
                        {booking.needsPickup ? "Pickup & Delivery" : "Self Drop-off"}
                      </span>
                    </div>
                    {booking.needsPickup && booking.pickup.address && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pickup From</span>
                        <span className="text-foreground font-medium text-right max-w-[200px]">
                          {booking.pickup.address}, {booking.pickup.city} - {booking.pickup.pincode}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-bold text-primary text-lg">{selectedService?.priceLabel || "—"}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground">
                      Special Instructions (optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={2}
                      value={booking.notes}
                      onChange={(e) => setBooking((b) => ({ ...b, notes: e.target.value }))}
                      placeholder="Any specific requests or concerns..."
                      className="flex w-full rounded-md border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      maxLength={500}
                    />
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleSubmitBooking}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Confirm & Pay {selectedService?.priceLabel}
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Secure payment via Razorpay — UPI, Cards, Wallets & Netbanking
                  </p>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="ghost" onClick={prev} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {currentStep < 5 && (
            <Button onClick={next}>
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
