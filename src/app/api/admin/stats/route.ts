import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user as { id: string; role?: string } | undefined;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [totalUsers, totalBookings, pendingBookings, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.aggregate({ _sum: { totalAmount: true }, where: { status: { in: ["CONFIRMED", "COMPLETED", "IN_PROGRESS"] } } }),
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
