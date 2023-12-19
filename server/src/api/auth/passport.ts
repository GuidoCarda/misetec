import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import pool from "../../database/db";
import { RowDataPacket } from "mysql2";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

export const jsonWebToken = new Strategy(opts, async (payload, done) => {
  console.log("payload", payload);

  if (payload.id === undefined || payload.role === undefined) {
    return done(null, false, { message: "Unauthorized user" });
  }

  console.log("payload", payload);

  try {
    let user;

    if (payload.role === "staff") {
      // get the corresponding staff member
      console.log("entro staff");
      const [staff] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM `staff` WHERE id = ?",
        [payload.id]
      );

      user = staff.length > 0 ? staff[0] : null;
    }
    // console.log(staff);

    if (payload.role === "client") {
      console.log("entro client");

      const [clients] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM `client` WHERE id = ?",
        [payload.id]
      );

      user = clients.length > 0 ? clients[0] : null;
    }

    if (!user) {
      return done(null, false, { message: "Unauthorized user" });
    }

    console.log(user);
    return done(false, user);
  } catch (error) {
    console.log(error);
  }
});
