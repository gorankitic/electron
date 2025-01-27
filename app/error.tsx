"use client";

// assets
import { Atom, RotateCw } from "lucide-react";
import Link from "next/link";

type ErrorProps = {
    error: Error & { digest?: string }
    reset: () => void
}

const Error = ({ error, reset }: ErrorProps) => {

    return (
        <main className="flex justify-center items-center flex-col gap-4 mt-40 max-w-7xl mx-auto px-10">
            <Link
                href="/"
                className="flex items-center gap-2"
            >
                <Atom size={20} />
                <span className="font-semibold text-xl">Electron</span>
            </Link>
            <h1 className="text-3xl font-semibold uppercase tracking-widest">Something went wrong!</h1>
            <p className="text-xl text-red-600 max-w-5xl">{error.message}</p>
            <button
                onClick={reset}
                className="flex items-center gap-2 bg-blue-500 text-blue-50 hover:bg-blue-500/90 rounded-sm px-4 py-2"
            >
                <RotateCw size={20} />
                Try again
            </button>
        </main>
    )
}

export default Error;