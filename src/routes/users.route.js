import express from 'express';
import { userRegister,userLogin,userLogout} from '../controller/userController/usersController.js';

const userRouter = express.Router();

userRouter.post('/login', userLogin);
userRouter.post('/register', userRegister);
userRouter.post('/logout', userLogout);

export default userRouter;
