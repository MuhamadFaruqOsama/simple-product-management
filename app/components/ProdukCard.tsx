import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

const placeholderImage =
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Cpath d='M120 250l48-52 38 38 28-30 46 44' fill='none' stroke='%239ca3af' stroke-width='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='160' cy='155' r='18' fill='%239ca3af'/%3E%3C/svg%3E";

export function PengadaanCard() {
    return (
        <>
        <Dialog>
            <DialogTrigger>
                {/*  */}
                <div className="bg-white p-2 rounded-lg shadow-sm cursor-pointer">
                    {/* image */}
                    {/* <Image
                        src={placeholderImage}
                        width={400}
                        height={400}
                        alt="placeholder"
                    /> */}

                    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                        <Image
                            src={placeholderImage}
                            alt="placeholder"
                            fill
                            style={{ objectFit: 'cover' }} // Agar gambar tidak terdistorsi/gepeng
                        />
                    </div>
                
                    {/* details */}
                    <div className="flex flex-col gap-1 mt-2">
                        <div className="text-md line-clamp-1 text-start">Nama Produk</div>
                        <div className="flex justify-between items-end">
                            <div className="text-sm text-gray-600">Stok</div>
                            <div className="">90</div>
                        </div>
                    </div>
                    {/* detail */}
                    <Link href={`produk/dfalkfjdkaldjflkafdbasfdl`}>
                        <div className="w-full text-center flex items-center gap-1 justify-center p-2 rounded-md text-sm mt-3 border border-gray-300 hover:bg-blue-500 transition-all duration-300 hover:text-white cursor-pointer">
                            Detail
                            <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={2}/>
                        </div>
                    </Link>
                </div>
                {/*  */}
            </DialogTrigger>
            <DialogContent className="max-h-screen p-3">
                <DialogHeader>
                    <DialogTitle>Tambah Penjualan Produk</DialogTitle>
                </DialogHeader>
                <div className="py-2 space-y-2">
                    <Input placeholder="jumlah" type="number" required/>
                </div>
                <DialogFooter>
                    <button className="w-full h-full bg-orange-500 py-3 rounded-md text-white">
                        Tambah Penjualan
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}
