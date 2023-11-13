import { RowDataPacket } from "mysql2";
import { select } from "../database/utils";
import { OrderType } from "./orders.model";
import { NextFunction, Request, Response } from "express";

export type OrderRow = OrderType & RowDataPacket;

export async function getOne(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const query = "SELECT * FROM `order` WHERE id = ?;";

  try {
    const [data] = await select<OrderRow>(query, [id]);
    if (!data) {
      res.status(400).json({ message: "No se entraron" });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getAll(_req: Request, res: Response, next: NextFunction) {
  const query = "SELECT * FROM `order`";

  try {
    const results = await select<OrderRow>(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function getByStatus(
  req: Request<{ statusId: string }>,
  res: Response,
  next: NextFunction
) {
  const { statusId } = req.params;

  const query = "SELECT * FROM `order` WHERE status_id = ?";
  try {
    const data = await select<OrderRow>(query, [statusId]);

    if (!data.length) {
      return res.json("No se encontraron resultados");
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function createOne(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // const order = req.body;
    res.send("creada ");
  } catch (e) {
    next(e);
  }
}
