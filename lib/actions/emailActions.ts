"use server";

// utils
import { getBaseUrl, getErrorMessage } from "@/lib/utils";
import { VERIFICATION_EMAIL_TEMPLATE, RESET_PASSWORD_TEMPLATE } from "@/lib/email/templates";
// resend
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseUrl();

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/verify-email?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Electron | Verify your email address",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{confirmLink}", confirmLink)
    });

    if (error) {
        const errorMessage = getErrorMessage(error);
        console.error("❌Error in sendVerificationEmail: ", errorMessage);
        throw new Error("Failed to send the verification email. Try again.");
    }

    return data;
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/reset-password?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Electron | Reset your password",
        html: RESET_PASSWORD_TEMPLATE.replace("{resetLink}", resetLink)
    });

    if (error) {
        const errorMessage = getErrorMessage(error);
        console.error("❌Error in sendPasswordResetEmail: ", errorMessage);
        throw new Error("Failed to send the password reset email. Try again.");
    }

    return data;
}