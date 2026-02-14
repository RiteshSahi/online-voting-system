import { prisma } from "../../config/db.js";

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
      yearRestriction,
      candidateDeadline,
      votingStart,
      votingEnd
    } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        allowedDept,
        allowedBatch,
        yearRestriction,
        candidateDeadline: new Date(candidateDeadline),
        votingStart: new Date(votingStart),
        votingEnd: new Date(votingEnd)
      }
    });

    res.json({
      message: "Event created",
      event
    });

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
