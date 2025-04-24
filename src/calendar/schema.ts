import { z } from "zod";

export const scheduleSchema = z.object({
    description: z.string().optional(),
    startDate: z.date(),
    startTime: z.object(
        {
            hour: z.number(),
            minute: z.number(),
        },
    ),
    endDate: z.date(),
    endTime: z.object(
        {
            hour: z.number(),
            minute: z.number(),
        },
    ),
    professionalId: z.string().min(1),
    serviceId: z.string().min(1),
    customerId: z.string().min(1)
});

export type TScheduleFormData = z.infer<typeof scheduleSchema>;