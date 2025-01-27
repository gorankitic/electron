"use server";

// database
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

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.token, token)
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

