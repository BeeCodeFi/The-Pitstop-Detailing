import { NextResponse } from "next/server";

// ── Realistic mock bookings ────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
  {
    id: "clx1a2b3c4d5e6f7g",
    status: "CONFIRMED",
    totalAmount: 15000_00,
    notes: "Please use ceramic-safe shampoo for the wheels.",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    user: { id: "u1", name: "Arjun Mehta", email: "arjun.mehta@gmail.com", phone: "+91 98765 43210" },
    vehicle: { make: "Toyota", model: "Fortuner", year: 2023, color: "Pearl White", plateNumber: "MH 12 AB 1234" },
    timeSlot: { date: new Date(Date.now() + 1 * 86400000).toISOString(), startTime: "10:00" },
    pickup: null,
  },
  {
    id: "clx2b3c4d5e6f7g8h",
    status: "PENDING",
    totalAmount: 8500_00,
    notes: null,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    user: { id: "u2", name: "Priya Sharma", email: "priya.sharma@outlook.com", phone: "+91 87654 32109" },
    vehicle: { make: "Honda", model: "City", year: 2022, color: "Lunar Silver", plateNumber: "DL 3C CD 5678" },
    timeSlot: { date: new Date(Date.now() + 2 * 86400000).toISOString(), startTime: "14:00" },
    pickup: { pickupAddress: "12 Andheri East, Near Station", pickupCity: "Mumbai", status: "SCHEDULED" },
  },
  {
    id: "clx3c4d5e6f7g8h9i",
    status: "IN_PROGRESS",
    totalAmount: 32000_00,
    notes: "Going for the full ceramic coating package. Handle with care!",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    user: { id: "u3", name: "Rahul Verma", email: "rahul.verma@company.in", phone: "+91 76543 21098" },
    vehicle: { make: "BMW", model: "3 Series", year: 2024, color: "Portimao Blue", plateNumber: "KA 05 MN 9012" },
    timeSlot: { date: new Date().toISOString(), startTime: "09:00" },
    pickup: null,
  },
  {
    id: "clx4d5e6f7g8h9i0j",
    status: "COMPLETED",
    totalAmount: 5500_00,
    notes: null,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    user: { id: "u4", name: "Sneha Iyer", email: "sneha.iyer@gmail.com", phone: "+91 65432 10987" },
    vehicle: { make: "Hyundai", model: "Creta", year: 2021, color: "Typhoon Silver", plateNumber: "TN 09 PQ 3456" },
    timeSlot: { date: new Date(Date.now() - 4 * 86400000).toISOString(), startTime: "11:30" },
    pickup: null,
  },
  {
    id: "clx5e6f7g8h9i0j1k",
    status: "CANCELLED",
    totalAmount: 12000_00,
    notes: "Customer requested rescheduling.",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    user: { id: "u5", name: "Karan Patel", email: "karan.patel@hotmail.com", phone: "+91 54321 09876" },
    vehicle: { make: "Tata", model: "Nexon EV", year: 2023, color: "Flame Red", plateNumber: "GJ 01 UV 7890" },
    timeSlot: { date: new Date(Date.now() - 6 * 86400000).toISOString(), startTime: "13:00" },
    pickup: { pickupAddress: "45 SG Highway, Sola", pickupCity: "Ahmedabad", status: "SCHEDULED" },
  },
  {
    id: "clx6f7g8h9i0j1k2l",
    status: "CONFIRMED",
    totalAmount: 22500_00,
    notes: null,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    user: { id: "u6", name: "Divya Nair", email: "divya.nair@gmail.com", phone: "+91 43210 98765" },
    vehicle: { make: "Mercedes", model: "C-Class", year: 2023, color: "Obsidian Black", plateNumber: "MH 01 AB 0001" },
    timeSlot: { date: new Date(Date.now() + 3 * 86400000).toISOString(), startTime: "08:30" },
    pickup: null,
  },
];

export async function GET(request: Request) {
  // ── Mock mode (no DB) ──────────────────────────────────────────────────────
  if (!process.env.DATABASE_URL) {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const filtered = statusFilter
      ? MOCK_BOOKINGS.filter((b) => b.status === statusFilter)
      : MOCK_BOOKINGS;

    const total = filtered.length;
    const paged = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      bookings: paged,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }

  // ── Production ─────────────────────────────────────────────────────────────
  try {
    const { auth } = await import("@/lib/auth");
    const { prisma } = await import("@/lib/prisma");

    const session = await auth();
    const user = session?.user as { id: string; role?: string } | undefined;
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";

    const validStatuses = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
    type BookingStatus = typeof validStatuses[number];
    const where = status && validStatuses.includes(status as BookingStatus)
      ? { status: status as BookingStatus }
      : {};

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          vehicle: true,
          timeSlot: true,
          payment: true,
          pickup: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  // ── Mock mode (no DB) ──────────────────────────────────────────────────────
  if (!process.env.DATABASE_URL) {
    const body = await request.json();
    return NextResponse.json({ message: "Booking updated (mock)", booking: body });
  }

  // ── Production ─────────────────────────────────────────────────────────────
  try {
    const { auth } = await import("@/lib/auth");
    const { prisma } = await import("@/lib/prisma");

    const session = await auth();
    const user = session?.user as { id: string; role?: string } | undefined;
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ error: "bookingId and status are required" }, { status: 400 });
    }

    const validPatchStatuses = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
    type PatchStatus = typeof validPatchStatuses[number];
    if (!validPatchStatuses.includes(status as PatchStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as PatchStatus },
      include: { user: { select: { name: true, email: true } }, vehicle: true },
    });

    return NextResponse.json({ message: "Booking updated", booking });
  } catch {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
