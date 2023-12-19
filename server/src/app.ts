import express from "express";
import morgan from "morgan";
import cors from "cors";

import api from "./api";
import * as middlewares from "./api/middlewares";
import MessageResponse from "./api/interfaces/MessageResponse";
import passport from "passport";
import * as authStrategies from "./api/auth/passport";

// Express initialization
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());
passport.use(authStrategies.jsonWebToken);

app.get<{}, MessageResponse>("/", (_req, res) => {
  console.log("entro");
  return res.json({ message: "Bienvenido" });
});

app.use("/api/v1", api);

app.use(middlewares.errorHandler);

export default app;
