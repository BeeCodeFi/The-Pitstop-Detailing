import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

/**
 * Edge-safe auth config — no Prisma/Node.js imports.
 * Used by middleware.ts (runs on Vercel Edge runtime).
 * The full auth.ts spreads this and adds the Prisma adapter + providers.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    authorized({
      auth,
      request: { nextUrl },
    }: {
      auth: Session | null;
      request: { nextUrl: URL };
    }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string } | undefined)?.role;
      const pathname = nextUrl.pathname;

      // Protect admin routes
      if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        if (!isLoggedIn || role !== "ADMIN") {
          return NextResponse.redirect(new URL("/admin/login", nextUrl));
        }
      }

      // Protect customer routes
      if (pathname.startsWith("/booking") || pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) {
          return NextResponse.redirect(
            new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, nextUrl)
          );
        }
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
