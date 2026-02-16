import express from "express";
import { createEvent, getEvents } from "../controller/eventController/eventController.js";
import { protectAdmin, superAdminOnly  } from "../middleware/adminAuth.middleware.js";
import { updateEventPhase } from "../controller/eventController/eventController.js";
import { getNotifications, markNotificationRead } from "../controller/eventController/notificationController.js";
import { protectUser } from "../middleware/userAuth.midlleware.js";

const router = express.Router();

router.post("/", protectAdmin, superAdminOnly, createEvent);
router.get("/", getEvents);
router.patch(
  "/:id/phase",
  protectAdmin, superAdminOnly,updateEventPhase
);

router.get("/notifications", protectUser, getNotifications);
router.patch("/notifications/:id/read", protectUser, markNotificationRead);

export default router;
