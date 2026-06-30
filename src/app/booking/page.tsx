"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import {
  ArrowLeft, ArrowRight, Check, Car, Calendar, MapPin,
  MessageCircle, Sparkles, AlertCircle, CheckCircle2, Clock, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const VEHICLE_TYPES = [
  { id: "hatchback",   label: "Hatchback" },
  { id: "sedan",       label: "Sedan" },
  { id: "compact_suv", label: "Compact SUV" },
  { id: "suv",         label: "SUV" },
  { id: "luxury",      label: "Luxury" },
];

const SERVICES = [
  { category: "Wash", items: [
    { id: "foam-wash",      name: "Foam Wash",                     prices: { hatchback: 350,   sedan: 400,   compact_suv: 400,   suv: 500,    luxury: 500   }, duration: "30 min" },
  ]},
  { category: "Exterior", items: [
    { id: "ext-detail",     name: "Exterior Detailing",            prices: { hatchback: 1500,  sedan: 1500,  compact_suv: 2000,  suv: 2000,   luxury: 3000  }, duration: "2 hr" },
    { id: "iron-fallout",   name: "Iron Fallout Removal",          prices: { hatchback: 999,   sedan: 1199,  compact_suv: 1499,  suv: 1699,   luxury: 1999  }, duration: "1 hr" },
    { id: "tar-removal",    name: "Tar Removal",                   prices: { hatchback: 999,   sedan: 1199,  compact_suv: 1499,  suv: 1699,   luxury: 1999  }, duration: "1 hr" },
    { id: "water-spot",     name: "Water Spot Removal",            prices: { hatchback: 1499,  sedan: 1799,  compact_suv: 1999,  suv: 2299,   luxury: 2999  }, duration: "1 hr" },
    { id: "trim-restore",   name: "Trim Restoration",              prices: { hatchback: 999,   sedan: 1199,  compact_suv: 1499,  suv: 1699,   luxury: 1999  }, duration: "1 hr" },
  ]},
  { category: "Paint Correction", items: [
    { id: "rub-polish",     name: "Rubbing & Polishing",           prices: { hatchback: 1500,  sedan: 1500,  compact_suv: 2000,  suv: 2000,   luxury: 4000  }, duration: "3 hr" },
  ]},
  { category: "Interior", items: [
    { id: "int-detail",     name: "Interior Detailing",            prices: { hatchback: 1500,  sedan: 1500,  compact_suv: 2000,  suv: 2000,   luxury: 3500  }, duration: "2 hr" },
    { id: "leather-coat",   name: "Leather Coating",               prices: { hatchback: 2999,  sedan: 3499,  compact_suv: 3999,  suv: 4499,   luxury: 5999  }, duration: "2 hr" },
    { id: "steam-clean",    name: "Steam Cleaning",                prices: { hatchback: 500,   sedan: 700,   compact_suv: 700,   suv: 1000,   luxury: 1500  }, duration: "1 hr" },
    { id: "ac-sanit",       name: "AC Vent Sanitization",          prices: { hatchback: 799,   sedan: 999,   compact_suv: 1199,  suv: 1399,   luxury: 1799  }, duration: "30 min" },
    { id: "odor-remove",    name: "Odor Removal",                  prices: { hatchback: 999,   sedan: 1199,  compact_suv: 1499,  suv: 1699,   luxury: 1999  }, duration: "1 hr" },
  ]},
  { category: "Ceramic & Graphene", items: [
    { id: "ceramic-9h-1y",  name: "Ceramic Coating 9H (1 Year)",  prices: { hatchback: 12499, sedan: 14999, compact_suv: 17499, suv: 19999,  luxury: 24999 }, duration: "8 hr" },
    { id: "ceramic-10h-2y", name: "Ceramic Coating 10H (2 Year)", prices: { hatchback: 16499, sedan: 18999, compact_suv: 21499, suv: 23999,  luxury: 29999 }, duration: "8 hr" },
    { id: "graphene",       name: "Graphene Coating",              prices: { hatchback: 22499, sedan: 24999, compact_suv: 28499, suv: 32999,  luxury: 35999 }, duration: "2 days" },
  ]},
  { category: "Paint Protection Film", items: [
    { id: "ppf-full-5y",    name: "PPF Full Body (5 Year)",        prices: { hatchback: 60000, sedan: 70000, compact_suv: 70000, suv: 80000,  luxury: 90000  }, duration: "3 days" },
    { id: "ppf-full-10y",   name: "PPF Full Body (10 Year)",       prices: { hatchback: 80000, sedan: 90000, compact_suv: 90000, suv: 100000, luxury: 100000 }, duration: "3 days" },
    { id: "ppf-matt-5y",    name: "Matt PPF (5 Year)",             prices: { hatchback: 65000, sedan: 75000, compact_suv: 75000, suv: 85000,  luxury: 95000  }, duration: "3 days" },
  ]},
  { category: "Engine & Underbody", items: [
    { id: "underbody",      name: "Underbody Coating",             prices: { hatchback: 2000,  sedan: 2000,  compact_suv: 2000,  suv: 2000,   luxury: null  }, duration: "3 hr" },
  ]},
  { category: "Glass", items: [
    { id: "glass-coat",     name: "Glass Coating",                 prices: { hatchback: 1000,  sedan: 1000,  compact_suv: 1000,  suv: 1000,   luxury: 1000  }, duration: "2 hr" },
  ]},
  { category: "Lighting", items: [
    { id: "headlight",      name: "Headlight Restoration",         prices: { hatchback: 799,   sedan: 999,   compact_suv: 1199,  suv: 1399,   luxury: 1799  }, duration: "1 hr" },
  ]},
  { category: "Wheel & Tire", items: [
    { id: "alloy-coat",     name: "Alloy Wheel Coating",           prices: { hatchback: 399,   sedan: 499,   compact_suv: 599,   suv: 699,    luxury: 899   }, duration: "2 hr" },
  ]},
];


