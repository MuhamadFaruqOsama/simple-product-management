import { ArrowDown02Icon, ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type SalesPurchasesCardProps = {
    pengeluaran: number;
    pendapatan: number;
}

export function SalesPurchasesCard({ pengeluaran, pendapatan }: SalesPurchasesCardProps) {
    return (
        <div className="p-3 border border-gray-200 rounded-lg bg-linear-to-l from-blue-700 to-sky-500 relative overflow-hidden">
            <div className="grid grid-cols-2">
                <div className="flex items-center gap-2">
                    <div className="text-green-500">
                        <HugeiconsIcon icon={ArrowUp02Icon} />
                    </div>
                    <div>
                        <div className="text-gray-100 text-xs">Pengeluaran</div>
                        <div className="font-medium text-white text-sm mt-1">Rp.{pengeluaran.toLocaleString('id-ID')}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-red-500">
                        <HugeiconsIcon icon={ArrowDown02Icon} />
                    </div>
                    <div>
                        <div className="text-gray-100 text-xs">Pendapatan</div>
                        <div className="font-medium text-white text-sm mt-1">Rp.{pendapatan.toLocaleString('id-ID')}</div>
                    </div>
                </div>
            </div>

            
            {/* bubble */}
            <div className="-z-20">
                <div className="w-20 h-20 bg-linear-to-tr from-orange-500/20 to-yellow-500/20 rounded-full absolute -top-10 -right-2"></div>
            </div>
        </div>
    )
}