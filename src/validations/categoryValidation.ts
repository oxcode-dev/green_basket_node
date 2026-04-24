import z from "zod";

export const categoryValidation = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    description: z.string().optional(),
})
