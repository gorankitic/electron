// components
import Link from "next/link";
// assets
import { Atom } from "lucide-react";

const Logo = ({ size }: { size?: number }) => {
    return (
        <Link
            href="/"
            className="flex items-center gap-2"
        >
            <Atom size={size} />
            <span className="font-semibold">Electron</span>
        </Link>
    )
}
export default Logo;