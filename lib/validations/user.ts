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

export const changePasswordSchema = z.object({
    old_password: z
        .string()
        .trim()
        .min(6, "Password lama tidak boleh kurang dari 6 karakter")
        .max(255, "Password lama tidak boleh lebih dari 255 karakter"),
    new_password: z
        .string()
        .trim()
        .min(6, "Password baru tidak boleh kurang dari 6 karakter")
        .max(255, "Password baru tidak boleh lebih dari 255 karakter"),
    confirm_password: z
        .string()
        .trim()
        .min(6, "Konfirmasi password tidak boleh kurang dari 6 karakter")
        .max(255, "Konfirmasi password tidak boleh lebih dari 255 karakter")
}).refine(
    (data) => data.new_password === data.confirm_password, {
        message: "Konfirmasi password tidak sesuai",
        path: ["confirm_password"]
    }
)

export type AuthUserSchema = z.infer<typeof authUserSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>