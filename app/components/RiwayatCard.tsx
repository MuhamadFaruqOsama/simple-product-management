import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function RiwayatCard() {
    return (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="flex justify-between items-center px-3 py-2 bg-blue-500">
                <div className="flex gap-2">
                    <h3 className="font-bold text-white">#2312</h3>
                    <small className="bg-green-100 h-fit px-2 py-0.5 rounded-lg text-green-800 font-medium">restock</small>
                </div>
                <button className="p-1 rounded-md hover:bg-white/10 text-white transition-all duration-300">
                    <HugeiconsIcon icon={MoreVerticalIcon} />
                </button>
            </div>
            <div className="pt-2 border-t px-3 py-2 space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-600 ">
                    <div className="text-start">Tanggal</div>
                    <div className="text-start">26 May 2026</div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 ">
                    <div className="text-start">Jumlah</div>
                    <div className="text-start">500</div>
                </div>
            </div>
        </div>
    )
}