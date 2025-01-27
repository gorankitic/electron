"use client"

// auth
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

const UserButton = ({ user, expires }: Session) => {
    return (
        <div className="flex items-center gap-2">
            <h1>{user?.name}</h1>
            <button onClick={() => signOut()}>
                Sign out
            </button>
        </div>

    )
}

export default UserButton;