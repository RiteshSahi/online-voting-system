import { prisma } from "../../config/db.js";
import { createNotificationsForUsers } from "../../utils/notificationHelper.js";
import { validateEventTimeline } from "../../utils/timelineValidator.js";
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

    // Convert to Date objects once
    const appEnd = new Date(candidateDeadline);
    const voteStart = new Date(votingStart);
    const voteEnd = new Date(votingEnd);

    // ✅ Timeline validation
    const error = validateEventTimeline({
      applicationStart: new Date(0), // placeholder if you don’t track start yet
      applicationEnd: appEnd,
      votingStart: voteStart,
      votingEnd: voteEnd
    });

    if (error) {
      return res.status(400).json({ message: error });
    }

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

    // Notify users
    await createNotificationsForUsers(event);

    res.json({
      message: "Event created and notifications sent",
      event
    });

  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
