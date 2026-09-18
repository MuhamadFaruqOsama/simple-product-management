import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "../authHelper";

const LIMIT = 25

const indonesianMonths: Record<string, number> = {
    januari: 0,
    februari: 1,
    maret: 2,
    april: 3,
    mei: 4,
    juni: 5,
    juli: 6,
    agustus: 7,
    september: 8,
    oktober: 9,
    november: 10,
    desember: 11
}

function getSearchId(search: string, type: "restock" | "sell") {
    const prefixedId = search.toLowerCase().match(new RegExp(`${type}-(\\d+)`))?.[1]
    const numericId = search.match(/^\d+$/)?.[0]
    const id = prefixedId || numericId

    return id ? Number(id) : null
}

function getSearchDateRange(search: string) {
    const normalizedSearch = search.trim().toLowerCase()
    let date: Date | null = null
    const numericDate = normalizedSearch.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
    const indonesianDate = normalizedSearch.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/)

    if (numericDate) {
        date = new Date(Number(numericDate[3]), Number(numericDate[2]) - 1, Number(numericDate[1]))
    } else if (indonesianDate && indonesianMonths[indonesianDate[2]] !== undefined) {
        date = new Date(Number(indonesianDate[3]), indonesianMonths[indonesianDate[2]], Number(indonesianDate[1]))
    } else {
        const parsedDate = new Date(search)
        date = Number.isNaN(parsedDate.getTime()) ? null : parsedDate
    }

    if (!date || Number.isNaN(date.getTime())) {
        return null
    }

    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 1)

    return {
        gte: startDate,
        lt: endDate
    }
}

function getHistoryId(id: string) {
    const [type, rawId] = id.split("-")
    const historyId = Number(rawId)

    if (
        (type !== "sell" && type !== "restock") ||
        !Number.isInteger(historyId)
    ) {
        return null
    }

    return {
        type,
        id: historyId
    }
}

