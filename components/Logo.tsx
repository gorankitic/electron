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
            <Atom size={size} />
            <span className="text-lg uppercase font-medium">Electron</span>
        </Link>
    )
}
export default Logo;