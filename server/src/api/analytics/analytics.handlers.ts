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

  let orderByStatusCountQuery = `
    SELECT  status_id, 
            status,
            COUNT(*) AS total 
    FROM \`order_list_view\`
  `;

  let orderByServiceTypeCountQuery = `
    SELECT  service_type_id, 
            service_type,
            COUNT(*) AS total 
            FROM \`order_list_view\`
  `;

  if (!start && end) {
    return res.status(400).json({ message: "Inicio requerido" });
  }

  if (start && !end) {
    query += " WHERE DATE(created_at) = ?";
    orderByStatusCountQuery += " WHERE DATE(created_at) = ? \n";
    orderByServiceTypeCountQuery += " WHERE DATE(created_at) = ? \n";
    values.push(start);
  }

  if (start && end) {
    query += " WHERE DATE(created_at) BETWEEN ? AND ? ";
    orderByStatusCountQuery += " WHERE DATE(created_at) BETWEEN ? AND ? \n";
    orderByServiceTypeCountQuery +=
      " WHERE DATE(created_at) BETWEEN ? AND ? \n";
    values.push(start, end);
  }

  orderByStatusCountQuery += " GROUP BY status_id, status ";
  orderByServiceTypeCountQuery += " GROUP BY service_type_id, service_type ";

  console.log(query);
  console.log(orderByStatusCountQuery);
  console.log(orderByServiceTypeCountQuery);
  console.log(values);

  try {
    const [results] = await pool.execute<RowDataPacket[]>(query, values);
    console.log(results);

    const [statusCount] = await pool.execute<RowDataPacket[]>(
      orderByStatusCountQuery,
      values
    );

    const [serviceTypeCount] = await pool.execute<RowDataPacket[]>(
      orderByServiceTypeCountQuery,
      values
    );

    console.log(statusCount);
    console.log(serviceTypeCount);

    const primaryAnalytics = results[0];
    res.json({ primaryAnalytics, statusCount, serviceTypeCount });
  } catch (error) {
    console.log(error);
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
