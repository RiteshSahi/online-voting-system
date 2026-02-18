import { prisma } from "../../config/db.js";

export const extendApplicationDeadline = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { newDeadline } = req.body;

    if (!newDeadline) {
      return res.status(400).json({ message: "New deadline is required" });
    }

    const event = await prisma.event.findUnique({ where: { id: Number(eventId) } });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const updatedEvent = await prisma.event.update({
      where: { id: Number(eventId) },
      data: { candidateDeadline: new Date(newDeadline) }
    });

    res.json({ message: "Application deadline extended", event: updatedEvent });
  } catch (error) {
    console.error("Extend deadline error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
