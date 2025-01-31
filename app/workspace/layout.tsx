// components
import Navigation from "@/components/Navigation";
// lib
import { auth } from "@/lib/auth";
import { adminLinks, userLinks } from "@/lib/navLinks";

export default async function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    const navLinks = [...(session?.user.role === "admin" ? adminLinks : []), ...userLinks];

    return (
        <>
            <Navigation navLinks={navLinks} />
            {children}
        </>
    );
}
