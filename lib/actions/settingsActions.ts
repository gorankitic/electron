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
            data.image = undefined;
            data.password = undefined;
            data.newPassword = undefined;
        }

        if (data.password && data.newPassword && existingUser.password) {
            const passwordMatch = await bcrypt.compare(data.password, existingUser.password);
            if (!passwordMatch) {
                throw new Error("Incorrect password.");
            }
            const hashedPassword = await bcrypt.hash(data.newPassword, 10);
            await db
                .update(users)
                .set({ password: hashedPassword })
                .where(eq(users.id, existingUser.id));
        }

        if (data.image && data.image !== existingUser.image) {
            await db
                .update(users)
                .set({ image: data.image })
                .where(eq(users.id, existingUser.id));
        }

        return { success: true, message: "Settings updated successfully. Sign in again to see changes." }
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("❌Error in updateSettings server action: ", errorMessage);
        throw new Error("Updating settings failed. Please try again later.");
    }
}