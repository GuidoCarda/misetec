import { NextFunction, Request, Response } from "express";
import pool from "../../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ParamsWithId } from "../interfaces/ParamsWithId";
import { ClientQueryParams, CreateClient, UpdateClient } from "./clients.model";
import {
  getInsertNamedPlacehoders,
  getNamedPlaceholders,
  getUpdateNamedPlaceholders,
} from "../../database/utils";

export async function getAllClients(
  req: Request<{}, {}, {}, ClientQueryParams>,
  res: Response,
  next: NextFunction
) {
  let query = "SELECT * FROM client";

  const namedPlaceholders = getNamedPlaceholders(req.query, "OR", "LIKE");
  query += namedPlaceholders.length > 0 ? ` WHERE ${namedPlaceholders}` : "";

  const values = Object.fromEntries(
    Object.entries(req.query).map(([key, value]) => [key, `%${value}%`])
  );

  try {
    const [results] = await pool.execute<RowDataPacket[]>(query, values);

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}

export async function getClient(
  req: Request<ParamsWithId>,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;

  try {
    const [results] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM client WHERE id = ? ",
      [id]
    );

    if (results.length === 0) {
      res.status(400).json({ message: "client not found" });
    }

    const client = results[0];

    res.json(client);
  } catch (error) {
    next(error);
  }
}

export async function createClient(
  req: Request<ParamsWithId, {}, CreateClient>,
  res: Response,
  next: NextFunction
) {
  const client = req.body;

  let query = "INSERT INTO client";
  const namedPlaceholders = getInsertNamedPlacehoders(client);
  query += namedPlaceholders;

  console.log(query);
  try {
    const [results] = await pool.execute<ResultSetHeader>(query, client);

    if (results.affectedRows === 0) {
      res.status(400).json({ message: "client was not created" });
    }

    res.json({ data: { id: results.insertId, ...client }, results });
  } catch (error) {
    next(error);
  }
}

export async function updateClient(
  req: Request<ParamsWithId, {}, UpdateClient>,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const client = req.body;
  console.log(client);

  if (Object.keys(client).length === 0) {
    return res.status(400).json({ message: "client body is empty" });
  }

  try {
    let query = "UPDATE client SET ";
    const columns = getUpdateNamedPlaceholders(client);
    query += columns + ` WHERE id = ${id}`;

    const [results] = await pool.execute<ResultSetHeader>(query, client);

    if (results.affectedRows === 0) {
      return res.status(400).json({ message: "client was not updated" });
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
}
