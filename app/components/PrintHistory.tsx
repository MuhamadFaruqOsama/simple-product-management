'use client'

import { PrinterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type PrintHistoryProps = {
    onPrint: () => void;
};

export function PrintHistory({ onPrint }: PrintHistoryProps) {
    return (
        <button type="button" onClick={onPrint} className="text-white bg-white/10 p-2 rounded-md hover:bg-white/20">
            <HugeiconsIcon icon={PrinterIcon} size={16} />
        </button>
    )
}
