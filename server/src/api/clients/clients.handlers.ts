import { NextFunction, Request, Response } from "express";
import pool from "../../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ParamsWithId } from "../interfaces/ParamsWithId";
import { CreateClient, UpdateClient } from "./clients.model";

export async function getAllClients(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [results] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM client"
    );

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

  const columns = Object.keys(client).join(", ");
  const values = Object.values(client)
    .map((value) => `"${value}"`)
    .join(", ");

  query += ` (${columns}) VALUES (${values})`;

  console.log(query);
  try {
    const [results] = await pool.execute<ResultSetHeader>(query, client);

    if (results.affectedRows === 0) {
      res.status(400).json({ message: "client was not created" });
    }

    res.json(results);
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

  try {
    let query = "UPDATE client SET ";
    const columns = Object.entries(client)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = :${key}`)
      .join(", ");

    query += columns + ` WHERE id = ${id}`;
    console.log(query);

    const [results] = await pool.execute<ResultSetHeader>(query, client);

    if (results.affectedRows === 0) {
      res.status(400).json({ message: "client was not updated" });
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
}
