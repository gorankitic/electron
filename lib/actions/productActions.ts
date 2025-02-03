"use server";

// database
import { db } from "@/db/database";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
// types
import { productSchema, ProductSchema } from "@/lib/types/productSchema";
// lib
import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";

export const createUpdateProduct = async (data: ProductSchema) => {
    try {
        // Authorization
        const session = await auth();
        if (!session) {
            return { success: false, message: "Please sign in to get access." }
        }
        if (session.user.role !== "admin") {
            return { success: false, message: "You are not authorized to perform this action." }
        }
        // Server-side data validation with Zod
        const result = productSchema.safeParse(data);
        if (!result.success) {
            let errorMessage = result.error.issues
                .map(issue => issue.message)
                .join(". ");
            return { success: false, message: errorMessage };
        }
        const { description, price, title, id } = result.data;
        // Update product
        if (id) {
            const product = await db.query.products.findFirst({
                where: eq(products.id, id)
            });
            if (!product) {
                return { success: false, message: "There is no product with that id." }
            }
            await db
                .update(products)
                .set({ title, description, price })
                .where(eq(products.id, id))
            return { success: true, message: "Product is updated successfully." }
        }
        // Create a new product
        if (!id) {
            await db.insert(products).values({ title, description, price })
        }
        return { success: true, message: "Product is created successfully." }
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("❌Error in createProduct server action: ", errorMessage);
        throw new Error("Creating product failed. Please try again later.");
    }
}