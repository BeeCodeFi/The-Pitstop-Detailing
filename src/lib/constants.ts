// Site-wide constants
export const SITE_CONFIG = {
  name: "The Pitstop Detailing",
  tagline: "Where Performance Meets Perfection",
  description:
    "Premium car detailing services with ceramic coating, PPF, interior restoration, and vehicle pickup & delivery. Book your appointment online.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  phone: "+91 92632 49195",
  email: "thepitstopdetailingstudio@gmail.com",
  address: "Bargain Road, Ranchi, Jharkhand",
  socials: {
    instagram: "https://instagram.com/thepitstopdetailing",
    facebook: "https://facebook.com/thepitstopdetailing",
    youtube: "https://youtube.com/@thepitstopdetailing",
    google: "https://g.page/thepitstopdetailing",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const PICKUP_STATUS = {
  SCHEDULED: "SCHEDULED",
  PICKED_UP: "PICKED_UP",
  IN_SERVICE: "IN_SERVICE",
  READY: "READY",
  DELIVERED: "DELIVERED",
} as const;

export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  STAFF: "STAFF",
  ADMIN: "ADMIN",
} as const;
