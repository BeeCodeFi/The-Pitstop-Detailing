# Handover Details for Vercel Deployment & Setup

This document contains everything needed for another model/developer to deploy this website to Vercel and complete the integrations.

---

## 📋 Status Overview
- **Database**: Connected to Neon PostgreSQL (schema is pushed and synchronized).
- **TypeScript**: Checked and fully typed (`npx tsc --noEmit` passes).
- **Next.js Production Build**: Verified and succeeds locally (`npm run build` passes).
- **Git State**: Clean tree, all recent integration changes committed on the `develop` branch.

---

## 🔑 Environment Variables Required on Vercel

When deploying to Vercel, copy and paste these exact key-value pairs in the **Environment Variables** panel in the Vercel project settings:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_2TFnOJCb8WMr@ep-lively-mud-aoyclk52.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth (Session security & redirect URI)
AUTH_SECRET="acaLhl2nnHkhEvWhy5BFt8xPlPGm7xoj6bJOUrdI6Wk"
AUTH_URL="https://thepitstopdetailing.com"

# App Globals
NEXT_PUBLIC_APP_URL="https://thepitstopdetailing.com"
NEXT_PUBLIC_APP_NAME="The Pitstop Detailing"

# Resend Email Integration (Contact Form & Booking alerts)
RESEND_API_KEY="re_..." # Generate on resend.com
RESEND_FROM_EMAIL="onboarding@resend.dev" # Change if you verify a custom domain on Resend

# WhatsApp Business API (Automated notifications to business)
WHATSAPP_API_TOKEN="EAAG..." # WhatsApp Cloud API Token
WHATSAPP_PHONE_NUMBER_ID="12345..." # Meta Phone Number ID
WHATSAPP_BUSINESS_NUMBER="919876543210" # Your target business WhatsApp number (with country code, no +)

# Razorpay Payment Integration (Live payments)
RAZORPAY_KEY_ID="rzp_..." # Razorpay API Key ID
RAZORPAY_KEY_SECRET="sec_..." # Razorpay API Secret
RAZORPAY_WEBHOOK_SECRET="whsec_..." # Webhook Secret (Set up hook pointing to /api/webhooks/razorpay)

# Google OAuth Integration (Google Login button)
AUTH_GOOGLE_ID="google-client-id"
AUTH_GOOGLE_SECRET="google-client-secret"
```

---

## 🛠️ Code Architecture

- **`vercel.json`**: Ensures `npx prisma generate` runs automatically before building the Next.js bundle on Vercel.
- **`src/lib/services.ts`**: Contains the single source of truth for services and pricing tiers across Hatchbacks, Sedans, Compact SUVs, SUVs, and Luxury vehicles.
- **`src/lib/notify.ts`**: Handles dispatching formatted HTML receipts via **Resend** and plaintext booking summaries via **WhatsApp**.
- **`src/app/api/payments/create-order/route.ts`**: Automatically detects if `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set. If not, it falls back to a mock order enabling a **Pay at Studio** option.
