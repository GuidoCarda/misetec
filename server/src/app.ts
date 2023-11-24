import express from "express";
import morgan from "morgan";
import cors from "cors";

import api from "./api";
import * as middlewares from "./api/middlewares";
import MessageResponse from "./api/interfaces/MessageResponse";

// Express initialization
const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>("/", (_req, res) => {
  console.log("entro");
  return res.json({ message: "Bienvenido" });
});

app.use("/api/v1", api);

app.use(middlewares.errorHandler);

export default app;
