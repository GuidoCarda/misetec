import { Router } from "express";
import * as orderServices from "./orders.services";

const router = Router();

router.get("/", orderServices.getAll);
router.get("/:id", orderServices.getOne);
// TODO: Refactor using query params to acomodate best practices
router.get("/status/:statusId", orderServices.getByStatus);

export default router;
