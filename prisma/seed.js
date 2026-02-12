import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { prisma } from "../src/config/db.js";
import bcrypt from "bcrypt";

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: "mainadmin" }
    });

    if (existingAdmin) {
      console.log("Main admin already exists");
      await prisma.$disconnect();
      process.exit(0);
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.admin.create({
      data: {
        username: "mainadmin",
        password: hashedPassword,
        status: "APPROVED"
      }
    });

    console.log("Main admin created successfully");
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedAdmin();
