import { ChartAnalysisIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type CardProps = {
    title: string;
    value: string;
}

export default function Card({title, value}: CardProps) {
    return (
        <div className="p-3 border border-gray-200 rounded-lg bg-linear-to-l from-blue-700 to-sky-500 relative overflow-hidden">
            <div className="text-gray-100 text-sm">{title}</div>
            <div className="font-semibold text-white text-2xl mt-10">{value}</div>
            <div className="absolute bottom-0 left-0 font-extrabold text-white/10">
                <HugeiconsIcon icon={ChartAnalysisIcon} size={100} strokeWidth={2}/>
            </div>

            {/* bubble */}
            <div className="-z-20">
                <div className="w-20 h-20 bg-linear-to-tr from-orange-500/20 to-yellow-500/20 rounded-full absolute -bottom-10 -right-2"></div>
                <div className="w-14 h-14 bg-linear-to-tr from-orange-500 to-yellow-500 rounded-full absolute -top-4 -right-2"></div>
            </div>
        </div>
    )
}