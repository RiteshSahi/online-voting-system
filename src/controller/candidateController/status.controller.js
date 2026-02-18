import { prisma } from "../../config/db.js";
// Get logged-in user's candidate application status
export const getMyCandidateStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await prisma.candidate.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            phase: true
          }
        }
      }
    });

    res.json({
      total: applications.length,
      applications
    });

  } catch (error) {
    console.error("Get my candidate status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


