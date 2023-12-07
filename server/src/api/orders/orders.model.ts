import { z } from "zod";

export const OrderSchema = z.object({
  id: z.number().positive(),
  created_at: z.date(),
  finished_at: z.date().optional(),
  description: z.string(),
  device_failure: z.string().optional(),
  accesories: z.string().optional(),
  report: z.string().optional(),
  service_type_id: z.coerce.number().positive(),
  status_id: z.number().positive().default(1),
  device_id: z.number().positive().optional(),
  client_id: z.number().positive(),
  staff_id: z.number().positive(),
});

export const DeviceSchema = z.object({
  id: z.number().positive(),
  brand: z.string(),
  model: z.string(),
  serial_number: z.string(),
});

export const CreateDeviceSchema = DeviceSchema.omit({
  id: true,
}).partial();

// export const CreateOrderSchema = OrderSchema.omit({
//   id: true,
//   created_at: true,
//   status_id: true,
//   finished_at: true,
// });

export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  created_at: true,
  status_id: true,
  finished_at: true,
}).merge(CreateDeviceSchema);

export const UpdateOrderSchema = OrderSchema.omit({
  id: true,
  created_at: true,
  client_id: true,
  staff_id: true,
});

export const UpdateOrderStateSchema = z.object({
  status_id: z.number().positive(),
  finished_at: z.date().optional(),
});

export const OrderQueryParamsSchema = z.object({
  status_id: z.string().optional(),
  service_type_id: z.string().optional(),
  client_id: z.string().optional(),
});

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
export type UpdateOrderState = z.infer<typeof UpdateOrderStateSchema>;
export type OrderQueryParams = z.infer<typeof OrderQueryParamsSchema>;

export type Device = z.infer<typeof DeviceSchema>;
export type CreateDevice = z.infer<typeof CreateDeviceSchema>;
