"use client"

import { RiwayatCard } from "../../components/RiwayatCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type RiwayatItem } from "@/app/components/RiwayatCardItem";

type HistoryResponse = {
    history: RiwayatItem[];
    pagination: {
        limit: number;
        hasMore: boolean;
        nextCursor: string | null;
    };
    summary: {
        totalRestock: number;
        totalSell: number;
    };
};

export default function RiwayatPage() {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [histories, setHistories] = useState<RiwayatItem[]>([])
    const [cursor, setCursor] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [summary, setSummary] = useState({
        totalRestock: 0,
        totalSell: 0
    })

    const getHistory = useCallback(async (
        nextCursor: string | null,
        keyword: string,
        append = false
    ) => {
        try {
            setIsLoading(true)

            const params = new URLSearchParams()

            if (keyword) {
                params.set("search", keyword)
            }

            if (nextCursor) {
                params.set("cursor", nextCursor)
            }

            const response = await fetch(`/api/history?${params.toString()}`)
            const result = await response.json()

            if (!result.status) {
                toast.error(result.message)
                return
            }

            const data = result.data as HistoryResponse

            setHistories((current) => append
                ? [...current, ...data.history]
                : data.history
            )
            setCursor(data.pagination.nextCursor)
            setHasMore(data.pagination.hasMore)
            setSummary(data.summary)
        } catch (error) {
            console.error(error)
            toast.error("Tidak dapat mengambil data riwayat. Coba lagi nanti")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearch(search.trim())
        }, 300)

        return () => window.clearTimeout(timer)
    }, [search])

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void getHistory(null, debouncedSearch)
        }, 0)

        return () => window.clearTimeout(timer)
    }, [debouncedSearch, getHistory])

    const handleShowMore = () => {
        void getHistory(cursor, debouncedSearch, true)
    }

    const refreshHistory = () => {
        void getHistory(null, debouncedSearch)
    }

    return (
        <div className="min-h-screen">
            {/* summary */}
            <div className="mt-3 grid grid-cols-2 gap-2 px-2">
                {/* total restock */}
                <div className="p-2 bg-blue-500 rounded-md border relative overflow-hidden">
                    <div className="text-2xl font-semibold text-white mb-3">
                        {summary.totalRestock.toLocaleString("id-ID")}
                    </div>
                    <div className="text-sm text-end text-gray-100">Total Restock</div>

                    <div className="w-40 h-40 bg-white/10 rounded-full absolute top-5 -right-8"></div>
                    <div className="w-30 h-30 bg-white/10 rounded-full absolute top-12 -right-4"></div>
                </div>
                {/* total jual */}
                <div className="p-2 bg-orange-500 rounded-md border relative overflow-hidden">
                    <div className="text-2xl font-semibold text-white mb-3">
                        {summary.totalSell.toLocaleString("id-ID")}
                    </div>
                    <div className="text-sm text-end text-gray-100">Total Jual</div>

                    <div className="w-40 h-40 bg-white/10 rounded-full absolute top-5 -right-8"></div>
                    <div className="w-30 h-30 bg-white/10 rounded-full absolute top-12 -right-4"></div>
                </div>
            </div>

            <div className="px-2">
                {/* search */}
                <Field className="w-full my-3">
                    <InputGroup className="bg-white">
                        <InputGroupInput
                            id="inline-start-input"
                            placeholder="Cari berdasarkan nama, tanggal, atau ID"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            required
                        />
                        <InputGroupAddon align="inline-start">
                        <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground"/>
                        </InputGroupAddon>
                    </InputGroup>
                </Field>

                {/* list */}
                <div className="space-y-2 pb-30">
                    {histories.length > 0 ? (
                        <RiwayatCard
                            items={histories}
                            onUpdated={refreshHistory}
                            onDeleted={refreshHistory}
                        />
                    ) : (
                        <div className="text-center text-sm text-gray-500 py-10">
                            {isLoading ? "Memuat riwayat..." : "Belum ada riwayat"}
                        </div>
                    )}

                    {hasMore && (
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={handleShowMore}
                            className="w-full py-2 rounded-md border border-gray-300 bg-white text-sm disabled:opacity-60"
                        >
                            {isLoading ? "Memuat..." : "Show More"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
