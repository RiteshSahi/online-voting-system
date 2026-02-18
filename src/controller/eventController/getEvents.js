import { prisma } from "../../config/db.js";

const derivePhase = (event) => {
  const now = new Date();

  if (now < event.candidateDeadline) return "APPLICATION";
  if (now < event.votingStart) return "VERIFICATION";
  if (now <= event.votingEnd) return "VOTING";
  return "CLOSED";
};

export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" }
    });

    const enriched = events.map(e => ({
      ...e,
      computedPhase: derivePhase(e)
    }));

    res.json(enriched);

  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
