"use client";

// hooks
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// types
import { SignUpSchema, signUpSchema } from "@/lib/types/authSchema";
// components
import AuthCard from "@/components/auth/AuthCard";
import SpinnerMini from "@/components/SpinnerMini";
// server actions
import { signUp } from "@/lib/actions/authActions";
// framer-motion
import { motion } from "framer-motion";
// assets
import { Mail, KeyRound, EyeOff, Eye, Send, UserRound } from "lucide-react";
// utils
import { getErrorMessage } from "@/lib/utils";

const SignUpForm = () => {
    const [success, setSuccess] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<SignUpSchema>({ resolver: zodResolver(signUpSchema) });

    const onSubmit = async (data: SignUpSchema) => {
        try {
            const response = await signUp(data);
            if (response.success) {
                setSuccess(response.success);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error(error);
            setError("root", { type: "server", message: errorMessage });
        }
    }

    return (
        <AuthCard
            title="Create an account"
            backLinkHref="/signin"
            backLinkLabel="Already have an account?"
            showSocials
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
                        {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
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
                        {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
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
                        {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
                    </div>
                </div>
                {success && <p className="text-center text-blue-600 mt-3">{success}</p>}
                {errors.root?.type === "server" && <p className="text-red-500 mt-1">{errors.root.message}</p>}
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