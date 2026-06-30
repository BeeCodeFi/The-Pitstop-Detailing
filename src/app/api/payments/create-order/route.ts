import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, bookingId } = await request.json();

    if (!amount || !bookingId) {
      return NextResponse.json(
        { error: "Amount and booking ID are required" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let order;

    if (keyId && keySecret) {
      const Razorpay = (await import("razorpay")).default;
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      // amount is in paise (1 INR = 100 paise)
      order = await razorpay.orders.create({
        amount: amount,
        currency: "INR",
        receipt: bookingId,
      });
    } else {
      // Fallback/Mock mode for Pay at Studio if credentials aren't set yet
      order = {
        id: `order_${Date.now()}_mock`,
        amount: amount,
        currency: "INR",
        receipt: bookingId,
        status: "created",
      };
    }

    // Save payment record to DB in PENDING status
    try {
      await prisma.payment.create({
        data: {
          bookingId: bookingId,
          razorpayOrderId: order.id,
          amount: amount,
          status: "PENDING",
        },
      });
    } catch (dbErr) {
      console.error("[payments] Failed to log payment transaction to DB:", dbErr);
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
