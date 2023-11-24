import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json("orders");
});

router.get("/:id", (req, res) => {
  res.json("orders/" + req.params.id);
});

export default router;
