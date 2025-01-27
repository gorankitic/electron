// components
import Link from "next/link";
// assets
import { Atom, Home } from "lucide-react";

const NotFound = () => {
    return (
        <main className="flex flex-col items-center gap-10 mt-52">
            <div className="flex items-center gap-2">
                <Atom size={20} />
                <span className="font-semibold text-xl">Electron</span>
            </div>
            <h1 className="text-2xl font-medium tracking-wider uppercase">
                This page does not exist!
            </h1>
            <Link
                href="/"
                className="flex items-center gap-2 bg-blue-500 text-blue-50 hover:bg-blue-500/90 rounded-sm px-4 py-2"
            >
                <Home size={20} />
                Go Back
            </Link>
        </main>
    )
}

export default NotFound;