"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/database";
import { passwordResetTokens, users, verificationTokens } from "@/db/schema";

export const getVerficationToken = async (email: string) => {
    try {
        const verificationToken = await db.query.verificationTokens.findFirst({
            where: eq(verificationTokens.email, email)
        });
        return verificationToken;
    } catch (error) {
        return null;
    }
}

export const generateEmailVerificationToken = async (email: string) => {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

    const existingToken = await getVerficationToken(email);
    if (existingToken) {
        await db.delete(verificationTokens).where(eq(verificationTokens.id, existingToken.id));
    }
    const verificationToken = await db
        .insert(verificationTokens)
        .values({ email, token, expires })
        .returning();

    return verificationToken;
}

export const verifyEmailToken = async (token: string) => {
    try {
        const existingToken = await db.query.verificationTokens.findFirst({
            where: eq(verificationTokens.token, token)
        });
        if (!existingToken) {
            return { success: false, message: "Something went wrong." };
        }

        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            return { success: false, message: "Verification link has expired." };
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, existingToken.email)
        });
        if (!existingUser) {
            return { success: false, message: "User owner of this token doesn't exist anymore." };
        }

        await db
            .update(users)
            .set({ emailVerified: new Date() })
            .where(eq(users.email, existingToken.email))

        await db
            .delete(verificationTokens)
            .where(eq(verificationTokens.email, existingToken.email))

        return { success: true, message: "Your email has been successfully verified." }
    } catch (error) {
        console.error("❌Error verifying email token: ", error);
        throw new Error("Failed to verify email. Please try again later.");
    }
}

export const getPasswordResetToken = async (email: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.email, email)
        });
        return passwordResetToken;
    } catch (error) {
        return null;
    }
}

export const generatePasswordResetToken = async (email: string) => {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

    const existingToken = await db.query.passwordResetTokens.findFirst({
        where: eq(passwordResetTokens.email, email)
    });
    if (existingToken) {
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id));
    }

    const passwordResetToken = await db
        .insert(passwordResetTokens)
        .values({ email, token, expires })
        .returning();

    return passwordResetToken;
}