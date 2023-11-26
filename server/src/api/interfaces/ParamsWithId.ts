import { z } from "zod";

export const ParamsWithIdSchema = z.object({
  id: z.string().refine(
    (v) => {
      let n = Number(v);
      return !isNaN(n) && v?.length > 0;
    },
    { message: "Invalid number" }
  ),
});

export type ParamsWithId = z.infer<typeof ParamsWithIdSchema>;
