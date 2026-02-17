import express from "express";
import { applyAsCandidate } from "../controller/candidateController/candidateController.js";
import { protectUser } from "../middleware/userAuth.midlleware.js"; // JWT check for students
import { upload } from "../utils/upload.js";
const router = express.Router();

// Apply as candidate
router.post("/:eventId/apply", protectUser, upload.single("photo"), applyAsCandidate);

export default router;
