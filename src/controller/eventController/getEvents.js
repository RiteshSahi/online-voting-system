import { prisma } from "../../config/db.js";

export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
