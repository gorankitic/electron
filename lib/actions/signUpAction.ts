"use server";

import bcrypt from "bcrypt";
// database
import { db } from "@/db/database";
import { users } from "@/db/schema";
// types
import { signUpSchema, SignUpSchema } from "@/lib/types/authSchema";
// server actions
import { generateEmailVerificationToken } from "@/lib/actions/tokenActions";
import { sendVerificationEmail } from "@/lib/actions/emailActions";
// utils
import { getErrorMessage } from "@/lib/utils";

export const signUp = async (data: SignUpSchema) => {
    try {
        // Server-side data validation with Zod
        const result = signUpSchema.safeParse(data);
        if (!result.success) {
            let errorMessage = result.error.issues
                .map(issue => issue.message)
                .join(". ");
            return { success: false, message: errorMessage };
        }
        const { name, email, password } = result.data;
        // Check if user already exists in database
        const existingUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email)
        });
        if (existingUser) {
            if (!existingUser.emailVerified) {
                // Resend verification email for unverified users
                const verificationToken = await generateEmailVerificationToken(email);
                await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);
                return { success: true, message: "User already exists. Please check your email for verification." };
            }
            return { success: false, message: "User already exists." };
        }
        // Hashing password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user in database
        await db.insert(users).values({ name, email: email, password: hashedPassword });
        // Create verification token
        const verificationToken = await generateEmailVerificationToken(email);
        // Send verification email
        await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);

        return { success: true, message: "Account created. Please check your email for verification." }
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("❌Error in signUp server action: ", errorMessage);
        throw new Error("Failed to create an account. Please try again later.");
    }
}