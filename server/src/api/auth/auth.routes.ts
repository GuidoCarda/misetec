import { Router } from "express";
import pool from "../../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { comparePassword, createToken, encryptPassword } from "./utils";

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
      return res.status(400).json({ message: "user not found" });
    }

    const user = users[0];
    const match = await comparePassword(req.body.password, user.password);

    if (!match) {
      return res.status(400).json({ message: "invalid password" });
    }

    const token = createToken(user);

    res.status(200).json({ role: "staff", token });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", () => {});

export default router;
