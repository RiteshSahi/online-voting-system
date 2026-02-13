import { PrismaClient } from "@prisma/client";

// Create Prisma Client instance
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error'] 
        : ['error'],
    errorFormat: 'minimal',
});

// Database connection handler
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
};

// Check database connection health
const checkConnection = async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (error) {
        console.error("Database health check failed:", error.message);
        return false;
    }
};

// Graceful shutdown handler
const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    try {
        await prisma.$disconnect();
        console.log("✅ Database disconnected successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error during shutdown:", error.message);
        process.exit(1);
    }
};

// Handle process termination signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Handle unhandled rejections
process.on("unhandledRejection", async (error) => {
    console.error("Unhandled Rejection:", error);
    await shutdown("UNHANDLED_REJECTION");
});

// Connect to database on module load
connectDB();

export { prisma, checkConnection };