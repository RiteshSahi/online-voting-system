import { prisma } from "../../config/db.js";

// Apply as candidate
export const applyAsCandidate = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Fixed here
    const { eventId } = req.params;

    // 1️⃣ Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) }
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2️⃣ Check event phase
    if (event.phase !== "APPLICATION") {
      return res.status(400).json({ message: "Event is not in application phase" });
    }

    // 3️⃣ Check eligibility
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (
      (event.allowedDept && user.department !== event.allowedDept) ||
      (event.allowedBatch && user.batch !== event.allowedBatch) ||
      (event.yearRestriction && user.year !== event.yearRestriction)
    ) {
      return res.status(403).json({ message: "You are not eligible for this event" });
    }

    // 4️⃣ Check if already applied
    const existingCandidate = await prisma.candidate.findUnique({
      where: { userId_eventId: { userId, eventId: Number(eventId) } }
    });

    if (existingCandidate) {
      return res.status(400).json({ message: "You have already applied for this event" });
    }

    // 5️⃣ Create candidate application
    const candidate = await prisma.candidate.create({
      data: {
        userId,
        eventId: Number(eventId),
        status: "PENDING"
      }
    });

    res.json({
      message: "Candidate application submitted",
      candidate
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
