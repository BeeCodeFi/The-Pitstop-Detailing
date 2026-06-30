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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = user.role ?? "CUSTOMER";
        token.id = user.id;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
