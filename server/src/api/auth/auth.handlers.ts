import { NextFunction, Request, Response } from "express";
import pool from "../../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { comparePassword, createToken, encryptPassword } from "./utils";
import { sendEmail } from "../nodemailer";

export async function staffSignUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body.password || !req.body.password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM `staff` WHERE `email` = ?",
      [req.body.email]
    );

    if (users.length > 0) {
      return res
        .status(400)
        .json({ message: "Ya hay una creada cuenta con ese email" });
    }

    const passwordHash = await encryptPassword(req.body.password);
    const [results] = await pool.execute<ResultSetHeader>(
      "INSERT INTO `staff` (email, password,firstname, lastname) values (?,?,?,?)",
      [req.body.email, passwordHash, req.body.firstname, req.body.lastname]
    );

    if (results.affectedRows !== 1) {
      return res
        .status(400)
        .json({ message: "Hubo un error creando al usuario" });
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function staffLogIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body.password || !req.body.password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM `staff` WHERE `email` = ?",
      [req.body.email]
    );

    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "No existe un usuario con el email ingresado" });
    }

    const user = users[0];
    const match = await comparePassword(req.body.password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = createToken(user, "staff");

    res.status(200).json({ role: "staff", token });
  } catch (error) {
    next(error);
  }
}

export async function clientLogIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body.email) {
    return res.status(400).json({ message: "El email es requerido" });
  }

  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM `client` WHERE `email` = ?",
      [req.body.email]
    );

    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "No existe un cliente con el email ingresado" });
    }

    const user = users[0];

    //handle otp
    const otp = Math.floor(1000 + Math.random() * 9000);

    const [_results] = await pool.execute<ResultSetHeader>(
      "UPDATE `client` SET `otp` = ? WHERE `id` = ?",
      [otp, user.id]
    );

    await sendEmail(
      user.email,
      "Codigo de verificacion",
      `
        <h3>Codigo de verificacion</h3>
        <br/>
        <p>El codigo de verificacion es: ${otp}</p>
        <br/>
        <p>Misetec soluciones informaticas</p>

      `
    );

    res.status(200).json({ role: "client", otp });
  } catch (error) {
    next(error);
  }
}

export async function checkClientOtp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body.otp) {
    return res.status(400).json({ message: "El otp es requerido" });
  }

  try {
    const [clients] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM `client` WHERE `otp` = ?",
      [req.body.otp]
    );

    if (clients.length === 0) {
      return res
        .status(400)
        .json({ message: "El codigo ingresado es incorrecto" });
    }

    const client = clients[0];

    const token = createToken(client, "client");

    res.status(200).json({ role: "client", token });
  } catch (error) {
    next(error);
  }
}

export async function getStaffAccountDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM `staff` WHERE `id` = ?",
      [req.body.id]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "user not found" });
    }

    const user = users[0];

    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function getStaff(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM `staff` WHERE `status` = 1"
    );

    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function deleteStaffMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [results] = await pool.execute<ResultSetHeader>(
      "UPDATE `staff` SET status = 0 WHERE `id` = ?",
      [req.params.id]
    );

    res.json(results);
  } catch (error) {
    next(error);
  }
}
