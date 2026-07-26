'use client'

import { ArrowBigLeftDashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname } from "next/navigation";

export function HeaderWithBackButton() {
    const handleClick = () => {
        window.history.back();
    }

    const pathname = usePathname();
    const splitedPathname = pathname.split('/')[1];
    const page = splitedPathname === '' ? 
                'beranda' : 
                splitedPathname;
    
    return (
        <div className="flex items-center justify-start gap-4">
            {/* button */}
            <button onClick={handleClick} className="cursor-pointer w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                <HugeiconsIcon icon={ArrowBigLeftDashIcon} />
            </button>

            {/* title */}
            <div className="text-gray-800 font-medium text-xl capitalize">Detail {page}</div>
        </div>
    )
}