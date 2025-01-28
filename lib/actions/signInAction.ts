"use server";

// next-auth
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
// database
import { db } from "@/db/database";
// types
import { SignInSchema } from "@/lib/types/authSchema";
// server actions
import { generateEmailVerificationToken } from "@/lib/actions/tokenActions";
import { sendVerificationEmail } from "@/lib/actions/emailActions";
// utils
import { getErrorMessage } from "@/lib/utils";

export const credentialsSignIn = async (data: SignInSchema) => {
    try {
        // Server-side data validation with Zod in auth/authorized
        // Check if user exists in database
        const existingUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, data.email)
        });
        if (!existingUser) {
            return { success: false, message: "User does not exist." };
        }
        // Check if user is verified
        if (!existingUser.emailVerified) {
            const verificationToken = await generateEmailVerificationToken(existingUser.email);
            await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);
            return { success: true, message: "Your email isn't verified. Please check your email for verification." };
        }

        await signIn("credentials", { email: data.email, password: data.password, redirect: false });

        return { success: true, message: "SignIn" };

    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("❌Error in signIn server action: ", errorMessage)
        if (error instanceof AuthError) throw new Error("Incorrect email or password.");
        throw new Error("Sign-in failed. Please try again later.");
    }
}