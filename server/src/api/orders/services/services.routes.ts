import { Router } from "express";
import pool from "../../../database/db";
import { RowDataPacket } from "mysql2";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const [results] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM service_type"
    );

    res.json({
      message: "Services - 👋🌎🌍🌏",
      data: results,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
