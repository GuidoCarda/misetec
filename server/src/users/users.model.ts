import * as z from "zod";

const ClientSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  address: z.string(),
  phone_number: z.string().length(10),
  postal_code: z.string().length(10),
});

const StaffSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  username: z.string(),
  password: z.string().min(6),
});

export type ClientType = z.infer<typeof ClientSchema>;
export type StaffType = z.infer<typeof StaffSchema>;
