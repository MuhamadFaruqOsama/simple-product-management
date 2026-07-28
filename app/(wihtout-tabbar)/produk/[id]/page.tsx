'use client'

import { useState } from "react";
import Image from "next/image";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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

export default function PengadaanDetailPage() {
    const [viewMode, setViewMode] = useState<ViewMode>("penjualan");

    const isActive = (mode: ViewMode) => viewMode === mode;

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
                        {detailProductData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                    {item.title}
                                </TableCell>
                                <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                    {item.value}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* details */}
            <h3 className="text-xl font-semibold text-gray-900 mb-1 mt-5">Detail Keuangan</h3>
            <div className="w-full max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                <Table className="table-fixed">
                    <TableBody>
                        {detailKeuanganData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                    {item.title}
                                </TableCell>
                                <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                    {item.value}
                                </TableCell>
                            </TableRow>
                        ))}
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
                    Detail Penjualan
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
                    Detail Pengadaan
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
                            {detailPenjualanData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                        {item.title}
                                    </TableCell>
                                    <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                        {item.value}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* riwayat penjualan */}
                <h3 className="text-xl font-semibold text-gray-900 mb-1 mt-5">Riwayat Penjualan</h3>
                <div className="w-full max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <Table className="table-fixed">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/4 whitespace-normal wrap-break-word font-semibold">Tanggal</TableHead>
                                <TableHead className="w-1/4 whitespace-normal wrap-break-word font-semibold">Jumlah</TableHead>
                                <TableHead className="w-1/4 whitespace-normal wrap-break-word font-semibold">Harga Jual (Satuan)</TableHead>
                                <TableHead className="w-1/4 whitespace-normal wrap-break-word font-semibold">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {riwayatPenjualanData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="whitespace-normal wrap-break-word align-top">
                                        {item.tanggal}
                                    </TableCell>
                                    <TableCell className="whitespace-normal wrap-break-word align-top">
                                        {item.jumlah}
                                    </TableCell>
                                    <TableCell className="whitespace-normal wrap-break-word align-top">
                                        {item.hargaJualSatuan}
                                    </TableCell>
                                    <TableCell className="whitespace-normal wrap-break-word align-top">
                                        {item.total}
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
                            {detailPengadaanData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="w-1/3 p-3 align-top font-medium whitespace-normal wrap-break-word">
                                        {item.title}
                                    </TableCell>
                                    <TableCell className="w-2/3 p-3 align-top text-right whitespace-normal wrap-break-word">
                                        {item.value}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* riwayat pengadaan */}
                <h3 className="text-xl font-semibold text-gray-900 mb-1 mt-5">Riwayat Pengadaan</h3>
                <div className="w-full max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <Table className="table-fixed">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/4 whitespace-normal wrap-break-word font-semibold">Tanggal</TableHead>
                                <TableHead className="w-1/4 whitespace-normal wrap-break-word font-semibold">Jumlah</TableHead>
                                <TableHead className="w-1/4 whitespace-normal wrap-break-word font-semibold">Harga Beli (Satuan)</TableHead>
                                <TableHead className="w-1/4 whitespace-normal wrap-break-word font-semibold">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {riwayatPengadaanData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="whitespace-normal wrap-break-word align-top">
                                        {item.tanggal}
                                    </TableCell>
                                    <TableCell className="whitespace-normal wrap-break-word align-top">
                                        {item.jumlah}
                                    </TableCell>
                                    <TableCell className="whitespace-normal wrap-break-word align-top">
                                        {item.hargaBeliSatuan}
                                    </TableCell>
                                    <TableCell className="whitespace-normal wrap-break-word align-top">
                                        {item.total}
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
