import express from 'express';
import userRouter from './users.route.js';
import adminRouter from './admins.route.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/admins', adminRouter);


export default router;