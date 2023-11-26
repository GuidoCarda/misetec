import { Router } from "express";
import * as clientHandlers from "./clients.handlers";
import { validateRequest } from "../middlewares";
import { CreateClientSchema, UpdateClientSchema } from "./clients.model";
import { ParamsWithIdSchema } from "../interfaces/ParamsWithId";

const router = Router();

router.get("/", clientHandlers.getAllClients);

router.post(
  "/",
  validateRequest({ body: CreateClientSchema }),
  clientHandlers.createClient
);

router.get(
  "/:id",
  validateRequest({
    params: ParamsWithIdSchema,
  }),
  clientHandlers.getClient
);

router.patch(
  "/:id",
  validateRequest({ params: ParamsWithIdSchema, body: UpdateClientSchema }),
  clientHandlers.updateClient
);

export default router;
