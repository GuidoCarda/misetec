import { Router } from "express";
// import passport from "passport";

import * as orderHandlers from "./orders.handlers";
import { validateRequest } from "../middlewares";
import {
  CreateOrderSchema,
  OrderQueryParamsSchema,
  UpdateOrderSchema,
  UpdateOrderStateSchema,
} from "./orders.model";
import { ParamsWithIdSchema } from "../interfaces/ParamsWithId";

const router = Router();

router.get(
  "/",
  // passport.authenticate("jwt", { session: false }),
  validateRequest({ query: OrderQueryParamsSchema }),
  orderHandlers.getAllOrders
);

router.get(
  "/:id",
  validateRequest({ params: ParamsWithIdSchema }),
  orderHandlers.getOrder
);

router.post(
  "/",
  validateRequest({ body: CreateOrderSchema }),
  orderHandlers.createOrder
);

router.patch(
  "/:id",
  validateRequest({ params: ParamsWithIdSchema, body: UpdateOrderSchema }),
  orderHandlers.updateOrder
);

router.patch(
  "/:id/state",
  validateRequest({ params: ParamsWithIdSchema, body: UpdateOrderStateSchema }),
  orderHandlers.updateOrderState
);

export default router;
