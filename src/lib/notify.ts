/**
 * Notification utilities — Email (Resend) + WhatsApp (Meta Cloud API)
 * All functions gracefully no-op when env vars are missing.
 */

// ─── Email via Resend ──────────────────────────────────────────────────────────

const BUSINESS_EMAIL = "thepitstopdetailingstudio@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[notify] RESEND_API_KEY not set — email skipped");
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  if (error) console.error("[notify] Email send error:", error);
}

// ─── WhatsApp via Meta Cloud API ───────────────────────────────────────────────

/** Normalise an Indian phone number to E.164 (e.g. "919876543210"). Returns null if it cannot be determined. */
function normalisePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return null;
}

async function dispatchWhatsApp(to: string, message: string) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn("[notify] WhatsApp env vars not set — WhatsApp skipped");
    return;
  }

  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[notify] WhatsApp send error:", err);
  }
}

/** Send a WhatsApp message to the business WhatsApp inbox. */
export async function sendWhatsApp(message: string) {
  const to = process.env.WHATSAPP_BUSINESS_NUMBER;
  if (!to) {
    console.warn("[notify] WHATSAPP_BUSINESS_NUMBER not set — business WhatsApp skipped");
    return;
  }
  await dispatchWhatsApp(to, message);
}

/**
 * Send a WhatsApp message to a specific phone number (e.g. customer confirmation).
 * NOTE: The WhatsApp Cloud API requires an approved message template for proactive
 * outbound messages (outside a 24-hour customer-service window). Ensure a template
 * is approved in Meta Business Manager, or use this within the 24-hour window.
 */
export async function sendWhatsAppTo(phone: string, message: string) {
  const normalised = normalisePhone(phone);
  if (!normalised) {
    console.warn(`[notify] Could not normalise phone "${phone}" to E.164 — customer WhatsApp skipped`);
    return;
  }
  await dispatchWhatsApp(normalised, message);
}

// ─── Booking Enquiry Notification ─────────────────────────────────────────────

