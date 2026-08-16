import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { addProductFormSchema } from "@/lib/validations/produtc"
import { isAuthenticated } from "../authHelper"

export async function GET(req: NextRequest) {
    try {
        const auth = await isAuthenticated(req)
        if (!auth.status) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: auth.message
            }, { status: 401 });
        }

        const userId = auth.payload?.id;

        if (!userId) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: "User tidak terautentikasi"
            }, { status: 401 });
        }

        const getProductData = await prisma.product.findMany({
            where: {
                userId: userId,
                deletedAt: null
            }
        })

        return NextResponse.json({
            status: true,
            status_code: 200,
            data: getProductData,
            message: "Berhasil mengambil data produk"
        }, { status: 200 })
        
    } catch (error) {
        console.error(error)

        return NextResponse.json({
            status: false,
            status_code: 500,
            data: null,
            message: "Terjadi kesalahan dari sisi server. Coba lagi nanti"
        }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        // is user authenticated
        const auth = await isAuthenticated(req)

        if(!auth.status) {
            return NextResponse.json({
                status: auth.status,
                status_code: 401,
                data: null,
                message: auth.message
            }, {status: 401})
        }
        
        const body = await req.json()

        // zod validation form backend
        const validation = addProductFormSchema.safeParse(body)
        if(!validation.success) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: validation.error.issues.map(issue => issue.message).join(", ")
            }, {status: 400})
        }

        const user_id = auth.payload?.id
        if (typeof user_id !== "number") {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: "unauthorized"
            }, { status: 401 })
        }

        const {
            name,
            unit,
            volume,
            selling_price,
            quantity,
            purchase_price,
            description,
            thumbnail
        } = validation.data
        const safeDescription = description ?? ""
        const safeThumbnail = thumbnail ?? ""
        
        const addProduct = await prisma.product.create({
            data: {
                userId: user_id,
                name,
                unit,
                volume,
                sellingPrice: selling_price,
                description: safeDescription,
                thumbnail: safeThumbnail
            }
        })

        if(!addProduct) {
            return NextResponse.json({
                status: false,
                status_code: 433,
                data: null,
                message: "Tidak dapat menambahkan produk"
            }, {status: 433})
        }

        const updateStockProduct = await prisma.restockProduct.create({
            data: {
                productId: addProduct.id,
                quantity: quantity,
                purchasePrice: purchase_price,
                remainingStock: quantity
            }
        })

        if(!updateStockProduct) {
            return NextResponse.json({
                status: false,
                status_code: 433,
                data: null,
                message: "Total produk gagal ditambahkan"
            }, { status: 433 })
        }

        return NextResponse.json({
            status: true,
            status_code: 201,
            data: addProduct,
            message: "Produk berhasil ditambahkan"
        }, { status: 201 })

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