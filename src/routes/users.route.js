import express from 'express';
import { register,login,logout} from '../../src/controller/usersController.js';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.post('/logout', logout);

export default userRouter;
