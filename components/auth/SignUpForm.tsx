"use client";

// hooks
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// types
import { SignUpSchema, signUpSchema } from "@/lib/types/authSchema";
// components
import AuthCard from "@/components/auth/AuthCard";
import Message from "@/components/auth/Message";
import SpinnerMini from "@/components/SpinnerMini";
// server actions
import { signUp } from "@/lib/actions/signUpAction";
// utils
import { getErrorMessage } from "@/lib/utils";
// framer-motion
import { motion } from "framer-motion";
// assets
import { Mail, KeyRound, EyeOff, Eye, Send, UserRound, ArrowLeft } from "lucide-react";

const SignUpForm = () => {
    const [message, setMessage] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<SignUpSchema>({ resolver: zodResolver(signUpSchema) });

    const onSubmit = async (data: SignUpSchema) => {
        try {
            const response = await signUp(data);
            if (response.success) {
                setMessage(response.message);
            } else {
                setError("root", { type: "server", message: response.message });
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            setError("root", { type: "server", message: errorMessage });
        }
    }

    return (
        <AuthCard
            title="Create an account"
            backLinkHref="/signin"
            backLinkLabel="Already have an account?"
            showSocials
            leftIcon={ArrowLeft}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5">
                    <div className="relative">
                        <input
                            {...register("name")}
                            type="text"
                            name="name"
                            placeholder="Name"
                            autoComplete="off"
                            disabled={isSubmitting}
                            className="auth-input"
                        />
                        <UserRound className="input-icon" />
                        {errors.name && <p className="error mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="relative">
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
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            disabled={isSubmitting}
                            className="auth-input"
                        />
                        <KeyRound className="input-icon" />
                        {!passwordVisible ? (
                            <Eye
                                onClick={() => setPasswordVisible(prev => !prev)}
                                className="w-5 h-5 absolute right-3 top-[10px] text-gray-500 cursor-pointer"
                            />) : (
                            <EyeOff
                                onClick={() => setPasswordVisible(prev => !prev)}
                                className="w-5 h-5 absolute right-3 top-[10px] text-gray-500 cursor-pointer"
                            />
                        )}
                        {errors.password && <p className="error mt-1">{errors.password.message}</p>}
                    </div>
                </div>
                {message && <Message message={message} type="info" />}
                {errors.root?.type === "server" && <Message message={errors.root.message} type="error" />}
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting}
                    className="primary-btn mt-5"
                >
                    {isSubmitting ? <SpinnerMini /> : (
                        <>
                            <span>Sign up</span>
                            <Send className="size-4 text-white" />
                        </>
                    )}
                </motion.button>
            </form>
        </AuthCard>
    )
}

export default SignUpForm;