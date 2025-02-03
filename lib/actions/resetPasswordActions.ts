"use server";

// database
import { db } from "@/db/database";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "@/db/schema";
// types
import { forgotPasswordSchema, ForgotPasswordSchema, resetPasswordSchema, ResetPasswordSchema } from "@/lib/types/authSchema";
// server actions
import { generatePasswordResetToken, getPasswordResetTokenByToken } from "@/lib/actions/tokenActions";
import { sendPasswordResetEmail } from "@/lib/actions/emailActions";
// lib
import { getErrorMessage } from "@/lib/utils";
import bcrypt from "bcryptjs";

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

export const resetPassword = async (data: ResetPasswordSchema, token: string) => {
    if (!token) {
        return { success: false, message: "Missing token." }
    }
    try {
        // Server-side data validation with Zod
        const result = resetPasswordSchema.safeParse(data);
        if (!result.success) {
            return { success: false, message: "Invalid password" };
        }
        const { password } = result.data;
        // Check if resetToken exists
        const existingToken = await getPasswordResetTokenByToken(token);
        if (!existingToken) {
            return { success: false, message: "Something went wrong." };
        }
        // Check if resetToken is expired
        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            return { success: false, message: "Reset password link has expired." };
        }
        // Check if user exists
        const existingUser = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.email, existingToken.email)
        });
        if (!existingUser) {
            return { success: false, message: "User owner of this token doesn't exist anymore." };
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Update user password
        await db
            .update(users)
            .set({ password: hashedPassword })
            .where(eq(users.email, existingUser.email));
        // Delete resetToken from database
        await db
            .delete(passwordResetTokens)
            .where(eq(passwordResetTokens.email, existingToken.email))

        return { success: true, message: "Your password has been changed successfully." }
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("❌Error in resetPassword server action: ", errorMessage);
        throw new Error("Password reset failed. Please try again later.");
    }
}