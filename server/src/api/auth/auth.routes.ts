import { Router } from "express";

import * as authHandlers from "./auth.handlers";

const router = Router();

router.post("/signup", authHandlers.signUp);

router.post("/login", authHandlers.staffLogIn);

router.post("/client-login", authHandlers.clientLogIn);

router.post("/client-otp", authHandlers.checkClientOtp);

router.get("/me", authHandlers.getStaffAccountDetails);

router.get("/staff", authHandlers.getStaff);

export default router;
