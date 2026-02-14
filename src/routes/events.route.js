import express from "express";
import { createEvent, getEvents } from "../controller/eventController/eventController.js";
import { protectAdmin, superAdminOnly  } from "../middleware/adminAuth.middleware.js";

const router = express.Router();

router.post("/", protectAdmin, superAdminOnly, createEvent);
router.get("/", getEvents);

export default router;
