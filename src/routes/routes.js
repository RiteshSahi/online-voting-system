import express from 'express';
import userRouter from './users.route.js';
import adminRouter from './admins.route.js';
import otpRoutes from "./otp.route.js";
import eventRouter from "./events.route.js";
import candidateRoutes from "./candidateRoutes.js";


console.log("Main routes loaded");

const router = express.Router();

router.use('/users', userRouter);
router.use('/admins', adminRouter);
router.use("/otp", otpRoutes);
router.use("/events", eventRouter);
router.use("/candidates", candidateRoutes);


export default router;