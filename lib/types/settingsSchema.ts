import * as z from "zod";

export const settingsSchema = z.object({
    name: z.optional(z.string()),
    email: z.optional(z.string()),
    image: z.optional(z.string()),
    password: z.optional(z.string()),
    newPassword: z.optional(z.string())
});
export type SettingsSchema = z.infer<typeof settingsSchema>;