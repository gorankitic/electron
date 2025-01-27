"use server";

// utils
import { getBaseUrl } from "@/lib/utils";
import { VERIFICATION_EMAIL_TEMPLATE } from "@/lib/email/templates";
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
        console.error("Error in sendVerificationEmail:", error);
        throw new Error("Failed to send the verification email. Try again.");
    }

    return data;
}