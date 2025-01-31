"use client";

// components
import Image from "next/image";
// auth
import { signIn } from "next-auth/react";

const SocialButtons = () => {

    return (
        <div className="flex flex-col items-center text-gray-600">
            <p className="text-sm my-2">or</p>
            <button
                onClick={() => signIn("google", { redirectTo: "/" })}
                className="flex items-center justify-center gap-4 w-full border border-gray-300 hover:bg-gray-200/80 rounded-md shadow-sm px-5 py-2"
            >
                <Image
                    src="https://authjs.dev/img/providers/google.svg"
                    alt="Google logo"
                    height="20"
                    width="20"
                />
                <span>Sign in with Google</span>
            </button>
        </div>
    )
}

export default SocialButtons;