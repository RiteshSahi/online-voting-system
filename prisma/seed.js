import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { prisma } from "../src/config/db.js";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  try {
    // Check if SUPER_ADMIN already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { role: "SUPER_ADMIN" }
    });

    if (existingAdmin) {
      console.log("SUPER_ADMIN already exists");
      await prisma.$disconnect();
      process.exit(0);
      return;
    }

    const hashedPassword = await bcrypt.hash("superadmin123", 10);

    await prisma.admin.create({
      data: {
        username: "superadmin",     // You can change the username
        password: hashedPassword,
        status: "APPROVED",
        role: "SUPER_ADMIN"         // Set role as SUPER_ADMIN
      }
    });

    console.log("SUPER_ADMIN created successfully");
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding SUPER_ADMIN:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedSuperAdmin();
