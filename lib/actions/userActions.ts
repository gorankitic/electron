"use server";

// database
import { db } from "@/db/database";
// utils
import { getErrorMessage } from "@/lib/utils";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
            columns: {
                id: true,
                name: true,
                email: true,
                image: true,
                emailVerified: true,
                twoFactorEnabled: true,
                role: true,
            },
        });
        return user;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("❌Error in getUserByEmail server action: ", errorMessage)
        throw new Error("Something went wrong. Can't get user.");
    }
}