import { NextFunction, Request, Response } from "express";
import pool from "../../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  CreateOrder,
  OrderQueryParams,
  UpdateOrder,
  UpdateOrderState,
} from "./orders.model";
import { ParamsWithId } from "../interfaces/ParamsWithId";
import { getNamedPlaceholders } from "../../database/utils";

export async function getAllOrders(
  req: Request<{}, {}, {}, OrderQueryParams>,
  res: Response,
  next: NextFunction
) {
  let query = "SELECT * FROM `order`";
  const replaces = getNamedPlaceholders(req.query);
  query += replaces.length > 0 ? ` WHERE ${replaces}` : "";

  try {
    const [results] = await pool.execute<RowDataPacket[]>(query, req.query);

    res.json({
      query,
      results,
      count: results.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrder(
  req: Request<ParamsWithId>,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;

  try {
    const [results] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM `order` WHERE id = ? ",
      [id]
    );

    if (results.length === 0) {
      res.status(400).json({ message: "order not found" });
    }

    const order = results[0];

    res.json(order);
  } catch (error) {
    next(error);
  }
}

export async function createOrder(
  req: Request<{}, {}, CreateOrder>,
  res: Response,
  next: NextFunction
) {
  const { description, client_id, staff_id, service_type_id } = req.body;

  try {
    const [results] = await pool.execute<RowDataPacket[]>(
      "INSERT INTO `order` (description, client_id, staff_id, service_type_id) VALUES (?,?,?,?)",
      [description, client_id, staff_id, service_type_id]
    );
    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function updateOrder(
  req: Request<ParamsWithId, {}, UpdateOrder>,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const { description } = req.body as UpdateOrder;

  try {
    const [results] = await pool.execute<ResultSetHeader[]>(
      "UPDATE `order` SET `description` = ? WHERE id = ?",
      [description, id]
    );
    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderState(
  req: Request<ParamsWithId, {}, UpdateOrderState>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { status_id } = req.body;

  try {
    const [results] = await pool.execute<ResultSetHeader[]>(
      "UPDATE `order` SET `status_id` = ? WHERE id = ?",
      [status_id, id]
    );
    res.json(results);
  } catch (error) {
    next(error);
  }
}