async function restoreSellProductStock(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    productId: number,
    quantity: number
) {
    const restockProducts = await tx.restockProduct.findMany({
        select: {
            id: true,
            quantity: true,
            remainingStock: true
        },
        where: {
            productId
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

    let remainingQuantity = quantity

    for (const restockProduct of restockProducts) {
        if (remainingQuantity <= 0) {
            break
        }

        const stockCanRestore = restockProduct.quantity - restockProduct.remainingStock
        if (stockCanRestore <= 0) {
            continue
        }

        const stockToRestore = Math.min(stockCanRestore, remainingQuantity)

        await tx.restockProduct.update({
            where: {
                id: restockProduct.id
            },
            data: {
                remainingStock: {
                    increment: stockToRestore
                }
            }
        })

        remainingQuantity -= stockToRestore
    }

    await tx.product.update({
        where: {
            id: productId
        },
        data: {
            totalStock: {
                increment: quantity
            }
        }
    })
}

async function reduceSellProductStock(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    productId: number,
    quantity: number
) {
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

async function decreaseSellFinance(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    userId: number,
    productId: number,
    date: Date,
    amount: number
) {
    const financeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    await tx.productFinance.updateMany({
        where: {
            productId
        },
        data: {
            totalIncome: {
                decrement: amount
            }
        }
    })

    await tx.overallFinance.updateMany({
        where: {
            userId,
            date: financeDate
        },
        data: {
            totalIncome: {
                decrement: amount
            }
        }
    })
}

export async function GET(req: NextRequest) {
    try {
        const auth = await isAuthenticated(req)
        if (!auth.status) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: auth.message
            }, { status: 401 })
        }

        const userId = auth.payload?.id
        if (typeof userId !== "number") {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: "User tidak terautentikasi"
            }, { status: 401 })
        }

        const searchParams = req.nextUrl.searchParams
        const search = searchParams.get("search")?.trim() || ""
        const restockSearchId = search ? getSearchId(search, "restock") : null
        const sellSearchId = search ? getSearchId(search, "sell") : null
        const searchDateRange = search ? getSearchDateRange(search) : null
        const cursor = searchParams.get("cursor")
        const cursorDate = cursor ? new Date(cursor) : null
        const createdAtFilter = cursorDate && !Number.isNaN(cursorDate.getTime())
            ? {
                createdAt: {
                    lt: cursorDate
                }
            }
            : {}

        const restockSearchFilter = search ? {
            OR: [
                {
                    product: {
                        name: {
                            contains: search,
                            mode: "insensitive" as const
                        }
                    }
                },
                ...(restockSearchId ? [{ id: restockSearchId }] : []),
                ...(searchDateRange ? [{ createdAt: searchDateRange }] : [])
            ]
        } : {}

        const sellSearchFilter = search ? {
            OR: [
                {
                    customer_name: {
                        contains: search,
                        mode: "insensitive" as const
                    }
                },
                {
                    listSellProducts: {
                        some: {
                            product: {
                                name: {
                                    contains: search,
                                    mode: "insensitive" as const
                                }
                            }
                        }
                    }
                },
                ...(sellSearchId ? [{ id: sellSearchId }] : []),
                ...(searchDateRange ? [{ createdAt: searchDateRange }] : [])
            ]
        } : {}

        const restockWhere = {
            ...createdAtFilter,
            ...restockSearchFilter,
            product: {
                userId,
                deletedAt: null
            }
        }

        const sellWhere = {
            ...createdAtFilter,
            ...sellSearchFilter,
            userId
        }

        const [
            restockProducts,
            sellProducts,
            totalRestock,
            totalSell
        ] = await Promise.all([
            prisma.restockProduct.findMany({
                select: {
                    id: true,
                    quantity: true,
                    purchasePrice: true,
                    createdAt: true,
                    product: {
                        select: {
                            name: true,
                            user: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    }
                },
                where: restockWhere,
                orderBy: {
                    createdAt: "desc"
                },
                take: LIMIT + 1
            }),
            prisma.sellProduct.findMany({
                select: {
                    id: true,
                    customer_name: true,
                    createdAt: true,
                    user: {
                        select: {
                            username: true
                        }
                    },
                    listSellProducts: {
                        select: {
                            id: true,
                            quantity: true,
                            sellingPrice: true,
                            product: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
                where: sellWhere,
                orderBy: {
                    createdAt: "desc"
                },
                take: LIMIT + 1
            }),
            prisma.restockProduct.count({
                where: {
                    product: {
                        userId,
                        deletedAt: null
                    }
                }
            }),
            prisma.sellProduct.count({
                where: {
                    userId
                }
            })
        ])

        const restockHistory = restockProducts.map((item) => ({
            id: `restock-${item.id}`,
            type: "restock" as const,
            is_restock: true,
            date: item.createdAt,
            customerName: null,
            storeName: item.product.user.username,
            products: [
                {
                    id: item.id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: Number(item.purchasePrice),
                    total: item.quantity * Number(item.purchasePrice)
                }
            ],
            totalQuantity: item.quantity,
            totalAmount: item.quantity * Number(item.purchasePrice)
        }))

        const sellHistory = sellProducts.map((item) => {
            const products = item.listSellProducts.map((listProduct) => ({
                id: listProduct.id,
                name: listProduct.product.name,
                quantity: listProduct.quantity,
                price: Number(listProduct.sellingPrice),
                total: listProduct.quantity * Number(listProduct.sellingPrice)
            }))

            return {
                id: `sell-${item.id}`,
                type: "sell" as const,
                is_restock: false,
                date: item.createdAt,
                customerName: item.customer_name,
                storeName: item.user.username,
                products,
                totalQuantity: products.reduce((total, product) => total + product.quantity, 0),
                totalAmount: products.reduce((total, product) => total + product.total, 0)
            }
        })

        const history = [...restockHistory, ...sellHistory]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
        const paginatedHistory = history.slice(0, LIMIT)
        const nextCursor = paginatedHistory[paginatedHistory.length - 1]?.date ?? null

        return NextResponse.json({
            status: true,
            status_code: 200,
            data: {
                history: paginatedHistory,
                pagination: {
                    limit: LIMIT,
                    hasMore: history.length > LIMIT,
                    nextCursor
                },
                summary: {
                    totalRestock,
                    totalSell
                }
            },
            message: "Berhasil mengambil data riwayat"
        }, { status: 200 })
        
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

export async function PUT(req: NextRequest) {
    try {
        const auth = await isAuthenticated(req)
        if (!auth.status) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: auth.message
            }, { status: 401 })
        }

        const userId = auth.payload?.id
        if (typeof userId !== "number") {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: "User tidak terautentikasi"
            }, { status: 401 })
        }

        const body = await req.json()
        const historyId = getHistoryId(String(body.id || ""))

        if (!historyId || historyId.type !== "sell") {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: "Riwayat penjualan tidak valid"
            }, { status: 400 })
        }

        const data = Array.isArray(body.data) ? body.data : []
        const returnToStock = Boolean(body.returnToStock)
        if (data.length < 1) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: "Minimal 1 produk harus diisi"
            }, { status: 400 })
        }

        await prisma.$transaction(async (tx) => {
            const sellProduct = await tx.sellProduct.findFirst({
                where: {
                    id: historyId.id,
                    userId
                },
                include: {
                    listSellProducts: true
                }
            })

            if (!sellProduct) {
                throw new Error("Riwayat penjualan tidak ditemukan")
            }

            const productIdByListId = new Map(
                sellProduct.listSellProducts.map((item) => [item.id, item.productId])
            )

            for (const item of sellProduct.listSellProducts) {
                const amount = item.quantity * Number(item.sellingPrice)

                if (returnToStock) {
                    await restoreSellProductStock(tx, item.productId, item.quantity)
                }

                await decreaseSellFinance(tx, userId, item.productId, sellProduct.createdAt, amount)
            }

            await tx.listSellProduct.deleteMany({
                where: {
                    sellProductId: sellProduct.id
                }
            })

            await tx.sellProduct.update({
                where: {
                    id: sellProduct.id
                },
                data: {
                    customer_name: String(body.name || "")
                }
            })

            for (const item of data) {
                const listSellProductId = Number(item.listSellProductId)
                const productId = productIdByListId.get(listSellProductId)
                const quantity = Number(item.quantity)
                const sellingPrice = Number(item.selling_price)

                if (
                    !productId ||
                    !Number.isFinite(quantity) ||
                    quantity < 1 ||
                    !Number.isFinite(sellingPrice) ||
                    sellingPrice < 0
                ) {
                    throw new Error("Data produk penjualan tidak valid")
                }

                if (returnToStock) {
                    await reduceSellProductStock(tx, productId, quantity)
                }

                const addListSellProduct = await tx.listSellProduct.create({
                    data: {
                        sellProductId: sellProduct.id,
                        productId,
                        quantity,
                        sellingPrice
                    }
                })

                if (!returnToStock) {
                    await tx.product.update({
                        where: {
                            id: addListSellProduct.productId
                        },
                        data: {
                            totalStock: {
                                increment: addListSellProduct.quantity
                            }
                        }
                    })
                }
            }
        })

        return NextResponse.json({
            status: true,
            status_code: 200,
            data: null,
            message: "Riwayat berhasil diubah"
        }, { status: 200 })
        
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

