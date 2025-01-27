// next-auth
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
// database/drizzle
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/database";
import { signInSchema } from "@/lib/types/authSchema";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
// lib
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db),
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt"
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