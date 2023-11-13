import * as z from "zod";

const OrderSchema = z.object({
  id: z.number(),
  created_at: z.date(),
  finished_at: z.date(),
  description: z.string(),
  device_failure: z.string().optional(),
  accesories: z.string().optional(),
  report: z.string().optional(),
  service_type_id: z.number(),
  status_id: z.number().default(1),
  device_id: z.number().optional(),
  client_id: z.number(),
  staff_id: z.number(),
});

export type OrderType = z.infer<typeof OrderSchema>;
