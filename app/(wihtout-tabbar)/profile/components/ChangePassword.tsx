"use client"

import { FormErrorMessage } from "@/app/components/FormErrorMessage";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { changePasswordSchema, type ChangePasswordSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PasswordFieldKey = "old_password" | "new_password" | "confirm_password";

export function ChangePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState<Record<PasswordFieldKey, boolean>>({
        old_password: false,
        new_password: false,
        confirm_password: false,
    });
    
    const togglePassword = (field: PasswordFieldKey) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const form = useForm<ChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_password: ""
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = form

    const onSubmit = async (data: ChangePasswordSchema) => {
        try {
            setIsLoading(true)

            const dataString = JSON.stringify(data)

            const response = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json"
                },
                body: dataString
            })

            const result = await response.json()

            if(!result.status) {
                toast.error(result.message)
                setIsLoading(false)
                return
            }

            toast.success(result.message)
            setIsLoading(false)
            reset()            
            return
            
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan pada server. Coba lagi nanti")
            setIsLoading(false)
            return
        }
    }
    
    return (
        <div className="bg-white p-2 rounded-md border border-gray-200 mb-3">
            <h3 className="font-medium">Reset Password</h3>
            <div className="mt-3 space-y-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* password lama */}
                    <Field className="w-full">
                        <FieldLabel className="text-gray-600 -mb-1" htmlFor="input-old-password">Password Lama</FieldLabel>
                        <InputGroup className="h-10 bg-white">
                            <InputGroupInput
                                id="input-old-password"
                                type={showPassword.old_password ? "text" : "password"}
                                className="h-10"
                                {...register("old_password")}
                                required
                            />
                            <InputGroupAddon align="inline-end">
                                <button type="button" className="cursor-pointer" onClick={() => togglePassword("old_password")}>
                                    {
                                        showPassword.old_password ?
                                        (<HugeiconsIcon icon={ViewOffIcon} size={18} className="text-muted-foreground me-1"/>) :
                                        (<HugeiconsIcon icon={EyeIcon} size={18} className="text-muted-foreground me-1"/>)
                                    }
                                </button>
                            </InputGroupAddon>
                        </InputGroup>
                        {errors.old_password && (
                            <FormErrorMessage message={errors.old_password.message as string} />
                        )}
                    </Field>
                    {/* password baru */}
                    <Field className="w-full">
                        <FieldLabel className="text-gray-600 -mb-1" htmlFor="input-new-password">Password Baru</FieldLabel>
                        <InputGroup className="h-10 bg-white">
                            <InputGroupInput
                                id="input-new-password"
                                type={showPassword.new_password ? "text" : "password"}
                                className="h-10"
                                required
                                {...register("new_password")}
                            />
                            <InputGroupAddon align="inline-end">
                                <button type="button" className="cursor-pointer" onClick={() => togglePassword("new_password")}>
                                    {
                                        showPassword.new_password ?
                                        (<HugeiconsIcon icon={ViewOffIcon} size={18} className="text-muted-foreground me-1"/>) :
                                        (<HugeiconsIcon icon={EyeIcon} size={18} className="text-muted-foreground me-1"/>)
                                    }
                                </button>
                            </InputGroupAddon>
                        </InputGroup>
                        {errors.new_password && (
                            <FormErrorMessage message={errors.new_password.message as string} />
                        )}
                    </Field>
                    {/* konfirmasi password */}
                    <Field className="w-full">
                        <FieldLabel className="text-gray-600 -mb-1" htmlFor="input-confirm-password">Konfirmasi Password</FieldLabel>
                        <InputGroup className="h-10 bg-white">
                            <InputGroupInput
                                id="input-confirm-password"
                                type={showPassword.confirm_password ? "text" : "password"}
                                className="h-10"
                                {...register("confirm_password")}
                                required
                            />
                            <InputGroupAddon align="inline-end">
                                <button type="button" className="cursor-pointer" onClick={() => togglePassword("confirm_password")}>
                                    {
                                        showPassword.confirm_password ?
                                        (<HugeiconsIcon icon={ViewOffIcon} size={18} className="text-muted-foreground me-1"/>) :
                                        (<HugeiconsIcon icon={EyeIcon} size={18} className="text-muted-foreground me-1"/>)
                                    }
                                </button>
                            </InputGroupAddon>
                        </InputGroup>
                        {errors.confirm_password && (
                            <FormErrorMessage message={errors.confirm_password.message as string} />
                        )}
                    </Field>
                    {/* button simpan */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="h-10 px-5 mt-3 rounded-md text-white bg-blue-500 text-sm font-medium disabled:bg-blue-300">
                            Ubah Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}