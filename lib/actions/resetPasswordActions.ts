"use server";

// database
import { db } from "@/db/database";
// types
import { forgotPasswordSchema, ForgotPasswordSchema } from "@/lib/types/authSchema";
// server actions
import { generatePasswordResetToken } from "@/lib/actions/tokenActions";
import { sendPasswordResetEmail } from "@/lib/actions/emailActions";
// utils
import { getErrorMessage } from "../utils";

export const forgotPassword = async (data: ForgotPasswordSchema) => {
    try {
        // Server-side data validation with Zod
        const result = forgotPasswordSchema.safeParse(data);
        if (!result.success) {
            return { success: false, message: "Invalid email" };
        }
        const { email } = result.data;

        // Check if user exists in database
        const existingUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email)
        });
        if (!existingUser) {
            return { success: false, message: "User does not exist." };
        }

        const passwordResetToken = await generatePasswordResetToken(email);
        await sendPasswordResetEmail(email, passwordResetToken[0].token);

        return { success: true, message: "Reset password link has been sent to your email." }
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("❌Error in forgotPassword server action: ", errorMessage);
        throw new Error("Failed to create password reset link. Try again later.");
    }
}