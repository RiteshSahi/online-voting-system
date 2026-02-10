import express from 'express';
import userRouter from './users.route.js';


const router = express.Router();

router.use('/users', userRouter);

//

export default router;