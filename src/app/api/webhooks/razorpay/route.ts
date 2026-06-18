import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      // Update payment record
      await prisma.payment.updateMany({
        where: { razorpayOrderId: payment.order_id },
        data: {
          razorpayPaymentId: payment.id,
          status: "PAID",
          method: payment.method,
        },
      });

      // Update booking status
      const paymentRecord = await prisma.payment.findFirst({
        where: { razorpayOrderId: payment.order_id },
      });

      if (paymentRecord) {
        await prisma.booking.update({
          where: { id: paymentRecord.bookingId },
          data: { status: "CONFIRMED" },
        });
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;

      await prisma.payment.updateMany({
        where: { razorpayOrderId: payment.order_id },
        data: {
          status: "FAILED",
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
