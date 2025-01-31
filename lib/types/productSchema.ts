import * as z from "zod";

export const productSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, { message: "Title is required" }).max(100),
    description: z.string().min(1, { message: "Description is required" }).max(255),
    price: z.coerce.number().positive({ message: "Price must be a positive number" })
});
export type ProductSchema = z.infer<typeof productSchema>;