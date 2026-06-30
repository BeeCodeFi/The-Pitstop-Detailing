import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcryptjs from "bcryptjs";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

const ADMIN_EMAIL = "thepitstopdetailingstudio@gmail.com";

// Build provider list — only include Google OAuth when credentials are configured
const providers = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

providers.push(
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      if (!prisma) return null;

      const email = credentials.email as string;
      const password = credentials.password as string;

      try {
        // ── Admin fast-path ───────────────────────────────────────────────────
        // Only the fixed admin email can log in through here.
        // Password is compared against ADMIN_PASSWORD env var (timing-safe).
        if (email === ADMIN_EMAIL) {
          const adminPassword = process.env.ADMIN_PASSWORD;
          if (!adminPassword) return null;

          const inputBuf = Buffer.from(password);
          const expectedBuf = Buffer.from(adminPassword);
          const match =
            inputBuf.length === expectedBuf.length &&
            timingSafeEqual(inputBuf, expectedBuf);
          if (!match) return null;

          // Auto-upsert the admin user so they always have the ADMIN role
          const adminUser = await prisma.user.upsert({
            where: { email: ADMIN_EMAIL },
            update: { role: "ADMIN" },
            create: {
              email: ADMIN_EMAIL,
              name: "The Pitstop Admin",
              role: "ADMIN",
              password: await bcryptjs.hash(adminPassword, 12),
            },
          });

          return {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            image: adminUser.image,
            role: "ADMIN" as string,
          };
        }

        // ── Regular customer login ────────────────────────────────────────────
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValid = await bcryptjs.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      } catch {
        return null;
      }
    },
  })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...(prisma ? { adapter: PrismaAdapter(prisma) } : {}),
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
        token.id = user.id;
      }
      // For OAuth (Google), fetch role from DB on first sign-in
      if (account && account.provider !== "credentials" && token.email && !token.role) {
        try {
          const dbUser = await prisma?.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, role: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
          }
        } catch { /* non-fatal */ }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as { role: string }).role =
          token.role as string;
      }
      return session;
    },
  },
});
