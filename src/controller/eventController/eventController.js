import { prisma } from "../../config/db.js";
import { canTransition } from "../../utils/eventLifeCycle.js";
import { createNotificationsForUsers } from "../../utils/notificationHelper.js";

// CREATE EVENT — super admin
export const createEvent = async (req, res) => {
  try {
    console.log("=== CREATE EVENT DEBUG ===");
    console.log("req.body:", req.body);
    console.log("req.headers:", req.headers);
    console.log("Content-Type:", req.get('content-type'));
    console.log("========================");

    const {
      title,
      description,
      allowedDept,
      allowedBatch,
      candidateDeadline,
      votingStart,
      votingEnd
    } = req.body;

    
    // ✅ ADD VALIDATION HERE
    if (!title || !candidateDeadline || !votingStart || !votingEnd) {
      return res.status(400).json({
        message: "Missing required fields"
      });
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

    res.json({
      message: "Event created",
      event
    });

     // ✅ Create notifications for eligible users
    await createNotificationsForUsers(event);

    res.json({ message: "Event created and notifications sent", event });

    

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

  
};


   

// GET EVENTS
export const getEvents = async (req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" }
  });

  res.json(events);
};
// UPDATE EVENT PHASE
export const updateEventPhase = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPhase } = req.body;

    // ✅ Phase validation
    const validPhases = [
      "APPLICATION",
      "VERIFICATION",
      "VOTING",
      "CLOSED"
    ];

    if (!validPhases.includes(newPhase)) {
      return res.status(400).json({
        message: "Invalid phase value"
      });
    }


    const event = await prisma.event.findUnique({
      where: { id: Number(id) }
    });

    if (!event)
      return res.status(404).json({
        message: "Event not found"
      });

    // ✅ THIS IS WHERE YOUR CHECK GOES
    if (!canTransition(event.phase, newPhase)) {
      return res.status(400).json({
        message: "Invalid transition"
      });
    }

    const updated = await prisma.event.update({
      where: { id: Number(id) },
      data: { phase: newPhase }
    });

    res.json({
      message: "Phase updated",
      event: updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

