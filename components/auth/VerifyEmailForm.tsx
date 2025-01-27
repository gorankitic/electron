"use client";

// hooks
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// server actions
import { verifyEmailToken } from "@/lib/actions/tokenActions";
// utils
import { getErrorMessage } from "@/lib/utils";
// components
import AuthCard from "./AuthCard";
import SpinnerMini from "../SpinnerMini";

const VerifyEmailForm = () => {
    const token = useSearchParams().get("token");
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleVerification = useCallback(async () => {
        if (!token) {
            setError("Token is not found.");
            return;
        }
        try {
            const response = await verifyEmailToken(token);
            if (response.success) {
                setSuccess(response.success);
                router.push("/signin");
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            setError(errorMessage);
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
            {!success && !error ? <div className="flex justify-center"><SpinnerMini /></div> : null}
            {success && <p className="text-center text-gray-600">{success}</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
        </AuthCard>
    )
}

export default VerifyEmailForm;