import { RowDataPacket } from "mysql2";
import pool from "../../database/db";
import { NextFunction, Request, Response } from "express";

export async function getAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { start, end } = req.query as { start: string; end: string };

  if (!start && end) {
    return res.status(400).json({ message: "Inicio requerido" });
  }

  const baseQuery = `
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) AS in_progress,
      SUM(CASE WHEN status_id = 1 THEN 1 ELSE 0 END) AS pending,
      ROUND(AVG(TIMESTAMPDIFF(SECOND, created_at, finished_at))) AS resolution_time
    FROM \`order\`  
   `;

  const orderByStatusCountQuery = `
    SELECT  status_id, 
            status,
            COUNT(*) AS total 
    FROM \`order_list_view\`
  `;

  const orderByServiceTypeCountQuery = `
    SELECT  service_type_id, 
            service_type,
            COUNT(*) AS total 
    FROM \`order_list_view\`
  `;

  const values: string[] = [];
  let dynamicConditions = "";

  if (start && !end) {
    dynamicConditions += "WHERE DATE(created_at) = ?";
    values.push(start);
  }

  if (start && end) {
    dynamicConditions += " WHERE DATE(created_at) BETWEEN ? AND ? ";
    values.push(start, end);
  }

  const finalBaseQuery = baseQuery + dynamicConditions;
  const finalOrderByStatusCountQuery =
    orderByStatusCountQuery +
    dynamicConditions +
    " GROUP BY status_id, status ";
  const finalOrderByServiceTypeCountQuery =
    orderByServiceTypeCountQuery +
    dynamicConditions +
    " GROUP BY service_type_id, service_type ";

  try {
    const results = await Promise.all([
      pool.execute<RowDataPacket[]>(finalBaseQuery, values),
      pool.execute<RowDataPacket[]>(finalOrderByStatusCountQuery, values),
      pool.execute<RowDataPacket[]>(finalOrderByServiceTypeCountQuery, values),
    ]);

    const data = results.map(([result, _]) => result);

    res.json({
      primaryAnalytics: data[0][0],
      statusCount: data[1],
      serviceTypeCount: data[2],
    });
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

  try {
    const [results] = await pool.execute<RowDataPacket[]>(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
}
