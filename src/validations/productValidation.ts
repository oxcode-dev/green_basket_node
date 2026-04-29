import z from "zod";

export const productValidation = z.object({
    title: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    description: z.string().optional(),
    summary: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    category_id: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    price: z.number().positive({ message: "Price must be a positive number" }),
    stock: z.number().int().nonnegative({ message: "Stock must be a non-negative integer" }),
    is_active: z.boolean(),
    // image: z.string().url({ message: "Image must be a valid URL" }),
})