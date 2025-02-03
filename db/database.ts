import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import * as schema from "@/db/schema";

dotenv.config({ path: ".env.local" });

// 🐛 Debugging
// if (!process.env.DATABASE_URL) {
//     throw new Error("❌ DATABASE_URL is not set in the environment variables.");
// }
// 🚀 Solved: Don't forget "use server" in server action files

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });