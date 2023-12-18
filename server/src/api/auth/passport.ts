import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import pool from "../../database/db";
import { RowDataPacket } from "mysql2";
import MagicLoginStrategy from "passport-magic-login";
import { Client } from "../clients/clients.model";

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
    console.log(users);

    if (users.length === 0) {
      return done(null, false, { message: "Unauthorized user" });
    }

    const user = users[0];
    console.log(user);
    return done(false, user);
  } catch (error) {
    console.log(error);
  }
});

export const magicLogin = new MagicLoginStrategy({
  secret: "secret",

  // callbackUrl: "http://localhost:3000/api/v1/auth/magiclogin/confirm",
  callbackUrl: "http://localhost:5173/login",

  sendMagicLink: async (_destination: string, _href: string) => {
    console.log("enviando");
    // const data = await resend.emails.send({
    //   from: "Misetec <onboarding@resend.dev>",
    //   to: [destination],
    //   subject: "Inicio de sesion",
    //   html: `
    //     <h3>Clickea el siguiente link para acceder a el estado de tus ordenes de servicio</h3>
    //     <a href="${href}" target="child" >Click aqui</a>`,
    // });

    // console.log(data);
  },

  verify: async (payload, callback) => {
    console.log("verify payload", payload);
    try {
      // get the corresponding user
      const [clients] = await pool.execute<Client[] & RowDataPacket[]>(
        "SELECT * FROM `client` WHERE email = ?",
        [payload.destination]
      );
      console.log(clients);

      if (clients.length === 0) {
        console.log("entro a length === 0");
        return callback(null, false);
      }

      const [client] = clients;

      if (!client) {
        console.log("entro a !client");
        return callback(null, false);
      }

      console.log("llego al final con client", client);
      return callback(null, client);
    } catch (error: any) {
      console.log(error);
      callback(error);
    }
  },
  jwtOptions: {
    expiresIn: "1y",
  },
});
