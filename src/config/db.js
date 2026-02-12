import { PrismaClient } from "@prisma/client"; 
const prisma = new PrismaClient(
{
    log: process.env.NODE_ENV === "development" 
    ? ["query", "warn", "error"]
    : ["error"]

}
);

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1); // Exit the process with an error code
    }
};

const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log("Database disconnected successfully");
    } catch (error) {
        console.error("Database disconnection error:", error.message);
    }
};

export { prisma, connectDB, disconnectDB };