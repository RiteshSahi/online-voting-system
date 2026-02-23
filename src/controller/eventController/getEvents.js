import { prisma } from "../../config/db.js";
import { derivePhase } from "../../utils/eventPhasee.js";

export const getAdminEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" }
    });

    const enriched = events.map(e => ({
      ...e,
      phase: derivePhase(e)
    }));

    res.json(enriched);

  } catch (error) {
    console.error("Admin get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserEvents = async (req, res) => {
  try {

    const filter = {
      allowedDept: { equals: req.user.department, mode: "insensitive" },
      allowedBatch: { equals: req.user.batch, mode: "insensitive" },
      candidateDeadline: { gt: new Date() }, 
      // NOT: {
      //   candidates: {
      //     some: { userId: req.user.id }
      //   }
      // }
    };
    console.log("Event filter for user:", filter);
    const events = await prisma.event.findMany({
      where: filter,
      orderBy: { createdAt: "desc" }
    });

    const enriched = events.map(e => ({
      ...e,
      phase: derivePhase(e)
    }));

    res.json(enriched);

  } catch (error) {
    console.error("User get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};