import z from "zod";

export const userDetailsSchema = z.object({
    first_name: z.string().min(2, { message: "First name must be at least 2 characters long" }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters long" }),
    username: z.string().min(2, { message: "Username must be at least 2 characters long" }),
    bio: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).trim().toLowerCase(),
})

export const changePasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"), 
    confirm_password: z.string().min(6, "Confirm password must be at least 6 characters")
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match", path: ["confirm_password"]
})

export const userAddressSchema = z.object({
    street: z.string().min(2, { message: "First name must be at least 2 characters long" }),
    city: z.string().min(2, { message: "Last name must be at least 2 characters long" }),
    state: z.string().min(2, { message: "Username must be at least 2 characters long" }),
    postal_code: z.string().optional(),
    // email: z.string().email({ message: "Invalid email address" }).trim().toLowerCase(),
})