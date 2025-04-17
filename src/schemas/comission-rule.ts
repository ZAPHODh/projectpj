import { z } from "zod";

export const commissionRuleSchema = z.object({
    professionalId: z.string().optional(),
    serviceId: z.string().optional(),
    productCategory: z.string().optional(),
    type: z.enum(["percentage", "fixed"]),
    value: z.number().min(0),
    service: z.any().optional(), // pode tipar melhor se tiver schema de Service
});