export async function DELETE(req: NextRequest) {
    try {
        const auth = await isAuthenticated(req)
        if (!auth.status) {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: auth.message
            }, { status: 401 })
        }

        const userId = auth.payload?.id
        if (typeof userId !== "number") {
            return NextResponse.json({
                status: false,
                status_code: 401,
                data: null,
                message: "User tidak terautentikasi"
            }, { status: 401 })
        }

        const searchParams = req.nextUrl.searchParams
        const historyId = getHistoryId(String(searchParams.get("id") || ""))
        const returnToStock = searchParams.get("returnToStock") === "true"

        if (!historyId) {
            return NextResponse.json({
                status: false,
                status_code: 400,
                data: null,
                message: "Riwayat tidak valid"
            }, { status: 400 })
        }

        await prisma.$transaction(async (tx) => {
            if (historyId.type === "sell") {
                const sellProduct = await tx.sellProduct.findFirst({
                    where: {
                        id: historyId.id,
                        userId
                    },
                    include: {
                        listSellProducts: true
                    }
                })

                if (!sellProduct) {
                    throw new Error("Riwayat penjualan tidak ditemukan")
                }

                for (const item of sellProduct.listSellProducts) {
                    const amount = item.quantity * Number(item.sellingPrice)

                    if (returnToStock) {
                        await restoreSellProductStock(tx, item.productId, item.quantity)
                    }

                    await decreaseSellFinance(tx, userId, item.productId, sellProduct.createdAt, amount)
                }

                await tx.sellProduct.delete({
                    where: {
                        id: sellProduct.id
                    }
                })

                return
            }

            const restockProduct = await tx.restockProduct.findFirst({
                where: {
                    id: historyId.id,
                    product: {
                        userId
                    }
                }
            })

            if (!restockProduct) {
                throw new Error("Riwayat pengadaan tidak ditemukan")
            }

            if (returnToStock) {
                await tx.product.update({
                    where: {
                        id: restockProduct.productId
                    },
                    data: {
                        totalStock: {
                            decrement: restockProduct.remainingStock
                        }
                    }
                })
            }

            await tx.productFinance.updateMany({
                where: {
                    productId: restockProduct.productId
                },
                data: {
                    totalSpending: {
                        decrement: restockProduct.quantity * Number(restockProduct.purchasePrice)
                    }
                }
            })

            const financeDate = new Date(
                restockProduct.createdAt.getFullYear(),
                restockProduct.createdAt.getMonth(),
                restockProduct.createdAt.getDate()
            )

            await tx.overallFinance.updateMany({
                where: {
                    userId,
                    date: financeDate
                },
                data: {
                    totalSpending: {
                        decrement: restockProduct.quantity * Number(restockProduct.purchasePrice)
                    }
                }
            })

            await tx.restockProduct.delete({
                where: {
                    id: restockProduct.id
                }
            })
        })

        return NextResponse.json({
            status: true,
            status_code: 200,
            data: null,
            message: "Riwayat berhasil dihapus"
        }, { status: 200 })
        
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
