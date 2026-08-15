import { prisma } from "@/lib/prisma"
import { authUserSchema } from "@/lib/validations/user"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const validation = authUserSchema.safeParse(body)

        if(!validation.success) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: validation.error.issues[0].message
            }, {status: 400})
        }

        const { username, password } = validation.data

        // cari user
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if(!user) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: "Username tidak terdaftar"
            }, {status: 400})
        }

        // cek password
        const isPassswordMatch = await bcrypt.compare(password, user.password)

        if(!isPassswordMatch) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: "Password salah"
            }, {status: 400})
        }

        // return response
        const token = await createToken({
            id: user.id,
            username: user.username
        })

        const response = NextResponse.json({
            status: true,
            status_code: 200,
            data: user,
            message: "Login berhasil"
        })

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        })

        return response

    } catch (error) {
        console.log(error)
        
        return NextResponse.json({
            status: false,
            status_code: 500,
            data: null,
            message: "Terjadi kesalahan pada server. Coba lagi nanti"
        }, {status: 500})
    }
}