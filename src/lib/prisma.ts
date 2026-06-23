import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn(
      "[prisma] DATABASE_URL is not set — database features are disabled."
    );
    return null;
  }
  const adapter = new PrismaPg(connectionString);
  return new PrismaClient({ adapter });
}

const client = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && client) {
  globalForPrisma.prisma = client;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const prisma = client!;
