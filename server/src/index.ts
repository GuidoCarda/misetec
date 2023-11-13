import { PORT } from "./config";
import express from "express";
import cors from "cors";

import ordersRoutes from "./orders/orders.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/ping", (_req, res) => {
  return res.send("pong");
});
app.use("/v1", () => {});
app.use("/orders", ordersRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
