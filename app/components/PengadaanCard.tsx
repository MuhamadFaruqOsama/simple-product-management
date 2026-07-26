import Image from "next/image";
import Link from "next/link";

export function PengadaanCard() {
    return (
        <Link href={`pengadaan/dfalkfjdkaldjflkafdbasfdl`}>
            <div className="bg-white p-2 rounded-lg shadow-sm">
                {/* image */}
                <Image
                    src={"https://placehold.co/400"}
                    width={400}
                    height={400}
                    alt="placeholder"
                />
            
                {/* details */}
                <div className="flex flex-col gap-2">
                    <div className="text-md line-clamp-1 text-start">Nama Produk</div>
                    <div className="flex justify-between items-end">
                        <div className="text-sm text-gray-600">Stok</div>
                        <div className="">90</div>
                    </div>
                </div>
            </div>
        </Link>
    )
}