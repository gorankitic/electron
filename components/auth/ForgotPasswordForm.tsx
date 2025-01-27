"use client";

// hooks
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// types
import { forgotPasswordSchema, ForgotPasswordSchema } from "@/lib/types/authSchema";
// components
import AuthCard from "@/components/auth/AuthCard";
import SpinnerMini from "@/components/SpinnerMini";
import Message from "@/components/auth/Message";
// server actions
import { forgotPassword } from "@/lib/actions/resetPasswordActions";
// utils
import { getErrorMessage } from "@/lib/utils";
// framer-motion
import { motion } from "framer-motion";
// assets
import { Mail, Send, ArrowLeft } from "lucide-react";

const ForgotPasswordForm = () => {
    const [message, setMessage] = useState("");
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<ForgotPasswordSchema>({ resolver: zodResolver(forgotPasswordSchema) });

    const onSubmit = async (data: ForgotPasswordSchema) => {
        try {
            const response = await forgotPassword(data);
            console.log(response)
            if (response.success) {
                setMessage(response.message);
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
            title="Forgot password?"
            backLinkHref="/signin"
            backLinkLabel="Back to sign in"
            leftIcon={ArrowLeft}
        >
            {!message ? (
                <>
                    <p className="text-center text-gray-600 text-sm -mt-5">Submit your email address and we will send you a reset password link</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative mt-5">
                            <input
                                {...register("email")}
                                type="email"
                                name="email"
                                placeholder="Email"
                                autoComplete="off"
                                disabled={isSubmitting}
                                className="auth-input"
                            />
                            <Mail className="input-icon" />
                            {errors.email && <p className="error mt-1">{errors.email.message}</p>}
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
                                    <span>Send reset link</span>
                                    <Send className="w-4 h-4 text-white" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </>
            ) : (
                <div className='text-center'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="w-14 h-14 border-2 border-gray-500 rounded-full flex items-center justify-center mx-auto my-4"
                    >
                        <Mail className="h-8 w-8 text-gray-500 stroke-[1.5px]" />
                    </motion.div>
                    <p className='text-gray-600'>{message}</p>
                </div>
            )}
        </AuthCard >
    )
}

export default ForgotPasswordForm;