'use client';

import { UserCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {

    const pathname = usePathname();
    const splitedPathname = pathname.split('/')[1];
    const page = splitedPathname === '' ? 
                'beranda' : 
                splitedPathname;
    
    return (
        <div className="px-2 py-3 flex justify-between items-center bg-white border-b border-gray-200">
            <div className="text-gray-800 font-medium text-xl capitalize">{page}</div>
            <Link href={`/profile`}>
                <HugeiconsIcon icon={UserCircle02Icon} size={30} className="text-gray-500"/>
            </Link>
        </div>
    )
}