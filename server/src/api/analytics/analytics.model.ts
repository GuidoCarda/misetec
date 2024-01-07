import { z } from "zod";

export const AnalyticsQueryParamsSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});

export type AnalyticsQueryParams = z.infer<typeof AnalyticsQueryParamsSchema>;