export async function notifyNewBooking({
  customerName,
  customerEmail,
  customerPhone,
  service,
  vehicle,
  date,
  timeSlot,
  pickupAddress,
  estimatedAmount,
  bookingId,
}: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  service: string;
  vehicle: string;
  date: string;
  timeSlot: string;
  pickupAddress?: string;
  estimatedAmount: number;
  bookingId: string;
}) {
  const formattedAmount = `₹${estimatedAmount.toLocaleString("en-IN")} (est. starting price)`;
  const pickup = pickupAddress ? `Pickup: ${pickupAddress}` : "Drop-off at studio";
  const shortId = bookingId.slice(-8).toUpperCase();

  // Email to customer
  await sendEmail({
    to: customerEmail,
    subject: "Booking Enquiry Received — The Pitstop Detailing",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#0a0a0a;color:#fff;border-radius:12px;overflow:hidden">
        <div style="background:#e31b23;padding:24px 32px">
          <h1 style="margin:0;font-size:22px;font-weight:800;letter-spacing:1px">THE PITSTOP DETAILING</h1>
          <p style="margin:4px 0 0;opacity:.8;font-size:13px">Booking Enquiry Received</p>
        </div>
        <div style="padding:32px">
          <p style="margin:0 0 24px">Hi <strong>${customerName}</strong>, we've received your booking enquiry! 🚗</p>
          <p style="margin:0 0 20px;font-size:14px;color:#bbb">Our team will review your request and reach out on WhatsApp within 2 hours to confirm your appointment and final pricing.</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#999;width:40%">Enquiry ID</td><td style="padding:8px 0;font-family:monospace;color:#e31b23">${shortId}</td></tr>
            <tr><td style="padding:8px 0;color:#999">Service</td><td style="padding:8px 0">${service}</td></tr>
            <tr><td style="padding:8px 0;color:#999">Vehicle</td><td style="padding:8px 0">${vehicle}</td></tr>
            <tr><td style="padding:8px 0;color:#999">Date &amp; Time</td><td style="padding:8px 0">${date} at ${timeSlot}</td></tr>
            <tr><td style="padding:8px 0;color:#999">Delivery</td><td style="padding:8px 0">${pickup}</td></tr>
            <tr><td style="padding:8px 0;color:#999;border-top:1px solid #222">Est. Starting Price</td><td style="padding:8px 0;font-weight:800;font-size:16px;color:#e31b23;border-top:1px solid #222">${formattedAmount}</td></tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#666;font-style:italic">* Final price depends on vehicle size, condition, and selected service. Our team will confirm the exact quote before service begins.</p>
          <p style="margin:16px 0 0;font-size:13px;color:#666">Questions? Reply to this email or WhatsApp us at the number on our website.</p>
        </div>
      </div>
    `,
  });

  // Email alert to business
  await sendEmail({
    to: BUSINESS_EMAIL,
    subject: `New Booking Enquiry — ${service} (${date})`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#e31b23">New Booking Enquiry 🚗</h2>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})${customerPhone ? ` | 📱 ${customerPhone}` : ""}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Vehicle:</strong> ${vehicle}</p>
        <p><strong>Date:</strong> ${date} at ${timeSlot}</p>
        <p><strong>Delivery:</strong> ${pickup}</p>
        <p><strong>Est. Starting Price:</strong> ${formattedAmount}</p>
        <p><strong>Enquiry ID:</strong> ${shortId}</p>
        <p style="color:#888;font-size:12px">Final price should be confirmed with the customer before service begins.</p>
      </div>
    `,
  });

  // WhatsApp alert to business
  await sendWhatsApp(
    `🚗 *New Booking Enquiry — The Pitstop*\n\n` +
    `*Customer:* ${customerName}\n` +
    `*Phone:* ${customerPhone || "N/A"}\n` +
    `*Email:* ${customerEmail}\n` +
    `*Service:* ${service}\n` +
    `*Vehicle:* ${vehicle}\n` +
    `*Date:* ${date} at ${timeSlot}\n` +
    `*${pickup}*\n` +
    `*Est. Starting:* ${formattedAmount}\n` +
    `*ID:* ${shortId}\n\n` +
    `_Please confirm pricing & appointment with the customer._`
  );

  // WhatsApp confirmation to customer
  if (customerPhone) {
    await sendWhatsAppTo(
      customerPhone,
      `Hi ${customerName}! 👋\n\n` +
      `We've received your booking enquiry at *The Pitstop Detailing*.\n\n` +
      `📋 *Enquiry Details*\n` +
      `Service: ${service}\n` +
      `Vehicle: ${vehicle}\n` +
      `Date: ${date} at ${timeSlot}\n` +
      `Delivery: ${pickup}\n` +
      `Est. Starting Price: ${formattedAmount}\n\n` +
      `Our team will reach out to you shortly to confirm your appointment and final pricing.\n\n` +
      `_Final price depends on vehicle size, condition, and selected service._\n\n` +
      `Ref: #${shortId}`
    );
  }
}

// ─── Contact Form Notification ─────────────────────────────────────────────────

export async function notifyContactForm({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  // Email to business
  await sendEmail({
    to: BUSINESS_EMAIL,
    subject: `New Contact Form Message from ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#e31b23">New Contact Message 📬</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:3px solid #e31b23;padding-left:16px;margin:0;color:#333">${message}</blockquote>
      </div>
    `,
  });

  // WhatsApp alert to business
  await sendWhatsApp(
    `📬 *New Contact Message — The Pitstop*\n\n` +
    `*From:* ${name}\n` +
    `*Email:* ${email}\n` +
    `${phone ? `*Phone:* ${phone}\n` : ""}` +
    `*Message:* ${message.slice(0, 200)}`
  );
}
