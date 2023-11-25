import { Router } from "express";
import passport from "passport";

import * as orderHandlers from "./orders.handlers";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  orderHandlers.getAllOrders
);

router.get("/:id", orderHandlers.getOrder);

router.post("/", orderHandlers.createOrder);

router.patch("/:id", orderHandlers.updateOrder);

export default router;
