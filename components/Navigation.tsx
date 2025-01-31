"use client";

// hooks
import { usePathname } from "next/navigation";
// components
import Link from "next/link";
// types
import { NavLink } from "@/lib/navLinks";
// lib
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Navigation = ({ navLinks }: { navLinks: NavLink[] }) => {
    const pathName = usePathname();

    return (
        <nav className="flex justify-center mt-5 mb-14">
            <ul className="flex items-center gap-5 md:gap-8 text-gray-600">
                <AnimatePresence>
                    {navLinks.map(link => (
                        <motion.li whileTap={{ scale: 0.9 }} key={link.path}>
                            <Link
                                href={link.path}
                                className={cn(
                                    "flex flex-col items-center font-medium text-xs md:text-sm relative",
                                    pathName === link.path && "text-blue-500"
                                )}
                            >
                                {link.icon}
                                {link.label}
                                {pathName === link.path ? (
                                    <motion.div
                                        layoutId="underline"
                                        transition={{ type: "spring", stiffness: 50 }}
                                        className="h-[1px] w-full rounded-full absolute bg-blue-500 z-0 left-0 bottom-0"
                                    />
                                ) : null}
                            </Link>
                        </motion.li>
                    )
                    )}
                </AnimatePresence>
            </ul>
        </nav >
    )
}

export default Navigation;