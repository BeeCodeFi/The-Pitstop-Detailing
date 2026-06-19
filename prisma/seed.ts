import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcryptjs from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = "admin@thepitstopdetailing.com";
const ADMIN_PASSWORD = "Admin@Pitstop2026";
const ADMIN_NAME = "Admin";

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existing) {
    // Update to admin if not already
    if (existing.role !== "ADMIN") {
      await prisma.user.update({
        where: { email: ADMIN_EMAIL },
        data: { role: "ADMIN" },
      });
      console.log("✓ Existing user promoted to ADMIN");
    } else {
      console.log("✓ Admin account already exists");
    }
    return;
  }

  const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 12);

  await prisma.user.create({
    data: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✓ Admin account created");
  console.log(`  Email: ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
