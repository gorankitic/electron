"use server";

// database
import { db } from "@/db/database";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
// types
import { settingsSchema, SettingsSchema } from "@/lib/types/settingsSchema";
// lib
import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export const updateSettings = async (data: SettingsSchema) => {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, message: "Please sign in to get access." }
        }
        // Server-side data validation with Zod
        const result = settingsSchema.safeParse(data);
        if (!result.success) {
            let errorMessage = result.error.issues
                .map(issue => issue.message)
                .join(". ");
            return { success: false, message: errorMessage };
        }

        const existingUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, session.user.id)
        });
        if (!existingUser) {
            return { success: false, message: "User does not exist." };
        }

        if (session.user.isOAuth) {
            data.email = undefined,
                data.password = undefined,
                data.newPassword = undefined
        }

        if (data.password && data.newPassword && existingUser.password) {
            const passwordMatch = await bcrypt.compare(data.password, existingUser.password);
            if (!passwordMatch) {
                return { success: false, message: "Incorrect password." }
            }
            const hashedPassword = await bcrypt.hash(data.newPassword, 10);
            data.password = hashedPassword;
            data.newPassword = undefined
        }

        await db
            .update(users)
            .set({ password: data.password, image: data.image })
            .where(eq(users.id, existingUser.id));

        revalidatePath("/settings");
        return { success: true, message: "Settings updated successfully." }
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("❌Error in updateSettings server action: ", errorMessage);
        throw new Error("Updating settings failed. Please try again later.");
    }
}