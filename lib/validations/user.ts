import z from "zod";

export const authUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(5, "Email tidak boleh kurang dari 5 karakter")
        .max(255, "Email tidak boleh lebih dari 255 karakter"),
    password: z
        .string()
        .min(6, "Password tidak boleh kurang dari 6 karakter")
        .max(255, "Password tidak boleh lebih dari 255 karakter")
})

export type AuthUserSchema = z.infer<typeof authUserSchema>