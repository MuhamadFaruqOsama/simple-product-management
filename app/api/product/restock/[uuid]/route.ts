import { isAuthenticated } from "@/app/api/authHelper";
import { prisma } from "@/lib/prisma";
import { addProductStockSchema } from "@/lib/validations/produtc";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{uuid: string}> }
) {
    try {
        const auth = await isAuthenticated(req)
        if(!auth.status) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: auth.message
            }, { status: 401 })
        }

        const body = await req.json()

        const validation = addProductStockSchema.safeParse(body)
        if(!validation.success) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: validation.error.issues.map(issue => issue.message).join(", ")
            }, {status: 400})
        }
        
        const { uuid } = await params
        const userId = auth.payload?.id

        const {
            quantity,
            purchase_price
        } = validation.data

        const createNewStock = await prisma.product.update({
            where: {
                uuid
            },
            data: {
                restockProducts: {
                    create: {
                        quantity,
                        purchasePrice: purchase_price,
                        remainingStock: quantity
                    }
                },
            },
            include: {
                restockProducts: true
            }
        })

        if(!createNewStock) {
            return NextResponse.json({
                status: false,
                status_code: 433,
                data: null,
                message: "Tidak dapat menambahkan stok produk. Coba lagi nanti"
            }, { status: 433 })
        }

        return NextResponse.json({
            status: true,
            status_code: 201,
            data: createNewStock,
            message: "Stok produk berhasil ditambahkan"
        }, { status: 201 })

    } catch (error) {
        console.error(error)

        return NextResponse.json({
            status: false,
            status_code: 500,
            data: null,
            message: "Terjadi kesalahan pada sisi server. Coba lagi nanti" 
        }, { status: 500 })
    }
}
