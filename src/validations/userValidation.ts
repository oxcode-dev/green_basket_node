import z from "zod";

export const userDetailsValidation = z.object({
    first_name: z.string().min(2, { message: "First name must be at least 2 characters long" }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters long" }),
    bio: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).trim().toLowerCase(),
}).strict();
