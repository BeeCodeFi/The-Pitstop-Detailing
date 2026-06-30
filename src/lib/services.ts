/**
 * Shared service pricing map — used by the booking API to look up amounts.
 * Prices are in paise (1 INR = 100 paise) for Razorpay compatibility.
 * Vehicle types: hatchback | sedan | compact_suv | suv | luxury
 */

export type VehicleType = "hatchback" | "sedan" | "compact_suv" | "suv" | "luxury";

export interface ServiceEntry {
  name: string;
  duration: string;
  prices: Record<VehicleType, number | null>;
}

/** Returns price in paise, or null if N/A for the given vehicle type. */
export function getServicePrice(serviceId: string, vehicleType: VehicleType): number | null {
  const svc = SERVICE_CATALOG[serviceId];
  if (!svc) return null;
  const inr = svc.prices[vehicleType];
  if (inr === null) return null;
  return inr * 100; // convert to paise
}

/** Returns display price in INR (for emails / summaries). */
export function getServicePriceINR(serviceId: string, vehicleType: VehicleType): number | null {
  const svc = SERVICE_CATALOG[serviceId];
  if (!svc) return null;
  return svc.prices[vehicleType];
}

export function getServiceName(serviceId: string): string {
  return SERVICE_CATALOG[serviceId]?.name ?? serviceId;
}

export function getServiceDuration(serviceId: string): string {
  return SERVICE_CATALOG[serviceId]?.duration ?? "—";
}

export const SERVICE_CATALOG: Record<string, ServiceEntry> = {
  "foam-wash":      { name: "Foam Wash",                    duration: "30 min", prices: { hatchback: 350,   sedan: 400,   compact_suv: 400,   suv: 500,    luxury: 500   } },
  "ext-detail":     { name: "Exterior Detailing",           duration: "2 hr",   prices: { hatchback: 1500,  sedan: 1500,  compact_suv: 2000,  suv: 2000,   luxury: 3000  } },
  "iron-fallout":   { name: "Iron Fallout Removal",         duration: "1 hr",   prices: { hatchback: 999,   sedan: 1199,  compact_suv: 1499,  suv: 1699,   luxury: 1999  } },
  "tar-removal":    { name: "Tar Removal",                  duration: "1 hr",   prices: { hatchback: 999,   sedan: 1199,  compact_suv: 1499,  suv: 1699,   luxury: 1999  } },
  "water-spot":     { name: "Water Spot Removal",           duration: "1 hr",   prices: { hatchback: 1499,  sedan: 1799,  compact_suv: 1999,  suv: 2299,   luxury: 2999  } },
  "trim-restore":   { name: "Trim Restoration",             duration: "1 hr",   prices: { hatchback: 999,   sedan: 1199,  compact_suv: 1499,  suv: 1699,   luxury: 1999  } },
  "rub-polish":     { name: "Rubbing & Polishing",          duration: "3 hr",   prices: { hatchback: 1500,  sedan: 1500,  compact_suv: 2000,  suv: 2000,   luxury: 4000  } },
  "int-detail":     { name: "Interior Detailing",           duration: "2 hr",   prices: { hatchback: 1500,  sedan: 1500,  compact_suv: 2000,  suv: 2000,   luxury: 3500  } },
  "leather-coat":   { name: "Leather Coating",              duration: "2 hr",   prices: { hatchback: 2999,  sedan: 3499,  compact_suv: 3999,  suv: 4499,   luxury: 5999  } },
  "steam-clean":    { name: "Steam Cleaning",               duration: "1 hr",   prices: { hatchback: 500,   sedan: 700,   compact_suv: 700,   suv: 1000,   luxury: 1500  } },
  "ac-sanit":       { name: "AC Vent Sanitization",         duration: "30 min", prices: { hatchback: 799,   sedan: 999,   compact_suv: 1199,  suv: 1399,   luxury: 1799  } },
  "odor-remove":    { name: "Odor Removal",                 duration: "1 hr",   prices: { hatchback: 999,   sedan: 1199,  compact_suv: 1499,  suv: 1699,   luxury: 1999  } },
  "ceramic-9h-1y":  { name: "Ceramic Coating 9H (1 Year)", duration: "8 hr",   prices: { hatchback: 12499, sedan: 14999, compact_suv: 17499, suv: 19999,  luxury: 24999 } },
  "ceramic-10h-2y": { name: "Ceramic Coating 10H (2 Year)",duration: "8 hr",   prices: { hatchback: 16499, sedan: 18999, compact_suv: 21499, suv: 23999,  luxury: 29999 } },
  "graphene":       { name: "Graphene Coating",             duration: "2 days", prices: { hatchback: 22499, sedan: 24999, compact_suv: 28499, suv: 32999,  luxury: 35999 } },
  "ppf-full-5y":    { name: "PPF Full Body (5 Year)",       duration: "3 days", prices: { hatchback: 60000, sedan: 70000, compact_suv: 70000, suv: 80000,  luxury: 90000  } },
  "ppf-full-10y":   { name: "PPF Full Body (10 Year)",      duration: "3 days", prices: { hatchback: 80000, sedan: 90000, compact_suv: 90000, suv: 100000, luxury: 100000 } },
  "ppf-matt-5y":    { name: "Matt PPF (5 Year)",            duration: "3 days", prices: { hatchback: 65000, sedan: 75000, compact_suv: 75000, suv: 85000,  luxury: 95000  } },
  "underbody":      { name: "Underbody Coating",            duration: "3 hr",   prices: { hatchback: 2000,  sedan: 2000,  compact_suv: 2000,  suv: 2000,   luxury: null  } },
  "glass-coat":     { name: "Glass Coating",                duration: "2 hr",   prices: { hatchback: 1000,  sedan: 1000,  compact_suv: 1000,  suv: 1000,   luxury: 1000  } },
  "headlight":      { name: "Headlight Restoration",        duration: "1 hr",   prices: { hatchback: 799,   sedan: 999,   compact_suv: 1199,  suv: 1399,   luxury: 1799  } },
  "alloy-coat":     { name: "Alloy Wheel Coating",          duration: "2 hr",   prices: { hatchback: 399,   sedan: 499,   compact_suv: 599,   suv: 699,    luxury: 899   } },
};
