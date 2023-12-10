import { Router } from "express";
import * as analyticsHandlers from "./analytics.handlers";

const router = Router();

router.get("/", analyticsHandlers.getAnalytics);

router.get("/count", analyticsHandlers.getOrdersCount);

export default router;
