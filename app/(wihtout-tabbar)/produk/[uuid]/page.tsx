'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import {    
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { RestockButton } from "@/app/components/RestockButton";
import { EditProduct } from "@/app/components/EditProduct";
import { DeleteProduct } from "@/app/components/DeleteProduct";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const placeholderImage =
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Cpath d='M120 250l48-52 38 38 28-30 46 44' fill='none' stroke='%239ca3af' stroke-width='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='160' cy='155' r='18' fill='%239ca3af'/%3E%3C/svg%3E";

const detailProductData = [
    {
        title: "nama",
        value: "Produk"
    },
    {
        title: "harga beli",
        value: "Rp100.000"
    },
    {
        title: "satuan",
        value: "pcs"
    },
    {
        title: "stok",
        value: "90"
    },
    {
        title: "volume",
        value: "1,5kg"
    },
    {
        title: "deskripsi",
        value: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
    },
    {
        title: "harga jual",
        value: "Rp150.000"
    },
    {
        title: "margin",
        value: "Rp50.000"
    },
    {
        title: "presentase margin",
        value: "50%"
    }
]

const detailKeuanganData = [
    {
        title: "total penjualan",
        value: "Rp1.500.000"
    },
    {
        title: "total pengadaan",
        value: "Rp1.000.000"
    },
    {
        title: "total keuntungan",
        value: "Rp500.000"
    },
    {
        title: "presentase keuntungan",
        value: "50%"
    }
]


// penjualan
const detailPenjualanData = [
    {
        title: "penjualan pertama",
        value: "28 jan 2026"
    },
    {
        title: "total penjualan",
        value: 8
    },
    {
        title: "penjualan terakhir",
        value: "28 jan 2026"
    }
]

const riwayatPenjualanData = [
    {
        tanggal: "28 jan 2026",
        jumlah: 4,
        hargaJualSatuan: "Rp150.000",
        total: "Rp600.000"
    },
    {
        tanggal: "12 feb 2026",
        jumlah: 2,
        hargaJualSatuan: "Rp150.000",
        total: "Rp300.000"
    },
    {
        tanggal: "03 mar 2026",
        jumlah: 6,
        hargaJualSatuan: "Rp150.000",
        total: "Rp900.000"
    },
]

// pengadaan
const detailPengadaanData = [
    {
        title: "pengadaan pertama",
        value: "28 jan 2026"
    },
    {
        title: "total pengadaan",
        value: 8
    },
    {
        title: "pengadaan terakhir",
        value: "28 jan 2026"
    }
]

const riwayatPengadaanData = [
    {
        tanggal: "28 jan 2026",
        jumlah: 4,
        hargaBeliSatuan: "Rp100.000",
        total: "Rp400.000"
    },
    {
        tanggal: "12 feb 2026",
        jumlah: 2,
        hargaBeliSatuan: "Rp100.000",
        total: "Rp200.000"
    },
    {
        tanggal: "03 mar 2026",
        jumlah: 6,
        hargaBeliSatuan: "Rp100.000",
        total: "Rp600.000"
    },
]

type ViewMode = "semua" | "penjualan" | "pengadaan";

type ProductFinanceDetail = {
    id: number;
    productId: number;
    totalIncome: number | undefined;
    totalSpending: number | undefined;
    date: string;
    lastUpdatedAt?: string;
};

type RestockProductDetail = {
    id: number;
    productId: number;
    quantity: number;
    remainingStock: number;
    purchasePrice: string | number;
    createdAt: string;
};

type ListSellProducts = {
    id: number;
    sellProductId: number;
    productId: number;
    quantity: number;
    sellingPrice: number;
    createdAt: string;
    updatedAt: string;
}

type ProductDetail = {
    uuid: string;
    name: string;
    unit: string;
    totalStock: number;
    volume: string;
    sellingPrice: string | number;
    description: string;
    thumbnail: string;
    productFinances: ProductFinanceDetail[];
    restockProducts: RestockProductDetail[];
    listSellProducts: ListSellProducts[];
};

const formatIndonesianDate = (dateValue?: string) => {
    if (!dateValue || dateValue === "-") return "-";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
};

