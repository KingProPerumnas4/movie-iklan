import "dotenv/config";
import { PrismaClient } from "../app/lib/prisma-client/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("kingprop4w", 10);

  await prisma.admin.upsert({
    where: { username: "smartspartacus" },
    update: { password: hashedPassword },
    create: {
      username: "smartspartacus",
      password: hashedPassword,
    },
  });

  console.log("Admin berhasil dibuat");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
