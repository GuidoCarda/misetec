import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json("clients");
});

router.get("/:id", (req, res) => {
  res.json("clients/" + req.params.id);
});

export default router;
