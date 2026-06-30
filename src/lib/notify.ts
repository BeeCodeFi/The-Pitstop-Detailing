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

export async function sendWhatsApp(message: string) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_BUSINESS_NUMBER; // your business WhatsApp number in E.164 format e.g. 919876543210

  if (!token || !phoneNumberId || !to) {
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

// ─── Booking Confirmation ──────────────────────────────────────────────────────

export async function notifyNewBooking({
  customerName,
  customerEmail,
  service,
  vehicle,
  date,
  timeSlot,
  pickupAddress,
  totalAmount,
  bookingId,
}: {
  customerName: string;
  customerEmail: string;
  service: string;
  vehicle: string;
  date: string;
  timeSlot: string;
  pickupAddress?: string;
  totalAmount: number;
  bookingId: string;
}) {
  const formattedAmount = `₹${(totalAmount / 100).toLocaleString("en-IN")}`;
  const pickup = pickupAddress ? `Pickup: ${pickupAddress}` : "Drop-off at studio";

  // Email to customer
  await sendEmail({
    to: customerEmail,
    subject: "Booking Confirmed — The Pitstop Detailing",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#0a0a0a;color:#fff;border-radius:12px;overflow:hidden">
        <div style="background:#e31b23;padding:24px 32px">
          <h1 style="margin:0;font-size:22px;font-weight:800;letter-spacing:1px">THE PITSTOP DETAILING</h1>
          <p style="margin:4px 0 0;opacity:.8;font-size:13px">Booking Confirmation</p>
        </div>
        <div style="padding:32px">
          <p style="margin:0 0 24px">Hi <strong>${customerName}</strong>, your booking is confirmed! 🎉</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#999;width:40%">Booking ID</td><td style="padding:8px 0;font-family:monospace;color:#e31b23">${bookingId.slice(-8).toUpperCase()}</td></tr>
            <tr><td style="padding:8px 0;color:#999">Service</td><td style="padding:8px 0">${service}</td></tr>
            <tr><td style="padding:8px 0;color:#999">Vehicle</td><td style="padding:8px 0">${vehicle}</td></tr>
            <tr><td style="padding:8px 0;color:#999">Date & Time</td><td style="padding:8px 0">${date} at ${timeSlot}</td></tr>
            <tr><td style="padding:8px 0;color:#999">Delivery</td><td style="padding:8px 0">${pickup}</td></tr>
            <tr><td style="padding:8px 0;color:#999;border-top:1px solid #222">Total</td><td style="padding:8px 0;font-weight:800;font-size:18px;color:#e31b23;border-top:1px solid #222">${formattedAmount}</td></tr>
          </table>
          <p style="margin:24px 0 0;font-size:13px;color:#666">Questions? Reply to this email or WhatsApp us at the number on our website.</p>
        </div>
      </div>
    `,
  });

  // Email alert to business
  await sendEmail({
    to: BUSINESS_EMAIL,
    subject: `New Booking — ${service} (${date})`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#e31b23">New Booking Alert 🚗</h2>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Vehicle:</strong> ${vehicle}</p>
        <p><strong>Date:</strong> ${date} at ${timeSlot}</p>
        <p><strong>Delivery:</strong> ${pickup}</p>
        <p><strong>Amount:</strong> ${formattedAmount}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
      </div>
    `,
  });

  // WhatsApp alert to business
  await sendWhatsApp(
    `🚗 *New Booking — The Pitstop*\n\n` +
    `*Customer:* ${customerName}\n` +
    `*Service:* ${service}\n` +
    `*Vehicle:* ${vehicle}\n` +
    `*Date:* ${date} at ${timeSlot}\n` +
    `*${pickup}*\n` +
    `*Amount:* ${formattedAmount}\n` +
    `*ID:* ${bookingId.slice(-8).toUpperCase()}`
  );
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
