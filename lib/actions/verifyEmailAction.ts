"use server";

// database
import { eq } from "drizzle-orm";
import { db } from "@/db/database";
import { users, verificationTokens } from "@/db/schema";
// utils
import { getErrorMessage } from "@/lib/utils";

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
        const errorMessage = getErrorMessage(error);
        console.error("❌Error in verifyEmailToken server action: ", errorMessage);
        throw new Error("Email verification failed. Please try again later.");
    }
}