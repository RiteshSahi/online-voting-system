import express from 'express';
import { userRegister,userLogin,userLogout} from '../controller/userController/usersController.js';
import { changeUserPassword } from "../controller/userController/userAuth.controller.js";
import { protectUser } from "../middleware/userAuth.midlleware.js";



const userRouter = express.Router();

userRouter.post('/login', userLogin);
userRouter.post('/register', userRegister);
userRouter.post('/logout', userLogout);
userRouter.put("/change-password", protectUser, changeUserPassword);

export default userRouter;
