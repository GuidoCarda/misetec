import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function encryptPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function createToken(user: Record<string, any>, role: string) {
  return jwt.sign({ id: user.id, email: user.email, role: role }, "secret");
}
