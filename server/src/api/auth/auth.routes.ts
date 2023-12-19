import { Router } from "express";
import pool from "../../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { comparePassword, createToken, encryptPassword } from "./utils";
// import transporter, { sendEmail } from "../nodemailer";

const router = Router();

router.post("/signup", async (req, res, next) => {
  if (!req.body.password || !req.body.password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM `staff` WHERE `email` = ?",
      [req.body.email]
    );

    if (users.length > 0) {
      return res.status(400).json({ message: "email already exists" });
    }

    const passwordHash = await encryptPassword(req.body.password);
    const [results] = await pool.execute<ResultSetHeader>(
      "INSERT INTO `staff` (email, password) values (?,?)",
      [req.body.email, passwordHash]
    );

    if (results.affectedRows !== 1) {
      return res.status(400).json({ message: "error creating user" });
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
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
});

router.post("/client-login", async (req, res, next) => {
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

    const [results] = await pool.execute<ResultSetHeader>(
      "UPDATE `client` SET `otp` = ? WHERE `id` = ?",
      [otp, user.id]
    );

    console.log(results);

    // await sendEmail(
    //   user.email,
    //   "Codigo de verificacion",
    //   `
    //     <h3>Codigo de verificacion</h3>
    //     <br/>
    //     <br/>
    //     <p>El codigo de verificacion es: ${otp}</p>
    //   `
    // );

    res.status(200).json({ role: "client", otp });
  } catch (error) {
    next(error);
  }
});

router.post("/client-otp", async (req, res, next) => {
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
});

export default router;
