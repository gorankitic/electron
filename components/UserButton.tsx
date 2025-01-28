"use client"

// hooks
import { useRouter } from "next/navigation";
// auth
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
// components
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// assets
import { LogOut, Settings, Truck } from "lucide-react";

const UserButton = ({ user, expires }: Session) => {
    const router = useRouter();
    if (!user) return null;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <Avatar className="relative w-8 h-8" aria-label={`Avatar of ${user.name}`}>
                    {user.image && (
                        <Image
                            src={user.image}
                            alt={user.name!}
                            fill={true}
                            sizes="(max-width: 768px) 100vw, 40px"
                        />
                    )}
                    {!user.image && (
                        <AvatarFallback>
                            {user.name?.charAt(0).toLocaleUpperCase()}
                        </AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 px-5 py-3" align="end">
                <div className="mb-2 flex items-center gap-3">
                    {user.image && (
                        <Image
                            src={user.image}
                            alt={user.name!}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    )}
                    <div className="">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="group cursor-pointer transition-all duration-300">
                    <Truck className="text-gray-700 group-hover:translate-x-1 transition-all duration-500 ease-in-out" />
                    <span>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="group cursor-pointer transition-all duration-300" onClick={() => router.push("/settings")}>
                    <Settings className="text-gray-700 group-hover:rotate-180 transition-all duration-500 ease-in-out" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="group cursor-pointer transition-all duration-300"
                    onClick={() => signOut()}
                >
                    <LogOut className="text-gray-700 group-hover:translate-x-1 transition-all duration-500 ease-in-out" />
                    <span >Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton;