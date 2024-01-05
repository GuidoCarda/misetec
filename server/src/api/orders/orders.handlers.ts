import { NextFunction, Request, Response } from "express";
import pool from "../../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  CreateDevice,
  CreateOrder,
  OrderQueryParams,
  UpdateOrder,
  UpdateOrderState,
} from "./orders.model";
import { ParamsWithId } from "../interfaces/ParamsWithId";
import {
  getInsertNamedPlacehoders,
  getNamedPlaceholders,
  getUpdateNamedPlaceholders,
} from "../../database/utils";
import { sendEmail } from "../nodemailer";

import { ORDER_STATUS, SERVICE_TYPES } from "../../../../client/src/constants";

export async function getAllOrders(
  req: Request<{}, {}, {}, OrderQueryParams>,
  res: Response,
  next: NextFunction
) {
  let query = "SELECT * FROM order_list_view";
  const replaces = getNamedPlaceholders(req.query);
  query += replaces.length > 0 ? ` WHERE ${replaces}` : "";

  try {
    const [results] = await pool.execute<RowDataPacket[]>(query, req.query);

    res.json({
      query,
      data: results,
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
      "SELECT * FROM `order_detail_view` WHERE id = ? ",
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
  const { description, client_id, staff_id, service_type_id, accesories } =
    req.body;

  let device_id = null;

  if (
    service_type_id === SERVICE_TYPES.REPAIR ||
    service_type_id === SERVICE_TYPES.MAINTENANCE
  ) {
    if (req.body.type === "notebook") {
      const { brand, model, serial_number } = req.body;
      const deviceData = { brand, model, serial_number };
      device_id = await createDevice(deviceData);
    }
  }

  try {
    const [results] = await pool.execute<RowDataPacket[]>(
      "INSERT INTO `order` (description, accesories, service_type_id, client_id, device_id,staff_id) VALUES (?,?,?,?,?,?)",
      [
        description,
        accesories ?? null,
        service_type_id,
        client_id,
        device_id,
        staff_id,
      ]
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

  let query = "UPDATE `order` SET ";
  const columns = getUpdateNamedPlaceholders(req.body);
  query += columns + ` WHERE id = ${id}`;

  try {
    const [results] = await pool.execute<ResultSetHeader[]>(query, req.body);

    if (req.body.status_id === ORDER_STATUS.FINISHED) {
      const [order] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM `order_detail_view` WHERE id = ? ",
        [id]
      );

      const { email, service_type } = order[0];
      await sendEmail(
        email,
        "Orden finalizada",
        `
          <h2>La orden #${id} (${service_type}) a tu nombre a sido finalizada</h2>
          <p>Contactanos para mas informacion</p>
        `
      );
    }

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

  let query = "UPDATE `order` SET status_id = ?";
  if (status_id === ORDER_STATUS.FINISHED) {
    query += ", `finished_at` = NOW()";
  }
  query += " WHERE id = ?";

  try {
    const [results] = await pool.execute<ResultSetHeader[]>(query, [
      status_id,
      id,
    ]);

    if (status_id === ORDER_STATUS.FINISHED) {
      const [order] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM `order_detail_view` WHERE id = ? ",
        [id]
      );

      const { email, service_type } = order[0];
      await sendEmail(
        email,
        "Orden finalizada",
        `
          <h2>La orden #${id} (${service_type}) a tu nombre a sido finalizada</h2>
          <p>Contactanos para mas informacion</p>
        `
      );
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function deleteOrder(
  req: Request<ParamsWithId, {}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  try {
    const [results] = await pool.execute<ResultSetHeader[]>(
      "UPDATE `order` SET status_id = 4 WHERE id = ?",
      [req.params.id]
    );

    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function createDevice(deviceData: CreateDevice) {
  let query = "INSERT INTO device";
  const namedPlaceholders = getInsertNamedPlacehoders(deviceData);
  query += namedPlaceholders;

  try {
    const [results] = await pool.execute<ResultSetHeader>(query, deviceData);

    return results.insertId;
  } catch (error) {
    return error;
  }
}
