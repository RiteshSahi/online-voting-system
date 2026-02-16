import { prisma } from "../config/db.js";

export const createNotificationsForUsers = async (event) => {
  const eligibleUsers = await prisma.user.findMany({
    where: {
      department: event.allowedDept,
      batch: event.allowedBatch
    }
  });

  const notifications = eligibleUsers.map(user => ({
    userId: user.id,
    title: `New Event: ${event.title}`,
    message: `A new event has been created. Apply before ${event.candidateDeadline}`
  }));

  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications });
  }
};
