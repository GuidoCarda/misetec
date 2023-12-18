import { Router } from "express";
import pool from "../../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { comparePassword, createToken, encryptPassword } from "./utils";
import * as authStrategies from "./passport";
import passport from "passport";
import transporter from "../nodemailer";

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

    const token = createToken(user);

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

    const token = createToken(user);

    res.status(200).json({ role: "client", token });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", () => {});

router.post("/magiclogin", authStrategies.magicLogin.send);

router.get(
  "/magiclogin/confirm",
  function (req, res, next) {
    passport.authenticate("magiclogin", { session: false })(req, res, next);
  },
  (req, res) => {
    res.json({ ...req.user, token: req.query.token });
  }
);

router.get("/send", async (_req, res) => {
  console.log("entro");
  try {
    const data = await transporter.sendMail({
      from: "Misetec <soluciones.misetec@gmail.com>",
      to: "guidoc128@gmail.com",
      subject: "Hola",
      html: `
        <h3>Email de prueba</h3>
        <br/>
        <br/>
        <p>Esto es un mail de prueva</p>
      `,
    });

    console.log(data);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
