import express from "express";
import { applyAsCandidate } from "../controller/candidateController/apply.controller.js";
import {  updateCandidateStatus ,listCandidates } from "../controller/candidateController/admin.controller.js";
import { protectUser } from "../middleware/userAuth.midlleware.js"; // JWT check for students
import { protectAdmin } from "../middleware/adminAuth.middleware.js"; // JWT check for admins
import { getMyCandidateStatus } from "../controller/candidateController/status.controller.js";

const router = express.Router();

// Apply as candidate
console.log("Candidate routes loaded");
router.post("/:eventId/apply", (req,res,next)=>{
  console.log("Apply route hit");
  next();
}, protectUser, applyAsCandidate);

// List all candidates for a specific event
router.get("/:eventId/candidates", protectUser, listCandidates);
//admin approval of students
router.patch("/:candidateId/status", protectAdmin, updateCandidateStatus);
router.get("/my-status", protectUser, getMyCandidateStatus);

export default router;