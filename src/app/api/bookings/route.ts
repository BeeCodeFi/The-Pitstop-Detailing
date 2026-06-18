import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { serviceId, vehicle, date, timeSlot, needsPickup, pickup, notes } = parsed.data;

    // Validate pickup data if needed
    if (needsPickup && !pickup) {
      return NextResponse.json(
        { error: "Pickup address is required when pickup is selected" },
        { status: 400 }
      );
    }

    // Create or find vehicle
    const userVehicle = await prisma.vehicle.create({
      data: {
        userId: session.user.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color || null,
        plateNumber: vehicle.plateNumber || null,
        vehicleType: vehicle.vehicleType,
      },
    });

    // Create or find time slot
    const slotDate = new Date(date);
    const [startTime] = timeSlot.split(" - ");

    let slot = await prisma.timeSlot.findUnique({
      where: {
        date_startTime: {
          date: slotDate,
          startTime: startTime,
        },
      },
    });

    if (!slot) {
      slot = await prisma.timeSlot.create({
        data: {
          date: slotDate,
          startTime: startTime,
          endTime: startTime, // Will be calculated based on service duration
        },
      });
    }

    // Get service price (use a lookup map for now)
    const servicePrices: Record<string, number> = {
      essential: 249900,
      premium: 599900,
      ultimate: 1199900,
      ceramic: 1499900,
      "ppf-front": 2999900,
      "ppf-full": 9999900,
    };

    const totalAmount = servicePrices[serviceId] || 0;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        vehicleId: userVehicle.id,
        timeSlotId: slot.id,
        totalAmount,
        notes: notes || null,
        status: "PENDING",
      },
      include: {
        vehicle: true,
        timeSlot: true,
      },
    });

    // Create pickup request if needed
    if (needsPickup && pickup) {
      await prisma.pickupRequest.create({
        data: {
          bookingId: booking.id,
          pickupAddress: pickup.address,
          pickupCity: pickup.city,
          pickupPincode: pickup.pincode,
          pickupDate: slotDate,
          pickupTime: startTime,
          status: "SCHEDULED",
        },
      });
    }

    return NextResponse.json(
      {
        message: "Booking created successfully!",
        booking: {
          id: booking.id,
          status: booking.status,
          totalAmount: booking.totalAmount,
          vehicle: booking.vehicle,
          date: date,
          timeSlot: timeSlot,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        vehicle: true,
        timeSlot: true,
        payment: true,
        pickup: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
