import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import pool from "../../database/db";
import { RowDataPacket } from "mysql2";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

export const jsonWebToken = new Strategy(opts, async (payload, done) => {
  if (payload.id === undefined) {
    return done(null, false, { message: "Unauthorized user" });
  }

  try {
    // get the corresponding user
    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM `staff` WHERE id = ?",
      [payload.id]
    );

    if (users.length === 0) {
      return done(null, false, { message: "Unauthorized user" });
    }

    const user = users[0];
    return done(false, user);
  } catch (error) {
    console.log(error);
  }
});
