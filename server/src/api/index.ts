import { Router } from "express";
import ordersRoutes from "./orders/orders.routes";
import clientsRoutes from "./clients/clients.routes";
import authRoutes from "./auth/auth.routes";
import analyticsRoutes from "./analytics/analytics.routes";
import servicesRoutes from "./orders/services/services.routes";
import MessageResponse from "./interfaces/MessageResponse";

const router = Router();

router.get<{}, MessageResponse>("/", (_req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/auth", authRoutes);
router.use("/orders", ordersRoutes);
router.use("/clients", clientsRoutes);
router.use("/services", servicesRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
