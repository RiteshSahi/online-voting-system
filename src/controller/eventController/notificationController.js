import { prisma } from "../../config/db.js";

// Get notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.notification.update({
      where: { id: Number(id) },
      data: { read: true }
    });

    res.json({ message: "Notification marked read", notification: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
