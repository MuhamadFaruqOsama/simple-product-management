import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

export function PengadaanCard() {
    return (
        <div className="bg-white p-2 rounded-lg shadow-sm cursor-pointer">
            {/* image */}
            <Image
                src={"https://placehold.co/400"}
                width={400}
                height={400}
                alt="placeholder"
            />
        
            {/* details */}
            <div className="flex flex-col gap-1">
                <div className="text-md line-clamp-1 text-start">Nama Produk</div>
                <div className="flex justify-between items-end">
                    <div className="text-sm text-gray-600">Stok</div>
                    <div className="">90</div>
                </div>
            </div>

            {/* detail */}
            <Link href={`pengadaan/dfalkfjdkaldjflkafdbasfdl`}>
                <button className="w-full text-center flex items-center gap-1 justify-center p-2 rounded-md text-sm mt-3 border border-gray-300 hover:bg-blue-500 transition-all duration-300 hover:text-white cursor-pointer">
                    Detail 
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={2}/>
                </button>
            </Link>
        </div>
    )
}