"use client";

// hooks
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// components
import Message from "@/components/auth/Message";
import AuthCard from "@/components/auth/AuthCard";
import SpinnerMini from "@/components/SpinnerMini";
// server actions
import { resetPassword } from "@/lib/actions/resetPasswordActions";
// types
import { resetPasswordSchema, ResetPasswordSchema } from "@/lib/types/authSchema";
// lib
import { getErrorMessage } from "@/lib/utils";
import { motion } from "framer-motion";
// assets
import { Send, KeyRound, EyeOff, Eye, ArrowLeft } from "lucide-react";

const ResetPasswordForm = () => {
    const router = useRouter();
    const token = useSearchParams().get("token") as string;
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<ResetPasswordSchema>({ resolver: zodResolver(resetPasswordSchema) });

    const onSubmit = async (data: ResetPasswordSchema) => {
        try {
            const response = await resetPassword(data, token);
            if (response.success) {
                router.push("/signin");
            }
            if (!response.success) {
                setError("root", { type: "server", message: response.message });
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            setError("root", { type: "server", message: errorMessage });
        }
    }

    return (
        <AuthCard
            title="Reset password"
            backLinkHref="/forgot-password"
            backLinkLabel="Send new reset link"
            leftIcon={ArrowLeft}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                    <input
                        {...register("password")}
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        placeholder="New password"
                        autoComplete="off"
                        disabled={isSubmitting}
                        className="input"
                    />
                    <KeyRound className="left-input-icon" />
                    {!passwordVisible ? (
                        <Eye
                            onClick={() => setPasswordVisible(prev => !prev)}
                            className="right-input-icon"
                        />) : (
                        <EyeOff
                            onClick={() => setPasswordVisible(prev => !prev)}
                            className="right-input-icon"
                        />
                    )}
                    {errors.password && <p className="error mt-1">{errors.password.message}</p>}
                </div>
                {errors.root?.type === "server" && <Message message={errors.root.message} type="error" />}
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting}
                    className="primary-btn mt-6"
                >
                    {isSubmitting ? <SpinnerMini /> : (
                        <>
                            <span>Reset password</span>
                            <Send className="w-4 h-4 text-white" />
                        </>
                    )}
                </motion.button>
            </form>
        </AuthCard>
    )
}
export default ResetPasswordForm;