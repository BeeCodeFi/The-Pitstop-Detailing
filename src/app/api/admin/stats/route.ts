import { NextResponse } from "next/server";

const MOCK_STATS = {
  totalUsers: 142,
  totalBookings: 318,
  pendingBookings: 12,
  totalRevenue: 284500_00, // in paise → ₹2,84,500
};

export async function GET() {
  // ── Mock mode (no DB) ──────────────────────────────────────────────────────
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ stats: MOCK_STATS });
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

    const [totalUsers, totalBookings, pendingBookings, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ["CONFIRMED", "COMPLETED", "IN_PROGRESS"] } },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalBookings,
        pendingBookings,
        totalRevenue: revenue._sum.totalAmount || 0,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
