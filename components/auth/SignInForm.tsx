"use client";

// hooks
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// types
import { SignInSchema, signInSchema } from "@/lib/types/authSchema";
// components
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import Message from "@/components/auth/Message";
import SpinnerMini from "@/components/SpinnerMini";
// server actions
import { credentialsSignIn } from "@/lib/actions/signInAction";
// utils
import { getErrorMessage } from "@/lib/utils";
// framer-motion
import { motion } from "framer-motion";
// assets
import { Mail, KeyRound, EyeOff, Eye, Send, ArrowLeft } from "lucide-react";

const SignInForm = () => {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<SignInSchema>({ resolver: zodResolver(signInSchema) });

    const onSubmit = async (data: SignInSchema) => {
        try {
            const response = await credentialsSignIn(data);
            if (!response.success) {
                return setError("root", { type: "server", message: response.message });
            }
            if (response.message === "SignIn") {
                return router.push("/");
            }
            setMessage(response.message);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            setError("root", { type: "server", message: errorMessage });
        }
    }

    return (
        <AuthCard
            title="Welcome back"
            backLinkHref="/signup"
            backLinkLabel="Don&apos;t have an account?"
            showSocials
            leftIcon={ArrowLeft}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5">
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
                            autoComplete="off"
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
                <div className="flex items-center">
                    <Link href="/forgot-password" className="text-sm mt-2 ml-auto text-gray-600 hover:text-blue-600 hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting}
                    className="primary-btn"
                >
                    {isSubmitting ? <SpinnerMini /> : (
                        <>
                            <span>Sign in</span>
                            <Send className="size-4 text-white" />
                        </>
                    )}
                </motion.button>
            </form>
        </AuthCard>
    )
}

export default SignInForm;