"use client";

// hooks
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// components
import AuthCard from "@/components/auth/AuthCard";
import Message from "@/components/auth/Message";
import SpinnerMini from "@/components/SpinnerMini";
// server actions
import { verifyEmailToken } from "@/lib/actions/tokenActions";
// utils
import { getErrorMessage } from "@/lib/utils";
// framer-motion
import { motion } from "framer-motion";
// assets
import { CircleCheckBig, Mail } from "lucide-react";

const VerifyEmailForm = () => {
    const token = useSearchParams().get("token");
    const router = useRouter();
    const [status, setStatus] = useState({ message: "", type: "" });

    const handleVerification = useCallback(async () => {
        if (!token) {
            setStatus({ message: "Token is not found.", type: "error" });
            return;
        }
        try {
            const response = await verifyEmailToken(token);
            if (response.success) {
                setStatus({ message: response.message, type: "success" });
                setTimeout(() => router.push("/signin"), 2000);
            } else {
                setStatus({ message: response.message, type: "error" });
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            setStatus({ message: errorMessage, type: "error" });
        }
    }, []);

    useEffect(() => {
        handleVerification();
    }, []);

    return (
        <AuthCard
            title="Email Verification"
            backLinkHref="/signin"
            backLinkLabel="Back to sign in"
        >
            {!status.message && <div className="flex justify-center"><SpinnerMini /></div>}
            {status.type === "success" && (
                <div className='text-center'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="flex items-center justify-center mx-auto my-4"
                    >
                        <CircleCheckBig className="w-10 h-10 text-gray-500 stroke-[1.5px]" />
                    </motion.div>
                    <p className='text-gray-600'>{status.message}</p>
                </div>
            )}
            {status.type === "error" && <Message message={status.message} type="error" className="justify-center" />}
        </AuthCard>
    )
}

export default VerifyEmailForm;