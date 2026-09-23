"use client"

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Card from "../components/Card";
import { SalesPurchasesCard } from "../components/SalesPurchasesCard";
import { LeftToRightListNumberIcon, MoneyBag02Icon, PackageSearchIcon } from "@hugeicons/core-free-icons";
import { EarningChart } from "../components/EarningChart";
import { ProductAnalysisChart } from "../components/ProductAnalysisChart";
import { StockAnalysisChart } from "../components/StockAnalysisChart";
import { toast } from "sonner";

type DashboardData = {
    summary: {
        pendapatan: number;
        pengeluaran: number;
        saldo: number;
    };
    financeAnalysis: {
        month: string;
        pemasukkan: number;
        pengeluaran: number;
    }[];
    productAnalysis: {
        product: string;
        jumlah: number;
    }[];
    stockAnalysis: {
        product: string;
        stok: number;
    }[];
}

const defaultDashboardData: DashboardData = {
    summary: {
        pendapatan: 0,
        pengeluaran: 0,
        saldo: 0
    },
    financeAnalysis: [],
    productAnalysis: [],
    stockAnalysis: []
}

function formatRupiah(value: number) {
    return `Rp${value.toLocaleString("id-ID")}`
}

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardData>(defaultDashboardData)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const response = await fetch("/api/dashboard")
                const result = await response.json()

                if (!response.ok || !result.status) {
                    toast.error(result.message)
                    return
                }

                setDashboardData(result.data)
            } catch (error) {
                console.error(error)
                toast.error("Tidak dapat mengambil data beranda. Coba lagi nanti")
            } finally {
                setIsLoading(false)
            }
        }

        getDashboardData()
    }, [])

    return (
        <div className="min-h-screen pb-40">
            <div className="space-y-1 mt-7 px-2">
                <Card title="Total Saldo Bulan Ini" value={
                    dashboardData.summary.saldo < 0 ? "0" :
                    formatRupiah(dashboardData.summary.saldo)
                } />
                <SalesPurchasesCard
                    pengeluaran={dashboardData.summary.pengeluaran}
                    pendapatan={dashboardData.summary.pendapatan}
                />
            </div>

            <div className="mt-10">
                <div className="flex gap-2 items-center bg-white border border-gray-200 rounded-tl-full rounded-bl-full w-full p-2 ms-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-linear-to-tr from-sky-500 to-blue-500">
                    <HugeiconsIcon icon={MoneyBag02Icon} size={20}/>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="text-black font-medium">Analisa Keuangan</div>
                    <div className="text-sm text-gray-500">Bulan ini sampai 4 bulan kebelakang</div>
                </div>
                </div>
                <div className="px-2"><EarningChart data={dashboardData.financeAnalysis}/></div>
            </div>
            
            <div className="mt-10">
                <div className="flex gap-2 items-center bg-white border border-gray-200 rounded-tl-full rounded-bl-full w-full p-2 ms-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-linear-to-tr from-sky-500 to-blue-500">
                    <HugeiconsIcon icon={PackageSearchIcon} size={20}/>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="text-black font-medium">Analisa Produk</div>
                    <div className="text-sm text-gray-500">Produk paling laris bulan ini</div>
                </div>
                </div>
                <div className="px-2">
                    {isLoading || dashboardData.productAnalysis.length > 0 ? (
                        <ProductAnalysisChart data={dashboardData.productAnalysis}/>
                    ) : (
                        <div className="text-center p-4 text-sm text-gray-500">
                            Belum ada produk terjual bulan ini
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-10">
                <div className="flex gap-2 items-center bg-white border border-gray-200 rounded-tl-full rounded-bl-full w-full p-2 ms-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-linear-to-tr from-sky-500 to-blue-500">
                    <HugeiconsIcon icon={LeftToRightListNumberIcon} size={20}/>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="text-black font-medium">Analisa Stok Produk</div>
                    <div className="text-sm text-gray-500">Produk dengan stok paling sedikit</div>
                </div>
                </div>
                <div className="px-2">
                    {isLoading || dashboardData.stockAnalysis.length > 0 ? (
                        <StockAnalysisChart data={dashboardData.stockAnalysis}/>
                    ) : (
                        <div className="text-center p-4 text-sm text-gray-500">
                            Belum ada produk
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
