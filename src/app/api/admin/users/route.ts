import { NextResponse } from "next/server";

// ── Realistic mock users ───────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: "u1a2b3c4d5e6f7g8h",
    name: "Arjun Mehta",
    email: "arjun.mehta@gmail.com",
    phone: "+91 98765 43210",
    role: "ADMIN",
    image: null,
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
    _count: { bookings: 24, vehicles: 3 },
  },
  {
    id: "u2b3c4d5e6f7g8h9i",
    name: "Priya Sharma",
    email: "priya.sharma@outlook.com",
    phone: "+91 87654 32109",
    role: "STAFF",
    image: null,
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    _count: { bookings: 0, vehicles: 1 },
  },
  {
    id: "u3c4d5e6f7g8h9i0j",
    name: "Rahul Verma",
    email: "rahul.verma@company.in",
    phone: "+91 76543 21098",
    role: "CUSTOMER",
    image: null,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    _count: { bookings: 5, vehicles: 2 },
  },
  {
    id: "u4d5e6f7g8h9i0j1k",
    name: "Sneha Iyer",
    email: "sneha.iyer@gmail.com",
    phone: "+91 65432 10987",
    role: "CUSTOMER",
    image: null,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    _count: { bookings: 3, vehicles: 1 },
  },
  {
    id: "u5e6f7g8h9i0j1k2l",
    name: "Karan Patel",
    email: "karan.patel@hotmail.com",
    phone: "+91 54321 09876",
    role: "CUSTOMER",
    image: null,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    _count: { bookings: 1, vehicles: 1 },
  },
  {
    id: "u6f7g8h9i0j1k2l3m",
    name: "Divya Nair",
    email: "divya.nair@gmail.com",
    phone: "+91 43210 98765",
    role: "CUSTOMER",
    image: null,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    _count: { bookings: 2, vehicles: 1 },
  },
  {
    id: "u7g8h9i0j1k2l3m4n",
    name: "Vikram Singh",
    email: "vikram.singh@rediffmail.com",
    phone: "+91 32109 87654",
    role: "CUSTOMER",
    image: null,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    _count: { bookings: 7, vehicles: 4 },
  },
  {
    id: "u8h9i0j1k2l3m4n5o",
    name: "Ananya Krishnan",
    email: "ananya.krishnan@yahoo.com",
    phone: "+91 21098 76543",
    role: "CUSTOMER",
    image: null,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    _count: { bookings: 1, vehicles: 1 },
  },
  {
    id: "u9i0j1k2l3m4n5o6p",
    name: "Rohan Gupta",
    email: "rohan.gupta@gmail.com",
    phone: "+91 10987 65432",
    role: "STAFF",
    image: null,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    _count: { bookings: 0, vehicles: 0 },
  },
  {
    id: "u10j1k2l3m4n5o6p7q",
    name: null,
    email: "guest.user2024@proton.me",
    phone: null,
    role: "CUSTOMER",
    image: null,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    _count: { bookings: 0, vehicles: 0 },
  },
];

export async function GET(request: Request) {
  // ── Mock mode (no DB) ──────────────────────────────────────────────────────
  if (!process.env.DATABASE_URL) {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").toLowerCase();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const filtered = search
      ? MOCK_USERS.filter(
          (u) =>
            u.name?.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search) ||
            u.phone?.includes(search)
        )
      : MOCK_USERS;

    const total = filtered.length;
    const paged = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      users: paged,
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
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, phone: true,
          role: true, image: true, createdAt: true,
          _count: { select: { bookings: true, vehicles: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
