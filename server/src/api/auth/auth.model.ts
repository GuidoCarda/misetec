import { z } from "zod";

export const staffSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
  firstname: z.string().max(50),
  lastname: z.string().max(50),
});

export const staffLogInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(20),
});

export const clientLogInSchema = z.object({
  email: z.string().email(),
});

export const clientOtpSchema = z.object({
  otp: z.coerce
    .string()
    .length(4)
    .refine((value) => {
      return /^\d+$/.test(value);
    }, "El codigo ingresado debe ser un numero de 4 digitos"),
});

export type StaffSignUp = z.infer<typeof staffSignUpSchema>;
export type StaffLogIn = z.infer<typeof staffLogInSchema>;
export type ClientLogIn = z.infer<typeof clientLogInSchema>;
export type ClientOtp = z.infer<typeof clientOtpSchema>;
