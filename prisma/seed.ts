import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function seed() {
  const adminExists = await prisma.user.findUnique({
    where: {
      email: "admin@admin.com",
    },
  });

  if (adminExists) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await hash("admin", 6);

  await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@admin.com",
      password_hash: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin succesffully created.");
}
