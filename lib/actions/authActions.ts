"use server";

import bcrypt from "bcrypt";
// next-auth
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
// database
import { db } from "@/db/database";
import { users } from "@/db/schema";
// types
import { SignInSchema, signUpSchema, SignUpSchema } from "@/lib/types/authSchema";
// utils
import { getErrorMessage } from "@/lib/utils";
// server actions
import { generateEmailVerificationToken } from "@/lib/actions/tokenActions";
import { sendVerificationEmail } from "@/lib/actions/emailActions";

export const signUp = async (data: SignUpSchema) => {
    try {
        // Server-side data validation with Zod
        const result = signUpSchema.safeParse(data);
        if (!result.success) {
            let errorMessage = result.error.issues
                .map(issue => issue.message)
                .join(". ");
            throw new Error(errorMessage);
        }
        // Check if user already exists in database
        const existingUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, data.email)
        });
        if (existingUser) {
            if (!existingUser.emailVerified) {
                // Resend verification email for unverified users
                const verificationToken = await generateEmailVerificationToken(data.email);
                await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);
                return { success: "A new verification email has been sent to your email address." };
            }
            throw new Error("User already exists.");
        }
        // Hashing password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        // Create user in database
        await db.insert(users).values({ name: data.name, email: data.email, password: hashedPassword });
        // Create verification token
        const verificationToken = await generateEmailVerificationToken(data.email);
        // Send verification email
        await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);

        return { success: "Account created. Please check your email for verification." }
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
    }
}

export const credentialsSignIn = async (data: SignInSchema) => {
    try {
        // Server-side data validation with Zod in auth/authorized
        // Check if user already exists in database
        const existingUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, data.email)
        });
        if (!existingUser) {
            throw new Error("User does not exist.");
        }
        // Check if user is verified
        if (!existingUser.emailVerified) {
            const verificationToken = await generateEmailVerificationToken(existingUser.email);
            await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);
            return { message: "A new verification email has been sent to your email address." };
        }

        await signIn("credentials", { email: data.email, password: data.password, redirect: false });

        return { success: "Signed in." }
    } catch (error) {
        if (error instanceof AuthError) throw new Error("Incorrect email or password.");
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
    }
}