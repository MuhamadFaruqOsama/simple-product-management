'use client'

import { HugeiconsIcon } from "@hugeicons/react"
import { TabbarLink } from "./TabbarLink"
import {
    Clock02Icon,
    Home07Icon,
    PackageReceiveIcon,
} from "@hugeicons/core-free-icons"

import { usePathname } from "next/navigation"
import clsx from "clsx"

const tabs = [
    {
        name: 'Beranda',
        href: '/',
        icon: Home07Icon
    },
    {
        name: 'Produk',
        href: '/produk',
        icon: PackageReceiveIcon
    },
    {
        name: 'Riwayat',
        href: '/riwayat',
        icon: Clock02Icon
    },
]

export function Tabbar() {
    const pathname = usePathname()

    return (
        <nav className="flex justify-around gap-2 px-2 items-center fixed w-full bottom-0 left-0 border-t border-gray-200 py-4 bg-white">
            {
                tabs.map((tab, index) => {
                    const isActive = pathname === tab.href

                    return (
                        <TabbarLink
                            key={index}
                            href={tab.href}
                            className={clsx(
                                "flex flex-col items-center transition-colors hover:text-blue-500",
                                isActive
                                    ? "text-blue-500 font-bold"
                                    : "text-gray-400"
                            )}
                        >
                            <HugeiconsIcon icon={tab.icon} />
                            <div className="text-sm line-clamp-1">
                                {tab.name}
                            </div>
                        </TabbarLink>
                    )
                })
            }
        </nav>
    )
}