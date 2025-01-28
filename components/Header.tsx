// components
import Link from "next/link";
import Logo from "@/components/Logo";
import UserButton from "@/components/UserButton";
// auth
import { auth } from "@/lib/auth";

const Header = async () => {
    const session = await auth();

    return (
        <header className="py-2 border-b md:py-3 flex justify-between">
            <Logo />
            {!session ? (
                <Link href="/signin">Sign in</Link>
            ) : (
                <UserButton user={session?.user} expires={session?.expires} />
            )}
        </header>
    )
}

export default Header;