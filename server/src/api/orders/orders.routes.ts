import { Router } from "express";

import * as orderHandlers from "./orders.handlers";
import { validateRequest } from "../middlewares";

import {
  CreateOrderSchema,
  OrderQueryParamsSchema,
  UpdateOrderSchema,
  UpdateOrderStateSchema,
} from "./orders.model";

import { ParamsWithIdSchema } from "../interfaces/ParamsWithId";
// import passport from "passport";

const router = Router();

router.get(
  "/",
  validateRequest({ query: OrderQueryParamsSchema }),
  // passport.authenticate("jwt", { session: false }),
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
  "/:id/status",
  validateRequest({ params: ParamsWithIdSchema, body: UpdateOrderStateSchema }),
  orderHandlers.updateOrderState
);

router.delete(
  "/:id",
  validateRequest({ params: ParamsWithIdSchema }),
  orderHandlers.deleteOrder
);

export default router;
