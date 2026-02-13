import express from "express";
import {
    registerAdmin,
    getPendingAdmins,
    approveAdmin,
    rejectAdmin, }from "../controller/adminController/adminApproval.controller.js";

import { adminLogin,adminLogout } from "../controller/adminController/adminAUth.controller.js";
import { changeAdminPassword } from "../controller/adminController/adminManagement.controller.js";
import { protectAdmin } from "../middleware/adminAuth.middleware.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/register", registerAdmin);
adminRouter.get("/pending", getPendingAdmins);
adminRouter.put("/approve/:id", approveAdmin);
adminRouter.put("/reject/:id", rejectAdmin);
adminRouter.post("/logout", adminLogout);
adminRouter.put("/change-password", protectAdmin, changeAdminPassword);


export default adminRouter;
