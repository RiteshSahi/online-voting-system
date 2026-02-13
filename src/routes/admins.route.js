import express from "express";
import {
    adminLogin,
    registerAdmin,
    getPendingAdmins,
    approveAdmin,
    rejectAdmin, 
    adminLogout} from "../controller/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/register", registerAdmin);
adminRouter.get("/pending", getPendingAdmins);
adminRouter.put("/approve/:id", approveAdmin);
adminRouter.put("/reject/:id", rejectAdmin);

adminRouter.post("/logout", adminLogout);

export default adminRouter;
