import { PrinterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function PrintHistory() {
    return (
        <button className="text-white bg-white/10 p-2 rounded-md hover:bg-white/20">
            <HugeiconsIcon icon={PrinterIcon} size={16} />
        </button>
    )
}