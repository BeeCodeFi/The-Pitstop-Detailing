import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Set pathname header for root layout to detect admin routes
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  // Protect admin routes (except admin login page)
  // TODO: Re-enable before production
  // if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
  //   if (!isLoggedIn || userRole !== "ADMIN") {
  //     return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  //   }
  // }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
