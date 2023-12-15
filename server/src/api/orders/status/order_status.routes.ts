import { Router } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../../../database/db";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const [results] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM order_status"
    );

    res.json(results);
  } catch (error) {
    next(error);
  }
});

export default router;
