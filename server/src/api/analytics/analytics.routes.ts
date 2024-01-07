import { Router } from "express";
import * as analyticsHandlers from "./analytics.handlers";
import { validateRequest } from "../middlewares";
import { AnalyticsQueryParamsSchema } from "./analytics.model";

const router = Router();

router.get(
  "/",
  validateRequest({
    query: AnalyticsQueryParamsSchema,
  }),
  analyticsHandlers.getAnalytics
);

router.get("/count", analyticsHandlers.getOrdersCount);

export default router;
