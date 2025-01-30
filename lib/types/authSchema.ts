import * as z from "zod";

export const signInSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});
export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).max(50),
    email: z.string().min(1, { message: "Email is required" }).max(50).email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must have at least 6 characters" }).max(50),
});
export type SignUpSchema = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
});
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    password: z.string().min(1, { message: "Password is required" }).max(50),
});
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;