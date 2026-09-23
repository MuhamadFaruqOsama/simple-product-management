import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "../authHelper";

const monthFormatter = new Intl.DateTimeFormat("id-ID", {
    month: "short"
})

function getMonthRange(date: Date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)

    return {
        start,
        end
    }
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

        const now = new Date()
        const currentMonth = getMonthRange(now)
        const firstChartMonth = new Date(now.getFullYear(), now.getMonth() - 4, 1)

        const chartMonths = Array.from({ length: 5 }, (_, index) => {
            const date = new Date(now.getFullYear(), now.getMonth() - 4 + index, 1)

            return {
                key: `${date.getFullYear()}-${date.getMonth()}`,
                label: monthFormatter.format(date),
                start: date,
                end: new Date(date.getFullYear(), date.getMonth() + 1, 1)
            }
        })

        const [
            currentMonthFinance,
            financeRows,
            soldProductGroups,
            stockProducts
        ] = await Promise.all([
            prisma.overallFinance.aggregate({
                _sum: {
                    totalIncome: true,
                    totalSpending: true
                },
                where: {
                    userId,
                    date: {
                        gte: currentMonth.start,
                        lt: currentMonth.end
                    }
                }
            }),
            prisma.overallFinance.findMany({
                select: {
                    totalIncome: true,
                    totalSpending: true,
                    date: true
                },
                where: {
                    userId,
                    date: {
                        gte: firstChartMonth,
                        lt: currentMonth.end
                    }
                }
            }),
            prisma.listSellProduct.groupBy({
                by: ["productId"],
                _sum: {
                    quantity: true
                },
                where: {
                    createdAt: {
                        gte: currentMonth.start,
                        lt: currentMonth.end
                    },
                    sellProduct: {
                        userId
                    }
                },
                orderBy: {
                    _sum: {
                        quantity: "desc"
                    }
                },
                take: 10
            }),
            prisma.product.findMany({
                select: {
                    id: true,
                    name: true,
                    totalStock: true
                },
                where: {
                    userId,
                    deletedAt: null
                },
                orderBy: {
                    totalStock: "asc"
                },
                take: 10
            })
        ])

        const soldProductIds = soldProductGroups.map((item) => item.productId)
        const soldProducts = soldProductIds.length > 0
            ? await prisma.product.findMany({
                select: {
                    id: true,
                    name: true
                },
                where: {
                    id: {
                        in: soldProductIds
                    },
                    userId
                }
            })
            : []

        const productNameById = new Map(
            soldProducts.map((product) => [product.id, product.name])
        )

        const financeByMonth = new Map(
            chartMonths.map((month) => [
                month.key,
                {
                    month: month.label,
                    pemasukkan: 0,
                    pengeluaran: 0
                }
            ])
        )

        financeRows.forEach((finance) => {
            const date = new Date(finance.date)
            const key = `${date.getFullYear()}-${date.getMonth()}`
            const current = financeByMonth.get(key)

            if (!current) return

            current.pemasukkan += Number(finance.totalIncome)
            current.pengeluaran += Number(finance.totalSpending)
        })

        const pendapatan = Number(currentMonthFinance._sum.totalIncome || 0)
        const pengeluaran = Number(currentMonthFinance._sum.totalSpending || 0)

        return NextResponse.json({
            status: true,
            status_code: 200,
            data: {
                summary: {
                    pendapatan,
                    pengeluaran,
                    saldo: pendapatan - pengeluaran
                },
                financeAnalysis: Array.from(financeByMonth.values()),
                productAnalysis: soldProductGroups.map((item) => ({
                    product: productNameById.get(item.productId) || "-",
                    jumlah: item._sum.quantity || 0
                })),
                stockAnalysis: stockProducts.map((product) => ({
                    product: product.name,
                    stok: product.totalStock
                }))
            },
            message: "Berhasil mengambil data dashboard"
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
