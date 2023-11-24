import { Router } from "express";
import ordersRoutes from "./orders/orders.routes";
import clientsRoutes from "./clients/clients.routes";
import MessageResponse from "./interfaces/MessageResponse";

const router = Router();

router.get<{}, MessageResponse>("/", (_req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/orders", ordersRoutes);
router.use("/clients", clientsRoutes);

export default router;
