import { prisma } from "../../config/db.js";
import { canTransition } from "../../utils/eventLifeCycle.js";

export const updateEventPhase = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPhase } = req.body;

    const validPhases = ["APPLICATION", "VERIFICATION", "VOTING", "CLOSED"];
    if (!validPhases.includes(newPhase)) {
      return res.status(400).json({ message: "Invalid phase value" });
    }

    const event = await prisma.event.findUnique({ where: { id: Number(id) } });
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!canTransition(event.phase, newPhase)) {
      return res.status(400).json({ message: "Invalid transition" });
    }

    const updated = await prisma.event.update({
      where: { id: Number(id) },
      data: { phase: newPhase }
    });

    res.json({ message: "Phase updated", event: updated });
  } catch (error) {
    console.error("Update phase error:", error);
    res.status(500).json({ message: error.message });
  }
};
