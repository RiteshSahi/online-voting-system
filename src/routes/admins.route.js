import express from "express";
import {
    registerAdmin,
    getPendingAdmins,
    approveAdmin,
    rejectAdmin, }from "../controller/adminController/adminApproval.controller.js";

import { adminLogin,adminLogout } from "../controller/adminController/adminAUth.controller.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/register", registerAdmin);
adminRouter.get("/pending", getPendingAdmins);
adminRouter.put("/approve/:id", approveAdmin);
adminRouter.put("/reject/:id", rejectAdmin);
adminRouter.post("/logout", adminLogout);

export default adminRouter;
