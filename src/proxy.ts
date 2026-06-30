import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/lib/auth.config";
import type { Session } from "next-auth";

type NextAuthRequest = NextRequest & { auth: Session | null };

const { auth } = NextAuth(authConfig);

// auth(handler) injects req.auth from the JWT cookie — edge-safe, no Prisma
export const proxy = auth(function proxyHandler(req: NextAuthRequest) {
  // Forward pathname as a request header so server components (root layout) can read it
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const { pathname } = req.nextUrl;

  // Protect admin routes — only ADMIN role may access (except admin login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isLoggedIn || userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }
  }

  // Protect customer routes that require login
  if (pathname.startsWith("/booking") || pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.nextUrl)
      );
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}) as (req: NextRequest) => Promise<Response>;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
