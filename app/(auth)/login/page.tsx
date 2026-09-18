'use client'

import { FormErrorMessage } from "@/app/components/FormErrorMessage";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authUserSchema, type AuthUserSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ImageLogo from "@/public/img/logo.avif";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    
    const form = useForm<AuthUserSchema>({
        resolver: zodResolver(authUserSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = form

    const onSubmit = async (data: AuthUserSchema) => {
        try {
            setIsLoading(true)
            
            const dataString = JSON.stringify(data)

            const response = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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
            router.push("/")
            
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan pada server. Coba lagi nanti")
            setIsLoading(false)
            return
        }
    }
    
    return (
        <div className="h-screen w-full flex items-center justify-center px-2 bg-gray-50">
            <div className="bg-white w-[90%] md:w-100 rounded-md border border-gray-200 px-4">
                <div className="mb-7">
                    <Image
                        src={ImageLogo}
                        alt="Logo"
                        width={150}
                        height={100}
                        className="mx-auto"
                    />
                    <div className="text-center text-2xl font-bold text-blue-500">
                        Selamat Datang <span className="text-orange-500">Kembali</span>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 py-4">
                    {/* <div className="text-center text-2xl font-semibold text-orange-500 mb-10">Login</div> */}
                
                    <Field>
                        <FieldLabel className="text-gray-600" htmlFor="input-auth-username">Username</FieldLabel>
                        <Input
                            id="input-auth-username"
                            placeholder="username"
                            type="text"
                            {...register("username")}
                        />
                            {errors.username && (
                                <FormErrorMessage message={errors.username.message as string} />
                            )}
                    </Field>
                    <Field>
                        <FieldLabel className="text-gray-600" htmlFor="input-auth-password">Password</FieldLabel>
                        <Input
                            id="input-auth-password"
                            placeholder="password"
                            type="password"
                            {...register("password")}
                        />
                            {errors.password && (
                                <FormErrorMessage message={errors.password.message as string} />
                            )}
                    </Field>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="font-bold w-full h-full bg-blue-500 py-2 mt-5 rounded-md text-white disabled:bg-blue-300">
                        {isLoading ? "Loading..." : "Login"}
                     </button>
                </form>
            </div>
        </div>
    )
}