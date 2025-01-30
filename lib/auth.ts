// next-auth
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
// database/drizzle
import { db } from "@/db/database";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
// types
import { signInSchema } from "@/lib/types/authSchema";
// lib
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db),
    secret: process.env.AUTH_SECRET,
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, session }) {
            if (!token.sub) return token;
            const userId = token.sub;
            try {
                const existingUser = await db.query.users.findFirst({
                    where: (users, { eq }) => eq(users.id, userId),
                });
                if (!existingUser) return token;
                const existingAccount = await db.query.accounts.findFirst({
                    where: (accounts, { eq }) => eq(accounts.userId, existingUser.id),
                });

                token.role = existingUser.role;
                token.isOAuth = !!existingAccount;

            } catch (error) {
                console.error("❌Error in JWT callback:", error);
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.sub as string;
                session.user.role = token.role as "user" | "admin";
                session.user.isOAuth = token.isOAuth as boolean;
            }
            return session;
        }
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            authorize: async (credentials) => {
                const validatedFields = signInSchema.safeParse(credentials);
                if (!validatedFields.success) {
                    let errorMessage = validatedFields.error.issues
                        .map(issue => issue.message)
                        .join(". ");
                    throw new Error(errorMessage);
                }
                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    const user = await db.query.users.findFirst({
                        where: eq(users.email, email)
                    });
                    if (!user || !user.password) return null;
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (passwordMatch) return user;
                }
                return null;
            }
        })
    ],
});