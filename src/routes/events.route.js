import express from "express";
import { protectUser } from "../middleware/userAuth.midlleware.js";
import { protectAdmin, superAdminOnly  } from "../middleware/adminAuth.middleware.js";
import { createEvent } from "../controller/eventController/createEvent.js";
import { getUserEvents,getAdminEvents } from "../controller/eventController/getEvents.js";
import { extendApplicationDeadline } from "../controller/eventController/extendDeadline.js";
import { updateEventPhase } from "../controller/eventController/updateEventPhase.js";
import { getNotifications, markNotificationRead } from "../controller/eventController/notificationController.js";


const router = express.Router();

router.post("/", protectAdmin, superAdminOnly, createEvent);
router.get("/user", protectUser, getUserEvents);//for user
router.get("/admin", protectAdmin, getAdminEvents);//for admin
router.patch(
  "/:id/phase",
  protectAdmin, superAdminOnly,updateEventPhase
);

router.get("/notifications", protectUser, getNotifications);
router.patch("/notifications/:id/read", protectUser, markNotificationRead);
router.put("/:eventId/extend-deadline",protectAdmin,superAdminOnly, extendApplicationDeadline);
export default router;