const TIME_SLOTS = [
  { slot: "09:00 AM", label: "9:00 AM \u2013 11:00 AM" },
  { slot: "11:00 AM", label: "11:00 AM \u2013 1:00 PM" },
  { slot: "01:00 PM", label: "1:00 PM \u2013 3:00 PM" },
  { slot: "03:00 PM", label: "3:00 PM \u2013 5:00 PM" },
  { slot: "05:00 PM", label: "5:00 PM \u2013 7:00 PM" },
];

const steps = [
  { id: 1, label: "Vehicle",  icon: Car },
  { id: 2, label: "Service",  icon: Sparkles },
  { id: 3, label: "Schedule", icon: Calendar },
  { id: 4, label: "Pickup",   icon: MapPin },
  { id: 5, label: "Enquiry",  icon: MessageCircle },
];

const initialState = {
  vehicleType: "" as string,
  serviceId: "",
  vehicle: { make: "", model: "", year: "", color: "", plateNumber: "" },
  date: "",
  timeSlot: "",
  needsPickup: true,
  pickup: { address: "", city: "", pincode: "" },
  notes: "",
};

type BookingState = typeof initialState;

function formatPrice(amount: number | null): string {
  if (amount === null) return "N/A";
  return "\u20b9" + amount.toLocaleString("en-IN");
}

