import { NextFunction, Request, Response } from "express";
import pool from "../../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function getAllOrders(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [results] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM `order`"
    );

    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function getOrder(
  req: Request,
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
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  try {
    const [results] = await pool.execute<RowDataPacket[]>(
      "INSERT INTO `order` (description) VALUES (?)",
      [description]
    );
    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function updateOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

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
