import { z } from "zod";

export const PlanEnum = z.enum(["FREE", "PRO", "AGENCY"]);

export const RunAuditSchema = z.object({
  url: z.string().min(4).max(2048),
  options: z
    .object({
      enhanceWithAi: z.boolean().optional(),
    })
    .optional(),
});

export type RunAuditInput = z.infer<typeof RunAuditSchema>;