function getServiceById(id: string) {
  for (const cat of SERVICES) {
    for (const item of cat.items) {
      if (item.id === id) return item;
    }
  }
  return null;
}

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [booking, setBooking] = useState<BookingState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ success: boolean; message: string; bookingId?: string } | null>(null);

  const selectedService = getServiceById(booking.serviceId);
  const vehicleType = booking.vehicleType;
  const selectedVehicle = VEHICLE_TYPES.find((v) => v.id === booking.vehicleType);
  const servicePrice = selectedService && vehicleType ? (selectedService.prices as Record<string, number | null>)[vehicleType] : null;

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const validateStep = useCallback((step: number): boolean => {
    const errs: Record<string, string> = {};
    switch (step) {
      case 1:
        if (!booking.vehicleType) errs.vehicleType = "Please select your vehicle type";
        if (!booking.vehicle.make.trim()) errs.make = "Make is required";
        if (!booking.vehicle.model.trim()) errs.model = "Model is required";
        if (!booking.vehicle.year || parseInt(booking.vehicle.year) < 1990) errs.year = "Valid year is required";
        break;
      case 2:
        if (!booking.serviceId) errs.service = "Please select a service";
        break;
      case 3:
        if (!booking.date) errs.date = "Please select a date";
        if (!booking.timeSlot) errs.timeSlot = "Please select a time slot";
        break;
      case 4:
        if (booking.needsPickup) {
          if (!booking.pickup.address.trim()) errs.address = "Address is required";
          if (!booking.pickup.city.trim()) errs.city = "City is required";
          if (!booking.pickup.pincode.trim() || booking.pickup.pincode.length !== 6) errs.pincode = "Valid 6-digit pincode is required";
        }
        break;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [booking]);

  const next = () => { if (validateStep(currentStep)) setCurrentStep((s) => Math.min(s + 1, 5)); };
  const prev = () => { setErrors({}); setCurrentStep((s) => Math.max(s - 1, 1)); };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const payload = {
        serviceId: booking.serviceId,
        vehicle: { make: booking.vehicle.make, model: booking.vehicle.model, year: parseInt(booking.vehicle.year), color: booking.vehicle.color || undefined, plateNumber: booking.vehicle.plateNumber || undefined, vehicleType: booking.vehicleType },
        date: booking.date, timeSlot: booking.timeSlot, needsPickup: booking.needsPickup,
        pickup: booking.needsPickup ? booking.pickup : undefined,
        notes: booking.notes || undefined,
      };
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 401) { router.push("/login"); return; }
        setBookingResult({ success: false, message: json.error || "Booking failed" });
        return;
      }
      setBookingResult({ success: true, message: "Booking enquiry submitted! Our team will reach out on WhatsApp to confirm your appointment and final pricing.", bookingId: json.booking?.id });
    } catch { setBookingResult({ success: false, message: "Something went wrong. Please try again." }); }
    finally { setIsSubmitting(false); }
  };

  if (bookingResult) {
    return (
      <div className="py-24 min-h-screen">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className={cn("h-20 w-20 rounded-full mx-auto mb-6 flex items-center justify-center", bookingResult.success ? "bg-success/10" : "bg-error/10")}>
              {bookingResult.success ? <CheckCircle2 className="h-10 w-10 text-success" /> : <AlertCircle className="h-10 w-10 text-error" />}
            </div>
            <h1 className="font-heading text-3xl text-foreground mb-3">{bookingResult.success ? "ENQUIRY SUBMITTED!" : "SUBMISSION FAILED"}</h1>
            <p className="text-muted-foreground mb-2">{bookingResult.message}</p>
            {bookingResult.bookingId && <p className="text-xs text-muted-foreground mb-8">Booking ID: <span className="font-mono text-primary">{bookingResult.bookingId}</span></p>}
            <div className="flex gap-3 justify-center">
              {bookingResult.success
                ? (<><Button onClick={() => router.push("/dashboard")}>View Dashboard</Button><Button variant="secondary" onClick={() => router.push("/")}>Back to Home</Button></>)
                : (<Button onClick={() => { setBookingResult(null); setCurrentStep(5); }}>Try Again</Button>)}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground">BOOK YOUR SLOT</h1>
          <p className="text-sm text-muted-foreground mt-2">Complete the steps below to schedule your detailing appointment</p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8 sm:mb-10">
          <div className="flex items-center gap-0">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => { if (step.id < currentStep) setCurrentStep(step.id); }}
                  className={cn("h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shrink-0",
                    currentStep > step.id ? "bg-primary text-white cursor-pointer hover:bg-primary-dark" : currentStep === step.id ? "border-2 border-primary text-primary bg-primary/10" : "border border-border text-muted-foreground cursor-default")}
                  disabled={step.id > currentStep} title={step.label}>
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                </button>
                <span className={cn("hidden sm:block ml-1.5 mr-3 text-xs font-medium", currentStep === step.id ? "text-primary" : "text-muted-foreground")}>{step.label}</span>
                {i < steps.length - 1 && <div className={cn("w-5 sm:w-8 h-px mx-1 sm:mx-2 transition-colors shrink-0", currentStep > step.id ? "bg-primary" : "bg-border")} />}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>

            {/* Step 1: Vehicle */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-foreground">Your Vehicle</h2>
                <div className="space-y-1.5">
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-muted-foreground">
                    Vehicle Type <span className="text-primary">*</span>
                  </label>
                  {errors.vehicleType && <p className="text-sm text-error flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.vehicleType}</p>}
                  <select
                    id="vehicleType"
                    value={booking.vehicleType}
                    onChange={(e) => setBooking((b) => ({ ...b, vehicleType: e.target.value, serviceId: "" }))}
                    className={cn(
                      "flex h-11 w-full rounded-md border bg-secondary px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
                      booking.vehicleType ? "border-border text-foreground" : "border-border text-muted-foreground",
                      errors.vehicleType ? "border-error focus:border-error focus:ring-error" : "focus:border-primary"
                    )}
                  >
                    <option value="" disabled>-- Select vehicle type --</option>
                    {VEHICLE_TYPES.map((vt) => (
                      <option key={vt.id} value={vt.id}>{vt.label}</option>
                    ))}
                  </select>
                </div>
                <Card hover={false}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="make" label="Make" placeholder="e.g., Maruti, Honda, BMW" required value={booking.vehicle.make} onChange={(e) => setBooking((b) => ({ ...b, vehicle: { ...b.vehicle, make: e.target.value } }))} error={errors.make} />
                    <Input id="model" label="Model" placeholder="e.g., Swift, City, X5" required value={booking.vehicle.model} onChange={(e) => setBooking((b) => ({ ...b, vehicle: { ...b.vehicle, model: e.target.value } }))} error={errors.model} />
                    <Input id="year" label="Year" type="number" placeholder="e.g., 2022" required value={booking.vehicle.year} onChange={(e) => setBooking((b) => ({ ...b, vehicle: { ...b.vehicle, year: e.target.value } }))} error={errors.year} />
                    <Input id="color" label="Color" placeholder="e.g., Pearl White" value={booking.vehicle.color} onChange={(e) => setBooking((b) => ({ ...b, vehicle: { ...b.vehicle, color: e.target.value } }))} />
                    <Input id="plate" label="Plate Number" placeholder="e.g., JH 01 AB XXXX" value={booking.vehicle.plateNumber} onChange={(e) => setBooking((b) => ({ ...b, vehicle: { ...b.vehicle, plateNumber: e.target.value } }))} />
                  </div>
                </Card>
              </div>
            )}

            {/* Step 2: Service */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-lg font-bold text-foreground">Select a Service</h2>
                  {selectedVehicle && <span className="text-xs bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full border border-primary/20">{selectedVehicle.label} pricing</span>}
                </div>
                <p className="text-xs text-muted-foreground">Prices shown are adjusted for your vehicle type.</p>
                {errors.service && <p className="text-sm text-error flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.service}</p>}
                <div className="space-y-5">
                  {SERVICES.map((cat) => (
                    <div key={cat.category}>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">{cat.category}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cat.items.map((service) => {
                          const price = vehicleType ? (service.prices as Record<string, number | null>)[vehicleType] : null;
                          const isNA = price === null;
                          return (
                            <button key={service.id} disabled={isNA} onClick={() => !isNA && setBooking((b) => ({ ...b, serviceId: service.id }))}
                              className={cn("text-left p-3.5 rounded-xl border transition-all", isNA ? "border-border bg-muted/30 opacity-50 cursor-not-allowed" : booking.serviceId === service.id ? "border-primary bg-primary/5 ring-1 ring-primary shadow-lg shadow-primary/10" : "border-border bg-card hover:border-primary/40")}>
                              <p className="font-semibold text-foreground text-sm">{service.name}</p>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                                <span className={cn("font-bold text-sm", isNA ? "text-muted-foreground" : "text-primary")}>{isNA ? "N/A" : formatPrice(price)}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {service.duration}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Pick a Date &amp; Time</h2>
                <Card hover={false}>
                  <Input id="date" label="Preferred Date" type="date" required min={getMinDate()} value={booking.date} onChange={(e) => setBooking((b) => ({ ...b, date: e.target.value }))} error={errors.date} />
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-muted-foreground mb-3">Available Time Slots (2-hr blocks)</label>
                    {errors.timeSlot && <p className="text-sm text-error mb-2 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.timeSlot}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TIME_SLOTS.map(({ slot, label }) => (
                        <button key={slot} onClick={() => setBooking((b) => ({ ...b, timeSlot: slot }))}
                          className={cn("py-3 px-4 rounded-lg text-sm font-medium border transition-all text-left flex items-center gap-3", booking.timeSlot === slot ? "border-primary bg-primary/10 text-primary ring-1 ring-primary" : "border-border text-muted-foreground hover:border-primary/30 bg-card")}>
                          <Clock className="h-4 w-4 shrink-0" /><span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-500/90 leading-relaxed"><span className="font-semibold">Please note:</span> A delay of 30-45 minutes may occur due to traffic or prior service overruns. We appreciate your patience.</p>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 4: Pickup */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Pickup &amp; Delivery</h2>
                <Card hover={false}>
                  <div className="flex gap-4 mb-6">
                    <button onClick={() => setBooking((b) => ({ ...b, needsPickup: true }))} className={cn("flex-1 p-4 rounded-xl border text-center transition-all", booking.needsPickup ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/30")}>
                      <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Pickup My Vehicle</p>
                      <p className="text-xs text-muted-foreground mt-1">We&apos;ll come to you</p>
                    </button>
                    <button onClick={() => setBooking((b) => ({ ...b, needsPickup: false }))} className={cn("flex-1 p-4 rounded-xl border text-center transition-all", !booking.needsPickup ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/30")}>
                      <Car className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-semibold text-foreground">I&apos;ll Drop Off</p>
                      <p className="text-xs text-muted-foreground mt-1">Visit our studio</p>
                    </button>
                  </div>
                  {booking.needsPickup && (
                    <div className="space-y-4">
                      <Input id="address" label="Pickup Address" placeholder="Full street address" required value={booking.pickup.address} onChange={(e) => setBooking((b) => ({ ...b, pickup: { ...b.pickup, address: e.target.value } }))} error={errors.address} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input id="city" label="City" placeholder="Ranchi" required value={booking.pickup.city} onChange={(e) => setBooking((b) => ({ ...b, pickup: { ...b.pickup, city: e.target.value } }))} error={errors.city} />
                        <Input id="pincode" label="Pincode" placeholder="834001" required maxLength={6} value={booking.pickup.pincode} onChange={(e) => setBooking((b) => ({ ...b, pickup: { ...b.pickup, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) } }))} error={errors.pincode} />
                      </div>
                      <p className="text-xs text-muted-foreground">* Free pickup within 10 km on orders above ₹5,000. ₹499 for 10-25 km.</p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Step 5: Enquiry */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Review &amp; Submit Enquiry</h2>
                <Card hover={false}>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-start gap-3 text-sm"><span className="text-muted-foreground shrink-0">Vehicle Type</span><span className="text-foreground font-medium text-right">{selectedVehicle ? selectedVehicle.label : "—"}</span></div>
                    <div className="flex justify-between items-start gap-3 text-sm"><span className="text-muted-foreground shrink-0">Vehicle</span><span className="text-foreground font-medium text-right">{booking.vehicle.make && booking.vehicle.model ? booking.vehicle.year + " " + booking.vehicle.make + " " + booking.vehicle.model : "\u2014"}</span></div>
                    <div className="flex justify-between items-start gap-3 text-sm"><span className="text-muted-foreground shrink-0">Service</span><span className="text-foreground font-medium text-right">{selectedService?.name || "—"}</span></div>
                    <div className="flex justify-between items-start gap-3 text-sm"><span className="text-muted-foreground shrink-0">Estimated Duration</span><span className="text-foreground font-medium text-right">{selectedService?.duration || "—"}</span></div>
                    <div className="flex justify-between items-start gap-3 text-sm"><span className="text-muted-foreground shrink-0">Date &amp; Time</span><span className="text-foreground font-medium text-right">{booking.date && booking.timeSlot ? new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + " at " + booking.timeSlot : "—"}</span></div>
                    <div className="flex justify-between items-start gap-3 text-sm"><span className="text-muted-foreground shrink-0">Delivery</span><span className="text-foreground font-medium text-right">{booking.needsPickup ? "Pickup & Delivery" : "Self Drop-off"}</span></div>
                    {booking.needsPickup && booking.pickup.address && (<div className="flex justify-between items-start gap-3 text-sm"><span className="text-muted-foreground shrink-0">Pickup From</span><span className="text-foreground font-medium text-right max-w-[55%]">{booking.pickup.address}, {booking.pickup.city} - {booking.pickup.pincode}</span></div>)}
                    <div className="border-t border-border pt-3 flex justify-between items-center">
                      <span className="font-bold text-foreground">Est. Starting Price*</span>
                      <span className="font-bold text-primary text-lg">{servicePrice !== null && servicePrice !== undefined ? formatPrice(servicePrice) : "—"}</span>
                    </div>
                  </div>
                  {/* Price disclaimer */}
                  <div className="flex gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary/90 leading-relaxed"><span className="font-semibold">Pricing note:</span> Final price depends on vehicle size, condition, and selected service. Our team will confirm the exact quote via WhatsApp before service begins.</p>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground">Special Instructions (optional)</label>
                    <textarea id="notes" rows={2} value={booking.notes} onChange={(e) => setBooking((b) => ({ ...b, notes: e.target.value }))} placeholder="Any specific requests or concerns..." className="flex w-full rounded-md border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none" maxLength={500} />
                  </div>
                  <Button size="lg" className="w-full" onClick={handleSubmitBooking} disabled={isSubmitting}>
                    {isSubmitting
                      ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><MessageCircle className="h-4 w-4" /> Submit Booking Enquiry</>}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">No payment required — we&apos;ll confirm your appointment &amp; pricing via WhatsApp within 2 hours.</p>
                </Card>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <Button variant="ghost" onClick={prev} disabled={currentStep === 1}><ArrowLeft className="h-4 w-4" /> Back</Button>
          {currentStep < 5 && <Button onClick={next}>Next <ArrowRight className="h-4 w-4" /></Button>}
        </div>

      </div>
    </div>
  );
}
