import { prisma } from "../../config/db.js";
import { derivePhase } from "../../utils/eventPhasee.js";

export const getEvents = async (req, res) => {
  try {
    let filter = {};

    // Admin sees all events
    if (req.user && !req.admin) {
      filter = {
        allowedDept: { equals: req.user.department, mode: "insensitive" },
        allowedBatch: { equals: req.user.batch, mode: "insensitive" },
        candidateDeadline: { gt: new Date() }, // application still open
        NOT: {
          candidates: { some: { userId: req.user.id } } // user hasn't applied yet
        }
      };
    }

    const events = await prisma.event.findMany({
      where: filter,
      orderBy: { createdAt: "desc" }
    });

    const enriched = events.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      allowedDept: e.allowedDept,
      allowedBatch: e.allowedBatch,
      candidateDeadline: e.candidateDeadline,
      votingStart: e.votingStart,
      votingEnd: e.votingEnd,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      phase: derivePhase(e) // dynamic phase
    }));

    res.json(enriched);

  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
