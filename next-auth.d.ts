
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    id: string;
    role: "admin" | "user";
    isOAuth: boolean;
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}
