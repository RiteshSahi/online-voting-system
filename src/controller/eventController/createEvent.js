import { prisma } from "../../config/db.js";
import { createNotificationsForUsers } from "../../utils/notificationHelper.js";
import { validateEventTimeline } from "../../utils/timelineValidator.js";
import { derivePhase } from "../../utils/eventPhasee.js"; // ← import here

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

    const appEnd = new Date(candidateDeadline);
    const voteStart = new Date(votingStart);
    const voteEnd = new Date(votingEnd);

    const error = validateEventTimeline({
      applicationStart: new Date(0),
      applicationEnd: appEnd,
      votingStart: voteStart,
      votingEnd: voteEnd
    });

    if (error) return res.status(400).json({ message: error });

    const event = await prisma.event.create({
      data: {
        title,
        description,
        allowedDept,
        allowedBatch,
        candidateDeadline: appEnd,
        votingStart: voteStart,
        votingEnd: voteEnd
      }
    });

    // Calculate current phase
    const currentPhase = derivePhase(event);

    // Notify users
    await createNotificationsForUsers(event);

    res.json({
      message: "Event created and notifications sent",
      event,
      phase: currentPhase // ← include phase
    });

  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
