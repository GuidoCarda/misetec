import { RowDataPacket } from "mysql2";
import pool from "../../database/db";
import { NextFunction, Request, Response } from "express";

export async function getAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { start, end } = req.query as { start: string; end: string };
  console.log(start, end);

  if (!start || !end) {
    return res.status(400).json({ message: "start and end are required" });
  }

  // El sistema deberá mostrar el número de órdenes en progreso

  const query = `
    SELECT
      COUNT(*) AS total_orders
    FROM \`order\`
    WHERE created_at BETWEEN ? AND ?
  `;

  const values = [new Date(start), new Date(end)];

  try {
    const [results] = await pool.execute<RowDataPacket[]>(query, values);
    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function getOrdersCount(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  // El sistema deberá mostrar el número de órdenes en progreso

  const query = `SELECT * FROM order_status_count_view`;

  // const values = [new Date(start), new Date(end)];

  try {
    const [results] = await pool.execute<RowDataPacket[]>(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
}

// REQ-6.1: El sistema deberá mostrar el número de órdenes en progreso
// REQ-6.2: El sistema deberá mostrar el número de órdenes sin revisión.
// REQ-6.3: El sistema deberá mostrar el promedio de tiempo de reparación
