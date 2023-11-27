import { z } from "zod";

export const ClientSchema = z.object({
  id: z.number().int().positive(),
  firstname: z.string().max(50),
  lastname: z.string().max(50),
  email: z.string().email(),
  address: z.string().max(50),
  phone_number: z.string().max(20),
  postal_code: z.string().max(10),
});

export const ClientQueryParamsSchema = z.object({
  id: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
});

export const CreateClientSchema = ClientSchema.omit({ id: true });
export const UpdateClientSchema = ClientSchema.omit({ id: true }).partial();

export type Client = z.infer<typeof ClientSchema>;
export type CreateClient = z.infer<typeof CreateClientSchema>;
export type UpdateClient = z.infer<typeof UpdateClientSchema>;
export type ClientQueryParams = z.infer<typeof ClientQueryParamsSchema>;
