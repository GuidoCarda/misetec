import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import pool from "../../database/db";
import { RowDataPacket } from "mysql2";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

export const jsonWebToken = new Strategy(opts, async (payload, done) => {
  if (payload.id === undefined || payload.role === undefined) {
    return done(null, false, { message: "Unauthorized user" });
  }

  try {
    let user;

    if (payload.role === "staff") {
      // get the corresponding staff member
      const [staff] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM `staff` WHERE id = ?",
        [payload.id]
      );

      user = staff.length > 0 ? staff[0] : null;
    }

    if (payload.role === "client") {
      const [clients] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM `client` WHERE id = ?",
        [payload.id]
      );

      user = clients.length > 0 ? clients[0] : null;
    }

    if (!user) {
      return done(null, false, { message: "Unauthorized user" });
    }
    return done(false, user);
  } catch (error) {
    console.log(error);
  }
});
