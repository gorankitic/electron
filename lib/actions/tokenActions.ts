"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/database";
import { users, verificationTokens } from "@/db/schema";

export const getVerficationTokenByEmail = async (email: string) => {
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

    const existingToken = await getVerficationTokenByEmail(email);

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
            throw new Error("Something went wrong. Token not found.");
        }

        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            throw new Error("Token has expired.");
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, existingToken.email)
        });
        if (!existingUser) {
            throw new Error("User owner of this token doesn't exist anymore.");
        }

        await db
            .update(users)
            .set({ emailVerified: new Date() })
            .where(eq(users.email, existingToken.email))

        await db
            .delete(verificationTokens)
            .where(eq(verificationTokens.email, existingToken.email))

        return { success: "Your email has been successfully verified." }
    } catch (error) {
        console.error("Error verifying email token:", error);
        throw new Error("Failed to verify email. Please try again later.");
    }
}