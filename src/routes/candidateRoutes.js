import express from "express";
import { applyAsCandidate } from "../controller/candidateController/candidateController.js";
import { protectUser } from "../middleware/userAuth.midlleware.js"; // JWT check for students

const router = express.Router();

// Apply as candidate
router.post("/:eventId/apply", protectUser, applyAsCandidate);

export default router;
