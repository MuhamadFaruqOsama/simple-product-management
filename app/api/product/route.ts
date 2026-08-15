import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { addProductFormSchema } from "@/lib/validations/produtc"

export async function POST(req: Request) {
    try {
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

        const userIdHeader = req.headers.get("x-user-id")
        const userId = userIdHeader ? Number(userIdHeader) : Number.NaN

        if (!userIdHeader || Number.isNaN(userId) || userId <= 0) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: "Header x-user-id wajib diisi dengan user id yang valid"
            }, { status: 400 })
        }

        const data = validation.data
        const description = data.description ?? ""
        const thumbnail = data.thumbnail ?? ""

        const result = await prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    userId,
                    name: data.name,
                    unit: data.unit,
                    totalStock: data.quantity,
                    volume: data.volume,
                    sellingPrice: data.selling_price,
                    description,
                    thumbnail
                }
            })

            const restockProduct = await tx.restockProduct.create({
                data: {
                    userId,
                    productId: product.id,
                    quantity: data.quantity,
                    purchasePrice: data.purchase_price
                }
            })

            return { product, restockProduct }
        })

        return NextResponse.json({
            status: true,
            status_code: 201,
            data: result,
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
