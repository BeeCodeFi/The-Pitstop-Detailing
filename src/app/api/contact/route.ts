import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { notifyContactForm } from "@/lib/notify";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Log contact submission
    console.log("Contact form submission received:", parsed.data);

    // Trigger Email & WhatsApp notifications
    try {
      await notifyContactForm({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || undefined,
        subject: parsed.data.subject,
        message: parsed.data.message,
      });
    } catch (notifyErr) {
      console.error("[contact] Failed to send contact notifications:", notifyErr);
    }

    return NextResponse.json(
      { message: "Message received! We'll get back to you within 24 hours." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
