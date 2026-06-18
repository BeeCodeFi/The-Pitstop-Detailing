import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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

    // In production, create a Razorpay order:
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID!,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET!,
    // });
    // const order = await razorpay.orders.create({
    //   amount: amount,
    //   currency: "INR",
    //   receipt: bookingId,
    // });

    // For now, return a mock order for development
    const mockOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      amount: amount,
      currency: "INR",
      receipt: bookingId,
      status: "created",
    };

    return NextResponse.json({ order: mockOrder }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