export default function PengadaanDetailPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [viewMode, setViewMode] = useState<ViewMode>("penjualan");
    const [detailProduct, setDetailProduct] = useState<ProductDetail | null>(null)
    const params = useParams<{ uuid: string }>()

    // finances
    const firstFinance = detailProduct?.productFinances?.[0]
    const totalIncome = Number(firstFinance?.totalIncome ?? 0)
    const totalSpending = Number(firstFinance?.totalSpending ?? 0)
    const totalProfit = Math.max(totalIncome - totalSpending, 0)
    const totalProfitPercentage = Math.max(Math.floor((totalProfit / totalSpending) * 100), 0) 

    // selling
    const selling = detailProduct?.listSellProducts
    const totalSelling = Number(selling?.length) ?? 0
    const firstSelling = totalSelling > 0 ? formatIndonesianDate(selling?.[0]?.createdAt) : "-"
    const lastSelling = totalSelling > 0 ? formatIndonesianDate(selling?.[totalSelling-1]?.createdAt) : "-"
    
    // restock
    const restock = detailProduct?.restockProducts
    const firstRestock = formatIndonesianDate(restock?.[0]?.createdAt)
    const totalRestock = restock?.length ?? 0
    const lastRestock = totalRestock > 0
        ? formatIndonesianDate(restock?.[totalRestock - 1]?.createdAt)
        : "-"

    const isActive = (mode: ViewMode) => viewMode === mode;

    async function getDetailProduct() {
        try {
            setIsLoading(true)

            const uuid = params.uuid
            if (!uuid) return

            const response = await fetch(`/api/product/${uuid}`)
            const result = await response.json()

            if(!result.status) {
                toast.error(result.message)
                return
            }

            setDetailProduct(result.data)
            
        } catch (error) {
            console.error(error)
            toast.error("Terjadi masalah pada sisi client. Coba lagi nanti")
            return
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(()=> {
        getDetailProduct()
    }, [params.uuid])
    
    return (
        <div className="w-full max-w-full">
            {/* edit */}
            <div className="flex justify-end mb-3 gap-2">
                {/* restock */}
                <RestockButton/>
                
                {/* edit */}
                <EditProduct/>

                {/* hapus */}
                <DeleteProduct/>
            </div>
            
            {/* image */}
            <div className="mb-5 w-full overflow-hidden rounded-lg">
                <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                    <Image
                        src={placeholderImage}
                        alt="placeholder"
                        fill
                        style={{ objectFit: 'cover' }} // Agar gambar tidak terdistorsi/gepeng
                    />
                </div>
            </div>

            {/* details */}
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Detail Produk</h3>
            <div className="w-full max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                <Table className="table-fixed">
                    <TableBody>
                        <TableRow>
                            <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                Nama
                            </TableCell>
                            <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                {isLoading ? "Memuat..." : detailProduct?.name ?? "-"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                Unit
                            </TableCell>
                            <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                {isLoading ? "Memuat..." : detailProduct?.unit ?? "-"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                Total Stok Tersisa
                            </TableCell>
                            <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                {isLoading ? "Memuat..." : Number(detailProduct?.totalStock).toLocaleString('id-ID') ?? "-"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                Volume
                            </TableCell>
                            <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                {isLoading ? "Memuat..." : detailProduct?.volume ?? "-"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                Harga Jual
                            </TableCell>
                            <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                {isLoading ? 
                                    "Memuat..." : 
                                    Number(detailProduct?.sellingPrice).toLocaleString('id-ID', {
                                        style: "currency",
                                        currency: "IDR"
                                    })
                                ?? "-"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                Deskripsi
                            </TableCell>
                            <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                {isLoading ? "Memuat..." : detailProduct?.description ?? "-"}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* details */}
            <h3 className="text-xl font-semibold text-gray-900 mb-1 mt-5">Detail Keuangan</h3>
            <div className="w-full max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                <Table className="table-fixed">
                    <TableBody>
                        <TableRow>
                            <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                Total penjualan
                            </TableCell>
                            <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                {isLoading
                                    ? "Memuat..."
                                    : totalIncome.toLocaleString('id-ID', {
                                        style: "currency",
                                        currency: "IDR"
                                    })}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                Total pengadaan
                            </TableCell>
                            <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                {isLoading
                                    ? "Memuat..."
                                    : totalSpending.toLocaleString('id-ID', {
                                        style: "currency",
                                        currency: "IDR"
                                    })}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                Total keuntungan
                            </TableCell>
                            <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                {isLoading
                                    ? "Memuat..."
                                    : totalProfit.toLocaleString('id-ID', {
                                        style: "currency",
                                        currency: "IDR"
                                    })}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                Presentase total keuntungan
                            </TableCell>
                            <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                {isLoading
                                    ? "Memuat..."
                                    : totalProfitPercentage + "%"}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* switch button */}
            <div className="mt-4 flex gap-2">
                <button
                    type="button"
                    onClick={() => setViewMode("penjualan")}
                    aria-pressed={isActive("penjualan")}
                    className={`cursor-pointer px-5 py-2 rounded-md text-sm transition-colors ${
                        isActive("penjualan")
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-orange-500 hover:text-white"
                    }`}
                >
                    Penjualan
                </button>
                <button
                    type="button"
                    onClick={() => setViewMode("pengadaan")}
                    aria-pressed={isActive("pengadaan")}
                    className={`cursor-pointer px-5 py-2 rounded-md text-sm transition-colors ${
                        isActive("pengadaan")
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-orange-500 hover:text-white"
                    }`}
                >
                    Pengadaan
                </button>
                <button
                    type="button"
                    onClick={() => setViewMode("semua")}
                    aria-pressed={isActive("semua")}
                    className={`cursor-pointer px-5 py-2 rounded-md text-sm transition-colors ${
                        isActive("semua")
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-orange-500 hover:text-white"
                    }`}
                >
                    Semua
                </button>
            </div>

            {/* penjualan */}
            {(viewMode === "semua" || viewMode === "penjualan") && (
            <div>
                {/* detail penjualan */}
                <h3 className="text-xl font-semibold text-gray-900 mb-1 mt-5">Detail Penjualan</h3>
                <div className="w-full max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <Table className="table-fixed">
                        <TableBody>
                            <TableRow>
                                <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                    Penjualan pertama
                                </TableCell>
                                <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                    {firstSelling}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                    Penjualan terakhir
                                </TableCell>
                                <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                    {lastSelling}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                    Total penjualan
                                </TableCell>
                                <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                    {Number(totalSelling).toLocaleString('id-ID')}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                {/* riwayat penjualan */}
                <h3 className="text-xl font-semibold text-gray-900 mb-1 mt-5">Riwayat Penjualan</h3>
                <div className="w-full max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold">Tanggal</TableHead>
                                <TableHead className="font-semibold">Jumlah</TableHead>
                                <TableHead className="font-semibold">Harga Jual (Satuan)</TableHead>
                                <TableHead className="font-semibold">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selling?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="align-top">
                                        {formatIndonesianDate(item.createdAt)}
                                    </TableCell>
                                    <TableCell className="align-top">
                                        {Number(item.quantity).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell className="align-top">
                                        {Number(item.sellingPrice).toLocaleString('id-ID', {
                                            style: "currency",
                                            currency: "IDR"
                                        })}
                                    </TableCell>
                                    <TableCell className="align-top">
                                        {(Number(item.quantity) * Number(item.sellingPrice)).toLocaleString('id-ID', {
                                            style: "currency",
                                            currency: "IDR"
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            )}

            {/* pengadaan */}
            {(viewMode === "semua" || viewMode === "pengadaan") && (
            <div>
                {/* detail pengadaan */}
                <h3 className="text-xl font-semibold text-gray-900 mb-1 mt-5">Detail Pengadaan</h3>
                <div className="w-full max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <Table className="table-fixed">
                        <TableBody>
                            <TableRow>
                                <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                    Pengadaan pertama
                                </TableCell>
                                <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                    {firstRestock}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                    Pengadaan terakhir
                                </TableCell>
                                <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                    {lastRestock}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                    Total restock
                                </TableCell>
                                <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                    {totalRestock}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                {/* riwayat pengadaan */}
                <h3 className="text-xl font-semibold text-gray-900 mb-1 mt-5">Riwayat Pengadaan</h3>
                <div className="w-full max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold">Tanggal</TableHead>
                                <TableHead className="font-semibold">Jumlah stok</TableHead>
                                <TableHead className="font-semibold">Stok sisa</TableHead>
                                <TableHead className="font-semibold">Harga satuan</TableHead>
                                <TableHead className="font-semibold">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {restock?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="align-top">
                                        {formatIndonesianDate(item.createdAt)}
                                    </TableCell>
                                    <TableCell className="align-top">
                                        {Number(item.quantity).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell className="align-top">
                                        {Number(item.remainingStock).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell className="align-top">
                                        {Number(item.purchasePrice).toLocaleString('id-ID', {
                                            style: "currency",
                                            currency: "IDR"
                                        })}
                                    </TableCell>
                                    <TableCell className="align-top">
                                        {(Number(item.quantity) * Number(item.purchasePrice)).toLocaleString('id-ID', {
                                            style: "currency",
                                            currency: "IDR"
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            )}
        </div>
    )
}
