// components
import Link from "next/link";
// assets
import { Atom } from "lucide-react";

const Logo = ({ size }: { size?: number }) => {
    return (
        <Link
            href="/"
            className="flex items-center gap-1"
        >
            <Atom size={size} className="text-blue-500" />
            <span className="text-lg uppercase md:tracking-wider font-semibold text-blue-500">Electron</span>
        </Link>
    )
}
export default Logo;