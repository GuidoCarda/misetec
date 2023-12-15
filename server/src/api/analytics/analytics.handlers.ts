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

  let query = `
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) AS in_progress,
      SUM(CASE WHEN status_id = 1 THEN 1 ELSE 0 END) AS pending,
      ROUND(AVG(TIMESTAMPDIFF(SECOND, created_at, finished_at))) AS resolution_time
    FROM \`order\`  
   `;
  const values: string[] = [];

  if (!start && end) {
    return res.status(400).json({ message: "Inicio requerido" });
  }

  if (start && !end) {
    query += " WHERE DATE(created_at) = ?";
    values.push(start);
  }

  if (start && end) {
    query += " WHERE created_at BETWEEN ? AND ? ";
    values.push(start, end);
  }

  console.log(query);
  console.log(values);

  try {
    const [results] = await pool.execute<RowDataPacket[]>(query, values);
    console.log(results);
    const analytics = results[0];
    res.json(analytics);
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
