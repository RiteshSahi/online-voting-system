import { prisma } from "../../config/db.js";
import { createNotificationsForUsers } from "../../utils/notificationHelper.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      allowedDept,
      allowedBatch,
      candidateDeadline,
      votingStart,
      votingEnd
    } = req.body;

    if (!title || !candidateDeadline || !votingStart || !votingEnd) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        allowedDept,
        allowedBatch,
        candidateDeadline: new Date(candidateDeadline),
        votingStart: new Date(votingStart),
        votingEnd: new Date(votingEnd)
      }
    });

    // Send notifications to eligible users
    await createNotificationsForUsers(event);

    res.json({ message: "Event created and notifications sent", event });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
