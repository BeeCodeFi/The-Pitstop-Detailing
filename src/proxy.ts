import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export async function proxy(req: NextRequest) {
  // Forward pathname as a request header so server components (root layout) can read it
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  const session = await auth();
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
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.nextUrl));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
