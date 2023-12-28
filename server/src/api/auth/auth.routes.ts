import { Router } from "express";

import * as authHandlers from "./auth.handlers";
import { validateRequest } from "../middlewares";
import {
  clientLogInSchema,
  clientOtpSchema,
  deleteStaffMemberSchema,
  staffLogInSchema,
  staffSignUpSchema,
} from "./auth.model";

const router = Router();

router.post(
  "/signup",
  validateRequest({
    body: staffSignUpSchema,
  }),
  authHandlers.staffSignUp
);

router.post(
  "/login",
  validateRequest({
    body: staffLogInSchema,
  }),
  authHandlers.staffLogIn
);

router.post(
  "/client-login",
  validateRequest({
    body: clientLogInSchema,
  }),
  authHandlers.clientLogIn
);

router.post(
  "/client-otp",
  validateRequest({
    body: clientOtpSchema,
  }),
  authHandlers.checkClientOtp
);

router.get("/me", authHandlers.getStaffAccountDetails);

router.get("/staff", authHandlers.getStaff);

router.delete(
  "/staff/:id",
  validateRequest({
    params: deleteStaffMemberSchema,
  }),
  authHandlers.deleteStaffMember
);

export default router;
