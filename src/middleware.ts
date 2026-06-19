import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  // Admin & dashboard guards disabled for preview
  // if (pathname.startsWith("/admin")) {
  //   if (!isLoggedIn || userRole !== "ADMIN") {
  //     return NextResponse.redirect(new URL("/login", req.nextUrl));
  //   }
  // }
  // if (pathname.startsWith("/dashboard")) {
  //   if (!isLoggedIn) {
  //     return NextResponse.redirect(new URL("/login", req.nextUrl));
  //   }
  // }

  // Booking routes are currently open for preview
  // if (pathname.startsWith("/booking") && !isLoggedIn) {
  //   return NextResponse.redirect(new URL("/login", req.nextUrl));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [],
};
