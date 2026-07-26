'use client'

import Image from "next/image";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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

export default function PengadaanDetailPage() {
    return (
        <div className="w-full max-w-full">
            {/* edit */}
            <div className="flex justify-end mb-3">
                <button onClick={() => {}} className="cursor-pointer w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm p-2.5">
                    <HugeiconsIcon icon={Edit02Icon} />
                </button>
            </div>
            
            {/* image */}
            <div className="mb-5 w-full max-w-50 overflow-hidden rounded-lg">
                <Image
                    src={"https://placehold.co/400"}
                    width={200}
                    height={200}
                    alt="placeholder"
                    loading="lazy"
                    className="h-auto w-full object-cover"
                />
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
            <div className="flex gap-2 mt-4">
                <button className="cursor-pointer px-5 py-2 bg-orange-500 text-white rounded-md  transition-colors text-sm">
                    Detail Penjualan
                </button>
                <button className="cursor-pointer px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-orange-500 hover:text-white transition-colors text-sm">
                    Detail Pengadaan
                </button>
            </div>

            {/* penjualan */}
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

            {/* pengadaan */}
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
        </div>
    )
}
