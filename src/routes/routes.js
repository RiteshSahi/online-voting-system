import express from 'express';
import userRouter from './users.route.js';
import adminRouter from './admins.route.js';
import otpRoutes from "./otp.route.js";




const router = express.Router();

router.use('/users', userRouter);
router.use('/admins', adminRouter);
router.use("/otp", otpRoutes);


export default router;