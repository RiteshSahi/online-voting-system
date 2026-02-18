import { prisma } from "../../config/db.js";
// List all candidates for an event
export const listCandidates = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check event exists
    const event = await prisma.event.findUnique({ where: { id: Number(eventId) } });
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Fetch candidates
    const candidates = await prisma.candidate.findMany({
      where: { eventId: Number(eventId) },
      include: { user: { select: { name: true, email: true, batch: true ,department:true} } }
    });

    res.json({ event: event.title, candidates });

  } catch (error) {
    console.error("List candidates error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//// Update candidate status (ADMIN only)
export const updateCandidateStatus = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { status } = req.body; // APPROVED or REJECTED

    // Basic validation
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id: Number(candidateId) },
      data: { status }
    });

    res.json({ message: "Candidate status updated successfully", candidate: updatedCandidate });
  } catch (error) {
    console.error("Update candidate status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};