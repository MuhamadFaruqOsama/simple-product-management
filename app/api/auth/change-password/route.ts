import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "../../authHelper"
import { changePasswordSchema } from "@/lib/validations/user"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    try {        
        const auth = await isAuthenticated(req)
        if(!auth.status) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: auth.message
            }, {status: 401})
        }

        const body = await req.json()
        const validation = changePasswordSchema.safeParse(body)

        if(!validation.success) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: validation.error.issues[0].message
            }, {status: 400})
        }

        const user = await prisma.user.findUnique({
            where: {
                id: auth.payload?.id,
            }
        })

        if(!user) {
            return NextResponse.json({
                status: false,
                status_code: 404,
                data: null,
                message: "Pengguna tidak ditemukan"
            }, {status: 403})
        }

        const { old_password, new_password } = body
        const isPasswordMatch = await bcrypt.compare(old_password, user.password)

        if(!isPasswordMatch) {
            return NextResponse.json({
                status: false,
                status_code: 433,
                data: null,
                message: "Password tidak valid"
            }, {status: 433})
        }

        const hashedPassword = await bcrypt.hash(new_password, 10)
        const updatePassword = await prisma.user.update({
            where: {
                id: auth.payload?.id
            },
            data: {
                password: hashedPassword
            }
        })

        if(!updatePassword) {
            return NextResponse.json({
                status: false,
                status_code: 433,
                data: null,
                message: "Tidak dapat merubah password. Coba lagi nanti"
            }, {status: 433})
        }

        return NextResponse.json({
            status: true,
            status_code: 200,
            data: null,
            message: "Password berhasil diperbarui"
        }, {status: 200})
        
    } catch (error) {
        console.error(error)

        return NextResponse.json({
            status: false,
            status_code: 500,
            data: null,
            message: "Terjadi kesalahan pada server"
        }, {status: 500})
    }
}