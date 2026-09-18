import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "../authHelper";
import { createSellProductFormSchema, sellProductFormSchema } from "@/lib/validations/selling";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const auth = await isAuthenticated(req)
        if(!auth.status) {
            return NextResponse.json({
                status: auth.status,
                status_code: 401,
                data: null,
                message: "Unauthorized"
            })
        }

        const userId = auth.payload?.id
        if (typeof userId !== "number") {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: "unauthorized"
            }, { status: 401 })
        }
        
        const body = await req.json()
        const baseValidation = sellProductFormSchema.safeParse(body)

        if (!baseValidation.success) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: baseValidation.error.flatten(),
                message: "Data penjualan tidak valid"
            }, { status: 400 })
        }

        const uuid = [...new Set(baseValidation.data.data.map((item) => item.uuid))]
        const product = await prisma.product.findMany({
            select: {
                id: true,
                uuid: true,
                totalStock: true
            },
            where: {
                uuid: {
                    in: uuid
                },
                userId
            }
        })

        if (product.length !== uuid.length) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: "Ada produk yang tidak ditemukan"
            }, { status: 400 })
        }

        const validation = createSellProductFormSchema(
            product.map((item) => ({
                uuid: item.uuid,
                stock: item.totalStock
            }))
        ).safeParse(baseValidation.data)

        if (!validation.success) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: validation.error.flatten(),
                message: "Stok produk tidak mencukupi"
            }, { status: 400 })
        }

        const result = await prisma.$transaction(async (tx) => {
            // add log selling
            const addLogSelling = await tx.sellProduct.create({
                data: {
                    userId,
                    customer_name: baseValidation?.data?.name
                }
            })


            // list product on log selling
            const addListProductOnLogSelling = await tx.listSellProduct.createMany({
                data: validation?.data?.data.map((item) => {
                    return {
                        sellProductId: addLogSelling.id,
                        productId: product.find((product) => product.uuid === item.uuid)?.id as number,
                        quantity: item.quantity,
                        sellingPrice: item.selling_price
                    }
                })
            })

            const stockToReduceByProduct = new Map<number, number>()

            validation.data.data.forEach((item) => {
                const productId = product.find((product) => product.uuid === item.uuid)?.id as number
                stockToReduceByProduct.set(
                    productId,
                    (stockToReduceByProduct.get(productId) || 0) + item.quantity
                )
            })

            for (const [productId, quantity] of stockToReduceByProduct) {
                const restockProducts = await tx.restockProduct.findMany({
                    select: {
                        id: true,
                        remainingStock: true
                    },
                    where: {
                        productId,
                        remainingStock: {
                            gt: 0
                        }
                    },
                    orderBy: [
                        {
                            createdAt: "asc"
                        },
                        {
                            id: "asc"
                        }
                    ]
                })

                const totalRemainingStock = restockProducts.reduce(
                    (total, restockProduct) => total + restockProduct.remainingStock,
                    0
                )

                if (totalRemainingStock < quantity) {
                    throw new Error("Stok restock product tidak mencukupi")
                }

                let remainingQuantity = quantity

                for (const restockProduct of restockProducts) {
                    if (remainingQuantity <= 0) {
                        break
                    }

                    const stockToUse = Math.min(restockProduct.remainingStock, remainingQuantity)

                    await tx.restockProduct.update({
                        where: {
                            id: restockProduct.id
                        },
                        data: {
                            remainingStock: {
                                decrement: stockToUse
                            }
                        }
                    })

                    remainingQuantity -= stockToUse
                }
            }

            return {
                logSelling: addLogSelling,
                listProductOnLogSelling: addListProductOnLogSelling
            }
        })

        return NextResponse.json({
            status: true,
            status_code: 201,
            data: result,
            message: "Penjualan berhasil ditambahkan"
        }, { status: 201 })
        
    } catch (error) {
        console.error(error)
        
        return NextResponse.json({
            status: false,
            status_code: 500,
            data: null,
            message: "Terjadi masalah pada sisi server. Coba lagi nanti"
        }, {status: 500})
    }
}
